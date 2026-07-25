"use client";

import { useSessao } from "@/modules/auth/auth";
import Vendas from "@/components/Vendas";
import DashboardAluno from "@/modules/conteudos-dashboard/DashboardAluno";

// Tela inicial: aluno logado vê o painel do dia; visitante vê a página de vendas.
export default function HomeRouter() {
  const sessao = useSessao();
  // undefined (carregando) e null (deslogado) → página de vendas (igual ao SSR).
  if (sessao && sessao.role) return <DashboardAluno />;
  return <Vendas />;
}
