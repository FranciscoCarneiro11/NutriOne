-- Add skipped column to meals table for skip functionality
ALTER TABLE public.meals 
ADD COLUMN skipped boolean DEFAULT false;