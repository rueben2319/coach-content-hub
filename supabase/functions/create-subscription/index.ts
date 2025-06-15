
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the user from the request
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('Unauthorized');
    }

    const { tier, billingCycle } = await req.json();

    console.log(`Creating subscription for user ${user.id}, tier: ${tier}, billing: ${billingCycle}`);

    // Get tier pricing in MWK
    const tierPricing = {
      basic: { monthly: 10000, yearly: 96000 }, // 20% discount
      premium: { monthly: 50000, yearly: 480000 },
      enterprise: { monthly: 100000, yearly: 960000 },
    };

    const price = tierPricing[tier as keyof typeof tierPricing]?.[billingCycle as keyof typeof tierPricing.basic];
    
    if (!price) {
      throw new Error('Invalid tier or billing cycle');
    }

    // Get user profile for PayChangu payment
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error('Failed to get user profile');
    }

    // Create PayChangu payment
    const payChanguPayload = {
      tx_ref: `sub_${user.id}_${Date.now()}`,
      amount: price,
      currency: 'MWK',
      customer: {
        email: profile.email,
        name: `${profile.first_name} ${profile.last_name}`,
      },
      customizations: {
        title: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
        description: `${billingCycle} subscription to ${tier} plan`,
      },
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paychangu-callback`,
    };

    console.log('Creating PayChangu payment with payload:', payChanguPayload);

    // Call PayChangu API to create payment
    const payChanguResponse = await fetch('https://api.paychangu.com/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYCHANGU_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payChanguPayload),
    });

    const payChanguData = await payChanguResponse.json();

    if (!payChanguResponse.ok) {
      console.error('PayChangu API error:', payChanguData);
      throw new Error(`PayChangu payment creation failed: ${payChanguData.message || 'Unknown error'}`);
    }

    console.log('PayChangu payment created:', payChanguData);

    // Create subscription record in database with pending status
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('coach_subscriptions')
      .insert({
        coach_id: user.id,
        tier,
        billing_cycle: billingCycle,
        price,
        currency: 'MWK',
        status: 'inactive', // Will be activated after successful payment
        started_at: new Date().toISOString(),
        expires_at: null, // Will be set after payment confirmation
        paychangu_subscription_id: payChanguData.data.tx_ref,
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
      throw subscriptionError;
    }

    console.log('Subscription created successfully:', subscription);

    return new Response(
      JSON.stringify({ 
        subscription,
        payment_url: payChanguData.data.checkout_url,
        tx_ref: payChanguData.data.tx_ref
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-subscription function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
