const { spawn } = require('child_process');
const waitOn = require('wait-on');

const runElectron = () => {
  const electron = spawn('electron', ['public/electron.js'], { 
    stdio: 'inherit',
    shell: true 
  });

  electron.on('close', (code) => {
    process.exit(code);
  });
};

// Attendre que Vite soit prêt
waitOn({
  resources: ['http://localhost:8080'],
  delay: 1000,
  timeout: 30000
}).then(() => {
  console.log('Vite dev server is ready, starting Electron...');
  runElectron();
}).catch((err) => {
  console.error('Failed to start Electron:', err);
  process.exit(1);
});