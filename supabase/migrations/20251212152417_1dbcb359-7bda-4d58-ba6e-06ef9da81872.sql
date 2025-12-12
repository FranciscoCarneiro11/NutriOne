-- Create profiles table based on OnboardingData interface
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  previous_experience BOOLEAN,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER,
  height NUMERIC,
  weight NUMERIC,
  target_weight NUMERIC,
  professional_help BOOLEAN,
  goal TEXT CHECK (goal IN ('weight-loss', 'muscle', 'fit', 'flexibility')),
  obstacles TEXT[],
  body_zones TEXT[],
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very')),
  dietary_restrictions TEXT[],
  workout_days INTEGER,
  nutrition_plan JSONB,
  workout_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();