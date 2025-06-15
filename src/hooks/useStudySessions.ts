
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface StudySession {
  id: string;
  user_id: string;
  course_id?: string;
  content_id?: string;
  started_at: string;
  ended_at?: string;
  duration: number;
  activities: any[];
  focus_score?: number;
  break_count: number;
  session_quality?: 'poor' | 'fair' | 'good' | 'excellent';
}

export const useStudySessions = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['study-sessions', targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', targetUserId!)
        .order('started_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as StudySession[];
    },
    enabled: !!targetUserId,
  });
};

export const useStartStudySession = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData: Omit<StudySession, 'id' | 'started_at' | 'duration'>) => {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{ ...sessionData, duration: 0 }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error starting study session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useEndStudySession = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, duration, ...updateData }: { id: string; duration: number } & Partial<StudySession>) => {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration,
          ...updateData
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Study session completed!' });
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['learning-streaks'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error ending study session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
