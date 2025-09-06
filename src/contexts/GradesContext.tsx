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
  evaluation: string;
  date: string;
  school_year_id: string;
  created_at: string;
  updated_at: string;
}

interface GradesContextType {
  grades: Grade[];
  loading: boolean;
  addGrade: (grade: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>) => Promise<void>;
  addMultipleGrades: (grades: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>[]) => Promise<void>;
  updateStudentGrades: (studentId: string, evaluation: string, type: string, grades: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>[]) => Promise<void>;
  updateGrade: (id: string, grade: Partial<Grade>) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  getGrade: (id: string) => Grade | undefined;
  getGradesByStudent: (studentId: string) => Grade[];
  getGradesByEvaluation: (evaluation: string) => Grade[];
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

  const addGrade = async (gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>) => {
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
        .from('grades')
        .insert([{ ...gradeData, school_year_id: currentYear.id }]);

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

  const addMultipleGrades = async (gradesData: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>[]) => {
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

      // Add school_year_id to all grades
      const gradesWithSchoolYear = gradesData.map(grade => ({
        ...grade,
        school_year_id: currentYear.id
      }));

      const { error } = await supabase
        .from('grades')
        .insert(gradesWithSchoolYear);

      if (error) {
        console.error('Error adding grades:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter les notes",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: `${gradesData.length} notes ajoutées avec succès`
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

  const updateStudentGrades = async (studentId: string, evaluation: string, type: string, gradesData: Omit<Grade, 'id' | 'created_at' | 'updated_at' | 'school_year_id'>[]) => {
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

      // D'abord, supprimer toutes les notes existantes pour cet élève, évaluation et type dans l'année courante
      const { error: deleteError } = await supabase
        .from('grades')
        .delete()
        .eq('student_id', studentId)
        .eq('evaluation', evaluation)
        .eq('type', type)
        .eq('school_year_id', currentYear.id);

      if (deleteError) {
        console.error('Error deleting existing grades:', deleteError);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer les anciennes notes",
          variant: "destructive"
        });
        return;
      }

      // Ensuite, insérer les nouvelles notes
      if (gradesData.length > 0) {
        const gradesWithSchoolYear = gradesData.map(grade => ({
          ...grade,
          school_year_id: currentYear.id
        }));

        const { error: insertError } = await supabase
          .from('grades')
          .insert(gradesWithSchoolYear);

        if (insertError) {
          console.error('Error inserting new grades:', insertError);
          toast({
            title: "Erreur",
            description: "Impossible d'ajouter les nouvelles notes",
            variant: "destructive"
          });
          return;
        }
      }

      toast({
        title: "Succès",
        description: "Notes mises à jour avec succès"
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

  const getGradesByEvaluation = (evaluation: string) => {
    return grades.filter(grade => grade.evaluation === evaluation);
  };

  return (
    <GradesContext.Provider value={{
      grades,
      loading,
      addGrade,
      addMultipleGrades,
      updateStudentGrades,
      updateGrade,
      deleteGrade,
      getGrade,
      getGradesByStudent,
      getGradesByEvaluation,
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