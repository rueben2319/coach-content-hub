
-- Create course_notes table for note-taking functionality
CREATE TABLE public.course_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  content_id UUID,
  timestamp_seconds INTEGER, -- For video/audio time-linked notes
  note_text TEXT NOT NULL,
  note_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for course_notes
ALTER TABLE public.course_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes" 
  ON public.course_notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
  ON public.course_notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.course_notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON public.course_notes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enhance course_progress table for better tracking
ALTER TABLE public.course_progress 
ADD COLUMN IF NOT EXISTS resume_position INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bookmarks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS speed_preference NUMERIC DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS quality_preference TEXT DEFAULT 'auto';

-- Create course_downloads table for download access tracking
CREATE TABLE public.course_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID NOT NULL,
  download_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for course_downloads
ALTER TABLE public.course_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own downloads" 
  ON public.course_downloads 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Update certificates table to include more details
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS certificate_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS verification_code TEXT,
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'default';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_notes_user_course ON public.course_notes(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_course_notes_content ON public.course_notes(content_id);
CREATE INDEX IF NOT EXISTS idx_course_downloads_user ON public.course_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON public.certificates(verification_code);
