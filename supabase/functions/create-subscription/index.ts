
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the request
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { tier, billingCycle } = await req.json();

    console.log(`Creating subscription for user ${user.id}, tier: ${tier}, billing: ${billingCycle}`);

    // Get tier pricing
    const tierPricing = {
      basic: { monthly: 29, yearly: 278 }, // 20% discount
      premium: { monthly: 79, yearly: 758 },
      enterprise: { monthly: 199, yearly: 1910 },
    };

    const price = tierPricing[tier as keyof typeof tierPricing]?.[billingCycle as keyof typeof tierPricing.basic];
    
    if (!price) {
      throw new Error('Invalid tier or billing cycle');
    }

    // For now, create the subscription directly in the database
    // In production, you would integrate with PayChangu here
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('coach_subscriptions')
      .insert({
        coach_id: user.id,
        tier,
        billing_cycle: billingCycle,
        price,
        currency: 'USD',
        status: 'trial', // Start with trial, would be updated after payment
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
      throw subscriptionError;
    }

    console.log('Subscription created successfully:', subscription);

    return new Response(
      JSON.stringify({ subscription }),
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
