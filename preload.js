const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    getPasswords: () => ipcRenderer.invoke('get-passwords'),
    savePassword: (passwordData) => ipcRenderer.invoke('save-password', passwordData),
    updatePassword: (updatedPassword) => ipcRenderer.invoke('update-password', updatedPassword),
    updatePasswordOrder: (passwords) => ipcRenderer.invoke('update-password-order', passwords),
    deletePassword: (id) => ipcRenderer.invoke('delete-password', id)
  }
); 