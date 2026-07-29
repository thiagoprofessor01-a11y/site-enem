"use client";

// Cartão de PDF: prévia em formato A4 (retrato), título embaixo e botão de
// download. A prévia usa um <iframe> (funciona no computador e, no celular,
// o aluno toca em "Baixar" para abrir/salvar).
export default function PdfCard({ titulo, url, onExcluir }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:shadow-card-hover">
      {/* Prévia A4 */}
      <div className="relative w-full bg-slate-100" style={{ aspectRatio: "1 / 1.414" }}>
        {url ? (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&view=FitH`}
            title={titulo}
            className="h-full w-full"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">PDF</div>
        )}
        {/* camada para não "prender" o scroll no iframe ao rolar a página */}
        <div className="absolute inset-0" aria-hidden />
      </div>

      {/* Título + ações */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 p-3">
        <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">{titulo}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
        >
          Baixar
        </a>
        {onExcluir && (
          <button
            type="button"
            onClick={onExcluir}
            className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
