window.addEventListener('DOMContentLoaded', () => {
  const xmlContent = document.getElementById('xmlContent');
  const copiarBtn = document.getElementById('copiarXml');
  const voltar = document.getElementById('voltar');
  const copiadoMsg = document.getElementById('copiadoMsg');

  const xml = sessionStorage.getItem('xmlGerado');
  if (xml) {
    xmlContent.textContent = xml;
  }

  copiarBtn.addEventListener('click', () => {
    if (xml) {
      window.geradorXML.copiarParaClipboard(xml);
      if (copiadoMsg) {
        copiadoMsg.style.display = 'block';
        setTimeout(() => copiadoMsg.style.display = 'none', 2000);
      }
    }
  });

  voltar.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
