-- Continue fixing user_progress and add proper RLS policies

-- Step 6: Update user_progress to track sections instead of modules
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS course_progress_content_id_fkey;
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS course_progress_enrollment_id_fkey;
ALTER TABLE user_progress RENAME COLUMN content_id TO section_id;

-- Step 7: Update user_progress structure to match schema
ALTER TABLE user_progress DROP COLUMN IF EXISTS bookmarks;
ALTER TABLE user_progress DROP COLUMN IF EXISTS difficulty_rating;
ALTER TABLE user_progress DROP COLUMN IF EXISTS learning_path_id;
ALTER TABLE user_progress DROP COLUMN IF EXISTS notes;
ALTER TABLE user_progress DROP COLUMN IF EXISTS progress_percentage;
ALTER TABLE user_progress DROP COLUMN IF EXISTS quality_preference;
ALTER TABLE user_progress DROP COLUMN IF EXISTS resume_position;
ALTER TABLE user_progress DROP COLUMN IF EXISTS satisfaction_rating;
ALTER TABLE user_progress DROP COLUMN IF EXISTS session_id;
ALTER TABLE user_progress DROP COLUMN IF EXISTS speed_preference;
ALTER TABLE user_progress DROP COLUMN IF EXISTS time_spent;
ALTER TABLE user_progress DROP COLUMN IF EXISTS last_accessed;
ALTER TABLE user_progress DROP COLUMN IF EXISTS enrollment_id;

-- Step 8: Add simpler progress tracking fields
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL DEFAULT auth.uid();
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Step 9: Create proper primary key for user_progress
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_pkey;
ALTER TABLE user_progress ADD PRIMARY KEY (user_id, section_id);

-- Step 10: Add foreign keys
ALTER TABLE user_progress ADD CONSTRAINT user_progress_section_id_fkey 
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 11: Update RLS policies for user_progress
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_progress;
CREATE POLICY "Users can manage their own progress" ON user_progress
FOR ALL USING (auth.uid() = user_id);

-- Step 12: Create proper RLS policies for modules
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