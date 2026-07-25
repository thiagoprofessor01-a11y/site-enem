/**
 * Componente placeholder reutilizável para as telas que cada time vai preencher.
 * Substitua pelo conteúdo real do módulo.
 */
export default function PlaceholderPage({ titulo, time, descricao, children }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        {time && (
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            {time}
          </span>
        )}
        <h1 className="mt-3 text-2xl font-bold text-slate-900">{titulo}</h1>
        {descricao && <p className="mt-2 text-slate-600">{descricao}</p>}
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
        {children || "Tela em construção — conteúdo a ser implementado por este time."}
      </div>
    </section>
  );
}
