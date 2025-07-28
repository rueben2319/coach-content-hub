
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CourseProgress {
  user_id: string;
  section_id: string;
  is_completed: boolean;
  completed_at?: string;
}

export const useCourseProgress = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-progress', courseId, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as CourseProgress[];
    },
    enabled: !!user?.id && !!courseId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progressData: Partial<CourseProgress> & { user_id: string; section_id: string }) => {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: progressData.user_id,
          section_id: progressData.section_id,
          is_completed: progressData.is_completed ?? false,
          completed_at: progressData.is_completed ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-progress'] });
    },
    onError: (error: any) => {
      console.error('Error updating progress:', error);
    },
  });
};

export const useSectionProgress = (sectionId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['section-progress', sectionId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('section_id', sectionId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as CourseProgress | null;
    },
    enabled: !!sectionId && !!user?.id,
  });
};
