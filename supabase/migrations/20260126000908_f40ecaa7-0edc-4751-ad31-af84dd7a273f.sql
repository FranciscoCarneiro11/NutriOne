-- Create table for workout sessions (each training day)
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workout_name TEXT,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for exercise logs within a session
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  exercise_name TEXT NOT NULL,
  sets_completed INTEGER NOT NULL DEFAULT 0,
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on workout_sessions
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions"
ON public.workout_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout sessions"
ON public.workout_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
ON public.workout_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
ON public.workout_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- Enable RLS on exercise_logs
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for exercise_logs
CREATE POLICY "Users can view their own exercise logs"
ON public.exercise_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise logs"
ON public.exercise_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise logs"
ON public.exercise_logs
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise logs"
ON public.exercise_logs
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_workout_sessions_user_date ON public.workout_sessions(user_id, session_date DESC);
CREATE INDEX idx_exercise_logs_session ON public.exercise_logs(session_id);
CREATE INDEX idx_exercise_logs_user ON public.exercise_logs(user_id);