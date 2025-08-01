-- Add missing columns to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS estimated_duration integer DEFAULT 0;

-- Update course data to fix queries
UPDATE public.courses SET currency = 'USD' WHERE currency IS NULL;