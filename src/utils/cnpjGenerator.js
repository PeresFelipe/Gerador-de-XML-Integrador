// src/utils/cnpjGenerator.js

function gerarCNPJ() {
  const randomDigits = () => Math.floor(Math.random() * 10);

  // Base do CNPJ: 8 dígitos aleatórios + 0001 (filial matriz)
  const n = Array.from({ length: 8 }, () => randomDigits()).concat([0, 0, 0, 1]);

  const calcDV = (base, pesos) => {
    const soma = base.reduce((acc, digit, i) => acc + digit * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const dv1 = calcDV(n, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const dv2 = calcDV([...n, dv1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  const cnpjNumeros = [...n, dv1, dv2].join('');

  // Retornar apenas números, sem formatação
  return cnpjNumeros;
}

module.exports = { gerarCNPJ };
