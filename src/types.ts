// Delte typer for APLOFT

// Hvilken gymnasial uddannelse brugeren går på. STX = det almene gymnasium
// (rød farveprofil), HHX = det merkantile gymnasium (blå farveprofil).
// Valges første gang i velkomstskærmen og kan skiftes under Profil →
// Indstillinger. Bemærk: HTX har ikke AP, derfor kun STX og HHX.
export type Education = "stx" | "hhx";

// "Spor" i appen: de to STX-spor (almen + latin) og HHX-sporet.
export type Track = "almen" | "latin" | "hhx";

export type AlmenCategoryId =
  | "ordklasser"
  | "saetningsled"
  | "morfologi"
  | "tempus"
  | "kasus"
  | "syntaks"
  | "sprog";

export type LatinCategoryId =
  | "sumesse"
  | "ordforraad"
  | "grammatik"
  | "oversaettelse"
  | "kultur";

// HHX-kategorier (jf. læreplanens faglige indhold: kommunikationsteori,
// sproghandlinger, semantik, pragmatik, genrebevidst formidling, elementær
// sproghistorie samt strategier for sprogtilegnelse).
export type HhxCategoryId =
  | "kommunikation"
  | "sproghandlinger"
  | "semantik"
  | "pragmatik"
  | "genrer"
  | "sproghistorie"
  | "laeringsstrategier";

export type CategoryId = AlmenCategoryId | LatinCategoryId | HhxCategoryId;

// De 7 officielle sætningsled-symboler (analysetegn), brugt som identifikatorer.
// Det visuelle tegn tegnes af <LedGlyph /> i components/icons.tsx, så de altid
// fremstår ens på tværs af enheder (især ⊗ og cirkel-med-trekant).
export type LedSymbol =
  | "subjekt" // grundled, tegn: ×
  | "verbal" // udsagnsled, tegn: ○
  | "objekt" // genstandsled (direkte objekt), tegn: △
  | "dativ" // hensynsled (indirekte objekt), tegn: □
  | "adverbial" // biled, tegn: 〰
  | "subjpred" // subjektsprædikat (omsagnsled til grundled), tegn: ⊗
  | "objpred"; // objektsprædikat (omsagnsled til genstandsled), tegn: cirkel med trekant

// Navne paa de ikoner der bruges for kategorier, spor og enkelte knapper.
export type IconName =
  | "ordklasser"
  | "saetningsled"
  | "morfologi"
  | "tempus"
  | "kasus"
  | "syntaks"
  | "sprog"
  | "sumesse"
  | "ordforraad"
  | "grammatik"
  | "oversaettelse"
  | "kultur"
  | "kommunikation"
  | "sproghandlinger"
  | "semantik"
  | "pragmatik"
  | "genrer"
  | "sproghistorie"
  | "laeringsstrategier"
  | "almen"
  | "latin"
  | "hhx"
  | "stx"
  | "fuld"
  | "bolt"
  | "ultimativ"
  | "udvikling"
  | "lock";

export type MascotPose =
  | "welcome"
  | "explain"
  | "celebrate"
  | "surprise"
  | "encourage"
  | "thinking"
  | "thumbsup"
  | "chaos";

interface TaskBase {
  id: string;
  category: CategoryId;
  explanation: string;
  showSheet?: boolean;
}

