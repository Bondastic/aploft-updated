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
    headline: "Sådan foregår AP-eksamen på HHX (Risskov)",
    summary:
      "AP-eksamen er MUNDTLIG med skriftlig forberedelse. Du trækker en ukendt tekst med syv opgaver til, og du har 40 minutter i et forberedelseslokale til at løse dem. Derefter går du ind til eksamen i 12-15 minutter, hvor du besvarer de syv opgaver mundtligt for din lærer og en censor. Karakteren kommer på eksamensbeviset og tæller med i gennemsnittet.",
    facts: [
      { label: "Prøveform", value: "Mundtlig eksamen med skriftlig forberedelse ; ukendt tekst + syv faste opgaver" },
      { label: "Forberedelse", value: "40 minutter i et forberedelseslokale (muligvis flere elever i samme lokale) med en tilsynsførende" },
      { label: "Eksamination", value: "12-15 minutter hos din lærer og en censor (en anden sproglærer fra skolen), derefter ca. 5 minutters votering" },
      {
        label: "De syv opgaver",
        value:
          "1) genretræk i teksten, 2) kommunikationssituationen, 3) sproglige særtræk, 4) morfologisk analyse, 5) sætningsanalyse, 6) verbaltider, 7) hoved- og ledsætninger",
      },
      { label: "Hjælpemidler", value: "Egne noter, bøger fra undervisningen og ordbog (ordnet.dk) ; lav gerne et notepapir med dine svar, som du tager med ind. Ingen computer, medmindre det er aftalt med din lærer" },
      { label: "Bedømmelse", value: "Én samlet karakter efter 7-trinsskalaen, givet ud fra din mundtlige besvarelse af de syv opgaver + uddybende spørgsmål" },
      { label: "Terminologi", value: "De latinske betegnelser er primære: subjekt, verballed, direkte og indirekte objekt, adverbial, subjektsprædikat (de danske må gerne nævnes som hjælp)" },
    ],
    sections: [
      {
        heading: "Hele forløbet på ét blik",
        body:
          "1) Du trækker en ukendt tekst med syv tilhørende opgaver. 2) Du løser opgaverne i forberedelseslokalet på 40 minutter og skriver dine svar ned på et notepapir. 3) Du går ind til eksamen, hvor din lærer og censor sidder. 4) Du besvarer de syv opgaver mundtligt (12-15 min). 5) Lærer og censor stiller måske uddybende spørgsmål. 6) Du sendes ud, mens de voterer i ca. 5 minutter. 7) Du kommer ind og får din karakter, som tæller på eksamensbeviset.",
      },
      {
        heading: "Hvad de syv opgaver kræver",
        body:
          "Opgave 1-3 handler om teksten: genren (fx politisk tale, ejendomsannonce, opinionsartikel, informerende artikel eller reklame), kommunikationssituationen med Ciceros pentagram (afsender, emne, modtager, situation, sprog og formålet i midten) og de sproglige særtræk (ordklasser, semantiske felter, konkrete og abstrakte ord, konnotationer, stilleje og sætningskonstruktion). Opgave 4-7 er grammatikken: morfologisk analyse (rodmorfem, præfiks, suffiks, fleksiv, bindebogstav), syntaktisk analyse med led-symbolerne, verballeddets tid med omskrivning (præsens, præteritum, perfektum, pluskvamperfektum, futurum) og til sidst hoved- og ledsætninger med ikke-reglen.",
      },
      {
        heading: "Hvad lægges der vægt på?",
        body:
          "I opgave 2 og 3 er der MANGE rigtige svar : det er meget individuelt, hvad der er værd at kommentere i netop din tekst, og hver skole gør den del på sin egen måde. Derfor tæller dokumentationen (citater fra teksten) og fagsproget mere end mængden. Opgave 4-7 har til gengæld præcise svar, og det er dem, eleverne typisk har sværest ved og bruger længst tid på at lære : morfologi, sætningsanalyse, omskrivning af verballeddets tid, hoved- og ledsætninger og de latinske begreber. Det er også dem, appen træner hårdest.",
      },
      {
        heading: "Sådan hænger det sammen med appen",
        body:
          "Eksamensprøven i Prøve-fanen simulerer præcis dette format: ukendt tekst, syv opgaver, ur på 40 minutter, klokke og aflevering. Du skriver dine svar i felterne, ligesom du ville skrive dem på notepapiret : og under hver opgave er der delspørgsmål med faste svar, som appen kan rette, så du får en vejledende karakter. Den mundtlige del kan appen ikke bedømme, så brug prøven som forberedelse og kopiér dine skrevne svar over til en AI, hvis du vil have feedback på dem. De almindelige prøvegeneratorer bruger du til at træne delelementerne.",
      },
    ],
    note:
      "Formen følger det, Risskov har meldt ud for det nuværende hold (eksamen ligger i uge 45). Tjek altid hos din AP-lærer, hvis tidspunkt, hjælpemidler eller forløb er ændret.",
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
  "AP-eksamen er ikke den samme overalt: formerne er skolespecifikke, og det gælder både forberedelsen, opgaverne og den mundtlige del. Her ser du den form, der gælder for din skole og dit spor.";
export const EXAM_FORMAT_OTHER_NOTE =
  "Din skole er ikke på listen endnu. Vi arbejder på at få alle skolers former med ; indtil videre kan du se de beskrivelser, vi har for dit spor. Tjek altid den officielle melding hos din AP-lærer.";
