import { useState, useEffect, useCallback } from 'react';
import { useStudents } from './useStudents';
import { useTeachers } from './useTeachers';
import { useClasses } from './useClasses';
import { useAuth } from '@/contexts/AuthContext';

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    electronAPI?: {
      saveLocalData: (data: any) => Promise<{ success: boolean; path?: string; error?: string }>;
      getLocalData: () => Promise<{ success: boolean; data?: any; error?: string; backupDate?: string }>;
      exportData: (data: any) => Promise<{ success: boolean; path?: string; error?: string }>;
      getDataPath: () => Promise<string>;
      isElectron: boolean;
    };
  }
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  lastBackup: Date | null;
  syncInProgress: boolean;
}

export const useHybridSync = () => {
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { classes } = useClasses();
  const { user } = useAuth();
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    lastBackup: null,
    syncInProgress: false
  });

  const isElectron = window.electronAPI?.isElectron || false;

  // Vérification de la connexion
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
    };
    
    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sauvegarde automatique locale (Electron uniquement)
  const saveToLocal = useCallback(async () => {
    if (!isElectron || !window.electronAPI) return;

    try {
      const data = {
        timestamp: new Date().toISOString(),
        userId: user?.id,
        students,
        teachers,
        classes,
        metadata: {
          version: '1.0.0',
          exportType: 'auto-backup'
        }
      };

      const result = await window.electronAPI.saveLocalData(data);
      
      if (result.success) {
        setSyncStatus(prev => ({
          ...prev,
          lastBackup: new Date()
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Erreur sauvegarde locale:', error);
      return { success: false, error: 'Erreur technique' };
    }
  }, [students, teachers, classes, user, isElectron]);

  // Chargement des données locales
  const loadFromLocal = useCallback(async () => {
    if (!isElectron || !window.electronAPI) return null;

    try {
      const result = await window.electronAPI.getLocalData();
      return result;
    } catch (error) {
      console.error('Erreur lecture locale:', error);
      return { success: false, error: 'Erreur lecture' };
    }
  }, [isElectron]);

  // Export manuel des données
  const exportData = useCallback(async () => {
    if (!isElectron || !window.electronAPI) return;

    try {
      const data = {
        timestamp: new Date().toISOString(),
        userId: user?.id,
        students,
        teachers,
        classes,
        metadata: {
          version: '1.0.0',
          exportType: 'manual-export',
          school: 'École Roseraie'
        }
      };

      const result = await window.electronAPI.exportData(data);
      return result;
    } catch (error) {
      console.error('Erreur export:', error);
      return { success: false, error: 'Erreur export' };
    }
  }, [students, teachers, classes, user, isElectron]);

  // Sauvegarde automatique toutes les 5 minutes
  useEffect(() => {
    if (!isElectron) return;

    const interval = setInterval(() => {
      if (students.length > 0 || teachers.length > 0 || classes.length > 0) {
        saveToLocal();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [students, teachers, classes, saveToLocal, isElectron]);

  // Sauvegarde au changement de données
  useEffect(() => {
    if (isElectron && (students.length > 0 || teachers.length > 0 || classes.length > 0)) {
      const timeoutId = setTimeout(() => {
        saveToLocal();
      }, 2000); // Délai de 2 secondes après le changement

      return () => clearTimeout(timeoutId);
    }
  }, [students, teachers, classes, saveToLocal, isElectron]);

  return {
    syncStatus,
    isElectron,
    saveToLocal,
    loadFromLocal,
    exportData
  };
};