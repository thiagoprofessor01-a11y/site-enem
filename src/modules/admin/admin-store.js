// Camada de dados do painel administrativo.
//
// Por enquanto o conteúdo é salvo no navegador (localStorage), o que permite
// usar o admin sem backend. Toda a lógica de leitura/escrita está isolada aqui:
// quando o Supabase estiver ligado, basta trocar `loadDB/saveDB` e as funções
// de mutação por chamadas às tabelas (materias, topicos/modulos, aulas,
// conteudo_videos, questoes) — a interface (AdminApp) não muda.

const STORAGE_KEY = "meuenem:admin";

// Estrutura normalizada (mais fácil de editar do que aninhada):
// {
//   materias:       [{ id, nome, area }]
//   modulos:        [{ id, materiaId, nome, descricao }]
//   aulas:          [{ id, moduloId, titulo, resumo }]
//   videos:         [{ id, aulaId, titulo, youtubeId }]
//   questoes:       [{ id, aulaId, enunciado, alternativas: [..5], correta }]
// }

export const AREAS_MATERIA = [
  { slug: "linguagens", nome: "Linguagens e Códigos" },
  { slug: "humanas", nome: "Ciências Humanas" },
  { slug: "natureza", nome: "Ciências da Natureza" },
  { slug: "matematica", nome: "Matemática" },
  { slug: "redacao", nome: "Redação" },
];

export const LETRAS = ["A", "B", "C", "D", "E"];

function vazio() {
  return { materias: [], modulos: [], aulas: [], videos: [], questoes: [] };
}

export function genId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  );
}

export function loadDB() {
  if (typeof window === "undefined") return vazio();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return vazio();
    return { ...vazio(), ...JSON.parse(raw) };
  } catch {
    return vazio();
  }
}

export function saveDB(db) {
  if (typeof window === "undefined") return db;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
}

// Aplica uma função de transformação sobre o DB e persiste. Retorna o novo DB.
function mutate(fn) {
  const db = loadDB();
  fn(db);
  return saveDB({ ...db });
}

/* ------------------------- Matérias ------------------------- */
export function addMateria({ nome, area }) {
  return mutate((db) =>
    db.materias.push({ id: genId(), nome: nome.trim(), area })
  );
}
export function updateMateria(id, dados) {
  return mutate((db) => {
    const m = db.materias.find((x) => x.id === id);
    if (m) Object.assign(m, dados);
  });
}
export function deleteMateria(id) {
  return mutate((db) => {
    const modIds = db.modulos.filter((m) => m.materiaId === id).map((m) => m.id);
    const aulaIds = db.aulas
      .filter((a) => modIds.includes(a.moduloId))
      .map((a) => a.id);
    db.materias = db.materias.filter((x) => x.id !== id);
    db.modulos = db.modulos.filter((x) => x.materiaId !== id);
    db.aulas = db.aulas.filter((x) => !modIds.includes(x.moduloId));
    db.videos = db.videos.filter((x) => !aulaIds.includes(x.aulaId));
    db.questoes = db.questoes.filter((x) => !aulaIds.includes(x.aulaId));
  });
}

/* ------------------------- Módulos ------------------------- */
export function addModulo(materiaId, { nome, descricao }) {
  return mutate((db) =>
    db.modulos.push({
      id: genId(),
      materiaId,
      nome: nome.trim(),
      descricao: (descricao || "").trim(),
    })
  );
}
export function updateModulo(id, dados) {
  return mutate((db) => {
    const m = db.modulos.find((x) => x.id === id);
    if (m) Object.assign(m, dados);
  });
}
export function deleteModulo(id) {
  return mutate((db) => {
    const aulaIds = db.aulas.filter((a) => a.moduloId === id).map((a) => a.id);
    db.modulos = db.modulos.filter((x) => x.id !== id);
    db.aulas = db.aulas.filter((x) => x.moduloId !== id);
    db.videos = db.videos.filter((x) => !aulaIds.includes(x.aulaId));
    db.questoes = db.questoes.filter((x) => !aulaIds.includes(x.aulaId));
  });
}

/* ------------------------- Aulas ------------------------- */
export function addAula(moduloId, { titulo, resumo }) {
  return mutate((db) =>
    db.aulas.push({
      id: genId(),
      moduloId,
      titulo: titulo.trim(),
      resumo: (resumo || "").trim(),
    })
  );
}
export function updateAula(id, dados) {
  return mutate((db) => {
    const a = db.aulas.find((x) => x.id === id);
    if (a) Object.assign(a, dados);
  });
}
export function deleteAula(id) {
  return mutate((db) => {
    db.aulas = db.aulas.filter((x) => x.id !== id);
    db.videos = db.videos.filter((x) => x.aulaId !== id);
    db.questoes = db.questoes.filter((x) => x.aulaId !== id);
  });
}

/* ------------------------- Vídeos ------------------------- */
export function addVideo(aulaId, { titulo, url }) {
  const youtubeId = parseYouTubeId(url);
  return mutate((db) =>
    db.videos.push({
      id: genId(),
      aulaId,
      titulo: titulo.trim(),
      youtubeId,
    })
  );
}
export function deleteVideo(id) {
  return mutate((db) => {
    db.videos = db.videos.filter((x) => x.id !== id);
  });
}

/* ---------------------- Questões (questionário) ---------------------- */
export function addQuestao(aulaId, { enunciado, alternativas, correta }) {
  return mutate((db) =>
    db.questoes.push({
      id: genId(),
      aulaId,
      enunciado: enunciado.trim(),
      alternativas: alternativas.map((a) => a.trim()),
      correta, // índice 0..4
    })
  );
}
export function deleteQuestao(id) {
  return mutate((db) => {
    db.questoes = db.questoes.filter((x) => x.id !== id);
  });
}

/* ------------------------- Utilidades ------------------------- */

// Extrai o ID de 11 caracteres de um link do YouTube (ou aceita o ID puro).
export function parseYouTubeId(input) {
  if (!input) return "";
  const txt = input.trim();
  const re =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const m = txt.match(re);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(txt)) return txt;
  return "";
}

export function areaNome(slug) {
  return AREAS_MATERIA.find((a) => a.slug === slug)?.nome || slug;
}
