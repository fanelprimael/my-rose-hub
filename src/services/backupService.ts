import { supabase } from '@/integrations/supabase/client';
import type { ElectronAPI } from '@/types/electron';

// Étendre l'interface Window pour inclure electronAPI
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export interface BackupData {
  timestamp: string;
  version: string;
  tables: {
    students: any[];
    teachers: any[];
    classes: any[];
    grades: any[];
    payments: any[];
    payment_types: any[];
    school_years: any[];
    school_settings: any[];
    subjects: any[];
  };
}

class BackupService {
  private readonly version = '1.0.0';

  // Vérifier si on est dans Electron
  private isElectron(): boolean {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }

  // Exporter toutes les données depuis Supabase
  async exportAllData(): Promise<BackupData> {
    try {
      const tables = [
        'students', 'teachers', 'classes', 'grades', 
        'payments', 'payment_types', 'school_years', 
        'school_settings', 'subjects'
      ] as const;

      const data: any = {};

      for (const table of tables) {
        const { data: tableData, error } = await supabase
          .from(table)
          .select('*');

        if (error) {
          console.error(`Erreur lors de l'export de ${table}:`, error);
          throw error;
        }

        data[table] = tableData || [];
      }

      return {
        timestamp: new Date().toISOString(),
        version: this.version,
        tables: data
      };
    } catch (error) {
      console.error('Erreur lors de l\'export des données:', error);
      throw error;
    }
  }

  // Importer des données vers Supabase
  async importAllData(backupData: BackupData): Promise<void> {
    try {
      const tables = [
        'students', 'teachers', 'classes', 'grades', 
        'payments', 'payment_types', 'school_years', 
        'school_settings', 'subjects'
      ] as const;

      for (const table of tables) {
        const tableData = backupData.tables[table];
        
        if (tableData && tableData.length > 0) {
          // Supprimer les données existantes
          await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          // Insérer les nouvelles données
          const { error } = await supabase
            .from(table)
            .insert(tableData);

          if (error) {
            console.error(`Erreur lors de l'import de ${table}:`, error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'import des données:', error);
      throw error;
    }
  }

  // Sauvegarde automatique en arrière-plan
  async autoSave(): Promise<void> {
    try {
      const data = await this.exportAllData();
      
      if (this.isElectron() && window.electronAPI) {
        // Sauvegarde Electron avec API sécurisée
        await window.electronAPI.autoSave(data);
      } else {
        // Sauvegarde dans localStorage pour le web
        localStorage.setItem('roseraie-auto-backup', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  }

  // Charger la sauvegarde automatique
  async loadAutoSave(): Promise<BackupData | null> {
    try {
      if (this.isElectron() && window.electronAPI) {
        // Charger depuis Electron avec API sécurisée
        const result = await window.electronAPI.loadAutoSave();
        
        if (result.success) {
          return result.data;
        }
      } else {
        // Charger depuis localStorage
        const saved = localStorage.getItem('roseraie-auto-backup');
        if (saved) {
          const backup = JSON.parse(saved);
          return backup;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du chargement de la sauvegarde automatique:', error);
      return null;
    }
  }

  // Sauvegarder manuellement (avec dialogue de fichier en Electron)
  async saveBackup(): Promise<boolean> {
    try {
      const data = await this.exportAllData();
      
      if (this.isElectron() && window.electronAPI) {
        // Sauvegarde avec dialogue Electron API sécurisée
        const result = await window.electronAPI.saveBackup(data);
        return result.success;
      } else {
        // Téléchargement pour le web
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sauvegarde-roseraie-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  // Charger une sauvegarde manuelle
  async loadBackup(): Promise<BackupData | null> {
    try {
      if (this.isElectron() && window.electronAPI) {
        // Charger avec dialogue Electron API sécurisée
        const result = await window.electronAPI.loadBackup();
        
        if (result.success) {
          return result.data;
        }
      } else {
        // Utiliser un input file pour le web
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                try {
                  const data = JSON.parse(e.target?.result as string);
                  resolve(data);
                } catch (error) {
                  console.error('Erreur lors de la lecture du fichier:', error);
                  resolve(null);
                }
              };
              reader.readAsText(file);
            } else {
              resolve(null);
            }
          };
          input.click();
        });
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return null;
    }
  }

  // Synchroniser avec Supabase (vérifier les différences)
  async syncWithSupabase(): Promise<{ hasChanges: boolean; summary: string }> {
    try {
      const localBackup = await this.loadAutoSave();
      const remoteData = await this.exportAllData();

      if (!localBackup) {
        return { 
          hasChanges: true, 
          summary: 'Aucune sauvegarde locale trouvée. Synchronisation nécessaire.' 
        };
      }

      // Comparer les timestamps et le nombre d'enregistrements
      const localTime = new Date(localBackup.timestamp);
      const remoteTime = new Date(remoteData.timestamp);
      
      let changes = [];
      
      for (const table of Object.keys(remoteData.tables)) {
        const localCount = localBackup.tables[table]?.length || 0;
        const remoteCount = remoteData.tables[table]?.length || 0;
        
        if (localCount !== remoteCount) {
          changes.push(`${table}: ${localCount} → ${remoteCount}`);
        }
      }

      return {
        hasChanges: changes.length > 0 || Math.abs(remoteTime.getTime() - localTime.getTime()) > 60000,
        summary: changes.length > 0 ? `Changements détectés: ${changes.join(', ')}` : 'Données synchronisées'
      };
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      return { hasChanges: true, summary: 'Erreur de synchronisation' };
    }
  }
}

export const backupService = new BackupService();