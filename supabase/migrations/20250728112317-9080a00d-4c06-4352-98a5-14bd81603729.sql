-- Create delivery_type enum
CREATE TYPE delivery_type AS ENUM ('self_paced', 'instructor_led');

-- Add delivery_type column to courses table
ALTER TABLE public.courses 
ADD COLUMN delivery_type delivery_type NOT NULL DEFAULT 'self_paced';

-- Add optional fields for instructor-led courses
ALTER TABLE public.courses 
ADD COLUMN start_date timestamp with time zone,
ADD COLUMN end_date timestamp with time zone,
ADD COLUMN max_participants integer,
ADD COLUMN enrollment_deadline timestamp with time zone;