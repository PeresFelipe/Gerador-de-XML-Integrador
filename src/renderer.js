window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const saidaXml = document.getElementById('saidaXml');
  const btnCopiar = document.getElementById('copiarXml');
  const btnGerarNomeFantasia = document.getElementById('gerarNomeFantasia');

  // Verifica se os elementos existem antes de adicionar os eventos
  if (btnGerarNomeFantasia) {
    btnGerarNomeFantasia.addEventListener('click', () => {
      const tipoNome = document.querySelector('input[name="tipoNome"]:checked')?.value;
      if (!tipoNome) return;

      let nome, fantasia;

      if (tipoNome === 'pessoa') {
        nome = window.geradorXML.gerarNomeAleatorio();
        fantasia = window.geradorXML.gerarFantasiaAleatorio(nome);
      } else {
        nome = window.geradorXML.gerarNomeEmpresa();
        fantasia = window.geradorXML.gerarFantasiaEmpresaBaseada(nome);
      }

      document.getElementById('nome').value = nome;
      document.getElementById('fantasia').value = fantasia;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome').value;
      const fantasia = document.getElementById('fantasia').value;
      const tipoPessoa = document.querySelector('input[name="tipoPessoa"]:checked')?.value || '';
      const estado = document.getElementById('estado').value;
      const municipio = document.getElementById('municipio').value;
      const email = nome.toLowerCase().replace(/\s/g, '.') + '@exemplo.com';

      const xml = `
<AGENTE>
  <AGN_NO_RAZAO>${nome}</AGN_NO_RAZAO>
  <AGN_NO_FANTASIA>${fantasia}</AGN_NO_FANTASIA>
  <TPP_IN_CODIGO>${tipoPessoa}</TPP_IN_CODIGO>
  <AGN_NO_EMAIL>${email}</AGN_NO_EMAIL>
  <PAI_ST_SIGLA>BRA</PAI_ST_SIGLA>
  <TPL_ST_SIGLA>${estado}</TPL_ST_SIGLA>
  <MUN_NO_NOME>${municipio}</MUN_NO_NOME>
</AGENTE>
      `.trim();

      if (saidaXml) {
        saidaXml.textContent = xml;
      }
    });
  }

  if (btnCopiar) {
    btnCopiar.addEventListener('click', () => {
      const texto = saidaXml?.textContent;
      if (texto) {
        window.geradorXML.copiarParaClipboard(texto);
        alert('XML copiado para a área de transferência!');
      }
    });
  }

  console.log("renderer.js carregado com sucesso!");
});
