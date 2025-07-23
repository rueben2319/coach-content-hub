import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoursePaymentRequest {
  enrollment_id: string;
  course_id: string;
  coach_id: string;
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
      enrollment_id,
      course_id,
      coach_id,
      amount, 
      currency, 
      payment_method, 
      phone_number, 
      email,
      return_url 
    }: CoursePaymentRequest = await req.json();

    console.log(`Initiating course payment for user ${user.id}, enrollment ${enrollment_id}`);

    // Validate enrollment belongs to user
    const { data: enrollment, error: enrollmentError } = await supabaseClient
      .from('enrollments')
      .select('*')
      .eq('id', enrollment_id)
      .eq('client_id', user.id)
      .single();

    if (enrollmentError || !enrollment) {
      throw new Error('Enrollment not found or unauthorized');
    }

    // Get coach's payment settings
    const { data: coachProfile, error: coachError } = await supabaseClient
      .from('profiles')
      .select('paychangu_enabled, paychangu_public_key, paychangu_secret_key, payment_settings')
      .eq('user_id', coach_id)
      .single();

    if (coachError || !coachProfile) {
      throw new Error('Coach not found');
    }

    if (!coachProfile.paychangu_enabled || !coachProfile.paychangu_secret_key) {
      throw new Error('Coach has not configured payment processing');
    }

    // Generate unique transaction reference
    const txRef = `enroll_${enrollment_id}_${Date.now()}`;

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        enrollment_id,
        amount,
        currency,
        status: 'pending',
        paychangu_reference: txRef,
        payment_method,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      throw new Error('Failed to create transaction record');
    }

    // Get course details for payment description
    const { data: course, error: courseError } = await supabaseClient
      .from('courses')
      .select('title, description')
      .eq('id', course_id)
      .single();

    if (courseError || !course) {
      throw new Error('Course not found');
    }

    // Prepare PayChangu payment request using coach's credentials
    const payChanguPayload = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      customer: {
        email: email || user.email,
        phone_number: phone_number,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email,
      },
      customizations: {
        title: `Course Enrollment - ${course.title}`,
        description: course.description || `Enrollment for ${course.title}`,
        logo: "https://your-logo-url.com/logo.png"
      },
      redirect_url: return_url || `${Deno.env.get('SUPABASE_URL')}/functions/v1/paychangu-callback?tx_ref=${txRef}&type=enrollment`,
    };

    // Add payment method specific fields
    if (payment_method === 'mobile_money' && phone_number) {
      payChanguPayload.customer.phone_number = phone_number;
    }

    console.log('PayChangu payload:', payChanguPayload);

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
    console.log('PayChangu response:', payChanguData);

    if (!payChanguResponse.ok) {
      console.error('PayChangu API error:', payChanguData);
      
      // Update transaction as failed
      await supabaseClient
        .from('transactions')
        .update({ 
          status: 'failed'
        })
        .eq('id', transaction.id);

      throw new Error(`Payment initiation failed: ${payChanguData.message || 'Unknown error'}`);
    }

    // Update enrollment with PayChangu reference
    await supabaseClient
      .from('enrollments')
      .update({ paychangu_reference: txRef })
      .eq('id', enrollment_id);

    return new Response(JSON.stringify({
      success: true,
      payment_url: payChanguData.data?.authorization_url || payChanguData.data?.link,
      tx_ref: txRef,
      transaction_id: transaction.id,
      message: 'Course payment initiated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in initiate-course-payment:', error);
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