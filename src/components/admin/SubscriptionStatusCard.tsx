
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Clock, UserX } from 'lucide-react';

interface SubscriptionStatusCardProps {
  activeSubscriptions: number;
  canceledSubscriptions: number;
  trialSubscriptions: number;
  totalCoaches: number;
}

const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  activeSubscriptions,
  canceledSubscriptions,
  trialSubscriptions,
  totalCoaches
}) => {
  const statusItems = [
    {
      label: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Trial Subscriptions',
      value: trialSubscriptions,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Canceled Subscriptions',
      value: canceledSubscriptions,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Total Coaches',
      value: totalCoaches,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statusItems.map((item) => (
            <div key={item.label} className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className={`p-2 rounded-full ${item.bgColor}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
