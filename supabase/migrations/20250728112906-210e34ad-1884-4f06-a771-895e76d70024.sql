-- Create categories and subcategories tables
CREATE TABLE public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    icon text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.subcategories (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Rename tables for better structure
ALTER TABLE public.course_content RENAME TO modules;
ALTER TABLE public.course_chapters RENAME TO lessons;
ALTER TABLE public.course_progress RENAME TO user_progress;

-- Create new sections table for granular content
CREATE TABLE public.sections (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title text NOT NULL,
    content_type content_type NOT NULL,
    content_url text,
    content_text text,
    duration integer,
    sort_order integer NOT NULL DEFAULT 0,
    is_preview boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Update foreign key relationships
ALTER TABLE public.modules DROP CONSTRAINT IF EXISTS course_content_course_id_fkey;
ALTER TABLE public.modules ADD CONSTRAINT modules_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS course_chapters_course_id_fkey;
ALTER TABLE public.lessons ADD CONSTRAINT lessons_module_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.modules(id) ON DELETE CASCADE;

-- Rename course_id to module_id in lessons table for proper hierarchy
ALTER TABLE public.lessons RENAME COLUMN course_id TO module_id;

-- Update courses table to use category_id instead of category text
ALTER TABLE public.courses ADD COLUMN category_id uuid REFERENCES public.categories(id);

-- Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view subcategories" ON public.subcategories FOR SELECT USING (true);

-- Create RLS policies for sections
CREATE POLICY "Coaches can manage their course sections" 
ON public.sections FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.lessons l
        JOIN public.modules m ON l.module_id = m.id
        JOIN public.courses c ON m.course_id = c.id
        WHERE l.id = sections.lesson_id AND c.coach_id = auth.uid()
    )
);

CREATE POLICY "Enrolled clients can view course sections" 
ON public.sections FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.lessons l
        JOIN public.modules m ON l.module_id = m.id
        JOIN public.enrollments e ON m.course_id = e.course_id
        WHERE l.id = sections.lesson_id 
        AND e.client_id = auth.uid() 
        AND e.payment_status = 'completed'::payment_status
    )
);

-- Insert sample categories
INSERT INTO public.categories (name, slug, icon) VALUES
('Career Coaching', 'career-coaching', 'briefcase'),
('Health & Wellness', 'health-wellness', 'heart'),
('Business & Entrepreneurship', 'business-entrepreneurship', 'trending-up'),
('Technology', 'technology', 'monitor'),
('Personal Development', 'personal-development', 'user-check'),
('Creative Arts', 'creative-arts', 'palette');

-- Update existing RLS policies for renamed tables
DROP POLICY IF EXISTS "Coaches can manage their course content (only if subscribed)" ON public.modules;
CREATE POLICY "Coaches can manage their course modules (only if subscribed)" 
ON public.modules FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.courses
        WHERE courses.id = modules.course_id 
        AND courses.coach_id = auth.uid()
    ) AND is_coach_subscribed(auth.uid())
);

DROP POLICY IF EXISTS "Enrolled clients can view course content" ON public.modules;
CREATE POLICY "Enrolled clients can view course modules" 
ON public.modules FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.enrollments
        WHERE enrollments.course_id = modules.course_id 
        AND enrollments.client_id = auth.uid() 
        AND enrollments.payment_status = 'completed'::payment_status
    )
);

DROP POLICY IF EXISTS "Anyone can view preview content" ON public.modules;
CREATE POLICY "Anyone can view preview modules" 
ON public.modules FOR SELECT 
USING (is_preview = true);

-- Update lessons policies
DROP POLICY IF EXISTS "Coaches can manage their course chapters" ON public.lessons;
CREATE POLICY "Coaches can manage their course lessons" 
ON public.lessons FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.modules m
        JOIN public.courses c ON m.course_id = c.id
        WHERE m.id = lessons.module_id AND c.coach_id = auth.uid()
    )
);

-- Update user_progress policies
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.user_progress;
CREATE POLICY "Users can manage their own progress" 
ON public.user_progress FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.enrollments
        WHERE enrollments.id = user_progress.enrollment_id 
        AND enrollments.client_id = auth.uid()
    )
);