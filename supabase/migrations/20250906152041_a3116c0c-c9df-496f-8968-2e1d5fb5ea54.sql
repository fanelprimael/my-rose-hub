-- Mettre à jour l'année scolaire existante pour 2025-2026
UPDATE school_years 
SET 
  name = '2025-2026',
  start_date = '2025-09-15',
  end_date = '2026-06-30',
  updated_at = now()
WHERE is_current = true;