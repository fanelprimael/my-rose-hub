const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Electron application...');

// Vérifier que le build Vite existe
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Le dossier dist n\'existe pas. Exécutez d\'abord "npm run build"');
  process.exit(1);
}

// Construire l'application Electron
const builder = spawn('electron-builder', ['--publish=never'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, NODE_ENV: 'production' }
});

builder.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build Electron terminé avec succès !');
    console.log('📦 L\'exécutable se trouve dans le dossier dist-electron/');
  } else {
    console.error(`❌ Build Electron échoué avec le code ${code}`);
  }
  process.exit(code);
});

builder.on('error', (err) => {
  console.error('❌ Erreur lors du build Electron:', err);
  process.exit(1);
});