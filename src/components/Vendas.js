import Link from "next/link";

// Página de vendas — a ser montada do zero. Por enquanto, apenas o essencial.
export default function Vendas() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-bold text-black">MeuENEM</h1>
      <p className="mt-3 text-slate-600">Plataforma de estudos para o ENEM.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/entrar" className="btn-secondary">
          Entrar
        </Link>
        <Link href="/cadastro" className="btn-primary">
          Criar conta
        </Link>
      </div>
    </div>
  );
}
