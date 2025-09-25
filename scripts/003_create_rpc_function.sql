-- Create the updated_at trigger function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $trigger$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$trigger$ language 'plpgsql';

-- Create a function to set up the database tables
-- This can be called from the client to initialize the database
CREATE OR REPLACE FUNCTION create_prompts_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Create the prompts table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0
  );

  -- Create the trigger
  DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts;
  CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  -- Enable RLS
  ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

  -- Create policies
  DROP POLICY IF EXISTS "Public prompts are viewable by everyone" ON public.prompts;
  CREATE POLICY "Public prompts are viewable by everyone" ON public.prompts
    FOR SELECT USING (is_public = true);

  DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
  CREATE POLICY "Users can view their own prompts" ON public.prompts
    FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can insert their own prompts" ON public.prompts;
  CREATE POLICY "Users can insert their own prompts" ON public.prompts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;
  CREATE POLICY "Users can update their own prompts" ON public.prompts
    FOR UPDATE USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;
  CREATE POLICY "Users can delete their own prompts" ON public.prompts
    FOR DELETE USING (auth.uid() = user_id);

  -- Insert sample data if table is empty
  INSERT INTO public.prompts (title, content, description, category, tags, is_public, user_id)
  SELECT * FROM (VALUES
    ('Creative Writing Assistant', 'You are a creative writing assistant. Help me write engaging stories by providing plot ideas, character development suggestions, and narrative techniques. Focus on creating compelling narratives that captivate readers.', 'Perfect for authors and storytellers looking for creative inspiration', 'writing', ARRAY['creative', 'storytelling', 'fiction'], true, NULL),
    ('Code Review Expert', 'You are an expert code reviewer. Analyze the provided code for best practices, potential bugs, security issues, and performance improvements. Provide specific, actionable feedback with examples.', 'Comprehensive code analysis and improvement suggestions', 'programming', ARRAY['code-review', 'debugging', 'best-practices'], true, NULL),
    ('Marketing Copy Generator', 'Create compelling marketing copy that converts. Focus on understanding the target audience, highlighting key benefits, and using persuasive language that drives action. Include emotional triggers and clear calls-to-action.', 'Generate high-converting marketing content', 'marketing', ARRAY['copywriting', 'conversion', 'sales'], true, NULL),
    ('Data Analysis Helper', 'You are a data analysis expert. Help interpret datasets, suggest appropriate statistical methods, create visualizations, and draw meaningful insights from data. Explain complex concepts in simple terms.', 'Expert assistance for data analysis and interpretation', 'analytics', ARRAY['data-science', 'statistics', 'visualization'], true, NULL),
    ('Language Learning Tutor', 'You are a patient and encouraging language tutor. Help students learn new languages through conversation practice, grammar explanations, vocabulary building, and cultural context. Adapt to different learning styles.', 'Personalized language learning assistance', 'education', ARRAY['language', 'learning', 'conversation'], true, NULL)
  ) AS sample_data(title, content, description, category, tags, is_public, user_id)
  WHERE NOT EXISTS (SELECT 1 FROM public.prompts LIMIT 1);

END;
$function$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_prompts_table() TO authenticated;
GRANT EXECUTE ON FUNCTION create_prompts_table() TO anon;
