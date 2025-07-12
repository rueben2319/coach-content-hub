
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
    console.log('=== CREATE SUBSCRIPTION FUNCTION STARTED ===');
    
    // Check environment variables first
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const payChanguSecret = Deno.env.get('PAYCHANGU_SECRET_KEY');
    
    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!serviceKey,
      hasPayChanguSecret: !!payChanguSecret
    });
    
    if (!supabaseUrl || !serviceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    if (!payChanguSecret) {
      throw new Error('PAYCHANGU_SECRET_KEY is not configured. Please add it in the Supabase Edge Function secrets.');
    }

    const supabaseClient = createClient(supabaseUrl, serviceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Authenticating user...');
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    if (!user) {
      throw new Error('User not found');
    }

    console.log(`User authenticated: ${user.id}`);

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      throw new Error('Invalid request body');
    }

    const { tier, billingCycle }: CreateSubscriptionRequest = requestBody;

    if (!tier || !billingCycle) {
      throw new Error('Missing tier or billingCycle');
    }

    console.log(`Creating subscription: tier=${tier}, cycle=${billingCycle}`);

    // Define pricing
    const pricing = {
      basic: { monthly: 2000, yearly: 20000 },
      pro: { monthly: 5000, yearly: 50000 },
      premium: { monthly: 10000, yearly: 100000 }
    };

    const price = pricing[tier]?.[billingCycle];
    if (!price) {
      throw new Error(`Invalid tier or billing cycle: ${tier}, ${billingCycle}`);
    }

    console.log(`Price determined: ${price} MWK`);

    // Check for existing subscription
    const { data: existingSubscription, error: existingSubError } = await supabaseClient
      .from('coach_subscriptions')
      .select('*')
      .eq('coach_id', user.id)
      .in('status', ['active', 'trial'])
      .maybeSingle();

    if (existingSubError) {
      console.error('Error checking existing subscription:', existingSubError);
      throw new Error('Failed to check existing subscription');
    }

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
        status: 'inactive',
        started_at: new Date().toISOString(),
        expires_at: null,
        next_billing_date: null,
        auto_renew: true
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
    }

    console.log('Subscription created:', subscription.id);

    // Generate transaction reference
    const txRef = `sub_${subscription.id}_${Date.now()}`;
    console.log('Transaction reference:', txRef);

    // Create billing record
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
    } else {
      console.log('Billing record created:', billing.id);
    }

    // Get origin for redirects
    const origin = req.headers.get('origin') || 'https://awmszxrtommgxjnivddq.supabase.co';
    console.log('Origin for redirects:', origin);

    // Simplified PayChangu payload
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
      },
      redirect_url: `${origin}/payment-success?tx_ref=${txRef}`,
      cancel_url: `${origin}/payment-failed?tx_ref=${txRef}`,
    };

    console.log('PayChangu payload:', JSON.stringify(payChanguPayload, null, 2));

    // Call PayChangu API
    console.log('Calling PayChangu API...');
    let payChanguResponse;
    try {
      payChanguResponse = await fetch('https://api.paychangu.com/payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${payChanguSecret}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payChanguPayload),
      });
    } catch (fetchError) {
      console.error('Network error calling PayChangu:', fetchError);
      throw new Error(`Network error: ${fetchError.message}`);
    }

    console.log('PayChangu response status:', payChanguResponse.status);
    console.log('PayChangu response headers:', Object.fromEntries(payChanguResponse.headers.entries()));

    let payChanguData;
    const responseText = await payChanguResponse.text();
    console.log('PayChangu raw response:', responseText);

    try {
      payChanguData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse PayChangu response:', parseError);
      console.error('Raw response was:', responseText);
      throw new Error('Invalid response from payment provider');
    }

    console.log('PayChangu parsed response:', JSON.stringify(payChanguData, null, 2));

    if (!payChanguResponse.ok) {
      console.error('PayChangu API error:', {
        status: payChanguResponse.status,
        statusText: payChanguResponse.statusText,
        data: payChanguData
      });
      
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

      const errorMessage = payChanguData?.message || payChanguData?.error || `PayChangu API returned ${payChanguResponse.status}: ${responseText}`;
      throw new Error(`Payment initiation failed: ${errorMessage}`);
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

    // Extract payment URL from various possible response formats
    const paymentUrl = payChanguData.data?.authorization_url || 
                      payChanguData.data?.link || 
                      payChanguData.authorization_url || 
                      payChanguData.link ||
                      payChanguData.url;

    if (!paymentUrl) {
      console.error('No payment URL found in response:', payChanguData);
      throw new Error('No payment URL received from PayChangu');
    }

    const response = {
      success: true,
      payment_url: paymentUrl,
      tx_ref: txRef,
      subscription_id: subscription.id,
      billing_id: billing?.id,
      message: 'Subscription created and payment initiated successfully'
    };

    console.log('Success response:', response);
    console.log('=== CREATE SUBSCRIPTION FUNCTION COMPLETED ===');

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('=== CREATE SUBSCRIPTION FUNCTION ERROR ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    console.error('=== END ERROR DETAILS ===');
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred',
        details: error.stack
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
