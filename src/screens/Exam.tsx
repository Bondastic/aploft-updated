"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { CategoryId, CategoryStat, Education, IconName, MascotPose, Progress, SavedAnswer, Task } from "../types";
import { generateExam, estimateMinutes, poolForTrack, ALL_TASKS, ALL_HHX_TASKS, type ExamTrack } from "../lib/examGenerator";
import { getEducation } from "../lib/education";
import { getCategory } from "../data/categories";
import Mascot from "../components/Mascot";
import TaskRenderer from "../components/tasks/TaskRenderer";
import { cn } from "../utils/cn";
import SessionNav from "../components/SessionNav";
import { CategoryIcon, ClockIcon, ExamIcon, InfoIcon } from "../components/icons";
import ExamSatsPage from "./ExamSats";
import ExamFormatSheet from "../components/exam/ExamFormatSheet";
import { formatForSchoolId } from "../data/hhx/examFormats";
import { canTakeExamSats, getSchool, schoolsWithExam, HHX_EXAM_SATS_ID, SCHOOL_EXAM_LABELS } from "../data/schools";
import { buildQuizAiPrompt } from "../lib/examCopy";
import { CheckIcon, SparklesIcon } from "../components/icons";
import { copyTextToClipboard } from "../lib/examCopy";

type Outcome = { ok: boolean; answer?: SavedAnswer } | null;

const TRACK_INFO: Record<ExamTrack, { label: string; icon: IconName; desc: string }> = {
  almen: { label: "Almen del", icon: "almen", desc: "Ordklasser, sætningsled, morfologi, tempus, kasus, syntaks og sprog." },
  latin: { label: "Latindel", icon: "latin", desc: "Ordforråd, grammatik, oversættelse og romersk kultur." },
  hhx: {
    label: "HHX-prøve",
    icon: "hhx",
    desc: "Hele HHX-pensum: grammatik, kommunikation, semantik, pragmatik, genrer og sproghistorie.",
  },
  fuld: { label: "Fuld prøve", icon: "fuld", desc: "Blander spørgsmål fra både den almene del og latindelen." },
  ultimativ: {
    label: "Den ultimative test",
    icon: "ultimativ",
    desc: `Vælg selv længden, fra 50 op til alle ${ALL_TASKS.length} spørgsmål i hele banken.`,
  },
};

