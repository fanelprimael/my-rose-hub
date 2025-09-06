-- Créer un utilisateur pour le secrétariat
-- D'abord, créer un profil pour le secrétariat avec un email générique
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'secretariat@roseraie.com',
  crypt('55555555', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
);

-- Créer le profil correspondant
INSERT INTO profiles (
  user_id,
  email,
  first_name,
  last_name,
  role,
  is_active
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'secretariat@roseraie.com'),
  'secretariat@roseraie.com',
  'Secrétariat',
  'École',
  'secretariat'::app_role,
  true
);