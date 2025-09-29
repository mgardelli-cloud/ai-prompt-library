-- Step 4: Verify all policies are working (run this last)
SELECT 
  policyname, 
  cmd, 
  permissive,
  qual as "using_condition"
FROM pg_policies 
WHERE tablename = 'prompts' AND cmd = 'DELETE'
ORDER BY policyname;
