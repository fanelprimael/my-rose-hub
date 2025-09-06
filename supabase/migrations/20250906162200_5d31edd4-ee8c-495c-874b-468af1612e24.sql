-- Corriger les politiques RLS pour permettre la création de comptes

-- Supprimer l'ancienne politique restrictive pour INSERT
DROP POLICY IF EXISTS "Direction can insert profiles" ON profiles;

-- Créer une nouvelle politique qui permet aux utilisateurs de créer leur propre profil
CREATE POLICY "Users can create their own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs direction d'insérer d'autres profils
CREATE POLICY "Direction can create other profiles" 
ON profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'direction'::app_role
  )
);