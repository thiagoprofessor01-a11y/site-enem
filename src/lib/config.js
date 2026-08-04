// Configuração geral do site. Ajuste o nome e a data aqui em um único lugar.
export const SITE = {
  nome: "MeuENEM",
  descricao: "Sua plataforma completa de estudos para o ENEM.",
};

// Data de referência da 1ª aplicação do ENEM (usada na contagem regressiva
// enquanto o usuário não define a própria data no perfil).
export const DEFAULT_ENEM_DATE = "2026-11-08";

// Áreas de conhecimento do ENEM (usadas em vários módulos).
export const AREAS = [
  { slug: "linguagens", nome: "Linguagens e Códigos", questoes: 45 },
  { slug: "humanas", nome: "Ciências Humanas", questoes: 45 },
  { slug: "natureza", nome: "Ciências da Natureza", questoes: 45 },
  { slug: "matematica", nome: "Matemática", questoes: 45 },
  { slug: "redacao", nome: "Redação", questoes: 0 },
];

// ---------------------------------------------------------------------
// OFERTA — dados da página de vendas (edite aqui em um único lugar)
// ---------------------------------------------------------------------
export const OFERTA = {
  promessa: "Passe no ENEM ainda em 2026",
  subpromessa:
    "O método completo para você organizar os estudos, focar no que mais cai e chegar confiante no dia da prova.",
};

// ---------------------------------------------------------------------
// PLANOS — assinaturas exibidas na página de vendas.
// Edite preço/periodicidade aqui; o valor de cobrança (em centavos) e o
// intervalo de renovação ficam em src/lib/stripe.js (PLANOS_STRIPE).
// ---------------------------------------------------------------------
export const PLANOS = [
  {
    id: "mensal",
    nome: "Mensal",
    preco: "24,90",
    periodo: "/mês",
    renovacao: "Renova todo mês · cancele quando quiser",
    resumo: "Ideal para começar agora e testar a plataforma.",
    destaque: false,
    selo: null,
  },
  {
    id: "trimestral",
    nome: "Trimestral",
    preco: "57,90",
    periodo: "/trimestre",
    renovacao: "Renova a cada 3 meses · cancele quando quiser",
    resumo: "Melhor custo-benefício para a reta final de estudos.",
    destaque: true,
    selo: "Mais escolhido",
  },
];

// Benefícios inclusos no acesso (usados na página de vendas).
export const BENEFICIOS = [
  {
    emoji: "🗓️",
    titulo: "Cronograma inteligente",
    desc: "Um plano de estudos dia a dia, calculado pelo tempo que você tem até a prova.",
  },
  {
    emoji: "📝",
    titulo: "Banco de questões",
    desc: "Milhares de questões do ENEM com filtros por matéria, tópico, ano e dificuldade.",
  },
  {
    emoji: "⏱️",
    titulo: "Simulados",
    desc: "Simulados cronometrados no estilo da prova, com resultado e desempenho ao final.",
  },
  {
    emoji: "✍️",
    titulo: "Redação",
    desc: "Aulas, banco de temas e correção pelas 5 competências avaliadas pelo ENEM.",
  },
  {
    emoji: "🎬",
    titulo: "Videoaulas selecionadas",
    desc: "As melhores aulas de cada assunto, escolhidas a dedo — sem perder tempo procurando.",
  },
];

// Depoimentos (SUBSTITUA pelos textos reais dos seus 3 alunos aprovados).
export const DEPOIMENTOS = [
  {
    inicial: "M",
    nome: "Marina S.",
    resultado: "Aprovada em Enfermagem — Universidade Federal",
    texto:
      "Eu estudava sem direção e vivia ansiosa. Com o cronograma pronto e as videoaulas certas, parei de me perder e finalmente rendi. Passei na federal!",
  },
  {
    inicial: "L",
    nome: "Lucas P.",
    resultado: "Aprovado em Engenharia — Universidade Federal",
    texto:
      "Os simulados e o banco de questões fizeram toda a diferença. Fui pra prova sabendo o que mais caía e como o tempo funcionava. Recomendo demais.",
  },
  {
    inicial: "B",
    nome: "Beatriz A.",
    resultado: "Aprovada em Direito — Universidade Federal",
    texto:
      "A parte de redação me destravou. Entendi as 5 competências e minha nota subiu muito. Valeu cada centavo pelo que entrega.",
  },
];

// Os 4 pilares do site (para a home e navegação de destaque).
export const PILARES = [
  {
    href: "/cronograma",
    titulo: "Cronograma inteligente",
    descricao:
      "Um plano de estudos dia a dia, calculado pelo tempo que você tem até a prova.",
    emoji: "🗓️",
  },
  {
    href: "/questoes",
    titulo: "Banco de questões",
    descricao:
      "Milhares de questões do ENEM com filtros, modo treino e simulados cronometrados.",
    emoji: "📝",
  },
  {
    href: "/redacao",
    titulo: "Redação nota 1000",
    descricao:
      "Aulas, banco de temas e correção pelas 5 competências avaliadas pelo ENEM.",
    emoji: "✍️",
  },
  {
    href: "/conteudos",
    titulo: "Conteúdos por matéria",
    descricao:
      "Resumos objetivos e videoaulas selecionadas dos assuntos que mais caem.",
    emoji: "📚",
  },
];
