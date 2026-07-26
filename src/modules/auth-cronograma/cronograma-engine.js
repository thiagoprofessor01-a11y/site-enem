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
 * Distribui as aulas do plano dia a dia (a partir de hoje).
 *
 * Regras:
 *  - Nº de aulas por dia = horas por dia (cada aula = 1 hora → 3h = 3 aulas).
 *  - Nunca repete a mesma matéria no mesmo dia.
 *  - As matérias de um dia são, sempre que possível, DIFERENTES das do dia
 *    anterior (assim o aluno não vê "biologia" dois dias seguidos).
 *
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
          materiaId: mp.materia.id,
          materiaNome: mp.materia.nome,
          areaNome: area.nome,
          areaSlug: area.slug,
          aulas: [...pendentes],
        });
      }
    })
  );

  // Aulas por dia = horas por dia (cada aula = 1 hora).
  const aulasPorDia = Math.max(1, Math.round(Number(config.horasPorDia) || 1));

  const restante = () => filas.reduce((s, f) => s + f.aulas.length, 0);

  const dias = [];
  // A agenda começa HOJE e mostra o que ainda falta (concluídas já saíram).
  const inicio = new Date(isoLocal(new Date()) + "T00:00:00");
  const fim = new Date(config.dataEnem + "T00:00:00");
  const setDias = new Set(config.diasSemana);
  const cursor = new Date(inicio);
  let ontem = new Set(); // matérias usadas no dia anterior
  let inicioRot = 0; // rotação: varia qual matéria "abre" o dia
  let totalAgendadas = 0;
  let guard = 0;

  while (restante() > 0 && cursor <= fim && guard < 4000) {
    guard++;
    if (!setDias.has(cursor.getDay())) {
      cursor.setDate(cursor.getDate() + 1);
      continue;
    }

    const doDia = [];
    const usadasHoje = new Set();

    // Candidatas do dia = matérias com aula pendente, em ordem rotacionada.
    const comAulas = filas.filter((f) => f.aulas.length);
    const n = comAulas.length;
    const ordenadas = [];
    for (let i = 0; i < n; i++) ordenadas.push(comAulas[(inicioRot + i) % n]);

    const pegar = (f) => {
      const a = f.aulas.shift();
      usadasHoje.add(f.materiaId);
      doDia.push({
        ...a,
        materiaId: f.materiaId,
        materiaNome: f.materiaNome,
        areaNome: f.areaNome,
        areaSlug: f.areaSlug,
      });
    };

    // 1ª passada: só matérias que NÃO apareceram ontem (dias seguidos variados).
    for (const f of ordenadas) {
      if (doDia.length >= aulasPorDia) break;
      if (usadasHoje.has(f.materiaId) || ontem.has(f.materiaId)) continue;
      pegar(f);
    }
    // 2ª passada: se o dia não encheu, libera repetir matéria de ontem — mas
    // nunca a mesma matéria duas vezes no mesmo dia.
    for (const f of ordenadas) {
      if (doDia.length >= aulasPorDia) break;
      if (usadasHoje.has(f.materiaId)) continue;
      pegar(f);
    }

    if (doDia.length) {
      dias.push({ data: isoLocal(cursor), aulas: doDia });
      totalAgendadas += doDia.length;
      ontem = usadasHoje;
      inicioRot = n ? (inicioRot + aulasPorDia) % n : 0;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return { plano, dias, aulasPorDia, totalAgendadas };
}
