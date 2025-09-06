-- Create school years table
CREATE TABLE public.school_years (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- e.g., "2024-2025"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_years ENABLE ROW LEVEL SECURITY;

-- Create policy for school years
CREATE POLICY "Allow all operations on school_years" 
ON public.school_years 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert current school year
INSERT INTO public.school_years (name, start_date, end_date, is_current, is_active) 
VALUES ('2024-2025', '2024-09-01', '2025-07-31', true, true);

-- Add school_year_id to existing tables
ALTER TABLE public.students ADD COLUMN school_year_id UUID REFERENCES public.school_years(id) DEFAULT (
  SELECT id FROM public.school_years WHERE is_current = true LIMIT 1
);

ALTER TABLE public.grades ADD COLUMN school_year_id UUID REFERENCES public.school_years(id) DEFAULT (
  SELECT id FROM public.school_years WHERE is_current = true LIMIT 1
);

ALTER TABLE public.payments ADD COLUMN school_year_id UUID REFERENCES public.school_years(id) DEFAULT (
  SELECT id FROM public.school_years WHERE is_current = true LIMIT 1
);

ALTER TABLE public.classes ADD COLUMN school_year_id UUID REFERENCES public.school_years(id) DEFAULT (
  SELECT id FROM public.school_years WHERE is_current = true LIMIT 1
);

ALTER TABLE public.teachers ADD COLUMN school_year_id UUID REFERENCES public.school_years(id) DEFAULT (
  SELECT id FROM public.school_years WHERE is_current = true LIMIT 1
);

-- Create function to ensure only one current school year
CREATE OR REPLACE FUNCTION public.ensure_single_current_school_year()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting is_current to true, set all others to false
  IF NEW.is_current = true THEN
    UPDATE public.school_years 
    SET is_current = false 
    WHERE id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ensuring single current school year
CREATE TRIGGER ensure_single_current_school_year_trigger
  BEFORE UPDATE ON public.school_years
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_current_school_year();

-- Create function to get current school year
CREATE OR REPLACE FUNCTION public.get_current_school_year()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM public.school_years WHERE is_current = true LIMIT 1);
END;
$$ LANGUAGE plpgsql STABLE;

-- Add updated_at trigger to school_years
CREATE TRIGGER update_school_years_updated_at
  BEFORE UPDATE ON public.school_years
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_students_school_year ON public.students(school_year_id);
CREATE INDEX idx_grades_school_year ON public.grades(school_year_id);
CREATE INDEX idx_payments_school_year ON public.payments(school_year_id);
CREATE INDEX idx_classes_school_year ON public.classes(school_year_id);
CREATE INDEX idx_teachers_school_year ON public.teachers(school_year_id);
CREATE INDEX idx_school_years_current ON public.school_years(is_current) WHERE is_current = true;