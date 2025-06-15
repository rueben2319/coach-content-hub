
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log(`Starting trial for user ${user.id}`);

    // Check if user already has a subscription
    const { data: existingSub } = await supabaseClient
      .from('coach_subscriptions')
      .select('id')
      .eq('coach_id', user.id)
      .limit(1)
      .maybeSingle();

    if (existingSub) {
      throw new Error('User already has a subscription');
    }

    // Call the database function to start trial
    const { data, error } = await supabaseClient.rpc('start_trial_subscription', {
      _coach_id: user.id
    });

    if (error) throw error;

    return new Response(JSON.stringify({
      success: true,
      subscription_id: data,
      message: 'Trial started successfully',
      trial_days: 14,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in start-trial:', error);
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
