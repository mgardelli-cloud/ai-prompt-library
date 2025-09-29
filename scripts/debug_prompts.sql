-- Debug script to check current prompts and their permissions

-- Check all prompts and their ownership
SELECT 
  id,
  title,
  user_id,
  is_public,
  created_at,
  CASE 
    WHEN user_id IS NULL THEN 'No owner (orphaned)'
    WHEN is_public = true THEN 'Public prompt'
    ELSE 'Private prompt'
  END as prompt_type
FROM prompts
ORDER BY created_at DESC
LIMIT 10;

-- Check current RLS policies
SELECT 
  policyname, 
  cmd as operation,
  permissive,
  qual as using_condition,
  with_check as with_check_condition
FROM pg_policies 
WHERE tablename = 'prompts'
ORDER BY cmd, policyname;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'prompts';

-- Test query: What prompts can be deleted by anonymous user?
-- (This shows which prompts match the DELETE policies)
EXPLAIN (ANALYZE, BUFFERS) 
SELECT id, title 
FROM prompts 
WHERE is_public = true OR user_id IS NULL;
