
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
      color: 'text-blue-600' 
    },
    { 
      title: 'Content Accessed', 
      value: progressData.reduce((sum, p) => sum + p.completed_content, 0).toString(), 
      change: 'Lessons completed', 
      icon: Award, 
      color: 'text-green-600' 
    },
    { 
      title: 'Average Progress', 
      value: progressData.length > 0 
        ? `${Math.round(progressData.reduce((sum, p) => sum + p.progress_percentage, 0) / progressData.length)}%`
        : '0%', 
      change: 'Across all courses', 
      icon: TrendingUp, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Courses Completed', 
      value: progressData.filter(p => p.progress_percentage === 100).length.toString(), 
      change: 'Fully completed', 
      icon: Award, 
      color: 'text-orange-600' 
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
        {/* My Courses */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg md:text-xl">My Courses</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Link to="/client/content">Browse More</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {enrollments.slice(0, 4).map((enrollment) => {
                  const progress = getCourseProgress(enrollment.id);
                  return (
                    <div key={enrollment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:shadow-md transition-shadow space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {enrollment.course.title}
                          </h3>
                          {enrollment.course.difficulty_level && (
                            <Badge variant="outline" className="text-xs">
                              {enrollment.course.difficulty_level}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          by {getInstructorName(enrollment.course)}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(enrollment.course.estimated_duration || 0)}
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {progress}% complete
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full sm:w-auto sm:ml-4" asChild>
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
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
                <Button asChild>
                  <Link to="/client/content">Browse Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {enrollments.slice(0, 3).map((enrollment) => {
                  const progress = getCourseProgress(enrollment.id);
                  return (
                    <div key={enrollment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {enrollment.course.title.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {enrollment.course.title}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {getInstructorName(enrollment.course)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
