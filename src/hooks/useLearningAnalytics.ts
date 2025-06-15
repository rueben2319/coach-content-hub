
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LearningAnalytics {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  total_study_time: number;
  courses_started: number;
  courses_completed: number;
  content_consumed: number;
  average_session_duration: number;
  engagement_score: number;
  skills_gained: any[];
  weak_areas: any[];
  strong_areas: any[];
  created_at: string;
}

export const useLearningAnalytics = (userId?: string, periodStart?: string, periodEnd?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['learning-analytics', targetUserId, periodStart, periodEnd],
    queryFn: async () => {
      let query = supabase
        .from('learning_analytics')
        .select('*')
        .eq('user_id', targetUserId!)
        .order('period_start', { ascending: false });

      if (periodStart && periodEnd) {
        query = query
          .gte('period_start', periodStart)
          .lte('period_end', periodEnd);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as LearningAnalytics[];
    },
    enabled: !!targetUserId,
  });
};

export const useGenerateAnalytics = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, startDate, endDate }: { userId: string; startDate: string; endDate: string }) => {
      const { data, error } = await supabase.rpc('calculate_learning_analytics', {
        _user_id: userId,
        _start_date: startDate,
        _end_date: endDate
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Analytics generated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['learning-analytics'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error generating analytics',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
