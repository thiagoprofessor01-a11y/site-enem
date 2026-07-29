"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/modules/admin/admin-store";

// Fábrica de "banco de PDFs" com dois back-ends (Supabase / localStorage).
// Estrutura: { modulos: [], pdfs: [{id, moduloId, titulo, url, path, ordem}] }.
export function makePdfStore({ key, tabelaModulos, tabelaPdfs }) {
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const vazio = () => ({ modulos: [], pdfs: [] });

  const local = {
    read() {
      if (typeof window === "undefined") return vazio();
      try {
        const r = window.localStorage.getItem(key);
        return r ? { ...vazio(), ...JSON.parse(r) } : vazio();
      } catch {
        return vazio();
      }
    },
    write(db) {
      if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(db));
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
        db.pdfs = db.pdfs.filter((x) => x.moduloId !== id);
      });
    },
    addPdf(moduloId, { titulo, url, path, tipo }) {
      return this.mutate((db) =>
        db.pdfs.push({
          id: genId(),
          moduloId: moduloId || null,
          titulo: (titulo || "").trim(),
          url,
          path: path || "",
          tipo: tipo || "pdf",
          ordem: Math.floor(Date.now() / 1000),
        })
      );
    },
    deletePdf(id) {
      return this.mutate((db) => {
        db.pdfs = db.pdfs.filter((x) => x.id !== id);
      });
    },
  };

  const sb = () => createClient();
  const checar = (error) => {
    if (error) {
      console.error("[pdf-store]", error);
      if (typeof window !== "undefined") window.alert("Erro: " + error.message);
      throw error;
    }
  };

  const supa = {
    async fetchAll() {
      const c = sb();
      const [modulos, pdfs] = await Promise.all([
        tabelaModulos ? c.from(tabelaModulos).select("*").order("ordem") : Promise.resolve({ data: [] }),
        c.from(tabelaPdfs).select("*").order("ordem"),
      ]);
      return {
        modulos: (modulos.data || []).map((m) => ({ id: m.id, nome: m.nome, ordem: m.ordem ?? 0 })),
        pdfs: (pdfs.data || []).map((p) => ({
          id: p.id,
          moduloId: p.modulo_id || null,
          titulo: p.titulo || "",
          url: p.url || "",
          path: p.path || "",
          tipo: p.tipo || "pdf",
          ordem: p.ordem ?? 0,
        })),
      };
    },
    async addModulo({ nome }) {
      const { error } = await sb()
        .from(tabelaModulos)
        .insert({ nome: nome.trim(), ordem: Math.floor(Date.now() / 1000) });
      checar(error);
      return this.fetchAll();
    },
    async updateModulo(id, dados) {
      const { error } = await sb().from(tabelaModulos).update(dados).eq("id", id);
      checar(error);
      return this.fetchAll();
    },
    async deleteModulo(id) {
      const { error } = await sb().from(tabelaModulos).delete().eq("id", id);
      checar(error);
      return this.fetchAll();
    },
    async addPdf(moduloId, { titulo, url, path, tipo }) {
      const { error } = await sb()
        .from(tabelaPdfs)
        .insert({
          modulo_id: moduloId || null,
          titulo: (titulo || "").trim(),
          url,
          path: path || "",
          tipo: tipo || "pdf",
        });
      checar(error);
      return this.fetchAll();
    },
    async deletePdf(id) {
      const { error } = await sb().from(tabelaPdfs).delete().eq("id", id);
      checar(error);
      return this.fetchAll();
    },
  };

  const backend = () => (isSupabaseConfigured() ? supa : local);
  return {
    fetchBanco: (...a) => backend().fetchAll(...a),
    addModulo: (...a) => backend().addModulo(...a),
    updateModulo: (...a) => backend().updateModulo(...a),
    deleteModulo: (...a) => backend().deleteModulo(...a),
    addPdf: (...a) => backend().addPdf(...a),
    deletePdf: (...a) => backend().deletePdf(...a),
  };
}
