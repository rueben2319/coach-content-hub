
-- Enable RLS on existing tables that don't have it (skip if already enabled)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'courses' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'course_content' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'enrollments' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'course_progress' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Coaches can view their own courses" ON public.courses;
DROP POLICY IF EXISTS "Coaches can create their own courses" ON public.courses;
DROP POLICY IF EXISTS "Coaches can update their own courses" ON public.courses;
DROP POLICY IF EXISTS "Coaches can delete their own courses" ON public.courses;
DROP POLICY IF EXISTS "Clients can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Coaches can manage their course content" ON public.course_content;
DROP POLICY IF EXISTS "Enrolled clients can view course content" ON public.course_content;

-- Create RLS policies for courses table
CREATE POLICY "Coaches can view their own courses" 
  ON public.courses 
  FOR SELECT 
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can create their own courses" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own courses" 
  ON public.courses 
  FOR UPDATE 
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own courses" 
  ON public.courses 
  FOR DELETE 
  USING (auth.uid() = coach_id);

-- Allow clients to view published courses
CREATE POLICY "Clients can view published courses" 
  ON public.courses 
  FOR SELECT 
  USING (is_published = true);

-- Create RLS policies for course_content table
CREATE POLICY "Coaches can manage their course content" 
  ON public.course_content 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_content.course_id 
    AND courses.coach_id = auth.uid()
  ));

-- Allow enrolled clients to view course content
CREATE POLICY "Enrolled clients can view course content" 
  ON public.course_content 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.enrollments 
    WHERE enrollments.course_id = course_content.course_id 
    AND enrollments.client_id = auth.uid()
    AND enrollments.payment_status = 'completed'
  ));

-- Create storage bucket for course files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-files', 'course-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Coaches can upload course files" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can update their course files" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can delete their course files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view course files" ON storage.objects;

-- Create storage policies for course files
CREATE POLICY "Coaches can upload course files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'course-files' AND auth.role() = 'authenticated');

CREATE POLICY "Coaches can update their course files" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'course-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Coaches can delete their course files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'course-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view course files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'course-files');

-- Add function to update course updated_at timestamp
CREATE OR REPLACE FUNCTION update_course_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.courses 
  SET updated_at = now() 
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_course_on_content_change ON public.course_content;

-- Create trigger to update course timestamp when content changes
CREATE TRIGGER update_course_on_content_change
  AFTER INSERT OR UPDATE OR DELETE ON public.course_content
  FOR EACH ROW
  EXECUTE FUNCTION update_course_updated_at();
