
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const Goals = () => {
  // Mock data for now - will be replaced with real data later
  const goals = [
    {
      id: '1',
      title: 'Complete JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming',
      progress: 75,
      target_date: '2024-01-15',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Learn React Framework',
      description: 'Build modern web applications with React',
      progress: 30,
      target_date: '2024-02-01',
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Master TypeScript',
      description: 'Add type safety to JavaScript projects',
      progress: 100,
      target_date: '2023-12-20',
      status: 'completed',
      priority: 'high'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Goals</h1>
          <p className="text-gray-600 mt-2">Track your learning objectives and progress</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getStatusIcon(goal.status)}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {goal.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {goal.description}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs ml-2 flex-shrink-0 ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm mt-auto">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                  <Badge 
                    variant={goal.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {goal.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
          <p className="text-gray-600 mb-4">Start setting learning goals to track your progress</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default Goals;
