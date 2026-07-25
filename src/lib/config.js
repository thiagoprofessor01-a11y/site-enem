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
