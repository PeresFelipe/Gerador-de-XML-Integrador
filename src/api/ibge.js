//Importa o módulo 'https' do Node.js, usado para fazer requisições HTTPS
const https = require('https');

/**
 * Função que busca o código IBGE de um município com base no nome e na UF.
 * @param {string} nomeMunicipio - Nome do município a ser buscado.
 * @param {string} uf - Sigla do estado (UF) onde o município está localizado.
 * @returns {Promise<object>} - Retorna uma Promise que resolve com o código do município e cep (null por padrão aqui).
 */

function buscarCodigoMunicipio(nomeMunicipio, uf) {
  return new Promise((resolve, reject) => {
    
    //Monta a URL da API do IBGE com base na UF fornecida
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;

    //Loga no console que a busca começou, com a UF e a URL utilizada
    console.log('[IBGE] Buscando municípios da UF:', uf, 'URL:', url);

    //Realiza a requisição HTTPS GET para a URL
    https.get(url, (res) => {
      let data = '';

      //Ao receber dados da resposta, acumula no buffer 'data'
      res.on('data', chunk => data += chunk);

      //Quando a resposta for completamente recebida
      res.on('end', () => {
        try {
          //Converte a string JSON recebida para um array de objetos
          const municipios = JSON.parse(data);

          //Normaliza o nome do município recebido para comparação (sem espaços e tudo minúsculo)
          const nomeNormalizado = nomeMunicipio.trim().toLowerCase();

          //Loga no console o nome que será usado na busca
          console.log('[IBGE] Procurando nome:', nomeNormalizado);

          //Busca no array de municípios aquele que tem o nome igual ao nome normalizado
          const encontrado = municipios.find(m =>
            m.nome.toLowerCase() === nomeNormalizado
          );

          //Se não encontrou o município, rejeita a Promise com erro
          if (!encontrado) {
            console.warn('[IBGE] Município não encontrado dentro da UF:', uf);
            return reject(new Error('Município não encontrado.'));
          }

          //Loga no console o nome e o código do município encontrado
          console.log('[IBGE] Município encontrado:', encontrado.nome, 'Código IBGE:', encontrado.id);

          //Resolve a Promise com o código do município. O campo 'cep' é definido como null por enquanto.
          resolve({ codigo: encontrado.id, cep: null });

        } catch (e) {
          //Em caso de erro ao interpretar o JSON, loga o erro e rejeita a Promise
          console.error('[IBGE] Erro ao interpretar resposta JSON:', e);
          reject(new Error('Erro ao interpretar JSON da API do IBGE.'));
        }
      });

    //Trata erros na requisição (ex: falha de rede)
    }).on('error', (err) => {
      console.error('[IBGE] Erro na requisição:', err);
      reject(err);
    });
  });
}

//Exporta a função buscarCodigoMunicipio para que possa ser usada em outros arquivos (CommonJS)
module.exports = {
  buscarCodigoMunicipio
};
