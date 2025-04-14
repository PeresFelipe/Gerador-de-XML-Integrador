const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const caminhoCSV = path.resolve(__dirname, '../../assets/codigo.csv');
const mapaCodigos = new Map();

// 🟡 Carrega o CSV ao iniciar
fs.createReadStream(caminhoCSV)
  .pipe(csv())
  .on('data', (row) => {
    const ibge = row.ibge?.toString().trim() || row['MUN_IN_CODIGOIBGE']?.toString().trim();
    const codigoInterno = row.codigoInterno?.toString().trim() || row['MUN_IN_CODIGO']?.toString().trim();

    if (ibge && codigoInterno) {
      mapaCodigos.set(ibge, codigoInterno);
    }
  })
  .on('end', () => {
    console.log('[codigoMapper] Código CSV carregado com', mapaCodigos.size, 'registros.');
  })
  .on('error', (err) => {
    console.error('[codigoMapper] Erro ao ler o CSV:', err.message);
  });

function getCodigoInternoPorIBGE(codigoIBGE) {
  const codigo = mapaCodigos.get(String(codigoIBGE));
  if (!codigo) {
    throw new Error(`Código interno não encontrado para o IBGE: ${codigoIBGE}`);
  }
  return codigo;
}

module.exports = { getCodigoInternoPorIBGE };
