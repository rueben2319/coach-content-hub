-- Fix Notification System Schema
-- Update the app_notifications table to match the expected structure

-- Drop existing app_notifications table if it exists
DROP TABLE IF EXISTS public.app_notifications CASCADE;

-- Create the correct app_notifications table structure
CREATE TABLE public.app_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  action_type action_type NOT NULL,
  notification_level notification_level NOT NULL DEFAULT 'MEDIUM',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Drop existing user_notification_preferences table if it exists
DROP TABLE IF EXISTS public.user_notification_preferences CASCADE;

-- Create the correct user_notification_preferences table structure
CREATE TABLE public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  entity_preferences JSONB DEFAULT '{}'::jsonb,
  action_preferences JSONB DEFAULT '{}'::jsonb,
  level_preferences JSONB DEFAULT '{}'::jsonb,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_aggregations table
CREATE TABLE IF NOT EXISTS public.notification_aggregations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aggregation_key TEXT NOT NULL,
  notification_ids UUID[] NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all notification tables
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_aggregations ENABLE ROW LEVEL SECURITY;

-- RLS policies for app_notifications
CREATE POLICY "Users can view their own notifications" ON public.app_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.app_notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.app_notifications
  FOR INSERT WITH CHECK (true);

-- RLS policies for user_notification_preferences
CREATE POLICY "Users can manage their own notification preferences" ON public.user_notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- RLS policies for notification_aggregations
CREATE POLICY "Users can view their own notification aggregations" ON public.notification_aggregations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notification aggregations" ON public.notification_aggregations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notification aggregations" ON public.notification_aggregations
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_app_notifications_user_id ON public.app_notifications(user_id);
CREATE INDEX idx_app_notifications_entity ON public.app_notifications(entity_type, entity_id);
CREATE INDEX idx_app_notifications_action ON public.app_notifications(action_type);
CREATE INDEX idx_app_notifications_level ON public.app_notifications(notification_level);
CREATE INDEX idx_app_notifications_unread ON public.app_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_app_notifications_created_at ON public.app_notifications(created_at DESC);
CREATE INDEX idx_app_notifications_expires_at ON public.app_notifications(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_user_notification_preferences_user_id ON public.user_notification_preferences(user_id);

CREATE INDEX idx_notification_aggregations_user_id ON public.notification_aggregations(user_id);
CREATE INDEX idx_notification_aggregations_key ON public.notification_aggregations(aggregation_key);
CREATE INDEX idx_notification_aggregations_unread ON public.notification_aggregations(user_id, is_read) WHERE is_read = false;

-- Create or replace functions
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_entity_type entity_type,
  p_entity_id UUID,
  p_action_type action_type,
  p_notification_level notification_level DEFAULT 'MEDIUM',
  p_title TEXT,
  p_message TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.app_notifications (
    user_id,
    entity_type,
    entity_id,
    action_type,
    notification_level,
    title,
    message,
    metadata,
    expires_at
  ) VALUES (
    p_user_id,
    p_entity_type,
    p_entity_id,
    p_action_type,
    p_notification_level,
    p_title,
    p_message,
    p_metadata,
    p_expires_at
  ) RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user_id for the notification
  SELECT user_id INTO v_user_id
  FROM public.app_notifications
  WHERE id = p_notification_id;

  -- Check if user owns the notification
  IF v_user_id != auth.uid() THEN
    RETURN false;
  END IF;

  -- Mark as read
  UPDATE public.app_notifications
  SET is_read = true, read_at = now()
  WHERE id = p_notification_id;

  RETURN FOUND;
END;
$$;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(p_user_id UUID DEFAULT auth.uid())
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.app_notifications
  SET is_read = true, read_at = now()
  WHERE user_id = p_user_id AND is_read = false;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Function to dismiss notification
CREATE OR REPLACE FUNCTION public.dismiss_notification(p_notification_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user_id for the notification
  SELECT user_id INTO v_user_id
  FROM public.app_notifications
  WHERE id = p_notification_id;

  -- Check if user owns the notification
  IF v_user_id != auth.uid() THEN
    RETURN false;
  END IF;

  -- Mark as dismissed
  UPDATE public.app_notifications
  SET is_dismissed = true, dismissed_at = now()
  WHERE id = p_notification_id;

  RETURN FOUND;
END;
$$;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(p_user_id UUID DEFAULT auth.uid())
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.app_notifications
  WHERE user_id = p_user_id 
    AND is_read = false 
    AND is_dismissed = false
    AND (expires_at IS NULL OR expires_at > now());

  RETURN v_count;
END;
$$;

-- Function to cleanup expired notifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM public.app_notifications
  WHERE expires_at IS NOT NULL AND expires_at < now();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notification_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_notification_updated_at
  BEFORE UPDATE ON public.app_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notification_updated_at();

CREATE TRIGGER trigger_update_notification_preferences_updated_at
  BEFORE UPDATE ON public.user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notification_updated_at();

CREATE TRIGGER trigger_update_notification_aggregation_updated_at
  BEFORE UPDATE ON public.notification_aggregations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notification_updated_at();

-- Insert default notification preferences for existing users
INSERT INTO public.user_notification_preferences (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING; 