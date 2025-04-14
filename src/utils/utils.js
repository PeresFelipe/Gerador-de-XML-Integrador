// utils.js

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

/**
 * Trunca e limpa um valor para uso seguro no XML.
 * @param {string} valor - Texto a ser processado
 * @param {number} limite - Número máximo de caracteres
 * @returns {string}
 */
function prepararCampo(valor, limite = 255) {
  if (!valor) return '';
  return String(valor).substring(0, limite).trim();
}

/**
 * Prepara e escapa um campo XML com limite de caracteres.
 * @param {string} valor - Texto a ser incluído no XML
 * @param {number} limite - Limite de caracteres
 * @returns {string}
 */
function campoXml(valor, limite = 255) {
  return escapeXml(prepararCampo(valor, limite));
}

module.exports = {
  escapeXml,
  prepararCampo,
  campoXml,
};
