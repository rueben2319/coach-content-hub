
import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Clock,
  Play,
  Calendar,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

const ClientDashboard = () => {
  const stats = [
    {
      icon: BookOpen,
      title: 'Courses Enrolled',
      value: 6,
      trend: 20,
      color: 'blue' as const
    },
    {
      icon: Target,
      title: 'Goals Completed',
      value: 12,
      maxValue: 15,
      trend: 33,
      color: 'emerald' as const
    },
    {
      icon: Trophy,
      title: 'Achievements',
      value: 8,
      trend: 60,
      color: 'purple' as const
    },
    {
      icon: Clock,
      title: 'Study Hours',
      value: '24h',
      trend: 15,
      color: 'rose' as const
    }
  ];

  const currentCourses = [
    { 
      title: 'Advanced Leadership Skills', 
      progress: 75, 
      nextLesson: 'Module 4: Team Dynamics',
      coach: 'Sarah Wilson'
    },
    { 
      title: 'Personal Development Mastery', 
      progress: 45, 
      nextLesson: 'Module 2: Goal Setting',
      coach: 'Mike Johnson'
    },
    { 
      title: 'Communication Excellence', 
      progress: 90, 
      nextLesson: 'Final Assessment',
      coach: 'Emily Davis'
    }
  ];

  const upcomingGoals = [
    { goal: 'Complete Leadership Course', deadline: 'Dec 25', status: 'on-track' },
    { goal: 'Practice Public Speaking', deadline: 'Dec 30', status: 'at-risk' },
    { goal: 'Read 2 Business Books', deadline: 'Jan 15', status: 'ahead' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="desktop-section-header">
        <div className="desktop-flex-between">
          <div>
            <h1 className="desktop-heading-primary">Learning Dashboard</h1>
            <p className="desktop-text-body mt-2">
              Continue your learning journey and track your progress.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="desktop-button-secondary">
              <Target className="w-4 h-4 mr-2" />
              My Goals
            </Button>
            <Button className="desktop-button-primary">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Courses
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Current Courses - Takes 2 columns */}
        <div className="xl:col-span-2">
          <Card className="desktop-card">
            <CardHeader>
              <div className="desktop-flex-between">
                <CardTitle className="desktop-heading-secondary">Continue Learning</CardTitle>
                <Button variant="ghost" size="sm">
                  View All Courses
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentCourses.map((course, index) => (
                  <div key={index} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">with {course.coach}</p>
                        <p className="text-sm text-blue-600 font-medium">Next: {course.nextLesson}</p>
                      </div>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {course.progress}% Complete
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{course.progress}% completed</span>
                        <Button size="sm" className="desktop-button-primary">
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Goals */}
        <Card className="desktop-card">
          <CardHeader>
            <div className="desktop-flex-between">
              <CardTitle className="desktop-heading-secondary">My Goals</CardTitle>
              <Button variant="ghost" size="sm">
                <Target className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingGoals.map((goal, index) => (
                <div key={index} className="p-4 border rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{goal.goal}</h4>
                    <Badge 
                      variant={goal.status === 'on-track' ? 'default' : goal.status === 'ahead' ? 'outline' : 'destructive'}
                      className="text-xs"
                    >
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">Due: {goal.deadline}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Target className="w-4 h-4 mr-2" />
                Set New Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="desktop-card">
          <CardHeader>
            <CardTitle className="desktop-heading-secondary">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed "Team Leadership" module</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Received feedback from Sarah Wilson</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Achieved "Consistent Learner" badge</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="desktop-card">
          <CardHeader>
            <CardTitle className="desktop-heading-secondary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start desktop-button-secondary">
                <Calendar className="w-4 h-4 mr-3" />
                Schedule Coaching Session
              </Button>
              <Button variant="outline" className="w-full justify-start desktop-button-secondary">
                <MessageSquare className="w-4 h-4 mr-3" />
                Message My Coach
              </Button>
              <Button variant="outline" className="w-full justify-start desktop-button-secondary">
                <TrendingUp className="w-4 h-4 mr-3" />
                View Progress Report
              </Button>
              <Button variant="outline" className="w-full justify-start desktop-button-secondary">
                <Trophy className="w-4 h-4 mr-3" />
                View Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
