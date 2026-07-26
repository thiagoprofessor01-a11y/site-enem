# Segurança e LGPD — registro e plano

Este documento registra as medidas de proteção de dados do site (útil como
"registro das operações de tratamento" da LGPD, art. 37) e o que ainda falta.

## Dados tratados

| Dado | Finalidade | Base legal | Onde fica |
|---|---|---|---|
| Nome, e-mail, senha | Conta e login | Execução de contrato | Supabase (SP) |
| Data de nascimento | Verificar idade / consentimento de menores | Obrigação legal (art. 14) | Supabase (SP) |
| Progresso, respostas, aulas concluídas | Acompanhar estudo | Execução de contrato | Supabase / navegador |
| Redações | Correção e estudo | Execução de contrato | Supabase (SP) |
| Pagamento | Liberar acesso | Execução de contrato | Mercado Pago (não guardamos cartão) |

Operadores: Supabase (banco/auth), Vercel (hospedagem), Mercado Pago (pagamento),
YouTube (vídeos incorporados).

## Feito
- [x] HTTPS (Vercel).
- [x] Segredos fora do repositório (`.env` no `.gitignore`).
- [x] Política de Privacidade (`/privacidade`) e Termos (`/termos`).
- [x] Banner de cookies.
- [x] Seção específica de **menores de idade** na Política e nos Termos.

## Pendente (crítico antes de lançar)
- [ ] **Login real (Supabase Auth)** no lugar do login de teste.
- [ ] **Fechar o RLS**: leitura pública/logada; escrita de conteúdo só para admin;
      dados do aluno só para o dono. (SQL abaixo — rodar junto com o login real.)
- [ ] Cadastro com **data de nascimento + aceite dos termos + consentimento do
      responsável para menores**.
- [ ] Botão **“excluir minha conta”** (direito do titular).
- [ ] Pagamento via checkout do Mercado Pago (nunca guardar cartão).
- [ ] Preencher os dados reais em `src/lib/legal.js` (empresa, CNPJ, e-mail, DPO).

---

## SQL para fechar o banco (rodar SOMENTE junto com o login real)

> ⚠️ Este SQL exige o Supabase Auth ativo. Se rodar antes do login real estar
> no ar, o painel `/admin` (que hoje escreve com a chave pública) perde acesso
> de escrita. Rode quando eu entregar a etapa de login.

```sql
-- Perfil do usuário (ligado ao Auth)
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  email text,
  data_nascimento date,
  pago boolean not null default false,
  is_admin boolean not null default false,
  aceite_termos_em timestamptz,
  consentimento_responsavel boolean not null default false,
  responsavel_nome text,
  responsavel_email text,
  created_at timestamptz not null default now()
);

alter table public.perfis enable row level security;
create policy "perfil proprio" on public.perfis
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Função auxiliar: o usuário atual é admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from public.perfis where id = auth.uid()), false);
$$;

-- Conteúdo: leitura para logados; escrita só admin
do $$
declare t text;
begin
  foreach t in array array['materias','modulos','aulas','aula_videos','questoes'] loop
    execute format('drop policy if exists "acesso liberado (mvp)" on public.%I;', t);
    execute format('drop policy if exists "ler conteudo" on public.%I;', t);
    execute format('drop policy if exists "admin escreve" on public.%I;', t);
    execute format('create policy "ler conteudo" on public.%I for select to authenticated using (true);', t);
    execute format('create policy "admin escreve" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- Para tornar alguém admin (rode manualmente com o e-mail da conta):
-- update public.perfis set is_admin = true where email = 'voce@email.com';
```
