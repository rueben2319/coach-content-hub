
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EnrollmentData {
  course_id: string;
  amount: number;
  currency: string;
}

export const useCourseEnrollment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollmentData: EnrollmentData) => {
      if (!user) throw new Error('User must be authenticated to enroll');

      // Create enrollment record
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          client_id: user.id,
          course_id: enrollmentData.course_id,
          amount: enrollmentData.amount,
          currency: enrollmentData.currency,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (enrollmentError) throw enrollmentError;

      return enrollment;
    },
    onSuccess: (enrollment) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['client-enrollments'] });
      
      toast({
        title: 'Enrollment Created',
        description: 'Your enrollment has been created. Please complete payment to access the course.',
      });

      return enrollment;
    },
    onError: (error: any) => {
      toast({
        title: 'Enrollment Failed',
        description: error.message || 'Failed to create enrollment',
        variant: 'destructive',
      });
    },
  });
};

export const useCompleteEnrollment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { data, error } = await supabase
        .from('enrollments')
        .update({ 
          payment_status: 'completed',
          enrolled_at: new Date().toISOString()
        })
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['client-enrollments'] });
      
      toast({
        title: 'Enrollment Completed',
        description: 'Welcome to the course! You can now access all content.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete enrollment',
        variant: 'destructive',
      });
    },
  });
};
