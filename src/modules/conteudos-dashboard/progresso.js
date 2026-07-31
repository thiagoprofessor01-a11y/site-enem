"use client";

import { useEffect, useState } from "react";

// Progresso do aluno (aulas e questões concluídas), por enquanto no navegador.
// Fábrica reutilizável: cada "trilha" tem sua própria chave no localStorage.

function criarProgresso(KEY) {
  const EVENTO = KEY + "-mudou";

  function get() {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  }
  function is(id) {
    return get().includes(id);
  }
  function set(id, valor) {
    const s = new Set(get());
    if (valor) s.add(id);
    else s.delete(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY, JSON.stringify([...s]));
      window.dispatchEvent(new Event(EVENTO));
    }
  }
  function useHook() {
    const [ids, setIds] = useState(null);
    useEffect(() => {
      const ler = () => setIds(get());
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
  return { get, is, set, useHook };
}

// Trilha das AULAS (conteúdos)
const aulas = criarProgresso("meuenem:concluidas");
export const getConcluidas = aulas.get;
export const isConcluida = aulas.is;
export const setConcluida = aulas.set;
export const toggleConcluida = (id) => aulas.set(id, !aulas.is(id));
export const useConcluidas = aulas.useHook;

// Trilha das QUESTÕES (independente das aulas)
const questoes = criarProgresso("meuenem:concluidas-questoes");
export const getConcluidasQuestoes = questoes.get;
export const isConcluidaQuestao = questoes.is;
export const setConcluidaQuestao = questoes.set;
export const useConcluidasQuestoes = questoes.useHook;
