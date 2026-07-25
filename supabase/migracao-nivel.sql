-- =====================================================================
-- Migração: incidência por bolinhas (nivel 1..5) em vez de porcentagem
-- =====================================================================
-- Rode UMA vez no SQL Editor do Supabase. Adiciona a coluna `nivel` em
-- modulos e aulas, define o nível lendo a porcentagem que já está no texto
-- e remove essa porcentagem. Não apaga vídeos nem questões já cadastrados.
-- =====================================================================

alter table public.modulos add column if not exists nivel integer not null default 3;
alter table public.aulas   add column if not exists nivel integer not null default 3;

-- MÓDULOS: nível a partir da % (fatia da matéria) e limpa o texto
update public.modulos m
set nivel = case
      when p is null then 3
      when p >= 30 then 5
      when p >= 20 then 4
      when p >= 12 then 3
      when p >= 6  then 2
      else 1 end,
    descricao = case when descricao ~ '[0-9]+(,[0-9]+)?\s*%' then '' else descricao end
from (
  select id,
         (replace(substring(descricao from '([0-9]+(,[0-9]+)?)\s*%'), ',', '.'))::numeric as p
  from public.modulos
) s
where m.id = s.id;

-- AULAS: nível a partir da % (fatia do módulo) e mantém só a nota
update public.aulas a
set nivel = case
      when p is null then 3
      when p >= 40 then 5
      when p >= 25 then 4
      when p >= 15 then 3
      when p >= 8  then 2
      else 1 end,
    resumo = trim(regexp_replace(resumo, '^\s*[0-9]+(,[0-9]+)?\s*%\s*([—-]\s*)?', ''))
from (
  select id,
         (replace(substring(resumo from '([0-9]+(,[0-9]+)?)\s*%'), ',', '.'))::numeric as p
  from public.aulas
) s
where a.id = s.id;
