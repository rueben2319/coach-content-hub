
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, TrendingUp, DollarSign, Plus, Eye } from 'lucide-react';

const CoachDashboard = () => {
  const stats = [
    { title: 'My Clients', value: '23', change: '+3 this week', icon: Users, color: 'text-blue-600' },
    { title: 'Content Items', value: '12', change: '+2 this month', icon: BookOpen, color: 'text-green-600' },
    { title: 'Total Views', value: '1,247', change: '+15% this week', icon: Eye, color: 'text-purple-600' },
    { title: 'Monthly Earnings', value: '$3,200', change: '+8% this month', icon: DollarSign, color: 'text-orange-600' },
  ];

  const recentContent = [
    { title: 'Mindfulness Meditation Guide', views: 124, clients: 18, status: 'published', date: '2 days ago' },
    { title: 'Goal Setting Worksheet', views: 89, clients: 15, status: 'published', date: '5 days ago' },
    { title: 'Weekly Check-in Template', views: 67, clients: 12, status: 'draft', date: '1 week ago' },
    { title: 'Stress Management Techniques', views: 156, clients: 22, status: 'published', date: '2 weeks ago' },
  ];

  const recentClients = [
    { name: 'Alice Johnson', joined: '2 days ago', progress: 85, status: 'active' },
    { name: 'Bob Smith', joined: '1 week ago', progress: 72, status: 'active' },
    { name: 'Carol Davis', joined: '2 weeks ago', progress: 94, status: 'active' },
    { name: 'David Wilson', joined: '3 weeks ago', progress: 58, status: 'inactive' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your coaching content and clients</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Content</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{content.title}</p>
                      <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                        {content.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-600">{content.views} views</span>
                      <span className="text-xs text-gray-600">{content.clients} clients</span>
                      <span className="text-xs text-gray-600">{content.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Clients</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">Joined {client.joined}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${client.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{client.progress}%</span>
                    </div>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {client.status}
                    </Badge>
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

export default CoachDashboard;
