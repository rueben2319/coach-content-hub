
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
        .in('status', ['active', 'trial', 'inactive']) // Include inactive for canceled subs
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

export const useClientSubscription = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['client-subscription', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      console.log('Fetching client subscription for user:', user.id);

      // For now, return null since we don't have client subscriptions table
      // This can be updated when client subscriptions are implemented
      return null as CoachSubscription | null;
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
      console.log('Creating subscription:', subscriptionData);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      console.log('Calling create-subscription function...');
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: subscriptionData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Subscription creation error:', error);
        throw new Error(error.message || 'Failed to create subscription');
      }
      
      if (!data.success) {
        console.error('Subscription creation failed:', data);
        throw new Error(data.error || 'Failed to create subscription');
      }
      
      console.log('Subscription creation response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Subscription created successfully, redirecting to payment...');
      queryClient.invalidateQueries({ queryKey: ['coach-subscription'] });
      
      if (data.payment_url) {
        console.log('Redirecting to payment URL:', data.payment_url);
        window.open(data.payment_url, '_blank');
        toast({
          title: 'Payment initiated',
          description: 'Please complete your payment in the new tab. Your subscription will be activated automatically.',
        });
      } else {
        console.error('No payment URL received:', data);
        toast({
          title: 'Error',
          description: 'Payment URL not received. Please try again.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      console.error('Subscription creation failed:', error);
      
      let errorMessage = 'Failed to create subscription';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Subscription failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};
