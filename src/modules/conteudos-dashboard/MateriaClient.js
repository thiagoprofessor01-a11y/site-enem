"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import NivelDots from "@/components/NivelDots";
import { AREA_INFO } from "./conteudos-ui";

export default function MateriaClient({ materiaId }) {
  const [db, setDb] = useState(null);

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
        <Link href="/conteudos" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          ← Voltar para Conteúdos
        </Link>
      </div>
    );
  }

  const modulos = db.modulos.filter((m) => m.materiaId === materia.id);

  return (
    <div className="container max-w-3xl py-12">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1 text-sm">
        <Link href="/conteudos" className="font-medium text-brand-600 hover:text-brand-700">
          Conteúdos
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900">{materia.nome}</span>
      </nav>

      <header className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
          {AREA_INFO[materia.area]?.emoji || "📚"}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {materia.nome}
          </h1>
          <p className="text-sm text-slate-500">
            {AREA_INFO[materia.area]?.nome || materia.area}
          </p>
        </div>
      </header>

      {modulos.length === 0 ? (
        <p className="text-slate-400">Nenhum módulo cadastrado nesta matéria.</p>
      ) : (
        <div className="space-y-8">
          {modulos.map((mod) => {
            const aulas = db.aulas.filter((a) => a.moduloId === mod.id);
            return (
              <section key={mod.id}>
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {mod.nome}
                    </h2>
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
                    return (
                      <li key={aula.id}>
                        <Link
                          href={`/conteudos/${materia.id}/${aula.id}`}
                          className="card flex items-center justify-between gap-3 p-4 transition hover:border-brand-300 hover:shadow-card-hover"
                        >
                          <span className="min-w-0">
                            <span className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">
                                {aula.titulo}
                              </span>
                              <NivelDots nivel={aula.nivel} />
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {nVideos > 0 && `${nVideos} vídeo(s)`}
                              {nVideos > 0 && nQuestoes > 0 && " · "}
                              {nQuestoes > 0 && `${nQuestoes} questão(ões)`}
                              {nVideos === 0 && nQuestoes === 0 && "Abrir aula"}
                            </span>
                          </span>
                          <span className="shrink-0 font-semibold text-brand-600">→</span>
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
