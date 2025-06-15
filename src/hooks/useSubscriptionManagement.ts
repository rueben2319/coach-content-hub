
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ManageSubscriptionData {
  action: 'upgrade' | 'downgrade' | 'cancel' | 'reactivate';
  newTier?: string;
  newBillingCycle?: 'monthly' | 'yearly';
  cancellationReason?: string;
  effectiveDate?: 'immediate' | 'end_of_period';
}

export const useManageSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ManageSubscriptionData) => {
      console.log('Managing subscription:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session found');

      const { data: result, error } = await supabase.functions.invoke('manage-subscription', {
        body: data,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coach-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
      
      toast({
        title: 'Success',
        description: data.message,
      });
    },
    onError: (error: any) => {
      console.error('Subscription management failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to manage subscription',
        variant: 'destructive',
      });
    },
  });
};

export const useStartTrial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting trial');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session found');

      const { data: result, error } = await supabase.functions.invoke('start-trial', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coach-subscription'] });
      
      toast({
        title: 'Trial Started!',
        description: `Your 14-day free trial has begun. Enjoy exploring all features!`,
      });
    },
    onError: (error: any) => {
      console.error('Trial start failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start trial',
        variant: 'destructive',
      });
    },
  });
};