export interface ChoiceTaskT extends TaskBase {
  type: "choice";
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface ClickWordTaskT extends TaskBase {
  type: "click-word";
  instruction: string;
  sentence: string;
  tokens: string[];
  correctIndexes: number[];
}

export interface AnalysisTaskT extends TaskBase {
  type: "analysis";
  instruction: string;
  sentence: string;
  chunks: string[];
  correctMap: LedSymbol[];
}

export interface BuildSentenceTaskT extends TaskBase {
  type: "build-sentence";
  instruction: string;
  words: string[];
  correctOrder: string[];
  // Latin har fri ordstilling: kasusendelser (ikke pladsen i sætningen) viser
  // ordets funktion. Når dette er sat, tælles enhver rækkefølge med de rigtige
  // ord som korrekt, men eleven får en forklarende note, hvis rækkefølgen
  // afviger fra den mest almindelige (typisk verbum sidst).
  wordOrderFree?: boolean;
}

// Skriveopgave: eleven taster selv et ord/en sætning ind. Sammenlignes efter
// normalisering (små bogstaver, trimmet, punktum/komma fjernet i enderne),
// og der kan angives alternative korrekte svar.
export interface WriteTaskT extends TaskBase {
  type: "write";
  instruction: string;
  prompt: string;
  answer: string;
  altAnswers?: string[];
  placeholder?: string;
}

// Info-/skema-trin: ingen "rigtigt/forkert"; eleven kigger på en
// bøjningstabel (fx esse i nutid eller datid) og trykker videre, når hun har
// læst den. Bruges til roligt at introducere et skema, FØR eleven bliver
// bedt om at svare på spørgsmål om det (fx før eram/eras/erat).
export interface InfoTaskT extends TaskBase {
  type: "info";
  title: string;
  intro: string;
  rows: { label: string; value: string }[];
  continueLabel?: string;
}

// Undervisnings-trin ("teach"): den vigtigste brik i at gøre APklar til en
// lærer og ikke kun en quiz. Vises FØR eleven overhovedet bliver bedt om at
// svare på noget nyt. Besvarer altid: hvad er det? hvorfor er det vigtigt?
// hvordan kender jeg det? hvornår bruger jeg det? hvordan husker jeg det?
// Der er ingen rigtigt/forkert her: eleven trykker "Forstået" for at fortsætte.
export interface TeachTaskT extends TaskBase {
  type: "teach";
  title: string;
  sections: { heading?: string; body: string }[];
  examples?: string[];
  tip?: string;
  continueLabel?: string;
}

// Tabel-udfyldning: en bøjningstabel (fx esse i nutid/datid) vises med alle
// personlabels, men nogle af værdierne mangler ("blankIndexes"). Eleven
// vælger den rigtige form for hvert tomt felt fra en ordbank. Alle felter
// skal være korrekte, for at opgaven tælles som bestået.
export interface TableFillTaskT extends TaskBase {
  type: "table-fill";
  instruction: string;
  tableTitle: string;
  rows: { label: string; value: string }[];
  blankIndexes: number[];
  extraDistractors?: string[];
}

export type Task =
  | ChoiceTaskT
  | ClickWordTaskT
  | AnalysisTaskT
  | BuildSentenceTaskT
  | WriteTaskT
  | InfoTaskT
  | TableFillTaskT
  | TeachTaskT;

/** Rene undervisnings-/gennemgangstrin uden rigtigt/forkert-bedømmelse. */
export function isContentTask(task: Task): task is TeachTaskT | InfoTaskT {
  return task.type === "teach" || task.type === "info";
}

export interface CategoryStat {
  correct: number;
  total: number;
}

export interface ExamAttempt {
  id: string;
  date: string;
  track: Track | "fuld" | "ultimativ";
  totalCorrect: number;
  totalQuestions: number;
  byCategory: Record<string, CategoryStat>;
}

export interface ProgressSettings {
  reduceMotion: boolean;
}

// Resultat for et enkelt forløbs-trin (lesson) i en kategoris "path".
// bestPct bruges til at afgøre, om næste trin er låst op (>= PASS_THRESHOLD).
export interface LessonResult {
  bestPct: number;
  timesPlayed: number;
  lastPct: number;
}

export interface Progress {
  userId: string;
  nickname: string;
  // Hvilken uddannelse appen viser indhold for ("stx" eller "hhx").
  // Sættes i velkomstskærmen, skiftes under Profil → Indstillinger.
  education: Education;
  // Om brugeren har gennemgået velkomstskærmen (uddannelsesvalg). Eksisterende
  // brugere med gemt progress migreres til true, så de ikke møder skærmen igen.
  onboarded: boolean;
  // Om brugeren har gennemgået (eller sprunget over) spotlight-rundvisningen.
  // Nye brugere får den lige efter velkomstskærmen; eksisterende brugere
  // migreres til true, så de ikke får turen.
  guideDone: boolean;
  xp: number;
  streakDays: number;
  multiplier: number;
  lastActiveDate: string;
  categoryStats: Record<string, CategoryStat>;
  completedSteps: string[];
  completedLessons: Record<string, LessonResult>;
  examAttempts: ExamAttempt[];
  settings: ProgressSettings;
}

export interface CategoryDef {
  id: CategoryId;
  track: Track;
  title: string;
  short: string;
  description: string;
  color: string; // tailwind color token suffix
  icon: IconName;
  comingSoon?: boolean;
}
