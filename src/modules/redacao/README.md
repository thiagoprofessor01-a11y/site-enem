# Módulo: Redação — **Time C**

Aulas de redação, banco de temas, editor de texto e estrutura de feedback pelas
5 competências. Páginas: `src/app/redacao` e `src/app/redacao/escrever/[temaId]`.

## Sugestão de organização
```
redacao/
├── components/     # editor com contador de linhas, cards de tema, aulas
├── actions.js      # salvar redação, registrar feedback/nota
├── competencias.js # definição das 5 competências (0-200 cada)
└── README.md
```

## Tabelas usadas
`temas_redacao`, `redacoes_aluno`

## Pontos-chave
- Aulas: estrutura dissertativa-argumentativa, 5 competências, erros comuns.
- Editor com contador de linhas/palavras (limite de 30 linhas).
- Feedback estruturado por competência (nota 0-200 em `redacoes_aluno.nota`),
  preenchido manualmente por corretor; deixar pronto para correção via IA.
