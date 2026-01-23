-- Create table for exercise weight logs
CREATE TABLE public.exercise_weights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_name TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to allow only one record per user/exercise
CREATE UNIQUE INDEX idx_exercise_weights_user_exercise ON public.exercise_weights (user_id, exercise_name);

-- Enable Row Level Security
ALTER TABLE public.exercise_weights ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own exercise weights" 
ON public.exercise_weights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise weights" 
ON public.exercise_weights 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise weights" 
ON public.exercise_weights 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise weights" 
ON public.exercise_weights 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_exercise_weights_updated_at
BEFORE UPDATE ON public.exercise_weights
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();