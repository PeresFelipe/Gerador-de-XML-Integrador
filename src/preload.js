const { contextBridge } = require('electron');
const clipboard = require('electron').clipboard;
const viaCep = require('./api/viaCep.js');
const ibge = require('./api/ibge.js');
const nomeGenerator = require('./utils/nomeGenerator.js');
const { gerarCNPJ } = require('./utils/cnpjGenerator');
const { gerarCPF } = require('./utils/cpfGenerator');

// Expondo funções com segurança via contextBridge
contextBridge.exposeInMainWorld('geradorXML', {
  // 🔤 Geradores de nomes
  gerarNomeAleatorio: nomeGenerator.gerarNomeAleatorio,
  gerarFantasiaAleatorio: nomeGenerator.gerarFantasiaAleatorio,
  gerarNomeEmpresa: nomeGenerator.gerarNomeEmpresa,
  gerarFantasiaEmpresaBaseada: nomeGenerator.gerarFantasiaEmpresaBaseada,
  gerarCNPJ,
  gerarCPF,

  // 📋 Área de transferência
  copiarParaClipboard: (texto) => clipboard.writeText(texto),

  // 🌐 APIs externas
  buscarEnderecoPorMunicipio: viaCep.buscarEnderecoPorMunicipio,
  buscarCodigoMunicipio: ibge.buscarCodigoMunicipio
});

console.log('[preload] geradorXML carregado!');
