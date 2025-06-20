
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, CreditCard, TrendingUp, DollarSign, BookOpen, Settings, Eye } from 'lucide-react';
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
      <div className="desktop-container">
        <div className="desktop-flex-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="desktop-section-header">
        <div className="desktop-flex-between">
          <div>
            <h1 className="desktop-heading-primary">Revenue Dashboard</h1>
            <p className="desktop-text-body mt-2">
              Real-time insights into your coaching platform revenue
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="desktop-button-secondary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button className="desktop-button-primary">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="desktop-grid-auto-fit">
        {stats.map((stat) => (
          <Card key={stat.title} className="desktop-stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="desktop-stat-label">{stat.title}</p>
                  <p className="desktop-stat-value">{stat.value}</p>
                  <p className={`desktop-stat-change positive`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} ml-3`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      {revenueByMonth && (
        <Card className="desktop-card">
          <CardHeader>
            <CardTitle className="desktop-heading-secondary">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueByMonth} />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
        <Card className="desktop-card">
          <CardHeader>
            <div className="desktop-flex-between">
              <CardTitle className="desktop-heading-secondary">Recent Activities</CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{activity.user}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <Badge variant={activity.type === 'upgrade' ? 'default' : 'secondary'} className="text-xs mb-1">
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-gray-500">{activity.time}</p>
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
