
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCoachSubscription, useSubscriptionUsage, useCreateSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_TIERS, getTierById } from '@/config/subscriptionTiers';
import SubscriptionPricingCard from '@/components/subscription/SubscriptionPricingCard';
import SubscriptionUsageCard from '@/components/subscription/SubscriptionUsageCard';
import SubscriptionManagementCard from '@/components/subscription/SubscriptionManagementCard';
import TrialStatusCard from '@/components/subscription/TrialStatusCard';
import { ArrowLeft, CreditCard } from 'lucide-react';

const CoachSubscriptionPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string>('');
  const [loadingBillingCycle, setLoadingBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const { data: subscription, isLoading: subscriptionLoading } = useCoachSubscription();
  const { data: usage, isLoading: usageLoading } = useSubscriptionUsage();
  const createSubscription = useCreateSubscription();

  const currentTier = subscription ? getTierById(subscription.tier) : null;
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trial';

  const handleSelectPlan = (tierId: string, billingCycle: 'monthly' | 'yearly') => {
    setLoadingTier(tierId);
    setLoadingBillingCycle(billingCycle);
    
    createSubscription.mutate({
      tier: tierId,
      billingCycle,
    }, {
      onSettled: () => {
        setLoadingTier('');
      }
    });
  };

  const handleUpgradeClick = () => {
    // Scroll to pricing cards
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Subscription Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trial Status or Current Subscription */}
          <div className="lg:col-span-2">
            {!hasActiveSubscription ? (
              <TrialStatusCard subscription={subscription} onUpgrade={handleUpgradeClick} />
            ) : (
              <SubscriptionManagementCard subscription={subscription} />
            )}
          </div>

          {/* Usage Overview */}
          {currentTier && usage && hasActiveSubscription && (
            <div>
              <SubscriptionUsageCard tier={currentTier} usage={usage} />
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div id="pricing-section" className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'font-semibold' : ''}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? 'font-semibold' : ''}`}>
              Yearly <span className="text-green-600">(Save 20%)</span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <SubscriptionPricingCard
                key={tier.id}
                tier={tier}
                isYearly={isYearly}
                currentTier={subscription?.tier}
                onSelect={handleSelectPlan}
                isLoading={createSubscription.isPending}
                loadingTier={loadingTier}
                loadingBillingCycle={loadingBillingCycle}
              />
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mt-8">
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

export default CoachSubscriptionPage;
