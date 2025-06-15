
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
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
        <p className="text-gray-600 mt-2">Continue your personal development journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} ml-3`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {/* Recommended Content */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg md:text-xl">Recommended for You</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">Browse All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {recommendedContent.map((content, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:shadow-md transition-shadow space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{content.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {content.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">by {content.coach}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
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
                  <Button size="sm" className="w-full sm:w-auto sm:ml-4">
                    <Play className="w-4 h-4 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Play</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Coaches */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg md:text-xl">My Coaches</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">Find More</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {myCoaches.map((coach, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {coach.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{coach.name}</p>
                        <p className="text-sm text-gray-600 truncate">{coach.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
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
                    <p className="text-xs text-gray-600 mt-2 truncate">Next session: {coach.nextSession}</p>
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
