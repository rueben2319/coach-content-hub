-- Fix user_progress structure by dropping policies first

-- Step 1: Drop existing user_progress policies first
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_progress;

-- Step 2: Simplify table structure by dropping unneeded columns
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS course_progress_content_id_fkey;
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS course_progress_enrollment_id_fkey;

-- Step 3: Rename content_id to section_id
ALTER TABLE user_progress RENAME COLUMN content_id TO section_id;

-- Step 4: Remove columns that don't match the simple schema
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

-- Step 5: Add new simple fields
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL DEFAULT auth.uid();
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Step 6: Create proper primary key
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_pkey;
ALTER TABLE user_progress ADD PRIMARY KEY (user_id, section_id);

-- Step 7: Add foreign keys
ALTER TABLE user_progress ADD CONSTRAINT user_progress_section_id_fkey 
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE;

-- Step 8: Create new RLS policy
CREATE POLICY "Users can manage their own progress" ON user_progress
FOR ALL USING (auth.uid() = user_id);