const https = require('https');

function buscarCodigoMunicipio(nomeMunicipio, uf) {
  return new Promise((resolve, reject) => {
    https.get('https://servicodados.ibge.gov.br/api/v1/localidades/municipios', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const municipios = JSON.parse(data);
          const encontrado = municipios.find(m =>
            m.nome.toLowerCase() === nomeMunicipio.toLowerCase() &&
            m.microrregiao.mesorregiao.UF.sigla.toUpperCase() === uf.toUpperCase()
          );

          if (!encontrado) return reject(new Error('Município não encontrado.'));

          const codigo = encontrado.id;

          // 🧠 Agora buscar o CEP correspondente usando API do IBGE
          https.get(`https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${codigo}?formato=application/vnd.geo+json`, (cepRes) => {
            let cepData = '';
            cepRes.on('data', chunk => cepData += chunk);
            cepRes.on('end', () => {
              // ⚠️ A API acima nem sempre retorna CEP diretamente, então alternativa:
              // usar um CEP genérico para a cidade. Vamos criar uma base de fallback (ver sugestão abaixo).
              resolve({ codigo, cep: null }); // retornamos apenas o código por ora
            });
          }).on('error', () => {
            // Não achou um CEP confiável, mas ainda retorna o código
            resolve({ codigo, cep: null });
          });

        } catch (e) {
          reject(new Error('Erro ao interpretar JSON da API do IBGE.'));
        }
      });
    }).on('error', reject);
  });
}

module.exports = {
  buscarCodigoMunicipio
};
