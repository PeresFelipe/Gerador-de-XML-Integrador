console.log('debugRenderer.js carregado com sucesso');
const { testarIBGE, testarBrasilAPI, testarViaCEP } = require('./debugApis.js');

window.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultado');

  document.getElementById('btnIBGE').addEventListener('click', async () => {
    resultado.textContent = 'Consultando IBGE...';
    const res = await testarIBGE('SP');
    resultado.textContent = JSON.stringify(res, null, 2);
  });

  document.getElementById('btnBrasilAPI').addEventListener('click', async () => {
    resultado.textContent = 'Consultando BrasilAPI...';
    const res = await testarBrasilAPI('01001-000');
    resultado.textContent = JSON.stringify(res, null, 2);
  });

  document.getElementById('btnViaCEP').addEventListener('click', async () => {
    resultado.textContent = 'Consultando ViaCEP...';
    const res = await testarViaCEP('01001-000');
    resultado.textContent = JSON.stringify(res, null, 2);
  });
});
