// Delte typer for APLOFT

export type Track = "almen" | "latin";

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

export type CategoryId = AlmenCategoryId | LatinCategoryId;

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
  | "almen"
  | "latin"
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
  // ord som korrekt — men eleven får en forklarende note, hvis rækkefølgen
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

export type Task = ChoiceTaskT | ClickWordTaskT | AnalysisTaskT | BuildSentenceTaskT | WriteTaskT;

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
