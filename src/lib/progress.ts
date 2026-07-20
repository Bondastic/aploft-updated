import type { CategoryStat, ExamAttempt, LessonResult, Progress } from "../types";

const STORAGE_KEY = "aploft.progress.v4";

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
      return { ...defaultProgress(), ...parsed, settings: { ...defaultProgress().settings, ...parsed.settings } };
    }
    // Migrer evt. gammel v3-nøgle, så folk ikke mister XP ved opdateringen.
    const legacy = localStorage.getItem("aploft.progress.v3");
    if (legacy) {
      const parsed = JSON.parse(legacy) as Progress;
      return { ...defaultProgress(), ...parsed, completedLessons: {} };
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
    xp: 0,
    streakDays: 0,
    multiplier: 1,
    lastActiveDate: "",
    categoryStats: {},
    completedSteps: [],
    completedLessons: {},
    examAttempts: [],
    settings: { reduceMotion: false },
  };
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function resetProgress(): Progress {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
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

export function recordAnswer(p: Progress, category: string, correct: boolean): Progress {
  const prev: CategoryStat = p.categoryStats[category] ?? { correct: 0, total: 0 };
  const next: CategoryStat = { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 };
  return { ...p, categoryStats: { ...p.categoryStats, [category]: next } };
}

export function recordExamAttempt(p: Progress, attempt: Omit<ExamAttempt, "id" | "date">): Progress {
  const full: ExamAttempt = { ...attempt, id: uid(), date: new Date().toISOString() };
  return { ...p, examAttempts: [full, ...p.examAttempts].slice(0, 30) };
}

/** Gemmer resultatet af et gennemført forløbstrin (lesson) og opdaterer bedste score. */
export function recordLessonResult(p: Progress, lessonId: string, pct: number): Progress {
  const prev: LessonResult | undefined = p.completedLessons[lessonId];
  const next: LessonResult = {
    bestPct: Math.max(prev?.bestPct ?? 0, pct),
    lastPct: pct,
    timesPlayed: (prev?.timesPlayed ?? 0) + 1,
  };
  return { ...p, completedLessons: { ...p.completedLessons, [lessonId]: next } };
}

export function isLessonPassed(p: Progress, lessonId: string): boolean {
  const r = p.completedLessons[lessonId];
  return !!r && r.bestPct >= LESSON_PASS_THRESHOLD;
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
