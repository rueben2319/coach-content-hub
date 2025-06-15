
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard } from 'lucide-react';

const SubscriptionUpgradePrompt: React.FC = () => {
  const handleUpgrade = () => {
    // This will be handled by the parent component's navigation
    window.location.hash = '#subscription';
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
        </div>
        <CardTitle className="text-orange-800">Subscription Required</CardTitle>
        <CardDescription className="text-orange-700">
          You need an active subscription to access course management features
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-orange-600 mb-6">
          Your subscription has expired or you don't have an active plan. 
          Subscribe now to continue creating and managing courses.
        </p>
        <Button onClick={handleUpgrade} className="w-full">
          <CreditCard className="h-4 w-4 mr-2" />
          Upgrade Subscription
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionUpgradePrompt;
