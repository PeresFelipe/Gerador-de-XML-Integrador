//Importa módulos necessários do Electron e Node.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

//Desativa a aceleração de hardware para evitar possíveis problemas gráficos
app.disableHardwareAcceleration();

//Variável global para manter a referência da janela principal
let mainWindow;

/**
 * Cria a janela principal da aplicação
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,               // Largura da janela
    height: 600,              // Altura da janela
    resizable: true,          // Permite redimensionamento
    webPreferences: {
      sandbox: false,         // Desativa o sandbox
      contextIsolation: true, // Isola o contexto entre preload e página
      nodeIntegration: false, // Impede uso direto de Node.js no renderer
      preload: path.join(__dirname, 'preload.js'), // Caminho do arquivo preload
    },
  });

  //Remove o menu padrão da janela
  mainWindow.setMenu(null);

  //Carrega o arquivo HTML principal da interface
  mainWindow.loadFile(path.join(__dirname, '..', 'views', 'index.html'));

  //Abre as ferramentas de desenvolvedor da janela principal
  mainWindow.webContents.openDevTools(); 
}

/**
 * Cria uma nova janela para exibir o XML gerado
 * @param {string} xmlContent - O conteúdo do XML a ser exibido
 */
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

  //Remove o menu da nova janela
  xmlWindow.setMenu(null);

  //Carrega a página HTML que exibirá o conteúdo XML
  xmlWindow.loadFile(path.join(__dirname, '..', 'views', 'xmlView.html'));

  //abre o DevTools da janela do XML
  //xmlWindow.webContents.openDevTools(); 

  //Envia o conteúdo XML para a janela após seu carregamento completo
  xmlWindow.webContents.on('did-finish-load', () => {
    xmlWindow.webContents.send('set-xml', xmlContent);
  });
}

//Quando o app estiver pronto, cria a janela principal
app.whenReady().then(() => {
  createWindow();

  //Escuta um evento vindo do renderer solicitando abertura da janela de visualização XML
  ipcMain.on('abrir-nova-janela', (event, xml) => {
    createXmlViewerWindow(xml);
  });

  //Recria a janela se o app for ativado e nenhuma janela estiver aberta (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//Fecha o app quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
