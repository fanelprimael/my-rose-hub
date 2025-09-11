import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

type UserRole = 'admin' | 'teacher' | 'staff';

interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Mot de passe fixe
  const FIXED_PASSWORD = 'roseraie2024';

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setUserRole(userData.role);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (password: string) => {
    try {
      if (password !== FIXED_PASSWORD) {
        return { error: 'Mot de passe incorrect' };
      }

      // Créer un utilisateur fictif
      const userData: User = {
        id: 'admin-user',
        email: 'admin@roseraie.edu',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'École'
      };

      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      setUserRole(userData.role);
      
      toast.success('Connexion réussie');
      return { error: null };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { error: 'Erreur de connexion' };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_user');
      setUser(null);
      setUserRole(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};