
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PublishingWorkflow {
  id: string;
  course_id?: string;
  content_id?: string;
  workflow_type: 'course' | 'content';
  status: 'pending' | 'approved' | 'rejected' | 'published';
  submitted_by: string;
  approved_by?: string;
  submitted_at: string;
  approved_at?: string;
  rejection_reason?: string;
  approval_notes?: string;
}

export const usePublishingWorkflows = (courseId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['publishing-workflows', courseId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('publishing_workflows')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as PublishingWorkflow[];
    },
    enabled: !!user?.id,
  });
};

export const useSubmitForApproval = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowData: Omit<PublishingWorkflow, 'id' | 'submitted_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('publishing_workflows')
        .insert([{ ...workflowData, status: 'pending' as const }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Submitted for approval!' });
      queryClient.invalidateQueries({ queryKey: ['publishing-workflows'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting for approval',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
