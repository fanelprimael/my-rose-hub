-- Mettre à jour le profil avec les bonnes informations
UPDATE profiles 
SET 
  first_name = 'Jean-Marie',
  last_name = 'GBEKIN',
  role = 'direction'::app_role,
  updated_at = now()
WHERE email = 'gbekinjeanmarie@gmail.com';