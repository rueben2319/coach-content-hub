
-- Add payment configuration to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS paychangu_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS paychangu_public_key text,
ADD COLUMN IF NOT EXISTS paychangu_secret_key text,
ADD COLUMN IF NOT EXISTS payment_settings jsonb DEFAULT '{"auto_accept": true, "currency": "USD"}'::jsonb;

-- Create bulk_enrollments table for multi-course payments
CREATE TABLE IF NOT EXISTS public.bulk_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL,
  course_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  paychangu_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '24 hours')
);

-- Enable RLS on bulk_enrollments
ALTER TABLE public.bulk_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for bulk_enrollments
CREATE POLICY "Users can view their own bulk enrollments" 
  ON public.bulk_enrollments 
  FOR SELECT 
  USING (client_id = auth.uid());

CREATE POLICY "Users can create their own bulk enrollments" 
  ON public.bulk_enrollments 
  FOR INSERT 
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own bulk enrollments" 
  ON public.bulk_enrollments 
  FOR UPDATE 
  USING (client_id = auth.uid());

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_bulk_enrollments_client_id ON public.bulk_enrollments(client_id);
CREATE INDEX IF NOT EXISTS idx_bulk_enrollments_status ON public.bulk_enrollments(payment_status);
