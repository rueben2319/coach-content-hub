
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, TrendingUp, Award, Play, Clock, Star } from 'lucide-react';

const ClientDashboard = () => {
  const stats = [
    { title: 'Enrolled Coaches', value: '3', change: 'Active subscriptions', icon: Users, color: 'text-blue-600' },
    { title: 'Content Accessed', value: '28', change: 'This month', icon: BookOpen, color: 'text-green-600' },
    { title: 'Progress Score', value: '85%', change: '+12% this week', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Achievements', value: '7', change: '2 new badges', icon: Award, color: 'text-orange-600' },
  ];

  const recommendedContent = [
    { 
      title: 'Morning Meditation Practice', 
      coach: 'Sarah Johnson', 
      duration: '15 min', 
      rating: 4.9,
      type: 'video',
      difficulty: 'Beginner'
    },
    { 
      title: 'Goal Setting Workshop', 
      coach: 'Michael Brown', 
      duration: '45 min', 
      rating: 4.8,
      type: 'workshop',
      difficulty: 'Intermediate'
    },
    { 
      title: 'Stress Management Guide', 
      coach: 'Emily Davis', 
      duration: '20 min', 
      rating: 4.7,
      type: 'article',
      difficulty: 'Beginner'
    },
    { 
      title: 'Advanced Life Planning', 
      coach: 'Sarah Johnson', 
      duration: '60 min', 
      rating: 4.9,
      type: 'course',
      difficulty: 'Advanced'
    },
  ];

  const myCoaches = [
    { 
      name: 'Sarah Johnson', 
      specialty: 'Life Coaching', 
      nextSession: 'Tomorrow 2:00 PM',
      progress: 85,
      rating: 4.9
    },
    { 
      name: 'Michael Brown', 
      specialty: 'Career Development', 
      nextSession: 'Friday 10:00 AM',
      progress: 72,
      rating: 4.8
    },
    { 
      name: 'Emily Davis', 
      specialty: 'Wellness Coaching', 
      nextSession: 'Next Monday 3:00 PM',
      progress: 94,
      rating: 4.7
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
        <p className="text-gray-600 mt-2">Continue your personal development journey</p>
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
        {/* Recommended Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recommended for You</CardTitle>
            <Button variant="outline" size="sm">Browse All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{content.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {content.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">by {content.coach}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {content.duration}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {content.rating}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {content.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" className="ml-4">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Coaches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Coaches</CardTitle>
            <Button variant="outline" size="sm">Find More</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCoaches.map((coach, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {coach.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{coach.name}</p>
                        <p className="text-sm text-gray-600">{coach.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{coach.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900">{coach.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        style={{ width: `${coach.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Next session: {coach.nextSession}</p>
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

export default ClientDashboard;
