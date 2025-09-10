-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'staff');

-- Create user_roles table to manage user permissions
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- Drop existing insecure policies
DROP POLICY IF EXISTS "electron_app_students_policy" ON public.students;
DROP POLICY IF EXISTS "electron_app_teachers_policy" ON public.teachers;
DROP POLICY IF EXISTS "electron_app_classes_policy" ON public.classes;
DROP POLICY IF EXISTS "electron_app_payments_policy" ON public.payments;
DROP POLICY IF EXISTS "electron_app_grades_policy" ON public.grades;
DROP POLICY IF EXISTS "electron_app_school_settings_policy" ON public.school_settings;
DROP POLICY IF EXISTS "electron_app_school_years_policy" ON public.school_years;
DROP POLICY IF EXISTS "electron_app_payment_types_policy" ON public.payment_types;
DROP POLICY IF EXISTS "electron_app_subjects_policy" ON public.subjects;

-- Create secure RLS policies for students table
CREATE POLICY "Authenticated users can view students"
ON public.students FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admin and staff can modify students"
ON public.students FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Create secure RLS policies for teachers table
CREATE POLICY "Authenticated users can view teachers"
ON public.teachers FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admin and staff can modify teachers"
ON public.teachers FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Create secure RLS policies for classes table
CREATE POLICY "Authenticated users can view classes"
ON public.classes FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admin and staff can modify classes"
ON public.classes FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Create secure RLS policies for payments table
CREATE POLICY "Admin and staff can access payments"
ON public.payments FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Create secure RLS policies for grades table
CREATE POLICY "Authenticated users can view grades"
ON public.grades FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admin, staff and teachers can modify grades"
ON public.grades FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
);

-- Create secure RLS policies for school settings (admin only)
CREATE POLICY "Admin can access school settings"
ON public.school_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create secure RLS policies for school years
CREATE POLICY "Authenticated users can view school years"
ON public.school_years FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admin can modify school years"
ON public.school_years FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create secure RLS policies for payment types
CREATE POLICY "Admin and staff can access payment types"
ON public.payment_types FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Create secure RLS policies for subjects
CREATE POLICY "Authenticated users can view subjects"
ON public.subjects FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admin and staff can modify subjects"
ON public.subjects FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();