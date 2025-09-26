-- Fix RLS policies to allow anonymous users to insert prompts
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can insert their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow public read access" ON public.prompts
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert" ON public.prompts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to delete own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);
