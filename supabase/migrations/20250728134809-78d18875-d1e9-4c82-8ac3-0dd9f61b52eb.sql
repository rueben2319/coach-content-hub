-- Let's check and clean up the user_progress table properly

-- Step 1: Clean up completely by dropping and recreating user_progress table
DROP TABLE IF EXISTS user_progress CASCADE;

-- Step 2: Create new user_progress table matching your intended schema
CREATE TABLE user_progress (
    user_id UUID NOT NULL,
    section_id UUID NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, section_id),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

-- Step 3: Enable RLS on user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policy for user_progress
CREATE POLICY "Users can manage their own progress" ON user_progress
FOR ALL USING (auth.uid() = user_id);