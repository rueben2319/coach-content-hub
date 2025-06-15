
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LearningStreak {
  id: string;
  user_id: string;
  streak_type: 'daily' | 'weekly' | 'monthly';
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  total_activities: number;
  created_at: string;
  updated_at: string;
}

export const useLearningStreaks = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['learning-streaks', targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', targetUserId!)
        .order('streak_type', { ascending: true });
      
      if (error) throw error;
      return data as LearningStreak[];
    },
    enabled: !!targetUserId,
  });
};

export const useUpdateStreak = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('update_learning_streak', {
        _user_id: userId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-streaks'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating streak',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
