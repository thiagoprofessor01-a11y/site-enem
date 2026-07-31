"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import NivelDots from "@/components/NivelDots";
import Icon from "@/components/Icon";
import { areaInfo } from "./conteudos-ui";
import { useConcluidas, useConcluidasQuestoes } from "./progresso";

export default function MateriaClient({
  materiaId,
  base = "/conteudos",
  titulo = "Conteúdos",
  modo = "conteudos",
}) {
  const [db, setDb] = useState(null);
  const concluidasAulas = useConcluidas();
  const concluidasQuestoes = useConcluidasQuestoes();
  const feitasSet = new Set((modo === "questoes" ? concluidasQuestoes : concluidasAulas) || []);

  useEffect(() => {
    let ativo = true;
    fetchAll()
      .then((d) => ativo && setDb(d))
      .catch(() => ativo && setDb(null));
    return () => {
      ativo = false;
    };
  }, []);

  if (!db) {
    return (
      <div className="container py-16 text-center text-slate-400">Carregando…</div>
    );
  }

  const materia = db.materias.find((m) => m.id === materiaId);
  if (!materia) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <p className="text-slate-500">Matéria não encontrada.</p>
        <Link href={base} className="mt-4 inline-block text-sm font-semibold text-brand-600">
          ← Voltar para {titulo}
        </Link>
      </div>
    );
  }

  // Mais bolinhas (nível maior) primeiro; empate mantém a ordem de cadastro.
  const modulos = db.modulos
    .filter((m) => m.materiaId === materia.id)
    .sort((a, b) => (b.nivel ?? 3) - (a.nivel ?? 3));
  const info = areaInfo(materia.area);

  return (
    <div className="container max-w-3xl py-10">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1 text-sm">
        <Link href={base} className="font-medium text-brand-600 hover:text-brand-700">
          {titulo}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900">{materia.nome}</span>
      </nav>

      {/* Cabeçalho da matéria — área e matéria centralizados */}
      <header className="mb-8 flex flex-col items-center gap-3 text-center">
        <p className={`text-xs font-semibold uppercase tracking-widest ${info.text}`}>
          {info.nome}
        </p>
        <span className={`inline-flex items-center gap-2 rounded-full ${info.solid} px-5 py-2 text-white shadow-sm`}>
          <Icon name={info.icon} className="h-5 w-5" />
          <span className="text-lg font-extrabold tracking-tight">{materia.nome}</span>
        </span>
      </header>

      {modulos.length === 0 ? (
        <p className="text-slate-400">Nenhum módulo cadastrado nesta matéria.</p>
      ) : (
        <div className="space-y-8">
          {modulos.map((mod) => {
            const aulas = db.aulas
              .filter((a) => a.moduloId === mod.id)
              .sort(
                (a, b) =>
                  (b.nivel ?? 3) - (a.nivel ?? 3) || (a.ordem ?? 0) - (b.ordem ?? 0)
              );
            return (
              <section key={mod.id}>
                <div className={`mb-3 border-l-4 ${info.border} pl-3`}>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{mod.nome}</h2>
                    <NivelDots nivel={mod.nivel} tamanho="lg" />
                  </div>
                  {mod.descricao && (
                    <p className="text-sm text-slate-500">{mod.descricao}</p>
                  )}
                </div>
                <ul className="space-y-2">
                  {aulas.map((aula) => {
                    const nVideos = db.videos.filter((v) => v.aulaId === aula.id).length;
                    const nQuestoes = db.questoes.filter((q) => q.aulaId === aula.id).length;
                    const feita = feitasSet.has(aula.id);
                    return (
                      <li key={aula.id}>
                        <Link
                          href={`${base}/${materia.id}/${aula.id}`}
                          className={`card flex items-center justify-between gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-card-hover ${info.ring}`}
                        >
                          <span className="min-w-0">
                            <span className="flex items-center gap-2">
                              {feita && (
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
                                  ✓
                                </span>
                              )}
                              <span
                                className={`font-semibold ${
                                  feita ? "text-slate-400 line-through" : "text-slate-900"
                                }`}
                              >
                                {aula.titulo}
                              </span>
                              <NivelDots nivel={aula.nivel} />
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {modo === "questoes"
                                ? nQuestoes > 0
                                  ? `${nQuestoes} questão(ões)`
                                  : "Abrir questões"
                                : nVideos > 0
                                ? `${nVideos} vídeo(s)`
                                : "Abrir aula"}
                            </span>
                          </span>
                          <span className={`shrink-0 text-lg font-bold ${info.text}`}>→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
