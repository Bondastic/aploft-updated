"use client";

import { useState } from "react";
import type { CategoryId, MascotPose, Progress, Task, Track } from "../types";
import { ALMEN_CATEGORIES, CATEGORY_COLOR_CLASSES, LATIN_CATEGORIES, getCategory } from "../data/categories";
import { getCategoryPath, getLessonTasks, type LessonNode } from "../data/paths";
import { LESSON_PASS_THRESHOLD } from "../lib/progress";
import Mascot from "../components/Mascot";
import TaskRenderer from "../components/tasks/TaskRenderer";
import TranslationSheet from "../components/TranslationSheet";
import { cn } from "../utils/cn";
import { CategoryIcon, CheckIcon, ChevronRightIcon, LockIcon } from "../components/icons";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type View = "categories" | "path" | "session" | "result";

export default function PracticePage({
  progress,
  onCorrect,
  onWrong,
  onLessonComplete,
}: {
  progress: Progress;
  onCorrect: (category: CategoryId) => void;
  onWrong: (category: CategoryId) => void;
  onLessonComplete: (lessonId: string, pct: number) => void;
}) {
  const [tab, setTab] = useState<Track>("almen");
  const [view, setView] = useState<View>("categories");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [activeNode, setActiveNode] = useState<LessonNode | null>(null);

  const [sessionTasks, setSessionTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [pose, setPose] = useState<MascotPose>("explain");
  const [prevBestPct, setPrevBestPct] = useState<number | null>(null);

  const categories = tab === "almen" ? ALMEN_CATEGORIES : LATIN_CATEGORIES;
  const reduceMotion = progress.settings.reduceMotion;

  function openCategory(catId: CategoryId) {
    setActiveCategory(catId);
    setView("path");
  }

  function startLesson(node: LessonNode) {
    const tasks = shuffle(getLessonTasks(node));
    setActiveNode(node);
    setSessionTasks(tasks);
    setIndex(0);
    setAnswered(false);
    setCorrectCount(0);
    setPose("explain");
    setView("session");
  }

  function handleSubmit(correct: boolean) {
    const category = sessionTasks[index].category;
    setAnswered(true);
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
    if (index + 1 >= sessionTasks.length) {
      const pct = Math.round((correctCount / sessionTasks.length) * 100);
      // Gem den tidligere bedste score FØR vi opdaterer den, så resultatskærmen
      // kan vise en tydelig sammenligning ("ny rekord" / "bedste er stadig X%").
      setPrevBestPct(activeNode ? progress.completedLessons[activeNode.id]?.bestPct ?? null : null);
      if (activeNode) onLessonComplete(activeNode.id, pct);
      setPose("celebrate");
      setView("result");
    } else {
      setIndex((i) => i + 1);
      setAnswered(false);
      setPose("thinking");
    }
  }

  // ---------------------------------------------------------------------
  // SESSION (aktiv opgave)
  // ---------------------------------------------------------------------
  if (view === "session") {
    const task = sessionTasks[index];
    const cat = getCategory(task.category);
    return (
      <div className="mx-auto max-w-2xl space-y-5 px-4 pb-28 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setView("path")} className="text-sm font-semibold text-ink/50 hover:text-ink">
            ← Afbryd
          </button>
          <p className="text-sm font-semibold text-ink/50" aria-live="polite">
            {index + 1} / {sessionTasks.length} · {activeNode?.title ?? cat?.title}
          </p>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-ink/10"
          role="progressbar"
          aria-valuenow={index}
          aria-valuemin={0}
          aria-valuemax={sessionTasks.length}
          aria-label="Fremgang i forløbet"
        >
          <div className="h-full rounded-full bg-purple transition-all" style={{ width: `${(index / sessionTasks.length) * 100}%` }} />
        </div>
        {(index > 0 || answered) && (
          <p className="text-center text-xs font-semibold text-ink/40" aria-live="polite">
            Løbende score: {correctCount} rigtige ud af {index + (answered ? 1 : 0)} besvarede
          </p>
        )}
        <Mascot pose={pose} size="sm" reduceMotion={reduceMotion} />
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
          <TaskRenderer key={task.id} task={task} onSubmit={handleSubmit} />
        </div>
        {(task.category === "oversaettelse" || task.category === "sumesse" || task.showSheet) && (
          <TranslationSheet reduceMotion={reduceMotion} />
        )}
        {answered && (
          <button onClick={next} className="w-full rounded-full bg-ink py-3 text-sm font-bold text-white shadow-md">
            {index + 1 >= sessionTasks.length ? "Se resultat →" : "Næste →"}
          </button>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // RESULTAT
  // ---------------------------------------------------------------------
  if (view === "result") {
    const pct = sessionTasks.length > 0 ? Math.round((correctCount / sessionTasks.length) * 100) : 0;
    const passed = pct >= LESSON_PASS_THRESHOLD;
    const isFirstAttempt = prevBestPct === null;
    const bestPctNow = Math.max(pct, prevBestPct ?? 0);
    const isNewBest = !isFirstAttempt && pct > (prevBestPct ?? 0);
    const isSameAsBest = !isFirstAttempt && pct === prevBestPct;
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-10 text-center">
        <Mascot pose={pct >= 70 ? "celebrate" : "encourage"} size="lg" className="mx-auto justify-center" reduceMotion={reduceMotion} />
        <h2 className="font-display text-2xl font-extrabold text-ink">{activeNode?.title ?? "Forløb"} klaret!</h2>
        <p className="text-ink/60">
          Du fik <span className="font-bold text-purple">{correctCount}</span> ud af {sessionTasks.length} rigtige (
          <span className="font-bold">{pct}%</span>).
        </p>
        {passed ? (
          <p className="mx-auto max-w-sm rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Bestået! Det næste forløb i rækken er nu låst op.
          </p>
        ) : (
          <p className="mx-auto max-w-sm rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            Du skal have mindst {LESSON_PASS_THRESHOLD}% rigtige for at låse det næste forløb op. Prøv igen — det går bedre næste gang!
          </p>
        )}
        {!isFirstAttempt && (
          <p
            className={cn(
              "mx-auto max-w-sm rounded-2xl px-4 py-3 text-sm font-semibold",
              isNewBest ? "bg-purple/10 text-purple" : "bg-ink/5 text-ink/60"
            )}
            aria-live="polite"
          >
            {isNewBest && <>🎉 Ny rekord! Din bedste score i dette forløb er nu {bestPctNow}% (forrige bedste: {prevBestPct}%).</>}
            {isSameAsBest && <>Du matchede din bedste score på {bestPctNow}%.</>}
            {!isNewBest && !isSameAsBest && (
              <>Din bedste score for dette forløb er stadig {bestPctNow}% (denne gang fik du {pct}%) — den højeste score gemmes altid.</>
            )}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => setView("path")} className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink">
            Tilbage til forløb
          </button>
          {activeNode && (
            <button
              onClick={() => startLesson(activeNode)}
              className="rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30"
            >
              Øv dette forløb igen
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // PATH (forløbsoversigt for én kategori)
  // ---------------------------------------------------------------------
  if (view === "path" && activeCategory) {
    const cat = getCategory(activeCategory)!;
    const colors = CATEGORY_COLOR_CLASSES[cat.color];
    const path = getCategoryPath(activeCategory);
    const stat = progress.categoryStats[activeCategory];
    const overallPct = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;

    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
        <button onClick={() => setView("categories")} className="text-sm font-semibold text-ink/50 hover:text-ink">
          ← Alle kategorier
        </button>

        <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", colors.bg, colors.text)}>
            <CategoryIcon name={cat.icon} className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-extrabold text-ink">{cat.title}</h1>
            <p className="text-xs text-ink/50">{cat.description}</p>
          </div>
        </div>

        {overallPct !== null && (
          <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-bold text-ink">Din gennemsnitlige score i {cat.short}</span>
              <span className="font-bold text-purple">{overallPct}% rigtige</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div className={cn("h-full rounded-full", colors.solid)} style={{ width: `${overallPct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-ink/40">
              Baseret på {stat!.total} besvarede opgaver i alt · viser den procentdel, du i gennemsnit har svaret rigtigt på
            </p>
          </div>
        )}

        <div>
          <h2 className="font-display text-lg font-extrabold text-ink">Forløb du kan vælge</h2>
          <p className="text-sm text-ink/50">
            Følg stien nedefra: hvert forløb låser det næste op, når du består med mindst {LESSON_PASS_THRESHOLD}% rigtige. Til sidst venter
            en opsamlingstest med spørgsmål fra hele kategorien.
          </p>
        </div>

        <ol className="space-y-3">
          {path.nodes.map((node, i) => {
            const prevNode = path.nodes[i - 1];
            const unlocked = i === 0 || (prevNode && progress.completedLessons[prevNode.id]?.bestPct !== undefined && progress.completedLessons[prevNode.id]!.bestPct >= LESSON_PASS_THRESHOLD);
            const result = progress.completedLessons[node.id];
            const passed = !!result && result.bestPct >= LESSON_PASS_THRESHOLD;
            const isReview = node.kind === "review";

            return (
              <li key={node.id}>
                <button
                  onClick={() => unlocked && startLesson(node)}
                  disabled={!unlocked}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
                    unlocked ? "border-ink/10 bg-white hover:-translate-y-0.5 hover:shadow-md" : "cursor-not-allowed border-ink/5 bg-ink/5 opacity-60",
                    isReview && unlocked && "border-purple/30 bg-purple/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                      passed ? "bg-emerald-100 text-emerald-700" : unlocked ? cn(colors.bg, colors.text) : "bg-ink/10 text-ink/30"
                    )}
                  >
                    {passed ? <CheckIcon className="h-5 w-5" /> : unlocked ? i + 1 : <LockIcon className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-bold", unlocked ? "text-ink" : "text-ink/40")}>
                      {node.title}
                      {isReview && <span className="ml-2 rounded-full bg-purple/10 px-2 py-0.5 text-[10px] font-bold uppercase text-purple">Opsamling</span>}
                    </p>
                    {result ? (
                      <p className="text-xs text-ink/50">Bedste resultat: {result.bestPct}% rigtige · forsøgt {result.timesPlayed}×</p>
                    ) : unlocked ? (
                      <p className="text-xs text-ink/40">Ikke forsøgt endnu</p>
                    ) : (
                      <p className="text-xs text-ink/40">Lås op ved at bestå forløbet ovenfor</p>
                    )}
                  </div>
                  {unlocked && <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // KATEGORIER (forside for Øv dig)
  // ---------------------------------------------------------------------
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Øv dig</h1>
        <p className="text-sm text-ink/50">Vælg en kategori for at se dens forløb — de vigtigste og mest grundlæggende emner står øverst.</p>
      </div>

      <div className="flex rounded-2xl bg-ink/5 p-1">
        <button
          onClick={() => setTab("almen")}
          className={cn("flex-1 rounded-xl py-2 text-sm font-bold transition", tab === "almen" ? "bg-white text-purple shadow-sm" : "text-ink/40")}
        >
          <span className="inline-flex items-center justify-center gap-1.5">
            <CategoryIcon name="almen" className="h-4 w-4" />
            Almen del
          </span>
        </button>
        <button
          onClick={() => setTab("latin")}
          className={cn("flex-1 rounded-xl py-2 text-sm font-bold transition", tab === "latin" ? "bg-white text-orange-600 shadow-sm" : "text-ink/40")}
        >
          <span className="inline-flex items-center justify-center gap-1.5">
            <CategoryIcon name="latin" className="h-4 w-4" />
            Latindel
          </span>
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const stat = progress.categoryStats[cat.id];
          const colors = CATEGORY_COLOR_CLASSES[cat.color];
          const pct = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
          const path = getCategoryPath(cat.id);
          const lessonsPassed = path.nodes.filter((n) => (progress.completedLessons[n.id]?.bestPct ?? 0) >= LESSON_PASS_THRESHOLD).length;
          return (
            <button
              key={cat.id}
              onClick={() => openCategory(cat.id)}
              className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
            >
              <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", colors.bg, colors.text)}>
                <CategoryIcon name={cat.icon} className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">{cat.title}</p>
                <p className="truncate text-xs text-ink/50">{cat.description}</p>
                <p className="mt-0.5 text-[11px] text-ink/40">
                  {lessonsPassed}/{path.nodes.length} forløb bestået
                  {pct !== null && <> · {pct}% rigtige i gennemsnit</>}
                </p>
                {pct !== null && (
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div className={cn("h-full rounded-full", colors.solid)} style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
