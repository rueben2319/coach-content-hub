
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FunctionsHttpError } from '@supabase/supabase-js';

interface InitiatePaymentData {
  subscription_id: string;
  amount: number;
  currency: string;
  payment_method: 'mobile_money' | 'card' | 'bank_transfer';
  phone_number?: string;
  email?: string;
  return_url?: string;
}

interface InitiateCoursePaymentData {
  type: 'one_off' | 'subscription';
  target_id: string;
  amount: number;
  currency: string;
  payment_method: 'mobile_money' | 'card' | 'bank_transfer';
  phone_number?: string;
  email?: string;
  return_url?: string;
}

interface RetryPaymentData {
  billing_id: string;
  payment_method?: 'mobile_money' | 'card' | 'bank_transfer';
  phone_number?: string;
  email?: string;
}

export const useInitiatePayment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InitiatePaymentData) => {
      console.log('Initiating payment:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session found');

      const { data: result, error } = await supabase.functions.invoke('initiate-payment', {
        body: data,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['billing-history'] });
      
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
        toast({
          title: 'Payment initiated',
          description: 'Please complete your payment in the new tab.',
        });
      }
    },
    onError: (error: any) => {
      console.error('Payment initiation failed:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
    },
  });
};

export const useInitiateCoursePayment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InitiateCoursePaymentData) => {
      console.log('Initiating course payment:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session found');

      const { data: result, error } = await supabase.functions.invoke('initiate-course-payment', {
        body: data,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-enrollments'] });
      
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
        toast({
          title: 'Payment initiated',
          description: 'Please complete your payment in the new tab.',
        });
      }
    },
    onError: async (error: any) => {
      console.log('Full error object:', error);
      let errorMsg = error.message || 'Failed to initiate payment';
      
      // Try to extract backend error message if available
      if (error instanceof FunctionsHttpError) {
        try {
          // Check if error has a response property or other error details
          console.log('FunctionsHttpError details:', {
            name: error.name,
            message: error.message,
            context: (error as any).context,
            details: (error as any).details
          });
          
          // Try to get error from context or details
          if ((error as any).context?.message) errorMsg = (error as any).context.message;
          if ((error as any).details) errorMsg = (error as any).details;
        } catch (e) {
          console.log('Failed to parse error details:', e);
        }
      }
      
      console.error('Course payment initiation failed:', errorMsg, error);
      toast({
        title: 'Payment failed',
        description: errorMsg,
        variant: 'destructive',
      });
    },
  });
};

export const useRetryPayment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RetryPaymentData) => {
      console.log('Retrying payment:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session found');

      const { data: result, error } = await supabase.functions.invoke('retry-payment', {
        body: data,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['billing-history'] });
      
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
        toast({
          title: 'Payment retry initiated',
          description: `Attempt ${data.retry_count}. Please complete your payment in the new tab.`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Payment retry failed:', error);
      toast({
        title: 'Retry failed',
        description: error.message || 'Failed to retry payment',
        variant: 'destructive',
      });
    },
  });
};

export const useBillingHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['billing-history', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      console.log('Fetching billing history for user:', user.id);

      const { data, error } = await supabase
        .from('billing_history')
        .select(`
          *,
          coach_subscriptions (
            tier,
            billing_cycle
          )
        `)
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Billing history query error:', error);
        throw error;
      }

      console.log('Billing history data:', data);
      return data;
    },
    enabled: !!user,
  });
};

export const usePaymentNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payment-notifications', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('subscription_notifications')
        .select(`
          *,
          coach_subscriptions!inner (
            coach_id,
            tier
          )
        `)
        .eq('coach_subscriptions.coach_id', user.id)
        .eq('notification_type', 'payment_failed')
        .order('sent_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Payment notifications query error:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });
};
