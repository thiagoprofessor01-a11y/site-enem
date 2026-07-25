"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/modules/auth/LoginForm";

export default function EntrarPage() {
  const router = useRouter();
  return (
    <LoginForm
      titulo="Entrar na plataforma"
      descricao="Acesse a área do aluno ou o painel de administração."
      onSucesso={(sessao) => {
        router.replace(sessao.role === "admin" ? "/admin" : "/conteudos");
      }}
    />
  );
}
