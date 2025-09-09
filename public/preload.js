const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Gestion des sauvegardes
  saveBackup: (data) => ipcRenderer.invoke('save-backup', data),
  loadBackup: () => ipcRenderer.invoke('load-backup'),
  autoSave: (data) => ipcRenderer.invoke('auto-save', data),
  loadAutoSave: () => ipcRenderer.invoke('load-auto-save'),
  
  // Écouteurs d'événements
  onSaveData: (callback) => ipcRenderer.on('save-data', callback),
  onImportData: (callback) => ipcRenderer.on('import-data', callback),
  
  // Supprimer les écouteurs
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});