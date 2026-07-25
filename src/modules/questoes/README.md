# Módulo: Banco de Questões — **Time B**

Lógica de CRUD de questões, filtros, modo treino, modo simulado e estatísticas
de desempenho. Páginas: `src/app/questoes` e `src/app/questoes/simulado`.

## Sugestão de organização
```
questoes/
├── components/     # cartão de questão, filtros, cronômetro do simulado
├── actions.js      # salvar respostas, CRUD de questões
├── importar.js     # importação em lote (CSV/JSON)
├── estatisticas.js # % de acerto por matéria/tópico (para o dashboard)
└── README.md
```

## Tabelas usadas
`questoes`, `respostas_aluno`, `materias`, `topicos`

## Pontos-chave
- Filtros: matéria, tópico, ano, dificuldade.
- Treino livre: gabarito comentado após responder.
- Simulado: cronômetro, resultado só ao final.
- Importação em lote de questões do INEP (domínio público) via CSV/JSON.
