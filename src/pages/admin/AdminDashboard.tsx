
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, CreditCard, TrendingUp, DollarSign, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Coaches', value: '24', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Total Clients', value: '156', change: '+18%', icon: UserCheck, color: 'text-green-600' },
    { title: 'Active Subscriptions', value: '142', change: '+8%', icon: CreditCard, color: 'text-purple-600' },
    { title: 'Monthly Revenue', value: '$12,450', change: '+22%', icon: DollarSign, color: 'text-orange-600' },
    { title: 'Content Items', value: '89', change: '+15%', icon: BookOpen, color: 'text-indigo-600' },
    { title: 'Growth Rate', value: '24%', change: '+5%', icon: TrendingUp, color: 'text-teal-600' },
  ];

  const recentActivities = [
    { user: 'Sarah Johnson', action: 'Created new course', time: '2 hours ago', type: 'coach' },
    { user: 'Mike Chen', action: 'Subscribed to Premium', time: '4 hours ago', type: 'client' },
    { user: 'Emily Davis', action: 'Updated profile', time: '6 hours ago', type: 'coach' },
    { user: 'Alex Wilson', action: 'Completed course', time: '8 hours ago', type: 'client' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your coaching platform</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
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
                    <Badge variant={activity.type === 'coach' ? 'default' : 'secondary'} className="text-xs">
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Top Performing Coaches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {[
                { name: 'Sarah Johnson', clients: 23, revenue: '$3,200', rating: 4.9 },
                { name: 'Michael Brown', clients: 18, revenue: '$2,800', rating: 4.8 },
                { name: 'Emily Davis', clients: 16, revenue: '$2,400', rating: 4.7 },
                { name: 'James Wilson', clients: 14, revenue: '$2,100', rating: 4.6 },
              ].map((coach, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {coach.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{coach.name}</p>
                      <p className="text-xs md:text-sm text-gray-600">{coach.clients} clients</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold text-gray-900">{coach.revenue}</p>
                    <div className="flex items-center justify-end">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs text-gray-600 ml-1">{coach.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
