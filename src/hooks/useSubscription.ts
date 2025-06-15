
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CoachSubscription, SubscriptionUsage } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

export const useCoachSubscription = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['coach-subscription', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('coach_subscriptions')
        .select('*')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as CoachSubscription | null;
    },
    enabled: !!user,
  });
};

export const useSubscriptionUsage = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscription-usage', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      // Get course count and course IDs
      const { data: coursesData, count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: false })
        .eq('coach_id', user.id);

      if (coursesError) throw coursesError;

      const courseIds = (coursesData || []).map((course: { id: string }) => course.id);

      let studentsCount = 0;
      if (courseIds.length > 0) {
        // Get student count (unique enrollments for these courses)
        const { count: studentsCnt, error: studentsError } = await supabase
          .from('enrollments')
          .select('client_id', { count: 'exact', head: true })
          .in('course_id', courseIds);

        if (studentsError) throw studentsError;

        studentsCount = studentsCnt || 0;
      }

      return {
        coursesCreated: coursesCount || 0,
        studentsEnrolled: studentsCount,
        storageUsedMB: 0, // TODO: Calculate actual storage usage
      } as SubscriptionUsage;
    },
    enabled: !!user,
  });
};

export const useCreateSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionData: {
      tier: string;
      billingCycle: 'monthly' | 'yearly';
    }) => {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: subscriptionData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-subscription'] });
      toast({
        title: 'Subscription created',
        description: 'Your subscription has been successfully created.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Subscription failed',
        description: error.message || 'Failed to create subscription',
        variant: 'destructive',
      });
    },
  });
};
