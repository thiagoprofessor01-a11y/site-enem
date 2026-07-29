"use client";

import BancoModulos from "@/modules/questoes/BancoModulos";
import { simuladosStore } from "./simulados-store";

const textos = {
  titulo: "Simulados",
  subtitulo: "Resolva simulados no estilo da prova.",
  subtituloAdmin: "Crie módulos e cole o HTML de cada simulado, igual às questões.",
  placeholderModulo: "Nome do simulado (ex.: Simulado 1 — Dia 1)",
  botaoModulo: "+ Módulo",
  botaoItem: "+ Colar HTML de um simulado",
  itemNome: "simulado",
  itemPadrao: "Simulado",
  placeholderTitulo: "Ex.: Simulado ENEM 2022 — Dia 1",
  labelHtml: "Código HTML do simulado",
  placeholderHtml: "<div>...cole aqui o HTML do simulado (questões e correção)...</div>",
};

export default function SimuladosClient({ embutido = false, forcarAdmin = false }) {
  return (
    <BancoModulos store={simuladosStore} textos={textos} embutido={embutido} forcarAdmin={forcarAdmin} />
  );
}
