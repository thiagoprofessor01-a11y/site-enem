// Persistência e cálculos do cronograma.
//
// Por enquanto o cronograma é salvo no navegador (localStorage), o que permite
// usar a funcionalidade sem login. Quando o Supabase Auth estiver ligado,
// basta trocar as funções `carregar/salvar/apagar` por chamadas à tabela
// `cronograma_itens` / `usuarios` — a interface (CronogramaClient) não muda.

const STORAGE_KEY = "meuenem:cronograma";

export const DIAS_SEMANA = [
  { idx: 0, curto: "Dom", nome: "Domingo" },
  { idx: 1, curto: "Seg", nome: "Segunda" },
  { idx: 2, curto: "Ter", nome: "Terça" },
  { idx: 3, curto: "Qua", nome: "Quarta" },
  { idx: 4, curto: "Qui", nome: "Quinta" },
  { idx: 5, curto: "Sex", nome: "Sexta" },
  { idx: 6, curto: "Sáb", nome: "Sábado" },
];

// Distribuição sugerida do tempo por área (peso ~ importância na prova).
export const PESOS_AREA = [
  { nome: "Linguagens e Códigos", peso: 45 },
  { nome: "Ciências Humanas", peso: 45 },
  { nome: "Ciências da Natureza", peso: 45 },
  { nome: "Matemática", peso: 45 },
  { nome: "Redação", peso: 30 },
];

// ---------- helpers de data ----------

function meiaNoite(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Nº de dias corridos entre duas datas (não negativo). */
export function diasCorridos(de, ate) {
  const diff = Math.ceil((meiaNoite(ate) - meiaNoite(de)) / 86400000);
  return Math.max(0, diff);
}

/** Nº de dias de estudo (apenas os dias da semana escolhidos) entre duas datas. */
export function diasDeEstudo(de, ate, diasSemana) {
  const inicio = meiaNoite(de);
  const fim = meiaNoite(ate);
  const set = new Set(diasSemana);
  let count = 0;
  for (let d = new Date(inicio); d < fim; d.setDate(d.getDate() + 1)) {
    if (set.has(d.getDay())) count++;
  }
  return count;
}

/** Data de hoje no formato YYYY-MM-DD (horário local). */
export function hojeISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function formatarData(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ---------- persistência ----------

export function carregarCronograma() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function salvarCronograma(cronograma) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cronograma));
}

export function apagarCronograma() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Monta o objeto do cronograma a partir dos dados do formulário. */
export function criarCronograma({ horasPorDia, diasSemana, dataEnem }) {
  const dataCriacao = hojeISO();
  return {
    horasPorDia: Number(horasPorDia),
    diasSemana: [...diasSemana].sort((a, b) => a - b),
    dataEnem,
    dataCriacao,
    // "dias que faltavam" no momento da criação (referência histórica)
    diasNaCriacao: diasCorridos(dataCriacao, dataEnem),
  };
}
