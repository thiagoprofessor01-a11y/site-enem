-- =====================================================================
-- Conteúdo do ENEM — matérias, módulos (macroassuntos) e aulas
-- (microassuntos), gerado a partir do documento 'Filtro Completo de
-- Conteúdos que Mais Caem no ENEM'.
-- =====================================================================
-- COMO USAR: rode ANTES o supabase/admin.sql (cria as tabelas). Depois
-- cole este arquivo inteiro no SQL Editor do Supabase e clique em Run.
--
-- Idempotente: cada matéria só é inserida se ainda não existir (pelo nome).
-- =====================================================================

-- ==================================================================
-- Matemática
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Matemática') then
    insert into public.materias(nome, area) values ('Matemática', 'matematica') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Matemática Básica', '33% da prova de Matemática') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Razão e proporção', 'Porcentagem', 'Expressões numéricas, lógica matemática e operações', 'Sistemas de numeração e sistema métrico decimal', 'MMC e MDC']::text[], array['51% — o assunto isolado mais cobrado de toda a prova', '21%', '12%', '11%', '4%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Geometria', '23% da prova de Matemática') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Geometria espacial (prismas e cilindros)', 'Geometria plana (cálculo de áreas)', 'Geometria analítica (reta e circunferência)']::text[], array['53%', '39%', '8%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Funções e Equações', '14% da prova de Matemática') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Gráficos de funções', 'Função afim (1º grau)', 'Funções de várias sentenças, modular e inequações', 'Exponencial e logaritmo', 'Função quadrática (2º grau)', 'Funções trigonométricas']::text[], array['24%', '22% — a mais cobrada entre as funções', '18%', '14%', '12%', '9%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Estatística', '12% da prova de Matemática') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Interpretação de gráficos (barras, linhas, pizza)', 'Leitura e análise direta de dados estatísticos', 'Médias contextualizadas (idade, altura, salário)', 'Média ponderada']::text[], array['35%', '31%', '20%', '12%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Probabilidade', '10% da prova de Matemática') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Probabilidade', 'Análise combinatória (arranjo e combinação)', 'Permutação', 'Princípio fundamental da contagem']::text[], array['58% — tema muito temido, grande diversidade de questões', '19%', '15%', '8%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Outros temas', '8% da prova de Matemática') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Progressões (PA e PG)', 'Trigonometria (triângulo retângulo e gráficos)', 'Conjuntos (diagrama de Venn)', 'Matrizes', 'Sistemas lineares']::text[], array['34%', '29%', '22%', '7%', '7%']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Biologia
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Biologia') then
    insert into public.materias(nome, area) values ('Biologia', 'natureza') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Ecologia', '31,4% da Biologia — melhor custo-benefício de estudo') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Poluição', 'Desequilíbrios ecológicos', 'Ciclos de matéria']::text[], array['', '', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Fisiologia Animal', '6,8% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Sistema digestório', 'Sistema endócrino (hormônios)']::text[], array['', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Botânica', '6,6% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Grupos de plantas (Angiospermas e Gimnospermas)', 'Adaptações das plantas aos ecossistemas']::text[], array['', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Bioenergética', '6,6% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Fermentação (álcool, massas)', 'Fotossíntese', 'Respiração celular']::text[], array['', '', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Biologia Molecular e Engenharia Genética', '6% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Transgênicos', 'Terapia gênica', 'Teste de DNA']::text[], array['', '', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Evolução', '6% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Teorias evolutivas', 'Resistência bacteriana a antibióticos', 'Processos de especiação']::text[], array['', '', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Genética', '5,1% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Heredogramas', 'Tipos de herança (recessiva/dominante, autossômica/sexual)']::text[], array['', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Bioquímica', '5,1% da Biologia — base para toda a disciplina') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Água e sais minerais']::text[], array['os temas que mais caem']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Microbiologia', '5,1% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Doenças (dengue, gripe, aids, Chagas, leishmaniose, malária)']::text[], array['foco em transmissão e prevenção']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Histologia Animal', '5,1% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Sangue e sistema imune', 'Vacinas']::text[], array['', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Núcleo e Divisão Celular', '4,6% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Ativação de genes e especialização celular', 'Célula-tronco e clonagem', 'Fases da divisão celular']::text[], array['', '', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Zoologia', '4,4% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Doenças causadas por vermes, artrópodes e vertebrados']::text[], array['']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Características dos Seres Vivos e Origem da Vida', '4% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Características dos seres vivos', 'Reprodução humana e embriologia', 'Origem da vida e taxonomia']::text[], array['', '', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Ciclo do Nitrogênio', '3,8% da Biologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Ciclo do nitrogênio']::text[], array['']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Citologia', '3,2% da Biologia — base para toda a disciplina') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Organelas celulares']::text[], array['o tema que mais cai']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Física
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Física') then
    insert into public.materias(nome, area) values ('Física', 'natureza') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Eletrodinâmica', '24% da prova de Física') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Circuitos elétricos e associação de resistores', 'Potência e energia elétrica', 'Leis de Ohm']::text[], array['43%', '28%', '20%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Dinâmica', '18% da prova de Física') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Trabalho e energia', 'Leis de Newton', 'Quantidade de movimento e impulso']::text[], array['50%', '32%', '14%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Termologia', '15% da prova de Física') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Calorimetria (calor sensível e latente)', 'Transmissão de calor (condução, convecção, radiação)', 'Termodinâmica (transformações gasosas)']::text[], array['39%', '37%', '17%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Ondulatória', '14% da prova de Física') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Fenômenos ondulatórios (conceitos gerais)', 'Ondas aplicadas à Óptica', 'Equação fundamental da ondulatória']::text[], array['48%', '35%', '13%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Cinemática', '10% da prova de Física') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['MU e MUV', 'Lançamentos e queda livre', 'MCU (movimento circular uniforme)']::text[], array['46%', '29%', '14%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Óptica', '6% da prova de Física') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Fundamentos da óptica (cor dos corpos, meios materiais)', 'Refração', 'Defeitos da visão (miopia, hipermetropia, astigmatismo, presbiopia)']::text[], array['31%', '25%', '25%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Estática, Gravitação, Eletromagnetismo e Hidrostática', '13% da prova de Física') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Hidrostática (pressão e densidade)', 'Eletromagnetismo (força magnética, Faraday, Lenz)', 'Eletrostática (carga, campo e potencial elétrico)', 'Estática (equilíbrio de ponto material e corpo extenso)', 'Gravitação (Lei da Gravitação de Newton)', 'Hidrodinâmica (vazão)']::text[], array['26%', '26%', '17%', '9%', '6%', '6%']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Química
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Química') then
    insert into public.materias(nome, area) values ('Química', 'natureza') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Físico-Química', '~33,5% da prova de Química') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Química Geral (átomos, substâncias, misturas, separação, densidade)', 'Estequiometria', 'Ácidos e bases (pH, pOH, hidrólise de sais)', 'Oxirredução / Nox', 'Soluções, entalpia (Lei de Hess), pilhas, radioatividade, cinética e osmose']::text[], array['41% — ponto de partida do estudo', '35%', '16%', '8% — base da eletroquímica', 'temas específicos recorrentes']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Química Ambiental', '26,6% da prova de Química — sempre presente') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Chuva ácida', 'Buraco na camada de ozônio', 'Efeito estufa']::text[], array['', '', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Química Orgânica', '20,8% da prova de Química') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Reações orgânicas (oxidação, saponificação, esterificação)', 'Isomeria (cis-trans e carbono quiral)', 'Classificação e propriedades das funções orgânicas', 'Nomenclatura das funções orgânicas', 'Plásticos e polímeros']::text[], array['43%', '14%', '13%', '12%', '9%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Forças Intermoleculares e Ligações Químicas', '13,4% da prova de Química') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Ligações químicas (iônica, covalente e metálica)', 'Modelo atômico de Bohr (saltos de elétrons)', 'Eletronegatividade']::text[], array['', '', 'propriedade periódica mais cobrada']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- História
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'História') then
    insert into public.materias(nome, area) values ('História', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Brasil', '57% da prova de História') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Brasil República (Primeira República, Era Vargas, Regime Militar, Nova República)', 'Brasil Colônia (sistema colonial, povos indígenas, escravidão)', 'Brasil Império (Segundo Reinado, escravidão, Primeiro Reinado)']::text[], array['41%', '31%', '28%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'História Geral', '32% da prova de História') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Idade Contemporânea (imperialismo, guerras mundiais, Guerra Fria)', 'Idade Moderna (absolutismo, mercantilismo, Iluminismo, Revolução Francesa)', 'Idade Média (alta e baixa Idade Média, feudalismo)', 'Antiguidade (Grécia, Roma, Antiguidade Oriental)', 'Pré-história (ondas migratórias, arte rupestre)']::text[], array['41%', '23%', '20%', '14%', '3%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'História Temática', '10% da prova de História') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Historiografia e questões sociais']::text[], array['']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Geografia
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Geografia') then
    insert into public.materias(nome, area) values ('Geografia', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Geografia do Brasil', '69,2% da prova de Geografia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Geografia Humana (demografia e urbanização)', 'Geografia Econômica e Agrária (estrutura fundiária, mineração, indústria, energia)', 'Geografia Física (vegetação, hidrografia, relevo, clima)', 'Meio ambiente (desmatamento e ação antrópica)']::text[], array['35,5%', '35,5%', '19,3%', '9,7%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Geografia Geral', '30,8% da prova de Geografia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Geografia Física (movimentos da Terra, clima, ciclo da água, cartografia)', 'Geografia Econômica (geografia agrária, desenvolvimento sustentável)', 'Geopolítica (tensões e conflitos internacionais)', 'Meio ambiente (desmatamento)', 'Demografia']::text[], array['31,6%', '24%', '16,5%', '14,4%', '12,9%']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Sociologia
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Sociologia') then
    insert into public.materias(nome, area) values ('Sociologia', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Diversidade Cultural e Estratificação Social', '28% da prova de Sociologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Gênero', 'Desigualdades sociais', 'Diversidade cultural', 'Questão racial', 'Cultura popular e erudita', 'Questão indígena', 'Identidade']::text[], array['26%', '18%', '14%', '9%', '9%', '8%', '8%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Sociologia Temática', '24% da prova de Sociologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Antropologia', 'Cultura e educação', 'Trabalho e economia', 'Sociologia urbana e violência', 'Sociologia da ciência e do conhecimento']::text[], array['25%', '24%', '21%', '15%', '9%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Estado, Poder e Política', '19% da prova de Sociologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Cidadania e direitos', 'Democracia e participação política', 'Política brasileira (patrimonialismo)', 'Política internacional']::text[], array['31%', '27%', '13%', '10%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Teoria Sociológica', '14% da prova de Sociologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Sociologia contemporânea (destaque para Foucault)', 'Conceitos gerais', 'Sociólogos clássicos (Weber, Durkheim, Marx)']::text[], array['59%', '14%', '11%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Trabalho e Produção', '7% da prova de Sociologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Capitalismo e globalização', 'Modelos de produção (Taylorismo, Fordismo, Toyotismo)', 'Emprego, desemprego e uberização']::text[], array['58%', '21%', '16%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Movimentos Sociais', '6% da prova de Sociologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Movimentos agrários, urbanos, LGBTQIAPN+ e feminista', 'Movimento negro', 'Movimento ambientalista']::text[], array['35%', '24%', '24%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Socialização e Instituições Sociais', '2% da prova de Sociologia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Instituição familiar', 'Instituição escolar e instituições totais']::text[], array['67%', '33%']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Filosofia
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Filosofia') then
    insert into public.materias(nome, area) values ('Filosofia', 'humanas') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Filosofia Contemporânea', '44% da prova de Filosofia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Ética temática (cruzando com Literatura e Sociologia)', 'Escola de Frankfurt e Indústria Cultural (Adorno, Habermas)', 'Rawls e a justiça como equidade', 'Finitude humana', 'Michel Foucault (disciplina, vigilância, micropoder)', 'Nietzsche', 'Hans Jonas e o princípio da responsabilidade', 'Epistemologia da linguagem']::text[], array['17%', '17%', '12%', '12%', '10%', '10%', '6%', '4%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Filosofia Moderna', '27% da prova de Filosofia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Maquiavel (o pai da política moderna)', 'Contratualismo (Hobbes, Locke e Rousseau)', 'Empirismo (Locke) x racionalismo (Descartes)', 'Método científico (Bacon, Galileu, Newton)', 'Iluminismo', 'Ética em Kant, Hume e Utilitarismo']::text[], array['', '13%', '9%', '9%', '6%', '6%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Filosofia Antiga', '23% da prova de Filosofia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Sócrates x Sofistas', 'Aristóteles (Política e Ética)', 'Pré-socráticos (Tales, Demócrito, Heráclito, Parmênides)', 'Platão', 'Helenismo (Epicurismo, Estoicismo, Ceticismo, Cinismo)', 'Surgimento da Filosofia e a pólis grega']::text[], array['22%', '22%', '19%', '15%', '15%', '7%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Filosofia Medieval', '5% da prova de Filosofia') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Agostinho (platonismo cristão)', 'Tomás de Aquino (aristotelismo cristão)']::text[], array['50%', '33%']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Português e Linguagens
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Português e Linguagens') then
    insert into public.materias(nome, area) values ('Português e Linguagens', 'linguagens') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Interpretação de texto e gêneros textuais', '51% da prova de Linguagens') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Interpretação de texto', 'Fontes jornalísticas (Folha, Estadão, Veja, Época)', 'Campanhas de interesse coletivo', 'Charges, cartuns e tirinhas', 'Texto científico x divulgação científica']::text[], array['', '30% dos gêneros da prova', '9%', '3%', '2%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Elementos da comunicação e funções da linguagem', '11% da prova de Linguagens') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Funções da linguagem', 'Elementos da comunicação']::text[], array['média de 2 questões por prova', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Coesão textual', '7,7% da prova de Linguagens') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Conjunções e pronomes relativos', 'Efeitos temporais dos usos verbais', 'Neologismos e formação de palavras', 'Ambiguidade e polissemia']::text[], array['38%', '28%', '22%', '10%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Figuras de linguagem e texto poético', '2,8% da prova de Linguagens') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Figuras de linguagem', 'Métrica (sonetos decassilábicos, versilibrismo)']::text[], array['54%', '46%']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Variação linguística', '2,5% da prova de Linguagens') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Variação diafásica (linguagem e contexto)', 'Coloquialidade x norma culta']::text[], array['55%', '45%']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Literatura
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Literatura') then
    insert into public.materias(nome, area) values ('Literatura', 'linguagens') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Modernismo', 'o tema dominante da Literatura no ENEM') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Modernismo e a relação do leitor com o texto artístico', 'Tropicália e Poesia Marginal (Caetano, Gil, Cacaso, Leminski)', 'Pré-Modernismo (Policarpo Quaresma, Os Sertões)', 'Prosa contista (Guimarães Rosa)']::text[], array['a maior fatia isolada da matéria', '', '', 'autor mais cobrado nos últimos anos']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Realismo', '~11% da Literatura') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Machado de Assis (Memórias Póstumas, Quincas Borba)', 'Cientificismo do Realismo']::text[], array['64% das questões do período', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Romantismo', '') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Poesia romântica (Castro Alves, Gonçalves Dias)', 'Romance romântico (José de Alencar)']::text[], array['', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Barroco', '') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Gregório de Matos']::text[], array['nome predominante do período']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Literatura Contemporânea', '') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Conceição Evaristo e autores recentes', 'Clarice Lispector cronista']::text[], array['', '']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Literatura Portuguesa', '') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Camões']::text[], array['presença pontual (ex.: 2025)']::text[]) as x(t, r);
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Interpretação literária', '') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Postura dos narradores (1ª x 3ª pessoa)']::text[], array['']::text[]) as x(t, r);
  end if;
end $$;

-- ==================================================================
-- Redação
-- ==================================================================
do $$
declare v_mat uuid; v_mod uuid;
begin
  if not exists (select 1 from public.materias where nome = 'Redação') then
    insert into public.materias(nome, area) values ('Redação', 'redacao') returning id into v_mat;
    insert into public.modulos(materia_id, nome, descricao) values (v_mat, 'Temas recorrentes', 'eixos temáticos que mais aparecem na prova') returning id into v_mod;
    insert into public.aulas(modulo_id, titulo, resumo)
    select v_mod, t, r from unnest(array['Questões sociais', 'Meio ambiente', 'Tecnologia e sociedade', 'Cidadania e direitos humanos']::text[], array['', '', '', '']::text[]) as x(t, r);
  end if;
end $$;
