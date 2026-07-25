// Camada de dados do painel administrativo.
//
// Funciona com DOIS back-ends, escolhidos automaticamente:
//   • Supabase  → quando as variáveis NEXT_PUBLIC_SUPABASE_* estão configuradas
//                 (o conteúdo fica salvo no banco, compartilhado entre todos).
//   • localStorage → caso contrário (salva só no navegador; ótimo para testar).
//
// A interface (AdminApp) é a mesma nos dois casos. Todas as funções são
// assíncronas e retornam o "db" completo já atualizado.

import { createClient } from "@/lib/supabase/client";

export const AREAS_MATERIA = [
  { slug: "linguagens", nome: "Linguagens e Códigos" },
  { slug: "humanas", nome: "Ciências Humanas" },
  { slug: "natureza", nome: "Ciências da Natureza" },
  { slug: "matematica", nome: "Matemática" },
  { slug: "redacao", nome: "Redação" },
];

export const LETRAS = ["A", "B", "C", "D", "E"];

const STORAGE_KEY = "meuenem:admin";

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("placeholder"));
}

export function backendLabel() {
  return isSupabaseConfigured() ? "supabase" : "local";
}

function vazio() {
  return { materias: [], modulos: [], aulas: [], videos: [], questoes: [] };
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ==================================================================== */
/* Back-end: localStorage                                               */
/* ==================================================================== */
const local = {
  read() {
    if (typeof window === "undefined") return vazio();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? { ...vazio(), ...JSON.parse(raw) } : vazio();
    } catch {
      return vazio();
    }
  },
  write(db) {
    if (typeof window !== "undefined")
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  },
  async fetchAll() {
    return this.read();
  },
  async mutate(fn) {
    const db = this.read();
    fn(db);
    return this.write({ ...db });
  },
  addMateria({ nome, area }) {
    return this.mutate((db) =>
      db.materias.push({ id: genId(), nome: nome.trim(), area })
    );
  },
  updateMateria(id, dados) {
    return this.mutate((db) => {
      const m = db.materias.find((x) => x.id === id);
      if (m) Object.assign(m, dados);
    });
  },
  deleteMateria(id) {
    return this.mutate((db) => {
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
  },
  addModulo(materiaId, { nome, descricao }) {
    return this.mutate((db) =>
      db.modulos.push({
        id: genId(),
        materiaId,
        nome: nome.trim(),
        descricao: (descricao || "").trim(),
      })
    );
  },
  updateModulo(id, dados) {
    return this.mutate((db) => {
      const m = db.modulos.find((x) => x.id === id);
      if (m) Object.assign(m, dados);
    });
  },
  deleteModulo(id) {
    return this.mutate((db) => {
      const aulaIds = db.aulas.filter((a) => a.moduloId === id).map((a) => a.id);
      db.modulos = db.modulos.filter((x) => x.id !== id);
      db.aulas = db.aulas.filter((x) => x.moduloId !== id);
      db.videos = db.videos.filter((x) => !aulaIds.includes(x.aulaId));
      db.questoes = db.questoes.filter((x) => !aulaIds.includes(x.aulaId));
    });
  },
  addAula(moduloId, { titulo, resumo }) {
    return this.mutate((db) =>
      db.aulas.push({
        id: genId(),
        moduloId,
        titulo: titulo.trim(),
        resumo: (resumo || "").trim(),
      })
    );
  },
  updateAula(id, dados) {
    return this.mutate((db) => {
      const a = db.aulas.find((x) => x.id === id);
      if (a) Object.assign(a, dados);
    });
  },
  deleteAula(id) {
    return this.mutate((db) => {
      db.aulas = db.aulas.filter((x) => x.id !== id);
      db.videos = db.videos.filter((x) => x.aulaId !== id);
      db.questoes = db.questoes.filter((x) => x.aulaId !== id);
    });
  },
  addVideo(aulaId, { titulo, url }) {
    return this.mutate((db) =>
      db.videos.push({
        id: genId(),
        aulaId,
        titulo: titulo.trim(),
        youtubeId: parseYouTubeId(url),
      })
    );
  },
  deleteVideo(id) {
    return this.mutate((db) => {
      db.videos = db.videos.filter((x) => x.id !== id);
    });
  },
  addQuestao(aulaId, { enunciado, alternativas, correta }) {
    return this.mutate((db) =>
      db.questoes.push({
        id: genId(),
        aulaId,
        enunciado: enunciado.trim(),
        alternativas: alternativas.map((a) => a.trim()),
        correta,
      })
    );
  },
  deleteQuestao(id) {
    return this.mutate((db) => {
      db.questoes = db.questoes.filter((x) => x.id !== id);
    });
  },
};

/* ==================================================================== */
/* Back-end: Supabase                                                   */
/* ==================================================================== */
function sb() {
  return createClient();
}

function checar(error) {
  if (error) {
    // Mostra o erro (ex.: RLS bloqueando escrita) sem derrubar a página.
    console.error("[admin/supabase]", error);
    if (typeof window !== "undefined") window.alert("Erro ao salvar: " + error.message);
    throw error;
  }
}

const supa = {
  async fetchAll() {
    const c = sb();
    const [materias, modulos, aulas, videos, questoes] = await Promise.all([
      c.from("materias").select("*").order("created_at"),
      c.from("modulos").select("*").order("created_at"),
      c.from("aulas").select("*").order("created_at"),
      c.from("aula_videos").select("*").order("created_at"),
      c.from("questoes").select("*").order("created_at"),
    ]);
    return {
      materias: (materias.data || []).map((m) => ({
        id: m.id,
        nome: m.nome,
        area: m.area,
      })),
      modulos: (modulos.data || []).map((m) => ({
        id: m.id,
        materiaId: m.materia_id,
        nome: m.nome,
        descricao: m.descricao,
      })),
      aulas: (aulas.data || []).map((a) => ({
        id: a.id,
        moduloId: a.modulo_id,
        titulo: a.titulo,
        resumo: a.resumo,
      })),
      videos: (videos.data || []).map((v) => ({
        id: v.id,
        aulaId: v.aula_id,
        titulo: v.titulo,
        youtubeId: v.youtube_id,
      })),
      questoes: (questoes.data || []).map((q) => ({
        id: q.id,
        aulaId: q.aula_id,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        correta: q.correta,
      })),
    };
  },
  async addMateria({ nome, area }) {
    const { error } = await sb().from("materias").insert({ nome: nome.trim(), area });
    checar(error);
    return this.fetchAll();
  },
  async updateMateria(id, dados) {
    const { error } = await sb().from("materias").update(dados).eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async deleteMateria(id) {
    const { error } = await sb().from("materias").delete().eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async addModulo(materiaId, { nome, descricao }) {
    const { error } = await sb()
      .from("modulos")
      .insert({ materia_id: materiaId, nome: nome.trim(), descricao: (descricao || "").trim() });
    checar(error);
    return this.fetchAll();
  },
  async updateModulo(id, dados) {
    const { error } = await sb().from("modulos").update(dados).eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async deleteModulo(id) {
    const { error } = await sb().from("modulos").delete().eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async addAula(moduloId, { titulo, resumo }) {
    const { error } = await sb()
      .from("aulas")
      .insert({ modulo_id: moduloId, titulo: titulo.trim(), resumo: (resumo || "").trim() });
    checar(error);
    return this.fetchAll();
  },
  async updateAula(id, dados) {
    const { error } = await sb().from("aulas").update(dados).eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async deleteAula(id) {
    const { error } = await sb().from("aulas").delete().eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async addVideo(aulaId, { titulo, url }) {
    const { error } = await sb()
      .from("aula_videos")
      .insert({ aula_id: aulaId, titulo: titulo.trim(), youtube_id: parseYouTubeId(url) });
    checar(error);
    return this.fetchAll();
  },
  async deleteVideo(id) {
    const { error } = await sb().from("aula_videos").delete().eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async addQuestao(aulaId, { enunciado, alternativas, correta }) {
    const { error } = await sb().from("questoes").insert({
      aula_id: aulaId,
      enunciado: enunciado.trim(),
      alternativas: alternativas.map((a) => a.trim()),
      correta,
    });
    checar(error);
    return this.fetchAll();
  },
  async deleteQuestao(id) {
    const { error } = await sb().from("questoes").delete().eq("id", id);
    checar(error);
    return this.fetchAll();
  },
};

/* ==================================================================== */
/* Fachada — escolhe o back-end e reexporta as funções                  */
/* ==================================================================== */
function backend() {
  return isSupabaseConfigured() ? supa : local;
}

export const fetchAll = (...a) => backend().fetchAll(...a);
export const addMateria = (...a) => backend().addMateria(...a);
export const updateMateria = (...a) => backend().updateMateria(...a);
export const deleteMateria = (...a) => backend().deleteMateria(...a);
export const addModulo = (...a) => backend().addModulo(...a);
export const updateModulo = (...a) => backend().updateModulo(...a);
export const deleteModulo = (...a) => backend().deleteModulo(...a);
export const addAula = (...a) => backend().addAula(...a);
export const updateAula = (...a) => backend().updateAula(...a);
export const deleteAula = (...a) => backend().deleteAula(...a);
export const addVideo = (...a) => backend().addVideo(...a);
export const deleteVideo = (...a) => backend().deleteVideo(...a);
export const addQuestao = (...a) => backend().addQuestao(...a);
export const deleteQuestao = (...a) => backend().deleteQuestao(...a);

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
