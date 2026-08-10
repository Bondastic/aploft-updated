// "Forløbs-stier" (learning paths) pr. kategori.
//
// Hver kategori vises som en række af navngivne trin i en meningsfuld
// rækkefølge (nemmest/mest grundlæggende først, sværere sidst), efterfulgt
// af en opsamlingstest, der trækker bredt fra hele kategoriens spørgsmåls-
// bank. Trin 2+ er låst, indtil det foregående trin er bestået (se
// LESSON_PASS_THRESHOLD i lib/progress.ts).
import type { CategoryId, Education, Task } from "../types";
import { ALMEN_TASKS } from "./questions";
import { LATIN_TASKS } from "./latinQuestions";
import { HHX_TASKS } from "./hhxQuestions";
import { CATEGORY_INTRO } from "./teaching";
import { HHX_CATEGORY_INTRO } from "./hhx/teaching";

const INTRO_TASKS: Task[] = Object.values(CATEGORY_INTRO).flat();
const INTRO_ID_SET = new Set(INTRO_TASKS.map((t) => t.id));

const HHX_INTRO_TASKS: Task[] = Object.values(HHX_CATEGORY_INTRO).flat();
const HHX_INTRO_ID_SET = new Set(HHX_INTRO_TASKS.map((t) => t.id));

// STX: almen del + latindel (plus introduktionstrin).
export const ALL_PATH_TASKS: Task[] = [...INTRO_TASKS, ...ALMEN_TASKS, ...LATIN_TASKS];
// HHX: fælles grammatik + HHX-emner (plus HHX-introduktionstrin).
export const ALL_HHX_PATH_TASKS: Task[] = [...HHX_INTRO_TASKS, ...HHX_TASKS];

export interface LessonNode {
  id: string;
  categoryId: CategoryId;
  title: string;
  order: number;
  kind: "lesson" | "review";
  taskIds?: string[];
  sampleSize?: number;
}

export interface CategoryPath {
  categoryId: CategoryId;
  nodes: LessonNode[];
}

// Titler for de faste forløbstrin pr. kategori (rækkefølgen matcher, hvordan
// spørgsmålsbanken allerede er skrevet: fra grundlæggende til mere nuanceret).
// Sidste trin ("Opsamlingstest") tilføjes altid automatisk.
const CATEGORY_LESSON_TITLES: Record<CategoryId, string[]> = {
  // Almen sprogforståelse
  kasus: ["Kasus: Hvad er kasus?", "Kasus: Nominativ & akkusativ", "Kasus: Dativ & genitiv", "Kasus: Sværere blandet træning"],
  ordklasser: [
    "Ordklasser: De fire kerneordklasser",
    "Ordklasser: Adjektiv, adverbium & præposition",
    "Ordklasser: Pronominer, talord & konjunktioner",
    "Ordklasser: Sværere blandet træning",
  ],
  saetningsled: [
    "Sætningsled: Grundled & udsagnsled",
    "Sætningsled: Genstandsled & hensynsled",
    "Sætningsled: Adverbial & prædikater",
    "Sætningsled: Sværere blandet analyse",
  ],
  tempus: [
    "Tempus: Nutid & datid",
    "Tempus: Førnutid & førdatid",
    "Tempus: Fremtid & latinske tider",
    "Tempus: Sværere blandet træning",
  ],
  morfologi: ["Morfologi: Morfemer & bøjning", "Morfologi: Afledning & sammensætning", "Morfologi: Sværere blandet træning"],
  syntaks: [
    "Syntaks: Ledsætninger & komma",
    "Syntaks: Ledsætninger som sætningsled",
    "Syntaks: Ordstilling & engelsk syntaks",
    "Syntaks: Sværere blandet træning",
  ],
  sprog: ["Sprog: Sprogfamilier", "Sprog: Sprogtypologi", "Sprog: Kommunikationsmodellen"],
  // HHX-emner
  kommunikation: [
    "Kommunikation: Modellen fra bunden",
    "Kommunikation: Verbal & non-verbal",
    "Kommunikation: Det udvidede tekstbegreb",
    "Kommunikation: Sværere blandet træning",
  ],
  sproghandlinger: [
    "Sproghandlinger: Hvad er en sproghandling?",
    "Sproghandlinger: Direkte & indirekte",
    "Sproghandlinger: I erhvervstekster",
    "Sproghandlinger: Sværere blandet træning",
  ],
  semantik: [
    "Semantik: Udtryk & indhold",
    "Semantik: Synonymer, homonymer & polysemi",
    "Semantik: Metafor & konnotation",
    "Semantik: Sværere blandet træning",
  ],
  pragmatik: [
    "Pragmatik: Sprog i brug",
    "Pragmatik: Underforstået betydning",
    "Pragmatik: Private, faglige & professionelle sammenhænge",
    "Pragmatik: Sværere blandet træning",
  ],
  genrer: [
    "Genrer: Hvad er en genre?",
    "Genrer: Erhvervsgenrer",
    "Genrer: Mediebevidst formidling",
    "Genrer: Sværere blandet træning",
  ],
  sproghistorie: [
    "Sproghistorie: Sprogfamilier",
    "Sproghistorie: Lånord & anglicismer",
    "Sproghistorie: Sprog i en globaliseret verden",
    "Sproghistorie: Sværere blandet træning",
  ],
  laeringsstrategier: [
    "Strategier: Lær sprog klogt",
    "Strategier: Transfer & mønstre",
    "Strategier: Gloser & kontekstgætning",
    "Strategier: Sværere blandet træning",
  ],
  // Latindel
  sumesse: [
    "Sum-forløb: Hvad betyder 'sum'?",
    "Sum-forløb: Ental (jeg / du / han-hun-den)",
    "Sum-forløb: Flertal (vi / I / de)",
    "Sum-forløb: Byg hele tabellen selv",
    "Sum-forløb: Datid (eram, eras, erat...)",
    "Sum-forløb: Endelser-huskereglen (o/m-s-t-mus-tis-nt)",
  ],
  ordforraad: [
    "Ordforråd: Latinske rødder i dansk",
    "Ordforråd: Latinske rødder i engelsk",
    "Ordforråd: Låneord & fagudtryk",
    "Ordforråd: Sværere blandet træning",
  ],
  grammatik: [
    "Grammatik: Deklinationer & kasus",
    "Grammatik: Verbernes bøjning",
    "Grammatik: Sætningsbygning",
    "Grammatik: Sværere blandet træning",
  ],
  oversaettelse: ["Oversættelse: Enkle sætninger", "Oversættelse: Sætninger med flere led", "Oversættelse: Sværere sætninger"],
  kultur: ["Kultur: Romerriget & samfund", "Kultur: Hverdagsliv i Rom", "Kultur: Arven fra antikken"],
};

