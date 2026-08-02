"use client";

import { useMemo, useState } from "react";
import type { CategoryId, CategoryStat, IconName, MascotPose, Progress, Task } from "../types";
import { generateExam, estimateMinutes, poolForTrack, ALL_TASKS, type ExamTrack } from "../lib/examGenerator";
import { getCategory } from "../data/categories";
import Mascot from "../components/Mascot";
import TaskRenderer from "../components/tasks/TaskRenderer";
import TranslationSheet from "../components/TranslationSheet";
import { cn } from "../utils/cn";
import { CategoryIcon, ClockIcon, ExamIcon } from "../components/icons";

const TRACK_INFO: Record<ExamTrack, { label: string; icon: IconName; desc: string }> = {
  almen: { label: "Almen del", icon: "almen", desc: "Ordklasser, sætningsled, morfologi, tempus, kasus, syntaks og sprog." },
  latin: { label: "Latindel", icon: "latin", desc: "Ordforråd, grammatik, oversættelse og romersk kultur." },
  fuld: { label: "Fuld prøve", icon: "fuld", desc: "Blander spørgsmål fra både den almene del og latindelen." },
  ultimativ: {
    label: "Den ultimative test",
    icon: "ultimativ",
    desc: `Vælg selv længden, fra 50 op til alle ${ALL_TASKS.length} spørgsmål i hele banken.`,
  },
};

