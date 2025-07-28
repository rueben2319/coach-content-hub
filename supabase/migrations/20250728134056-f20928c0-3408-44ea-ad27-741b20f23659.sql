-- Fix database structure to match intended schema

-- Step 1: Add missing fields to lessons table
ALTER TABLE lessons ADD COLUMN unlock_after_days INTEGER;

-- Step 2: Add missing fields to sections table  
ALTER TABLE sections ADD COLUMN content JSONB DEFAULT '{}';
ALTER TABLE sections ADD COLUMN is_free BOOLEAN DEFAULT false;

-- Step 3: Remove content fields from modules table since content should be in sections
ALTER TABLE modules DROP COLUMN content_type;
ALTER TABLE modules DROP COLUMN content_url; 
ALTER TABLE modules DROP COLUMN content_text;
ALTER TABLE modules DROP COLUMN duration;
ALTER TABLE modules DROP COLUMN file_size;
ALTER TABLE modules DROP COLUMN is_preview;
ALTER TABLE modules DROP COLUMN scheduled_publish_at;
ALTER TABLE modules DROP COLUMN auto_publish;
ALTER TABLE modules DROP COLUMN version_id;
ALTER TABLE modules DROP COLUMN prerequisites;
ALTER TABLE modules DROP COLUMN chapter_id;

-- Step 4: Add unlock_after_days to modules for drip content
ALTER TABLE modules ADD COLUMN unlock_after_days INTEGER;
ALTER TABLE modules ADD COLUMN is_published BOOLEAN DEFAULT false;

-- Step 5: Update user_progress to track sections instead of modules
ALTER TABLE user_progress DROP CONSTRAINT course_progress_content_id_fkey;
ALTER TABLE user_progress RENAME COLUMN content_id TO section_id;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_section_id_fkey 
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE;

-- Step 6: Update user_progress structure to match schema
ALTER TABLE user_progress DROP COLUMN bookmarks;
ALTER TABLE user_progress DROP COLUMN difficulty_rating;
ALTER TABLE user_progress DROP COLUMN learning_path_id;
ALTER TABLE user_progress DROP COLUMN notes;
ALTER TABLE user_progress DROP COLUMN progress_percentage;
ALTER TABLE user_progress DROP COLUMN quality_preference;
ALTER TABLE user_progress DROP COLUMN resume_position;
ALTER TABLE user_progress DROP COLUMN satisfaction_rating;
ALTER TABLE user_progress DROP COLUMN session_id;
ALTER TABLE user_progress DROP COLUMN speed_preference;
ALTER TABLE user_progress DROP COLUMN time_spent;
ALTER TABLE user_progress DROP COLUMN last_accessed;
ALTER TABLE user_progress DROP COLUMN enrollment_id;

-- Add simpler progress tracking fields
ALTER TABLE user_progress ADD COLUMN user_id UUID NOT NULL;
ALTER TABLE user_progress ADD COLUMN is_completed BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- Create proper primary key for user_progress
ALTER TABLE user_progress DROP CONSTRAINT user_progress_pkey;
ALTER TABLE user_progress ADD PRIMARY KEY (user_id, section_id);

-- Add foreign key for user_id
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 7: Update RLS policies for user_progress
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_progress;

CREATE POLICY "Users can manage their own progress" ON user_progress
FOR ALL USING (auth.uid() = user_id);

-- Step 8: Update modules RLS policies since we removed content fields
DROP POLICY IF EXISTS "Anyone can view preview modules" ON modules;
DROP POLICY IF EXISTS "Coaches can manage their course modules (only if subscribed)" ON modules;
DROP POLICY IF EXISTS "Enrolled clients can view course modules" ON modules;

CREATE POLICY "Coaches can manage their course modules (only if subscribed)" ON modules
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = modules.course_id 
    AND courses.coach_id = auth.uid()
  ) AND is_coach_subscribed(auth.uid())
);

CREATE POLICY "Enrolled clients can view published modules" ON modules
FOR SELECT USING (
  is_published = true AND
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = modules.course_id 
    AND enrollments.client_id = auth.uid() 
    AND enrollments.payment_status = 'completed'
  )
);