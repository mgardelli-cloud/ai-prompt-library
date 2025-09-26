-- Ensure RLS policies are correctly set for anonymous access
-- This script can be run multiple times safely

-- First, ensure RLS is enabled on the prompts table
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read access" ON public.prompts;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.prompts;
DROP POLICY IF EXISTS "Allow users to update own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow users to delete own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can insert their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;

-- Create comprehensive policies for anonymous access
CREATE POLICY "Enable read access for all users" ON public.prompts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for anonymous users" ON public.prompts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for prompt owners or anonymous" ON public.prompts
  FOR UPDATE USING (
    auth.uid() = user_id 
    OR user_id IS NULL 
    OR auth.uid() IS NULL
  );

CREATE POLICY "Enable delete for prompt owners or anonymous" ON public.prompts
  FOR DELETE USING (
    auth.uid() = user_id 
    OR user_id IS NULL 
    OR auth.uid() IS NULL
  );

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'prompts';
