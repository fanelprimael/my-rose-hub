import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SchoolYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SchoolYearsContextType {
  schoolYears: SchoolYear[];
  currentSchoolYear: SchoolYear | null;
  selectedSchoolYear: SchoolYear | null;
  loading: boolean;
  addSchoolYear: (schoolYear: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSchoolYear: (id: string, schoolYear: Partial<SchoolYear>) => Promise<void>;
  setCurrentSchoolYear: (id: string) => Promise<void>;
  setSelectedSchoolYear: (schoolYear: SchoolYear | null) => void;
  archiveSchoolYear: (id: string) => Promise<void>;
  refreshSchoolYears: () => Promise<void>;
}

const SchoolYearsContext = createContext<SchoolYearsContextType | undefined>(undefined);

export const SchoolYearsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [currentSchoolYear, setCurrentSchoolYearState] = useState<SchoolYear | null>(null);
  const [selectedSchoolYear, setSelectedSchoolYearState] = useState<SchoolYear | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshSchoolYears = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('school_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching school years:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les années scolaires",
          variant: "destructive"
        });
        return;
      }

      setSchoolYears(data || []);
      
      // Set current school year
      const current = data?.find(year => year.is_current);
      setCurrentSchoolYearState(current || null);
      
      // Set selected school year to current if not already set
      if (!selectedSchoolYear && current) {
        setSelectedSchoolYearState(current);
      }
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
    refreshSchoolYears();
  }, []);

  const addSchoolYear = async (schoolYearData: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('school_years')
        .insert([schoolYearData]);

      if (error) {
        console.error('Error adding school year:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'année scolaire",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Année scolaire ajoutée avec succès"
      });
      
      await refreshSchoolYears();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const updateSchoolYear = async (id: string, schoolYearData: Partial<SchoolYear>) => {
    try {
      const { error } = await supabase
        .from('school_years')
        .update(schoolYearData)
        .eq('id', id);

      if (error) {
        console.error('Error updating school year:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'année scolaire",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Année scolaire modifiée avec succès"
      });
      
      await refreshSchoolYears();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const setCurrentSchoolYear = async (id: string) => {
    try {
      const { error } = await supabase
        .from('school_years')
        .update({ is_current: true })
        .eq('id', id);

      if (error) {
        console.error('Error setting current school year:', error);
        toast({
          title: "Erreur",
          description: "Impossible de définir l'année scolaire courante",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Année scolaire courante mise à jour"
      });
      
      await refreshSchoolYears();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const archiveSchoolYear = async (id: string) => {
    try {
      const { error } = await supabase
        .from('school_years')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error archiving school year:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'archiver l'année scolaire",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Année scolaire archivée avec succès"
      });
      
      await refreshSchoolYears();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const setSelectedSchoolYear = (schoolYear: SchoolYear | null) => {
    setSelectedSchoolYearState(schoolYear);
  };

  return (
    <SchoolYearsContext.Provider value={{
      schoolYears,
      currentSchoolYear,
      selectedSchoolYear,
      loading,
      addSchoolYear,
      updateSchoolYear,
      setCurrentSchoolYear,
      setSelectedSchoolYear,
      archiveSchoolYear,
      refreshSchoolYears
    }}>
      {children}
    </SchoolYearsContext.Provider>
  );
};

export const useSchoolYearsContext = () => {
  const context = useContext(SchoolYearsContext);
  if (context === undefined) {
    throw new Error('useSchoolYearsContext must be used within a SchoolYearsProvider');
  }
  return context;
};