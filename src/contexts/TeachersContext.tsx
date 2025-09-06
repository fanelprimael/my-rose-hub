import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: string;
  hire_date?: string;
  created_at: string;
  updated_at: string;
}

interface TeachersContextType {
  teachers: Teacher[];
  loading: boolean;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  getTeacher: (id: string) => Teacher | undefined;
  refreshTeachers: () => Promise<void>;
}

const TeachersContext = createContext<TeachersContextType | undefined>(undefined);

export const TeachersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teachers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les enseignants",
          variant: "destructive"
        });
        return;
      }

      setTeachers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTeachers();
  }, []);

  const addTeacher = async (teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .insert([teacherData]);

      if (error) {
        console.error('Error adding teacher:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'enseignant",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Enseignant ajouté avec succès"
      });
      
      await refreshTeachers();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const updateTeacher = async (id: string, teacherData: Partial<Teacher>) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .update(teacherData)
        .eq('id', id);

      if (error) {
        console.error('Error updating teacher:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'enseignant",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Enseignant modifié avec succès"
      });
      
      await refreshTeachers();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting teacher:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'enseignant",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Enseignant supprimé avec succès"
      });
      
      await refreshTeachers();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const getTeacher = (id: string) => {
    return teachers.find(teacher => teacher.id === id);
  };

  return (
    <TeachersContext.Provider value={{
      teachers,
      loading,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      getTeacher,
      refreshTeachers
    }}>
      {children}
    </TeachersContext.Provider>
  );
};

export const useTeachersContext = () => {
  const context = useContext(TeachersContext);
  if (context === undefined) {
    throw new Error('useTeachersContext must be used within a TeachersProvider');
  }
  return context;
};