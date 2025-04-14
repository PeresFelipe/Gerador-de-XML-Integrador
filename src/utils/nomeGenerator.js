// nomeGenerator.js
const nomes = ['Lucas', 'Mariana', 'João', 'Patrícia', 'Carlos', 'Fernanda', 'Gabriel', 'Ana', 'Mateus', 'Juliana'];
const sobrenomes = ['Silva', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Pereira', 'Almeida', 'Gomes', 'Martins', 'Rocha'];

const sufixosCorporativos = ['Soluções', 'Consultoria', 'Tech', 'Serviços', 'Inteligência', 'Logística', 'Estratégia'];
const siglas = ['S&S', 'JT', 'GJ', 'LP', 'NX', 'RM', 'ACM', 'VTX', 'GRP', 'X9'];

function removerAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '');
}

function gerarNomeAleatorio() {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return `${nome} ${sobrenome}`;
}

function gerarNomeEmpresa() {
  let s1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  let s2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];

  while (s1 === s2) {
    s2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  }

  return `${s1} & ${s2}`;
}

function gerarFantasiaEmpresaBaseada(nomeEmpresa) {
  const sigla = siglas[Math.floor(Math.random() * siglas.length)];
  const sufixo = sufixosCorporativos[Math.floor(Math.random() * sufixosCorporativos.length)];
  return `${sigla} ${sufixo}`;
}

function gerarFantasiaAleatorio(nomePessoa) {
  const primeiroNome = nomePessoa.split(' ')[0];
  const ideias = [
    `Ateliê ${primeiroNome}`,
    `Cantinho do ${primeiroNome}`,
    `${primeiroNome} Presentes`,
    `By ${primeiroNome}`,
    `${primeiroNome} Artes`,
    `Espaço ${primeiroNome}`,
    `Doces da ${primeiroNome}`,
    `Salão da ${primeiroNome}`,
    `Barbearia ${primeiroNome}`,
    `Studio ${primeiroNome}`
  ];
  return ideias[Math.floor(Math.random() * ideias.length)];
}

module.exports = {
  gerarNomeAleatorio,
  gerarNomeEmpresa,
  gerarFantasiaEmpresaBaseada,
  gerarFantasiaAleatorio,
  removerAcentos
};
