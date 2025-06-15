
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, CreditCard, AlertCircle } from 'lucide-react';

interface EnrollmentStatusProps {
  status: 'not_enrolled' | 'pending' | 'completed' | 'failed';
  onEnroll?: () => void;
  onRetryPayment?: () => void;
  courseName: string;
}

export const EnrollmentStatus: React.FC<EnrollmentStatusProps> = ({
  status,
  onEnroll,
  onRetryPayment,
  courseName,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'not_enrolled':
        return {
          icon: <CreditCard className="h-5 w-5 text-blue-500" />,
          title: 'Ready to Enroll',
          description: 'Join thousands of students already learning',
          badge: <Badge variant="outline">Available</Badge>,
          action: (
            <Button onClick={onEnroll} className="bg-blue-600 hover:bg-blue-700">
              Enroll Now
            </Button>
          ),
        };
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          title: 'Payment Pending',
          description: 'Complete your payment to access the course',
          badge: <Badge variant="outline" className="text-yellow-600">Pending</Badge>,
          action: (
            <Button onClick={onRetryPayment} variant="outline">
              Complete Payment
            </Button>
          ),
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: 'Successfully Enrolled',
          description: 'Welcome! You have full access to all course content',
          badge: <Badge className="bg-green-500">Enrolled</Badge>,
          action: null,
        };
      case 'failed':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          title: 'Payment Failed',
          description: 'There was an issue with your payment. Please try again',
          badge: <Badge variant="destructive">Failed</Badge>,
          action: (
            <Button onClick={onRetryPayment} className="bg-blue-600 hover:bg-blue-700">
              Retry Payment
            </Button>
          ),
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {config.icon}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{config.title}</h3>
                {config.badge}
              </div>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          {config.action && (
            <div className="ml-4">
              {config.action}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
