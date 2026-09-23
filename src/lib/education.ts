// Uddannelses-profil: STX (rød) og HHX (blå).
//
// Alle farveklasser er statiske fulde klassenavne, så Tailwinds JIT kan finde
// dem. Klasserne refererer til designsystemets faste skalaer (stx-*/hhx-*
// fra globals.css) — ikke Tailwinds standardpalet — så holder farveprofilerne
// sig rolige og ens i hele appen, i både lyst og mørkt tema.
import type { Education } from "../types";

export interface EducationTheme {
  id: Education;
  label: string; // "STX"
  fullName: string; // "STX: Almen studentereksamen"
  shortName: string; // "Det almene gymnasium"
  tagline: string;
  mascotLine: string;
  // --- Tailwind-klasser (designsystemets faste skalaer) ---
  accentText: string; // aktiv tekst/overskrifter i uddannelsens farve
  accentChip: string; // badge/chip (blød flade + tekst)
  solidBg: string; // solid, flad knap
  softBg: string; // blød flade til fx ikonfelter
  ring: string; // ring ved markering
  bar: string; // fremdriftslinje
  borderActive: string; // aktiv kant
}

export const EDU_THEMES: Record<Education, EducationTheme> = {
  stx: {
    id: "stx",
    label: "STX",
    fullName: "STX: Almen studentereksamen",
    shortName: "Det almene gymnasium",
    tagline: "Dansk, fremmedsprog og latin. Bredt og bogligt.",
    mascotLine: "På STX dykker vi ned i grammatik, latin og sproghistorie.",
    accentText: "text-stx-deep",
    accentChip: "bg-stx-soft text-stx-deep",
    solidBg: "bg-stx-base text-white",
    softBg: "bg-stx-soft text-stx-base",
    ring: "ring-stx-mid",
    bar: "bg-stx-base",
    borderActive: "border-stx-base",
  },
  hhx: {
    id: "hhx",
    label: "HHX",
    fullName: "HHX: Merkantil studentereksamen",
    shortName: "Det merkantile gymnasium",
    tagline: "Kommunikation, erhvervssprog og international handel.",
    mascotLine: "På HHX arbejder vi med kommunikation, erhvervssprog og betydning.",
    accentText: "text-hhx-deep",
    accentChip: "bg-hhx-soft text-hhx-deep",
    solidBg: "bg-hhx-base text-white",
    softBg: "bg-hhx-soft text-hhx-base",
    ring: "ring-hhx-mid",
    bar: "bg-hhx-base",
    borderActive: "border-hhx-base",
  },
};

export function getEducation(id: Education): EducationTheme {
  return EDU_THEMES[id];
}
