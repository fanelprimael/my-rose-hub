-- Supprimer l'ancienne contrainte sur le type pour les notes
ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_type_check;

-- Ajouter une colonne evaluation pour les 5 évaluations
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS evaluation TEXT NOT NULL DEFAULT 'Evaluation 1';

-- Créer une nouvelle contrainte pour le type avec plus d'options
ALTER TABLE public.grades ADD CONSTRAINT grades_type_check 
CHECK (type = ANY (ARRAY['DS', 'Interrogation', 'Examen', 'Devoir', 'Controle', 'Evaluation']));

-- Créer une contrainte pour les évaluations
ALTER TABLE public.grades ADD CONSTRAINT grades_evaluation_check 
CHECK (evaluation = ANY (ARRAY['Evaluation 1', 'Evaluation 2', 'Evaluation 3', 'Evaluation 4', 'Evaluation 5']));

-- Ajouter une contrainte unique sur le nom des matières si elle n'existe pas
DO $$ 
BEGIN
    ALTER TABLE public.subjects ADD CONSTRAINT subjects_name_unique UNIQUE (name);
EXCEPTION
    WHEN duplicate_object THEN
        -- ignore if constraint already exists
        NULL;
END $$;

-- Créer des matières par défaut avec les bonnes catégories
INSERT INTO public.subjects (name, coefficient, category) VALUES 
('Mathématiques', 4, 'core'),
('Français', 4, 'core'),
('Anglais', 2, 'core'),
('Sciences Physiques', 3, 'core'),
('Sciences Naturelles', 3, 'core'),
('Histoire-Géographie', 3, 'core'),
('Philosophie', 2, 'optional'),
('EPS', 1, 'optional')
ON CONFLICT (name) DO NOTHING;