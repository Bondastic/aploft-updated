import { ALMEN_TASKS } from "../data/questions";
import { LATIN_TASKS } from "../data/latinQuestions";
import type { Task, Track } from "../types";

export type ExamTrack = Track | "fuld" | "ultimativ";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ALL_TASKS: Task[] = [...ALMEN_TASKS, ...LATIN_TASKS];

export function poolForTrack(track: ExamTrack): Task[] {
  if (track === "almen") return ALMEN_TASKS;
  if (track === "latin") return LATIN_TASKS;
  // "fuld" og "ultimativ" trækker begge fra hele puljen.
  return ALL_TASKS;
}

// Vælger `count` opgaver, spreder på tværs af kategorier og undgår gentagelser,
// så vidt puljen tillader det.
export function generateExam(track: ExamTrack, count: number): Task[] {
  const pool = poolForTrack(track);
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
