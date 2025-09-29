-- Fix DELETE permissions for public prompts
-- This allows deletion of public prompts even without authentication

-- Add policy to allow deletion of public prompts by anyone
-- This is needed for the demo/test environment
CREATE POLICY "Allow delete public prompts" ON prompts
  FOR DELETE USING (is_public = true);

-- Alternative: Allow deletion of prompts without user_id (orphaned prompts)
CREATE POLICY "Allow delete orphaned prompts" ON prompts
  FOR DELETE USING (user_id IS NULL);

-- Verify all policies
SELECT 
  policyname, 
  cmd, 
  permissive,
  qual as "using_condition",
  with_check as "with_check_condition"
FROM pg_policies 
WHERE tablename = 'prompts'
ORDER BY cmd, policyname;
