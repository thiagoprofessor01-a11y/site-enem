"use client";

import BancoModulos from "./BancoModulos";
import {
  fetchBanco,
  addQModulo,
  updateQModulo,
  deleteQModulo,
  addQQuestao,
  deleteQQuestao,
} from "./questoes-store";

const store = {
  fetchBanco,
  addModulo: addQModulo,
  updateModulo: updateQModulo,
  deleteModulo: deleteQModulo,
  addItem: addQQuestao,
  deleteItem: deleteQQuestao,
};

const textos = {
  titulo: "Banco de questões",
  subtitulo: "Treine com as questões separadas por módulo.",
  subtituloAdmin: "Crie módulos e cole o HTML das questões, igual às aulas.",
  placeholderModulo: "Nome do novo módulo (ex.: Funções, Ecologia…)",
  botaoModulo: "+ Módulo",
  botaoItem: "+ Colar HTML de uma questão",
  itemNome: "questão",
  itemPadrao: "Questão",
  placeholderTitulo: "Ex.: Questão 1 (ENEM 2022)",
  labelHtml: "Código HTML da questão",
  placeholderHtml:
    "<div>...cole aqui o HTML da questão (enunciado, alternativas e correção)...</div>",
};

export default function QuestoesClient({ embutido = false, forcarAdmin = false }) {
  return (
    <BancoModulos store={store} textos={textos} embutido={embutido} forcarAdmin={forcarAdmin} />
  );
}
