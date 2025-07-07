
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    subscriptionId?: string;
  } | null>(null);

  const txRef = searchParams.get('tx_ref');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!txRef) {
      setVerificationResult({
        success: false,
        message: 'No transaction reference found'
      });
      setIsVerifying(false);
      return;
    }

    // Poll for subscription status
    const verifyPayment = async () => {
      try {
        // Check if subscription is now active
        const { data: subscription, error } = await supabase
          .from('coach_subscriptions')
          .select('*')
          .eq('coach_id', user.id)
          .eq('status', 'active')
          .eq('paychangu_subscription_id', txRef)
          .single();

        if (!error && subscription) {
          setVerificationResult({
            success: true,
            message: 'Payment successful! Your subscription is now active.',
            subscriptionId: subscription.id
          });
          setIsVerifying(false);
          return;
        }

        // Check for failed payment
        const { data: failedBilling } = await supabase
          .from('billing_history')
          .select('*')
          .eq('paychangu_reference', txRef)
          .eq('status', 'failed')
          .single();

        if (failedBilling) {
          setVerificationResult({
            success: false,
            message: 'Payment failed. Please try again or contact support.'
          });
          setIsVerifying(false);
          return;
        }

        // Still pending, continue polling
        setTimeout(verifyPayment, 2000);
      } catch (error) {
        console.error('Error verifying payment:', error);
        setTimeout(verifyPayment, 2000);
      }
    };

    verifyPayment();
  }, [user, txRef, navigate]);

  const handleContinue = () => {
    if (verificationResult?.success) {
      navigate('/coach/subscription');
    } else {
      navigate('/coach');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isVerifying ? (
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            ) : verificationResult?.success ? (
              <CheckCircle className="h-16 w-16 text-green-600" />
            ) : (
              <div className="h-16 w-16 rounded-full border-4 border-red-200 flex items-center justify-center">
                <span className="text-red-600 text-2xl">✕</span>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {isVerifying ? 'Verifying Payment...' : 
             verificationResult?.success ? 'Payment Successful!' : 'Payment Issue'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {isVerifying ? (
            <p className="text-gray-600">
              Please wait while we confirm your payment. This may take a few moments.
            </p>
          ) : (
            <>
              <p className="text-gray-600">
                {verificationResult?.message}
              </p>
              {verificationResult?.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    🎉 Welcome to your new subscription!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    You now have access to all premium features.
                  </p>
                </div>
              )}
              <Button onClick={handleContinue} className="w-full">
                {verificationResult?.success ? 'Go to Subscription' : 'Back to Dashboard'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
