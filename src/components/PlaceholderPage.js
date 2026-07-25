import Link from "next/link";

/**
 * Componente reutilizável para as telas que cada time vai preencher.
 * Layout centralizado e profissional — substitua pelo conteúdo real do módulo.
 */
export default function PlaceholderPage({ titulo, time, descricao, emoji = "🚧", children }) {
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
        {emoji}
      </span>

      {time && (
        <span className="mt-6 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          {time}
        </span>
      )}

      <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {titulo}
      </h1>

      {descricao && (
        <p className="mt-4 max-w-xl text-lg text-slate-600">{descricao}</p>
      )}

      {children ? (
        <div className="mt-8 w-full">{children}</div>
      ) : (
        <p className="mt-8 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
          Em construção — conteúdo a caminho
        </p>
      )}

      <Link
        href="/"
        className="mt-10 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
      >
        ← Voltar para o início
      </Link>
    </section>
  );
}
