-- Step 3: Add delete policy for orphaned prompts (run this third)
CREATE POLICY "Allow delete orphaned prompts" ON prompts
  FOR DELETE USING (user_id IS NULL);
