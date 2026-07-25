-- =====================================================================
-- Dados iniciais (seed) — Matérias do ENEM com peso proporcional
-- ao número de questões de cada área na prova real.
-- =====================================================================
-- Execute DEPOIS de schema.sql, no SQL Editor do Supabase.
--
-- Estrutura da prova (referência): cada área tem 45 questões.
--   - Linguagens, Códigos e suas Tecnologias .......... 45
--   - Ciências Humanas e suas Tecnologias ............. 45
--   - Ciências da Natureza e suas Tecnologias ......... 45
--   - Matemática e suas Tecnologias ................... 45
--   - Redação (peso próprio, tratada como área à parte no cronograma)
--
-- O `peso_na_prova` abaixo é usado pelo motor de cronograma (Time A)
-- para distribuir o tempo de estudo proporcionalmente.
-- =====================================================================

insert into public.materias (nome, area_conhecimento, peso_na_prova) values
  -- Linguagens
  ('Língua Portuguesa',        'linguagens', 45),
  ('Literatura',               'linguagens', 45),
  ('Língua Estrangeira',       'linguagens', 45),
  ('Artes',                    'linguagens', 45),
  ('Educação Física',          'linguagens', 45),
  -- Humanas
  ('História',                 'humanas',    45),
  ('Geografia',                'humanas',    45),
  ('Filosofia',                'humanas',    45),
  ('Sociologia',               'humanas',    45),
  -- Natureza
  ('Física',                   'natureza',   45),
  ('Química',                  'natureza',   45),
  ('Biologia',                 'natureza',   45),
  -- Matemática
  ('Matemática',               'matematica', 45)
on conflict do nothing;

-- Exemplo de tópicos (substitua/expanda usando o documento
-- "Filtro de Conteúdos que Mais Caem no ENEM").
insert into public.topicos (materia_id, nome, frequencia_historica)
select m.id, t.nome, t.freq
from public.materias m
join (values
  ('Matemática', 'Funções e gráficos', 80),
  ('Matemática', 'Estatística e probabilidade', 75),
  ('Matemática', 'Geometria plana', 70),
  ('Matemática', 'Razão, proporção e porcentagem', 85),
  ('Biologia',   'Ecologia', 78),
  ('Biologia',   'Genética', 65),
  ('Química',    'Química orgânica', 60),
  ('Física',     'Mecânica', 70),
  ('História',   'Brasil República', 72),
  ('Geografia',  'Geografia agrária', 55)
) as t(materia_nome, nome, freq) on t.materia_nome = m.nome
on conflict do nothing;
