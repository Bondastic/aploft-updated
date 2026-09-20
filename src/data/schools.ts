import type { Education } from "../types";

// ---------------------------------------------------------------------------
// Skole-modellen. AP Klar er uddannelses-bevidst (STX/HHX), men eksamens-
// formerne er SKOLE-specifikke: hver skole afvikler AP-prøven lidt forskel-
// ligt. Derfor skal eleven fra start vælge sin skole.
//
// VIGTIGT: skolerne er også delt op efter, hvilke PRØVER de kan tage. En
// eksamensprøve i appen simulerer én bestemt skoles eksamensform, og den må
// derfor kun være tilgængelig for elever på den skole (se `exams` nedenfor og
// `canTakeExamSats`). Har eleven valgt "anden skole", kan man ikke tage den:
// vi ved ikke, hvordan eksamen afvikles der, og en forkert simulering er
// værre end ingen.
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

/**
 * Prøver (eksamenssimuleringer), en skole kan have adgang til i appen.
 * Nye skoler/prøver: tilføj et id her + sæt det på skolen i SCHOOLS.
 */
export type SchoolExamId = "hhx-ap-eksamensproeve";

/** Eksamensprøven under fanen Prøve (HHX, tekst + 7 opgaver + 40 min). */
export const HHX_EXAM_SATS_ID: SchoolExamId = "hhx-ap-eksamensproeve";

export const SCHOOL_EXAM_LABELS: Record<SchoolExamId, { title: string; short: string }> = {
  "hhx-ap-eksamensproeve": {
    title: "Eksamensprøve (tekst + 7 opgaver, 40 min forberedelse)",
    short: "Eksamensprøve",
  },
};

export interface SchoolDef {
  id: string;
  name: string;
  education: Education;
  // Nøgle i EXAM_FORMATS (se src/data/hhx/examFormats.ts).
  formatId: string;
  /** Kort by-line, fx "Aarhus C". */
  city?: string;
  /**
   * De prøver, eleverne på skolen kan tage i appen. Tom liste = skolen har
   * (endnu) ingen eksamenssimulering, kun de almindelige prøvegeneratorer.
   */
  exams: SchoolExamId[];
}

export const SCHOOLS: SchoolDef[] = [
  {
    id: "ega-gym",
    name: "Egå Gymnasium",
    education: "stx",
    formatId: "ega-stx",
    city: "Aarhus",
    // STX-eksamen har en anden form (bl.a. latindelen). Ingen simulering endnu.
    exams: [],
  },
  {
    id: "risskov-hhx",
    name: "Risskov, Handelsskolen",
    education: "hhx",
    formatId: "risskov-hhx",
    city: "Aarhus",
    // Eksamensprøven i appen er bygget efter netop Risskovs eksamensark.
    exams: [HHX_EXAM_SATS_ID],
  },
];

export function schoolsFor(education: Education): SchoolDef[] {
  return SCHOOLS.filter((s) => s.education === education);
}

export function getSchool(id: string | null | undefined): SchoolDef | null {
  if (!id || id === UNKNOWN_SCHOOL_ID) return null;
  return SCHOOLS.find((s) => s.id === id) ?? null;
}

/** De prøver, den valgte skole kan tage ("anden skole"/intet valg = ingen). */
export function examsForSchool(id: string | null | undefined): SchoolExamId[] {
  return getSchool(id)?.exams ?? [];
}

/** Må eleven tage netop denne prøve? */
export function schoolCanTakeExam(id: string | null | undefined, exam: SchoolExamId): boolean {
  return examsForSchool(id).includes(exam);
}

/**
 * Adgang til HHX-eksamensprøven. To krav skal være opfyldt:
 *  1. eleven er på HHX-sporet (STX har en anden eksamensform), og
 *  2. elevens skole har prøven på sin liste (lige nu kun Risskov).
 * "Anden skole" og manglende skolevalg giver derfor IKKE adgang.
 */
export function canTakeExamSats(schoolId: string | null | undefined, education: Education): boolean {
  return education === "hhx" && schoolCanTakeExam(schoolId, HHX_EXAM_SATS_ID);
}

/** Skoler, der har en given prøve (bruges i "derfor kan du ikke"-teksterne). */
export function schoolsWithExam(exam: SchoolExamId): SchoolDef[] {
  return SCHOOLS.filter((s) => s.exams.includes(exam));
}

/** Skolen hører til uddannelsen? (Bruges når spor skiftes under Profil.) */
export function schoolMatchesEducation(id: string | null | undefined, education: Education): boolean {
  const school = getSchool(id);
  return !!school && school.education === education;
}
