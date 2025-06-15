
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tx_ref, status } = await req.json();

    console.log(`PayChangu callback received: tx_ref=${tx_ref}, status=${status}`);

    if (status === 'successful') {
      // Verify payment with PayChangu
      const verifyResponse = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PAYCHANGU_SECRET_KEY')}`,
        },
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.status === 'success' && verifyData.data.status === 'successful') {
        // Update subscription status to active
        const { data: subscription, error: updateError } = await supabaseClient
          .from('coach_subscriptions')
          .update({
            status: 'active',
            expires_at: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString(), // 1 year from now
          })
          .eq('paychangu_subscription_id', tx_ref)
          .select()
          .single();

        if (updateError) {
          console.error('Failed to update subscription:', updateError);
          throw updateError;
        }

        console.log('Subscription activated:', subscription);

        return new Response(
          JSON.stringify({ message: 'Subscription activated successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    }

    // If payment failed or was not successful
    const { error: updateError } = await supabaseClient
      .from('coach_subscriptions')
      .update({ status: 'inactive' })
      .eq('paychangu_subscription_id', tx_ref);

    if (updateError) {
      console.error('Failed to update subscription status:', updateError);
    }

    return new Response(
      JSON.stringify({ message: 'Payment not successful' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );

  } catch (error) {
    console.error('Error in paychangu-callback function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
