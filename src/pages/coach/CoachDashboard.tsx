
import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Calendar,
  MessageSquare,
  Plus,
  Eye
} from 'lucide-react';

const CoachDashboard = () => {
  const stats = [
    {
      icon: Users,
      title: 'Active Clients',
      value: 24,
      maxValue: 30,
      trend: 12,
      color: 'blue' as const
    },
    {
      icon: BookOpen,
      title: 'Courses Created',
      value: 8,
      trend: 25,
      color: 'purple' as const
    },
    {
      icon: TrendingUp,
      title: 'Monthly Revenue',
      value: '$4,280',
      trend: 15,
      color: 'emerald' as const
    },
    {
      icon: DollarSign,
      title: 'Total Earnings',
      value: '$28,450',
      trend: 8,
      color: 'rose' as const
    }
  ];

  const recentActivities = [
    { client: 'Sarah Johnson', action: 'Completed Module 3', time: '2 hours ago', status: 'completed' },
    { client: 'Mike Chen', action: 'Started new course', time: '4 hours ago', status: 'started' },
    { client: 'Emily Davis', action: 'Submitted assignment', time: '6 hours ago', status: 'submitted' },
    { client: 'Alex Wilson', action: 'Scheduled session', time: '8 hours ago', status: 'scheduled' }
  ];

  const upcomingSessions = [
    { client: 'Sarah Johnson', time: '2:00 PM', topic: 'Goal Setting Workshop' },
    { client: 'Mike Chen', time: '3:30 PM', topic: 'Progress Review' },
    { client: 'Emily Davis', time: '5:00 PM', topic: 'Career Planning' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="desktop-section-header">
        <div className="desktop-flex-between">
          <div>
            <h1 className="desktop-heading-primary">Coach Dashboard</h1>
            <p className="desktop-text-body mt-2">
              Welcome back! Here's what's happening with your coaching practice.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="desktop-button-secondary">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
            <Button className="desktop-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="desktop-grid-auto-fit">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Client Activity */}
        <Card className="desktop-card">
          <CardHeader>
            <div className="desktop-flex-between">
              <CardTitle className="desktop-heading-secondary">Recent Client Activity</CardTitle>
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
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {activity.client.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.client}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="mb-1">
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="desktop-card">
          <CardHeader>
            <div className="desktop-flex-between">
              <CardTitle className="desktop-heading-secondary">Today's Sessions</CardTitle>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{session.client}</p>
                      <p className="text-sm text-gray-600">{session.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{session.time}</p>
                    <Button variant="ghost" size="sm" className="mt-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="desktop-card">
        <CardHeader>
          <CardTitle className="desktop-heading-secondary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="desktop-grid-auto-fill">
            <Button variant="outline" className="desktop-button-secondary h-20 flex-col space-y-2">
              <BookOpen className="w-6 h-6" />
              <span>Create Course</span>
            </Button>
            <Button variant="outline" className="desktop-button-secondary h-20 flex-col space-y-2">
              <Calendar className="w-6 h-6" />
              <span>Schedule Session</span>
            </Button>
            <Button variant="outline" className="desktop-button-secondary h-20 flex-col space-y-2">
              <MessageSquare className="w-6 h-6" />
              <span>Message Clients</span>
            </Button>
            <Button variant="outline" className="desktop-button-secondary h-20 flex-col space-y-2">
              <TrendingUp className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachDashboard;
