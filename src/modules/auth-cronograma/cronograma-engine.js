// Motor de montagem do plano de estudos.
//
// Regras (definidas com o professor):
//  - Cada aula (vídeo + questões) leva ~1 hora.
//  - Nº de aulas por dia = horas por dia (2h → 2 aulas, 3h → 3 aulas...).
//  - Total de aulas possíveis = total de horas até o ENEM.
//  - Esse total é dividido pelas 5 áreas de conhecimento (1/5 cada).
//  - Áreas com 1 matéria (Matemática, Redação) concentram tudo nela.
//  - Áreas com várias matérias dividem o tempo da área pelo nº de matérias.
//  - Dentro da matéria, as aulas são priorizadas por importância:
//    módulo mais importante primeiro e, dentro dele, aula mais importante
//    (o "nível" 1..5 = frequência com que cai no ENEM).
//  - Um dia nunca repete a mesma matéria: as aulas do dia são de matérias
//    diferentes.

import { diasDeEstudo, hojeISO } from "./cronograma-storage";

export const MINUTOS_POR_AULA = 60; // 1 hora por aula

export const AREAS_PLANO = [
  { slug: "matematica", nome: "Matemática" },
  { slug: "natureza", nome: "Ciências da Natureza" },
  { slug: "humanas", nome: "Ciências Humanas" },
  { slug: "linguagens", nome: "Linguagens e Códigos" },
  { slug: "redacao", nome: "Redação" },
];

// Ordena as aulas de uma matéria por importância (módulo e aula).
function aulasPriorizadas(db, materiaId) {
  const modulos = db.modulos.filter((m) => m.materiaId === materiaId);
  const modById = Object.fromEntries(modulos.map((m) => [m.id, m]));
  return db.aulas
    .filter((a) => modById[a.moduloId])
    .map((a) => ({
      ...a,
      modNome: modById[a.moduloId].nome,
      modNivel: modById[a.moduloId].nivel ?? 3,
    }))
    .sort(
      (a, b) =>
        (b.modNivel ?? 3) - (a.modNivel ?? 3) ||
        (b.nivel ?? 3) - (a.nivel ?? 3)
    );
}

/**
 * Monta o plano a partir da configuração do aluno e do conteúdo cadastrado.
 * @param {{horasPorDia:number, diasSemana:number[], dataEnem:string}} config
 * @param {object} db  conteúdo (materias, modulos, aulas...) vindo do fetchAll
 */
export function montarPlano(config, db) {
  const hoje = hojeISO();
  const diasEstudo = diasDeEstudo(hoje, config.dataEnem, config.diasSemana);
  const totalMinutos = diasEstudo * Number(config.horasPorDia || 0) * 60;
  const totalAulas = Math.floor(totalMinutos / MINUTOS_POR_AULA);
  const aulasPorArea = totalAulas / 5;

  const areas = AREAS_PLANO.map((area) => {
    const materias = db.materias.filter((m) => m.area === area.slug);
    const aulasPorMateria = materias.length ? aulasPorArea / materias.length : 0;

    const materiasPlano = materias.map((mat) => {
      const disponiveis = aulasPriorizadas(db, mat.id);
      const cota = Math.round(aulasPorMateria);
      return {
        materia: mat,
        cota,
        selecionadas: disponiveis.slice(0, cota),
        totalDisponivel: disponiveis.length,
      };
    });

    const totalSelecionadas = materiasPlano.reduce(
      (s, m) => s + m.selecionadas.length,
      0
    );

    return {
      ...area,
      cota: Math.round(aulasPorArea),
      materias: materiasPlano,
      totalSelecionadas,
    };
  });

  const totalPlanejadas = areas.reduce((s, a) => s + a.totalSelecionadas, 0);

  return {
    diasEstudo,
    totalMinutos,
    totalHoras: Math.round(totalMinutos / 60),
    totalAulas,
    aulasPorArea,
    minutosPorAula: MINUTOS_POR_AULA,
    areas,
    totalPlanejadas,
  };
}

function isoLocal(d) {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/**
 * Distribui as aulas do plano dia a dia (a partir da data de criação), em
 * ordem intercalada entre as matérias (para variar as áreas ao longo do dia).
 * Retorna a lista de dias de estudo, cada um com as aulas daquele dia.
 */
export function montarAgenda(config, db, concluidas = []) {
  const plano = montarPlano(config, db);
  const feitas = new Set(concluidas);

  // Filas por matéria (prioridade mantida), EXCLUINDO aulas já concluídas.
  const filas = [];
  plano.areas.forEach((area) =>
    area.materias.forEach((mp) => {
      const pendentes = mp.selecionadas.filter((a) => !feitas.has(a.id));
      if (pendentes.length) {
        filas.push({
          materia: mp.materia,
          areaNome: area.nome,
          areaSlug: area.slug,
          aulas: [...pendentes],
        });
      }
    })
  );

  // Aulas por dia = horas por dia (cada aula ≈ 1 hora).
  const aulasPorDia = Math.max(
    1,
    Math.round((Number(config.horasPorDia) || 1) * 60 / MINUTOS_POR_AULA)
  );

  const restante = () => filas.reduce((s, f) => s + f.aulas.length, 0);

  const dias = [];
  // A agenda começa HOJE e mostra o que ainda falta (concluídas já saíram).
  const inicio = new Date(isoLocal(new Date()) + "T00:00:00");
  const fim = new Date(config.dataEnem + "T00:00:00");
  const setDias = new Set(config.diasSemana);
  const cursor = new Date(inicio);
  let rot = 0; // rotação: muda a matéria que "abre" o dia
  let totalAgendadas = 0;
  let guard = 0;

  while (restante() > 0 && cursor <= fim && guard < 4000) {
    if (setDias.has(cursor.getDay())) {
      const doDia = [];
      // Uma passada pelas matérias (a partir de `rot`): no máximo 1 aula por
      // matéria → nunca repete matéria no mesmo dia.
      for (let step = 0; step < filas.length && doDia.length < aulasPorDia; step++) {
        const f = filas[(rot + step) % filas.length];
        if (f.aulas.length) {
          const a = f.aulas.shift();
          doDia.push({
            ...a,
            materiaId: f.materia.id,
            materiaNome: f.materia.nome,
            areaNome: f.areaNome,
            areaSlug: f.areaSlug,
          });
        }
      }
      if (doDia.length) {
        dias.push({ data: isoLocal(cursor), aulas: doDia });
        totalAgendadas += doDia.length;
        rot = (rot + 1) % filas.length; // alterna quem abre o próximo dia
      }
    }
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }

  return { plano, dias, aulasPorDia, totalAgendadas };
}
