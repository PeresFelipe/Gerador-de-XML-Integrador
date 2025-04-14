window.addEventListener('DOMContentLoaded', () => {
  console.log('[renderer] window.geradorXML:', window.geradorXML);

  const form = document.getElementById('formulario');
  const btnGerarNomeFantasia = document.getElementById('gerarNomeFantasia');

  const getValue = (id) => document.getElementById(id)?.value || '';
  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  };

  const inferirTipoLogradouro = (logradouro = '') => {
    const lower = logradouro.toLowerCase();
    if (lower.startsWith('av')) return 'Avenida';
    if (lower.startsWith('rua')) return 'Rua';
    if (lower.startsWith('trav')) return 'Travessa';
    if (lower.startsWith('rod')) return 'Rodovia';
    return 'Outro';
  };

  const tipoAgenteMap = {
    cliente: 'C', fornecedor: 'F', representante: 'R', contato: 'E',
    transportadora: 'T', obrigacao: 'S', colaborador: 'U', outros: 'O',
    obra: 'B', sindicato: 'D',
  };

  const getCheckboxValue = (id) => {
    const sim = document.querySelector(`input[name="${id}"]:checked`);
    return sim?.value === 'sim' ? 'S' : 'N';
  };

  const gerarBlocoFiscal = () => {
    const campo = window.geradorXML.campoXml;

    return `
  <Fiscal OPERACAO="I">
	<AGN_DT_INIVIGENCIA>01/01/2000</AGN_DT_INIVIGENCIA> 
    <AGN_BO_ESCRITURAR>${campo(getCheckboxValue('escriturar'))}</AGN_BO_ESCRITURAR>
    <AGN_BO_ENQUADRAIPI>${campo(getCheckboxValue('enquadraIPI'))}</AGN_BO_ENQUADRAIPI>
    <AGN_BO_ENQUADRAICMS>${campo(getCheckboxValue('enquadraICMS'))}</AGN_BO_ENQUADRAICMS>
    <AGN_BO_CALCICMSNAOENQ>${campo(getCheckboxValue('calculaICMSNaoEnq'))}</AGN_BO_CALCICMSNAOENQ>
    <AGN_BO_ENQUADRAISS>${campo(getCheckboxValue('enquadraISS'))}</AGN_BO_ENQUADRAISS>
    <AGN_BO_RETERIR>${campo(getCheckboxValue('reterIR'))}</AGN_BO_RETERIR>
    <AGN_BO_RETERINSS>${campo(getCheckboxValue('reterINSS'))}</AGN_BO_RETERINSS>
    <AGN_BO_SIMPLES>${campo(getCheckboxValue('enquadraSimples'))}</AGN_BO_SIMPLES>
    <AGN_BO_IPISIMPLES>${campo(getCheckboxValue('ipiSimples'))}</AGN_BO_IPISIMPLES>
    <AGN_BO_ICMSSIMPLES>${campo(getCheckboxValue('icmsSimples'))}</AGN_BO_ICMSSIMPLES>
    <AGN_BO_ISSSIMPLES>${campo(getCheckboxValue('issSimples'))}</AGN_BO_ISSSIMPLES>
    <AGN_BO_INSSSIMPLES>${campo(getCheckboxValue('inssSimples'))}</AGN_BO_INSSSIMPLES>
    <AGN_BO_RETERISS>${campo(getCheckboxValue('reterISS'))}</AGN_BO_RETERISS>
    <AGN_BO_ENQUADRAPIS>${campo(getCheckboxValue('enquadraPIS'))}</AGN_BO_ENQUADRAPIS>
    <AGN_BO_ENQUADRACOFINS>${campo(getCheckboxValue('enquadraCOFINS'))}</AGN_BO_ENQUADRACOFINS>
    <AGN_BO_RETERCSLL>${campo(getCheckboxValue('reterCSLL'))}</AGN_BO_RETERCSLL>
    <AGN_BO_ENQUADRAFUNRURAL>${campo(getCheckboxValue('enquadraFUNRURAL'))}</AGN_BO_ENQUADRAFUNRURAL>
    <AGN_BO_ENQUADRAINSSRURAL>${campo(getCheckboxValue('enquadraINSSRURAL'))}</AGN_BO_ENQUADRAINSSRURAL>
  </Fiscal>`;
  };

  btnGerarNomeFantasia?.addEventListener('click', () => {
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

    setValue('nome', nome);
    setValue('fantasia', fantasia);
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = getValue('nome');
    const fantasia = getValue('fantasia');
    const tipoPessoa = document.querySelector('input[name="tipoPessoa"]:checked')?.value || '';
    const estado = getValue('estado');
    const municipio = getValue('municipio');
    const tipoAgenteSelecionado = document.querySelector('input[name="tipoAgente"]:checked')?.value;

    if (!municipio || !estado || !tipoAgenteSelecionado) {
      alert('Preencha todos os campos obrigatórios antes de gerar o XML.');
      return;
    }

    const email = nome.toLowerCase().replace(/\s/g, '.') + '@exemplo.com';

    try {
      const [resultadoIBGE, endereco] = await Promise.all([
        window.geradorXML.buscarCodigoMunicipio(municipio, estado),
        window.geradorXML.buscarEnderecoPorMunicipio(municipio, estado)
      ]);

      if (!resultadoIBGE?.codigo) throw new Error('Código do município não encontrado');
      if (!endereco) throw new Error('Endereço não encontrado');

      const codigoMunicipioIBGE = resultadoIBGE.codigo;
      const codigoMunicipio = await window.geradorXML.getCodigoInternoPorIBGE(codigoMunicipioIBGE);

      if (!codigoMunicipio) {
        throw new Error(`Código interno não encontrado para o IBGE: ${codigoMunicipioIBGE}`);
      }

      const sigla = inferirTipoLogradouro(endereco.logradouro);

      setValue('cep', endereco.cep || '');
      setValue('logradouro', endereco.logradouro || '');
      setValue('numero', endereco.numero || '');
      setValue('bairro', endereco.bairro || '');
      setValue('sigla', sigla);

      const campo = window.geradorXML.campoXml;

      let blocoPessoa = '';
      if (tipoPessoa === 'F') {
        const cpf = window.geradorXML.gerarCPF();
        blocoPessoa = `
  <PesFisica OPERACAO="I">
    <AGN_ST_CPF>${campo(cpf)}</AGN_ST_CPF>
  </PesFisica>`;
      } else if (tipoPessoa === 'J') {
        const cnpj = window.geradorXML.gerarCNPJ();
        blocoPessoa = `
  <AGN_ST_CGC>${campo(cnpj)}</AGN_ST_CGC>`;
      }

      const xml = `
<Agente OPERACAO="I">
  <AGN_NO_RAZAO>${campo(nome, 80)}</AGN_NO_RAZAO>
  <AGN_NO_FANTASIA>${campo(fantasia, 80)}</AGN_NO_FANTASIA>
  <TPP_IN_CODIGO>${campo(tipoPessoa)}</TPP_IN_CODIGO>
  <TAB05_IN_CODIGO>1</TAB05_IN_CODIGO>
  <AGN_NO_EMAIL>${campo(email, 30)}</AGN_NO_EMAIL>
  <PA_ST_SIGLA>BRA</PA_ST_SIGLA>
  <UF_ST_SIGLA>${campo(estado)}</UF_ST_SIGLA>
  <MUN_NO_NOME>${campo(municipio)}</MUN_NO_NOME>
  <MUN_IN_CODIGO>${campo(codigoMunicipio)}</MUN_IN_CODIGO>
  <TPL_ST_SIGLA>${campo(sigla)}</TPL_ST_SIGLA>
  <AGN_ST_CEP>${campo(endereco.cep)}</AGN_ST_CEP>
  <AGN_ST_LOGRADOURO>${campo(endereco.logradouro, 50)}</AGN_ST_LOGRADOURO>
  <AGN_ST_NUMERO>${campo(endereco.numero, 10)}</AGN_ST_NUMERO>
  <AGN_ST_BAIRRO>${campo(endereco.bairro, 30)}</AGN_ST_BAIRRO>${blocoPessoa}
  <Parametros OPERACAO="I">
    <FIL_IN_CODIGO>100</FIL_IN_CODIGO>
  </Parametros>
  <AgenteId OPERACAO="I">
    <AGN_TAU_ST_CODIGO>${campo(tipoAgenteMap[tipoAgenteSelecionado])}</AGN_TAU_ST_CODIGO>
  </AgenteId>
  ${gerarBlocoFiscal()}
</Agente>`.trim();

      sessionStorage.setItem('xmlGerado', xml);
      window.location.href = 'xml.html';

    } catch (error) {
      alert('Erro ao buscar endereço ou código do município.');
      console.error('Erro ao gerar XML:', error);
    }
  });

  console.log('renderer.js carregado com sucesso!');
});
