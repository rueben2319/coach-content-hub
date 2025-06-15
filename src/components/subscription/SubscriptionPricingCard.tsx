
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';
import { getYearlyPrice } from '@/config/subscriptionTiers';

interface SubscriptionPricingCardProps {
  tier: SubscriptionTier;
  isYearly: boolean;
  currentTier?: string;
  onSelect: (tierId: string, billingCycle: 'monthly' | 'yearly') => void;
  isLoading?: boolean;
}

const SubscriptionPricingCard: React.FC<SubscriptionPricingCardProps> = ({
  tier,
  isYearly,
  currentTier,
  onSelect,
  isLoading,
}) => {
  const price = isYearly ? getYearlyPrice(tier.price) : tier.price;
  const displayPrice = isYearly ? Math.round(price / 12) : price;
  const isCurrentTier = currentTier === tier.id;

  const formatFeatureValue = (value: number, unit: string) => {
    if (value === -1) return 'Unlimited';
    return `${value} ${unit}`;
  };

  return (
    <Card className={`relative ${tier.popular ? 'border-blue-500 shadow-lg' : ''} ${isCurrentTier ? 'bg-gray-50' : ''}`}>
      {tier.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg sm:text-xl">{tier.name}</CardTitle>
        <div className="mt-2">
          <span className="text-2xl sm:text-3xl font-bold">${displayPrice}</span>
          <span className="text-gray-600 text-sm">/month</span>
          {isYearly && (
            <div className="text-xs text-green-600 mt-1">
              Save ${(tier.price * 12) - price}/year
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
            <span>{formatFeatureValue(tier.features.maxCourses, 'courses')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
            <span>{formatFeatureValue(tier.features.maxStudents, 'students')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
            <span>{tier.features.storageGB}GB storage</span>
          </div>
          {tier.features.analytics && (
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
              <span>Advanced analytics</span>
            </div>
          )}
          {tier.features.prioritySupport && (
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
              <span>Priority support</span>
            </div>
          )}
          {tier.features.customBranding && (
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
              <span>Custom branding</span>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          variant={isCurrentTier ? "secondary" : "default"}
          disabled={isCurrentTier || isLoading}
          onClick={() => onSelect(tier.id, isYearly ? 'yearly' : 'monthly')}
        >
          {isCurrentTier ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPricingCard;
