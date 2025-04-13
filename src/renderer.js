window.addEventListener('DOMContentLoaded', () => {
  console.log('[renderer] window.geradorXML:', window.geradorXML);

  const form = document.getElementById('formulario');
  const saidaXml = document.getElementById('saidaXml');
  const btnCopiar = document.getElementById('copiarXml');
  const btnGerarNomeFantasia = document.getElementById('gerarNomeFantasia');

  function escapeXml(unsafe) {
    return String(unsafe ?? '').replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  function inferirTipoLogradouro(logradouro) {
    if (typeof logradouro !== 'string') return '';
    const lower = logradouro.toLowerCase();

    if (lower.startsWith('av')) return 'Avenida';
    if (lower.startsWith('rua')) return 'Rua';
    if (lower.startsWith('trav')) return 'Travessa';
    if (lower.startsWith('rod')) return 'Rodovia';

    return 'Outro';
  }

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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome').value;
      const fantasia = document.getElementById('fantasia').value;
      const tipoPessoa = document.querySelector('input[name="tipoPessoa"]:checked')?.value || '';
      const estado = document.getElementById('estado').value;
      const municipio = document.getElementById('municipio').value;
      const email = nome.toLowerCase().replace(/\s/g, '.') + '@exemplo.com';

      try {
        // Buscar código do município
        const resultadoIBGE = await window.geradorXML.buscarCodigoMunicipio(municipio, estado);
        const codigoMunicipio = resultadoIBGE.codigo;
        if (!codigoMunicipio) throw new Error('Código do município não encontrado');

        // Buscar endereço
        const endereco = await window.geradorXML.buscarEnderecoPorMunicipio(municipio, estado);
        if (!endereco) throw new Error('Endereço não encontrado');

        const sigla = inferirTipoLogradouro(endereco.logradouro);

        // Preencher campos na interface
        document.getElementById('cep').value = endereco.cep || '';
        document.getElementById('logradouro').value = endereco.logradouro || '';
        document.getElementById('numero').value = endereco.numero || '';
        document.getElementById('bairro').value = endereco.bairro || '';

        // Se o campo sigla existir, atualiza
        const inputSigla = document.getElementById('sigla');
        if (inputSigla) inputSigla.value = sigla;

        const xml = `
<AGENTE>
  <AGN_NO_RAZAO>${escapeXml(nome)}</AGN_NO_RAZAO>
  <AGN_NO_FANTASIA>${escapeXml(fantasia)}</AGN_NO_FANTASIA>
  <TPP_IN_CODIGO>${escapeXml(tipoPessoa)}</TPP_IN_CODIGO>
  <AGN_NO_EMAIL>${escapeXml(email)}</AGN_NO_EMAIL>
  <PAI_ST_SIGLA>BRA</PAI_ST_SIGLA>
  <UF_ST_SIGLA>${escapeXml(estado)}</UF_ST_SIGLA>
  <MUN_NO_NOME>${escapeXml(municipio)}</MUN_NO_NOME>
  <MUN_IN_CODIGO>${escapeXml(codigoMunicipio)}</MUN_IN_CODIGO>
  <TPL_ST_SIGLA>${escapeXml(sigla)}</TPL_ST_SIGLA>
  <AGN_ST_CEP>${escapeXml(endereco.cep)}</AGN_ST_CEP>
  <AGN_ST_LOGRADOURO>${escapeXml(endereco.logradouro)}</AGN_ST_LOGRADOURO>
  <AGN_ST_NUMERO>${escapeXml(endereco.numero)}</AGN_ST_NUMERO>
  <AGN_ST_BAIRRO>${escapeXml(endereco.bairro)}</AGN_ST_BAIRRO>
</AGENTE>
        `.trim();

        saidaXml.textContent = xml;
      } catch (error) {
        alert('Erro ao buscar endereço ou código do município.');
        console.error('Erro:', error);
      }
    });
  }

  if (btnCopiar) {
    btnCopiar.addEventListener('click', () => {
      const texto = saidaXml?.textContent;
      if (texto) {
        window.geradorXML.copiarParaClipboard(texto);
        const msg = document.getElementById('copiadoMsg');
        if (msg) {
          msg.style.display = 'block';
          setTimeout(() => msg.style.display = 'none', 2000);
        }
      }
    });
  }

  console.log("renderer.js carregado com sucesso!");
});
