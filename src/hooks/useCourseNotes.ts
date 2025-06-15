
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CourseNote {
  id: string;
  user_id: string;
  course_id: string;
  content_id?: string;
  note_title?: string;
  note_text: string;
  timestamp_seconds?: number;
  created_at: string;
  updated_at: string;
}

export const useCourseNotes = (courseId: string, contentId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-notes', courseId, contentId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('course_notes')
        .select('*')
        .eq('user_id', user!.id)
        .eq('course_id', courseId);

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CourseNote[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteData: Omit<CourseNote, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('course_notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-notes'] });
      toast({
        title: 'Note created',
        description: 'Your note has been saved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating note',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CourseNote> }) => {
      const { data, error } = await supabase
        .from('course_notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-notes'] });
      toast({
        title: 'Note updated',
        description: 'Your changes have been saved',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating note',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('course_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-notes'] });
      toast({
        title: 'Note deleted',
        description: 'Your note has been removed',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting note',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
