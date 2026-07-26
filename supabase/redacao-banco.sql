-- =====================================================================
-- Banco de redação (aba /redacao) — módulos → itens em HTML
-- =====================================================================
-- COMO USAR:
--   1. No Supabase, abra "SQL Editor".
--   2. Cole este arquivo INTEIRO e clique em "Run".
--
-- Mesma estrutura do banco de questões: o admin cria módulos (estrutura,
-- competências, banco de temas…) e cola o HTML de cada aula/tema.
-- =====================================================================

create table if not exists public.r_modulos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.r_itens (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid not null references public.r_modulos (id) on delete cascade,
  titulo text not null default '',
  html text not null default '',
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Segurança (RLS) — libera leitura E escrita (MVP). Trocar por login de
-- administrador antes de divulgar o site.
-- ---------------------------------------------------------------------

alter table public.r_modulos enable row level security;
alter table public.r_itens   enable row level security;

do $$
declare t text;
begin
  foreach t in array array['r_modulos','r_itens']
  loop
    execute format(
      'drop policy if exists "acesso liberado (mvp)" on public.%I;', t
    );
    execute format(
      'create policy "acesso liberado (mvp)" on public.%I for all using (true) with check (true);', t
    );
  end loop;
end $$;
