//Importa o módulo 'https' do Node.js para fazer requisições HTTPS
const https = require('https');

/**
 * Função que tenta encontrar um endereço genérico para um município e UF, usando a API do ViaCEP.
 * @param {string} municipio - Nome do município (ex: "Campinas").
 * @param {string} uf - Sigla da UF (ex: "SP").
 * @returns {Promise<object>} - Promise que resolve com um objeto contendo cep, logradouro, bairro, número e sigla do tipo de logradouro.
 */

function buscarEnderecoPorMunicipio(municipio, uf) {
  //Função interna que tenta buscar endereços com um tipo de logradouro específico (ex: "rua", "avenida")
  const tentarComTipoLogradouro = (tipo) => {
    return new Promise((resolve, reject) => {
      //Monta a URL da API do ViaCEP para buscar endereços
      const url = `https://viacep.com.br/ws/${uf}/${encodeURIComponent(municipio)}/${tipo}/json/`;

      //Faz a requisição HTTPS GET
      https.get(url, (res) => {
        let data = '';

        //Acumula os dados recebidos
        res.on('data', chunk => data += chunk);

        //Quando todos os dados forem recebidos
        res.on('end', () => {
          try {

            //Tenta converter a resposta em JSON
            const json = JSON.parse(data);

            //Verifica se o JSON é válido e contém ao menos um endereço
            if (!Array.isArray(json) || json.length === 0 || json.erro) {
              return reject(new Error(`Nenhum endereço encontrado para tipo ${tipo}.`));
            }

            //Tenta encontrar um endereço com CEP e logradouro, ou pega o primeiro da lista como fallback
            const endereco = json.find(e => e.cep && e.logradouro) || json[0];

            //Resolve a Promise com os dados processados do endereço
            resolve({
              cep: endereco.cep || '',
              logradouro: endereco.logradouro || 'Rua Principal', //fallback se o logradouro vier vazio
              bairro: endereco.bairro || 'Centro', //fallback para bairro
              numero: Math.floor(Math.random() * 900 + 100), //número aleatório entre 100 e 999
              sigla: endereco.logradouro?.toLowerCase().includes('av') ? 'Avenida' : 'R' //define "Avenida" ou "R" com base no nome
            });

          } catch (err) {
            //Se falhar ao converter o JSON, rejeita com erro
            reject(new Error('Erro ao interpretar JSON da resposta da API ViaCEP.'));
          }
        });

      //Trata erro de conexão
      }).on('error', reject);
    });
  };

  //Tenta primeiro buscar com tipo "rua". Se falhar, tenta com "avenida".
  return tentarComTipoLogradouro('rua')
    .catch(() => tentarComTipoLogradouro('avenida'));
}

//Exporta a função para que possa ser utilizada em outros módulos (CommonJS)
module.exports = {
  buscarEnderecoPorMunicipio
};
