
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const txRef = searchParams.get('tx_ref');
  const reason = searchParams.get('reason') || 'Payment was not completed successfully';

  const handleRetry = () => {
    navigate('/coach/subscription');
  };

  const handleBackToDashboard = () => {
    navigate('/coach');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {reason}
          </p>
          
          {txRef && (
            <div className="bg-gray-50 border rounded-lg p-3">
              <p className="text-xs text-gray-500 font-mono">
                Reference: {txRef}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Common issues:</strong>
            </p>
            <ul className="text-yellow-700 text-sm mt-2 text-left space-y-1">
              <li>• Insufficient funds</li>
              <li>• Network connectivity issues</li>
              <li>• Payment method declined</li>
              <li>• Transaction timeout</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              onClick={handleRetry}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            If you continue to experience issues, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;
