import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age?: number;
  gender?: string;
  class: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface StudentsContextType {
  students: Student[];
  loading: boolean;
  addStudent: (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  getStudent: (id: string) => Student | undefined;
  refreshStudents: () => Promise<void>;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export const StudentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les élèves",
          variant: "destructive"
        });
        return;
      }

      setStudents(data || []);
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
    refreshStudents();
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('students')
        .insert([studentData]);

      if (error) {
        console.error('Error adding student:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'élève",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Élève ajouté avec succès"
      });
      
      await refreshStudents();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      const { error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id);

      if (error) {
        console.error('Error updating student:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'élève",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Élève modifié avec succès"
      });
      
      await refreshStudents();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting student:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'élève",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Élève supprimé avec succès"
      });
      
      await refreshStudents();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const getStudent = (id: string) => {
    return students.find(student => student.id === id);
  };

  return (
    <StudentsContext.Provider value={{
      students,
      loading,
      addStudent,
      updateStudent,
      deleteStudent,
      getStudent,
      refreshStudents
    }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudentsContext = () => {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error('useStudentsContext must be used within a StudentsProvider');
  }
  return context;
};