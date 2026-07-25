"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "@/modules/admin/admin-store";
import HtmlEmbed from "@/components/HtmlEmbed";
import NivelDots from "@/components/NivelDots";
import { isConcluida, setConcluida } from "./progresso";

const LETRAS = ["A", "B", "C", "D", "E"];

// Questão estruturada (formato = 'form'): o aluno clica e vê se acertou.
function QuestaoEstruturada({ questao }) {
  const [escolhida, setEscolhida] = useState(null);
  const respondida = escolhida !== null;
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm font-medium text-slate-800">{questao.enunciado}</p>
      <ul className="mt-3 space-y-2">
        {questao.alternativas.map((alt, idx) =>
          alt ? (
            <li key={idx}>
              <button
                type="button"
                disabled={respondida}
                onClick={() => setEscolhida(idx)}
                className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  respondida && idx === questao.correta
                    ? "border-green-300 bg-green-50 text-green-800"
                    : respondida && idx === escolhida
                    ? "border-red-300 bg-red-50 text-red-800"
                    : "border-slate-200 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <span className="font-semibold">{LETRAS[idx]})</span>
                <span>{alt}</span>
              </button>
            </li>
          ) : null
        )}
      </ul>
      {respondida && (
        <p
          className={`mt-3 text-sm font-semibold ${
            escolhida === questao.correta ? "text-green-700" : "text-red-600"
          }`}
        >
          {escolhida === questao.correta
            ? "✓ Você acertou!"
            : `✗ Resposta correta: ${LETRAS[questao.correta]}`}
        </p>
      )}
    </div>
  );
}

export default function AulaClient({ materiaId, aulaId }) {
  const [db, setDb] = useState(null);
  const [feita, setFeita] = useState(false);

  useEffect(() => {
    let ativo = true;
    fetchAll()
      .then((d) => ativo && setDb(d))
      .catch(() => ativo && setDb(null));
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    setFeita(isConcluida(aulaId));
  }, [aulaId]);

  function alternarConcluida() {
    const novo = !feita;
    setConcluida(aulaId, novo);
    setFeita(novo);
  }

  if (!db) {
    return (
      <div className="container py-16 text-center text-slate-400">Carregando…</div>
    );
  }

  const aula = db.aulas.find((a) => a.id === aulaId);
  if (!aula) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <p className="text-slate-500">Aula não encontrada.</p>
        <Link
          href={`/conteudos/${materiaId}`}
          className="mt-4 inline-block text-sm font-semibold text-brand-600"
        >
          ← Voltar
        </Link>
      </div>
    );
  }

  const modulo = db.modulos.find((m) => m.id === aula.moduloId);
  const materia = db.materias.find((m) => m.id === (modulo?.materiaId || materiaId));
  const videos = db.videos.filter((v) => v.aulaId === aula.id);
  const questoes = db.questoes.filter((q) => q.aulaId === aula.id);

  // Aula anterior / próxima dentro do mesmo módulo (para estudar em sequência).
  const irmas = db.aulas.filter((a) => a.moduloId === aula.moduloId);
  const pos = irmas.findIndex((a) => a.id === aula.id);
  const anterior = pos > 0 ? irmas[pos - 1] : null;
  const proxima = pos < irmas.length - 1 ? irmas[pos + 1] : null;
  const linkAula = (a) => `/conteudos/${materia?.id || materiaId}/${a.id}`;

  return (
    <div className="container max-w-3xl py-10">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm">
        <Link href="/conteudos" className="font-medium text-brand-600 hover:text-brand-700">
          Conteúdos
        </Link>
        {materia && (
          <>
            <span className="text-slate-300">/</span>
            <Link
              href={`/conteudos/${materia.id}`}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {materia.nome}
            </Link>
          </>
        )}
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900">{aula.titulo}</span>
      </nav>

      {/* Cabeçalho da aula */}
      <header className="mb-6">
        {modulo && (
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {modulo.nome}
          </p>
        )}
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {aula.titulo}
          </h1>
          <NivelDots nivel={aula.nivel} tamanho="lg" />
        </div>
        {aula.resumo && (
          <p className="mt-2 text-slate-600">{aula.resumo}</p>
        )}
      </header>

      {/* Vídeos */}
      {videos.length > 0 ? (
        <div className="space-y-6">
          {videos.map((v) => (
            <figure key={v.id}>
              <div className="aspect-video overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                  title={v.titulo}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {v.titulo && (
                <figcaption className="mt-2 text-sm font-medium text-slate-700">
                  {v.titulo}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
          Videoaula em breve para este tópico.
        </div>
      )}

      {/* Questionário */}
      {questoes.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Questionário</h2>
          <div className="space-y-5">
            {questoes.map((q, i) => (
              <div key={q.id}>
                {q.enunciado && (
                  <p className="mb-1 text-sm font-semibold text-slate-700">
                    {i + 1}. {q.enunciado}
                  </p>
                )}
                {q.formato === "html" ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <HtmlEmbed html={q.html} />
                  </div>
                ) : (
                  <QuestaoEstruturada questao={q} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Concluir aula */}
      <div className="mt-10">
        {feita ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-lg font-semibold text-green-700">
              ✓ Aula concluída!
            </p>
            <p className="text-sm text-green-600">Mandou bem. Bora para a próxima?</p>
            <button
              onClick={alternarConcluida}
              className="mt-1 text-xs font-medium text-slate-500 underline hover:text-slate-700"
            >
              Desmarcar
            </button>
          </div>
        ) : (
          <button
            onClick={alternarConcluida}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            ✓ Marcar aula como concluída
          </button>
        )}
      </div>

      {/* Navegação entre aulas */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
        {anterior ? (
          <Link href={linkAula(anterior)} className="btn-secondary">
            ← {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {proxima ? (
          <Link href={linkAula(proxima)} className="btn-primary">
            {proxima.titulo} →
          </Link>
        ) : (
          <Link href={`/conteudos/${materia?.id || materiaId}`} className="btn-secondary">
            Voltar para a matéria
          </Link>
        )}
      </div>
    </div>
  );
}
