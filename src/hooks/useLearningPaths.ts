
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LearningPath {
  id: string;
  user_id: string;
  course_id: string;
  started_at: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  learning_pace: 'slow' | 'normal' | 'fast';
  goals: any[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useLearningPaths = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['learning-paths', targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_learning_paths')
        .select('*')
        .eq('user_id', targetUserId!)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data as LearningPath[];
    },
    enabled: !!targetUserId,
  });
};

export const useCreateLearningPath = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pathData: Omit<LearningPath, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('user_learning_paths')
        .insert([pathData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Learning path created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating learning path',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateLearningPath = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<LearningPath> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_learning_paths')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Learning path updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating learning path',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
