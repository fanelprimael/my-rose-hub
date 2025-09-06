-- Add age and gender columns to students table
ALTER TABLE public.students 
ADD COLUMN age integer,
ADD COLUMN gender text;