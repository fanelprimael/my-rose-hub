const { spawn } = require('child_process');
const waitOn = require('wait-on');

const runElectron = () => {
  console.log('Starting Electron...');
  const electron = spawn('electron', ['public/electron.js'], { 
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electron.on('close', (code) => {
    console.log(`Electron exited with code ${code}`);
    process.exit(code);
  });

  electron.on('error', (err) => {
    console.error('Failed to start Electron:', err);
    process.exit(1);
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