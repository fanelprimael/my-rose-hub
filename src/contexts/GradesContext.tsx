import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Grade {
  id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  subject_id?: string;
  subject_name: string;
  grade: number;
  coefficient: number;
  type: string;
  date: string;
  created_at: string;
  updated_at: string;
}

interface GradesContextType {
  grades: Grade[];
  loading: boolean;
  addGrade: (grade: Omit<Grade, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGrade: (id: string, grade: Partial<Grade>) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  getGrade: (id: string) => Grade | undefined;
  getGradesByStudent: (studentId: string) => Grade[];
  refreshGrades: () => Promise<void>;
}

const GradesContext = createContext<GradesContextType | undefined>(undefined);

export const GradesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshGrades = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching grades:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les notes",
          variant: "destructive"
        });
        return;
      }

      setGrades(data || []);
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
    refreshGrades();
  }, []);

  const addGrade = async (gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('grades')
        .insert([gradeData]);

      if (error) {
        console.error('Error adding grade:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la note",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Note ajoutée avec succès"
      });
      
      await refreshGrades();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const updateGrade = async (id: string, gradeData: Partial<Grade>) => {
    try {
      const { error } = await supabase
        .from('grades')
        .update(gradeData)
        .eq('id', id);

      if (error) {
        console.error('Error updating grade:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier la note",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Note modifiée avec succès"
      });
      
      await refreshGrades();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const deleteGrade = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting grade:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la note",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Note supprimée avec succès"
      });
      
      await refreshGrades();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const getGrade = (id: string) => {
    return grades.find(grade => grade.id === id);
  };

  const getGradesByStudent = (studentId: string) => {
    return grades.filter(grade => grade.student_id === studentId);
  };

  return (
    <GradesContext.Provider value={{
      grades,
      loading,
      addGrade,
      updateGrade,
      deleteGrade,
      getGrade,
      getGradesByStudent,
      refreshGrades
    }}>
      {children}
    </GradesContext.Provider>
  );
};

export const useGradesContext = () => {
  const context = useContext(GradesContext);
  if (context === undefined) {
    throw new Error('useGradesContext must be used within a GradesProvider');
  }
  return context;
};