-- Suppression et recréation des politiques RLS pour sécuriser l'application Electron
-- Supprimer toutes les politiques existantes sur toutes les tables

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Application can manage students" ON public.students;
DROP POLICY IF EXISTS "Application can manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Application can manage classes" ON public.classes;
DROP POLICY IF EXISTS "Application can manage grades" ON public.grades;
DROP POLICY IF EXISTS "Application can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Application can manage payment_types" ON public.payment_types;
DROP POLICY IF EXISTS "Application can manage school_years" ON public.school_years;
DROP POLICY IF EXISTS "Application can manage school_settings" ON public.school_settings;
DROP POLICY IF EXISTS "Application can manage subjects" ON public.subjects;

-- Activer RLS sur toutes les tables (si pas déjà fait)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Créer des politiques sécurisées pour l'application Electron
-- Ces politiques permettent toutes les opérations car l'accès est contrôlé au niveau application

-- Table students - Informations personnelles des étudiants
CREATE POLICY "electron_app_students_policy" ON public.students
  FOR ALL USING (true) WITH CHECK (true);

-- Table teachers - Informations des enseignants
CREATE POLICY "electron_app_teachers_policy" ON public.teachers
  FOR ALL USING (true) WITH CHECK (true);

-- Table classes - Informations des classes
CREATE POLICY "electron_app_classes_policy" ON public.classes
  FOR ALL USING (true) WITH CHECK (true);

-- Table grades - Notes des étudiants
CREATE POLICY "electron_app_grades_policy" ON public.grades
  FOR ALL USING (true) WITH CHECK (true);

-- Table payments - Paiements des étudiants
CREATE POLICY "electron_app_payments_policy" ON public.payments
  FOR ALL USING (true) WITH CHECK (true);

-- Table payment_types - Types de paiements
CREATE POLICY "electron_app_payment_types_policy" ON public.payment_types
  FOR ALL USING (true) WITH CHECK (true);

-- Table school_years - Années scolaires
CREATE POLICY "electron_app_school_years_policy" ON public.school_years
  FOR ALL USING (true) WITH CHECK (true);

-- Table school_settings - Paramètres de l'école
CREATE POLICY "electron_app_school_settings_policy" ON public.school_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Table subjects - Matières
CREATE POLICY "electron_app_subjects_policy" ON public.subjects
  FOR ALL USING (true) WITH CHECK (true);