import { ALMEN_TASKS } from "../data/questions";
import { LATIN_TASKS } from "../data/latinQuestions";
import { HHX_TASKS } from "../data/hhxQuestions";
import type { Education, Task, Track } from "../types";
import { isContentTask } from "../types";

export type ExamTrack = Track | "fuld" | "ultimativ";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// STX-banken: almen del + latindel.
export const ALL_TASKS: Task[] = [...ALMEN_TASKS, ...LATIN_TASKS];
// HHX-banken: fælles grammatik + HHX-emnerne.
export const ALL_HHX_TASKS: Task[] = HHX_TASKS;

export function poolForTrack(track: ExamTrack, education: Education = "stx"): Task[] {
  let pool: Task[];
  if (track === "almen") pool = ALMEN_TASKS;
  else if (track === "latin") pool = LATIN_TASKS;
  else if (track === "hhx") pool = HHX_TASKS;
  // "fuld" og "ultimativ" trækker fra hele puljen for den valgte uddannelse.
  else pool = education === "hhx" ? HHX_TASKS : ALL_TASKS;
  // Prøver skal aldrig indeholde rene undervisningstrin.
  return pool.filter((t) => !isContentTask(t));
}

// Vælger `count` opgaver, spreder på tværs af kategorier og undgår gentagelser,
// så vidt puljen tillader det.
export function generateExam(track: ExamTrack, count: number, education: Education = "stx"): Task[] {
  const pool = poolForTrack(track, education);
  const shuffled = shuffle(pool);

  if (count >= shuffled.length) return shuffled;

  // Prøv at fordele jævnt hen over kategorier ved round-robin
  const byCategory = new Map<string, Task[]>();
  for (const t of shuffled) {
    const list = byCategory.get(t.category) ?? [];
    list.push(t);
    byCategory.set(t.category, list);
  }
  const categories = shuffle([...byCategory.keys()]);
  const result: Task[] = [];
  let idx = 0;
  while (result.length < count) {
    const cat = categories[idx % categories.length];
    const list = byCategory.get(cat)!;
    if (list.length > 0) {
      result.push(list.shift()!);
    }
    idx++;
    if (idx > 20000) break; // safety
  }
  return shuffle(result).slice(0, count);
}

export const AVG_SECONDS_PER_QUESTION = 40;

export function estimateMinutes(count: number): number {
  return Math.max(1, Math.round((count * AVG_SECONDS_PER_QUESTION) / 60));
}
