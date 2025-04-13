const { app, BrowserWindow } = require('electron');
const path = require('path');

app.disableHardwareAcceleration(); // Boa prática em apps simples

function createWindow() {
  const win = new BrowserWindow({
    width: 800, // aumentei para dar mais espaço à interface
    height: 600,
    resizable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false, // importante manter falso com contextIsolation: true
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.setMenu(null); // remove menu padrão (opcional)
  win.loadFile(path.join(__dirname, '..', 'views', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); // mantém o comportamento padrão de macOS
});
