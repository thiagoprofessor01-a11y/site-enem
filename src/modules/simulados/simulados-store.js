"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/modules/admin/admin-store";

// Banco de simulados: módulos → itens (HTML colado), igual ao de questões.
const KEY = "meuenem:simulados";
const vazio = () => ({ modulos: [], questoes: [] });
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const local = {
  read() {
    if (typeof window === "undefined") return vazio();
    try {
      const r = window.localStorage.getItem(KEY);
      return r ? { ...vazio(), ...JSON.parse(r) } : vazio();
    } catch {
      return vazio();
    }
  },
  write(db) {
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(db));
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
  addModulo({ nome }) {
    return this.mutate((db) =>
      db.modulos.push({ id: genId(), nome: nome.trim(), ordem: Math.floor(Date.now() / 1000) })
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
      db.modulos = db.modulos.filter((x) => x.id !== id);
      db.questoes = db.questoes.filter((x) => x.moduloId !== id);
    });
  },
  addItem(moduloId, { titulo, html }) {
    return this.mutate((db) =>
      db.questoes.push({
        id: genId(),
        moduloId,
        titulo: (titulo || "").trim(),
        html,
        ordem: Math.floor(Date.now() / 1000),
      })
    );
  },
  deleteItem(id) {
    return this.mutate((db) => {
      db.questoes = db.questoes.filter((x) => x.id !== id);
    });
  },
};

const sb = () => createClient();
const checar = (error) => {
  if (error) {
    console.error("[simulados]", error);
    if (typeof window !== "undefined") window.alert("Erro: " + error.message);
    throw error;
  }
};

const supa = {
  async fetchAll() {
    const c = sb();
    const [modulos, itens] = await Promise.all([
      c.from("sim_modulos").select("*").order("ordem"),
      c.from("sim_itens").select("*").order("ordem"),
    ]);
    return {
      modulos: (modulos.data || []).map((m) => ({ id: m.id, nome: m.nome, ordem: m.ordem ?? 0 })),
      questoes: (itens.data || []).map((q) => ({
        id: q.id,
        moduloId: q.modulo_id,
        titulo: q.titulo || "",
        html: q.html || "",
        ordem: q.ordem ?? 0,
      })),
    };
  },
  async addModulo({ nome }) {
    const { error } = await sb()
      .from("sim_modulos")
      .insert({ nome: nome.trim(), ordem: Math.floor(Date.now() / 1000) });
    checar(error);
    return this.fetchAll();
  },
  async updateModulo(id, dados) {
    const { error } = await sb().from("sim_modulos").update(dados).eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async deleteModulo(id) {
    const { error } = await sb().from("sim_modulos").delete().eq("id", id);
    checar(error);
    return this.fetchAll();
  },
  async addItem(moduloId, { titulo, html }) {
    const { error } = await sb()
      .from("sim_itens")
      .insert({ modulo_id: moduloId, titulo: (titulo || "").trim(), html });
    checar(error);
    return this.fetchAll();
  },
  async deleteItem(id) {
    const { error } = await sb().from("sim_itens").delete().eq("id", id);
    checar(error);
    return this.fetchAll();
  },
};

const backend = () => (isSupabaseConfigured() ? supa : local);

export const simuladosStore = {
  fetchBanco: (...a) => backend().fetchAll(...a),
  addModulo: (...a) => backend().addModulo(...a),
  updateModulo: (...a) => backend().updateModulo(...a),
  deleteModulo: (...a) => backend().deleteModulo(...a),
  addItem: (...a) => backend().addItem(...a),
  deleteItem: (...a) => backend().deleteItem(...a),
};
