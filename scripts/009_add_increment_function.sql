-- Add atomic increment function for usage_count
-- This function ensures thread-safe increment operations

-- Drop function if it exists
DROP FUNCTION IF EXISTS increment_usage_count(UUID);

-- Create atomic increment function
CREATE OR REPLACE FUNCTION increment_usage_count(prompt_id UUID)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    -- Update and return new count atomically
    UPDATE prompts 
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = prompt_id
    RETURNING usage_count INTO new_count;
    
    -- Return the new count (or 0 if prompt not found)
    RETURN COALESCE(new_count, 0);
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and return 0 on failure
        RAISE WARNING 'Failed to increment usage count for prompt %: %', prompt_id, SQLERRM;
        RETURN 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_usage_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_usage_count(UUID) TO anon;

-- Test the function
SELECT increment_usage_count('00000000-0000-0000-0000-000000000000'::UUID) as test_result;
