-- Fix security warnings: Set search_path for security definer functions

-- Update ensure_single_current_school_year function with proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update get_current_school_year function with proper search_path  
CREATE OR REPLACE FUNCTION public.get_current_school_year()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM public.school_years WHERE is_current = true LIMIT 1);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;