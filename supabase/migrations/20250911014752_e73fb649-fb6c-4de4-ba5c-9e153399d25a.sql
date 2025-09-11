-- Fix security issue: Restrict teacher access to only students in their assigned classes

-- Create function to check if a teacher can access a specific student
CREATE OR REPLACE FUNCTION public.teacher_can_access_student(student_class text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teachers t
    INNER JOIN public.user_roles ur ON ur.user_id = auth.uid()
    WHERE ur.role = 'teacher'
    AND student_class = ANY(t.classes)
    AND t.status = 'active'
  )
$$;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;

-- Create separate policies for different roles
CREATE POLICY "Admin and staff can view all students" 
ON public.students 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Teachers can view students in their assigned classes" 
ON public.students 
FOR SELECT 
USING (
  has_role(auth.uid(), 'teacher'::app_role) 
  AND teacher_can_access_student(class)
);