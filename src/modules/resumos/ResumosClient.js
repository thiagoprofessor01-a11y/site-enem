"use client";

import BancoPdfs from "@/modules/pdfs/BancoPdfs";
import { resumosStore } from "./resumos-store";

const textos = {
  titulo: "Resumos",
  subtitulo: "Resumos em PDF, organizados por matéria. Baixe no seu celular.",
  subtituloAdmin: "Crie matérias e adicione os resumos em PDF de cada uma.",
  placeholderModulo: "Nome da matéria (ex.: Matemática, Biologia…)",
  placeholderTitulo: "Ex.: Funções — resumo completo",
};

export default function ResumosClient({ embutido = false, forcarAdmin = false }) {
  return (
    <BancoPdfs
      store={resumosStore}
      textos={textos}
      comModulos
      embutido={embutido}
      forcarAdmin={forcarAdmin}
    />
  );
}
