-- Supprimer l'ancienne contrainte sur le type
ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_type_check;

-- Ajouter une colonne evaluation pour les 5 évaluations
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS evaluation TEXT NOT NULL DEFAULT 'Evaluation 1';

-- Créer une nouvelle contrainte pour le type avec plus d'options
ALTER TABLE public.grades ADD CONSTRAINT grades_type_check 
CHECK (type = ANY (ARRAY['DS', 'Interrogation', 'Examen', 'Devoir', 'Controle', 'Evaluation']));

-- Créer une contrainte pour les évaluations
ALTER TABLE public.grades ADD CONSTRAINT grades_evaluation_check 
CHECK (evaluation = ANY (ARRAY['Evaluation 1', 'Evaluation 2', 'Evaluation 3', 'Evaluation 4', 'Evaluation 5']));

-- Créer une table pour les sujets si elle n'existe pas déjà avec des données par défaut
INSERT INTO public.subjects (name, coefficient, category) VALUES 
('Mathématiques', 4, 'Sciences'),
('Français', 4, 'Lettres'),
('Anglais', 2, 'Langues'),
('Sciences Physiques', 3, 'Sciences'),
('Sciences Naturelles', 3, 'Sciences'),
('Histoire-Géographie', 3, 'Sciences Humaines'),
('Philosophie', 2, 'Lettres'),
('EPS', 1, 'Sports')
ON CONFLICT (name) DO NOTHING;