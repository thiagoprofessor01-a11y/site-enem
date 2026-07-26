// Casca visual das páginas legais (privacidade, termos).
export function LegalShell({ titulo, atualizado, children }) {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        {titulo}
      </h1>
      {atualizado && (
        <p className="mt-2 text-sm text-slate-500">
          Última atualização: {atualizado}
        </p>
      )}
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  );
}

export function Secao({ titulo, children }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900">{titulo}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </section>
  );
}

export function Aviso({ children }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      {children}
    </div>
  );
}
