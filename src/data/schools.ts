import type { Education } from "../types";

// ---------------------------------------------------------------------------
// Skole-modellen. AP Klar er uddannelses-bevidst (STX/HHX), men eksamens-
// formerne er SKOLE-specifikke: hver skole afvikler AP-prøven lidt forskel-
// ligt. Derfor skal eleven fra start vælge sin skole.
//
// Lige nu har vi beskrivelser til:
//   • Egå Gymnasium (STX)      - beskrivelse under udarbejdelse
//   • Risskov, Handelsskolen (HHX) - beskrivelse klar
// Flere skoler tilføjes ved at udvide SCHOOLS + EXAM_FORMATS; UI'et læser
// kun listerne.
//
// Vigtigt for databeskytningen: skolevalget gemmes KUN lokalt i browserens
// localStorage (samme sted som resten af appen). Der indsamles INTET, og
// valget sendes ikke nogen steder.
// ---------------------------------------------------------------------------

export const UNKNOWN_SCHOOL_ID = "unknown";

export interface SchoolDef {
  id: string;
  name: string;
  education: Education;
  // Nøgle i EXAM_FORMATS (se src/data/hhx/examFormats.ts).
  formatId: string;
  /** Kort by-line, fx "Aarhus C". */
  city?: string;
}

export const SCHOOLS: SchoolDef[] = [
  {
    id: "ega-gym",
    name: "Egå Gymnasium",
    education: "stx",
    formatId: "ega-stx",
    city: "Aarhus",
  },
  {
    id: "risskov-hhx",
    name: "Risskov, Handelsskolen",
    education: "hhx",
    formatId: "risskov-hhx",
    city: "Aarhus",
  },
];

export function schoolsFor(education: Education): SchoolDef[] {
  return SCHOOLS.filter((s) => s.education === education);
}

export function getSchool(id: string | null | undefined): SchoolDef | null {
  if (!id || id === UNKNOWN_SCHOOL_ID) return null;
  return SCHOOLS.find((s) => s.id === id) ?? null;
}

/** Skolen hører til uddannelsen? (Bruges når spor skiftes under Profil.) */
export function schoolMatchesEducation(id: string | null | undefined, education: Education): boolean {
  const school = getSchool(id);
  return !!school && school.education === education;
}
