"use client";

import BancoPdfs from "@/modules/pdfs/BancoPdfs";
import { resumosStore } from "./resumos-store";

const textos = {
  titulo: "Resumos",
  subtitulo: "Resumos em PDF e imagens, organizados por matéria. Veja aqui ou baixe.",
  subtituloAdmin: "Crie matérias e adicione os resumos (PDF ou imagem) de cada uma.",
  placeholderModulo: "Nome da matéria (ex.: Matemática, Biologia…)",
  placeholderTitulo: "Ex.: Funções — resumo completo",
};

export default function ResumosClient({ embutido = false, forcarAdmin = false }) {
  return (
    <BancoPdfs
      store={resumosStore}
      textos={textos}
      comModulos
      aceitaImagem
      embutido={embutido}
      forcarAdmin={forcarAdmin}
    />
  );
}

