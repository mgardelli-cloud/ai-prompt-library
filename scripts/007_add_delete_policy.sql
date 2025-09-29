-- Step 2: Add delete policy for public prompts (run this second)
CREATE POLICY "Allow delete public prompts" ON prompts
  FOR DELETE USING (is_public = true);
