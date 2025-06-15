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

      console.log('Fetching subscription for user:', user.id);

      const { data, error } = await supabase
        .from('coach_subscriptions')
        .select('*')
        .eq('coach_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Subscription query error:', error);
        throw error;
      }

      console.log('Subscription data:', data);
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

      console.log('Fetching usage for user:', user.id);

      // Get course count and course IDs
      const { data: coursesData, count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: false })
        .eq('coach_id', user.id);

      if (coursesError) {
        console.error('Courses query error:', coursesError);
        throw coursesError;
      }

      const courseIds = (coursesData || []).map((course: { id: string }) => course.id);

      let studentsCount = 0;
      if (courseIds.length > 0) {
        // Get student count (unique enrollments for these courses)
        const { count: studentsCnt, error: studentsError } = await supabase
          .from('enrollments')
          .select('client_id', { count: 'exact', head: true })
          .in('course_id', courseIds);

        if (studentsError) {
          console.error('Students query error:', studentsError);
          throw studentsError;
        }

        studentsCount = studentsCnt || 0;
      }

      const usage = {
        coursesCreated: coursesCount || 0,
        studentsEnrolled: studentsCount,
        storageUsedMB: 0, // TODO: Calculate actual storage usage
      } as SubscriptionUsage;

      console.log('Usage data:', usage);
      return usage;
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coach-subscription'] });
      
      // Redirect to PayChangu payment page
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
        toast({
          title: 'Payment initiated',
          description: 'Please complete your payment in the new tab. Your subscription will be activated automatically.',
        });
      }
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
