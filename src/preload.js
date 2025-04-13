const { contextBridge, clipboard } = require('electron');

// Funções de geração de nome
const nomes = [
  'Ana', 'Carlos', 'Eduardo', 'Fernanda', 'Gabriel', 'Isabela', 'João', 'Juliana', 'Marcos', 'Patrícia',
  'Ricardo', 'Tatiane', 'Lucas', 'Roberta', 'Diego', 'Raquel', 'Adriana', 'Rafael', 'Beatriz', 'Amanda',
  'Vinícius', 'Márcio', 'Cláudia', 'Fabiana', 'Jéssica', 'Paulo', 'Thiago', 'Sandra', 'Gustavo', 'Lúcia',
  'Regina', 'Renato'
];

const sobrenomes = [
  'Silva', 'Oliveira', 'Pereira', 'Santos', 'Costa', 'Almeida', 'Souza', 'Rodrigues', 'Martins', 'Dias',
  'Lima', 'Gomes', 'Freitas', 'Carvalho', 'Melo', 'Lopes', 'Barbosa', 'Fernandes', 'Ramos', 'Nascimento',
  'Moura', 'Castro', 'Pinto', 'Machado', 'Teixeira'
];

const nomesEmpresas = [
  'Tech Soluções', 'Grupo Nova Era', 'InovaCorp', 'Sistemas Áurea', 'GlobalConsult', 'Mundo Verde',
  'Projeção Digital', 'Visiontec', 'Clarity Solutions', 'Vortex Industries', 'Omega Business', 'X-Tech',
  'Estrela da Manhã', 'Solunet', 'Alvo Corporativo', 'GenCorp', 'Network Solutions', 'Futuro Global',
  'Magneto Consultoria', 'Summit Business'
];

function gerarNomeAleatorio() {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return `${nome} ${sobrenome}`;
}

function gerarFantasiaAleatorio(nomeAgente) {
  const prefixos = [
    'da Silva', 'do Vale', 'dos Santos', 'de Oliveira', 'das Neves', 'do Carmo',
    'do Nascimento', 'de Souza', 'da Costa', 'do Maranhão'
  ];
  const primeiroNome = nomeAgente.split(' ')[0];
  return `${primeiroNome} ${prefixos[Math.floor(Math.random() * prefixos.length)]}`;
}

function gerarNomeEmpresa() {
  return nomesEmpresas[Math.floor(Math.random() * nomesEmpresas.length)];
}

function gerarFantasiaEmpresaBaseada(nomeEmpresa) {
  const sufixos = [
    'Digital', 'Consultoria', 'Soluções', 'Tech', 'Global', 'Group', 'Corporation', 'LTDA',
    'eXpert', 'Inovações', 'Services', 'Business'
  ];
  const prefixos = [
    'Grupo', 'Nova', 'Prime', 'Top', 'Ultra', 'Mega', 'Pro', 'Elite'
  ];
  return Math.random() < 0.5
    ? `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeEmpresa}`
    : `${nomeEmpresa} ${sufixos[Math.floor(Math.random() * sufixos.length)]}`;
}

// Expor funções ao renderer via preload
contextBridge.exposeInMainWorld('geradorXML', {
  gerarNomeAleatorio,
  gerarFantasiaAleatorio,
  gerarNomeEmpresa,
  gerarFantasiaEmpresaBaseada,
  copiarParaClipboard: (texto) => clipboard.writeText(texto)
});
