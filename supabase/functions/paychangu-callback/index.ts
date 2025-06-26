
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PayChangu callback received');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const txRef = url.searchParams.get('tx_ref');
    
    if (!txRef) {
      console.error('Missing tx_ref parameter');
      throw new Error('Missing transaction reference');
    }

    console.log('Processing callback for tx_ref:', txRef);

    // Verify payment with PayChangu
    const payChanguResponse = await fetch(`https://api.paychangu.com/verify-payment/${txRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYCHANGU_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    const payChanguData = await payChanguResponse.json();
    console.log('PayChangu verification response:', payChanguData);

    if (!payChanguResponse.ok) {
      console.error('PayChangu verification failed:', payChanguData);
      await handleFailedPayment(supabaseClient, txRef, payChanguData);
      throw new Error(`Payment verification failed: ${payChanguData.message || 'Unknown error'}`);
    }

    const paymentStatus = payChanguData.data?.status;
    
    if (paymentStatus === 'success' || paymentStatus === 'completed') {
      return await handleSuccessfulPayment(supabaseClient, txRef, payChanguData);
    } else if (paymentStatus === 'failed') {
      return await handleFailedPayment(supabaseClient, txRef, payChanguData);
    } else {
      console.log('Payment pending, status:', paymentStatus);
      await updateBillingStatus(supabaseClient, txRef, 'pending');
      
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Payment still pending',
          status: paymentStatus
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

  } catch (error) {
    console.error('Error in paychangu-callback function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function handleSuccessfulPayment(supabaseClient: any, txRef: string, payChanguData: any) {
  console.log('Payment confirmed, updating subscription and billing status');

  // First try to find billing record by paychangu_reference
  let { data: billing, error: billingError } = await supabaseClient
    .from('billing_history')
    .select('*, coach_subscriptions!inner(*)')
    .eq('paychangu_reference', txRef)
    .maybeSingle();

  // If not found by reference, try to find by subscription ID (extract from tx_ref if it follows pattern)
  if (!billing && txRef.startsWith('sub_')) {
    const subscriptionIdMatch = txRef.match(/^sub_([a-f0-9-]+)_/);
    if (subscriptionIdMatch) {
      const subscriptionId = subscriptionIdMatch[1];
      console.log('Trying to find billing by subscription ID:', subscriptionId);
      
      const { data: billingBySub, error: billingBySubError } = await supabaseClient
        .from('billing_history')
        .select('*, coach_subscriptions!inner(*)')
        .eq('subscription_id', subscriptionId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!billingBySubError && billingBySub) {
        billing = billingBySub;
        // Update the billing record with the correct paychangu_reference
        await supabaseClient
          .from('billing_history')
          .update({ paychangu_reference: txRef })
          .eq('id', billing.id);
      }
    }
  }

  if (billingError || !billing) {
    console.error('Billing record not found:', billingError);
    
    // Try to find any pending billing for this tx_ref pattern
    if (txRef.startsWith('sub_')) {
      const subscriptionIdMatch = txRef.match(/^sub_([a-f0-9-]+)_/);
      if (subscriptionIdMatch) {
        const subscriptionId = subscriptionIdMatch[1];
        
        // Find the subscription and create a billing record if needed
        const { data: subscription, error: subError } = await supabaseClient
          .from('coach_subscriptions')
          .select('*')
          .eq('id', subscriptionId)
          .single();

        if (!subError && subscription) {
          console.log('Found subscription, creating billing record');
          
          // Create billing record
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
              billing_period_start: new Date().toISOString(),
              billing_period_end: new Date(Date.now() + (subscription.billing_cycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
            })
            .select()
            .single();

          if (!createBillingError) {
            billing = { ...newBilling, coach_subscriptions: subscription };
          }
        }
      }
    }

    if (!billing) {
      throw new Error('Billing record not found and could not be created');
    }
  }

  const subscription = billing.coach_subscriptions;

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
    })
    .eq('id', subscription.id);

  if (updateError) {
    console.error('Error updating subscription:', updateError);
    throw updateError;
  }

  // Update billing record as paid
  const { error: billingUpdateError } = await supabaseClient
    .from('billing_history')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      invoice_sent: true,
      receipt_sent: true,
    })
    .eq('id', billing.id);

  if (billingUpdateError) {
    console.error('Error updating billing record:', billingUpdateError);
    throw billingUpdateError;
  }

  // Generate invoice and receipt data
  const invoiceData = {
    invoice_number: `INV-${billing.id.substring(0, 8)}-${Date.now()}`,
    amount: billing.amount,
    currency: billing.currency,
    subscription_tier: subscription.tier,
    billing_cycle: subscription.billing_cycle,
    paid_at: new Date().toISOString(),
    tx_ref: txRef,
  };

  console.log('Invoice/receipt generated:', invoiceData);

  // Log successful payment in subscription changes
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
        invoice_data: invoiceData,
      },
    });

  console.log('Subscription activated successfully:', subscription.id);

  return new Response(
    JSON.stringify({ 
      success: true,
      message: 'Payment completed and subscription activated',
      subscription_id: subscription.id,
      invoice_data: invoiceData,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

async function handleFailedPayment(supabaseClient: any, txRef: string, payChanguData: any) {
  console.log('Payment failed, updating billing and scheduling retry');

  // Find billing record
  const { data: billing, error: billingError } = await supabaseClient
    .from('billing_history')
    .select('*')
    .eq('paychangu_reference', txRef)
    .maybeSingle();

  if (billingError || !billing) {
    console.error('Billing record not found for failed payment:', billingError);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: 'Billing record not found for failed payment'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      }
    );
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
      },
    });

  console.log(`Payment failed (attempt ${retryCount}/${maxRetries})`);

  return new Response(
    JSON.stringify({ 
      success: false,
      message: `Payment failed (attempt ${retryCount}/${maxRetries})`,
      can_retry: retryCount < maxRetries,
      retry_count: retryCount,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

async function updateBillingStatus(supabaseClient: any, txRef: string, status: string) {
  await supabaseClient
    .from('billing_history')
    .update({
      status,
      last_retry_at: new Date().toISOString(),
    })
    .eq('paychangu_reference', txRef);
}
