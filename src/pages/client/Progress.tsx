import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BookOpen, Clock, Award, Calendar } from 'lucide-react';
import { useClientEnrollments } from '@/hooks/useClientEnrollments';
import { DashboardCardSkeleton } from '@/components/ui/dashboard-card-skeleton';
import { ProgressCardSkeleton } from '@/components/ui/progress-card-skeleton';
import { EnhancedCard } from '@/components/ui/enhanced-card';

const ClientProgress = () => {
  const { data: enrollments = [], isLoading } = useClientEnrollments();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">My Progress</h1>
          <p className="text-lg text-muted-foreground">Track your learning journey and celebrate achievements</p>
        </div>

        {/* Progress Overview Skeletons */}
        <div className="cards-grid mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>

        {/* Course Progress Skeletons */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="two-column-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProgressCardSkeleton key={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => {
    // Mock completion logic - replace with real progress data
    return Math.random() > 0.7; // 30% chance of being completed
  }).length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getInstructorName = (course: any) => {
    if (!course?.coach) return 'Unknown Instructor';
    return `${course.coach.first_name || ''} ${course.coach.last_name || ''}`.trim() || 'Unknown Instructor';
  };

  const getMockProgress = () => Math.floor(Math.random() * 100);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">My Progress</h1>
        <p className="text-lg text-muted-foreground">Track your learning journey and celebrate achievements</p>
      </div>

      {/* Progress Overview */}
      <div className="cards-grid mb-8">
        <EnhancedCard elevated>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 transition-all duration-300">{totalCourses}</p>
                <p className="text-sm text-success-600 mt-1">Active enrollments</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg transition-all duration-300 hover:bg-primary-100 hover:scale-110">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard elevated>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 transition-all duration-300">{completedCourses}</p>
                <p className="text-sm text-success-600 mt-1">Fully finished</p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg transition-all duration-300 hover:bg-success-100 hover:scale-110">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-success-600" />
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard elevated>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 transition-all duration-300">{totalCourses - completedCourses}</p>
                <p className="text-sm text-warning-600 mt-1">Currently learning</p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg transition-all duration-300 hover:bg-warning-100 hover:scale-110">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard elevated>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1 transition-all duration-300">24</p>
                <p className="text-sm text-primary-600 mt-1">This month</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg transition-all duration-300 hover:bg-secondary-100 hover:scale-110">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </EnhancedCard>
      </div>

      {/* Course Progress */}
      <EnhancedCard elevated>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length > 0 ? (
            <div className="two-column-grid">
              {enrollments.map((enrollment) => {
                const progress = getMockProgress();
                const isCompleted = progress === 100;
                
                return (
                  <EnhancedCard key={enrollment.id} interactive className="h-full">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {enrollment.course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            by {getInstructorName(enrollment.course)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge 
                            variant={isCompleted ? 'default' : 'secondary'} 
                            className={`text-xs font-medium transition-all duration-300 ${
                              isCompleted 
                                ? "status-success hover:bg-success-600" 
                                : "bg-secondary-100 text-secondary-700 border border-secondary-200 hover:bg-secondary-200"
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'In Progress'}
                          </Badge>
                          <Badge variant="outline" className="text-xs font-medium border-primary-200 text-primary-700 transition-colors hover:bg-primary-50">
                            {enrollment.course.difficulty_level || 'Beginner'}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">Progress</span>
                          <span className="font-semibold text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 transition-all duration-500" />
                        
                        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1.5" />
                            <span className="font-medium">{formatDuration(enrollment.course.estimated_duration || 0)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1.5" />
                            <span className="font-medium">
                              Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </EnhancedCard>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105">
                <TrendingUp className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No course progress to display</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enroll in courses to start tracking your learning progress and achievements.
              </p>
            </div>
          )}
        </CardContent>
      </EnhancedCard>
    </div>
  );
};

export default ClientProgress;
