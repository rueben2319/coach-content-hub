import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, CreditCard, TrendingUp, DollarSign, BookOpen } from 'lucide-react';
import RevenueChart from '@/components/admin/RevenueChart';
import TierAnalytics from '@/components/admin/TierAnalytics';
import SubscriptionStatusCard from '@/components/admin/SubscriptionStatusCard';
import { useAdminRevenueStats, useAdminTierStats, useAdminRevenueByMonth } from '@/hooks/useAdminAnalytics';

const AdminDashboard = () => {
  const { data: revenueStats, isLoading: revenueLoading } = useAdminRevenueStats();
  const { data: tierStats, isLoading: tierLoading } = useAdminTierStats();
  const { data: revenueByMonth, isLoading: monthlyLoading } = useAdminRevenueByMonth();

  if (revenueLoading || tierLoading || monthlyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    { 
      title: 'Total Revenue', 
      value: formatCurrency(revenueStats?.totalRevenue || 0), 
      change: `+${revenueStats?.growthRate || 0}%`, 
      icon: DollarSign, 
      color: 'text-green-600' 
    },
    { 
      title: 'Monthly Revenue', 
      value: formatCurrency(revenueStats?.monthlyRevenue || 0), 
      change: '+15%', 
      icon: TrendingUp, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Active Subscriptions', 
      value: revenueStats?.activeSubscriptions?.toString() || '0', 
      change: '+8%', 
      icon: CreditCard, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Total Coaches', 
      value: revenueStats?.totalCoaches?.toString() || '0', 
      change: '+12%', 
      icon: Users, 
      color: 'text-orange-600' 
    },
    { 
      title: 'Avg Revenue/Coach', 
      value: formatCurrency(revenueStats?.avgRevenuePerCoach || 0), 
      change: '+5%', 
      icon: UserCheck, 
      color: 'text-indigo-600' 
    },
    { 
      title: 'Trial Subscriptions', 
      value: revenueStats?.trialSubscriptions?.toString() || '0', 
      change: '+24%', 
      icon: BookOpen, 
      color: 'text-teal-600' 
    },
  ];

  const recentActivities = [
    { user: 'Sarah Johnson', action: 'Upgraded to Premium', time: '2 hours ago', type: 'upgrade' },
    { user: 'Mike Chen', action: 'Payment received', time: '4 hours ago', type: 'payment' },
    { user: 'Emily Davis', action: 'Started trial', time: '6 hours ago', type: 'trial' },
    { user: 'Alex Wilson', action: 'Canceled subscription', time: '8 hours ago', type: 'cancel' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time insights into your coaching platform revenue</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} ml-3`}>
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      {revenueByMonth && (
        <div className="mb-6 md:mb-8">
          <RevenueChart data={revenueByMonth} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Subscription Status Overview */}
        {revenueStats && (
          <SubscriptionStatusCard
            activeSubscriptions={revenueStats.activeSubscriptions}
            canceledSubscriptions={revenueStats.canceledSubscriptions}
            trialSubscriptions={revenueStats.trialSubscriptions}
            totalCoaches={revenueStats.totalCoaches}
          />
        )}

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <Badge variant={activity.type === 'upgrade' ? 'default' : 'secondary'} className="text-xs">
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Analytics */}
      {tierStats && (
        <TierAnalytics tierStats={tierStats} />
      )}
    </div>
  );
};

export default AdminDashboard;
