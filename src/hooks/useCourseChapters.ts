
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseChapter {
  id: string;
  module_id: string; // Updated from course_id to module_id
  title: string;
  description?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useCourseChapters = (moduleId: string) => {
  return useQuery({
    queryKey: ['course-chapters', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as CourseChapter[];
    },
    enabled: !!moduleId,
  });
};

export const useCreateChapter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterData: Omit<CourseChapter, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('lessons')
        .insert([chapterData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Chapter created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['course-chapters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating chapter',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateChapter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<CourseChapter> & { id: string }) => {
      const { data, error } = await supabase
        .from('lessons')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Chapter updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['course-chapters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating chapter',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
