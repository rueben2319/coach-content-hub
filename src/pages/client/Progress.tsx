
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BookOpen, Clock, Award, Calendar } from 'lucide-react';
import { useClientEnrollments } from '@/hooks/useClientEnrollments';

const ClientProgress = () => {
  const { data: enrollments = [], isLoading } = useClientEnrollments();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading progress...</p>
        </div>
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
        <Card className="card-soft">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{totalCourses}</p>
                <p className="text-sm text-success-600 mt-1">Active enrollments</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{completedCourses}</p>
                <p className="text-sm text-success-600 mt-1">Fully finished</p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{totalCourses - completedCourses}</p>
                <p className="text-sm text-warning-600 mt-1">Currently learning</p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">24</p>
                <p className="text-sm text-primary-600 mt-1">This month</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card className="card-soft">
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
                  <div key={enrollment.id} className="p-4 md:p-6 border border-border rounded-lg hover:shadow-medium transition-all duration-200 group">
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
                          className={`text-xs font-medium ${
                            isCompleted 
                              ? "status-success" 
                              : "bg-secondary-100 text-secondary-700 border border-secondary-200"
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium border-primary-200 text-primary-700">
                          {enrollment.course.difficulty_level || 'Beginner'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
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
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No course progress to display</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enroll in courses to start tracking your learning progress and achievements.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProgress;
