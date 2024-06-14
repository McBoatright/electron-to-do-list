const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.handle('read-file', (event, filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Failed to read file at ${filePath}:`, error);
      return '[]';
    }
  });
  
ipcMain.handle('write-file', (event, filePath, data) => fs.writeFileSync(filePath, data));
ipcMain.handle('join-path', (event, ...args) => path.join(...args));

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Also set this to false
    }
  })

  win.loadFile('index.html');

  // Add this line to send __dirname to the renderer process
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('dirname', __dirname);
  });
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})