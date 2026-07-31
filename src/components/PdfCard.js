"use client";

import { useState } from "react";

// Cartão de material (PDF ou imagem): prévia A4, título completo, ver dentro
// do site (ao clicar) e botão de download.
export default function PdfCard({ titulo, url, tipo = "pdf", orientacao = "retrato", ocultarTitulo = false, onExcluir }) {
  const [aberto, setAberto] = useState(false);
  const isImg = tipo === "imagem";
  const aspecto = orientacao === "paisagem" ? "aspect-[297/210]" : "aspect-[210/297]";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:shadow-card-hover">
      {/* Prévia A4 — clique para ver dentro do site */}
      <button
        type="button"
        onClick={() => setAberto(true)}
        className={`relative block w-full overflow-hidden bg-slate-100 ${aspecto}`}
        aria-label={`Ver ${titulo}`}
      >
        {url ? (
          isImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={titulo} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <iframe
              src={`${url}#toolbar=0&navpanes=0&view=FitH`}
              title={titulo}
              className="pointer-events-none absolute inset-0 h-full w-full"
              loading="lazy"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">Arquivo</div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition group-hover:bg-slate-900/20">
          <span className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 opacity-0 shadow transition group-hover:opacity-100">
            Ver aqui
          </span>
        </span>
      </button>

      {/* Título completo (opcional) + ações */}
      <div className="flex flex-col gap-2 border-t border-slate-100 p-3">
        {!ocultarTitulo && (
          <p className="break-words text-sm font-bold text-slate-800">{titulo}</p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Ver
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
          >
            Baixar
          </a>
          {onExcluir && (
            <button
              type="button"
              onClick={onExcluir}
              className="ml-auto rounded-lg px-2 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50"
            >
              Excluir
            </button>
          )}
        </div>
      </div>

      {aberto && (
        <Visualizador url={url} titulo={titulo} isImg={isImg} onClose={() => setAberto(false)} />
      )}
    </div>
  );
}

function Visualizador({ url, titulo, isImg, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 p-3 sm:p-6" onClick={onClose}>
      <div
        className="mx-auto mb-3 flex w-full max-w-4xl items-center justify-between gap-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="min-w-0 break-words text-sm font-semibold sm:text-base">{titulo}</span>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold hover:bg-white/30"
          >
            Baixar
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold hover:bg-white/30"
          >
            Fechar ✕
          </button>
        </div>
      </div>
      <div
        className="mx-auto w-full max-w-4xl flex-1 overflow-auto rounded-xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {isImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={titulo} className="mx-auto h-auto max-w-full" />
        ) : (
          <iframe src={url} title={titulo} className="h-full min-h-[70vh] w-full" />
        )}
      </div>
    </div>
  );
}
