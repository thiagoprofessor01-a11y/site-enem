-- =====================================================================
-- Site de Estudos ENEM — Esquema inicial do banco de dados (Supabase / Postgres)
-- =====================================================================
-- Como usar:
--   1. Crie um projeto no Supabase (https://supabase.com).
--   2. Abra o SQL Editor no dashboard do Supabase.
--   3. Cole e execute este arquivo inteiro.
--
-- Observações:
--   - A tabela `usuarios` referencia auth.users (autenticação nativa do Supabase).
--   - RLS (Row Level Security) está habilitado nas tabelas de dados do aluno.
--   - As tabelas de conteúdo público (materias, topicos, questoes, temas_redacao,
--     conteudo_videos) são legíveis por qualquer usuário autenticado.
-- =====================================================================

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
do $$ begin
  create type area_conhecimento as enum ('linguagens', 'humanas', 'natureza', 'matematica');
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_item as enum ('pendente', 'concluido');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- TIME A — Usuários, matérias, tópicos e cronograma
-- ---------------------------------------------------------------------

-- usuarios: perfil do aluno (id casa com auth.users.id)
create table if not exists public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  email text,
  data_criacao timestamptz not null default now(),
  data_enem date,
  -- horas disponíveis por dia da semana, ex: {"seg": 2, "ter": 1.5, ...}
  horas_disponiveis jsonb not null default '{}'::jsonb,
  -- array de matéria_id (ou nomes) com maior dificuldade
  materias_dificuldade text[] not null default '{}'
);

-- materias: disciplinas do ENEM
create table if not exists public.materias (
  id bigint generated always as identity primary key,
  nome text not null,
  area_conhecimento area_conhecimento not null,
  peso_na_prova numeric not null default 1
);

-- topicos: assuntos dentro de cada matéria
create table if not exists public.topicos (
  id bigint generated always as identity primary key,
  materia_id bigint not null references public.materias (id) on delete cascade,
  nome text not null,
  -- frequência histórica de incidência na prova (0-100 ou nº de questões)
  frequencia_historica numeric not null default 0
);

-- cronograma_itens: itens do cronograma gerados para cada aluno
create table if not exists public.cronograma_itens (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  topico_id bigint not null references public.topicos (id) on delete cascade,
  data date not null,
  tempo_estimado_minutos integer not null default 0,
  status status_item not null default 'pendente'
);

-- ---------------------------------------------------------------------
-- TIME B — Banco de questões e respostas
-- ---------------------------------------------------------------------

-- questoes: banco de questões do ENEM (INEP — domínio público)
create table if not exists public.questoes (
  id bigint generated always as identity primary key,
  ano integer,
  materia_id bigint references public.materias (id) on delete set null,
  topico_id bigint references public.topicos (id) on delete set null,
  enunciado text not null,
  -- alternativas, ex: [{"letra":"A","texto":"..."}, ...]
  alternativas jsonb not null default '[]'::jsonb,
  resposta_correta text not null,
  dificuldade text -- 'facil' | 'media' | 'dificil'
);

-- respostas_aluno: registro de cada resposta dada pelo aluno
create table if not exists public.respostas_aluno (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  questao_id bigint not null references public.questoes (id) on delete cascade,
  resposta_dada text,
  correta boolean,
  data timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TIME C — Redação
-- ---------------------------------------------------------------------

-- temas_redacao: banco de temas de redação
create table if not exists public.temas_redacao (
  id bigint generated always as identity primary key,
  titulo text not null,
  ano integer, -- null = tema autoral
  texto_motivador text
);

-- redacoes_aluno: redações escritas pelos alunos
create table if not exists public.redacoes_aluno (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  tema_id bigint references public.temas_redacao (id) on delete set null,
  texto text,
  data timestamptz not null default now(),
  feedback text,
  -- nota por competência, ex: {"c1":160,"c2":180,"c3":140,"c4":160,"c5":200}
  nota jsonb
);

-- ---------------------------------------------------------------------
-- TIME D — Conteúdos e vídeos
-- ---------------------------------------------------------------------

-- conteudo_videos: vídeos do YouTube associados a tópicos
create table if not exists public.conteudo_videos (
  id bigint generated always as identity primary key,
  topico_id bigint not null references public.topicos (id) on delete cascade,
  titulo text not null,
  youtube_video_id text not null,
  duracao_segundos integer,
  ordem integer not null default 0
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

-- Conteúdo público (leitura para autenticados) --------------------------------
alter table public.materias        enable row level security;
alter table public.topicos         enable row level security;
alter table public.questoes        enable row level security;
alter table public.temas_redacao   enable row level security;
alter table public.conteudo_videos enable row level security;

do $$ begin
  create policy "leitura publica materias" on public.materias
    for select to authenticated using (true);
  create policy "leitura publica topicos" on public.topicos
    for select to authenticated using (true);
  create policy "leitura publica questoes" on public.questoes
    for select to authenticated using (true);
  create policy "leitura publica temas" on public.temas_redacao
    for select to authenticated using (true);
  create policy "leitura publica videos" on public.conteudo_videos
    for select to authenticated using (true);
exception when duplicate_object then null; end $$;

-- Dados do aluno (cada um vê apenas os seus) ----------------------------------
alter table public.usuarios          enable row level security;
alter table public.cronograma_itens  enable row level security;
alter table public.respostas_aluno   enable row level security;
alter table public.redacoes_aluno    enable row level security;

do $$ begin
  create policy "usuario ve seu perfil" on public.usuarios
    for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

  create policy "usuario ve seu cronograma" on public.cronograma_itens
    for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

  create policy "usuario ve suas respostas" on public.respostas_aluno
    for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

  create policy "usuario ve suas redacoes" on public.redacoes_aluno
    for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Trigger: cria linha em `usuarios` automaticamente ao registrar no Auth
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, nome, email)
  values (new.id, new.raw_user_meta_data->>'nome', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

do $$ begin
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
exception when duplicate_object then null; end $$;
