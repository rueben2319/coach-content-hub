
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Eye, DollarSign, Clock, Users, BookOpen, Settings, AlertTriangle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  subscription_price: number | null;
  currency: string;
  is_published: boolean;
  category: string;
  tags: string[] | null;
  estimated_duration: number;
  difficulty_level: string;
  created_at: string;
}

interface CoursesListProps {
  onEditCourse?: (course: Course) => void;
  onPreviewCourse?: (course: Course) => void;
  onManageContent?: (course: Course) => void;
  onCreateNew?: () => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ 
  onEditCourse, 
  onPreviewCourse, 
  onManageContent, 
  onCreateNew 
}) => {
  const { user } = useAuth();

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
    enabled: !!user,
  });

  // Detect access denied errors and render upgrade prompt for unsubscribed/expired coaches
  const isAccessDenied = error && (error.code === '42501' || 
    (typeof error.message === 'string' && (
      error.message.toLowerCase().includes('permission denied') || 
      error.message.toLowerCase().includes('access denied') ||
      error.message.toLowerCase().includes('row level security policy') // covers "new row violates row-level security policy"
    ))
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isAccessDenied) {
    return (
      <Card className="border-orange-200 bg-orange-50 my-8">
        <CardContent className="py-8 flex flex-col items-center text-center gap-4">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          <div className="font-semibold text-orange-800 text-lg">Access Restricted</div>
          <p className="text-sm text-orange-700 max-w-md">
            Your subscription has expired or is inactive.<br />
            Please subscribe or renew your plan to unlock course management features.
          </p>
          <Button onClick={() => window.location.href = '/coach'} className="mt-1">
            Upgrade Subscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-sm sm:text-base">Error loading courses: {error.message}</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6">Create your first course to get started!</p>
          <Button onClick={onCreateNew} className="w-full sm:w-auto">Create Your First Course</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">My Courses</h2>
        <Button onClick={onCreateNew} className="w-full sm:w-auto">Create New Course</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-sm sm:text-lg line-clamp-2 min-w-0 break-words">{course.title}</CardTitle>
                <Badge variant={course.is_published ? "default" : "secondary"} className="text-xs flex-shrink-0">
                  {course.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                {course.short_description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {course.pricing_model === 'one_time' 
                      ? `$${course.price}`
                      : `$${course.price} / $${course.subscription_price}/mo`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{course.estimated_duration}min</span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Badge variant="outline" className="text-xs truncate max-w-20 sm:max-w-none">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {course.difficulty_level}
                </Badge>
              </div>

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs truncate max-w-16 sm:max-w-none">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{course.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCourse?.(course)}
                    className="w-full text-xs sm:text-sm"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewCourse?.(course)}
                    className="w-full text-xs sm:text-sm"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManageContent?.(course)}
                  className="w-full text-xs sm:text-sm"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Manage Content
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesList;

