"use client";

import { useEffect, useState } from "react";

// Aulas concluídas pelo aluno.
// Por enquanto no navegador (localStorage). Quando o login real (Supabase Auth)
// entrar, isto vira uma tabela de progresso por usuário — a interface não muda.

const KEY = "meuenem:concluidas";
const EVENTO = "meuenem:concluidas-mudou";

export function getConcluidas() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function isConcluida(id) {
  return getConcluidas().includes(id);
}

export function setConcluida(id, valor) {
  const set = new Set(getConcluidas());
  if (valor) set.add(id);
  else set.delete(id);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event(EVENTO));
  }
}

export function toggleConcluida(id) {
  setConcluida(id, !isConcluida(id));
}

// Hook reativo: retorna null enquanto carrega, depois o array de ids.
export function useConcluidas() {
  const [ids, setIds] = useState(null);
  useEffect(() => {
    const ler = () => setIds(getConcluidas());
    ler();
    window.addEventListener(EVENTO, ler);
    window.addEventListener("storage", ler);
    return () => {
      window.removeEventListener(EVENTO, ler);
      window.removeEventListener("storage", ler);
    };
  }, []);
  return ids;
}
