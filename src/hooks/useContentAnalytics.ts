
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContentAnalytics {
  id: string;
  content_id: string;
  user_id: string;
  view_duration: number;
  completion_percentage: number;
  interactions_count: number;
  last_viewed_at: string;
  created_at: string;
  session_data: any;
}

export const useContentAnalytics = (contentId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['content-analytics', contentId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('content_analytics')
        .select('*')
        .order('last_viewed_at', { ascending: false });

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as ContentAnalytics[];
    },
    enabled: !!user?.id,
  });
};

export const useTrackContentView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (analyticsData: Omit<ContentAnalytics, 'id' | 'created_at' | 'last_viewed_at'>) => {
      const { data, error } = await supabase
        .from('content_analytics')
        .insert([analyticsData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-analytics'] });
    },
  });
};
