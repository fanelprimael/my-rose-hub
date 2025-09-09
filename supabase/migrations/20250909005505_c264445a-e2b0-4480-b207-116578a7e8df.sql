-- Activation de RLS et création de politiques pour application Electron locale
-- Étant donné que l'authentification a été supprimée et que l'application fonctionne 
-- comme une application Electron autonome, nous activons RLS avec des politiques
-- qui permettent toutes les opérations pour sécuriser l'accès au niveau application

-- Activer RLS sur toutes les tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table students
CREATE POLICY "Application can manage students" ON public.students
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table teachers  
CREATE POLICY "Application can manage teachers" ON public.teachers
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table classes
CREATE POLICY "Application can manage classes" ON public.classes
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table grades
CREATE POLICY "Application can manage grades" ON public.grades
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table payments
CREATE POLICY "Application can manage payments" ON public.payments
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table payment_types
CREATE POLICY "Application can manage payment_types" ON public.payment_types
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table school_years
CREATE POLICY "Application can manage school_years" ON public.school_years
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table school_settings
CREATE POLICY "Application can manage school_settings" ON public.school_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour la table subjects
CREATE POLICY "Application can manage subjects" ON public.subjects
  FOR ALL USING (true) WITH CHECK (true);