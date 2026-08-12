/**
 * Curriculum boundary – the only public gateway to educational content.
 *
 * Source files may use short authoring ids (for example `ordklasser`). They
 * never leave this module without an education prefix. This means that an
 * identical authoring id in STX and HHX is still two different domain objects.
 */
import type { CategoryDef, CategoryId, Education, Task, Track } from "../types";
import { ALMEN_CATEGORIES, HHX_CATEGORIES, LATIN_CATEGORIES } from "../data/categories";
import { ALMEN_TASKS } from "../data/questions";
import { LATIN_TASKS } from "../data/latinQuestions";
import { HHX_TASKS } from "../data/hhxQuestions";

export type ScopedId = `${Education}:${string}`;
export const scopedId = (education: Education, localId: string): ScopedId => `${education}:${localId}`;

export function categoriesForEducation(education: Education): CategoryDef[] {
  return education === "hhx" ? HHX_CATEGORIES : [...ALMEN_CATEGORIES, ...LATIN_CATEGORIES];
}

export function categoriesForTrack(education: Education, track: Track): CategoryDef[] {
  if (education === "hhx") return track === "hhx" ? HHX_CATEGORIES : [];
  if (track === "almen") return ALMEN_CATEGORIES;
  return track === "latin" ? LATIN_CATEGORIES : [];
}

export function categoryForEducation(education: Education, id: string): CategoryDef | undefined {
  return categoriesForEducation(education).find((category) => category.id === id);
}

export function isCategoryAllowed(education: Education, id: string): id is CategoryId {
  return !!categoryForEducation(education, id);
}

function sourceTasks(education: Education): Task[] {
  return education === "hhx" ? HHX_TASKS : [...ALMEN_TASKS, ...LATIN_TASKS];
}

/** Returns immutable domain copies with globally unique task identities. */
export function tasksForEducation(education: Education): Task[] {
  return sourceTasks(education).map((task) => ({ ...task, id: scopedId(education, task.id) }));
}

export function tasksForTrack(education: Education, track: Track): Task[] {
  if (education === "hhx") return track === "hhx" ? tasksForEducation("hhx") : [];
  if (track === "almen") return tasksForEducation("stx").filter((task) => ALMEN_CATEGORIES.some((c) => c.id === task.category));
  if (track === "latin") return tasksForEducation("stx").filter((task) => LATIN_CATEGORIES.some((c) => c.id === task.category));
  return [];
}

/** Fails closed instead of ever returning another education's task. */
export function taskForEducation(education: Education, id: string): Task | undefined {
  return tasksForEducation(education).find((task) => task.id === id);
}
