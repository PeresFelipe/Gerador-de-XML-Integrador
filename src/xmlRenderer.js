window.addEventListener('DOMContentLoaded', () => {
  const xmlContent = document.getElementById('xmlContent');
  const copiarXmlButton = document.getElementById('copiarXml');
  const copiadoMsg = document.getElementById('copiadoMsg');
  const voltarButton = document.getElementById('voltar');

  //Recupera o XML gerado do sessionStorage
  const xmlGerado = sessionStorage.getItem('xmlGerado');
  
  if (xmlGerado) {
    xmlContent.textContent = xmlGerado;  // Exibe o XML gerado na tela
  } else {
    xmlContent.textContent = 'Nenhum XML encontrado.';
  }

  //Função para copiar o XML para a área de transferência
  copiarXmlButton.addEventListener('click', () => {
    navigator.clipboard.writeText(xmlGerado)
      .then(() => {
        copiadoMsg.style.display = 'block';
        setTimeout(() => copiadoMsg.style.display = 'none', 2000);
      })
      .catch((err) => {
        console.error('Erro ao copiar para a área de transferência:', err);
      });
  });

  //Função para voltar à página anterior
  voltarButton.addEventListener('click', () => {
    window.history.back();  // Volta para a página anterior
  });
});
