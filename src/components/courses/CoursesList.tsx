
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CoursesGrid from './CoursesGrid';
import SubscriptionUpgradePrompt from './SubscriptionUpgradePrompt';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  is_published: boolean;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  image?: string;
  category_id?: string;
  tags: string[] | null;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

interface CoursesListProps {
  onCreateNew: () => void;
  onEditCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onManageContent: (course: Course) => void;
}

const CoursesList: React.FC<CoursesListProps> = ({
  onCreateNew,
  onEditCourse,
  onPreviewCourse,
  onManageContent,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

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

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('coach_id', user?.id); // Ensure user can only delete their own courses

      if (error) throw error;
      return courseId;
    },
    onSuccess: (courseId) => {
      // Invalidate and refetch courses
      queryClient.invalidateQueries({ queryKey: ['courses', user?.id] });
      
      toast({
        title: "Course deleted",
        description: "The course has been successfully deleted.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting course",
        description: error.message || "Failed to delete the course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCourse = (course: Course) => {
    deleteCourseMutation.mutate(course.id);
  };

  // Check if error is due to subscription access
  const isSubscriptionError = error && 
    (error.message?.includes('policy') || 
     error.message?.includes('subscription') ||
     (error as any).code === 'PGRST301');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isSubscriptionError) {
    return <SubscriptionUpgradePrompt />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading courses: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>
              Manage and track your course offerings
            </CardDescription>
          </div>
          <Button onClick={onCreateNew}>
            Create New Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CoursesGrid
          courses={courses || []}
          onEditCourse={onEditCourse}
          onPreviewCourse={onPreviewCourse}
          onManageContent={onManageContent}
          onDeleteCourse={handleDeleteCourse}
        />
      </CardContent>
    </Card>
  );
};

export default CoursesList;
