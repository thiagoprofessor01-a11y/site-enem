"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "meuenem:cookies-ok";

export default function CookieBanner() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setMostrar(true);
    } catch {
      // ignora
    }
  }, []);

  function aceitar() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // ignora
    }
    setMostrar(false);
  }

  if (!mostrar) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="container flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-600">
          Usamos cookies necessários para o funcionamento do site e para manter
          você conectado. Veja nossa{" "}
          <Link href="/privacidade" className="font-semibold text-brand-700 underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <button onClick={aceitar} className="btn-primary shrink-0 px-6 py-2.5">
          Entendi
        </button>
      </div>
    </div>
  );
}
