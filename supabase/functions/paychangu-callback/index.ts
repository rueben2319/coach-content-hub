
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
    console.log('PayChangu callback received');

    // Create Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the transaction reference from URL parameters
    const url = new URL(req.url);
    const txRef = url.searchParams.get('tx_ref');
    
    if (!txRef) {
      console.error('Missing tx_ref parameter');
      throw new Error('Missing transaction reference');
    }

    console.log('Processing callback for tx_ref:', txRef);

    // Verify the payment status with PayChangu
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
      throw new Error(`Payment verification failed: ${payChanguData.message || 'Unknown error'}`);
    }

    // Check if payment was successful
    const paymentStatus = payChanguData.data?.status;
    
    if (paymentStatus === 'success' || paymentStatus === 'completed') {
      console.log('Payment confirmed, updating subscription status');

      // Find the subscription by PayChangu transaction reference
      const { data: subscription, error: findError } = await supabaseClient
        .from('coach_subscriptions')
        .select('*')
        .eq('paychangu_subscription_id', txRef)
        .single();

      if (findError) {
        console.error('Error finding subscription:', findError);
        throw findError;
      }

      if (!subscription) {
        console.error('Subscription not found for tx_ref:', txRef);
        throw new Error('Subscription not found');
      }

      // Calculate expiry date based on billing cycle
      const now = new Date();
      const expiryDate = new Date(now);
      
      if (subscription.billing_cycle === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      }

      // Update subscription status to active
      const { error: updateError } = await supabaseClient
        .from('coach_subscriptions')
        .update({
          status: 'active',
          expires_at: expiryDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }

      console.log('Subscription activated successfully:', subscription.id);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Subscription activated successfully',
          subscription_id: subscription.id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } else {
      console.log('Payment not successful, status:', paymentStatus);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Payment not confirmed',
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
