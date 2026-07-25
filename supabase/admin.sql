-- =====================================================================
-- Conteúdo do site — tabelas usadas pelo painel /admin
-- =====================================================================
-- COMO USAR:
--   1. No Supabase, abra "SQL Editor".
--   2. Cole este arquivo INTEIRO e clique em "Run".
--
-- Hierarquia: matéria → módulo → aula → (vídeos + questões).
-- As exclusões são em cascata (apagar uma matéria apaga todo o conteúdo dela).
-- =====================================================================

create table if not exists public.materias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  area text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.modulos (
  id uuid primary key default gen_random_uuid(),
  materia_id uuid not null references public.materias (id) on delete cascade,
  nome text not null,
  descricao text not null default '',
  nivel integer not null default 3, -- incidência 1..5 (bolinhas)
  created_at timestamptz not null default now()
);

create table if not exists public.aulas (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid not null references public.modulos (id) on delete cascade,
  titulo text not null,
  resumo text not null default '',
  nivel integer not null default 3, -- incidência 1..5 (bolinhas)
  created_at timestamptz not null default now()
);

create table if not exists public.aula_videos (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references public.aulas (id) on delete cascade,
  titulo text not null,
  youtube_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.questoes (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references public.aulas (id) on delete cascade,
  formato text not null default 'form', -- 'form' (estruturada) ou 'html' (código colado)
  html text,                            -- usado quando formato = 'html'
  enunciado text not null default '',
  alternativas jsonb not null default '[]'::jsonb,
  correta integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Segurança (RLS)
-- ---------------------------------------------------------------------
-- ATENÇÃO: as políticas abaixo LIBERAM leitura E escrita para qualquer
-- visitante. Isso é ótimo para você começar a cadastrar conteúdo agora,
-- mas ANTES de divulgar o site publicamente troque as políticas de
-- escrita para exigir login de administrador (posso te ajudar com isso).
-- ---------------------------------------------------------------------

alter table public.materias    enable row level security;
alter table public.modulos     enable row level security;
alter table public.aulas       enable row level security;
alter table public.aula_videos enable row level security;
alter table public.questoes    enable row level security;

do $$
declare t text;
begin
  foreach t in array array['materias','modulos','aulas','aula_videos','questoes']
  loop
    execute format(
      'drop policy if exists "acesso liberado (mvp)" on public.%I;', t
    );
    execute format(
      'create policy "acesso liberado (mvp)" on public.%I for all using (true) with check (true);', t
    );
  end loop;
end $$;
