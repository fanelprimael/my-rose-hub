-- Supprimer le trigger d'authentification
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Maintenant supprimer les fonctions liées à l'authentification
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Supprimer toutes les politiques RLS liées à l'authentification
DROP POLICY IF EXISTS "Direction can create other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Direction can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Supprimer les tables liées à l'authentification
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Désactiver RLS sur toutes les tables pour permettre l'accès libre
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY; 
ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_years DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques restantes
DROP POLICY IF EXISTS "Allow all operations on classes" ON public.classes;
DROP POLICY IF EXISTS "Allow all operations on students" ON public.students;
DROP POLICY IF EXISTS "Allow all operations on teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow all operations on grades" ON public.grades;
DROP POLICY IF EXISTS "Allow all operations on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow all operations on payment_types" ON public.payment_types;
DROP POLICY IF EXISTS "Allow all operations on school_years" ON public.school_years;
DROP POLICY IF EXISTS "Allow all operations on school_settings" ON public.school_settings;
DROP POLICY IF EXISTS "Allow all operations on subjects" ON public.subjects;