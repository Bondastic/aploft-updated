"use client";

import { useState } from "react";
import type { CategoryId, Education, MascotPose, Progress, Task, Track } from "../types";
import { isContentTask } from "../types";
import { ALMEN_CATEGORIES, CATEGORY_COLOR_CLASSES, HHX_CATEGORIES, LATIN_CATEGORIES, getCategory } from "../data/categories";
import { buildSessionTasks, getCategoryPath, isContentOnlyLesson, type LessonNode } from "../data/paths";
import { LESSON_PASS_THRESHOLD } from "../lib/progress";
import { getEducation } from "../lib/education";
import Mascot from "../components/Mascot";
import TaskRenderer from "../components/tasks/TaskRenderer";
import { cn } from "../utils/cn";
import { CategoryIcon, CheckIcon, ChevronRightIcon, LockIcon } from "../components/icons";

type View = "categories" | "path" | "session" | "result";

export default function PracticePage({
  education,
  progress,
  onCorrect,
  onWrong,
  onLessonComplete,
}: {
  education: Education;
  progress: Progress;
  onCorrect: (category: CategoryId) => void;
  onWrong: (category: CategoryId) => void;
  onLessonComplete: (lessonId: string, pct: number) => void;
}) {
  const [tab, setTab] = useState<Track>(education === "hhx" ? "hhx" : "almen");
  const [view, setView] = useState<View>("categories");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [activeNode, setActiveNode] = useState<LessonNode | null>(null);

  const [sessionTasks, setSessionTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [pose, setPose] = useState<MascotPose>("explain");
  const [prevBestPct, setPrevBestPct] = useState<number | null>(null);

  const isHhx = education === "hhx";
  const theme = getEducation(education);
  const categories = isHhx ? HHX_CATEGORIES : tab === "almen" ? ALMEN_CATEGORIES : LATIN_CATEGORIES;
  const reduceMotion = progress.settings.reduceMotion;

  function openCategory(catId: CategoryId) {
    setActiveCategory(catId);
    setView("path");
  }

  // Antal opgaver i den aktive session, der reelt bedømmes (dvs. ikke rene
  // undervisningstrin uden rigtigt/forkert). Bruges til procent-udregning.
  const gradableCount = sessionTasks.filter((t) => !isContentTask(t)).length;

  function startLesson(node: LessonNode) {
    const alreadyPassed = (progress.completedLessons[node.id]?.bestPct ?? 0) >= LESSON_PASS_THRESHOLD;
    // FØRSTE gennemgang: fast rækkefølge med undervisning før opgaver.
    // EFTER beståelse: bland kun opgaverne. Rene intro-forløb (kun teach/info)
    // vises igen, så sessionen aldrig bliver tom.
    const tasks = buildSessionTasks(node, education, alreadyPassed);
    setActiveNode(node);
    setSessionTasks(tasks);
    setIndex(0);
    setAnswered(false);
    setCorrectCount(0);
    setPose("explain");
    setView("session");
  }

  function finishSession() {
    const pct = gradableCount > 0 ? Math.round((correctCount / gradableCount) * 100) : 100;
    // Gem den tidligere bedste score FØR vi opdaterer den, så resultatskærmen
    // kan vise en tydelig sammenligning ("ny rekord" / "bedste er stadig X%").
    setPrevBestPct(activeNode ? progress.completedLessons[activeNode.id]?.bestPct ?? null : null);
    if (activeNode) onLessonComplete(activeNode.id, pct);
    setPose("celebrate");
    setView("result");
  }

  function handleSubmit(correct: boolean) {
    const task = sessionTasks[index];
    if (!task) return;
    if (isContentTask(task)) {
      // Undervisningstrin: ingen rigtigt/forkert. Gå videre med det samme,
      // så eleven ikke skal trykke både "Forstået" og "Næste".
      setPose("explain");
      if (index + 1 >= sessionTasks.length) {
        finishSession();
      } else {
        setIndex((i) => i + 1);
        setAnswered(false);
        setPose("thinking");
      }
      return;
    }
    setAnswered(true);
    const category = task.category;
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
      finishSession();
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
    if (!task) {
      return (
        <div className="mx-auto max-w-2xl space-y-5 px-4 pb-28 pt-10 text-center">
          <Mascot pose="surprise" size="md" className="mx-auto justify-center" reduceMotion={reduceMotion} />
          <h2 className="font-display text-2xl font-extrabold text-ink">Ingen opgaver her</h2>
          <p className="text-sm text-ink/60">
            Dette forløb har ingen opgaver lige nu. Gå tilbage og vælg et andet, eller prøv igen senere.
          </p>
          <button onClick={() => setView("path")} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-md">
            Tilbage til forløb
          </button>
        </div>
      );
    }
    const cat = getCategory(task.category, education);
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
          <div className={cn("h-full rounded-full transition-all", theme.bar)} style={{ width: `${(index / sessionTasks.length) * 100}%` }} />
        </div>
        {gradableCount > 0 && (index > 0 || answered) && (
          <p className="text-center text-xs font-semibold text-ink/40" aria-live="polite">
            Løbende score: {correctCount} rigtige ud af{" "}
            {sessionTasks.slice(0, index + (answered ? 1 : 0)).filter((t) => !isContentTask(t)).length} besvarede opgaver
          </p>
        )}
        <Mascot pose={pose} size="sm" reduceMotion={reduceMotion} />
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
          <TaskRenderer key={task.id} task={task} onSubmit={handleSubmit} reduceMotion={reduceMotion} />
        </div>
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
    const pct = gradableCount > 0 ? Math.round((correctCount / gradableCount) * 100) : 100;
    const passed = pct >= LESSON_PASS_THRESHOLD;
    const isFirstAttempt = prevBestPct === null;
    const bestPctNow = Math.max(pct, prevBestPct ?? 0);
    const isNewBest = !isFirstAttempt && pct > (prevBestPct ?? 0);
    const isSameAsBest = !isFirstAttempt && pct === prevBestPct;
    const contentOnly = gradableCount === 0;
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-10 text-center">
        <Mascot pose={pct >= 70 ? "celebrate" : "encourage"} size="lg" className="mx-auto justify-center" reduceMotion={reduceMotion} />
        <h2 className="font-display text-2xl font-extrabold text-ink">{activeNode?.title ?? "Forløb"} klaret!</h2>
        {contentOnly ? (
          <p className="text-ink/60">Du har læst introduktionen. Du kan altid åbne den igen, hvis du vil friske den op.</p>
        ) : (
          <p className="text-ink/60">
            Du fik <span className={cn("font-bold", theme.accentText)}>{correctCount}</span> ud af {gradableCount} rigtige (
            <span className="font-bold">{pct}%</span>).
          </p>
        )}
        {passed ? (
          <p className="mx-auto max-w-sm rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {contentOnly ? "Næste forløb i rækken er nu låst op." : "Bestået! Det næste forløb i rækken er nu låst op."}
          </p>
        ) : (
          <p className="mx-auto max-w-sm rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            Du skal have mindst {LESSON_PASS_THRESHOLD}% rigtige for at låse det næste forløb op. Prøv igen. Det går bedre næste gang!
          </p>
        )}
        {!contentOnly && !isFirstAttempt && (
          <p
            className={cn(
              "mx-auto max-w-sm rounded-2xl px-4 py-3 text-sm font-semibold",
              isNewBest ? cn("bg-ink/5", theme.accentText) : "bg-ink/5 text-ink/60"
            )}
            aria-live="polite"
          >
            {isNewBest && <>🎉 Ny rekord! Din bedste score i dette forløb er nu {bestPctNow}% (forrige bedste: {prevBestPct}%).</>}
            {isSameAsBest && <>Du matchede din bedste score på {bestPctNow}%.</>}
            {!isNewBest && !isSameAsBest && (
              <>Din bedste score for dette forløb er stadig {bestPctNow}% (denne gang fik du {pct}%). Den højeste score gemmes altid.</>
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
              className={cn("rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md", theme.solidBg)}
            >
              {contentOnly ? "Læs introduktionen igen" : "Øv dette forløb igen"}
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
    const cat = getCategory(activeCategory, education);
    if (!cat) {
      return (
        <div className="mx-auto max-w-2xl space-y-5 px-4 pb-28 pt-10 text-center">
          <h2 className="font-display text-2xl font-extrabold text-ink">Kategorien findes ikke</h2>
          <button onClick={() => setView("categories")} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-md">
            Tilbage til kategorier
          </button>
        </div>
      );
    }
    const colors = CATEGORY_COLOR_CLASSES[cat.color];
    const path = getCategoryPath(activeCategory, education);
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
              <span className={cn("font-bold", theme.accentText)}>{overallPct}% rigtige</span>
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
            const contentOnly = isContentOnlyLesson(node, education);

            return (
              <li key={node.id}>
                <button
                  onClick={() => unlocked && startLesson(node)}
                  disabled={!unlocked}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
                    unlocked ? "border-ink/10 bg-white hover:-translate-y-0.5 hover:shadow-md" : "cursor-not-allowed border-ink/5 bg-ink/5 opacity-60",
                    isReview && unlocked && cn("border-ink/10 bg-ink/5")
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
                      {isReview && (
                        <span className={cn("ml-2 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase", theme.accentText)}>
                          Opsamling
                        </span>
                      )}
                      {contentOnly && (
                        <span className={cn("ml-2 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase", theme.accentText)}>
                          Intro
                        </span>
                      )}
                    </p>
                    {result ? (
                      <p className="text-xs text-ink/50">
                        {contentOnly
                          ? `Læst · kan læses igen · åbnet ${result.timesPlayed}×`
                          : `Bedste resultat: ${result.bestPct}% rigtige · forsøgt ${result.timesPlayed}×`}
                      </p>
                    ) : unlocked ? (
                      <p className="text-xs text-ink/40">{contentOnly ? "Kort introduktion · kan læses igen bagefter" : "Ikke forsøgt endnu"}</p>
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
        <p className="text-sm text-ink/50">
          {isHhx
            ? "Her er HHX-pensum: fælles grammatik + kommunikation, semantik, pragmatik, genrer, sproghistorie og læringsstrategier."
            : "Vælg en kategori for at se dens forløb. De vigtigste og mest grundlæggende emner står øverst."}
        </p>
      </div>

      {isHhx ? (
        <div className="flex rounded-2xl bg-ink/5 p-1">
          <div className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-sm font-bold shadow-sm text-blue-600">
            <CategoryIcon name="hhx" className="h-4 w-4" />
            HHX-pensum
          </div>
        </div>
      ) : (
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
      )}

      <div className="space-y-3">
        {categories.map((cat) => {
          const stat = progress.categoryStats[cat.id];
          const colors = CATEGORY_COLOR_CLASSES[cat.color];
          const pct = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
          const path = getCategoryPath(cat.id, education);
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
