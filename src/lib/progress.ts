import type { CategoryStat, Education, ExamAttempt, LessonResult, Progress, ProgressSettings, TextSize } from "../types";

const STORAGE_KEY = "aploft.progress.v4";

const DEFAULT_SETTINGS: ProgressSettings = {
  reduceMotion: false,
  textSize: "normal",
};

function isTextSize(value: unknown): value is TextSize {
  return value === "normal" || value === "large" || value === "extra-large";
}

// Gamle gemte profiler har kun `reduceMotion`. Normaliseringen gør den nye
// tekststørrelsesindstilling bagudkompatibel – og ignorerer ugyldige værdier
// fra fx en manuelt redigeret localStorage-post.
function normaliseSettings(settings?: Partial<ProgressSettings>): ProgressSettings {
  return {
    reduceMotion: settings?.reduceMotion === true,
    textSize: isTextSize(settings?.textSize) ? settings.textSize : DEFAULT_SETTINGS.textSize,
  };
}

// Samme faglige kategori (fx ordklasser) findes både på STX og HHX. Statistik
// skal derfor altid gemmes med uddannelsen som præfiks; ellers kan et skift
// mellem spor blande resultaterne og få dem til at tælle i den forkerte
// standpunktsvurdering.
export function categoryStatKey(education: Education, category: string): string {
  return `${education}:${category}`;
}

function isScopedCategoryStatKey(key: string): boolean {
  return key.startsWith("stx:") || key.startsWith("hhx:");
}

function normaliseCategoryStats(
  stats: Record<string, CategoryStat> | undefined,
  fallbackEducation: Education
): Record<string, CategoryStat> {
  if (!stats) return {};

  const normalised: Record<string, CategoryStat> = {};
  for (const [key, stat] of Object.entries(stats)) {
    const scopedKey = isScopedCategoryStatKey(key) ? key : categoryStatKey(fallbackEducation, key);
    const previous = normalised[scopedKey] ?? { correct: 0, total: 0 };
    normalised[scopedKey] = {
      correct: previous.correct + (stat?.correct ?? 0),
      total: previous.total + (stat?.total ?? 0),
    };
  }
  return normalised;
}

/** Henter en kategori-score i det aktive uddannelsesspor. */
export function getCategoryStat(p: Progress, education: Education, category: string): CategoryStat | undefined {
  return p.categoryStats[categoryStatKey(education, category)];
}

// Forløb har også ens id'er på tværs af spor (fx `ordklasser__lesson-1`).
// Låse og bedste scores skal følge samme afgrænsning som kategori-statistik.
export function lessonProgressKey(education: Education, lessonId: string): string {
  return `${education}:${lessonId}`;
}

function isScopedLessonProgressKey(key: string): boolean {
  return key.startsWith("stx:") || key.startsWith("hhx:");
}

function normaliseCompletedLessons(
  lessons: Record<string, LessonResult> | undefined,
  fallbackEducation: Education
): Record<string, LessonResult> {
  if (!lessons) return {};

  const normalised: Record<string, LessonResult> = {};
  for (const [key, result] of Object.entries(lessons)) {
    const scopedKey = isScopedLessonProgressKey(key) ? key : lessonProgressKey(fallbackEducation, key);
    const previous = normalised[scopedKey];
    normalised[scopedKey] = previous
      ? {
          bestPct: Math.max(previous.bestPct, result.bestPct),
          lastPct: result.lastPct,
          timesPlayed: previous.timesPlayed + result.timesPlayed,
        }
      : result;
  }
  return normalised;
}

/** Henter resultatet af et forløb i det aktive uddannelsesspor. */
export function getLessonResult(p: Progress, education: Education, lessonId: string): LessonResult | undefined {
  return p.completedLessons[lessonProgressKey(education, lessonId)];
}

// Hvor høj en gennemsnitlig procent skal man mindst have i et forløbstrin,
// for at det næste trin i "path'en" låses op.
export const LESSON_PASS_THRESHOLD = 60;

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Progress;
      // Migrering: eksisterende brugere har ikke valgt uddannelse, så de får STX
      // (det indhold, appen altid har haft), springer velkomstskærmen over og
      // får heller ikke spotlight-rundvisningen.
      const education = parsed.education ?? "stx";
      const migrated: Progress = {
        ...defaultProgress(),
        ...parsed,
        education,
        onboarded: parsed.onboarded ?? true,
        guideDone: parsed.guideDone ?? true,
        categoryStats: normaliseCategoryStats(parsed.categoryStats, education),
        completedLessons: normaliseCompletedLessons(parsed.completedLessons, education),
        settings: normaliseSettings(parsed.settings),
      };
      return migrated;
    }
    // Migrer evt. gammel v3-nøgle, så folk ikke mister XP ved opdateringen.
    const legacy = localStorage.getItem("aploft.progress.v3");
    if (legacy) {
      const parsed = JSON.parse(legacy) as Progress;
      return {
        ...defaultProgress(),
        ...parsed,
        education: "stx",
        onboarded: true,
        guideDone: true,
        completedLessons: {},
        categoryStats: normaliseCategoryStats(parsed.categoryStats, "stx"),
        settings: normaliseSettings(parsed.settings),
      };
    }
  } catch {
    // ignore corrupted data
  }
  return defaultProgress();
}

