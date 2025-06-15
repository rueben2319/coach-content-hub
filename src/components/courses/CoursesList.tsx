
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Eye, DollarSign, Clock, Users } from 'lucide-react';

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
  onCreateNew?: () => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ onEditCourse, onCreateNew }) => {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading courses: {error.message}</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
        <p className="text-gray-500 mb-6">Create your first course to get started!</p>
        <Button onClick={onCreateNew}>Create Your First Course</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button onClick={onCreateNew}>Create New Course</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <Badge variant={course.is_published ? "default" : "secondary"}>
                  {course.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.short_description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {course.pricing_model === 'one_time' 
                      ? `$${course.price}`
                      : `$${course.price} / $${course.subscription_price}/mo`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.estimated_duration}min</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {course.difficulty_level}
                </Badge>
              </div>

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{course.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCourse?.(course)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
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
