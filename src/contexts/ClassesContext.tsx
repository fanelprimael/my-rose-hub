import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  capacity: number;
  student_count: number;
  teacher: string;
  school_year_id: string;
  created_at: string;
  updated_at: string;
}

interface ClassesContextType {
  classes: SchoolClass[];
  loading: boolean;
  addClass: (classData: Omit<SchoolClass, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>) => Promise<void>;
  updateClass: (id: string, classData: Partial<SchoolClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  getClass: (id: string) => SchoolClass | undefined;
  refreshClasses: () => Promise<void>;
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export const ClassesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les classes",
          variant: "destructive"
        });
        return;
      }

      setClasses(data || []);
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
    refreshClasses();
  }, []);

  const addClass = async (classData: Omit<SchoolClass, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>) => {
    try {
      // Get current school year
      const { data: currentYear } = await supabase
        .from('school_years')
        .select('id')
        .eq('is_current', true)
        .single();

      if (!currentYear) {
        toast({
          title: "Erreur",
          description: "Aucune année scolaire courante trouvée",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('classes')
        .insert([{ ...classData, school_year_id: currentYear.id }]);

      if (error) {
        console.error('Error adding class:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la classe",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Classe ajoutée avec succès"
      });
      
      await refreshClasses();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const updateClass = async (id: string, classData: Partial<SchoolClass>) => {
    try {
      const { error } = await supabase
        .from('classes')
        .update(classData)
        .eq('id', id);

      if (error) {
        console.error('Error updating class:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier la classe",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Classe modifiée avec succès"
      });
      
      await refreshClasses();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting class:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la classe",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Classe supprimée avec succès"
      });
      
      await refreshClasses();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const getClass = (id: string) => {
    return classes.find(schoolClass => schoolClass.id === id);
  };

  return (
    <ClassesContext.Provider value={{
      classes,
      loading,
      addClass,
      updateClass,
      deleteClass,
      getClass,
      refreshClasses
    }}>
      {children}
    </ClassesContext.Provider>
  );
};

export const useClassesContext = () => {
  const context = useContext(ClassesContext);
  if (context === undefined) {
    throw new Error('useClassesContext must be used within a ClassesProvider');
  }
  return context;
};