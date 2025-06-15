
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, DollarSign } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  short_description: string;
  price: number;
  currency: string;
  is_published: boolean;
  thumbnail_url?: string;
}

interface CourseBundleSelectorProps {
  selectedCourses: string[];
  onCoursesChange: (courses: string[]) => void;
}

const CourseBundleSelector: React.FC<CourseBundleSelectorProps> = ({
  selectedCourses,
  onCoursesChange
}) => {
  const { user } = useAuth();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['coach-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, short_description, price, currency, is_published, thumbnail_url')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
    enabled: !!user?.id,
  });

  const handleCourseToggle = (courseId: string, checked: boolean) => {
    if (checked) {
      onCoursesChange([...selectedCourses, courseId]);
    } else {
      onCoursesChange(selectedCourses.filter(id => id !== courseId));
    }
  };

  const calculateTotalValue = () => {
    if (!courses) return 0;
    return courses
      .filter(course => selectedCourses.includes(course.id))
      .reduce((total, course) => total + course.price, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Courses for Bundle</CardTitle>
        <CardDescription>
          Choose which courses to include in this bundle
          {selectedCourses.length > 0 && (
            <span className="ml-2">
              • {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
              • Total value: ${calculateTotalValue().toFixed(2)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!courses || courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No courses available. Create some courses first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedCourses.includes(course.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={course.id}
                    checked={selectedCourses.includes(course.id)}
                    onCheckedChange={(checked) => 
                      handleCourseToggle(course.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <label htmlFor={course.id} className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm line-clamp-1">{course.title}</h4>
                        <div className="flex items-center space-x-2 ml-2">
                          <Badge variant={course.is_published ? "default" : "secondary"}>
                            {course.is_published ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            <DollarSign className="h-3 w-3" />
                            {course.price}
                          </span>
                        </div>
                      </div>
                      {course.short_description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {course.short_description}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseBundleSelector;
