-- Nettoyer toutes les données démo existantes
DELETE FROM grades;
DELETE FROM payments;
DELETE FROM students;
DELETE FROM teachers;
DELETE FROM classes;

-- Ajouter le champ salaire aux enseignants
ALTER TABLE teachers ADD COLUMN salary INTEGER DEFAULT 0;

-- Mettre à jour le mot de passe du compte secrétariat
-- Note: Cela doit être fait via le dashboard Supabase

-- Créer les classes ordonnées de la maternelle au CM2
INSERT INTO classes (name, level, capacity, student_count, teacher, school_year_id) VALUES
('Maternelle 1', 'Maternelle', 25, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1)),
('Maternelle 2', 'Maternelle', 25, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1)),
('CI', 'Primaire', 25, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1)),
('CP', 'Primaire', 30, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1)),
('CE1', 'Primaire', 30, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1)),
('CE2', 'Primaire', 30, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1)),
('CM1', 'Primaire', 30, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1)),
('CM2', 'Primaire', 30, 0, 'Enseignant non assigné', (SELECT id FROM school_years WHERE is_current = true LIMIT 1;