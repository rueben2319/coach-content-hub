-- Fix user_progress step by step, handling primary key correctly

-- Step 1: Drop existing user_progress policies first
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_progress;

-- Step 2: Drop existing constraints
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS course_progress_content_id_fkey;
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS course_progress_enrollment_id_fkey;

-- Step 3: Drop the existing primary key first
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_pkey;

-- Step 4: Add user_id column first if it doesn't exist
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS user_id UUID;

-- Step 5: Update user_id with a default value for existing rows
UPDATE user_progress SET user_id = gen_random_uuid() WHERE user_id IS NULL;

-- Step 6: Make user_id NOT NULL
ALTER TABLE user_progress ALTER COLUMN user_id SET NOT NULL;

-- Step 7: Rename content_id to section_id
ALTER TABLE user_progress RENAME COLUMN content_id TO section_id;

-- Step 8: Add the new simple fields
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Step 9: Create new primary key with user_id and section_id
ALTER TABLE user_progress ADD PRIMARY KEY (user_id, section_id);

-- Step 10: Add foreign key to sections
ALTER TABLE user_progress ADD CONSTRAINT user_progress_section_id_fkey 
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE;

-- Step 11: Create new RLS policy
CREATE POLICY "Users can manage their own progress" ON user_progress
FOR ALL USING (auth.uid() = user_id);