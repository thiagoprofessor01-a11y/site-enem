-- =====================================================================
-- Migração: permitir questões em HTML colado
-- =====================================================================
-- Rode UMA vez no SQL Editor do Supabase se você já tinha criado a tabela
-- `questoes` antes (com o admin.sql anterior). Adiciona as colunas novas
-- sem apagar nada do que já existe.
-- =====================================================================

alter table public.questoes
  add column if not exists formato text not null default 'form';

alter table public.questoes
  add column if not exists html text;

-- enunciado deixa de ser obrigatório (questões em HTML podem não ter título)
alter table public.questoes
  alter column enunciado set default '';
