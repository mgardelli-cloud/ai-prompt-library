-- Step 1: Check current policies (run this first)
SELECT 
  policyname, 
  cmd, 
  permissive,
  qual as "using_condition"
FROM pg_policies 
WHERE tablename = 'prompts'
ORDER BY cmd, policyname;
