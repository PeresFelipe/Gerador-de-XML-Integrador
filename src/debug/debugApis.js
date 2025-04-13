const fetch = require('node-fetch');

async function testarIBGE(uf) {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  return await res.json();
}

async function testarBrasilAPI(cep) {
  const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
  return await res.json();
}

async function testarViaCEP(cep) {
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  return await res.json();
}

module.exports = {
  testarIBGE,
  testarBrasilAPI,
  testarViaCEP
};
