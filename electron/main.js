const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// Configuration des données locales
const userDataPath = app.getPath('userData');
const localDataPath = path.join(userDataPath, 'school-data');

async function createWindow() {
  // Créer le dossier de données locales s'il n'existe pas
  try {
    await fs.mkdir(localDataPath, { recursive: true });
  } catch (error) {
    console.log('Dossier déjà existant ou erreur:', error.message);
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Gestion Scolaire - École Roseraie'
  });

  // Charger l'app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// Gestion de la sauvegarde locale des données
ipcMain.handle('save-local-data', async (event, data) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const backupPath = path.join(localDataPath, `backup-${timestamp}.json`);
    
    await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
    
    // Garder seulement les 30 dernières sauvegardes
    const files = await fs.readdir(localDataPath);
    const backupFiles = files.filter(f => f.startsWith('backup-')).sort();
    
    if (backupFiles.length > 30) {
      const filesToDelete = backupFiles.slice(0, -30);
      for (const file of filesToDelete) {
        await fs.unlink(path.join(localDataPath, file));
      }
    }
    
    return { success: true, path: backupPath };
  } catch (error) {
    console.error('Erreur sauvegarde locale:', error);
    return { success: false, error: error.message };
  }
});

// Récupération des données locales
ipcMain.handle('get-local-data', async () => {
  try {
    const files = await fs.readdir(localDataPath);
    const backupFiles = files.filter(f => f.startsWith('backup-')).sort().reverse();
    
    if (backupFiles.length === 0) {
      return { success: false, error: 'Aucune sauvegarde locale trouvée' };
    }
    
    const latestBackup = backupFiles[0];
    const data = await fs.readFile(path.join(localDataPath, latestBackup), 'utf8');
    
    return { 
      success: true, 
      data: JSON.parse(data),
      backupDate: latestBackup.replace('backup-', '').replace('.json', '')
    };
  } catch (error) {
    console.error('Erreur lecture données locales:', error);
    return { success: false, error: error.message };
  }
});

// Export des données vers un dossier choisi
ipcMain.handle('export-data', async (event, data) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter les données scolaires',
      defaultPath: `donnees-ecole-${new Date().toISOString().split('T')[0]}.json`,
      filters: [
        { name: 'Fichiers JSON', extensions: ['json'] },
        { name: 'Tous les fichiers', extensions: ['*'] }
      ]
    });

    if (!result.canceled) {
      await fs.writeFile(result.filePath, JSON.stringify(data, null, 2));
      return { success: true, path: result.filePath };
    }
    
    return { success: false, error: 'Export annulé' };
  } catch (error) {
    console.error('Erreur export:', error);
    return { success: false, error: error.message };
  }
});

// Obtenir le chemin des données locales
ipcMain.handle('get-data-path', () => {
  return localDataPath;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});