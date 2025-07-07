
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateSubscriptionRequest {
  tier: string;
  billingCycle: 'monthly' | 'yearly';
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

    const { tier, billingCycle }: CreateSubscriptionRequest = await req.json();

    console.log(`Creating subscription for user ${user.id}, tier: ${tier}, cycle: ${billingCycle}`);

    // Define pricing based on tier and cycle
    const pricing = {
      basic: { monthly: 2000, yearly: 20000 }, // MWK
      pro: { monthly: 5000, yearly: 50000 },
      premium: { monthly: 10000, yearly: 100000 }
    };

    const price = pricing[tier]?.[billingCycle];
    if (!price) {
      throw new Error(`Invalid tier or billing cycle: ${tier}, ${billingCycle}`);
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabaseClient
      .from('coach_subscriptions')
      .select('*')
      .eq('coach_id', user.id)
      .in('status', ['active', 'trial'])
      .single();

    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }

    // Create new subscription
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('coach_subscriptions')
      .insert({
        coach_id: user.id,
        tier,
        billing_cycle: billingCycle,
        price,
        currency: 'MWK',
        status: 'inactive', // Will be activated after payment
        started_at: new Date().toISOString(),
        expires_at: null, // Will be set after payment
        next_billing_date: null,
        auto_renew: true
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw new Error('Failed to create subscription');
    }

    console.log('Subscription created:', subscription.id);

    // Generate unique transaction reference
    const txRef = `sub_${subscription.id}_${Date.now()}`;

    // Create billing record immediately
    const billingPeriodStart = new Date();
    const billingPeriodEnd = new Date(billingPeriodStart);
    if (billingCycle === 'yearly') {
      billingPeriodEnd.setFullYear(billingPeriodEnd.getFullYear() + 1);
    } else {
      billingPeriodEnd.setMonth(billingPeriodEnd.getMonth() + 1);
    }

    const { data: billing, error: billingError } = await supabaseClient
      .from('billing_history')
      .insert({
        subscription_id: subscription.id,
        coach_id: user.id,
        amount: price,
        currency: 'MWK',
        status: 'pending',
        billing_period_start: billingPeriodStart.toISOString(),
        billing_period_end: billingPeriodEnd.toISOString(),
        paychangu_reference: txRef,
        retry_count: 0
      })
      .select()
      .single();

    if (billingError) {
      console.error('Error creating billing record:', billingError);
      // Don't fail the whole process, but log the error
    }

    console.log('Billing record created:', billing?.id);

    // Get the origin from the request to build proper redirect URLs
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://awmszxrtommgxjnivddq.supabase.co';

    // Prepare PayChangu payment request
    const payChanguPayload = {
      tx_ref: txRef,
      amount: price,
      currency: 'MWK',
      customer: {
        email: user.email,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email,
      },
      customizations: {
        title: `${tier.toUpperCase()} Plan Subscription`,
        description: `${billingCycle} subscription for ${tier} plan`,
        logo: "https://your-logo-url.com/logo.png"
      },
      redirect_url: `${origin}/payment-success?tx_ref=${txRef}`,
      cancel_url: `${origin}/payment-failed?tx_ref=${txRef}&reason=Payment cancelled by user`,
    };

    console.log('PayChangu payload:', payChanguPayload);

    // Call PayChangu API
    const payChanguResponse = await fetch('https://api.paychangu.com/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYCHANGU_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payChanguPayload),
    });

    const payChanguData = await payChanguResponse.json();
    console.log('PayChangu response:', payChanguData);

    if (!payChanguResponse.ok) {
      console.error('PayChangu API error:', payChanguData);
      
      // Update billing record as failed
      if (billing) {
        await supabaseClient
          .from('billing_history')
          .update({ 
            status: 'failed',
            retry_count: 1
          })
          .eq('id', billing.id);
      }

      throw new Error(`Payment initiation failed: ${payChanguData.message || 'Unknown error'}`);
    }

    // Update subscription with PayChangu reference
    await supabaseClient
      .from('coach_subscriptions')
      .update({ paychangu_subscription_id: txRef })
      .eq('id', subscription.id);

    // Log subscription creation
    await supabaseClient
      .from('subscription_changes')
      .insert({
        subscription_id: subscription.id,
        change_type: 'subscription_created',
        to_tier: tier,
        to_price: price,
        effective_date: new Date().toISOString(),
        metadata: {
          billing_cycle: billingCycle,
          tx_ref: txRef
        }
      });

    return new Response(JSON.stringify({
      success: true,
      payment_url: payChanguData.data?.authorization_url || payChanguData.data?.link,
      tx_ref: txRef,
      subscription_id: subscription.id,
      billing_id: billing?.id,
      message: 'Subscription created and payment initiated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in create-subscription:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
