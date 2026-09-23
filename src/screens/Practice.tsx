"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CategoryId, Education, MascotPose, Progress, SavedAnswer, Task, Track } from "../types";
import { isContentTask } from "../types";
import { ALMEN_CATEGORIES, CATEGORY_COLOR_CLASSES, HHX_CATEGORIES, LATIN_CATEGORIES, getCategory } from "../data/categories";
import { buildSessionTasks, getCategoryPath, isContentOnlyLesson, type LessonNode } from "../data/paths";
import { getCategoryHighScoreAverage, isManuallyUnlocked, LESSON_PASS_THRESHOLD } from "../lib/progress";
import { getEducation } from "../lib/education";
import Mascot from "../components/Mascot";
import TaskRenderer from "../components/tasks/TaskRenderer";
import SessionNav from "../components/SessionNav";
import { cn } from "../utils/cn";
import { CategoryIcon, CheckIcon, ChevronRightIcon, LockIcon } from "../components/icons";

type Outcome = { ok: boolean | "content"; answer?: SavedAnswer } | null;

type View = "categories" | "path" | "session" | "result";

export default function PracticePage({
  education,
  progress,
  onCorrect,
  onWrong,
  onLessonComplete,
  onUnlockLessons,
  onSessionChange,
}: {
  education: Education;
  progress: Progress;
  onCorrect: (category: CategoryId) => void;
  onWrong: (category: CategoryId) => void;
  onLessonComplete: (lessonId: string, pct: number) => void;
  onUnlockLessons: (lessonIds: string[]) => void;
  /** Melder tilbage når en opgave-session er IGANGVÆRENDE, så app-skallen kan
   *  advare ("Er du sikker?") før navigation væk midt i en opgave. */
  onSessionChange?: (active: boolean) => void;
}) {
  const [tab, setTab] = useState<Track>(education === "hhx" ? "hhx" : "almen");
  const [view, setView] = useState<View>("categories");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [activeNode, setActiveNode] = useState<LessonNode | null>(null);

  const [sessionTasks, setSessionTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [reached, setReached] = useState(0);
  const [results, setResults] = useState<Outcome[]>([]);
  const [pose, setPose] = useState<MascotPose>("explain");
  const [prevBestPct, setPrevBestPct] = useState<number | null>(null);
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<{ node: LessonNode; throughIds: string[] } | null>(null);
  // Sekventiel oplåsning: "unlockingIds" er rækkefølgen, "revealedIds" dem der
  // allerede er låst op. Bruges til at vise, at forløbene åbner et ad gangen.
  const [unlockingIds, setUnlockingIds] = useState<string[]>([]);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  // Referencer, så de sekventielle timeouts ikke nulstilles, når forælderen
  // re-renderer (onUnlockLessons skifter identitet hver render).
  const onUnlockLessonsRef = useRef(onUnlockLessons);
  useEffect(() => {
    onUnlockLessonsRef.current = onUnlockLessons;
  }, [onUnlockLessons]);

  // Session-rapport til app-skallen (kun selve øvelsen tæller som "i gang").
  const onSessionChangeRef = useRef(onSessionChange);
  useEffect(() => {
    onSessionChangeRef.current = onSessionChange;
  }, [onSessionChange]);
  useEffect(() => {
    onSessionChangeRef.current?.(view === "session");
  }, [view]);

  const isHhx = education === "hhx";
  const theme = getEducation(education);
  const categories = isHhx ? HHX_CATEGORIES : tab === "almen" ? ALMEN_CATEGORIES : LATIN_CATEGORIES;
  const reduceMotion = progress.settings.reduceMotion;

  // Sekventiel oplåsning: åbn forløbene et ad gangen (med ~420 ms imellem),
  // så man kan se dem låse op én for én. Ved reduceMotion springes animationen
  // over, og alt låses op med det samme.
  useEffect(() => {
    if (unlockingIds.length === 0) return;
    if (revealedIds.length >= unlockingIds.length) return;
    const nextId = unlockingIds[revealedIds.length];
    const timer = window.setTimeout(() => {
      setRevealedIds((prev) => [...prev, nextId]);
      onUnlockLessonsRef.current([nextId]);
    }, reduceMotion ? 0 : 420);
    return () => window.clearTimeout(timer);
  }, [unlockingIds, revealedIds, reduceMotion]);

  function openCategory(catId: CategoryId) {
    setActiveCategory(catId);
    setView("path");
  }

  // Antal opgaver i den aktive session, der reelt bedømmes (dvs. ikke rene
  // undervisningstrin uden rigtigt/forkert). Bruges til procent-udregning.
  const gradableCount = sessionTasks.filter((t) => !isContentTask(t)).length;
  const correctCount = results.filter((r) => r?.ok === true).length;
  const outcome = results[index] ?? null;
  const answered = outcome !== null;
  const isReview = index < reached;

  function startLesson(node: LessonNode) {
    const alreadyPassed = (progress.completedLessons[node.id]?.bestPct ?? 0) >= LESSON_PASS_THRESHOLD;
    // FØRSTE gennemgang: fast rækkefølge med undervisning før opgaver.
    // EFTER beståelse: bland kun opgaverne. Rene intro-forløb (kun teach/info)
    // vises igen, så sessionen aldrig bliver tom.
    const tasks = buildSessionTasks(node, education, alreadyPassed);
    setActiveNode(node);
    setSessionTasks(tasks);
    setIndex(0);
    setReached(0);
    setResults(Array.from({ length: tasks.length }, () => null));
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

  function markOutcome(value: Outcome) {
    setResults((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSubmit(correct: boolean, answer?: SavedAnswer) {
    const task = sessionTasks[index];
    if (!task || answered) return;
    if (isContentTask(task)) {
      markOutcome({ ok: "content", answer: answer ?? { kind: "content" } });
      setPose("explain");
      if (index + 1 >= sessionTasks.length) {
        finishSession();
      } else {
        const nextI = index + 1;
        setIndex(nextI);
        setReached(nextI);
        setPose("thinking");
      }
      return;
    }
    markOutcome({ ok: correct, answer });
    const category = task.category;
    if (correct) {
      onCorrect(category);
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
      const nextI = index + 1;
      setIndex(nextI);
      setReached((r) => Math.max(r, nextI));
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
        <div className="app-page-narrow space-y-5 pt-10 text-center">
          <Mascot pose="surprise" size="md" className="mx-auto justify-center" reduceMotion={reduceMotion} />
          <h2 className="page-title">Ingen opgaver her</h2>
          <p className="text-sm text-ink/60">
            Dette forløb har ingen opgaver lige nu. Gå tilbage og vælg et andet, eller prøv igen senere.
          </p>
          <button onClick={() => setView("path")} className="btn btn-primary">
            Tilbage til forløb
          </button>
        </div>
      );
    }
    const cat = getCategory(task.category, education);
    return (
      <motion.div
        key="session"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page-narrow space-y-5"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setConfirmAbandon(true)}
            className="btn btn-danger px-3 py-1.5 text-xs"
          >
            Afbryd
          </button>
          <p className="text-sm font-semibold text-ink/50" aria-live="polite">
            {index + 1} / {sessionTasks.length} · {activeNode?.title ?? cat?.title}
          </p>
        </div>
        <SessionNav
          canBack={index > 0}
          canForward={index < reached}
          onBack={() => setIndex((i) => Math.max(0, i - 1))}
          onForward={() => setIndex((i) => Math.min(reached, i + 1))}
        />
        {isReview && (
          <p className="text-center text-xs font-semibold text-ink/40">Du kigger på et tidligere trin. Gå frem for at fortsætte, hvor du slap.</p>
        )}
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-ink/10"
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
        <motion.div
          key={`task-${task.id}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="card p-5"
        >
          <TaskRenderer
            key={task.id}
            task={task}
            onSubmit={handleSubmit}
            reduceMotion={reduceMotion}
            review={answered}
            reviewCorrect={outcome?.ok === true || outcome?.ok === "content"}
            savedAnswer={outcome?.answer}
          />
        </motion.div>
        {answered && !isReview && (
          <button onClick={next} className="btn btn-primary w-full py-3">
            {index + 1 >= sessionTasks.length ? "Se resultat →" : "Næste →"}
          </button>
        )}

        {confirmAbandon && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
            role="alertdialog"
            aria-modal="true"
            aria-label="Bekræft afbrydelse af forløbet"
            onClick={() => setConfirmAbandon(false)}
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="modal w-full max-w-sm space-y-3 p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="section-title">Afbryd forløbet midt i?</h3>
              <p className="text-sm leading-relaxed text-ink/60">
                Du er {index + 1} trin hen i forløbet. Afbryder du nu, <span className="font-bold text-ink">bliver fremdriften i netop denne session
                ikke gemt</span> (de enkelte rigtige og forkerte svar tæller dog med i din statistik). Forløbet skal startes forfra, hvis du vil have
                det bestået.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmAbandon(false)} className="btn btn-outline flex-1">
                  Bliv i forløbet
                </button>
                <button
                  onClick={() => {
                    setConfirmAbandon(false);
                    setView("path");
                  }}
                  className="btn btn-danger-solid flex-1"
                >
                  Afbryd alligevel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
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
      <motion.div
        key="result"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page-narrow space-y-6 pt-10 text-center"
      >
        <Mascot pose={pct >= 70 ? "celebrate" : "encourage"} size="lg" className="mx-auto justify-center" reduceMotion={reduceMotion} />
        <h2 className="page-title">{activeNode?.title ?? "Forløb"} klaret!</h2>
        {contentOnly ? (
          <p className="text-ink/60">Du har læst introduktionen. Du kan altid åbne den igen, hvis du vil friske den op.</p>
        ) : (
          <p className="text-ink/60">
            Du fik <span className={cn("font-bold", theme.accentText)}>{correctCount}</span> ud af {gradableCount} rigtige (
            <span className="font-bold">{pct}%</span>).
          </p>
        )}
        {passed ? (
          <p className="mx-auto max-w-sm rounded-md border-l-4 border-pine-base bg-pine-soft px-4 py-3 text-sm font-semibold text-pine-base">
            {contentOnly ? "Næste forløb i rækken er nu låst op." : "Bestået! Det næste forløb i rækken er nu låst op."}
          </p>
        ) : (
          <p className="mx-auto max-w-sm rounded-md border-l-4 border-ochre-base bg-ochre-soft px-4 py-3 text-sm font-semibold text-ochre-base">
            Du skal have mindst {LESSON_PASS_THRESHOLD}% rigtige for at låse det næste forløb op. Prøv igen. Det går bedre næste gang!
          </p>
        )}
        {!contentOnly && !isFirstAttempt && (
          <p
            className={cn(
              "mx-auto max-w-sm rounded-md px-4 py-3 text-sm font-semibold",
              isNewBest ? cn("bg-ink/[0.05]", theme.accentText) : "bg-ink/[0.05] text-ink/60"
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
          <button onClick={() => setView("path")} className="btn btn-outline">
            Tilbage til forløb
          </button>
          {activeNode && (
            <button
              onClick={() => startLesson(activeNode)}
              className={cn("btn", theme.solidBg)}
            >
              {contentOnly ? "Læs introduktionen igen" : "Øv dette forløb igen"}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // ---------------------------------------------------------------------
  // PATH (forløbsoversigt for én kategori)
  // ---------------------------------------------------------------------
  if (view === "path" && activeCategory) {
    const cat = getCategory(activeCategory, education);
    if (!cat) {
      return (
        <div className="app-page-narrow space-y-5 pt-10 text-center">
          <h2 className="page-title">Kategorien findes ikke</h2>
          <button onClick={() => setView("categories")} className="btn btn-primary">
            Tilbage til kategorier
          </button>
        </div>
      );
    }
    const colors = CATEGORY_COLOR_CLASSES[cat.color];
    const path = getCategoryPath(activeCategory, education);
    const hs = getCategoryHighScoreAverage(progress, activeCategory, education);
    const overallPct = hs.avg;

    return (
      <motion.div
        key="path"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page space-y-6"
      >
        <button onClick={() => setView("categories")} className="text-sm font-semibold text-ink/50 hover:text-ink">
          ← Alle kategorier
        </button>

        <div className="flex items-center gap-4 border-t-[3px] border-ink pt-4">
          <div className={cn("shrink-0", colors.text)}>
            <CategoryIcon name={cat.icon} className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="page-title">{cat.title}</h1>
            <p className="text-xs text-ink/50">{cat.description}</p>
          </div>
        </div>

        {overallPct !== null && (
          <div className="card p-4">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-bold text-ink">Din gennemsnitlige score i {cat.short}</span>
              <span className={cn("font-bold", theme.accentText)}>{overallPct}% rigtige</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
              <div className={cn("h-full rounded-full", colors.solid)} style={{ width: `${overallPct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-ink/40">
              {hs.lessons > 0
                ? `Et gennemsnit af din bedste score i de ${hs.lessons} forløb, du har gennemført i ${cat.short}. Genspiller du et forløb, tæller kun din bedste score.`
                : "Gennemfør et forløb i kategorien for at få en gennemsnitlig score."}
            </p>
          </div>
        )}

        <div>
          <h2 className="section-title">Forløb du kan vælge</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink/55">
            Følg stien: hvert forløb låser det næste op, når du består med mindst {LESSON_PASS_THRESHOLD}% rigtige. Er du øvet i forvejen,
            kan du låse et forløb op og springe hen til det. De oplåste forløb tæller som ikke forsøgt.
          </p>
        </div>

        <ol className="space-y-3">
          {path.nodes.map((node, i) => {
            const prevNode = path.nodes[i - 1];
            const passedPrev =
              !!prevNode &&
              progress.completedLessons[prevNode.id]?.bestPct !== undefined &&
              progress.completedLessons[prevNode.id]!.bestPct >= LESSON_PASS_THRESHOLD;
            // Oplåst hvis: første trin, forrige er bestået, denne er sprunget
            // til, ELLER et senere trin er sprunget til (så alt før det også er åbent).
            const skippedHereOrLater = path.nodes.slice(i).some((n) => isManuallyUnlocked(progress, n.id));
            const unlocked = i === 0 || passedPrev || skippedHereOrLater;
            const result = progress.completedLessons[node.id];
            const passed = !!result && result.bestPct >= LESSON_PASS_THRESHOLD;
            const isReview = node.kind === "review";
            const contentOnly = isContentOnlyLesson(node, education);

            const justUnlocked = revealedIds.includes(node.id);

            return (
              <motion.li
                key={node.id}
                layout
                initial={false}
                animate={justUnlocked ? { opacity: [0.55, 1] } : { opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (unlocked) {
                      startLesson(node);
                      return;
                    }
                    setUnlockTarget({
                      node,
                      throughIds: path.nodes.slice(0, i + 1).map((n) => n.id),
                    });
                  }}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-md border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                    unlocked ? "border-ink/12 bg-card hover:border-ink/30" : "border-dashed border-ink/25 bg-card hover:border-ink/40",
                    isReview && unlocked && "bg-ink/[0.04]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-sm font-extrabold tabular-nums",
                      passed ? "border-pine-base/40 bg-pine-soft text-pine-base" : unlocked ? cn("border-ink/15", colors.text) : "border-ink/15 text-ink/35"
                    )}
                  >
                    {passed ? <CheckIcon className="h-5 w-5" /> : unlocked ? i + 1 : <LockIcon className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-bold", unlocked ? "text-ink" : "text-ink/40")}>
                      {node.title}
                      {isReview && (
                        <span className={cn("chip ml-2 align-middle bg-ink/[0.06]", theme.accentText)}>
                          Opsamling
                        </span>
                      )}
                      {contentOnly && (
                        <span className={cn("chip ml-2 align-middle bg-ink/[0.06]", theme.accentText)}>
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
                      <p className="text-xs font-semibold text-ink/50">Tryk for at låse op til her</p>
                    )}
                  </div>
                  {unlocked ? (
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
                  ) : (
                    <span className={cn("chip shrink-0", theme.solidBg)}>Lås op</span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ol>

        {unlockTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
            <div className="modal w-full max-w-md space-y-3 p-5">
              <h3 className="section-title">Lås forløb op?</h3>
              <p className="text-sm text-ink/70">
                Alle forløb frem til og med <span className="font-bold text-ink">{unlockTarget.node.title}</span> bliver låst op.
                De markeres som &quot;ikke forsøgt endnu&quot; og tæller ikke som gennemført.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setUnlockTarget(null)}
                  className="btn btn-outline flex-1"
                >
                  Fortryd
                </button>
                <button
                  onClick={() => {
                    const ids = unlockTarget.throughIds;
                    setUnlockTarget(null);
                    if (reduceMotion) {
                      onUnlockLessons(ids);
                    } else {
                      setUnlockingIds(ids);
                      setRevealedIds([]);
                    }
                  }}
                  className={cn("btn flex-1", theme.solidBg)}
                >
                  Lås op
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // ---------------------------------------------------------------------
  // KATEGORIER (forside for Øv dig)
  // ---------------------------------------------------------------------
  return (
    <motion.div
      key="categories"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="app-page space-y-6"
    >
      <header className={cn("border-t-4 pt-5", isHhx ? "border-hhx-base" : "border-stx-base")}>
        <p className="eyebrow">Øvelser</p>
        <h1 className="page-title mt-1">Øv dig</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
          {isHhx
            ? "Her er HHX-pensum: fælles grammatik + kommunikation, semantik, pragmatik, genrer, sproghistorie og læringsstrategier."
            : "Vælg en kategori for at se dens forløb. De vigtigste og mest grundlæggende emner står øverst."}
        </p>
      </header>

      {isHhx ? (
        <div className="flex gap-6 border-b border-ink/15">
          <span className="inline-flex items-center gap-1.5 border-b-2 border-hhx-base pb-2 text-sm font-bold text-hhx-deep">
            <CategoryIcon name="hhx" className="h-4 w-4" />
            HHX-pensum
          </span>
        </div>
      ) : (
        <div className="flex gap-6 border-b border-ink/15">
          <button
            onClick={() => setTab("almen")}
            className={cn(
              "inline-flex items-center gap-1.5 border-b-2 pb-2 text-sm font-bold transition-colors",
              tab === "almen" ? "border-plum-base text-plum-base" : "border-transparent text-ink/45 hover:text-ink/70"
            )}
          >
            <CategoryIcon name="almen" className="h-4 w-4" />
            Almen del
          </button>
          <button
            onClick={() => setTab("latin")}
            className={cn(
              "inline-flex items-center gap-1.5 border-b-2 pb-2 text-sm font-bold transition-colors",
              tab === "latin" ? "border-clay-base text-clay-base" : "border-transparent text-ink/45 hover:text-ink/70"
            )}
          >
            <CategoryIcon name="latin" className="h-4 w-4" />
            Latindel
          </button>
        </div>
      )}

      {/* Kategorier som en indeks-fortegnelse med hårfine skillelinjer */}
      <ol className="border-t border-ink/15">
        {categories.map((cat) => {
          const colors = CATEGORY_COLOR_CLASSES[cat.color];
          const hs = getCategoryHighScoreAverage(progress, cat.id, education);
          const pct = hs.avg;
          const path = getCategoryPath(cat.id, education);
          const lessonsPassed = path.nodes.filter((n) => (progress.completedLessons[n.id]?.bestPct ?? 0) >= LESSON_PASS_THRESHOLD).length;
          return (
            <li key={cat.id} className="border-b border-ink/10">
              <button
                onClick={() => openCategory(cat.id)}
                className="group flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-ink/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span className={cn("shrink-0 transition-colors", colors.text)}>
                  <CategoryIcon name={cat.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-extrabold tracking-tight text-ink">{cat.title}</p>
                  <p className="truncate text-xs text-ink/50">{cat.description}</p>
                  <p className="mt-0.5 text-[11px] text-ink/45">
                    {lessonsPassed}/{path.nodes.length} forløb bestået
                    {pct !== null && <> · {pct}% rigtige i gennemsnit</>}
                  </p>
                  {pct !== null && (
                    <div className="mt-1.5 h-1 max-w-xs overflow-hidden rounded-full bg-ink/10">
                      <div className={cn("h-full rounded-full", colors.solid)} style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
                <span className="text-ink/25 transition-colors group-hover:text-ink/60">→</span>
              </button>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}
