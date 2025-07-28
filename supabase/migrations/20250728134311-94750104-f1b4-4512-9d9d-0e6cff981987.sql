-- Fix database structure to match intended schema - Step by step approach

-- Step 1: Drop conflicting RLS policies first
DROP POLICY IF EXISTS "Anyone can view preview modules" ON modules;
DROP POLICY IF EXISTS "Coaches can manage their course modules (only if subscribed)" ON modules;
DROP POLICY IF EXISTS "Enrolled clients can view course modules" ON modules;

-- Step 2: Add missing fields to lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS unlock_after_days INTEGER;

-- Step 3: Add missing fields to sections table  
ALTER TABLE sections ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';
ALTER TABLE sections ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

-- Step 4: Remove content fields from modules table since content should be in sections
ALTER TABLE modules DROP COLUMN IF EXISTS content_type;
ALTER TABLE modules DROP COLUMN IF EXISTS content_url; 
ALTER TABLE modules DROP COLUMN IF EXISTS content_text;
ALTER TABLE modules DROP COLUMN IF EXISTS duration;
ALTER TABLE modules DROP COLUMN IF EXISTS file_size;
ALTER TABLE modules DROP COLUMN IF EXISTS is_preview;
ALTER TABLE modules DROP COLUMN IF EXISTS scheduled_publish_at;
ALTER TABLE modules DROP COLUMN IF EXISTS auto_publish;
ALTER TABLE modules DROP COLUMN IF EXISTS version_id;
ALTER TABLE modules DROP COLUMN IF EXISTS prerequisites;
ALTER TABLE modules DROP COLUMN IF EXISTS chapter_id;

-- Step 5: Add drip content fields to modules
ALTER TABLE modules ADD COLUMN IF NOT EXISTS unlock_after_days INTEGER;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;