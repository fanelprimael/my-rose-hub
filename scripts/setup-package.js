const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration des scripts Electron dans package.json...');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Ajouter les scripts Electron
packageJson.main = 'public/electron.js';
packageJson.scripts = {
  ...packageJson.scripts,
  'electron': 'electron public/electron.js',
  'electron:dev': 'concurrently "npm run dev" "node scripts/dev-electron.js"',
  'electron:build': 'npm run build && node scripts/build-electron.js',
  'electron:pack': 'npm run build && electron-builder',
  'electron:dist': 'npm run build && electron-builder --publish=never'
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Scripts Electron ajoutés avec succès !');
console.log('🚀 Vous pouvez maintenant utiliser:');
console.log('   npm run electron:dev    - Développement');
console.log('   npm run electron:build  - Construction avec vérifications');
console.log('   npm run electron:pack   - Construction directe');