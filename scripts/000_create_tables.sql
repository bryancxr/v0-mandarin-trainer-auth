-- Create users table (basic user tracking)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

-- Create lessons table (main lesson data)
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  
  -- Step 1: Context and input
  step1_context text,
  step1_input text,
  
  -- Step 2: Clarification and confirmation
  step2_clarification text,
  step2_user_confirmation boolean,
  step2_user_clarification text,
  
  -- Step 3: Corrections and alternatives
  step3_corrected text,
  step3_notes text,
  step3_alternative1 text,
  step3_alternative1_notes text,
  step3_alternative2 text,
  step3_alternative2_notes text,
  
  -- Rating
  rating integer CHECK (rating >= 1 AND rating <= 5)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_user_id ON public.lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON public.lessons(created_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