function defaultProgress(): Progress {
  return {
    userId: uid(),
    nickname: "",
    education: "stx",
    onboarded: false,
    guideDone: false,
    xp: 0,
    streakDays: 0,
    multiplier: 1,
    lastActiveDate: "",
    categoryStats: {},
    completedSteps: [],
    completedLessons: {},
    examAttempts: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Ignorer: fx hvis localStorage er utilgængelig i en sandboxet iframe.
  }
}

/** Sætter uddannelsen (bruges ved skift under Profil → Indstillinger). */
export function setEducation(p: Progress, education: Education): Progress {
  return { ...p, education };
}

/** Marker, at velkomstskærmen er gennemført, og gem uddannelse + evt. kaldenavn. */
export function completeOnboarding(p: Progress, education: Education, nickname: string): Progress {
  return { ...p, education, nickname, onboarded: true };
}

/** Marker, at spotlight-rundvisningen er gennemført (eller sprunget over). */
export function finishGuide(p: Progress): Progress {
  return { ...p, guideDone: true };
}

export function resetProgress(): Progress {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return touchStreak(defaultProgress());
}

export function touchStreak(p: Progress): Progress {
  const today = todayStr();
  if (p.lastActiveDate === today) return p;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streakDays = p.lastActiveDate === yesterday ? p.streakDays + 1 : 1;
  const multiplier = Math.min(2, 1 + Math.floor(streakDays / 3) * 0.1);
  return { ...p, lastActiveDate: today, streakDays, multiplier };
}

export function addXp(p: Progress, amount: number): Progress {
  const boosted = Math.round(amount * p.multiplier);
  return { ...p, xp: p.xp + boosted };
}

export function recordAnswer(p: Progress, education: Education, category: string, correct: boolean): Progress {
  const key = categoryStatKey(education, category);
  const prev: CategoryStat = p.categoryStats[key] ?? { correct: 0, total: 0 };
  const next: CategoryStat = { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 };
  return { ...p, categoryStats: { ...p.categoryStats, [key]: next } };
}

export function recordExamAttempt(p: Progress, attempt: Omit<ExamAttempt, "id" | "date">): Progress {
  const full: ExamAttempt = { ...attempt, id: uid(), date: new Date().toISOString() };
  return { ...p, examAttempts: [full, ...p.examAttempts].slice(0, 30) };
}

/** Gemmer resultatet af et gennemført forløbstrin i det aktive spor. */
export function recordLessonResult(p: Progress, education: Education, lessonId: string, pct: number): Progress {
  const key = lessonProgressKey(education, lessonId);
  const prev: LessonResult | undefined = p.completedLessons[key];
  const next: LessonResult = {
    bestPct: Math.max(prev?.bestPct ?? 0, pct),
    lastPct: pct,
    timesPlayed: (prev?.timesPlayed ?? 0) + 1,
  };
  return { ...p, completedLessons: { ...p.completedLessons, [key]: next } };
}

export function isLessonPassed(p: Progress, education: Education, lessonId: string): boolean {
  const result = getLessonResult(p, education, lessonId);
  return !!result && result.bestPct >= LESSON_PASS_THRESHOLD;
}

export function getLevelInfo(xp: number): { level: number; title: string; intoLevel: number; forNext: number } {
  const levels = [
    { threshold: 0, title: "Sprognovice" },
    { threshold: 100, title: "Ordklasse-lærling" },
    { threshold: 250, title: "Sætningsanalytiker" },
    { threshold: 500, title: "Morfem-mester" },
    { threshold: 900, title: "Syntaks-kender" },
    { threshold: 1400, title: "Latin-kandidat" },
    { threshold: 2000, title: "AP-ekspert" },
    { threshold: 3000, title: "🐐AP-GED🐐" },
  ];
  let level = 0;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].threshold) level = i;
  }
  const current = levels[level];
  const next = levels[level + 1];
  const intoLevel = xp - current.threshold;
  const forNext = next ? next.threshold - current.threshold : intoLevel;
  return { level: level + 1, title: current.title, intoLevel, forNext };
}
