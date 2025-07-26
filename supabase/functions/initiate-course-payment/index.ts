import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoursePaymentRequest {
  type: 'one_off' | 'subscription';
  target_id: string; // course_id, bundle_id, or subscription_id
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
      type,
      target_id,
      amount, 
      currency, 
      payment_method, 
      phone_number, 
      email,
      return_url 
    }: CoursePaymentRequest = await req.json();

    let coach_id, coachProfile, payChanguPayload, txRef, billing, title, description;
    if (type === 'subscription') {
      // Fetch subscription
      const { data: subscription, error: subError } = await supabaseClient
        .from('coach_subscriptions')
        .select('*')
        .eq('id', target_id)
        .single();
      if (subError || !subscription) {
        throw new Error('Subscription not found');
      }
      coach_id = subscription.coach_id;
      txRef = `sub_${target_id}_${Date.now()}`;
      // Create billing record
      const { data: billingData, error: billingError } = await supabaseClient
        .from('client_subscriptions')
        .insert({
          client_id: user.id,
          coach_id,
          subscription_id: target_id,
          amount,
          currency,
          status: 'pending',
          paychangu_reference: txRef,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (billingError) throw new Error('Failed to create billing record');
      billing = billingData;
      // Fetch coach profile
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('paychangu_secret_key, paychangu_enabled')
        .eq('user_id', coach_id)
        .maybeSingle();
      if (profileError || !profile) throw new Error('Coach profile not found');
      if (!profile.paychangu_enabled || !profile.paychangu_secret_key) throw new Error('Coach PayChangu integration not enabled');
      coachProfile = profile;
      title = `Subscription Payment`;
      description = `Subscription payment for client`;
    } else if (type === 'one_off') {
      // Fetch course or bundle (try course first, then bundle)
      let course = null, bundle = null;
      const { data: courseData } = await supabaseClient
        .from('courses')
        .select('id, coach_id, title, description')
        .eq('id', target_id)
        .maybeSingle();
      if (courseData) course = courseData;
      if (!course) {
        const { data: bundleData } = await supabaseClient
          .from('bundles')
          .select('id, coach_id, title, description')
          .eq('id', target_id)
          .maybeSingle();
        if (bundleData) bundle = bundleData;
      }
      if (!course && !bundle) throw new Error('Course or bundle not found');
      coach_id = course ? course.coach_id : bundle.coach_id;
      txRef = `oneoff_${target_id}_${Date.now()}`;
      // Create billing record
      const { data: billingData, error: billingError } = await supabaseClient
        .from('client_purchases')
        .insert({
          client_id: user.id,
          coach_id,
          course_id: course ? target_id : null,
          bundle_id: bundle ? target_id : null,
          amount,
          currency,
          status: 'pending',
          paychangu_reference: txRef,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (billingError) throw new Error('Failed to create billing record');
      billing = billingData;
      // Fetch coach profile
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('paychangu_secret_key, paychangu_enabled')
        .eq('user_id', coach_id)
        .maybeSingle();
      if (profileError || !profile) throw new Error('Coach profile not found');
      if (!profile.paychangu_enabled || !profile.paychangu_secret_key) throw new Error('Coach PayChangu integration not enabled');
      coachProfile = profile;
      title = `One-off Payment - ${(course ? course.title : bundle.title)}`;
      description = (course ? course.description : bundle.description) || `One-off payment for course or bundle`;
    } else {
      throw new Error('Invalid payment type');
    }

    // Build PayChangu payload
    payChanguPayload = {
      tx_ref: txRef,
      amount,
      currency,
      customer: {
        email: email || user.email,
        phone_number: phone_number,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email,
      },
      customizations: {
        title,
        description,
        logo: "https://your-logo-url.com/logo.png"
      },
      redirect_url: return_url || `${Deno.env.get('SUPABASE_URL')}/functions/v1/paychangu-callback?tx_ref=${txRef}`,
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paychangu-callback`,
    };

    // Call PayChangu API using coach's secret key
    const payChanguResponse = await fetch('https://api.paychangu.com/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${coachProfile.paychangu_secret_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payChanguPayload),
    });

    const payChanguData = await payChanguResponse.json();
    if (!payChanguResponse.ok) {
      throw new Error(`PayChangu API error: ${payChanguData.message || 'Unknown error'}`);
    }

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