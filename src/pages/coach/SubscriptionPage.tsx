
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubscriptionPricingCard from '@/components/subscription/SubscriptionPricingCard';
import SubscriptionUsageCard from '@/components/subscription/SubscriptionUsageCard';
import SubscriptionManagementCard from '@/components/subscription/SubscriptionManagementCard';
import TrialStatusCard from '@/components/subscription/TrialStatusCard';
import BillingHistoryCard from '@/components/subscription/BillingHistoryCard';
import { useCoachSubscription, useSubscriptionUsage } from '@/hooks/useSubscription';
import { SUBSCRIPTION_TIERS } from '@/config/subscriptionTiers';

const SubscriptionPage: React.FC = () => {
  const { data: subscription, isLoading: subscriptionLoading } = useCoachSubscription();
  const { data: usage, isLoading: usageLoading } = useSubscriptionUsage();

  const handleUpgrade = () => {
    // This will be handled by the pricing cards
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (subscriptionLoading || usageLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading subscription details...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage your coaching platform subscription and billing</p>
        </div>

        {/* Trial Status or Current Subscription */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrialStatusCard subscription={subscription} onUpgrade={handleUpgrade} />
          
          {subscription && (
            <SubscriptionManagementCard subscription={subscription} />
          )}
        </div>

        {/* Usage and Billing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subscription && usage && (
            <SubscriptionUsageCard subscription={subscription} usage={usage} />
          )}
          
          <BillingHistoryCard />
        </div>

        {/* Pricing Options */}
        <div id="pricing-section">
          <h2 className="text-2xl font-bold text-center mb-8">
            {subscription ? 'Change Your Plan' : 'Choose Your Plan'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <SubscriptionPricingCard
                key={tier.id}
                tier={tier}
                isCurrentTier={subscription?.tier === tier.id}
                disabled={subscription?.tier === tier.id}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
