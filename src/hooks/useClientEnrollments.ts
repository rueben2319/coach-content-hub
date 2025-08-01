
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientEnrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  payment_status: string;
  amount: number;
  currency: string;
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    difficulty_level: string;
    category_id: string;
    coach: {
      first_name: string;
      last_name: string;
    };
  };
}

export const useClientEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['client-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          enrolled_at,
          payment_status,
          amount,
          currency,
          course:course_id (
            id,
            title,
            description,
            price,
            difficulty_level,
            category_id,
            coach:profiles!coach_id (
              first_name,
              last_name
            )
          )
        `)
        .eq('client_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      
      // Filter out enrollments where course is null and ensure proper typing
      return (data || []).filter((enrollment: any) => enrollment.course) as ClientEnrollment[];
    },
    enabled: !!user?.id,
  });
};

export const useClientEnrollment = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['client-enrollment', courseId, user?.id],
    queryFn: async () => {
      if (!user?.id || !courseId) throw new Error('Missing required data');

      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('client_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!courseId,
  });
};
