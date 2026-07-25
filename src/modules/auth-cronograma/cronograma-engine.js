// Motor de montagem do plano de estudos.
//
// Regras (definidas com o professor):
//  - Cada aula (vídeo + questões) leva ~1h20 (80 minutos).
//  - Total de minutos = dias de estudo até o ENEM × horas por dia × 60.
//  - Nº de aulas possíveis = total de minutos ÷ 80.
//  - Esse total é dividido pelas 5 áreas de conhecimento (1/5 cada).
//  - Áreas com 1 matéria (Matemática, Redação) concentram tudo nela.
//  - Áreas com várias matérias dividem o tempo da área pelo nº de matérias.
//  - Dentro da matéria, as aulas são priorizadas por importância:
//    módulo mais importante primeiro e, dentro dele, aula mais importante
//    (o "nível" 1..5 = frequência com que cai no ENEM).

import { diasDeEstudo, hojeISO } from "./cronograma-storage";

export const MINUTOS_POR_AULA = 80; // 1h20

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
export function montarAgenda(config, db) {
  const plano = montarPlano(config, db);

  // Filas por matéria (mantendo a ordem de prioridade dentro de cada uma).
  const filas = [];
  plano.areas.forEach((area) =>
    area.materias.forEach((mp) => {
      if (mp.selecionadas.length) {
        filas.push({ materia: mp.materia, areaNome: area.nome, aulas: [...mp.selecionadas] });
      }
    })
  );

  // Round-robin: uma aula de cada matéria por vez → intercala as áreas.
  const ordem = [];
  let algo = true;
  while (algo) {
    algo = false;
    for (const f of filas) {
      if (f.aulas.length) {
        const a = f.aulas.shift();
        ordem.push({
          ...a,
          materiaId: f.materia.id,
          materiaNome: f.materia.nome,
          areaNome: f.areaNome,
        });
        algo = true;
      }
    }
  }

  const aulasPorDia = Math.max(
    1,
    Math.floor((Number(config.horasPorDia) || 1) * 60 / MINUTOS_POR_AULA)
  );

  const dias = [];
  const inicio = new Date((config.dataCriacao || isoLocal(new Date())) + "T00:00:00");
  const fim = new Date(config.dataEnem + "T00:00:00");
  const setDias = new Set(config.diasSemana);
  const cursor = new Date(inicio);
  let idx = 0;
  let guard = 0;
  while (idx < ordem.length && cursor <= fim && guard < 3000) {
    if (setDias.has(cursor.getDay())) {
      const doDia = ordem.slice(idx, idx + aulasPorDia);
      idx += doDia.length;
      dias.push({ data: isoLocal(cursor), aulas: doDia });
    }
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }

  return { plano, dias, aulasPorDia, totalAgendadas: idx };
}