export default function ExamPage({
  education,
  progress,
  onCorrect,
  onWrong,
  onExamComplete,
  onSessionChange,
}: {
  education: Education;
  progress: Progress;
  onCorrect: (category: CategoryId) => void;
  onWrong: (category: CategoryId) => void;
  onExamComplete: (track: ExamTrack, correct: number, total: number, byCategory: Record<string, CategoryStat>) => void;
  /** Melder tilbage, om en prøve (quiz eller eksamenssæt) er i gang, så appen advarer ved navigation. */
  onSessionChange?: (active: boolean) => void;
}) {
  const [phase, setPhase] = useState<"setup" | "running" | "result">("setup");
  const [track, setTrack] = useState<ExamTrack>(education === "hhx" ? "hhx" : "fuld");
  const [count, setCount] = useState(12);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [reached, setReached] = useState(0);
  const [results, setResults] = useState<Outcome[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [byCategory, setByCategory] = useState<Record<string, CategoryStat>>({});
  const [pose, setPose] = useState<MascotPose>("explain");
  const [confirmAbort, setConfirmAbort] = useState(false);
  const reduceMotion = progress.settings.reduceMotion;

  const isHhx = education === "hhx";
  const theme = getEducation(education);
  // Eksamenssæt (kun HHX) + "Sådan foregår eksamen"-arket (begge spor).
  const [satsOpen, setSatsOpen] = useState(false);
  const [satsActive, setSatsActive] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);
  const [confirmStart, setConfirmStart] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    onSessionChange?.(phase === "running" || (satsOpen && satsActive));
  }, [phase, satsOpen, satsActive, onSessionChange]);

  // Skolens egen eksamensform (valgt ved onboarding); ubekendt skole => sporets liste.
  const schoolDef = getSchool(progress.school);
  const myFormat = formatForSchoolId(schoolDef?.formatId);
  // Prøverne er delt op pr. skole: eksamensprøven simulerer ÉN skoles
  // eksamensform og vises derfor kun for elever på den skole (se schools.ts).
  const maySats = canTakeExamSats(progress.school, education);
  const satsSchools = schoolsWithExam(HHX_EXAM_SATS_ID);

  // Bekræftelses-dialog der bruges både fra setup og fra "Prøv igen" på resultatet.
  const startConfirmModal = confirmStart && (
<div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
        role="alertdialog"
        aria-modal="true"
        aria-label="Bekræft start af prøven"
        onClick={() => setConfirmStart(false)}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="modal w-full max-w-sm space-y-3 p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-sm bg-ochre-soft text-ochre-base" aria-hidden="true">
            <ClockIcon className="h-5 w-5" />
          </span>
          <h3 className="section-title">Er du sikker på, at du vil starte prøven?</h3>
          <p className="text-sm leading-relaxed text-ink/60">
            Nu samler jeg {count} spørgsmål fra {TRACK_INFO[track].label.toLowerCase()}, og prøven tager cirka {estimateMinutes(count)} minutter.
            Går du væk undervejs, <span className="font-bold text-ink">bliver din fremgang i denne prøve ikke gemt</span>.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmStart(false)} className="btn btn-outline flex-1">
              Jeg vil ikke starte endnu
            </button>
            <button onClick={startExam} className={cn("btn flex-1", isHhx ? "bg-hhx-base text-white" : "bg-purple text-white")}>
              Start nu
            </button>
          </div>
        </motion.div>
      </div>
  );
  // På HHX er der kun én prøve (hele HHX-pensum); på STX kan man vælge spor.
  const tracks = isHhx ? (["hhx"] as ExamTrack[]) : (Object.keys(TRACK_INFO) as ExamTrack[]);

  const poolSize = poolForTrack(track, education).length;
  const isUltimate = track === "ultimativ";
  const maxCount = isUltimate ? poolSize : Math.min(28, poolSize);
  const minCount = isUltimate ? Math.min(50, poolSize) : Math.min(6, poolSize);
  const step = isUltimate ? 1 : 2;
  const categoryEntries = useMemo(() => Object.entries(byCategory), [byCategory]);

  function requestStart() {
    if (poolForTrack(track, education).length === 0) return;
    setConfirmStart(true);
  }

  function startExam() {
    const generated = generateExam(track, count, education);
    if (generated.length === 0) return;
    setConfirmStart(false);
    setTasks(generated);
    setIndex(0);
    setReached(0);
    setResults(Array.from({ length: generated.length }, () => null));
    setCorrectCount(0);
    setByCategory({});
    setPose("explain");
    setConfirmAbort(false);
    setPhase("running");
  }

  const outcome = results[index] ?? null;
  const answered = outcome !== null;
  const isReview = index < reached;

  function finishNow() {
    const answeredCount = results.filter((r) => r !== null).length;
    onExamComplete(track, correctCount, answeredCount || index + (answered ? 1 : 0), byCategory);
    setPose("celebrate");
    setPhase("result");
  }

  function handleSubmit(correct: boolean, answer?: SavedAnswer) {
    const current = tasks[index];
    if (!current || answered) return;
    const category = current.category;
    setResults((prev) => {
      const next = [...prev];
      next[index] = { ok: correct, answer };
      return next;
    });
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
      const nextI = index + 1;
      setIndex(nextI);
      setReached((r) => Math.max(r, nextI));
      setPose("thinking");
    }
  }

  // Eksamenssættet (kun HHX + kun skoler med netop denne form) fylder hele
  // skærmen, indtil det lukkes igen. ExamSatsPage har sin egen adgangsvagt.
  if (satsOpen) {
    return (
      <ExamSatsPage
        education={education}
        progress={progress}
        onClose={() => setSatsOpen(false)}
        onExamComplete={onExamComplete}
        onSessionChange={setSatsActive}
      />
    );
  }

  if (phase === "setup") {
    return (
      <motion.div
        key="setup"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page space-y-6"
      >
        <header className={cn("border-t-4 pt-5", isHhx ? "border-hhx-base" : "border-stx-base")}>
          <p className="eyebrow">Prøve</p>
          <h1 className="page-title mt-1">Tag en prøve</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
            {isHhx
              ? `Vælg hvor lang prøven skal være. Den trækker fra hele HHX-pensum (${ALL_HHX_TASKS.length} spørgsmål).`
              : "Vælg spor og hvor lang prøven skal være, så finder vi de bedste spørgsmål til dig."}
          </p>
        </header>

        {/* EKSAMENSFORMEN: øverst og tydelig, så alle elever ved hvad de bliver
            eksamineret i, og hvordan det foregår. De to skoler har hver sin form:
            Egå Gymnasium (STX) og Risskov, Handelsskolen (HHX). */}
        <button
          type="button"
          onClick={() => setFormatOpen(true)}
          className={cn(
            "flex w-full items-center gap-4 rounded-md border border-ink/12 bg-card p-4 text-left transition-colors hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            isHhx ? "border-l-4 border-l-hhx-base" : "border-l-4 border-l-stx-base"
          )}
        >
          <span className={cn("shrink-0", isHhx ? theme.softBg : "text-stx-base")}>
            <InfoIcon className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-ink">Sådan foregår din eksamen</span>
              <span className={cn("chip", isHhx ? theme.accentChip : "bg-stx-soft text-stx-deep")}>
                {isHhx ? "HHX-formen er klar" : "STX-formen: under udarbejdelse"}
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-ink/50">
              {myFormat
                ? `Eksamensformen på ${myFormat.school}: ${myFormat.status === "klar" ? "se hele forløbet, tidsrammen og hvad du bliver eksamineret i." : "vi er ved at færdigbeskrive de sidste detaljer."}`
                : schoolDef
                  ? "Vi har endnu ikke en udfoldet beskrivelse af din skoles form : tryk ind og se de former, vi har for dit spor, og hvad vi generelt ved om AP-eksamen."
                  : "Vælg din skole under Profil, så viser vi præcis den eksamensform, din skole bruger. Indtil videre kan du se formen for dit spor."}
            </span>
          </span>
          <span className={cn("chip shrink-0", isHhx ? theme.solidBg : "bg-stx-base text-white")}>
            Læs formen
          </span>
        </button>

        {/* Eksamensprøven: den format-tro eksamens-simulering. Den er både
            uddannelses- OG skolebestemt: kun HHX (STX har en anden
            eksamensform), og kun skoler, der har netop denne form på deres
            liste i schools.ts. Andre får det forklarende kort nedenunder. */}
        {isHhx && maySats && (
          <button
            type="button"
            onClick={() => setSatsOpen(true)}
            className={cn(
              "flex w-full items-center gap-4 rounded-md bg-hhx-base p-5 text-left text-white transition-colors hover:bg-hhx-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            )}
          >
            <span className="shrink-0 text-white/85">
              <ExamIcon className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-base font-extrabold">Eksamensprøve</span>
                <span className="chip bg-white/15 text-white">
                  7 opgaver · 40 min forberedelse
                </span>
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-white/85">
                Prøv den virkelige eksamen: du trækker en ukendt tekst med syv opgaver, markerer i teksten, skriver dine svar som på notepapiret
                og svarer på delspørgsmål, der giver en vejledende karakter. Bagefter kan du kopiere hele besvarelsen over til en AI for
                feedback : {schoolDef ? `formen er ${schoolDef.name}s egen.` : "formen er din skoles egen."}
              </span>
            </span>
            <span className="chip shrink-0 bg-white text-hhx-deep">Start →</span>
          </button>
        )}

        {isHhx && !maySats && (
          <div className="rounded-md border border-dashed border-ochre-base/50 bg-ochre-soft p-4 text-sm leading-relaxed text-ochre-base">
            <p className="flex flex-wrap items-center gap-2 font-bold">
              <InfoIcon className="h-4 w-4" /> {SCHOOL_EXAM_LABELS[HHX_EXAM_SATS_ID].short}: ikke for din skole endnu
              <span className="chip bg-white/50 text-ochre-base">skolebestemt</span>
            </p>
            <p className="mt-1 leading-relaxed">
              Eksamensprøven er bygget 1:1 efter ét skole-eksamensark, og AP-eksamen afvikles forskelligt fra skole til skole. Derfor kan den
              lige nu kun tages af elever på {satsSchools.map((sc) => sc.name).join(", ") || "de skoler, vi har formen for"}.
              {schoolDef
                ? " Vi tilføjer flere skoler, så snart vi har deres form bekræftet."
                : satsSchools.length === 1
                  ? " Går du der, kan du vælge din skole under Profil → Indstillinger."
                  : " Går du på en af dem, kan du vælge din skole under Profil → Indstillinger."}
            </p>
            <p className="mt-1.5 leading-relaxed">
              Indtil da træner prøvegeneratoren herunder præcis de samme fagbegreber : ordklasser, morfologi, syntaktisk analyse, verbaltider og
              hoved- og ledsætninger.
            </p>
          </div>
        )}

        <p className="border-l-2 border-ink/20 py-1 pl-3 text-sm italic leading-relaxed text-ink/55">
          Vælg selv sværhedsgrad og længde. Jeg samler spørgsmålene til dig.
        </p>

        <div className="space-y-3">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTrack(t);
                const newPoolSize = poolForTrack(t, education).length;
                const newMax = t === "ultimativ" ? newPoolSize : Math.min(28, newPoolSize);
                const newMin = t === "ultimativ" ? Math.min(50, newPoolSize) : Math.min(6, newPoolSize);
                setCount(t === "ultimativ" ? newMin : Math.min(Math.max(count, newMin), newMax));
              }}
              className={cn(
                "flex w-full items-center gap-4 rounded-md border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                track === t
                  ? cn("border-l-4", isHhx ? "border-hhx-base bg-hhx-soft" : "border-purple bg-purple/5")
                  : "border-ink/12 bg-card hover:border-ink/30"
              )}
            >
              <span className={cn("shrink-0", isHhx ? theme.softBg : "text-purple")}>
                <CategoryIcon name={TRACK_INFO[t].icon} className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-bold text-ink">{TRACK_INFO[t].label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink/50">{TRACK_INFO[t].desc}</p>
              </div>
              {/* Kvadratisk radio-markering */}
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border",
                  track === t ? cn(isHhx ? "border-hhx-base bg-hhx-base" : "border-purple bg-purple") : "border-ink/25"
                )}
              >
                {track === t && <CheckIcon className="h-3.5 w-3.5 text-white" />}
              </div>
            </button>
          ))}
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-bold text-ink">Antal spørgsmål</p>
            <span className={cn("chip px-2 py-1 text-xs tabular-nums", isHhx ? theme.accentChip : "bg-purple/10 text-purple")}>
              {count}
            </span>
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
            className={cn("w-full", isHhx ? "accent-hhx-base" : "accent-purple")}
          />
          <div className="mt-1 flex justify-between text-[11px] text-ink/40">
            <span>{minCount} spørgsmål</span>
            <span>{maxCount} spørgsmål</span>
          </div>
          {isUltimate && (
            <p className="mt-3 rounded-md bg-ochre-soft px-3 py-2 text-xs leading-relaxed text-ochre-base">
              Den ultimative test trækker fra alle {poolSize}  spørgsmål i hele banken (almen + latin). Du kan altid trykke
              &quot;Afslut prøven nu&quot; undervejs for at se dit resultat baseret på de spørgsmål, du nåede.
            </p>
          )}
          {isHhx && (
            <p className="mt-3 rounded-md bg-hhx-soft px-3 py-2 text-xs leading-relaxed text-hhx-deep">
              HHX-prøven her er prøvegeneratoren: interaktive spørgsmål over grammatik, kommunikation, sproghandlinger, semantik, pragmatik og
              sproghistorie, som du kan tage så mange gange du vil. Vil du træne HELE eksamen, som den afvikles (ukendt tekst, syv opgaver, 40
              minutters forberedelse og mundtlig eksamination bagefter), så brug “Eksamensprøve”{maySats ? " ovenfor" : ", når din skole er med"}.
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 rounded-md bg-ink/[0.05] px-3 py-2 text-sm font-semibold text-ink/70">
            <ClockIcon className="h-4 w-4" />
            Estimeret tid: ≈ {estimateMinutes(count)} min
          </div>
        </div>

        <button
          onClick={requestStart}
          className={cn("btn w-full py-3", isHhx ? "bg-hhx-base text-white" : "bg-purple text-white")}
        >
          <ExamIcon className="h-5 w-5" />
          Start prøve
        </button>

        {startConfirmModal}

        {formatOpen && <ExamFormatSheet education={education} schoolId={progress.school} onClose={() => setFormatOpen(false)} />}
      </motion.div>
    );
  }

  if (phase === "running") {
    const task = tasks[index];
    if (!task) {
      return (
        <div className="app-page-narrow space-y-5 pt-10 text-center">
          <Mascot pose="surprise" size="md" className="mx-auto justify-center" reduceMotion={reduceMotion} />
          <h2 className="page-title">Prøven kunne ikke startes</h2>
          <p className="text-sm text-ink/60">Der var ingen spørgsmål at trække. Prøv en anden længde eller et andet spor.</p>
          <button onClick={() => setPhase("setup")} className="btn btn-primary">
            Tilbage
          </button>
        </div>
      );
    }
    return (
      <motion.div
        key="running"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page-narrow space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setConfirmAbort(true)}
            className="btn btn-danger px-3 py-1.5 text-xs"
          >
            Afbryd prøve
          </button>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50">
            <CategoryIcon name={TRACK_INFO[track].icon} className="h-4 w-4" />
            {TRACK_INFO[track].label}
          </p>
        </div>
        <p className="text-center text-sm font-semibold text-ink/50" aria-live="polite">
          Spørgsmål {index + 1} af {tasks.length}
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={tasks.length}>
          <div className={cn("h-full rounded-full transition-all", isHhx ? theme.bar : "bg-purple")} style={{ width: `${(index / tasks.length) * 100}%` }} />
        </div>
        <SessionNav
          canBack={index > 0}
          canForward={index < reached}
          onBack={() => setIndex((i) => Math.max(0, i - 1))}
          onForward={() => setIndex((i) => Math.min(reached, i + 1))}
        />
        {isReview && (
          <p className="text-center text-xs font-semibold text-ink/40">Du kigger på et tidligere spørgsmål. Dine valg vises stadig. Gå frem for at fortsætte, hvor du slap.</p>
        )}
        <Mascot pose={pose} size="sm" reduceMotion={reduceMotion} />
        <motion.div
          key={`exam-task-${index}-${task.id}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="card p-5"
        >
          <TaskRenderer
            key={`exam-${index}-${task.id}`}
            task={task}
            onSubmit={handleSubmit}
            reduceMotion={reduceMotion}
            review={answered}
            reviewCorrect={outcome?.ok === true}
            savedAnswer={outcome?.answer}
          />
        </motion.div>
        {answered && !isReview && (
          <button onClick={next} className="btn btn-primary w-full py-3">
            {index + 1 >= tasks.length ? "Se resultat →" : "Næste →"}
          </button>
        )}
        <button
          type="button"
          onClick={finishNow}
          className="btn btn-danger w-full"
        >
          Afslut prøven nu og se resultat
        </button>
        {confirmAbort && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
            <div className="modal w-full max-w-sm space-y-3 p-5" role="dialog" aria-modal="true">
              <h3 className="section-title">Afbryd prøven?</h3>
              <p className="text-sm text-ink/70">Du kan gå tilbage til opsætningen. Det, du har svaret indtil nu, bliver ikke gemt som et prøveresultat.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmAbort(false)} className="btn btn-outline flex-1">
                  Fortsæt
                </button>
                <button
                  onClick={() => {
                    setConfirmAbort(false);
                    setPhase("setup");
                  }}
                  className="btn btn-danger-solid flex-1"
                >
                  Afbryd
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // result
  const pct = tasks.length > 0 ? Math.round((correctCount / (categoryEntries.reduce((s, [, v]) => s + v.total, 0) || tasks.length)) * 100) : 0;
  const totalAnswered = categoryEntries.reduce((s, [, v]) => s + v.total, 0) || tasks.length;

  return (
    <motion.div
      key="result"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="app-page-narrow space-y-6 pt-8 text-center"
    >
      <Mascot pose={pct >= 70 ? "celebrate" : pct >= 40 ? "thumbsup" : "encourage"} size="lg" className="mx-auto justify-center" reduceMotion={reduceMotion} />
      <div>
        <h2 className="page-title">Prøven er afsluttet!</h2>
        <p className="mt-1 text-ink/60">
          Du fik <span className={cn("font-bold", isHhx ? theme.accentText : "text-purple")}>{correctCount}</span> ud af {totalAnswered} rigtige. Det giver {pct}%.
        </p>
      </div>

      <div className="card space-y-2 p-5 text-left">
        <p className="mb-2 text-sm font-bold text-ink">Resultat pr. kategori</p>
        {categoryEntries.map(([catId, stat]) => {
          const cat = getCategory(catId, education);
          const p = Math.round((stat.correct / stat.total) * 100);
          return (
            <div key={catId} className="flex items-center gap-3 text-sm">
              <span className="inline-flex w-44 shrink-0 items-center gap-1.5 truncate text-ink/70">
                <CategoryIcon name={cat?.icon ?? "almen"} className="h-4 w-4 shrink-0" />
                <span className="truncate">{cat?.short ?? catId}</span>
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div className={cn("h-full rounded-full", isHhx ? theme.bar : "bg-purple")} style={{ width: `${p}%` }} />
              </div>
              <span className="w-14 shrink-0 text-right text-xs font-semibold text-ink/50">
                {stat.correct}/{stat.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Krav: efter en gennemført prøve kan opgave + egne svar kopieres til en AI efter eget valg. */}
      <div className="card p-5">
        <p className="flex items-center gap-2 font-bold text-ink">
          <SparklesIcon className="h-4 w-4" /> Vil du have feedback på dine ordrette svar?
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">
          Kopiér prøvens opgaver og DINE svar som tekst : sæt ind i en AI efter eget valg (Copilot, ChatGPT, Claude, hvad du nu har) og bed om
          retning og gode råd. Appen sender intet selv : teksten ligger kun i din udklipsholder.
        </p>
        <button
          type="button"
          onClick={async () => {
            const ok = await copyTextToClipboard(buildQuizAiPrompt(`Prøve: ${TRACK_INFO[track].label} (${isHhx ? "HHX" : "STX"})`, tasks, results));
            setCopied(ok);
            window.setTimeout(() => setCopied(false), 2500);
          }}
          className={cn(
            "btn mt-3 w-full py-3",
            copied ? "border border-pine-base/50 bg-pine-soft text-pine-base" : "btn-outline"
          )}
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : null}
          {copied ? "Opgaver og svar er kopieret" : "Kopiér opgaver + mine svar til AI'en"}
        </button>
      </div>

      {startConfirmModal}

      <div className="flex justify-center gap-3">
        <button onClick={() => setPhase("setup")} className="btn btn-outline">
          Ny prøve
        </button>
        <button onClick={requestStart} className={cn("btn", isHhx ? "bg-hhx-base text-white" : "bg-purple text-white")}>
          Prøv igen
        </button>
      </div>
    </motion.div>
  );
}
