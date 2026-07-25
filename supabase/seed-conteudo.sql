-- =====================================================================
-- Conteúdo do ENEM — matérias, módulos (macroassuntos) e aulas.
-- Incidência representada por nivel 1..5 (bolinhas), derivado do
-- documento 'Filtro Completo de Conteúdos que Mais Caem no ENEM'.
-- =====================================================================
-- COMO USAR: rode ANTES o supabase/admin.sql (cria as tabelas). Depois
-- cole este arquivo inteiro no SQL Editor do Supabase e clique em Run.
-- Idempotente: cada matéria só é inserida se ainda não existir (pelo nome).
-- =====================================================================

-- ============================================================
-- Matemática
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Matemática') then
    insert into public.materias(nome, area) values ('Matemática', 'matematica') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Matemática Básica', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Razão e proporção', 'Porcentagem', 'Expressões numéricas, lógica matemática e operações', 'Sistemas de numeração e sistema métrico decimal', 'MMC e MDC']::text[], array['o assunto isolado mais cobrado de toda a prova', '', '', '', '']::text[], array[5, 3, 2, 2, 1]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Geometria', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Geometria espacial (prismas e cilindros)', 'Geometria plana (cálculo de áreas)', 'Geometria analítica (reta e circunferência)']::text[], array['', '', '']::text[], array[5, 4, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Funções e Equações', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Gráficos de funções', 'Função afim (1º grau)', 'Funções de várias sentenças, modular e inequações', 'Exponencial e logaritmo', 'Função quadrática (2º grau)', 'Funções trigonométricas']::text[], array['', 'a mais cobrada entre as funções', '', '', '', '']::text[], array[3, 3, 3, 2, 2, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Estatística', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Interpretação de gráficos (barras, linhas, pizza)', 'Leitura e análise direta de dados estatísticos', 'Médias contextualizadas (idade, altura, salário)', 'Média ponderada']::text[], array['', '', '', '']::text[], array[4, 4, 3, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Probabilidade', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Probabilidade', 'Análise combinatória (arranjo e combinação)', 'Permutação', 'Princípio fundamental da contagem']::text[], array['tema muito temido, grande diversidade de questões', '', '', '']::text[], array[5, 3, 3, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Outros temas', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Progressões (PA e PG)', 'Trigonometria (triângulo retângulo e gráficos)', 'Conjuntos (diagrama de Venn)', 'Matrizes', 'Sistemas lineares']::text[], array['', '', '', '', '']::text[], array[4, 4, 3, 1, 1]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Biologia
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Biologia') then
    insert into public.materias(nome, area) values ('Biologia', 'natureza') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Ecologia', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Poluição', 'Desequilíbrios ecológicos', 'Ciclos de matéria']::text[], array['', '', '']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Fisiologia Animal', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Sistema digestório', 'Sistema endócrino (hormônios)']::text[], array['', '']::text[], array[3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Botânica', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Grupos de plantas (Angiospermas e Gimnospermas)', 'Adaptações das plantas aos ecossistemas']::text[], array['', '']::text[], array[3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Bioenergética', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Fermentação (álcool, massas)', 'Fotossíntese', 'Respiração celular']::text[], array['', '', '']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Biologia Molecular e Engenharia Genética', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Transgênicos', 'Terapia gênica', 'Teste de DNA']::text[], array['', '', '']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Evolução', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Teorias evolutivas', 'Resistência bacteriana a antibióticos', 'Processos de especiação']::text[], array['', '', '']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Genética', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Heredogramas', 'Tipos de herança (recessiva/dominante, autossômica/sexual)']::text[], array['', '']::text[], array[3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Bioquímica', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Água e sais minerais']::text[], array['os temas que mais caem']::text[], array[3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Microbiologia', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Doenças (dengue, gripe, aids, Chagas, leishmaniose, malária)']::text[], array['foco em transmissão e prevenção']::text[], array[3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Histologia Animal', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Sangue e sistema imune', 'Vacinas']::text[], array['', '']::text[], array[3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Núcleo e Divisão Celular', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Ativação de genes e especialização celular', 'Célula-tronco e clonagem', 'Fases da divisão celular']::text[], array['', '', '']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Zoologia', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Doenças causadas por vermes, artrópodes e vertebrados']::text[], array['']::text[], array[3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Características dos Seres Vivos e Origem da Vida', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Características dos seres vivos', 'Reprodução humana e embriologia', 'Origem da vida e taxonomia']::text[], array['', '', '']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Ciclo do Nitrogênio', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Ciclo do nitrogênio']::text[], array['']::text[], array[3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Citologia', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Organelas celulares']::text[], array['o tema que mais cai']::text[], array[3]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Física
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Física') then
    insert into public.materias(nome, area) values ('Física', 'natureza') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Eletrodinâmica', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Circuitos elétricos e associação de resistores', 'Potência e energia elétrica', 'Leis de Ohm']::text[], array['', '', '']::text[], array[5, 4, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Dinâmica', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Trabalho e energia', 'Leis de Newton', 'Quantidade de movimento e impulso']::text[], array['', '', '']::text[], array[5, 4, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Termologia', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Calorimetria (calor sensível e latente)', 'Transmissão de calor (condução, convecção, radiação)', 'Termodinâmica (transformações gasosas)']::text[], array['', '', '']::text[], array[4, 4, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Ondulatória', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Fenômenos ondulatórios (conceitos gerais)', 'Ondas aplicadas à Óptica', 'Equação fundamental da ondulatória']::text[], array['', '', '']::text[], array[5, 4, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Cinemática', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['MU e MUV', 'Lançamentos e queda livre', 'MCU (movimento circular uniforme)']::text[], array['', '', '']::text[], array[5, 4, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Óptica', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Fundamentos da óptica (cor dos corpos, meios materiais)', 'Refração', 'Defeitos da visão (miopia, hipermetropia, astigmatismo, presbiopia)']::text[], array['', '', '']::text[], array[4, 4, 4]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Estática, Gravitação, Eletromagnetismo e Hidrostática', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Hidrostática (pressão e densidade)', 'Eletromagnetismo (força magnética, Faraday, Lenz)', 'Eletrostática (carga, campo e potencial elétrico)', 'Estática (equilíbrio de ponto material e corpo extenso)', 'Gravitação (Lei da Gravitação de Newton)', 'Hidrodinâmica (vazão)']::text[], array['', '', '', '', '', '']::text[], array[4, 4, 3, 2, 1, 1]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Química
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Química') then
    insert into public.materias(nome, area) values ('Química', 'natureza') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Físico-Química', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Química Geral (átomos, substâncias, misturas, separação, densidade)', 'Estequiometria', 'Ácidos e bases (pH, pOH, hidrólise de sais)', 'Oxirredução / Nox', 'Soluções, entalpia (Lei de Hess), pilhas, radioatividade, cinética e osmose']::text[], array['ponto de partida do estudo', '', '', 'base da eletroquímica', 'temas específicos recorrentes']::text[], array[5, 4, 3, 2, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Química Ambiental', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Chuva ácida', 'Buraco na camada de ozônio', 'Efeito estufa']::text[], array['', '', '']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Química Orgânica', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Reações orgânicas (oxidação, saponificação, esterificação)', 'Isomeria (cis-trans e carbono quiral)', 'Classificação e propriedades das funções orgânicas', 'Nomenclatura das funções orgânicas', 'Plásticos e polímeros']::text[], array['', '', '', '', '']::text[], array[5, 2, 2, 2, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Forças Intermoleculares e Ligações Químicas', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Ligações químicas (iônica, covalente e metálica)', 'Modelo atômico de Bohr (saltos de elétrons)', 'Eletronegatividade']::text[], array['', '', 'propriedade periódica mais cobrada']::text[], array[3, 3, 3]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- História
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'História') then
    insert into public.materias(nome, area) values ('História', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Brasil', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Brasil República (Primeira República, Era Vargas, Regime Militar, Nova República)', 'Brasil Colônia (sistema colonial, povos indígenas, escravidão)', 'Brasil Império (Segundo Reinado, escravidão, Primeiro Reinado)']::text[], array['', '', '']::text[], array[5, 4, 4]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'História Geral', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Idade Contemporânea (imperialismo, guerras mundiais, Guerra Fria)', 'Idade Moderna (absolutismo, mercantilismo, Iluminismo, Revolução Francesa)', 'Idade Média (alta e baixa Idade Média, feudalismo)', 'Antiguidade (Grécia, Roma, Antiguidade Oriental)', 'Pré-história (ondas migratórias, arte rupestre)']::text[], array['', '', '', '', '']::text[], array[5, 3, 3, 2, 1]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'História Temática', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Historiografia e questões sociais']::text[], array['']::text[], array[3]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Geografia
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Geografia') then
    insert into public.materias(nome, area) values ('Geografia', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Geografia do Brasil', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Geografia Humana (demografia e urbanização)', 'Geografia Econômica e Agrária (estrutura fundiária, mineração, indústria, energia)', 'Geografia Física (vegetação, hidrografia, relevo, clima)', 'Meio ambiente (desmatamento e ação antrópica)']::text[], array['', '', '', '']::text[], array[4, 4, 3, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Geografia Geral', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Geografia Física (movimentos da Terra, clima, ciclo da água, cartografia)', 'Geografia Econômica (geografia agrária, desenvolvimento sustentável)', 'Geopolítica (tensões e conflitos internacionais)', 'Meio ambiente (desmatamento)', 'Demografia']::text[], array['', '', '', '', '']::text[], array[4, 3, 3, 2, 2]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Sociologia
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Sociologia') then
    insert into public.materias(nome, area) values ('Sociologia', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Diversidade Cultural e Estratificação Social', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Gênero', 'Desigualdades sociais', 'Diversidade cultural', 'Questão racial', 'Cultura popular e erudita', 'Questão indígena', 'Identidade']::text[], array['', '', '', '', '', '', '']::text[], array[4, 3, 2, 2, 2, 2, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Sociologia Temática', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Antropologia', 'Cultura e educação', 'Trabalho e economia', 'Sociologia urbana e violência', 'Sociologia da ciência e do conhecimento']::text[], array['', '', '', '', '']::text[], array[4, 3, 3, 3, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Estado, Poder e Política', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Cidadania e direitos', 'Democracia e participação política', 'Política brasileira (patrimonialismo)', 'Política internacional']::text[], array['', '', '', '']::text[], array[4, 4, 2, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Teoria Sociológica', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Sociologia contemporânea (destaque para Foucault)', 'Conceitos gerais', 'Sociólogos clássicos (Weber, Durkheim, Marx)']::text[], array['', '', '']::text[], array[5, 2, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Trabalho e Produção', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Capitalismo e globalização', 'Modelos de produção (Taylorismo, Fordismo, Toyotismo)', 'Emprego, desemprego e uberização']::text[], array['', '', '']::text[], array[5, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Movimentos Sociais', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Movimentos agrários, urbanos, LGBTQIAPN+ e feminista', 'Movimento negro', 'Movimento ambientalista']::text[], array['', '', '']::text[], array[4, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Socialização e Instituições Sociais', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Instituição familiar', 'Instituição escolar e instituições totais']::text[], array['', '']::text[], array[5, 4]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Filosofia
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Filosofia') then
    insert into public.materias(nome, area) values ('Filosofia', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Filosofia Contemporânea', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Ética temática (cruzando com Literatura e Sociologia)', 'Escola de Frankfurt e Indústria Cultural (Adorno, Habermas)', 'Rawls e a justiça como equidade', 'Finitude humana', 'Michel Foucault (disciplina, vigilância, micropoder)', 'Nietzsche', 'Hans Jonas e o princípio da responsabilidade', 'Epistemologia da linguagem']::text[], array['', '', '', '', '', '', '', '']::text[], array[3, 3, 2, 2, 2, 2, 1, 1]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Filosofia Moderna', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Maquiavel (o pai da política moderna)', 'Contratualismo (Hobbes, Locke e Rousseau)', 'Empirismo (Locke) x racionalismo (Descartes)', 'Método científico (Bacon, Galileu, Newton)', 'Iluminismo', 'Ética em Kant, Hume e Utilitarismo']::text[], array['', '', '', '', '', '']::text[], array[3, 2, 2, 2, 1, 1]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Filosofia Antiga', '', 4) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Sócrates x Sofistas', 'Aristóteles (Política e Ética)', 'Pré-socráticos (Tales, Demócrito, Heráclito, Parmênides)', 'Platão', 'Helenismo (Epicurismo, Estoicismo, Ceticismo, Cinismo)', 'Surgimento da Filosofia e a pólis grega']::text[], array['', '', '', '', '', '']::text[], array[3, 3, 3, 3, 3, 1]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Filosofia Medieval', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Agostinho (platonismo cristão)', 'Tomás de Aquino (aristotelismo cristão)']::text[], array['', '']::text[], array[5, 4]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Português e Linguagens
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Português e Linguagens') then
    insert into public.materias(nome, area) values ('Português e Linguagens', 'linguagens') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Interpretação de texto e gêneros textuais', '', 5) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Interpretação de texto', 'Fontes jornalísticas (Folha, Estadão, Veja, Época)', 'Campanhas de interesse coletivo', 'Charges, cartuns e tirinhas', 'Texto científico x divulgação científica']::text[], array['', '', '', '', '']::text[], array[3, 4, 2, 1, 1]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Elementos da comunicação e funções da linguagem', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Funções da linguagem', 'Elementos da comunicação']::text[], array['média de 2 questões por prova', '']::text[], array[3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Coesão textual', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Conjunções e pronomes relativos', 'Efeitos temporais dos usos verbais', 'Neologismos e formação de palavras', 'Ambiguidade e polissemia']::text[], array['', '', '', '']::text[], array[4, 4, 3, 2]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Figuras de linguagem e texto poético', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Figuras de linguagem', 'Métrica (sonetos decassilábicos, versilibrismo)']::text[], array['', '']::text[], array[5, 5]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Variação linguística', '', 1) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Variação diafásica (linguagem e contexto)', 'Coloquialidade x norma culta']::text[], array['', '']::text[], array[5, 5]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Literatura
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Literatura') then
    insert into public.materias(nome, area) values ('Literatura', 'linguagens') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Modernismo', 'o tema dominante da Literatura no ENEM', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Modernismo e a relação do leitor com o texto artístico', 'Tropicália e Poesia Marginal (Caetano, Gil, Cacaso, Leminski)', 'Pré-Modernismo (Policarpo Quaresma, Os Sertões)', 'Prosa contista (Guimarães Rosa)']::text[], array['a maior fatia isolada da matéria', '', '', 'autor mais cobrado nos últimos anos']::text[], array[3, 3, 3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Realismo', '', 2) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Machado de Assis (Memórias Póstumas, Quincas Borba)', 'Cientificismo do Realismo']::text[], array['', '']::text[], array[5, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Romantismo', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Poesia romântica (Castro Alves, Gonçalves Dias)', 'Romance romântico (José de Alencar)']::text[], array['', '']::text[], array[3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Barroco', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Gregório de Matos']::text[], array['nome predominante do período']::text[], array[3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Literatura Contemporânea', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Conceição Evaristo e autores recentes', 'Clarice Lispector cronista']::text[], array['', '']::text[], array[3, 3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Literatura Portuguesa', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Camões']::text[], array['presença pontual (ex.: 2025)']::text[], array[3]::int[]) as x(t, r, n);
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Interpretação literária', '', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Postura dos narradores (1ª x 3ª pessoa)']::text[], array['']::text[], array[3]::int[]) as x(t, r, n);
  end if;
end $$;

-- ============================================================
-- Redação
-- ============================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Redação') then
    insert into public.materias(nome, area) values ('Redação', 'redacao') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao, nivel) values (v_mat, 'Temas recorrentes', 'eixos temáticos que mais aparecem na prova', 3) returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo, nivel)
    select v_mod, t, r, n from unnest(array['Questões sociais', 'Meio ambiente', 'Tecnologia e sociedade', 'Cidadania e direitos humanos']::text[], array['', '', '', '']::text[], array[3, 3, 3, 3]::int[]) as x(t, r, n);
  end if;
end $$;
