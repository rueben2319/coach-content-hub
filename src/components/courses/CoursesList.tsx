
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  subscription_price: number | null;
  currency: string;
  category: string;
  tags: string[] | null;
  estimated_duration: number;
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
        />
      </CardContent>
    </Card>
  );
};

export default CoursesList;
