-- DEMO/DEVELOPMENT PERMISSIONS
-- WARNING: These permissions are very permissive and should only be used in demo environments

-- Drop restrictive policies for demo
DROP POLICY IF EXISTS "Allow users delete own prompts" ON prompts;
DROP POLICY IF EXISTS "Allow delete public prompts" ON prompts;
DROP POLICY IF EXISTS "Allow delete orphaned prompts" ON prompts;

-- Create very permissive delete policy for demo
-- This allows anyone to delete any public prompt
CREATE POLICY "Demo: Allow delete any public prompt" ON prompts
  FOR DELETE USING (is_public = true);

-- Alternative: Completely disable RLS for demo (VERY PERMISSIVE)
-- Uncomment the line below ONLY for demo environments
-- ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT 
  policyname, 
  cmd,
  qual as condition
FROM pg_policies 
WHERE tablename = 'prompts' AND cmd = 'DELETE';
