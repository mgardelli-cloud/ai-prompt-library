-- Crea la tabella prompts se non esiste
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usage_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false
);

-- Abilita Row Level Security (RLS)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Crea policy per permettere a tutti di leggere i prompt pubblici
CREATE POLICY "Anyone can view public prompts" ON public.prompts
    FOR SELECT USING (is_public = true);

-- Crea policy per permettere a tutti di inserire prompt
CREATE POLICY "Anyone can insert prompts" ON public.prompts
    FOR INSERT WITH CHECK (true);

-- Crea policy per permettere a tutti di aggiornare prompt
CREATE POLICY "Anyone can update prompts" ON public.prompts
    FOR UPDATE USING (true);

-- Verifica che la tabella sia stata creata correttamente
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'prompts' 
ORDER BY ordinal_position;
