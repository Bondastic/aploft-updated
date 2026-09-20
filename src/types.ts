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

/** Gemt elevsvar, så tilbage/frem kan vise præcis det, der blev afleveret. */
export type SavedAnswer =
  | { kind: "choice"; selected: number | null }
  | { kind: "click-word"; selected: number[] }
  | {
      kind: "analysis";
      assignments: Partial<Record<number, LedSymbol>>;
      // Liste i chunk-rækkefølge, så genskabelse ikke afhænger af objektnøgler.
      symbols?: (LedSymbol | null)[];
    }
  | { kind: "build-sentence"; words: string[]; orderDiffers?: boolean }
  | { kind: "write"; value: string }
  | { kind: "table-fill"; assignments: Record<number, string> }
  | { kind: "content" };

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
  // Valgt skole (id fra src/data/schools.ts) eller "unknown" for "anden
  // skole". Null = endnu ikke valgt ; så viser appen ét skolevalg-skærmen
  // (også for opdaterede eksisterende brugere). Gemmes KUN lokalt - der
  // indsamles intet.
  school: string | null;
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
  // Forløb man har låst op manuelt (uden at have bestået de forrige).
  // Bruges så øvede elever kan springe hen til sværere opgaver. De
  // manuelt oplåste forløb tæller IKKE som gennemført.
  unlockedLessons: string[];
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

// ---------------------------------------------------------------------------
// Eksamenssæt (kun HHX): appens simulering af den virkelige AP-eksamen, som
// den afvikles på Risskov. Eleven trækker en ukendt tekst med SYV opgaver og
// har 40 minutters skriftlig forberedelse ; til selve eksamen besvares de syv
// opgaver mundtligt.
//
// Hver opgave har derfor TO dele i appen:
//   1. et fritekst-felt : elevens egen besvarelse, præcis som notepapiret man
//      tager med ind til eksamen. Den kan appen ikke bedømme, men den kopieres
//      med over til AI-feedback (kopiér-knappen på resultatsiden).
//   2. lukkede delspørgsmål (checks) : valg, ordklasse-taps og led-markering.
//      DEM retter appen automatisk, og det er dem, karakteren bygger på.
// Vigtigt: hverken hints eller opgavetekster må afsløre svarene.
// ---------------------------------------------------------------------------

// Ordklasse-mærkater til sætningens ord (bruges i opgave-LED'en i
// eksamenssættet og til at mærke ord inde i selve artiklen).
export type ExamWordClassTag =
  | "substantiv"
  | "verbum"
  | "adjektiv"
  | "adverbium"
  | "pronomen"
  | "præposition"
  | "konjunktion"
  | "numerale"
  | "interjektion";

interface ExamCheckBaseT {
  id: string;
  /** Selve delspørgsmålet. Må aldrig afsløre facit. */
  prompt: string;
  /** Vises efter aflevering: hvad der er rigtigt/forkert og hvorfor. */
  feedback: string;
}

export interface ExamChoiceCheckT extends ExamCheckBaseT {
  kind: "choice";
  options: string[];
  correctIndex: number;
}

export interface ExamMultiCheckT extends ExamCheckBaseT {
  kind: "multi";
  options: string[];
  correctIndexes: number[];
}

export interface ExamWordClassCheckT extends ExamCheckBaseT {
  kind: "wordclass";
  /** Ord, der optræder i artiklen; eleven klikker på hvert og vælger ordklasse. */
  words: { word: string; correct: ExamWordClassTag }[];
}

export interface ExamAnalysisCheckT extends ExamCheckBaseT {
  kind: "analysis";
  /** Sætning fra artiklen, som analyseres med de 7 led-symboler (præcis som i
   *  øvrige analyseopgaver: klik på klump, vælg symbol). */
  sentence: string;
  chunks: string[];
  correctMap: LedSymbol[];
}

/** Lukket delspørgsmål: det er dem, appen retter og giver karakter ud fra. */
export type ExamCheckT = ExamChoiceCheckT | ExamMultiCheckT | ExamWordClassCheckT | ExamAnalysisCheckT;

/**
 * Én af de syv opgaver på eksamensarket. Rækkefølgen og emnerne følger
 * skolens eget ark: 1) genre, 2) kommunikationssituation, 3) sproglige
 * særtræk, 4) morfologisk analyse, 5) syntaktisk analyse, 6) verballedets
 * tid, 7) hoved- og ledsætninger.
 */
export interface ExamTaskT {
  id: string;
  /** Opgavenummer på eksamensarket (1-7). */
  no: number;
  /** Kort emne-chip, fx "Genre" eller "Morfologi". */
  label: string;
  /** Bruges kun til statistik pr. kategori på prøvens resultat. */
  category?: CategoryId;
  /** Opgaveteksten, formuleret som på eksamensarket. */
  prompt: string;
  /** "?"-knappen: forklarer KUN metoden (trin for trin), aldrig facit. */
  hint: string;
  /** Pladsholder i fritekst-feltet (elevens eget svar, som på notepapiret). */
  placeholder: string;
  /** Lukkede delspørgsmål, der giver karakteren. */
  checks: ExamCheckT[];
  /** Punkter et stærkt mundtligt svar rammer (vises som checkliste bagefter). */
  points: string[];
  /** Vises efter aflevering: sådan kunne et stærkt svar lyde. */
  modelAnswer: string;
  /** Vises efter aflevering: hvad der typisk er rigtigt/forkert i opgaven. */
  feedback: string;
  /** Vises efter aflevering: det her skal du gøre til den virkelige eksamen. */
  examTip: string;
  /**
   * Opgaver, hvor MANGE svar er rigtige (opgave 2 og 3 ifølge AP-læreren).
   * Appen siger det tydeligt og retter aldrig fritekst-delen som rigtig/forkert.
   */
  openEnded?: boolean;
}

export interface ExamArticleT {
  title: string;
  byline: string;
  paragraphs: string[];
}

export interface ExamSatsT {
  id: string;
  title: string;
  // Skole/spor-tekst på forsiden af prøven, fx "Risskov · HHX".
  schoolLabel: string;
  // Forberedelsestid i minutter (matcher skolens eksamensforberedelse).
  minutes: number;
  // Informationssiden eleven ser FØR prøven: om eksamen og dens forløb.
  intro: {
    heading: string;
    lead: string;
    steps: string[];
    examIn: { title: string; body: string }[];
    closingNote: string;
  };
  article: ExamArticleT;
  /** De syv opgaver fra eksamensarket (i rækkefølge). */
  tasks: ExamTaskT[];
}
