const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize secure storage
const store = new Store({
  encryptionKey: 'your-encryption-key', // In production, use a secure key management strategy
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 700,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  
  // Open DevTools in development mode
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for password management
ipcMain.handle('get-passwords', () => {
  return store.get('passwords') || [];
});

ipcMain.handle('save-password', (event, passwordData) => {
  const passwords = store.get('passwords') || [];
  passwords.push({
    id: Date.now(),
    name: passwordData.name,
    password: passwordData.password,
    createdAt: passwordData.createdAt
  });
  store.set('passwords', passwords);
  return passwords;
});

ipcMain.handle('update-password', (event, updatedPassword) => {
  const passwords = store.get('passwords') || [];
  const updatedPasswords = passwords.map(pw => {
    if (pw.id === updatedPassword.id) {
      return {
        ...pw,
        name: updatedPassword.name,
        password: updatedPassword.password
      };
    }
    return pw;
  });
  store.set('passwords', updatedPasswords);
  return updatedPasswords;
});

ipcMain.handle('update-password-order', (event, newPasswordsOrder) => {
  store.set('passwords', newPasswordsOrder);
  return newPasswordsOrder;
});

ipcMain.handle('delete-password', (event, id) => {
  const passwords = store.get('passwords') || [];
  const updatedPasswords = passwords.filter(pw => pw.id !== id);
  store.set('passwords', updatedPasswords);
  return updatedPasswords;
}); 