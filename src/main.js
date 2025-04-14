const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, '..', 'views', 'index.html'));

  // 🐞 Abrir DevTools da janela principal
  mainWindow.webContents.openDevTools(); 
}

function createXmlViewerWindow(xmlContent) {
  const xmlWindow = new BrowserWindow({
    width: 700,
    height: 800,
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  xmlWindow.setMenu(null);
  xmlWindow.loadFile(path.join(__dirname, '..', 'views', 'xmlView.html'));

  // 🐞 Abrir DevTools da janela XML (opcional)
  xmlWindow.webContents.openDevTools(); 

  xmlWindow.webContents.on('did-finish-load', () => {
    xmlWindow.webContents.send('set-xml', xmlContent);
  });
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('abrir-nova-janela', (event, xml) => {
    createXmlViewerWindow(xml);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
