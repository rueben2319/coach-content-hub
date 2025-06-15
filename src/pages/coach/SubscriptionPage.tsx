
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCoachSubscription, useSubscriptionUsage, useCreateSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_TIERS, getTierById } from '@/config/subscriptionTiers';
import SubscriptionPricingCard from '@/components/subscription/SubscriptionPricingCard';
import SubscriptionUsageCard from '@/components/subscription/SubscriptionUsageCard';
import { ArrowLeft, CreditCard } from 'lucide-react';

interface SubscriptionPageProps {
  onBack: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBack }) => {
  const [isYearly, setIsYearly] = useState(false);
  const { data: subscription, isLoading: subscriptionLoading } = useCoachSubscription();
  const { data: usage, isLoading: usageLoading } = useSubscriptionUsage();
  const createSubscription = useCreateSubscription();

  const currentTier = subscription ? getTierById(subscription.tier) : null;

  const handleSelectPlan = (tierId: string, billingCycle: 'monthly' | 'yearly') => {
    createSubscription.mutate({
      tier: tierId,
      billingCycle,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const },
      trial: { label: 'Trial', variant: 'secondary' as const },
      expired: { label: 'Expired', variant: 'destructive' as const },
      inactive: { label: 'Inactive', variant: 'destructive' as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  };

  if (subscriptionLoading || usageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Subscription Management</h1>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{currentTier?.name || subscription.tier}</span>
                    <Badge {...getStatusBadge(subscription.status)}>
                      {getStatusBadge(subscription.status).label}
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    ${subscription.price}/{subscription.billing_cycle}
                  </p>
                  {subscription.expires_at && (
                    <p className="text-sm text-gray-500">
                      Expires: {new Date(subscription.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                {currentTier && usage && (
                  <div className="sm:w-80">
                    <SubscriptionUsageCard tier={currentTier} usage={usage} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm ${!isYearly ? 'font-semibold' : ''}`}>Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm ${isYearly ? 'font-semibold' : ''}`}>
            Yearly <span className="text-green-600">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <SubscriptionPricingCard
              key={tier.id}
              tier={tier}
              isYearly={isYearly}
              currentTier={subscription?.tier}
              onSelect={handleSelectPlan}
              isLoading={createSubscription.isPending}
            />
          ))}
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Contact our support team if you have questions about subscriptions or need help choosing the right plan.
            </p>
            <Button variant="outline">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
