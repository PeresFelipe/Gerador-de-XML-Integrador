// nomeGenerator.js

const nomes = [
  'Ana', 'Carlos', 'Eduardo', 'Fernanda', 'Gabriel', 'Isabela', 'João', 'Juliana', 'Marcos', 'Patrícia',
  'Ricardo', 'Tatiane', 'Lucas', 'Roberta', 'Diego', 'Raquel', 'Adriana', 'Rafael', 'Beatriz', 'Amanda',
  'Vinícius', 'Márcio', 'Cláudia', 'Fabiana', 'Jéssica', 'Paulo', 'Thiago', 'Sandra', 'Gustavo', 'Lúcia',
  'Regina', 'Renato', 'Larissa', 'Murilo', 'Camila', 'Bruno', 'Nicole', 'Matheus', 'Sabrina', 'Daniel',
  'Elaine', 'Leonardo', 'Aline', 'Felipe', 'Bruna', 'André', 'Luana', 'Fernando', 'Natália'
];

const sobrenomes = [
  'Silva', 'Oliveira', 'Pereira', 'Santos', 'Costa', 'Almeida', 'Souza', 'Rodrigues', 'Martins', 'Dias',
  'Lima', 'Gomes', 'Freitas', 'Carvalho', 'Melo', 'Lopes', 'Barbosa', 'Fernandes', 'Ramos', 'Nascimento',
  'Moura', 'Castro', 'Pinto', 'Machado', 'Teixeira', 'Araújo', 'Monteiro', 'Cavalcante', 'Vieira',
  'Correia', 'Campos', 'Batista', 'Farias', 'Assis', 'Peixoto', 'Rezende', 'Azevedo', 'Neves'
];

const nomesEmpresas = [
  'Tech Soluções', 'Grupo Nova Era', 'InovaCorp', 'Sistemas Áurea', 'GlobalConsult', 'Mundo Verde',
  'Projeção Digital', 'Visiontec', 'Clarity Solutions', 'Vortex Industries', 'Omega Business', 'X-Tech',
  'Estrela da Manhã', 'Solunet', 'Alvo Corporativo', 'GenCorp', 'Network Solutions', 'Futuro Global',
  'Magneto Consultoria', 'Summit Business', 'Bright Future', 'Apex Dynamics', 'Orion Systems',
  'Avante Tecnologia', 'BlueSky Solutions', 'ZettaCorp', 'Evolux', 'NextGen Systems', 'Pioneira Digital',
  'Domínio TI', 'Synthex', 'MetaVision', 'Alpha Serviços', 'Nova Mente', 'Primus Tech'
];

function gerarNomeAleatorio() {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return `${nome} ${sobrenome}`;
}

function gerarFantasiaAleatorio(nomeAgente) {
  const sufixos = [
    'da Silva', 'do Vale', 'dos Santos', 'de Oliveira', 'das Neves', 'do Carmo',
    'do Nascimento', 'de Souza', 'da Costa', 'do Maranhão', 'Empreendimentos',
    'Consultoria', 'Digital', 'Express', 'Comercial', 'Serviços'
  ];
  const primeiroNome = nomeAgente.split(' ')[0];
  const sufixo = sufixos[Math.floor(Math.random() * sufixos.length)];
  return `${primeiroNome} ${sufixo}`;
}

function gerarNomeEmpresa() {
  return nomesEmpresas[Math.floor(Math.random() * nomesEmpresas.length)];
}

function gerarFantasiaEmpresaBaseada(nomeEmpresa) {
  const sufixos = [
    'Digital', 'Consultoria', 'Soluções', 'Tech', 'Global', 'Group', 'Corporation', 'LTDA',
    'eXpert', 'Inovações', 'Services', 'Business', 'Corp', 'Enterprise', 'Hub'
  ];
  const prefixos = [
    'Grupo', 'Nova', 'Prime', 'Top', 'Ultra', 'Mega', 'Pro', 'Elite', 'Master', 'Next', 'Smart'
  ];
  return Math.random() < 0.5
    ? `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeEmpresa}`
    : `${nomeEmpresa} ${sufixos[Math.floor(Math.random() * sufixos.length)]}`;
}

module.exports = {
  gerarNomeAleatorio,
  gerarFantasiaAleatorio,
  gerarNomeEmpresa,
  gerarFantasiaEmpresaBaseada
};
