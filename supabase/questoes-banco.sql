-- =====================================================================
-- Banco de questões (aba /questoes) — módulos → questões em HTML
-- =====================================================================
-- COMO USAR:
--   1. No Supabase, abra "SQL Editor".
--   2. Cole este arquivo INTEIRO e clique em "Run".
--
-- Independente do conteúdo das aulas: aqui o admin cria módulos de
-- questões e cola o HTML de cada questão (enunciado + alternativas +
-- correção), igual às questões das aulas.
-- =====================================================================

create table if not exists public.q_modulos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.q_questoes (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid not null references public.q_modulos (id) on delete cascade,
  titulo text not null default '',
  html text not null default '',
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Segurança (RLS)
-- ---------------------------------------------------------------------
-- ATENÇÃO: libera leitura E escrita para qualquer visitante (MVP).
-- Antes de divulgar o site, troque a escrita por login de administrador.
-- ---------------------------------------------------------------------

alter table public.q_modulos  enable row level security;
alter table public.q_questoes enable row level security;

do $$
declare t text;
begin
  foreach t in array array['q_modulos','q_questoes']
  loop
    execute format(
      'drop policy if exists "acesso liberado (mvp)" on public.%I;', t
    );
    execute format(
      'create policy "acesso liberado (mvp)" on public.%I for all using (true) with check (true);', t
    );
  end loop;
end $$;
