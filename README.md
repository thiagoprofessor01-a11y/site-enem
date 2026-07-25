# MeuENEM — Site de Estudos para o ENEM

Plataforma web para ajudar estudantes a se prepararem para o ENEM. Construída
para uma equipe de 4 desenvolvedores trabalhando **em paralelo**, com o código
organizado **por módulo/feature** para minimizar conflitos.

> 👉 **Quer publicar o site e conectar ao banco de dados?** Siga o guia passo a
> passo em **[COMECAR.md](./COMECAR.md)** (não precisa instalar nada).

> O nome do site é definido em um único lugar: `src/lib/config.js` (`SITE.nome`).

## Stack

- **Next.js 14** (App Router) + **React** + **JavaScript**
- **Tailwind CSS**
- **Supabase** (Postgres + Auth)
- Deploy na **Vercel**

## Rodando localmente

Pré-requisitos: **Node.js 18+**.

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# edite .env.local com a URL e a anon key do seu projeto Supabase

# 3. Rodar em desenvolvimento
npm run dev
# abre em http://localhost:3000
```

### Configurando o banco (Supabase)

1. Crie um projeto grátis em <https://supabase.com>.
2. No **SQL Editor**, execute `supabase/schema.sql` (cria as tabelas, RLS e o
   trigger que popula `usuarios` no cadastro).
3. (Opcional) Execute `supabase/seed.sql` para popular matérias e alguns tópicos.
4. Em **Project Settings > API**, copie `URL` e `anon key` para o `.env.local`.

## Estrutura do projeto (organizada por time)

```
src/
├── app/                          # rotas (App Router) — telas finas que importam dos módulos
│   ├── page.js                   # / (home/dashboard)        → Time D
│   ├── cadastro/                 # /cadastro                 → Time A
│   ├── cronograma/               # /cronograma               → Time A
│   ├── perfil/                   # /perfil                   → Time A
│   ├── questoes/                 # /questoes, /questoes/simulado → Time B
│   ├── redacao/                  # /redacao, /redacao/escrever/[temaId] → Time C
│   └── conteudos/                # /conteudos, /conteudos/[topicoId] → Time D
├── modules/                      # lógica de cada módulo (cada time trabalha no seu)
│   ├── auth-cronograma/          # Time A
│   ├── questoes/                 # Time B
│   ├── redacao/                  # Time C
│   └── conteudos-dashboard/      # Time D
├── components/                   # componentes compartilhados (Navbar, etc.)
└── lib/
    ├── config.js                 # nome do site, áreas do ENEM
    └── supabase/                 # clientes Supabase (browser, server, middleware)

supabase/
├── schema.sql                    # tabelas + RLS + trigger
└── seed.sql                      # matérias e tópicos iniciais
```

## Divisão de trabalho

| Time | Responsável por | Onde trabalhar |
|------|-----------------|----------------|
| **A** | Cadastro, login, perfil, motor do cronograma | `src/modules/auth-cronograma/` + páginas `cadastro`, `cronograma`, `perfil` |
| **B** | Banco de questões, filtros, simulado, estatísticas | `src/modules/questoes/` + páginas `questoes`, `questoes/simulado` |
| **C** | Aulas de redação, banco de temas, editor, feedback | `src/modules/redacao/` + páginas `redacao`, `redacao/escrever/[temaId]` |
| **D** | Conteúdos por matéria, YouTube, dashboard/home | `src/modules/conteudos-dashboard/` + páginas `conteudos`, `conteudos/[topicoId]`, home |

**Regra para evitar conflitos:** mantenha as páginas em `src/app/` finas
(apenas importam e montam) e coloque a lógica dentro do seu módulo em
`src/modules/`. Cada `README.md` de módulo detalha o que implementar.

## Deploy na Vercel

1. Suba o repositório no GitHub.
2. Em <https://vercel.com>, importe o repositório (detecta Next.js automaticamente).
3. Adicione as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy. Cada push no Git gera um novo deploy.

## Modelo de dados

Ver `supabase/schema.sql`. Entidades principais: `usuarios`, `materias`,
`topicos`, `cronograma_itens`, `questoes`, `respostas_aluno`, `temas_redacao`,
`redacoes_aluno`, `conteudo_videos`.
