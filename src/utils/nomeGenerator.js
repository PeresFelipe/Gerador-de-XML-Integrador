// nomeGenerator.js

const nomes = [
  'Lucas', 'Mariana', 'Joao', 'Patricia', 'Carlos', 'Fernanda', 'Gabriel', 'Ana',
  'Mateus', 'Juliana', 'Rafael', 'Camila', 'Felipe', 'Larissa', 'Thiago', 'Bruna',
  'Diego', 'Aline', 'Eduardo', 'Leticia', 'Vinicius', 'Tatiane', 'Daniel', 'Carla',
  'Gustavo', 'Vanessa', 'Pedro', 'Renata', 'Igor', 'Simone'
];

const sobrenomes = [
  'Silva', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Pereira', 'Almeida', 'Gomes',
  'Martins', 'Rocha', 'Ribeiro', 'Fernandes', 'Barbosa', 'Moura', 'Carvalho',
  'Freitas', 'Dias', 'Monteiro', 'Cardoso', 'Batista'
];

const sufixosCorporativos = [
  'Solucoes', 'Consultoria', 'Tech', 'Servicos', 'Inteligencia', 'Logistica',
  'Estrategia', 'Digital', 'Seguranca', 'Analytics', 'Automacao', 'Financeira',
  'RH', 'Design', 'Engenharia', 'TI'
];

const siglas = ['SS', 'JT', 'GJ', 'LP', 'NX', 'RM', 'ACM', 'VTX', 'GRP', 'X9', 'TRX', 'MGX', 'BZ'];

function removerAcentos(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9\s]/g, '') // remove caracteres especiais
    .trim();
}

function gerarNomeAleatorio() {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return removerAcentos(`${nome} ${sobrenome}`);
}

function gerarNomeEmpresa() {
  let s1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  let s2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];

  while (s1 === s2) {
    s2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  }

  return removerAcentos(`${s1} & ${s2}`);
}

function gerarFantasiaEmpresaBaseada(nomeEmpresa) {
  const sigla = siglas[Math.floor(Math.random() * siglas.length)];
  const sufixo = sufixosCorporativos[Math.floor(Math.random() * sufixosCorporativos.length)];
  return removerAcentos(`${sigla} ${sufixo}`);
}

function gerarFantasiaAleatorio(nomePessoa) {
  const primeiroNome = nomePessoa.split(' ')[0];
  const ideias = [
    `Atelie ${primeiroNome}`,
    `Cantinho do ${primeiroNome}`,
    `${primeiroNome} Presentes`,
    `By ${primeiroNome}`,
    `${primeiroNome} Artes`,
    `Espaco ${primeiroNome}`,
    `Doces da ${primeiroNome}`,
    `Salao da ${primeiroNome}`,
    `Barbearia ${primeiroNome}`,
    `Studio ${primeiroNome}`
  ];
  return removerAcentos(ideias[Math.floor(Math.random() * ideias.length)]);
}

module.exports = {
  gerarNomeAleatorio,
  gerarNomeEmpresa,
  gerarFantasiaEmpresaBaseada,
  gerarFantasiaAleatorio,
  removerAcentos
};
