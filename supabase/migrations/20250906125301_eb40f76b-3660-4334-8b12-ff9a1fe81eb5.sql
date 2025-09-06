-- Supprimer toutes les matières existantes
DELETE FROM public.subjects;

-- Ajouter les nouvelles matières avec coefficient 1
INSERT INTO public.subjects (name, coefficient, category) VALUES 
('LECTURE', 1, 'core'),
('EXPRESSION ECRITE', 1, 'core'),
('EA(DESSIN)', 1, 'core'),
('ES', 1, 'core'),
('EST', 1, 'core'),
('MATHEMATIQUES', 1, 'core'),
('POESIE/CHANT', 1, 'core'),
('ANGLAIS', 1, 'core');