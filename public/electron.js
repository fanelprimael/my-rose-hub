const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // Créer la fenêtre principale de l'application
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, 'favicon.ico'),
    title: 'École La Roseraie - Gestion Scolaire'
  });

  // Charger l'application
  const startUrl = isDev 
    ? 'http://localhost:8080' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Ouvrir les DevTools en mode développement
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Créer le menu de l'application
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Sauvegarder les données',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-data');
          }
        },
        {
          label: 'Importer des données',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('import-data');
          }
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Actualiser' },
        { role: 'forceReload', label: 'Forcer l\'actualisation' },
        { role: 'toggleDevTools', label: 'Outils de développement' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Taille réelle' },
        { role: 'zoomIn', label: 'Zoom avant' },
        { role: 'zoomOut', label: 'Zoom arrière' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'À propos',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'À propos',
              message: 'École La Roseraie - Système de Gestion Scolaire',
              detail: 'Version 1.0.0\nApplication de gestion pour établissements scolaires'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Gestionnaires IPC pour la sauvegarde/restauration des données
ipcMain.handle('save-backup', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Sauvegarder les données',
      defaultPath: `sauvegarde-roseraie-${new Date().toISOString().split('T')[0]}.json`,
      filters: [
        { name: 'Fichiers JSON', extensions: ['json'] },
        { name: 'Tous les fichiers', extensions: ['*'] }
      ]
    });

    if (filePath) {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return { success: true, path: filePath };
    }
    return { success: false, cancelled: true };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-backup', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Charger une sauvegarde',
      filters: [
        { name: 'Fichiers JSON', extensions: ['json'] },
        { name: 'Tous les fichiers', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (filePaths && filePaths.length > 0) {
      const fileContent = await fs.readFile(filePaths[0], 'utf8');
      const data = JSON.parse(fileContent);
      return { success: true, data };
    }
    return { success: false, cancelled: true };
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('auto-save', async (event, data) => {
  try {
    const userDataPath = app.getPath('userData');
    const autoSavePath = path.join(userDataPath, 'auto-backup.json');
    
    await fs.writeFile(autoSavePath, JSON.stringify({
      timestamp: new Date().toISOString(),
      data
    }, null, 2));
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde automatique:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-auto-save', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const autoSavePath = path.join(userDataPath, 'auto-backup.json');
    
    const fileContent = await fs.readFile(autoSavePath, 'utf8');
    const backup = JSON.parse(fileContent);
    
    return { success: true, ...backup };
  } catch (error) {
    // Pas d'erreur si le fichier n'existe pas
    return { success: false, error: 'Aucune sauvegarde automatique trouvée' };
  }
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