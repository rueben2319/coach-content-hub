-- Create app_notifications table for the notification system
CREATE TABLE IF NOT EXISTS public.app_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entity_type app_entity_type NOT NULL,
  entity_id text NOT NULL,
  action_type app_action_type NOT NULL,
  notification_level integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  read_at timestamp with time zone,
  dismissed_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" ON public.app_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.app_notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Add missing columns to user_notification_preferences if they don't exist
ALTER TABLE public.user_notification_preferences 
ADD COLUMN IF NOT EXISTS email_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS push_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS in_app_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS quiet_hours_start time DEFAULT '22:00:00',
ADD COLUMN IF NOT EXISTS quiet_hours_end time DEFAULT '08:00:00',
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';

-- Enable RLS on user_notification_preferences
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for user_notification_preferences
CREATE POLICY "Users can manage their notification preferences" ON public.user_notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- Add missing image column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image text;