-- =====================================================================
-- Novas abas: Simulados (HTML), Redação (PDF) e Resumos (PDF por matéria)
-- =====================================================================
-- COMO USAR: SQL Editor > cole tudo > Run.
-- Rode DEPOIS do auth-setup.sql (usa a função is_admin()).
-- =====================================================================

-- ---------- Simulados (módulos -> itens em HTML) ----------
create table if not exists public.sim_modulos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.sim_itens (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid not null references public.sim_modulos (id) on delete cascade,
  titulo text not null default '',
  html text not null default '',
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Redação (lista simples de PDFs) ----------
create table if not exists public.redacao_pdfs (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid,                       -- não usado aqui (lista simples)
  titulo text not null default '',
  url text not null default '',
  path text not null default '',
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Resumos (matérias -> PDFs) ----------
create table if not exists public.resumo_modulos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.resumo_pdfs (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid references public.resumo_modulos (id) on delete cascade,
  titulo text not null default '',
  url text not null default '',
  path text not null default '',
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- RLS: leitura pública, escrita só admin ----------
do $$
declare t text;
begin
  foreach t in array array[
    'sim_modulos','sim_itens','redacao_pdfs','resumo_modulos','resumo_pdfs'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "leitura publica" on public.%I;', t);
    execute format('create policy "leitura publica" on public.%I for select using (true);', t);
    execute format('drop policy if exists "escrita admin" on public.%I;', t);
    execute format(
      'create policy "escrita admin" on public.%I for all
         using (public.is_admin()) with check (public.is_admin());', t
    );
  end loop;
end $$;

-- =====================================================================
-- Storage dos PDFs (bucket público "pdfs") — leitura pública, upload admin
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

drop policy if exists "pdfs leitura publica" on storage.objects;
create policy "pdfs leitura publica" on storage.objects
  for select using (bucket_id = 'pdfs');

drop policy if exists "pdfs upload admin" on storage.objects;
create policy "pdfs upload admin" on storage.objects
  for insert with check (bucket_id = 'pdfs' and public.is_admin());

drop policy if exists "pdfs update admin" on storage.objects;
create policy "pdfs update admin" on storage.objects
  for update using (bucket_id = 'pdfs' and public.is_admin());

drop policy if exists "pdfs delete admin" on storage.objects;
create policy "pdfs delete admin" on storage.objects
  for delete using (bucket_id = 'pdfs' and public.is_admin());
