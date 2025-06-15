
-- Add content versioning and revision history
CREATE TABLE public.content_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content_text TEXT,
  content_url TEXT,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN DEFAULT false,
  change_notes TEXT
);

-- Add content templates
CREATE TABLE public.content_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  content_type TEXT NOT NULL,
  created_by UUID NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add scheduled publishing
ALTER TABLE public.courses 
ADD COLUMN scheduled_publish_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN auto_publish BOOLEAN DEFAULT false,
ADD COLUMN publish_status TEXT DEFAULT 'draft' CHECK (publish_status IN ('draft', 'scheduled', 'published', 'archived'));

ALTER TABLE public.course_content
ADD COLUMN scheduled_publish_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN auto_publish BOOLEAN DEFAULT false,
ADD COLUMN version_id UUID,
ADD COLUMN prerequisites JSONB DEFAULT '[]'::jsonb;

-- Add content analytics
CREATE TABLE public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  user_id UUID NOT NULL,
  view_duration INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_data JSONB DEFAULT '{}'::jsonb
);

-- Add publishing workflows
CREATE TABLE public.publishing_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID,
  content_id UUID,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('course', 'content')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  submitted_by UUID NOT NULL,
  approved_by UUID,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  approval_notes TEXT
);

-- Add content organization (chapters/sections)
CREATE TABLE public.course_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add section reference to course_content
ALTER TABLE public.course_content
ADD COLUMN chapter_id UUID;

-- Enable RLS on all new tables
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishing_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_versions
CREATE POLICY "Coaches can manage their course content versions" ON public.content_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_content cc
      JOIN public.courses c ON cc.course_id = c.id
      WHERE cc.id = content_id AND c.coach_id = auth.uid()
    )
  );

-- RLS policies for content_templates
CREATE POLICY "Users can view public templates and manage their own" ON public.content_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own templates" ON public.content_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON public.content_templates
  FOR UPDATE USING (created_by = auth.uid());

-- RLS policies for content_analytics
CREATE POLICY "Users can view analytics for their content" ON public.content_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_content cc
      JOIN public.courses c ON cc.course_id = c.id
      WHERE cc.id = content_id AND (c.coach_id = auth.uid() OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert their own analytics" ON public.content_analytics
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS policies for publishing_workflows
CREATE POLICY "Users can view workflows for their content" ON public.publishing_workflows
  FOR SELECT USING (
    submitted_by = auth.uid() OR approved_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.coach_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workflows for their content" ON public.publishing_workflows
  FOR INSERT WITH CHECK (submitted_by = auth.uid());

-- RLS policies for course_chapters
CREATE POLICY "Coaches can manage their course chapters" ON public.course_chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.coach_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_content_versions_content_id ON public.content_versions(content_id);
CREATE INDEX idx_content_analytics_content_id ON public.content_analytics(content_id);
CREATE INDEX idx_content_analytics_user_id ON public.content_analytics(user_id);
CREATE INDEX idx_publishing_workflows_course_id ON public.publishing_workflows(course_id);
CREATE INDEX idx_course_chapters_course_id ON public.course_chapters(course_id);
CREATE INDEX idx_course_content_chapter_id ON public.course_content(chapter_id);

-- Function to auto-publish scheduled content
CREATE OR REPLACE FUNCTION public.auto_publish_scheduled_content()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_published_count INTEGER := 0;
  v_course record;
  v_content record;
BEGIN
  -- Auto-publish scheduled courses
  FOR v_course IN 
    SELECT id, title, scheduled_publish_at
    FROM public.courses
    WHERE auto_publish = true
      AND publish_status = 'scheduled'
      AND scheduled_publish_at <= now()
  LOOP
    UPDATE public.courses
    SET is_published = true,
        publish_status = 'published',
        updated_at = now()
    WHERE id = v_course.id;
    
    v_published_count := v_published_count + 1;
  END LOOP;
  
  -- Auto-publish scheduled content
  FOR v_content IN 
    SELECT id, title, scheduled_publish_at
    FROM public.course_content
    WHERE auto_publish = true
      AND scheduled_publish_at <= now()
      AND scheduled_publish_at IS NOT NULL
  LOOP
    UPDATE public.course_content
    SET updated_at = now()
    WHERE id = v_content.id;
    
    v_published_count := v_published_count + 1;
  END LOOP;
  
  RETURN v_published_count;
END;
$$;
