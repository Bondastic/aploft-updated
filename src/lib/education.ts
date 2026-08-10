// Uddannelses-profil: STX (rød) og HHX (blå).
//
// Alle farveklasser er statiske fulde klassenavne, så Tailwinds JIT kan finde
// dem. Brug temaet herfra i stedet for at hardcode rød/blå rundt omkring —
// så holder vi farveprofilen ens i hele appen.
import type { Education } from "../types";

export interface EducationTheme {
  id: Education;
  label: string; // "STX"
  fullName: string; // "STX — Almen studentereksamen"
  shortName: string; // "Det almene gymnasium"
  tagline: string;
  mascotLine: string;
  // --- Tailwind-klasser ---
  accentText: string; // aktiv tekst/faner
  accentChip: string; // badge/chip (bg + tekst)
  solidBg: string; // solid knap
  gradient: string; // hero-gradient (from-... to-...)
  softBg: string; // blød ikon-felt (bg + tekst)
  ring: string; // ring ved valg
  bar: string; // fremdriftslinje
  borderActive: string; // aktiv kant (border-...)
  darkChip: string; // chip i dark mode
}

export const EDU_THEMES: Record<Education, EducationTheme> = {
  stx: {
    id: "stx",
    label: "STX",
    fullName: "STX — Almen studentereksamen",
    shortName: "Det almene gymnasium",
    tagline: "Dansk, fremmedsprog og latin. Bredt og bogligt.",
    mascotLine: "På STX dykker vi ned i grammatik, latin og sproghistorie.",
    accentText: "text-red-600",
    accentChip: "bg-red-100 text-red-700",
    solidBg: "bg-red-600",
    gradient: "from-red-500 to-rose-600",
    softBg: "bg-red-100 text-red-600",
    ring: "ring-red-400",
    bar: "bg-red-500",
    borderActive: "border-red-500",
    darkChip: "dark:bg-red-500/15 dark:text-red-300",
  },
  hhx: {
    id: "hhx",
    label: "HHX",
    fullName: "HHX — Merkantil studentereksamen",
    shortName: "Det merkantile gymnasium",
    tagline: "Kommunikation, erhvervssprog og international handel.",
    mascotLine: "På HHX arbejder vi med kommunikation, erhvervssprog og betydning.",
    accentText: "text-blue-600",
    accentChip: "bg-blue-100 text-blue-700",
    solidBg: "bg-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    softBg: "bg-blue-100 text-blue-600",
    ring: "ring-blue-400",
    bar: "bg-blue-500",
    borderActive: "border-blue-500",
    darkChip: "dark:bg-blue-500/15 dark:text-blue-300",
  },
};

export function getEducation(id: Education): EducationTheme {
  return EDU_THEMES[id];
}
