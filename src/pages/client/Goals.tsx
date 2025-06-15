
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
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-primary-600" />;
      default:
        return <Target className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'status-error';
      case 'medium':
        return 'status-warning';
      case 'low':
        return 'status-success';
      default:
        return 'bg-secondary-100 text-secondary-700 border border-secondary-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success-500';
    if (progress >= 50) return 'bg-warning-500';
    return 'bg-primary-500';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">My Goals</h1>
          <p className="text-lg text-muted-foreground">Track your learning objectives and celebrate your progress</p>
        </div>
        <Button className="touch-target bg-primary hover:bg-primary-600 transition-colors w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </Button>
      </div>

      <div className="three-column-grid">
        {goals.map((goal) => (
          <Card key={goal.id} className="card-interactive card-soft h-full flex flex-col group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                    {getStatusIcon(goal.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {goal.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs font-medium flex-shrink-0 ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col pt-0">
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-medium text-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{goal.progress}%</span>
                  </div>
                  <Progress 
                    value={goal.progress} 
                    className="h-2"
                    style={{
                      background: `linear-gradient(to right, ${getProgressColor(goal.progress)} ${goal.progress}%, hsl(var(--muted)) ${goal.progress}%)`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-border">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span className="font-medium">
                      Target: {new Date(goal.target_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <Badge 
                    variant={goal.status === 'completed' ? 'default' : 'secondary'}
                    className={`text-xs font-medium ${
                      goal.status === 'completed' 
                        ? "status-success" 
                        : "bg-secondary-100 text-secondary-700 border border-secondary-200"
                    }`}
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
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Target className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">No goals set yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start setting learning goals to track your progress and stay motivated on your journey.
          </p>
          <Button className="touch-target bg-primary hover:bg-primary-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default Goals;
