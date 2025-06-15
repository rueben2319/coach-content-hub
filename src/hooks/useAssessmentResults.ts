
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AssessmentResult {
  id: string;
  user_id: string;
  content_id: string;
  assessment_type: 'quiz' | 'assignment' | 'final_exam';
  score: number;
  max_score: number;
  passed: boolean;
  attempts: number;
  time_spent: number;
  answers: any[];
  feedback?: string;
  submitted_at: string;
}

export const useAssessmentResults = (userId?: string, contentId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['assessment-results', targetUserId, contentId],
    queryFn: async () => {
      let query = supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', targetUserId!)
        .order('submitted_at', { ascending: false });

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as AssessmentResult[];
    },
    enabled: !!targetUserId,
  });
};

export const useSubmitAssessment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentData: Omit<AssessmentResult, 'id' | 'submitted_at'>) => {
      const { data, error } = await supabase
        .from('assessment_results')
        .insert([assessmentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const passedMessage = data.passed ? 'Assessment passed!' : 'Assessment completed. Try again to improve your score.';
      toast({ 
        title: passedMessage,
        description: `Score: ${data.score}/${data.max_score}` 
      });
      queryClient.invalidateQueries({ queryKey: ['assessment-results'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting assessment',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
