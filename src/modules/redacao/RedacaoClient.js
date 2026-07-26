"use client";

import BancoModulos from "@/modules/questoes/BancoModulos";
import {
  fetchBancoRedacao,
  addRModulo,
  updateRModulo,
  deleteRModulo,
  addRItem,
  deleteRItem,
} from "./redacao-store";

const store = {
  fetchBanco: fetchBancoRedacao,
  addModulo: addRModulo,
  updateModulo: updateRModulo,
  deleteModulo: deleteRModulo,
  addItem: addRItem,
  deleteItem: deleteRItem,
};

const textos = {
  titulo: "Redação",
  subtitulo: "Aulas de redação e banco de temas, separados por módulo.",
  subtituloAdmin: "Crie módulos (estrutura, competências, temas…) e cole o HTML, igual às aulas.",
  placeholderModulo: "Nome do novo módulo (ex.: Competências, Temas…)",
  botaoModulo: "+ Módulo",
  botaoItem: "+ Colar HTML de uma aula/tema",
  itemNome: "item",
  itemPadrao: "Item",
  placeholderTitulo: "Ex.: Competência 1 — domínio da norma culta",
  labelHtml: "Código HTML do conteúdo",
  placeholderHtml: "<div>...cole aqui o HTML da aula ou do tema de redação...</div>",
};

export default function RedacaoClient({ embutido = false, forcarAdmin = false }) {
  return (
    <BancoModulos store={store} textos={textos} embutido={embutido} forcarAdmin={forcarAdmin} />
  );
}