function chunkEvenly<T>(arr: T[], parts: number): T[][] {
  if (parts <= 0) return [arr];
  const result: T[][] = [];
  const base = Math.floor(arr.length / parts);
  const rem = arr.length % parts;
  let idx = 0;
  for (let i = 0; i < parts; i++) {
    const size = base + (i < rem ? 1 : 0);
    result.push(arr.slice(idx, idx + size));
    idx += size;
  }
  return result;
}

const pathCache = new Map<string, CategoryPath>();

export function getCategoryPath(categoryId: CategoryId, education: Education = "stx"): CategoryPath {
  const cacheKey = `${education}:${categoryId}`;
  const cached = pathCache.get(cacheKey);
  if (cached) return cached;

  const isHhx = education === "hhx";
  const pool = isHhx ? ALL_HHX_PATH_TASKS : ALL_PATH_TASKS;
  const introIdSet = isHhx ? HHX_INTRO_ID_SET : INTRO_ID_SET;
  const introMap = isHhx ? HHX_CATEGORY_INTRO : CATEGORY_INTRO;

  // Rene quiz-opgaver til kategorien (den gamle spørgsmålsbank).
  const tasks = pool.filter((t) => t.category === categoryId && !introIdSet.has(t.id));
  const titles = CATEGORY_LESSON_TITLES[categoryId] ?? ["Forløb 1"];
  const chunks = chunkEvenly(tasks, titles.length);

  const nodes: LessonNode[] = chunks.map((chunkTasks, i) => ({
    id: `${categoryId}__lesson-${i + 1}`,
    categoryId,
    title: titles[i],
    order: i,
    kind: "lesson" as const,
    taskIds: chunkTasks.map((t) => t.id),
  }));

  // Introduktionstrin: undervisningstrin, der forklarer emnet fra bunden,
  // FØR eleven møder den almindelige spørgsmålsbank. Vises som kategoriens
  // allerførste trin i stien, altid i en fast, gennemtænkt rækkefølge.
  const introTasks = introMap[categoryId];
  if (introTasks && introTasks.length > 0) {
    nodes.unshift({
      id: `${categoryId}__intro`,
      categoryId,
      title: "Introduktion: fra bunden",
      order: -1,
      kind: "lesson",
      taskIds: introTasks.map((t) => t.id),
    });
    nodes.forEach((n, i) => {
      n.order = i;
    });
  }

  nodes.push({
    id: `${categoryId}__review`,
    categoryId,
    title: "Opsamlingstest",
    order: nodes.length,
    kind: "review",
    sampleSize: Math.min(20, tasks.length),
  });

  const path: CategoryPath = { categoryId, nodes };
  pathCache.set(cacheKey, path);
  return path;
}

export function getLessonTasks(node: LessonNode, education: Education = "stx"): Task[] {
  const isHhx = education === "hhx";
  const pool = isHhx ? ALL_HHX_PATH_TASKS : ALL_PATH_TASKS;
  if (node.kind === "lesson" && node.taskIds) {
    const byId = new Map(pool.map((t) => [t.id, t] as const));
    return node.taskIds.map((id) => byId.get(id)).filter((t): t is Task => !!t);
  }
  // Opsamlingstest: bland alle opgaver i kategorien og træk et tilfældigt udsnit.
  const categoryPool = pool.filter((t) => t.category === node.categoryId);
  const shuffled = [...categoryPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, node.sampleSize ?? categoryPool.length);
}
