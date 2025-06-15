
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RetryPaymentRequest {
  billing_id: string;
  payment_method?: 'mobile_money' | 'card' | 'bank_transfer';
  phone_number?: string;
  email?: string;
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

    const { billing_id, payment_method, phone_number, email }: RetryPaymentRequest = await req.json();

    console.log(`Retrying payment for user ${user.id}, billing ${billing_id}`);

    // Get billing record and validate ownership
    const { data: billing, error: billingError } = await supabaseClient
      .from('billing_history')
      .select('*, coach_subscriptions!inner(*)')
      .eq('id', billing_id)
      .eq('coach_id', user.id)
      .single();

    if (billingError || !billing) {
      throw new Error('Billing record not found or unauthorized');
    }

    const maxRetries = 3;
    if (billing.retry_count >= maxRetries) {
      throw new Error(`Maximum retry attempts (${maxRetries}) exceeded`);
    }

    if (billing.status === 'paid') {
      throw new Error('Payment already completed');
    }

    const subscription = billing.coach_subscriptions;

    // Generate new transaction reference for retry
    const txRef = `retry_${billing.id}_${Date.now()}`;

    // Prepare PayChangu payment request
    const payChanguPayload = {
      tx_ref: txRef,
      amount: billing.amount,
      currency: billing.currency,
      customer: {
        email: email || user.email,
        phone_number: phone_number,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
      },
      customizations: {
        title: `Retry Payment - ${subscription.tier}`,
        description: `${subscription.billing_cycle} subscription retry for ${subscription.tier} plan`,
        logo: "https://your-logo-url.com/logo.png"
      },
      redirect_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paychangu-callback?tx_ref=${txRef}`,
    };

    if (payment_method === 'mobile_money' && phone_number) {
      payChanguPayload.customer.phone_number = phone_number;
    }

    console.log('PayChangu retry payload:', payChanguPayload);

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
    console.log('PayChangu retry response:', payChanguData);

    if (!payChanguResponse.ok) {
      console.error('PayChangu retry API error:', payChanguData);
      
      // Update retry count
      await supabaseClient
        .from('billing_history')
        .update({ 
          retry_count: billing.retry_count + 1,
          last_retry_at: new Date().toISOString()
        })
        .eq('id', billing_id);

      throw new Error(`Payment retry failed: ${payChanguData.message || 'Unknown error'}`);
    }

    // Update billing record with new reference
    await supabaseClient
      .from('billing_history')
      .update({
        paychangu_reference: txRef,
        retry_count: billing.retry_count + 1,
        last_retry_at: new Date().toISOString(),
        status: 'pending'
      })
      .eq('id', billing_id);

    // Update subscription with new PayChangu reference
    await supabaseClient
      .from('coach_subscriptions')
      .update({ paychangu_subscription_id: txRef })
      .eq('id', subscription.id);

    return new Response(JSON.stringify({
      success: true,
      payment_url: payChanguData.data?.authorization_url || payChanguData.data?.link,
      tx_ref: txRef,
      billing_id: billing_id,
      retry_count: billing.retry_count + 1,
      message: 'Payment retry initiated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in retry-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
