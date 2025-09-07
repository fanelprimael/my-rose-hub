const { contextBridge, ipcRenderer } = require('electron');

// Exposer les API Electron au renderer de manière sécurisée
contextBridge.exposeInMainWorld('electronAPI', {
  // Sauvegarde locale automatique
  saveLocalData: (data) => ipcRenderer.invoke('save-local-data', data),
  
  // Récupération des données locales
  getLocalData: () => ipcRenderer.invoke('get-local-data'),
  
  // Export manuel des données
  exportData: (data) => ipcRenderer.invoke('export-data', data),
  
  // Obtenir le chemin des données
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
  
  // Vérifier si on est dans Electron
  isElectron: true
});