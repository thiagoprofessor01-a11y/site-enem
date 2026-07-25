# Módulo: Auth + Cronograma — **Time A**

Coloque aqui toda a lógica de cadastro/login, perfil e do **motor de geração
de cronograma**. As páginas em `src/app/cadastro`, `src/app/cronograma` e
`src/app/perfil` devem importar componentes e funções deste módulo.

## Sugestão de organização
```
auth-cronograma/
├── components/     # formulários de cadastro, cards de cronograma, etc.
├── actions.js      # Server Actions (login, signup, salvar cronograma)
├── cronograma.js   # motor de geração/redistribuição do cronograma
└── README.md
```

## Tabelas usadas
`usuarios`, `materias`, `topicos`, `cronograma_itens`

## Motor de cronograma (resumo do que implementar)
1. Total de horas disponíveis até `data_enem` (via `horas_disponiveis`).
2. Distribuir tempo entre áreas por `peso_na_prova` (nº de questões por área).
3. Dentro da matéria, priorizar tópicos com maior `frequencia_historica`.
4. Aumentar peso das matérias marcadas em `materias_dificuldade`.
5. Gerar itens dia a dia deixando folga (não lotar 100% dos dias).
6. Botão "recalcular" redistribui o que falta pelo tempo restante.
