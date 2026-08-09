"use client";

import { useState } from "react";

// Mostra a imagem do MacBook com a plataforma aberta (public/plataforma-mac.png).
// Enquanto o arquivo não existir, cai no mockup passado em `fallback`.
export default function PlataformaMac({ fallback = null }) {
  const [erro, setErro] = useState(false);

  if (erro) return fallback;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/plataforma-mac.png"
      alt="Plataforma MeuENEM aberta em um computador"
      className="mx-auto w-full max-w-xl"
      onError={() => setErro(true)}
    />
  );
}
