import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backupService, BackupData } from '@/services/backupService';
import { useToast } from '@/hooks/use-toast';

interface BackupContextType {
  isAutoSaveEnabled: boolean;
  lastBackupTime: string | null;
  syncStatus: { hasChanges: boolean; summary: string };
  
  toggleAutoSave: () => void;
  performBackup: () => Promise<boolean>;
  loadBackup: () => Promise<boolean>;
  checkSyncStatus: () => Promise<void>;
  performAutoSave: () => Promise<void>;
}

const BackupContext = createContext<BackupContextType | undefined>(undefined);

export const BackupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState({ hasChanges: false, summary: 'Non vérifié' });
  const { toast } = useToast();

  // Intervalle de sauvegarde automatique (5 minutes)
  const AUTO_SAVE_INTERVAL = 5 * 60 * 1000;

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedAutoSave = localStorage.getItem('roseraie-auto-save-enabled');
    if (savedAutoSave !== null) {
      setIsAutoSaveEnabled(JSON.parse(savedAutoSave));
    }

    // Charger le dernier temps de sauvegarde
    const lastSave = localStorage.getItem('roseraie-last-backup');
    if (lastSave) {
      setLastBackupTime(lastSave);
    }

    // Vérifier le statut de synchronisation au démarrage
    checkSyncStatus();

    // Effectuer une sauvegarde automatique au démarrage
    if (isAutoSaveEnabled) {
      performAutoSave();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoSaveEnabled) {
      interval = setInterval(() => {
        performAutoSave();
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoSaveEnabled]);

  const toggleAutoSave = () => {
    const newValue = !isAutoSaveEnabled;
    setIsAutoSaveEnabled(newValue);
    localStorage.setItem('roseraie-auto-save-enabled', JSON.stringify(newValue));
    
    toast({
      title: newValue ? "Sauvegarde automatique activée" : "Sauvegarde automatique désactivée",
      description: newValue ? "Les données seront sauvegardées toutes les 5 minutes" : "La sauvegarde automatique est maintenant désactivée"
    });
  };

  const performAutoSave = async () => {
    try {
      await backupService.autoSave();
      const now = new Date().toISOString();
      setLastBackupTime(now);
      localStorage.setItem('roseraie-last-backup', now);
      
      // Vérifier le statut de sync après la sauvegarde
      await checkSyncStatus();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  };

  const performBackup = async (): Promise<boolean> => {
    try {
      const success = await backupService.saveBackup();
      
      if (success) {
        toast({
          title: "Sauvegarde réussie",
          description: "Les données ont été sauvegardées avec succès"
        });
        
        const now = new Date().toISOString();
        setLastBackupTime(now);
        localStorage.setItem('roseraie-last-backup', now);
      } else {
        toast({
          title: "Échec de la sauvegarde",
          description: "Une erreur est survenue lors de la sauvegarde",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les données",
        variant: "destructive"
      });
      return false;
    }
  };

  const loadBackup = async (): Promise<boolean> => {
    try {
      const data = await backupService.loadBackup();
      
      if (data) {
        await backupService.importAllData(data);
        
        toast({
          title: "Restauration réussie",
          description: `Données restaurées depuis la sauvegarde du ${new Date(data.timestamp).toLocaleString('fr-FR')}`
        });
        
        // Recharger la page pour rafraîchir toutes les données
        window.location.reload();
        return true;
      } else {
        toast({
          title: "Restauration annulée",
          description: "Aucun fichier sélectionné"
        });
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      toast({
        title: "Erreur de restauration",
        description: "Impossible de restaurer les données",
        variant: "destructive"
      });
      return false;
    }
  };

  const checkSyncStatus = async () => {
    try {
      const status = await backupService.syncWithSupabase();
      setSyncStatus(status);
    } catch (error) {
      console.error('Erreur lors de la vérification de synchronisation:', error);
      setSyncStatus({ hasChanges: true, summary: 'Erreur de vérification' });
    }
  };

  return (
    <BackupContext.Provider value={{
      isAutoSaveEnabled,
      lastBackupTime,
      syncStatus,
      toggleAutoSave,
      performBackup,
      loadBackup,
      checkSyncStatus,
      performAutoSave
    }}>
      {children}
    </BackupContext.Provider>
  );
};

export const useBackup = () => {
  const context = useContext(BackupContext);
  if (context === undefined) {
    throw new Error('useBackup must be used within a BackupProvider');
  }
  return context;
};