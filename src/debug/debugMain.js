const { app, BrowserWindow } = require('electron');
const path = require('path');

function createDebugWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, '..', '..', 'views', 'debug', 'debug.html'));
}

app.whenReady().then(createDebugWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
