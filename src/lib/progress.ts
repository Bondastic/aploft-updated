import type { CategoryStat, Education, EducationProgress, ExamAttempt, LessonResult, Progress } from "../types";
import { scopedId } from "./curriculum";

const STORAGE_KEY = "aploft.progress.v5";
const LEGACY_KEYS = ["aploft.progress.v4", "aploft.progress.v3"];
export const LESSON_PASS_THRESHOLD = 60;

function uid(): string { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function todayStr(): string { return new Date().toISOString().slice(0, 10); }
function emptyEducationProgress(): EducationProgress { return { xp: 0, categoryStats: {}, completedLessons: {}, examAttempts: [] }; }

function defaultProgress(): Progress {
  return { userId: uid(), nickname: "", education: "stx", onboarded: false, guideDone: false,
    educationProgress: { stx: emptyEducationProgress(), hhx: emptyEducationProgress() },
    streakDays: 0, multiplier: 1, lastActiveDate: "", settings: { reduceMotion: false } };
}

/** Active partition only. Consumers must use this instead of raw state fields. */
export function educationState(progress: Progress, education: Education = progress.education): EducationProgress {
  return progress.educationProgress[education];
}
export function categoryProgressKey(education: Education, categoryId: string): string { return scopedId(education, categoryId); }
export function lessonProgressKey(education: Education, lessonId: string): string { return scopedId(education, lessonId); }

function migrateLegacy(parsed: Record<string, unknown>): Progress {
  const base = defaultProgress();
  const education: Education = parsed.education === "hhx" ? "hhx" : "stx";
  // Old records had no reliable education namespace. Put them in the user's
  // then-active universe only; never copy potentially ambiguous data to both.
  const scopeRecord = <T,>(record: Record<string, T> | undefined): Record<string, T> =>
    Object.fromEntries(Object.entries(record ?? {}).map(([key, value]) => [scopedId(education, key), value]));
  const legacyState: EducationProgress = {
    xp: typeof parsed.xp === "number" ? parsed.xp : 0,
    categoryStats: scopeRecord(parsed.categoryStats as Record<string, CategoryStat> | undefined),
    completedLessons: scopeRecord(parsed.completedLessons as Record<string, LessonResult> | undefined),
    examAttempts: ((parsed.examAttempts as ExamAttempt[] | undefined) ?? []).map((attempt) => ({
      ...attempt,
      byCategory: scopeRecord(attempt.byCategory),
    })),
  };
  return { ...base, ...parsed, education, onboarded: (parsed.onboarded as boolean | undefined) ?? true,
    guideDone: (parsed.guideDone as boolean | undefined) ?? true,
    educationProgress: { ...base.educationProgress, [education]: legacyState },
    settings: { ...base.settings, ...(parsed.settings as Partial<Progress["settings"]> | undefined) } };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Progress>;
      if (parsed.educationProgress?.stx && parsed.educationProgress?.hhx) {
        const base = defaultProgress();
        return { ...base, ...parsed, educationProgress: { ...base.educationProgress, ...parsed.educationProgress }, settings: { ...base.settings, ...parsed.settings } } as Progress;
      }
    }
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) return migrateLegacy(JSON.parse(legacy) as Record<string, unknown>);
    }
  } catch { /* corrupt local state starts safely */ }
  return defaultProgress();
}
export function saveProgress(p: Progress) { if (typeof window !== "undefined") try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* unavailable storage */ } }

export function setEducation(p: Progress, education: Education): Progress { return { ...p, education }; }
export function completeOnboarding(p: Progress, education: Education, nickname: string): Progress { return { ...p, education, nickname, onboarded: true }; }
export function finishGuide(p: Progress): Progress { return { ...p, guideDone: true }; }
export function resetProgress(): Progress { if (typeof window !== "undefined") try { localStorage.removeItem(STORAGE_KEY); } catch {} return touchStreak(defaultProgress()); }
export function touchStreak(p: Progress): Progress { const today=todayStr(); if(p.lastActiveDate===today)return p; const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10); const streakDays=p.lastActiveDate===yesterday?p.streakDays+1:1; return {...p,lastActiveDate:today,streakDays,multiplier:Math.min(2,1+Math.floor(streakDays/3)*.1)}; }

function updateEducation(p: Progress, education: Education, updater: (state: EducationProgress) => EducationProgress): Progress { return { ...p, educationProgress: { ...p.educationProgress, [education]: updater(p.educationProgress[education]) } }; }
export function addXp(p: Progress, amount: number, education: Education = p.education): Progress { return updateEducation(p, education, (state) => ({ ...state, xp: state.xp + Math.round(amount * p.multiplier) })); }
export function recordAnswer(p: Progress, education: Education, categoryId: string, correct: boolean): Progress {
  const key = categoryProgressKey(education, categoryId);
  return updateEducation(p, education, (state) => { const prev=state.categoryStats[key] ?? {correct:0,total:0}; return {...state,categoryStats:{...state.categoryStats,[key]:{correct:prev.correct+(correct?1:0),total:prev.total+1}}}; });
}
export function recordExamAttempt(p: Progress, education: Education, attempt: Omit<ExamAttempt,"id"|"date">): Progress { const full={...attempt,id:uid(),date:new Date().toISOString()}; return updateEducation(p,education,(state)=>({...state,examAttempts:[full,...state.examAttempts].slice(0,30)})); }
export function recordLessonResult(p: Progress, education: Education, lessonId: string, pct: number): Progress { const key=lessonProgressKey(education,lessonId); return updateEducation(p,education,(state)=>{const prev=state.completedLessons[key]; return {...state,completedLessons:{...state.completedLessons,[key]:{bestPct:Math.max(prev?.bestPct??0,pct),lastPct:pct,timesPlayed:(prev?.timesPlayed??0)+1}}};}); }
export function lessonResult(p: Progress, education: Education, lessonId: string): LessonResult | undefined { return educationState(p,education).completedLessons[lessonProgressKey(education,lessonId)]; }
export function categoryStat(p: Progress, education: Education, categoryId: string): CategoryStat | undefined { return educationState(p,education).categoryStats[categoryProgressKey(education,categoryId)]; }
export function isLessonPassed(p: Progress, education: Education, lessonId: string): boolean { const r=lessonResult(p,education,lessonId); return !!r && r.bestPct>=LESSON_PASS_THRESHOLD; }
export function getLevelInfo(xp:number){const levels=[{threshold:0,title:"Sprognovice"},{threshold:100,title:"Ordklasse-lærling"},{threshold:250,title:"Sætningsanalytiker"},{threshold:500,title:"Morfem-mester"},{threshold:900,title:"Syntaks-kender"},{threshold:1400,title:"Latin-kandidat"},{threshold:2000,title:"AP-ekspert"},{threshold:3000,title:"🐐AP-GED🐐"}];let level=0;for(let i=0;i<levels.length;i++)if(xp>=levels[i].threshold)level=i;const current=levels[level],next=levels[level+1],intoLevel=xp-current.threshold;return{level:level+1,title:current.title,intoLevel,forNext:next?next.threshold-current.threshold:intoLevel};}
