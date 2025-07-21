
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManageSubscriptionRequest {
  action: 'upgrade' | 'downgrade' | 'cancel' | 'reactivate' | 'update_payment';
  newTier?: string;
  newBillingCycle?: 'monthly' | 'yearly';
  cancellationReason?: string;
  effectiveDate?: 'immediate' | 'end_of_period';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, newTier, newBillingCycle, cancellationReason, effectiveDate }: ManageSubscriptionRequest = await req.json();

    console.log(`Managing subscription for user ${user.id}: ${action}`);

    // Get current subscription
    const { data: currentSubscription, error: subError } = await supabaseClient
      .from('coach_subscriptions')
      .select('*')
      .eq('coach_id', user.id)
      .in('status', ['active', 'trial'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) throw subError;
    if (!currentSubscription) {
      throw new Error('No active subscription found');
    }

    let result;
    
    switch (action) {
      case 'upgrade':
      case 'downgrade':
        result = await handlePlanChange(supabaseClient, currentSubscription, newTier!, newBillingCycle!, user.id, action);
        break;
      case 'cancel':
        result = await handleCancellation(supabaseClient, currentSubscription, cancellationReason!, effectiveDate!, user.id);
        break;
      case 'reactivate':
        result = await handleReactivation(supabaseClient, currentSubscription, user.id);
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in manage-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function handlePlanChange(
  supabase: any,
  currentSub: any,
  newTier: string,
  newBillingCycle: string,
  userId: string,
  action: string
) {
  // Get tier pricing (aligned with frontend subscription tiers)
  const tierPricing = {
    basic: { monthly: 10000, yearly: 100000 },
    premium: { monthly: 50000, yearly: 500000 },
    enterprise: { monthly: 100000, yearly: 1000000 },
  };

  const newPrice = tierPricing[newTier as keyof typeof tierPricing][newBillingCycle as 'monthly' | 'yearly'];
  const oldPrice = currentSub.price;

  // Calculate prorated amount if changing mid-cycle
  let proratedAmount = 0;
  if (!currentSub.is_trial) {
    const daysRemaining = Math.ceil((new Date(currentSub.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const totalDays = newBillingCycle === 'monthly' ? 30 : 365;
    proratedAmount = (newPrice - oldPrice) * (daysRemaining / totalDays);
  }

  // Update subscription
  const { error: updateError } = await supabase
    .from('coach_subscriptions')
    .update({
      tier: newTier,
      billing_cycle: newBillingCycle,
      price: newPrice,
      status: currentSub.is_trial ? 'trial' : 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentSub.id);

  if (updateError) throw updateError;

  // Log the change
  const { error: logError } = await supabase
    .from('subscription_changes')
    .insert({
      subscription_id: currentSub.id,
      change_type: action,
      from_tier: currentSub.tier,
      to_tier: newTier,
      from_price: oldPrice,
      to_price: newPrice,
      prorated_amount: proratedAmount,
      effective_date: new Date().toISOString(),
      metadata: { billing_cycle: newBillingCycle },
    });

  if (logError) throw logError;

  // Create notification
  const { error: notifError } = await supabase
    .from('subscription_notifications')
    .insert({
      subscription_id: currentSub.id,
      notification_type: `subscription_${action}d`,
      metadata: {
        from_tier: currentSub.tier,
        to_tier: newTier,
        prorated_amount: proratedAmount,
      },
    });

  if (notifError) throw notifError;

  return {
    success: true,
    message: `Subscription ${action}d successfully`,
    proratedAmount,
    newTier,
    newPrice,
  };
}

async function handleCancellation(
  supabase: any,
  currentSub: any,
  reason: string,
  effectiveDate: string,
  userId: string
) {
  const cancelDate = effectiveDate === 'immediate' ? new Date() : new Date(currentSub.expires_at);
  
  // Update subscription
  const { error: updateError } = await supabase
    .from('coach_subscriptions')
    .update({
      status: effectiveDate === 'immediate' ? 'inactive' : 'active',
      auto_renew: false,
      cancellation_reason: reason,
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentSub.id);

  if (updateError) throw updateError;

  // Log the cancellation
  const { error: logError } = await supabase
    .from('subscription_changes')
    .insert({
      subscription_id: currentSub.id,
      change_type: 'cancel',
      from_tier: currentSub.tier,
      effective_date: cancelDate.toISOString(),
      metadata: { 
        reason,
        effective_date: effectiveDate,
      },
    });

  if (logError) throw logError;

  // Create notification
  const { error: notifError } = await supabase
    .from('subscription_notifications')
    .insert({
      subscription_id: currentSub.id,
      notification_type: 'cancellation_confirmed',
      metadata: {
        reason,
        effective_date: effectiveDate,
        cancel_date: cancelDate.toISOString(),
      },
    });

  if (notifError) throw notifError;

  return {
    success: true,
    message: effectiveDate === 'immediate' 
      ? 'Subscription canceled immediately' 
      : `Subscription will end on ${cancelDate.toLocaleDateString()}`,
    effectiveDate: cancelDate,
  };
}

async function handleReactivation(supabase: any, currentSub: any, userId: string) {
  // Reactivate subscription
  const { error: updateError } = await supabase
    .from('coach_subscriptions')
    .update({
      status: 'active',
      auto_renew: true,
      cancellation_reason: null,
      canceled_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentSub.id);

  if (updateError) throw updateError;

  // Log the reactivation
  const { error: logError } = await supabase
    .from('subscription_changes')
    .insert({
      subscription_id: currentSub.id,
      change_type: 'reactivate',
      to_tier: currentSub.tier,
      effective_date: new Date().toISOString(),
    });

  if (logError) throw logError;

  return {
    success: true,
    message: 'Subscription reactivated successfully',
  };
}

serve(handler);