export default function ExamPage({
  progress,
  onCorrect,
  onWrong,
  onExamComplete,
}: {
  progress: Progress;
  onCorrect: (category: CategoryId) => void;
  onWrong: (category: CategoryId) => void;
  onExamComplete: (track: ExamTrack, correct: number, total: number, byCategory: Record<string, CategoryStat>) => void;
}) {
  const [phase, setPhase] = useState<"setup" | "running" | "result">("setup");
  const [track, setTrack] = useState<ExamTrack>("fuld");
  const [count, setCount] = useState(12);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [byCategory, setByCategory] = useState<Record<string, CategoryStat>>({});
  const [pose, setPose] = useState<MascotPose>("explain");
  const reduceMotion = progress.settings.reduceMotion;

  const poolSize = poolForTrack(track).length;
  const isUltimate = track === "ultimativ";
  const maxCount = isUltimate ? poolSize : Math.min(28, poolSize);
  const minCount = isUltimate ? Math.min(50, poolSize) : Math.min(6, poolSize);
  const step = isUltimate ? 1 : 2;
  const categoryEntries = useMemo(() => Object.entries(byCategory), [byCategory]);

  function startExam() {
    const generated = generateExam(track, count);
    setTasks(generated);
    setIndex(0);
    setAnswered(false);
    setCorrectCount(0);
    setByCategory({});
    setPose("explain");
    setPhase("running");
  }

  function finishNow() {
    onExamComplete(track, correctCount, index + (answered ? 1 : 0), byCategory);
    setPose("celebrate");
    setPhase("result");
  }

  function handleSubmit(correct: boolean) {
    const category = tasks[index].category;
    setAnswered(true);
    setByCategory((prev) => {
      const stat: CategoryStat = prev[category] ?? { correct: 0, total: 0 };
      return { ...prev, [category]: { correct: stat.correct + (correct ? 1 : 0), total: stat.total + 1 } };
    });
    if (correct) {
      onCorrect(category);
      setCorrectCount((c) => c + 1);
      setPose(Math.random() > 0.5 ? "celebrate" : "thumbsup");
    } else {
      onWrong(category);
      setPose(Math.random() > 0.5 ? "encourage" : "surprise");
    }
  }

  function next() {
    if (index + 1 >= tasks.length) {
      onExamComplete(track, correctCount, tasks.length, byCategory);
      setPose("celebrate");
      setPhase("result");
    } else {
      setIndex((i) => i + 1);
      setAnswered(false);
      setPose("thinking");
    }
  }

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Tag en prøve</h1>
          <p className="text-sm text-ink/50">Vælg spor og hvor lang prøven skal være, så finder vi de bedste spørgsmål til dig.</p>
        </div>

        <Mascot pose="explain" size="md" speech="Vælg selv sværhedsgrad og længde. Jeg samler spørgsmålene til dig!" reduceMotion={reduceMotion} />

        <div className="space-y-3">
          {(Object.keys(TRACK_INFO) as ExamTrack[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTrack(t);
                const newPoolSize = poolForTrack(t).length;
                const newMax = t === "ultimativ" ? newPoolSize : Math.min(28, newPoolSize);
                const newMin = t === "ultimativ" ? Math.min(50, newPoolSize) : Math.min(6, newPoolSize);
                setCount(t === "ultimativ" ? newMin : Math.min(Math.max(count, newMin), newMax));
              }}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
                track === t ? "border-purple bg-purple/5" : "border-ink/10 bg-white hover:border-purple/30"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple">
                <CategoryIcon name={TRACK_INFO[t].icon} className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-ink">{TRACK_INFO[t].label}</p>
                <p className="text-xs text-ink/50">{TRACK_INFO[t].desc}</p>
              </div>
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  track === t ? "border-purple bg-purple" : "border-ink/20"
                )}
              >
                {track === t && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-bold text-ink">Antal spørgsmål</p>
            <span className="rounded-full bg-purple/10 px-3 py-1 text-sm font-bold text-purple">{count}</span>
          </div>
          <label htmlFor="exam-count" className="sr-only">
            Antal spørgsmål
          </label>
          <input
            id="exam-count"
            type="range"
            min={minCount}
            max={maxCount}
            step={step}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-purple"
          />
          <div className="mt-1 flex justify-between text-[11px] text-ink/40">
            <span>{minCount} spørgsmål</span>
            <span>{maxCount} spørgsmål</span>
          </div>
          {isUltimate && (
            <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Den ultimative test trækker fra alle {poolSize}  spørgsmål i hele banken (almen + latin). Du kan altid trykke
              &quot;Afslut prøven nu&quot; undervejs for at se dit resultat baseret på de spørgsmål, du nåede.
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-ink/5 px-3 py-2 text-sm font-semibold text-ink/70">
            <ClockIcon className="h-4 w-4" />
            Estimeret tid: ≈ {estimateMinutes(count)} min
          </div>
        </div>

        <button
          onClick={startExam}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple to-purple-dark py-3.5 text-base font-bold text-white shadow-lg shadow-purple/30"
        >
          <ExamIcon className="h-5 w-5" />
          Start prøve
        </button>
      </div>
    );
  }

  if (phase === "running") {
    const task = tasks[index];
    return (
      <div className="mx-auto max-w-2xl space-y-5 px-4 pb-28 pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink/50" aria-live="polite">
            Spørgsmål {index + 1} / {tasks.length}
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/50">
            <CategoryIcon name={TRACK_INFO[track].icon} className="h-4 w-4" />
            {TRACK_INFO[track].label}
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={tasks.length}>
          <div className="h-full rounded-full bg-purple transition-all" style={{ width: `${(index / tasks.length) * 100}%` }} />
        </div>
        <Mascot pose={pose} size="sm" reduceMotion={reduceMotion} />
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
          <TaskRenderer key={task.id} task={task} onSubmit={handleSubmit} />
        </div>
        {task.showSheet && <TranslationSheet reduceMotion={reduceMotion} />}
        {answered && (
          <button onClick={next} className="w-full rounded-full bg-ink py-3 text-sm font-bold text-white shadow-md">
            {index + 1 >= tasks.length ? "Se resultat →" : "Næste →"}
          </button>
        )}
        {isUltimate && (
          <button onClick={finishNow} className="w-full rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink/60 hover:border-rose-300 hover:text-rose-600">
            Afslut prøven nu og se resultat
          </button>
        )}
      </div>
    );
  }

  // result
  const pct = tasks.length > 0 ? Math.round((correctCount / (categoryEntries.reduce((s, [, v]) => s + v.total, 0) || tasks.length)) * 100) : 0;
  const totalAnswered = categoryEntries.reduce((s, [, v]) => s + v.total, 0) || tasks.length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-8 text-center">
      <Mascot pose={pct >= 70 ? "celebrate" : pct >= 40 ? "thumbsup" : "encourage"} size="lg" className="mx-auto justify-center" reduceMotion={reduceMotion} />
      <div>
        <h2 className="font-display text-2xl font-extrabold text-ink">Prøven er afsluttet!</h2>
        <p className="mt-1 text-ink/60">
          Du fik <span className="font-bold text-purple">{correctCount}</span> ud af {totalAnswered} rigtige. Det giver {pct}%.
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-ink/10 bg-white p-5 text-left shadow-sm">
        <p className="mb-2 text-sm font-bold text-ink">Resultat pr. kategori</p>
        {categoryEntries.map(([catId, stat]) => {
          const cat = getCategory(catId);
          const p = Math.round((stat.correct / stat.total) * 100);
          return (
            <div key={catId} className="flex items-center gap-3 text-sm">
              <span className="inline-flex w-44 shrink-0 items-center gap-1.5 truncate text-ink/70">
                <CategoryIcon name={cat?.icon ?? "almen"} className="h-4 w-4 shrink-0" />
                <span className="truncate">{cat?.short ?? catId}</span>
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-purple" style={{ width: `${p}%` }} />
              </div>
              <span className="w-14 shrink-0 text-right text-xs font-semibold text-ink/50">
                {stat.correct}/{stat.total}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setPhase("setup")} className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink">
          Ny prøve
        </button>
        <button
          onClick={startExam}
          className="rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30"
        >
          Prøv igen
        </button>
      </div>
    </div>
  );
}
