
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TierAnalyticsProps {
  tierStats: Array<{
    tier: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
}

const TierAnalytics: React.FC<TierAnalyticsProps> = ({ tierStats }) => {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'basic': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'enterprise': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Subscription Tier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tierStats.map((tier) => (
            <div key={tier.tier} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getTierColor(tier.tier)}`}></div>
                <div>
                  <p className="font-medium capitalize">{tier.tier}</p>
                  <p className="text-sm text-gray-600">{tier.count} subscriptions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(tier.revenue)}</p>
                <Badge variant="secondary" className="text-xs">
                  {tier.percentage}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TierAnalytics;
