
-- Add trial period support to coach_subscriptions table
ALTER TABLE public.coach_subscriptions 
ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN is_trial BOOLEAN DEFAULT false,
ADD COLUMN auto_renew BOOLEAN DEFAULT true,
ADD COLUMN cancellation_reason TEXT,
ADD COLUMN canceled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN next_billing_date TIMESTAMP WITH TIME ZONE;

-- Create subscription changes tracking table
CREATE TABLE public.subscription_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.coach_subscriptions(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL, -- 'upgrade', 'downgrade', 'cancel', 'reactivate', 'trial_start', 'trial_end'
  from_tier TEXT,
  to_tier TEXT,
  from_price NUMERIC,
  to_price NUMERIC,
  prorated_amount NUMERIC,
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Create subscription notifications table
CREATE TABLE public.subscription_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.coach_subscriptions(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'trial_expiring', 'payment_failed', 'renewal_reminder', 'cancellation_confirmed'
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN DEFAULT false,
  metadata JSONB
);

-- Create billing history table
CREATE TABLE public.billing_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.coach_subscriptions(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MWK',
  status TEXT NOT NULL, -- 'paid', 'failed', 'pending', 'refunded'
  billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  invoice_url TEXT,
  paychangu_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on new tables
ALTER TABLE public.subscription_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_changes
CREATE POLICY "Coaches can view their subscription changes" 
  ON public.subscription_changes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.coach_subscriptions 
      WHERE id = subscription_changes.subscription_id 
      AND coach_id = auth.uid()
    )
  );

-- RLS policies for subscription_notifications
CREATE POLICY "Coaches can view their subscription notifications" 
  ON public.subscription_notifications 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.coach_subscriptions 
      WHERE id = subscription_notifications.subscription_id 
      AND coach_id = auth.uid()
    )
  );

-- RLS policies for billing_history
CREATE POLICY "Coaches can view their billing history" 
  ON public.billing_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.coach_subscriptions 
      WHERE id = billing_history.subscription_id 
      AND coach_id = auth.uid()
    )
  );

-- Function to start trial for new coaches
CREATE OR REPLACE FUNCTION public.start_trial_subscription(_coach_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscription_id uuid;
  v_trial_end timestamp with time zone;
BEGIN
  -- Calculate trial end date (14 days from now)
  v_trial_end := now() + interval '14 days';
  
  -- Create trial subscription
  INSERT INTO public.coach_subscriptions (
    coach_id,
    tier,
    status,
    billing_cycle,
    price,
    currency,
    is_trial,
    trial_ends_at,
    started_at,
    expires_at,
    next_billing_date
  ) VALUES (
    _coach_id,
    'basic',
    'trial',
    'monthly',
    0, -- Free during trial
    'MWK',
    true,
    v_trial_end,
    now(),
    v_trial_end,
    v_trial_end
  ) RETURNING id INTO v_subscription_id;
  
  -- Log the trial start
  INSERT INTO public.subscription_changes (
    subscription_id,
    change_type,
    to_tier,
    to_price,
    effective_date
  ) VALUES (
    v_subscription_id,
    'trial_start',
    'basic',
    0,
    now()
  );
  
  RETURN v_subscription_id;
END;
$$;

-- Function to check and expire trials
CREATE OR REPLACE FUNCTION public.expire_trials()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_expired_count integer := 0;
  v_subscription record;
BEGIN
  -- Find expired trials
  FOR v_subscription IN 
    SELECT id, coach_id, trial_ends_at
    FROM public.coach_subscriptions
    WHERE is_trial = true
      AND status = 'trial'
      AND trial_ends_at <= now()
  LOOP
    -- Update subscription to expired
    UPDATE public.coach_subscriptions
    SET status = 'expired',
        updated_at = now()
    WHERE id = v_subscription.id;
    
    -- Log the trial expiration
    INSERT INTO public.subscription_changes (
      subscription_id,
      change_type,
      from_tier,
      effective_date
    ) VALUES (
      v_subscription.id,
      'trial_end',
      'basic',
      now()
    );
    
    -- Create notification
    INSERT INTO public.subscription_notifications (
      subscription_id,
      notification_type,
      metadata
    ) VALUES (
      v_subscription.id,
      'trial_expired',
      jsonb_build_object('expired_at', now())
    );
    
    v_expired_count := v_expired_count + 1;
  END LOOP;
  
  RETURN v_expired_count;
END;
$$;

-- Update the coach subscription check function to include trial logic
CREATE OR REPLACE FUNCTION public.is_coach_subscribed(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscribed boolean := false;
BEGIN
  SELECT
    EXISTS (
      SELECT 1
      FROM public.coach_subscriptions
      WHERE coach_id = _user_id
        AND status IN ('active', 'trial')
        AND (
          (is_trial = true AND trial_ends_at > now()) OR
          (is_trial = false AND expires_at IS NOT NULL AND expires_at > now())
        )
      LIMIT 1
    )
  INTO v_subscribed;
  RETURN v_subscribed;
END;
$$;
