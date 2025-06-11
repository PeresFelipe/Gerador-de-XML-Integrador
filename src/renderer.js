//Quando o DOM estiver totalmente carregado, executa a função principal.
window.addEventListener('DOMContentLoaded', () => {

  //Loga no console o objeto 'geradorXML' exposto na window (API externa).
  console.log('[renderer] window.geradorXML:', window.geradorXML);

  //Captura o form e o botão para gerar nome fantasia.
  const form = document.getElementById('formulario');
  const btnGerarNomeFantasia = document.getElementById('gerarNomeFantasia');
  
  //Função para obter valor limpo (sem espaços) de um elemento por id
  const getValue = (id) => document.getElementById(id)?.value?.trim() || '';
  
  //Função para setar valor de um elemento por id, se existir
  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  };

  //Função para remover acentos e caracteres especiais de uma string
  const removerAcentos = (str = '') =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s.]/gi, '');

  //Função para inferir o tipo de logradouro a partir da palavra inicial (rua, avenida...)
  const inferirTipoLogradouro = (logradouro = '') => {
    const tipo = logradouro.split(' ')[0].toLowerCase();

    const mapaSiglas = {
      'rua': 'R',
      'avenida': 'AV',
      'travessa': 'TV',
      'alameda': 'AL',
    };

    return mapaSiglas[tipo] || tipo.toUpperCase();
  };

  //Mapeamento de valores para tipo de agente, usado na tag XML
  const tipoAgenteMap = {
    cliente: 'C', fornecedor: 'F', representante: 'R', contato: 'E',
    transportadora: 'T', obrigacao: 'S', colaborador: 'U', outros: 'O',
    obra: 'B', sindicato: 'D', rural: 'R',
  };

  //Função que retorna 'S' se checkbox estiver marcado, 'N' caso contrário
  const getCheckboxValue = (id) => {
    const checkbox = document.getElementById(id);
    return checkbox && checkbox.checked ? 'S' : 'N';
  };

  //Função que monta o bloco XML Fiscal com os checkboxes marcados
  const gerarBlocoFiscal = () => {
    const campo = window.geradorXML.campoXml;

    //Mapeia os ids dos checkboxes para as tags XML correspondentes, obtendo seus valores
    const campos = {
      AGN_BO_ESCRITURAR: getCheckboxValue('escriturar'),
      AGN_BO_ENQUADRAIPI: getCheckboxValue('enquadraIPI'),
      AGN_BO_ENQUADRAICMS: getCheckboxValue('enquadraICMS'),
      AGN_BO_CALCICMSNAOENQ: getCheckboxValue('calculaICMSNaoEnq'),
      AGN_BO_ENQUADRAISS: getCheckboxValue('enquadraISS'),
      AGN_BO_RETERIR: getCheckboxValue('reterIR'),
      AGN_BO_RETERINSS: getCheckboxValue('reterINSS'),
      AGN_BO_SIMPLES: getCheckboxValue('enquadraSimples'),
      AGN_BO_IPISIMPLES: getCheckboxValue('ipiSimples'),
      AGN_BO_ICMSSIMPLES: getCheckboxValue('icmsSimples'),
      AGN_BO_ISSSIMPLES: getCheckboxValue('issSimples'),
      AGN_BO_INSSSIMPLES: getCheckboxValue('inssSimples'),
      AGN_BO_RETERISS: getCheckboxValue('reterISS'),
      AGN_BO_ENQUADRAPIS: getCheckboxValue('enquadraPIS'),
      AGN_BO_ENQUADRACOFINS: getCheckboxValue('enquadraCOFINS'),
      AGN_BO_RETERCSLL: getCheckboxValue('reterCSLL'),
      AGN_BO_ENQUADRAFUNRURAL: getCheckboxValue('enquadraFUNRURAL'),
      AGN_BO_ENQUADRAINSSRURAL: getCheckboxValue('enquadraINSSRURAL'),
    };

    //Filtra os campos que estão marcados ('S') e monta as linhas XML para eles
    const linhasMarcadas = Object.entries(campos)
      .filter(([_, valor]) => valor === 'S')
      .map(([tag]) => `    <${tag}>${campo('S')}</${tag}>`)
      .join('\n');

    //Se nenhum checkbox marcado, retorna string vazia (sem bloco Fiscal)
    if (!linhasMarcadas) return '';

    //Retorna o bloco XML completo com as tags marcadas
    return `
  <Fiscal OPERACAO="I">
    <AGN_DT_INIVIGENCIA>01/01/2000</AGN_DT_INIVIGENCIA>
${linhasMarcadas}
  </Fiscal>`;
  };

  //Função para formatar o XML com indentação e quebras de linha
  const formatarXml = (xml) => {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;

    //Insere quebras de linha entre tags
    xml = xml.replace(reg, '$1\n$2$3');

    //Percorre linha a linha para indentação conforme abertura e fechamento de tags
    xml.split('\n').forEach((node) => {
      let indent = 0;
      if (node.match(/^<\/\w/)) indent = -1; //fechamento de tag
      else if (node.match(/^<\w[^>]*[^/]>/)) indent = 1; //abertura de tag sem fechamento imediato

      formatted += PADDING.repeat(pad) + node.trim() + '\n';
      pad += indent;
    });

    return formatted.trim();
  };

  //Captura os radio buttons do tipoAgente e o container do tipo rural F/J para exibir/esconder
  const tipoAgenteRadios = document.querySelectorAll('input[name="tipoAgente"]');
  const tipoRuralFJContainer = document.getElementById('tipoRuralFJContainer');

  //Atualiza visibilidade do container de tipo rural F/J baseado na seleção do tipoAgente
  const atualizarExibicaoTipoRuralFJ = () => {
    const selecionado = document.querySelector('input[name="tipoAgente"]:checked')?.value;
    if (selecionado === 'R') {
      tipoRuralFJContainer.style.display = 'block';
    } else {
      tipoRuralFJContainer.style.display = 'none';
      setValue('tipoRuralFJ', '');
    }
  };
  
  //Associa o evento de mudança nos radios para atualizar a visibilidade
  tipoAgenteRadios.forEach(radio => {
    radio.addEventListener('change', atualizarExibicaoTipoRuralFJ);
  });

  //Executa atualização inicial para exibir/esconder conforme seleção padrão
  atualizarExibicaoTipoRuralFJ();

  //Evento para o botão gerarNomeFantasia, gera nome e fantasia aleatórios conforme tipo
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
  
  //Evento de submit do formulário para gerar o XML
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    //Coleta valores do formulário
    const nome = getValue('nome');
    const fantasia = getValue('fantasia');
    const tipoPessoa = document.querySelector('input[name="tipoPessoa"]:checked')?.value || '';
    const estado = getValue('estado');
    const municipio = getValue('municipio');
    const tipoAgenteSelecionado = document.querySelector('input[name="tipoAgente"]:checked')?.value;
    const filialCodigo = getValue('filialCodigo');
    const tipoRuralFJInput = document.querySelector('input[name="tipoRuralFJ"]:checked');
    const tipoRuralFJ = tipoRuralFJInput ? tipoRuralFJInput.value : '';

    //Valida se os campos obrigatórios foram preenchidos
    if (!municipio || !estado || !tipoAgenteSelecionado || !filialCodigo) {
      alert('Preencha todos os campos obrigatórios antes de gerar o XML.');
      return;
    }

    //Gera um e-mail fictício baseado no nome (minusculo, sem acentos, espaços por pontos)
    const email = removerAcentos(nome.toLowerCase().replace(/\s/g, '.')) + '@exemplo.com';

    try {
      //Busca código do município e endereço (chama funções expostas na window.geradorXML)
      const [resultadoIBGE, endereco] = await Promise.all([
        window.geradorXML.buscarCodigoMunicipio(municipio, estado),
        window.geradorXML.buscarEnderecoPorMunicipio(municipio, estado)
      ]);

      //Verifica se encontrou código do município no IBGE
      if (!resultadoIBGE?.codigo) throw new Error('Código do município não encontrado');
      if (!endereco) throw new Error('Endereço não encontrado');

      const codigoMunicipioIBGE = resultadoIBGE.codigo;
      const codigoMunicipio = await window.geradorXML.getCodigoInternoPorIBGE(codigoMunicipioIBGE);

      if (!codigoMunicipio) {
        throw new Error(`Código interno não encontrado para o IBGE: ${codigoMunicipioIBGE}`);
      }
      
      //Inferir tipo logradouro a partir do logradouro obtido (ex: Rua, Avenida)
      const sigla = inferirTipoLogradouro(endereco.logradouro) || 'Outro';

      //Preenche campos do formulário com os dados de endereço
      setValue('cep', endereco.cep || '');
      setValue('logradouro', endereco.logradouro || '');
      setValue('numero', endereco.numero || 'S/N');
      setValue('bairro', endereco.bairro || '');
      setValue('sigla', sigla);

      //Obtém a função `campoXml`, que formata valores para serem inseridos no XML (ex: remover caracteres inválidos, truncar, etc.)
      const campo = window.geradorXML.campoXml;

      let blocoPessoa = '';
      //Se o tipo de pessoa for "F" (física), gera um CPF e monta o bloco <PesFisica> com o CPF formatado
      if (tipoPessoa === 'F') {
        const cpf = window.geradorXML.gerarCPF();
        blocoPessoa = `
  <PesFisica OPERACAO="I">
    <AGN_ST_CPF>${campo(cpf)}</AGN_ST_CPF>
  </PesFisica>`;
      } 
      //Se o tipo for "J" (jurídica), gera um CNPJ e monta a tag <AGN_ST_CGC>
      else if (tipoPessoa === 'J') {
        const cnpj = window.geradorXML.gerarCNPJ();
        blocoPessoa = `
  <AGN_ST_CGC>${campo(cnpj)}</AGN_ST_CGC>`;
      }
      
      //Se o tipo for "R" (rural) e foi especificado o subtipo (F ou J), adiciona a tag <AGN_CH_RURALTIPOPESSOAFJ> com o valor apropriado
      const ruralTag = tipoPessoa === 'R' && tipoRuralFJ !== '' 
        ? `\n  <AGN_CH_RURALTIPOPESSOAFJ>${campo(tipoRuralFJ)}</AGN_CH_RURALTIPOPESSOAFJ>` : '';
      
  //Constrói o XML completo do agente, preenchendo todas as tags com os dados do formulário e dados gerados
      const xml = `
    <Agente OPERACAO="I">
      <AGN_ST_NOME>${campo(nome, 100)}</AGN_ST_NOME>
      <AGN_ST_FANTASIA>${campo(fantasia, 100)}</AGN_ST_FANTASIA>
      <TPP_IN_CODIGO>${campo(tipoPessoa)}</TPP_IN_CODIGO>
      <TAB05_IN_CODIGO>${campo(tipoPessoa === 'F' ? '2' : '1')}</TAB05_IN_CODIGO>
      <AGN_ST_EMAIL>${campo(email, 30)}</AGN_ST_EMAIL>
      <PA_ST_SIGLA>BRA</PA_ST_SIGLA>
      <UF_ST_SIGLA>${campo(estado)}</UF_ST_SIGLA>
      <MUN_NO_NOME>${campo(municipio)}</MUN_NO_NOME>
      <MUN_IN_CODIGO>${campo(codigoMunicipio)}</MUN_IN_CODIGO>
      <TPL_ST_SIGLA>${campo(sigla)}</TPL_ST_SIGLA>
      <AGN_ST_CEP>${campo(endereco.cep)}</AGN_ST_CEP>
      <AGN_ST_LOGRADOURO>${campo(endereco.logradouro, 50)}</AGN_ST_LOGRADOURO>
      <AGN_ST_NUMERO>${campo(endereco.numero || 'S/N', 10)}</AGN_ST_NUMERO>
      <AGN_ST_BAIRRO>${campo(endereco.bairro, 30)}</AGN_ST_BAIRRO>${blocoPessoa}${ruralTag}
    <Parametros OPERACAO="I">
      <FIL_IN_CODIGO>${campo(filialCodigo)}</FIL_IN_CODIGO>
    </Parametros>
  <AgenteId OPERACAO="I">
    <AGN_TAU_ST_CODIGO>${campo(tipoAgenteMap[tipoAgenteSelecionado])}</AGN_TAU_ST_CODIGO>
    </AgenteId>${gerarBlocoFiscal()}
  </Agente>`.trim();

      //Formata o XML para deixar a indentação e estrutura legível
      const xmlFormatado = formatarXml(xml);
      //Salva o XML no sessionStorage para ser carregado na próxima página
      sessionStorage.setItem('xmlGerado', xmlFormatado);
      //Redireciona o usuário para a página onde o XML será exibido
      window.location.href = 'xml.html';

    } catch (error) {
      alert('Erro ao buscar endereço ou código do município.');
      console.error('Erro ao gerar XML:', error);
      console.log('XML gerado:', xml);
    }
  });

  console.log('renderer.js carregado com sucesso!');
});
