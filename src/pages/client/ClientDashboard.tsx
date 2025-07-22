import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, TrendingUp, Award, Play, Clock, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface EnrollmentWithCourse {
  id: string;
  enrolled_at: string;
  payment_status: string;
  course: {
    id: string;
    title: string;
    description: string;
    estimated_duration: number;
    difficulty_level: string;
    coach: {
      first_name: string;
      last_name: string;
    };
  };
}

interface CourseProgress {
  course_id: string;
  completed_content: number;
  total_content: number;
  progress_percentage: number;
}

const ClientDashboard = () => {
  const { user } = useAuth();

  // Fetch user enrollments with course data
  const { data: enrollments = [] } = useQuery({
    queryKey: ['client-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          payment_status,
          course:course_id (
            id,
            title,
            description,
            estimated_duration,
            difficulty_level,
            coach:profiles!coach_id (
              first_name,
              last_name
            )
          )
        `)
        .eq('client_id', user.id)
        .eq('payment_status', 'completed')
        .order('enrolled_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).filter(enrollment => enrollment.course) as EnrollmentWithCourse[];
    },
    enabled: !!user?.id,
  });

  // Fetch progress data for enrolled courses
  const { data: progressData = [] } = useQuery({
    queryKey: ['client-progress', user?.id],
    queryFn: async () => {
      if (!user?.id || enrollments.length === 0) return [];
      
      const enrollmentIds = enrollments.map(e => e.id);
      
      const { data, error } = await supabase
        .from('course_progress')
        .select('enrollment_id, content_id, completed')
        .in('enrollment_id', enrollmentIds);
      
      if (error) throw error;
      
      // Calculate progress per course
      const progressByEnrollment = data.reduce((acc, progress) => {
        if (!acc[progress.enrollment_id]) {
          acc[progress.enrollment_id] = { total: 0, completed: 0 };
        }
        acc[progress.enrollment_id].total++;
        if (progress.completed) {
          acc[progress.enrollment_id].completed++;
        }
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);
      
      return Object.entries(progressByEnrollment).map(([enrollmentId, stats]) => ({
        enrollment_id: enrollmentId,
        completed_content: stats.completed,
        total_content: stats.total,
        progress_percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      }));
    },
    enabled: !!user?.id && enrollments.length > 0,
  });

  // Calculate dashboard stats
  const stats = [
    { 
      title: 'Enrolled Courses', 
      value: enrollments.length.toString(), 
      change: 'Active enrollments', 
      icon: BookOpen, 
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    { 
      title: 'Content Accessed', 
      value: progressData.reduce((sum, p) => sum + p.completed_content, 0).toString(), 
      change: 'Lessons completed', 
      icon: Award, 
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    { 
      title: 'Average Progress', 
      value: progressData.length > 0 
        ? `${Math.round(progressData.reduce((sum, p) => sum + p.progress_percentage, 0) / progressData.length)}%`
        : '0%', 
      change: 'Across all courses', 
      icon: TrendingUp, 
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      title: 'Courses Completed', 
      value: progressData.filter(p => p.progress_percentage === 100).length.toString(), 
      change: 'Fully completed', 
      icon: Award, 
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    },
  ];

  const getInstructorName = (course: EnrollmentWithCourse['course']) => {
    const { first_name, last_name } = course.coach || {};
    return `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown Instructor';
  };

  const getCourseProgress = (enrollmentId: string) => {
    const progress = progressData.find(p => p.enrollment_id === enrollmentId);
    return progress?.progress_percentage || 0;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            My Learning Dashboard
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Continue your personal development journey
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white border-slate-200 hover:shadow-medium transition-all duration-200 card-elevated">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-600 truncate mb-2">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-emerald-600 mt-1 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ml-3 shadow-sm ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-xl font-semibold">My Courses</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200" asChild>
              <Link to="/client/browse">Browse More</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.slice(0, 4).map((enrollment) => {
                  const progress = getCourseProgress(enrollment.id);
                  return (
                    <div key={enrollment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 space-y-3 sm:space-y-0 group">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {enrollment.course.title}
                          </h3>
                          {enrollment.course.difficulty_level && (
                            <Badge variant="outline" className="text-xs font-medium border-primary-200 text-primary-700">
                              {enrollment.course.difficulty_level}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          by {getInstructorName(enrollment.course)}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1.5" />
                            <span className="font-medium">{formatDuration(enrollment.course.estimated_duration || 0)}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1.5" />
                            <span className="font-medium">{progress}% complete</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full sm:w-auto sm:ml-4 bg-primary hover:bg-primary-600 transition-colors" asChild>
                        <Link to={`/client/courses/${enrollment.course.id}`}>
                          <Play className="w-4 h-4 mr-2 sm:mr-0" />
                          <span className="sm:hidden">Continue</span>
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">You haven't enrolled in any courses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start your learning journey by browsing our course catalog and finding something that interests you.
                </p>
                <Button asChild className="bg-primary hover:bg-primary-600 transition-colors">
                  <Link to="/client/browse">Browse Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.slice(0, 3).map((enrollment) => {
                  const progress = getCourseProgress(enrollment.id);
                  return (
                    <div key={enrollment.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                            {enrollment.course.title.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {enrollment.course.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {getInstructorName(enrollment.course)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="text-foreground font-semibold">{progress}%</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                          Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">No recent activity</h3>
                <p className="text-muted-foreground">Start learning to see your activity here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
