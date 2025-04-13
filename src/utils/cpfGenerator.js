// src/utils/cpfGenerator.js

function gerarCPF() {
  const random = () => Math.floor(Math.random() * 9);
  const n = Array.from({ length: 9 }, random);

  const calcDV = (base, multiplicadorInicial) => {
    const soma = base.reduce((acc, num, i) => acc + num * (multiplicadorInicial - i), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calcDV(n, 10);
  const d2 = calcDV([...n, d1], 11);

  // Retorna apenas os números, sem formatação
  return [...n, d1, d2].join('');
}

module.exports = { gerarCPF };
