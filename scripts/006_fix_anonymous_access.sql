-- Fix RLS policies to allow anonymous access for public prompts
-- This script ensures that anonymous users can read and insert public prompts

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read of public prompts" ON prompts;
DROP POLICY IF EXISTS "Allow anonymous insert of public prompts" ON prompts;
DROP POLICY IF EXISTS "Allow users to view their own prompts" ON prompts;
DROP POLICY IF EXISTS "Allow users to update their own prompts" ON prompts;
DROP POLICY IF EXISTS "Allow users to delete their own prompts" ON prompts;
DROP POLICY IF EXISTS "Allow users to insert their own prompts" ON prompts;

-- Create new policies that allow anonymous access for public prompts
-- Allow anyone to read public prompts
CREATE POLICY "Allow read public prompts" ON prompts
  FOR SELECT USING (is_public = true);

-- Allow anonymous users to insert public prompts (user_id can be null)
CREATE POLICY "Allow insert public prompts" ON prompts
  FOR INSERT WITH CHECK (is_public = true);

-- Allow authenticated users to read their own prompts (including private ones)
CREATE POLICY "Allow users read own prompts" ON prompts
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to update their own prompts
CREATE POLICY "Allow users update own prompts" ON prompts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own prompts
CREATE POLICY "Allow users delete own prompts" ON prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own prompts
CREATE POLICY "Allow users insert own prompts" ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'prompts';
