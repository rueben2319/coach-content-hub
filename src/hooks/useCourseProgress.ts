
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CourseProgress {
  id: string;
  content_id: string;
  enrollment_id: string;
  progress_percentage?: number;
  completed?: boolean;
  completed_at?: string;
  last_accessed?: string;
  time_spent?: number;
  resume_position?: number;
  bookmarks?: any[];
  speed_preference?: number;
  quality_preference?: string;
  notes?: string;
  session_id?: string;
  learning_path_id?: string;
  satisfaction_rating?: number;
  difficulty_rating?: number;
  created_at: string;
  updated_at: string;
}

export const useCourseProgress = (enrollmentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-progress', enrollmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as CourseProgress[];
    },
    enabled: !!user?.id && !!enrollmentId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progressData: Partial<CourseProgress> & { content_id: string; enrollment_id: string }) => {
      const { data, error } = await supabase
        .from('course_progress')
        .upsert({
          ...progressData,
          last_accessed: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-progress', data.enrollment_id] });
    },
    onError: (error: any) => {
      console.error('Error updating progress:', error);
    },
  });
};

export const useContentProgress = (contentId: string, enrollmentId: string) => {
  return useQuery({
    queryKey: ['content-progress', contentId, enrollmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('content_id', contentId)
        .eq('enrollment_id', enrollmentId)
        .maybeSingle();
      
      if (error) throw error;
      return data as CourseProgress | null;
    },
    enabled: !!contentId && !!enrollmentId,
  });
};
