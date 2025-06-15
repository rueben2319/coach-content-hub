
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CourseDownload {
  id: string;
  user_id: string;
  content_id: string;
  download_url: string;
  expires_at?: string;
  download_count?: number;
  max_downloads?: number;
  created_at: string;
}

export const useCourseDownloads = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['course-downloads', targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_downloads')
        .select('*')
        .eq('user_id', targetUserId!)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CourseDownload[];
    },
    enabled: !!targetUserId,
  });
};

export const useCreateDownload = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (downloadData: Omit<CourseDownload, 'id' | 'created_at' | 'download_count'>) => {
      const { data, error } = await supabase
        .from('course_downloads')
        .insert([{
          ...downloadData,
          download_count: 0,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-downloads'] });
      toast({
        title: 'Download prepared',
        description: 'Your download link has been generated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error preparing download',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useIncrementDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (downloadId: string) => {
      // First get the current download count
      const { data: currentData, error: fetchError } = await supabase
        .from('course_downloads')
        .select('download_count')
        .eq('id', downloadId)
        .single();

      if (fetchError) throw fetchError;

      // Increment the count
      const newCount = (currentData.download_count || 0) + 1;

      const { data, error } = await supabase
        .from('course_downloads')
        .update({ 
          download_count: newCount
        })
        .eq('id', downloadId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-downloads'] });
    },
  });
};
