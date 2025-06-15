
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseChapter {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useCourseChapters = (courseId: string) => {
  return useQuery({
    queryKey: ['course-chapters', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_chapters')
        .select('*')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as CourseChapter[];
    },
    enabled: !!courseId,
  });
};

export const useCreateChapter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterData: Omit<CourseChapter, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('course_chapters')
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
        .from('course_chapters')
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
