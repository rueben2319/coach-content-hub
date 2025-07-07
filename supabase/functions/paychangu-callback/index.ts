
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper logging function
const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [PAYCHANGU-CALLBACK] ${step}${detailsStr}`);
};

// Track processed callbacks to prevent duplicates
const processedCallbacks = new Set<string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const callbackId = `${Date.now()}_${Math.random()}`;
  logStep('Callback received', { callbackId, url: req.url });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const txRef = url.searchParams.get('tx_ref');
    
    if (!txRef) {
      logStep('ERROR: Missing tx_ref parameter');
      throw new Error('Missing transaction reference');
    }

    // Check for duplicate processing
    if (processedCallbacks.has(txRef)) {
      logStep('Duplicate callback ignored', { txRef });
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Callback already processed',
        tx_ref: txRef
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    logStep('Processing callback', { txRef });

    // Verify payment with PayChangu
    const payChanguResponse = await fetch(`https://api.paychangu.com/verify-payment/${txRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYCHANGU_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!payChanguResponse.ok) {
      const errorText = await payChanguResponse.text();
      logStep('PayChangu verification failed', { status: payChanguResponse.status, error: errorText });
      throw new Error(`Payment verification failed: ${errorText}`);
    }

    const payChanguData = await payChanguResponse.json();
    logStep('PayChangu verification response', payChanguData);

    const paymentStatus = payChanguData.data?.status;
    
    if (paymentStatus === 'success' || paymentStatus === 'completed') {
      processedCallbacks.add(txRef);
      return await handleSuccessfulPayment(supabaseClient, txRef, payChanguData);
    } else if (paymentStatus === 'failed') {
      processedCallbacks.add(txRef);
      return await handleFailedPayment(supabaseClient, txRef, payChanguData);
    } else {
      logStep('Payment pending', { status: paymentStatus });
      await updateBillingStatus(supabaseClient, txRef, 'pending');
      
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Payment still pending',
        status: paymentStatus,
        tx_ref: txRef
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

  } catch (error) {
    logStep('ERROR in callback processing', { error: error.message });
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function handleSuccessfulPayment(supabaseClient: any, txRef: string, payChanguData: any) {
  logStep('Processing successful payment', { txRef });

  try {
    // Find billing record by paychangu_reference
    const { data: billing, error: billingError } = await supabaseClient
      .from('billing_history')
      .select(`
        *,
        coach_subscriptions!inner(*)
      `)
      .eq('paychangu_reference', txRef)
      .single();

    if (billingError || !billing) {
      logStep('Billing record not found by reference, trying subscription ID extraction', { txRef });
      
      // Extract subscription ID from tx_ref pattern: sub_{uuid}_{timestamp}
      const subscriptionIdMatch = txRef.match(/^sub_([a-f0-9-]+)_/);
      if (!subscriptionIdMatch) {
        throw new Error('Cannot extract subscription ID from tx_ref');
      }

      const subscriptionId = subscriptionIdMatch[1];
      logStep('Extracted subscription ID', { subscriptionId });

      // Find billing by subscription ID and pending status
      const { data: billingBySub, error: billingBySubError } = await supabaseClient
        .from('billing_history')
        .select(`
          *,
          coach_subscriptions!inner(*)
        `)
        .eq('subscription_id', subscriptionId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (billingBySubError || !billingBySub) {
        logStep('No pending billing found, creating new record');
        
        // Get subscription details
        const { data: subscription, error: subError } = await supabaseClient
          .from('coach_subscriptions')
          .select('*')
          .eq('id', subscriptionId)
          .single();

        if (subError || !subscription) {
          throw new Error('Subscription not found');
        }

        // Create billing record
        const billingPeriodStart = new Date();
        const billingPeriodEnd = new Date(billingPeriodStart);
        if (subscription.billing_cycle === 'yearly') {
          billingPeriodEnd.setFullYear(billingPeriodEnd.getFullYear() + 1);
        } else {
          billingPeriodEnd.setMonth(billingPeriodEnd.getMonth() + 1);
        }

        const { data: newBilling, error: createBillingError } = await supabaseClient
          .from('billing_history')
          .insert({
            subscription_id: subscription.id,
            coach_id: subscription.coach_id,
            amount: subscription.price,
            currency: subscription.currency,
            status: 'paid',
            paychangu_reference: txRef,
            paid_at: new Date().toISOString(),
            billing_period_start: billingPeriodStart.toISOString(),
            billing_period_end: billingPeriodEnd.toISOString(),
            invoice_sent: true,
            receipt_sent: true
          })
          .select()
          .single();

        if (createBillingError) {
          throw new Error('Failed to create billing record');
        }

        billing = { ...newBilling, coach_subscriptions: subscription };
      } else {
        // Update existing billing record
        await supabaseClient
          .from('billing_history')
          .update({ 
            paychangu_reference: txRef,
            status: 'paid',
            paid_at: new Date().toISOString(),
            invoice_sent: true,
            receipt_sent: true
          })
          .eq('id', billingBySub.id);

        billing = billingBySub;
      }
    } else {
      // Update existing billing record
      await supabaseClient
        .from('billing_history')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString(),
          invoice_sent: true,
          receipt_sent: true
        })
        .eq('id', billing.id);
    }

    const subscription = billing.coach_subscriptions;
    logStep('Found subscription', { subscriptionId: subscription.id, tier: subscription.tier });

    // Calculate new expiry date
    const now = new Date();
    const expiryDate = new Date(now);
    
    if (subscription.billing_cycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Update subscription status
    const { error: updateError } = await supabaseClient
      .from('coach_subscriptions')
      .update({
        status: 'active',
        expires_at: expiryDate.toISOString(),
        next_billing_date: expiryDate.toISOString(),
        updated_at: new Date().toISOString(),
        is_trial: false // End any trial period
      })
      .eq('id', subscription.id);

    if (updateError) {
      logStep('ERROR updating subscription', { error: updateError });
      throw updateError;
    }

    // Log successful payment
    await supabaseClient
      .from('subscription_changes')
      .insert({
        subscription_id: subscription.id,
        change_type: 'payment_completed',
        to_tier: subscription.tier,
        to_price: billing.amount,
        effective_date: new Date().toISOString(),
        metadata: {
          tx_ref: txRef,
          payment_method: payChanguData.data?.payment_method,
          billing_period_start: billing.billing_period_start,
          billing_period_end: billing.billing_period_end
        }
      });

    logStep('Payment processed successfully', { 
      subscriptionId: subscription.id,
      billingId: billing.id,
      expiresAt: expiryDate.toISOString()
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Payment completed and subscription activated',
      subscription_id: subscription.id,
      billing_id: billing.id,
      expires_at: expiryDate.toISOString()
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });

  } catch (error) {
    logStep('ERROR in handleSuccessfulPayment', { error: error.message });
    throw error;
  }
}

async function handleFailedPayment(supabaseClient: any, txRef: string, payChanguData: any) {
  logStep('Processing failed payment', { txRef });

  try {
    // Find billing record
    const { data: billing, error: billingError } = await supabaseClient
      .from('billing_history')
      .select('*')
      .eq('paychangu_reference', txRef)
      .maybeSingle();

    if (billingError) {
      logStep('Error finding billing record', { error: billingError });
      throw billingError;
    }

    if (!billing) {
      logStep('No billing record found for failed payment');
      return new Response(JSON.stringify({ 
        success: false,
        message: 'No billing record found for failed payment',
        tx_ref: txRef
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 404,
      });
    }

    const retryCount = (billing.retry_count || 0) + 1;
    const maxRetries = 3;

    // Update billing record
    await supabaseClient
      .from('billing_history')
      .update({
        status: 'failed',
        retry_count: retryCount,
        last_retry_at: new Date().toISOString(),
      })
      .eq('id', billing.id);

    // Create notification for failed payment
    await supabaseClient
      .from('subscription_notifications')
      .insert({
        subscription_id: billing.subscription_id,
        notification_type: 'payment_failed',
        metadata: {
          tx_ref: txRef,
          retry_count: retryCount,
          max_retries: maxRetries,
          failure_reason: payChanguData.message || 'Payment failed',
          next_retry_available: retryCount < maxRetries,
          billing_id: billing.id
        }
      });

    logStep('Payment failure processed', { 
      retryCount, 
      maxRetries,
      canRetry: retryCount < maxRetries
    });

    return new Response(JSON.stringify({ 
      success: false,
      message: `Payment failed (attempt ${retryCount}/${maxRetries})`,
      can_retry: retryCount < maxRetries,
      retry_count: retryCount,
      tx_ref: txRef
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });

  } catch (error) {
    logStep('ERROR in handleFailedPayment', { error: error.message });
    throw error;
  }
}

async function updateBillingStatus(supabaseClient: any, txRef: string, status: string) {
  try {
    await supabaseClient
      .from('billing_history')
      .update({
        status,
        last_retry_at: new Date().toISOString(),
      })
      .eq('paychangu_reference', txRef);
    
    logStep('Billing status updated', { txRef, status });
  } catch (error) {
    logStep('ERROR updating billing status', { error: error.message });
  }
}
