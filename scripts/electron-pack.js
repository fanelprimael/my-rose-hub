const builder = require('electron-builder');
const { Platform } = builder;

// Build options
const opts = {
  config: {
    appId: 'com.laroseraie.app',
    productName: 'École La Roseraie',
    directories: {
      output: 'dist-electron'
    },
    files: [
      'build/**/*',
      'public/electron.js',
      'node_modules/**/*'
    ],
    mac: {
      category: 'public.app-category.education',
      target: [
        {
          target: 'dmg',
          arch: ['x64', 'arm64']
        }
      ]
    },
    win: {
      target: [
        {
          target: 'nsis',
          arch: ['x64']
        }
      ]
    },
    linux: {
      target: [
        {
          target: 'AppImage',
          arch: ['x64']
        }
      ]
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true
    }
  }
};

// Build for current platform
builder.build(opts)
  .then(() => {
    console.log('Build completed successfully!');
  })
  .catch((error) => {
    console.error('Build failed:', error);
  });