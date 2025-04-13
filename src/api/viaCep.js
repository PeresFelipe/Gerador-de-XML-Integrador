const https = require('https');

function buscarEnderecoPorMunicipio(municipio, uf) {
  const tentarComTipoLogradouro = (tipo) => {
    return new Promise((resolve, reject) => {
      const url = `https://viacep.com.br/ws/${uf}/${encodeURIComponent(municipio)}/${tipo}/json/`;

      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);

            if (!Array.isArray(json) || json.length === 0 || json.erro) {
              return reject(new Error(`Nenhum endereço encontrado para tipo ${tipo}.`));
            }

            const endereco = json.find(e => e.cep && e.logradouro) || json[0];

            resolve({
              cep: endereco.cep || '',
              logradouro: endereco.logradouro || 'Rua Principal',
              bairro: endereco.bairro || 'Centro',
              numero: Math.floor(Math.random() * 900 + 100),
              sigla: endereco.logradouro?.toLowerCase().includes('av') ? 'Avenida' : 'R'
            });
          } catch (err) {
            reject(new Error('Erro ao interpretar JSON da resposta da API ViaCEP.'));
          }
        });
      }).on('error', reject);
    });
  };

  // Tenta com "rua", depois com "avenida"
  return tentarComTipoLogradouro('rua')
    .catch(() => tentarComTipoLogradouro('avenida'));
}

module.exports = {
  buscarEnderecoPorMunicipio
};
