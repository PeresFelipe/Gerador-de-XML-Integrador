const { contextBridge, ipcRenderer, clipboard } = require('electron');
const viaCep = require('./api/viaCep');
const ibge = require('./api/ibge');
const nomeGenerator = require('./utils/nomeGenerator');
const { gerarCNPJ } = require('./utils/cnpjGenerator');
const { gerarCPF } = require('./utils/cpfGenerator');
const { campoXml } = require('./utils/utils');
const { getCodigoInternoPorIBGE } = require('./utils/codigoMapper'); // 🆕 novo import

contextBridge.exposeInMainWorld('geradorXML', {
  // 🔤 Geradores de nomes e documentos
  gerarNomeAleatorio: nomeGenerator.gerarNomeAleatorio,
  gerarFantasiaAleatorio: nomeGenerator.gerarFantasiaAleatorio,
  gerarNomeEmpresa: nomeGenerator.gerarNomeEmpresa,
  gerarFantasiaEmpresaBaseada: nomeGenerator.gerarFantasiaEmpresaBaseada,
  gerarCNPJ,
  gerarCPF,

  // 📋 Área de transferência
  copiarParaClipboard: texto => clipboard.writeText(texto),

  // 🌐 Integração com APIs externas
  buscarEnderecoPorMunicipio: viaCep.buscarEnderecoPorMunicipio,
  buscarCodigoMunicipio: ibge.buscarCodigoMunicipio,

  // 📥 Código interno a partir do IBGE
  getCodigoInternoPorIBGE, // 🆕

  // 🧩 Utilitários auxiliares
  campoXml,

  // 🪟 Comunicação entre janelas
  abrirNovaJanela: xml => ipcRenderer.send('abrir-nova-janela', xml),
  receberXml: callback => ipcRenderer.on('set-xml', (event, data) => callback(data))
});

console.log('[preload] geradorXML carregado!');
