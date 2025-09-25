-- Insert sample prompts for demonstration
INSERT INTO public.prompts (title, content, description, category, tags, is_public) VALUES
(
  'Blog Post Writer',
  'Write a comprehensive blog post about [TOPIC]. Include an engaging introduction, 3-5 main points with detailed explanations, and a compelling conclusion. Use a conversational tone and include relevant examples.',
  'Perfect for creating detailed blog posts on any topic',
  'content-creation',
  ARRAY['blog', 'writing', 'content', 'marketing'],
  true
),
(
  'Code Reviewer',
  'Review the following code and provide feedback on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance optimizations
4. Security considerations
5. Suggestions for improvement

Code to review:
[CODE]',
  'Comprehensive code review assistant',
  'development',
  ARRAY['code', 'review', 'programming', 'debugging'],
  true
),
(
  'Email Subject Line Generator',
  'Generate 10 compelling email subject lines for [EMAIL_TOPIC]. Make them:
- Attention-grabbing
- Clear and specific
- Under 50 characters
- Action-oriented
- Personalized when possible',
  'Create engaging email subject lines that improve open rates',
  'marketing',
  ARRAY['email', 'marketing', 'subject-lines', 'copywriting'],
  true
),
(
  'Meeting Summary',
  'Create a professional meeting summary based on the following notes:

[MEETING_NOTES]

Include:
- Key decisions made
- Action items with owners
- Next steps
- Important discussion points',
  'Transform meeting notes into professional summaries',
  'productivity',
  ARRAY['meetings', 'summary', 'productivity', 'business'],
  true
),
(
  'Social Media Caption',
  'Create an engaging social media caption for [PLATFORM] about [TOPIC]. Include:
- Hook in the first line
- Relevant hashtags
- Call-to-action
- Appropriate tone for the platform
- Optimal length for engagement',
  'Generate platform-specific social media captions',
  'social-media',
  ARRAY['social-media', 'captions', 'marketing', 'engagement'],
  true
),
(
  'Learning Plan Creator',
  'Create a comprehensive learning plan for [SKILL/TOPIC]. Include:
- Learning objectives
- Recommended resources (books, courses, tutorials)
- Practice exercises
- Milestones and timeline
- Assessment methods',
  'Design structured learning paths for any skill',
  'education',
  ARRAY['learning', 'education', 'planning', 'skills'],
  true
);
