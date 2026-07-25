# Módulo: Conteúdos + Dashboard — **Time D**

Conteúdos por matéria/tópico com vídeos do YouTube, página administrativa de
associação de vídeos e o dashboard/home. Páginas: `src/app/conteudos`,
`src/app/conteudos/[topicoId]` e `src/app/` (home).

## Sugestão de organização
```
conteudos-dashboard/
├── components/     # player YouTube (iframe), lista de tópicos, cards do dashboard
├── admin/          # tela para colar link/ID do YouTube e associar a um tópico
├── actions.js      # associar vídeo a tópico
└── README.md
```

## Tabelas usadas
`conteudo_videos`, `topicos`, `materias`, `cronograma_itens` (tarefa do dia),
`respostas_aluno` (progresso)

## Pontos-chave
- Player embutido do YouTube via iframe (não hospedar vídeos).
- Guardar apenas `youtube_video_id` do vídeo já publicado.
- Dashboard: contagem regressiva, tarefa do dia (Time A), progresso geral,
  sequência de dias e atalhos rápidos.
