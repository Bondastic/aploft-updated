import type { Education } from "../../types";

// ---------------------------------------------------------------------------
// EKSAMENSFORMER pr. SKOLE (kun data - teksten styres herfra).
//
// Nøglen er formatId'et fra src/data/schools.ts. Eleven ser KUN den form,
// der hører til skolens eget spor: HHX-elever ser HHX-guiden, STX-elever ser
// STX-guiden. Har eleven valgt "anden skole", vises i stedet listen af de
// former, vi har for eleven's uddannelse (med tydelig note om, at forms kan
// variere fra skole til skole).
//
// Flere skoler: tilføj SCHOOLS-ikon + én post herunder. UI klarer resten.
// ---------------------------------------------------------------------------

export interface ExamFormatFact {
  label: string;
  value: string;
}

export interface ExamFormatSection {
  heading: string;
  body: string;
}

export interface SchoolExamFormat {
  id: string; // match med SchoolDef.formatId
  school: string; // skole/afdeling, fx "Risskov, Handelsskolen"
  educationLabel: string; // "HHX"
  education: Education;
  status: "klar" | "under-udarbejdelse";
  headline: string; // overskrift på kortet
  summary: string; // 2-3 linjer
  facts: ExamFormatFact[];
  sections: ExamFormatSection[];
  note: string;
}

export const EXAM_FORMATS: Record<string, SchoolExamFormat> = {
  "risskov-hhx": {
    id: "risskov-hhx",
    school: "Risskov, Handelsskolen",
    educationLabel: "HHX",
    education: "hhx",
    status: "klar",
    headline: "Sådan foregår AP-eksamen på HHX",
    summary:
      "På Risskov afvikles AP-eksamen som en prøve med tekstgrundlag og faste spørgsmål: Du får en kort tekst (nyhedsstof, kronik, avis eller erhvervssprog) med et spørgsmålssæt, du skal besvare på 40 minutters forberedelse. Indholdet svarer til det, du træner i AP Klar: kommunikation, sproganalyse og genrer.",
    facts: [
      { label: "Prøveform", value: "Tekstsæt med spørgsmålssæt ; besvares skriftligt (i appen: blok-for-blok)" },
      { label: "Forberedelse", value: "40 minutter ; herefter aflevering/gennemgang" },
      { label: "Tekstgrundlag", value: "Kort, sammenhængende tekst ; typisk med erhvervs- eller samfundsrelateret vinkel" },
      { label: "Du bliver eksamineret i", value: "Indhold & formål, kommunikation (afsender/modtager/situation), ordklasser, syntaktisk analyse med led-symboler, ledsætninger, argumentation, pragmatik og genre" },
      { label: "Terminologi", value: "De latinske betegnelser er primære: subjekt, verballed, direkte og indirekte objekt (de danske må gerne nævnes som hjælp)" },
      { label: "Bedømmelse", value: "Samlet vurdering efter de faglige mål ; karakter gives efter den gældende karakterskala" },
    ],
    sections: [
      {
        heading: "Hele forløbet på ét blik",
        body:
          "1) Du får teksten og spørgsmålene. 2) Du læser teksten og skriver/markerer i den i din forberedelse. 3) Du besvarer hvert spørgsmål, så du viser, at du kan bruge begreberne - ikke bare kende dem. 4) Aflevering : og husk, at du altid må henvise til konkrete steder i teksten, når du analyserer.",
      },
      {
        heading: "Hvad lægges der vægt på?",
        body:
          "At du bruger fagbegreberne korrekt (fx 'verballed' frem for 'udsagnsled', 'indirekte objekt' frem for 'hensynsled'), at dine påstande har belæg fra teksten, og at du forklarer HVAD sproget gør, ikke bare hvad det hedder. Ræsonnementet tæller ; huskelister gør det ikke.",
      },
      {
        heading: "Sådan hænger det sammen med appen",
        body:
          "Eksamenssættet i Prøve-fanen simulerer præcis dette format (40 min, tekst, spørgsmål, aflevering). Vælg det, når du vil prøve en ægte eksamen ; de almindelige prøvegeneratorer bruger du til at træne delelementerne.",
      },
    ],
    note:
      "Formen følger det, Risskov har meldt ud for det nuværende hold. Tjek altid hos din AP-lærer, hvis tidspunkt, hjælpemidler eller forløb er ændret.",
  },
  "ega-stx": {
    id: "ega-stx",
    school: "Egå Gymnasium",
    educationLabel: "STX",
    education: "stx",
    status: "under-udarbejdelse",
    headline: "AP-eksamen på STX",
    summary:
      "På Egå Gymnasium afvikles AP-eksamen i en anden form end på HHX (bl.a. med latindelen med i bedømmelsen). Vi er ved at indhente den præcise, lokale beskrivelse af tid, forløb og hjælpemidler - den kommer ind her, så snart den er bekræftet.",
    facts: [
      { label: "Prøveform", value: "Tekstbaseret prøve med faglige spørgsmål (detaljer pr. skole følger)" },
      { label: "Forberedelse", value: "Beskrivelse under udarbejdelse" },
      { label: "Du bliver eksamineret i", value: "Dansk del: tekst- og sproganalyse ; latin del: bøjning, kasus og oversættelse (jf. pensum i STX-sporet)" },
      { label: "Terminologi", value: "De latinske betegnelser er primære: subjekt, verballed, direkte og indirekte objekt" },
    ],
    sections: [
      {
        heading: "Kommer snart",
        body:
          "Vi følger Egå Gymnasiums egne retningslinjer for AP-eksamen ; når de er godkendt hos os, lægger vi tidspunkter, hjælpemidler og bedømmelsesmodel ind her. På STX-siden i Prøve kan du indtil videre træne med prøvegeneratoren (almen del + latindel + den blandede prøve).",
      },
    ],
    note:
      "Indholdet i STX-beskrivelsen er midlertidigt: den viser kun overordnet, hvad AP-eksamen på STX indeholder. Den skolespecifikke vejledning fra Egå Gymnasium følger.",
  },
};

/** Alle former for et spor (bruges til "anden skole"-visningen). */
export function formatsForEducation(education: Education): SchoolExamFormat[] {
  return Object.values(EXAM_FORMATS).filter((f) => f.education === education);
}

/**
 * Den formelle beskrivelse for den valgte skole. Skolen er ikke på listen
 * ("anden skole" / intet valg) → null, og UI'et faller tilbage til
 * formatsForEducation(education).
 */
export function formatForSchoolId(formatId: string | null | undefined): SchoolExamFormat | null {
  if (!formatId) return null;
  return EXAM_FORMATS[formatId] ?? null;
}

// Overskrift/indledning til arket.
export const EXAM_FORMAT_INTRO =
  "AP-eksamen er ikke den samme overalt: formerne er skolespecifikke. Her ser du den form, der gælder for din skole og dit spor.";
export const EXAM_FORMAT_OTHER_NOTE =
  "Din skole er ikke på listen endnu. Vi arbejder på at få alle skolers former med ; indtil videre kan du se de beskrivelser, vi har for dit spor. Tjek altid den officielle melding hos din AP-lærer.";
