// Dados legais do site. PREENCHA com as informações reais antes de publicar.
export const LEGAL = {
  // Identificação do controlador dos dados (quem opera o site)
  empresa: "[NOME / RAZÃO SOCIAL]",
  cnpj: "[CNPJ ou CPF do responsável]",
  // Canal do titular / Encarregado (DPO)
  email: "privacidade@seudominio.com.br",
  encarregado: "[Nome do Encarregado (DPO)]",
  // Idade mínima para usar sozinho (sem responsável). Ajuste conforme orientação jurídica.
  idadeMenorConsentimento: 18,
  atualizadoEm: "julho de 2026",
  // Operadores (serviços que processam dados em nome do site)
  operadores: [
    { nome: "Supabase", papel: "Banco de dados e autenticação (região São Paulo)" },
    { nome: "Vercel", papel: "Hospedagem do site" },
    { nome: "Mercado Pago", papel: "Processamento de pagamentos" },
    { nome: "YouTube (Google)", papel: "Exibição das videoaulas incorporadas" },
  ],
};
