
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  subscription_id: string;
  amount: number;
  currency: string;
  payment_method: 'mobile_money' | 'card' | 'bank_transfer';
  phone_number?: string;
  email?: string;
  return_url?: string;
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

    const { 
      subscription_id, 
      amount, 
      currency, 
      payment_method, 
      phone_number, 
      email,
      return_url 
    }: PaymentRequest = await req.json();

    console.log(`Initiating payment for user ${user.id}, subscription ${subscription_id}`);

    // Validate subscription belongs to user
    const { data: subscription, error: subError } = await supabaseClient
      .from('coach_subscriptions')
      .select('*')
      .eq('id', subscription_id)
      .eq('coach_id', user.id)
      .single();

    if (subError || !subscription) {
      throw new Error('Subscription not found or unauthorized');
    }

    // Generate unique transaction reference
    const txRef = `sub_${subscription_id}_${Date.now()}`;

    // Create billing history record
    const { data: billing, error: billingError } = await supabaseClient
      .from('billing_history')
      .insert({
        subscription_id,
        coach_id: user.id,
        amount,
        currency,
        status: 'pending',
        billing_period_start: new Date().toISOString(),
        billing_period_end: new Date(Date.now() + (subscription.billing_cycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        paychangu_reference: txRef,
        retry_count: 0,
      })
      .select()
      .single();

    if (billingError) {
      console.error('Error creating billing record:', billingError);
      throw new Error('Failed to create billing record');
    }

    // Prepare PayChangu payment request
    const payChanguPayload = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      customer: {
        email: email || user.email,
        phone_number: phone_number,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
      },
      customizations: {
        title: `Subscription Payment - ${subscription.tier}`,
        description: `${subscription.billing_cycle} subscription for ${subscription.tier} plan`,
        logo: "https://your-logo-url.com/logo.png"
      },
      redirect_url: return_url || `${Deno.env.get('SUPABASE_URL')}/functions/v1/paychangu-callback?tx_ref=${txRef}`,
    };

    // Add payment method specific fields
    if (payment_method === 'mobile_money' && phone_number) {
      payChanguPayload.customer.phone_number = phone_number;
    }

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
      await supabaseClient
        .from('billing_history')
        .update({ 
          status: 'failed',
          retry_count: 1,
          last_retry_at: new Date().toISOString()
        })
        .eq('id', billing.id);

      throw new Error(`Payment initiation failed: ${payChanguData.message || 'Unknown error'}`);
    }

    // Update subscription with PayChangu reference
    await supabaseClient
      .from('coach_subscriptions')
      .update({ paychangu_subscription_id: txRef })
      .eq('id', subscription_id);

    return new Response(JSON.stringify({
      success: true,
      payment_url: payChanguData.data?.authorization_url || payChanguData.data?.link,
      tx_ref: txRef,
      billing_id: billing.id,
      message: 'Payment initiated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in initiate-payment:', error);
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
