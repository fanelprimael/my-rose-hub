// Types pour l'API Electron
export interface ElectronAPI {
  saveBackup: (data: any) => Promise<{ success: boolean; path?: string; error?: string }>;
  loadBackup: () => Promise<{ success: boolean; data?: any; error?: string }>;
  autoSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  loadAutoSave: () => Promise<{ success: boolean; data?: any; timestamp?: string; error?: string }>;
  onSaveData: (callback: () => void) => void;
  onImportData: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};