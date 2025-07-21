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
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Check environment variables first
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const payChanguSecret = Deno.env.get('PAYCHANGU_SECRET_KEY');
    
    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!serviceKey?.substring(0, 20) + '...',
      hasPayChanguSecret: !!payChanguSecret?.substring(0, 10) + '...'
    });
    
    if (!supabaseUrl || !serviceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Server configuration error: Missing Supabase credentials'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    if (!payChanguSecret) {
      console.error('PAYCHANGU_SECRET_KEY not found');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Payment service not configured. Please contact support.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseClient = createClient(supabaseUrl, serviceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Authorization required'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Authenticating user with token length:', token.length);
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ 
        success: false,
        error: `Authentication failed: ${authError.message}`
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    if (!user) {
      console.error('No user found after auth');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User not found'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`User authenticated: ${user.id}, email: ${user.email}`);

    let requestBody;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      requestBody = JSON.parse(bodyText);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid request format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { tier, billingCycle }: CreateSubscriptionRequest = requestBody;

    if (!tier || !billingCycle) {
      console.error('Missing required fields:', { tier, billingCycle });
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing tier or billing cycle'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Creating subscription: tier=${tier}, cycle=${billingCycle}`);

    // Define pricing (aligned with frontend subscription tiers)
    const pricing = {
      basic: { monthly: 10000, yearly: 100000 },
      premium: { monthly: 50000, yearly: 500000 },
      enterprise: { monthly: 100000, yearly: 1000000 }
    };

    const price = pricing[tier]?.[billingCycle];
    if (!price) {
      console.error('Invalid pricing configuration:', { tier, billingCycle });
      return new Response(JSON.stringify({ 
        success: false,
        error: `Invalid subscription plan: ${tier} ${billingCycle}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Price determined: ${price} MWK`);

    // Check for existing subscription - FIXED LOGIC
    console.log('Checking for existing subscriptions...');
    const { data: existingSubscriptions, error: existingSubError } = await supabaseClient
      .from('coach_subscriptions')
      .select('*')
      .eq('coach_id', user.id)
      .in('status', ['active', 'trial'])
      .order('created_at', { ascending: false });

    if (existingSubError) {
      console.error('Error checking existing subscription:', existingSubError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Database error while checking subscription status'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Found existing subscriptions:', existingSubscriptions?.length || 0);
    
    // FIXED: More accurate active subscription detection
    const now = new Date();
    const activeSubscription = existingSubscriptions?.find(sub => {
      console.log(`Checking subscription ${sub.id}: status=${sub.status}, trial=${sub.is_trial}`);
      
      // For active subscriptions, check if they have a valid expiry
      if (sub.status === 'active') {
        const hasValidExpiry = sub.expires_at && new Date(sub.expires_at) > now;
        console.log(`Active sub ${sub.id}: expires_at=${sub.expires_at}, hasValidExpiry=${hasValidExpiry}`);
        return hasValidExpiry;
      }
      
      // For trial subscriptions, check if trial is still valid
      if (sub.status === 'trial' && sub.is_trial) {
        const trialValid = sub.trial_ends_at && new Date(sub.trial_ends_at) > now;
        console.log(`Trial sub ${sub.id}: trial_ends_at=${sub.trial_ends_at}, trialValid=${trialValid}`);
        return trialValid;
      }
      
      console.log(`Subscription ${sub.id} is not active - status=${sub.status}`);
      return false;
    });

    if (activeSubscription) {
      console.log('Found truly active subscription:', activeSubscription.id, 'Status:', activeSubscription.status);
      
      // Clean up any old inactive subscriptions
      const inactiveIds = existingSubscriptions
        ?.filter(sub => sub.id !== activeSubscription.id && 
                       (sub.status === 'expired' || sub.status === 'inactive'))
        ?.map(sub => sub.id) || [];
      
      if (inactiveIds.length > 0) {
        console.log(`Cleaning up ${inactiveIds.length} inactive subscriptions`);
        await supabaseClient
          .from('coach_subscriptions')
          .delete()
          .in('id', inactiveIds);
      }

      return new Response(JSON.stringify({ 
        success: false,
        error: 'You already have an active subscription. Please manage your existing subscription instead.',
        subscription_id: activeSubscription.id,
        current_status: activeSubscription.status,
        expires_at: activeSubscription.expires_at || activeSubscription.trial_ends_at
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Clean up ALL inactive/expired subscriptions before creating new one
    if (existingSubscriptions && existingSubscriptions.length > 0) {
      console.log('Cleaning up all old subscriptions before creating new one');
      const allOldIds = existingSubscriptions.map(sub => sub.id);
      await supabaseClient
        .from('coach_subscriptions')
        .delete()
        .in('id', allOldIds);
    }

    // Create new subscription
    console.log('Creating new subscription...');
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
      return new Response(JSON.stringify({ 
        success: false,
        error: `Failed to create subscription: ${subscriptionError.message}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Subscription created successfully:', subscription.id);

    // Generate transaction reference
    const txRef = `sub_${subscription.id}_${Date.now()}`;
    console.log('Transaction reference generated:', txRef);

    // Create billing record
    console.log('Creating billing record...');
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
      // Continue without billing record for now
    } else {
      console.log('Billing record created successfully:', billing.id);
    }

    // Get origin for redirects
    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://awmszxrtommgxjnivddq.supabase.co';
    console.log('Origin for redirects:', origin);

    // Prepare PayChangu payload
    const customerName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Customer';
    
    const payChanguPayload = {
      tx_ref: txRef,
      amount: price,
      currency: 'MWK',
      customer: {
        email: user.email,
        name: customerName,
      },
      customizations: {
        title: `${tier.toUpperCase()} Plan Subscription`,
        description: `${billingCycle} subscription for ${tier} plan`,
      },
      redirect_url: `${origin}/payment-success?tx_ref=${txRef}`,
      cancel_url: `${origin}/payment-failed?tx_ref=${txRef}`,
      callback_url: `https://awmszxrtommgxjnivddq.supabase.co/functions/v1/paychangu-callback`,
    };

    console.log('PayChangu payload prepared:', JSON.stringify(payChanguPayload, null, 2));

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
      
      console.log('PayChangu response status:', payChanguResponse.status);
      console.log('PayChangu response headers:', Object.fromEntries(payChanguResponse.headers.entries()));
    } catch (fetchError) {
      console.error('Network error calling PayChangu:', fetchError);
      return new Response(JSON.stringify({ 
        success: false,
        error: `Payment service unavailable: ${fetchError.message}`
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const responseText = await payChanguResponse.text();
    console.log('PayChangu raw response:', responseText);

    let payChanguData;
    try {
      payChanguData = JSON.parse(responseText);
      console.log('PayChangu parsed response:', JSON.stringify(payChanguData, null, 2));
    } catch (parseError) {
      console.error('Failed to parse PayChangu response:', parseError);
      console.error('Raw response was:', responseText);
      
      // Update billing as failed
      if (billing) {
        await supabaseClient
          .from('billing_history')
          .update({ status: 'failed', retry_count: 1 })
          .eq('id', billing.id);
      }
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid response from payment provider'
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

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

      const errorMessage = payChanguData?.message || payChanguData?.error || payChanguData?.msg || `PayChangu API returned ${payChanguResponse.status}`;
      return new Response(JSON.stringify({ 
        success: false,
        error: `Payment initiation failed: ${errorMessage}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Update subscription with PayChangu reference
    console.log('Updating subscription with PayChangu reference...');
    await supabaseClient
      .from('coach_subscriptions')
      .update({ paychangu_subscription_id: txRef })
      .eq('id', subscription.id);

    // Log subscription creation
    console.log('Logging subscription creation...');
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
                      payChanguData.url ||
                      payChanguData.payment_url;

    console.log('Extracted payment URL:', paymentUrl);

    if (!paymentUrl) {
      console.error('No payment URL found in PayChangu response');
      console.error('Available response keys:', Object.keys(payChanguData));
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Payment URL not received from payment provider',
        debug: {
          responseKeys: Object.keys(payChanguData),
          response: payChanguData
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
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
    console.log('=== CREATE SUBSCRIPTION FUNCTION COMPLETED SUCCESSFULLY ===');

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('=== CREATE SUBSCRIPTION FUNCTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR DETAILS ===');
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred',
        type: error.name || 'UnknownError'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
