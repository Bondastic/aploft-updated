"use client";

// ---------------------------------------------------------------------------
// EKSAMENSPRØVE (kun HHX, og kun på skoler der har netop denne eksamensform).
//
// Prøven spejler AP-eksamen på Risskov: du trækker en ukendt tekst med SYV
// opgaver og har 40 minutters skriftlig forberedelse. Flowet er:
//   intro (informationstekst om eksamen og dens forløb)
//     → selve prøven (tekst med markeringsværktøjer + de 7 opgaver, ur i siden)
//     → Indsend (eller klokken ringer ved tidens udløb og beder om aflevering)
//     → "Lingua retter prøven"-overgang
//     → resultat: rammesætning først, derefter vejledende karakter, "gem din
//       prøve"-kopiering, AI-bedømmelse via Copilot og gennemgang pr. opgave.
//
// Hver opgave besvares TO steder:
//   1. fritekst-feltet (elevens eget svar, som notepapiret til eksamen). Det
//      kan appen ikke rette ; det kopieres med over til AI-feedback.
//   2. delspørgsmålene (valg, ordklasser, led-symboler). Dem retter appen, og
//      KARAKTEREN bygger kun på dem.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type {
  CategoryStat,
  Education,
  ExamAnalysisCheckT,
  ExamCheckT,
  ExamChoiceCheckT,
  ExamMultiCheckT,
  ExamTaskT,
  ExamWordClassCheckT,
  ExamWordClassTag,
  LedSymbol,
  Progress,
} from "../types";
import { pickNextExamSats, HHX_EXAM_SATS, EXAM_WORD_CLASS_TAGS, wordClassLabel } from "../data/hhx/examSats";
import { loadExamSatsUsage, markExamSatsUsed } from "../lib/examSatsStorage";
import { canTakeExamSats, getSchool, schoolsWithExam, HHX_EXAM_SATS_ID } from "../data/schools";
import { SYMBOLS, getSymbolDef } from "../data/symbols";
import { getEducation } from "../lib/education";
import Mascot from "../components/Mascot";
import ExamArticlePane, { type ExamMark, countExamMarks } from "../components/exam/ExamArticlePane";
import ExamFormatSheet from "../components/exam/ExamFormatSheet";
import { CheckIcon, ClockIcon, InfoIcon, LightbulbIcon, SparklesIcon, XIcon, LedGlyph } from "../components/icons";
import { cn } from "../utils/cn";

type Phase = "intro" | "running" | "grading" | "result";

/** Svar på et lukket delspørgsmål (det er dem, appen retter). */
type CheckAns =
  | { kind: "choice"; selected: number }
  | { kind: "multi"; selected: number[] }
  | { kind: "wordclass"; tags: (ExamWordClassTag | null)[] }
  | { kind: "analysis"; symbols: (LedSymbol | null)[] };

// Karakterskalaen. Den er en smule mildere end prøvegeneratorens, fordi
// delspørgsmålene her sidder oven på en rigtig eksamensopgave: karakteren skal
// kunne vise fagligt niveau uden at slå benene væk under en, der er ved at
// lære stoffet. Den er stadig streng nok til at 12 skal fortjenes.
const GRADE_SCALE: { grade: string; label: string; minPct: number }[] = [
  { grade: "12", label: "Fremragende", minPct: 85 },
  { grade: "10", label: "Fortrinligt", minPct: 72 },
  { grade: "7", label: "Godt", minPct: 56 },
  { grade: "4", label: "Jævnt", minPct: 40 },
  { grade: "02", label: "Tilstrækkeligt", minPct: 28 },
  { grade: "00", label: "Utilstrækkeligt", minPct: 14 },
  { grade: "-3", label: "Ikke-godkendt", minPct: 0 },
];

function gradeFor(pct: number): { grade: string; label: string } {
  return GRADE_SCALE.find((g) => pct >= g.minPct) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

/** Point med dansk decimalkomma (2,3 - ikke 2.3). */
function fmtPoints(n: number): string {
  return (Math.round(n * 10) / 10).toLocaleString("da-DK");
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Lille WebAudio-"klokke": tre klanger. Ingen lydfil nødvendig. */
function playExamBell(): void {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    for (const strike of [0, 0.55, 1.1]) {
      for (const [freq, gain] of [[880, 0.25], [1318.5, 0.1], [523.3, 0.16]] as const) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, now + strike);
        g.gain.linearRampToValueAtTime(gain, now + strike + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + strike + 0.95);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + strike);
        osc.stop(now + strike + 1.05);
      }
    }
    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 2800);
  } catch {
    // Lyd er en bonus - prøven må aldrig fejle pga. afvist audio.
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function isCheckAnswered(a: CheckAns | undefined): boolean {
  if (!a) return false;
  switch (a.kind) {
    case "choice":
      return true;
    case "multi":
      return a.selected.length > 0;
    case "wordclass":
      return a.tags.some((t) => t !== null);
    case "analysis":
      return a.symbols.some((s) => s !== null);
  }
}

/**
 * Retter ét delspørgsmål og giver point mellem 0 og 1. Ordklasse- og
 * led-opgaver får DELPOINT (et forkert led koster ikke hele opgaven), fordi
 * de indeholder flere svar hver.
 */
function scoreCheck(c: ExamCheckT, a: CheckAns | undefined): number {
  if (!a) return 0;
  switch (c.kind) {
    case "choice":
      return a.kind === "choice" && a.selected === c.correctIndex ? 1 : 0;
    case "multi": {
      if (a.kind !== "multi") return 0;
      const hits = a.selected.filter((i) => c.correctIndexes.includes(i)).length;
      const wrong = a.selected.filter((i) => !c.correctIndexes.includes(i)).length;
      return Math.max(0, (hits - wrong) / c.correctIndexes.length);
    }
    case "wordclass": {
      if (a.kind !== "wordclass") return 0;
      const hits = c.words.filter((w, i) => a.tags[i] === w.correct).length;
      return hits / c.words.length;
    }
    case "analysis": {
      if (a.kind !== "analysis") return 0;
      const hits = c.correctMap.filter((sym, i) => a.symbols[i] === sym).length;
      return hits / c.correctMap.length;
    }
  }
}

function scoreLabel(score: number, answered: boolean): { text: string; tone: string } {
  if (!answered) return { text: "Ikke besvaret", tone: "bg-ink/30" };
  if (score >= 0.999) return { text: "Rigtigt", tone: "bg-emerald-500" };
  if (score > 0) return { text: "Delvist rigtigt", tone: "bg-amber-500" };
  return { text: "Forkert", tone: "bg-rose-500" };
}

export default function ExamSatsPage({
  education,
  progress,
  onClose,
  onExamComplete,
  onSessionChange,
}: {
  education: Education;
  progress: Progress;
  onClose: () => void;
  onExamComplete: (track: "hhx", correct: number, total: number, byCategory: Record<string, CategoryStat>) => void;
  /** Melder tilbage, når en prøve er IGANGVÆRENDE (bruges af app-skallens nav-vagt). */
  onSessionChange?: (active: boolean) => void;
}) {
  // Rotation: aldrig det samme sæt to gange i træk ; først når ALLE sæt er
  // prøvet, blandes puljen igen (og introen forklarer hvorfor).
  const [usage, setUsage] = useState(() => loadExamSatsUsage());
  const [pick, setPick] = useState(() => pickNextExamSats(loadExamSatsUsage().usedIds, loadExamSatsUsage().lastId));
  const sats = pick.sats;
  const allUsed = pick.allUsed;
  const school = getSchool(progress.school);
  const theme = getEducation(education);
  const reduceMotion = progress.settings.reduceMotion;

  // Adgangsvagt: prøven simulerer ÉN skoles eksamensform og må kun tages der.
  const mayTake = canTakeExamSats(progress.school, education);

  const [phase, setPhase] = useState<Phase>("intro");
  const [checkAnswers, setCheckAnswers] = useState<Record<string, CheckAns>>({});
  const [written, setWritten] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<Record<number, ExamMark>>({});
  const [secs, setSecs] = useState(sats.minutes * 60);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmAbort, setConfirmAbort] = useState(false);
  const [showFormatHint, setShowFormatHint] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const [aiModal, setAiModal] = useState<null | "copied">(null);
  const [copied, setCopied] = useState(false);
  const [confirmStart, setConfirmStart] = useState(false);
  const [usedSecs, setUsedSecs] = useState(0);
  const [gradingTick, setGradingTick] = useState(0);

  const tasks = sats.tasks;
  const allChecks = useMemo(() => tasks.flatMap((t) => t.checks), [tasks]);
  const totalChecks = allChecks.length;
  const writtenCount = useMemo(() => tasks.filter((t) => (written[t.id] ?? "").trim().length > 0).length, [tasks, written]);
  const checkAnsweredCount = useMemo(
    () => allChecks.filter((c) => isCheckAnswered(checkAnswers[c.id])).length,
    [allChecks, checkAnswers]
  );

  const results = useMemo(() => {
    if (submittedAt === null) return null;
    const perTask = tasks.map((t) => ({
      task: t,
      answer: (written[t.id] ?? "").trim(),
      checks: t.checks.map((c) => {
        const a = checkAnswers[c.id];
        const answered = isCheckAnswered(a);
        return { check: c, answer: a, answered, score: answered ? scoreCheck(c, a) : 0 };
      }),
    }));
    const flat = perTask.flatMap((t) => t.checks);
    const points = flat.reduce((sum, r) => sum + r.score, 0);
    const byCategory: Record<string, CategoryStat> = {};
    for (const t of perTask) {
      if (!t.task.category || t.checks.length === 0) continue;
      const taskPoints = t.checks.reduce((sum, r) => sum + r.score, 0);
      const stat = byCategory[t.task.category] ?? { correct: 0, total: 0 };
      byCategory[t.task.category] = {
        correct: stat.correct + Math.round(taskPoints),
        total: stat.total + t.checks.length,
      };
    }
    return { perTask, flat, points, byCategory };
  }, [submittedAt, tasks, written, checkAnswers]);

  const pct = results && totalChecks > 0 ? Math.round((results.points / totalChecks) * 100) : 0;
  const grade = gradeFor(pct);

  // App-skallen (AploftApp) skal vide, om en prøve er i gang, så navigation
  // advarer, før fremdriften smides væk.
  useEffect(() => {
    onSessionChange?.(phase === "running" || phase === "grading");
  }, [phase, onSessionChange]);

  // Nedtælling (kun mens prøven kører).
  useEffect(() => {
    if (phase !== "running") return;
    const iv = window.setInterval(() => {
      setSecs((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(iv);
  }, [phase]);

  // "Lingua retter prøven"-overgang: et roligt øjeblik, før resultatet vises.
  useEffect(() => {
    if (phase !== "grading") return;
    const iv = window.setInterval(() => setGradingTick((t) => t + 1), 620);
    const t = window.setTimeout(() => setPhase("result"), reduceMotion ? 900 : 2600);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(t);
    };
  }, [phase, reduceMotion]);

  // Tiden er gået: klokken ringer, og aflevering kræves med det samme.
  const timeUp = phase === "running" && secs === 0;
  useEffect(() => {
    if (timeUp) playExamBell();
  }, [timeUp]);

  // Lås scroll når en dialog er åben (ligesom rundvisningen).
  useEffect(() => {
    const lock = timeUp || confirmSubmit || confirmAbort || confirmStart || aiModal !== null || showFormatHint;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [timeUp, confirmSubmit, confirmAbort, confirmStart, aiModal, showFormatHint]);

  const startExam = useCallback(() => {
    setConfirmStart(false);
    setUsage(markExamSatsUsed(sats.id));
    setPhase("running");
    setShowFormatHint(false);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion, sats.id]);

  const submit = useCallback(() => {
    // Beregnes her (ikke i memo'en), fordi resultatet skal registreres straks.
    let points = 0;
    const byCat: Record<string, CategoryStat> = {};
    for (const t of tasks) {
      if (t.checks.length === 0) continue;
      let taskPoints = 0;
      for (const c of t.checks) {
        const a = checkAnswers[c.id];
        const score = isCheckAnswered(a) ? scoreCheck(c, a) : 0;
        taskPoints += score;
      }
      points += taskPoints;
      if (t.category) {
        const stat = byCat[t.category] ?? { correct: 0, total: 0 };
        byCat[t.category] = { correct: stat.correct + Math.round(taskPoints), total: stat.total + t.checks.length };
      }
    }
    setSubmittedAt(Date.now());
    setUsedSecs(sats.minutes * 60 - secs);
    setConfirmSubmit(false);
    setPhase("grading");
    onExamComplete("hhx", Math.round(points), totalChecks, byCat);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [checkAnswers, onExamComplete, reduceMotion, sats.minutes, secs, tasks, totalChecks]);

  /** Elevens besvarelse som ren tekst (fritekst + valgte delsvar, aldrig facit). */
  function buildCopyText(): string {
    const lines: string[] = [];
    lines.push(`AP-eksamensprøve (HHX) · ${sats.title}`);
    lines.push(`Tekst: "${sats.article.title}" (${sats.article.byline})`);
    lines.push(`Forberedelsestid: ${sats.minutes} minutter · ${tasks.length} opgaver`);
    lines.push("");
    tasks.forEach((t) => {
      lines.push(`OPGAVE ${t.no} [${t.label}]: ${t.prompt}`);
      const own = (written[t.id] ?? "").trim();
      lines.push(`  Min besvarelse: ${own.length > 0 ? own : "(ikke besvaret)"}`);
      if (t.checks.length > 0) {
        lines.push("  Mine svar på delspørgsmålene:");
        t.checks.forEach((c) => {
          lines.push(`   - ${c.prompt}`);
          lines.push(`     ${checkAnswerAsText(c, checkAnswers[c.id])}`);
        });
      }
      lines.push("");
    });
    const m = countExamMarks(marks);
    if (m.hl + m.led + m.wc > 0) {
      lines.push("Markeringer i teksten:");
      lines.push(`- ${m.hl} tusch-markeringer, ${m.led} led-mærkater, ${m.wc} ordklasse-mærkater (mine noter i teksten).`);
      lines.push("");
    }
    return lines.join("\n");
  }

  function buildAiPrompt(): string {
    return [
      "Jeg går på HHX og træner til min AP-eksamen (Almen Sprogforståelse). Til eksamen trækker jeg en ukendt tekst med syv opgaver, får 40 minutters skriftlig forberedelse og skal derefter besvare de syv opgaver MUNDTLIGT for min lærer og en censor (12-15 minutter).",
      "De syv opgaver er: 1) genretræk, 2) kommunikationssituationen (Ciceros pentagram), 3) sproglige særtræk, 4) morfologisk analyse, 5) syntaktisk analyse, 6) verballedets tid, 7) hoved- og ledsætninger.",
      "Bedøm venligst min besvarelse nedenfor som en opmuntrende, men ærlig AP-censor:",
      "1. Skriv først kort, at bedømmelsen kun er til forberedelse (en AI-karakter kan sige noget om mit faglige niveau, men er ikke en officiel karakter, og den mundtlige del kan ikke bedømmes her).",
      "2. Giv mig derefter en vejledende karakter på 7-trinsskalaen (12, 10, 7, 4, 02, 00, -3) med en begrundelse. Vær mild, men præcis nok til, at jeg kan se mit faglige niveau.",
      "3. Gå så HVER opgave igennem én ad gangen: hvad er rigtigt, hvad mangler, og hvad skal jeg konkret sige til eksamen? Brug de latinske betegnelser for led (subjekt, verballed, direkte/indirekte objekt) som de primære.",
      "4. Husk, at opgave 2 og 3 har mange rigtige svar : bedøm dem på dokumentationen (citater fra teksten) og fagsproget, ikke på om jeg ramte præcis dine eksempler.",
      "",
      "TEKSTGRUNDLAG (prøvens tekst, ordret):",
      `"${sats.article.title}" (${sats.article.byline})`,
      ...sats.article.paragraphs,
      "",
      "OPGAVER OG MINE SVAR:",
      buildCopyText(),
    ].join("\n");
  }

  async function copyAnswer() {
    const ok = await copyToClipboard(buildCopyText());
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 2500);
  }

  async function handInToAi() {
    await copyToClipboard(buildAiPrompt());
    setAiModal("copied");
  }

  function reset() {
    setPhase("intro");
    setCheckAnswers({});
    setWritten({});
    setMarks({});
    setSubmittedAt(null);
    setConfirmSubmit(false);
    setConfirmAbort(false);
    setAiModal(null);
    setConfirmStart(false);
    // Rotation: næste sæt ALDRIG det, man lige har prøvet (se pickNextExamSats).
    const u = loadExamSatsUsage();
    setUsage(u);
    const next = pickNextExamSats(u.usedIds, sats.id);
    setPick(next);
    setSecs(next.sats.minutes * 60);
  }

  // --------------------------------------------------------------------------
  // Adgangsvagt: skolen skal have netop denne eksamensform.
  if (!mayTake) {
    const schools = schoolsWithExam(HHX_EXAM_SATS_ID);
    return (
      <div className="app-page-narrow space-y-5">
        <button type="button" onClick={onClose} className="text-sm font-semibold text-ink/50 transition hover:text-ink">
          ← Tilbage til prøver
        </button>
        <div className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <p className="flex items-center gap-2 font-display text-xl font-extrabold">
            <InfoIcon className="h-5 w-5" /> Eksamensprøven findes ikke for din skole endnu
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Eksamensprøven er bygget 1:1 efter én bestemt skoles eksamensark, og eksamensformen er forskellig fra skole til skole. Derfor kan
            den kun tages af elever på {schools.map((s) => s.name).join(", ") || "de skoler, vi har formen for"}. Vælg din skole under Profil →
            Indstillinger, hvis du går der : ellers kan du bruge prøvegeneratoren, som træner præcis de samme fagbegreber.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  if (phase === "intro") {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="app-page space-y-5"
      >
        <button type="button" onClick={onClose} className="text-sm font-semibold text-ink/50 transition hover:text-ink">
          ← Tilbage til prøver
        </button>

        <div className={cn("rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg", theme.gradient)}>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/70">{sats.schoolLabel} · Eksamensprøve</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">{sats.intro.heading}</h1>
          <p className="mt-2 text-sm text-white/85">{sats.intro.lead}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <ClockIcon className="h-4 w-4" /> {sats.minutes} minutters forberedelse
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5">{tasks.length} opgaver</span>
            <span className="rounded-full bg-white/15 px-3 py-1.5">Fritekst + delspørgsmål</span>
          </div>
          <p className="mt-3 text-xs font-semibold text-white/75">
            Sæt prøvet før : {Math.min(usage.usedIds.length, HHX_EXAM_SATS.length)} af {HHX_EXAM_SATS.length}
            {usage.usedIds.includes(sats.id) ? " (du har prøvet netop dette sæt før)" : " (du har ikke prøvet dette sæt endnu)"}
          </p>
        </div>

        {allUsed && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="font-extrabold">Alle sæt er prøvet : nu blandes puljen igen</p>
            <p className="mt-1">
              Derfor kan du godt genkende en tekst eller en opgave denne gang : appen må nemlig ikke give dig det sæt, du lige har haft, men når
              alle {HHX_EXAM_SATS.length} er blevet prøvet, er der ikke flere friske at vælge imellem. Gentagelsen er meningsfuld alligevel :
              anden gang ser du typisk de fejl, du manglede første gang.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Mascot
            pose="explain"
            size="md"
            reduceMotion={reduceMotion}
            speech="Tag det roligt. Læs teksten grundigt, skriv dine svar ned som på notepapiret ; husk at der ikke findes forkerte forsøg her."
          />
          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-bold text-ink">Prøvens forløb</p>
            <ol className="mt-3 space-y-2.5">
              {sats.intro.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink/70">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white", theme.solidBg)}>
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-bold text-ink">Det bliver du eksamineret i</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {sats.intro.examIn.map((it) => (
                <div key={it.title} className="rounded-xl bg-ink/[0.03] p-3">
                  <p className="text-sm font-bold text-ink">{it.title}</p>
                  <p className="mt-1 text-xs text-ink/60">{it.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-bold text-ink">De syv opgaver, du trækker</p>
            <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 rounded-xl bg-ink/[0.03] px-3 py-2 text-sm">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white", theme.solidBg)}>
                    {t.no}
                  </span>
                  <span className="font-semibold text-ink">{t.label}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs leading-relaxed text-ink/55">
              Du skriver selv dine svar i felterne under hver opgave (dem bedømmer AI&apos;en bagefter), og under dem ligger et par
              delspørgsmål med faste svar. Karakteren i appen kommer fra delspørgsmålene : det er dem, der kan rettes automatisk.
            </p>
          </div>

          <div className={cn("rounded-2xl border-2 p-4 text-sm", theme.borderActive, "bg-white")}>
            <p className="font-bold text-ink">Eksamensformen på din skole</p>
            <p className="mt-1 text-ink/60">
              {school
                ? `Prøven her følger ${school.name}s eksamensform for HHX: en ukendt tekst med ${tasks.length} opgaver, ${sats.minutes} minutters skriftlig forberedelse og mundtlig eksamination bagefter. Læs hele formen herunder.`
                : `Prøven her følger HHX-formen: en ukendt tekst med ${tasks.length} opgaver og ${sats.minutes} minutters forberedelse. Vælg din skole under Profil for at se præcis jeres form.`}
            </p>
            <button
              type="button"
              onClick={() => setShowFormatHint(true)}
              className="mt-2 rounded-full border-2 border-ink/15 px-3.5 py-1.5 text-xs font-bold text-ink transition hover:border-blue-400 hover:bg-blue-50"
            >
              Læs hele eksamensformen (forløb, indhold og bedømmelse)
            </button>
          </div>

          <p className="text-center text-xs text-ink/45">{sats.intro.closingNote}</p>

          <button
            type="button"
            onClick={() => setConfirmStart(true)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3.5 text-base font-bold text-white shadow-lg",
              theme.gradient
            )}
          >
            <ClockIcon className="h-5 w-5" /> Start prøven ( {sats.minutes} min )
          </button>
        </div>

        {showFormatHint && <ExamFormatSheet education={education} schoolId={progress.school} onClose={() => setShowFormatHint(false)} />}

        {confirmStart && (
          <Modal title="Er du sikker på, at du vil starte prøven?" onClose={() => setConfirmStart(false)}>
            <p className="text-sm leading-relaxed text-ink/60">
              Uret på {sats.minutes} minutter <span className="font-bold text-ink">starter med det samme</span>, og du får &ldquo;{sats.title}&rdquo; :
              en tekst med {tasks.length} opgaver. Undervejs kan du ikke gemme eller holde pause : afbryder du, forsvinder besvarelsen. Til
              gengæld kan du altid fortryde, indtil du trykker &lsquo;Start nu&rsquo;.
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setConfirmStart(false)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
                Jeg vil ikke starte endnu
              </button>
              <button type="button" onClick={startExam} className={cn("flex-1 rounded-full bg-gradient-to-r py-2.5 text-sm font-bold text-white shadow-md", theme.gradient)}>
                Start nu : uret går
              </button>
            </div>
          </Modal>
        )}
      </motion.div>
    );
  }

  // --------------------------------------------------------------------------
  if (phase === "grading") {
    const LINES = [
      "Læser dine besvarelser igennem …",
      "Retter delspørgsmålene …",
      "Tæller point sammen …",
      "Pakker gennemgang og kopiér-tekst ind …",
    ];
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="app-page-narrow flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <Mascot pose="explain" size="lg" reduceMotion={reduceMotion} speech="Jeg er næsten færdig med at se på din besvarelse…" />
        <p className="mt-5 font-display text-xl font-extrabold text-ink">Lingua retter prøven</p>
        <p className="mt-1 h-5 text-sm font-semibold text-ink/55">{LINES[gradingTick % LINES.length]}</p>
        <div className="mt-5 h-2.5 w-56 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className={cn("h-full rounded-full", theme.bar)}
            initial={reduceMotion ? false : { width: "6%" }}
            animate={{ width: "96%" }}
            transition={{ duration: reduceMotion ? 0.9 : 2.6, ease: "easeInOut" }}
          />
        </div>
        <p className="mt-4 text-xs text-ink/40">Resultatet er klar om et øjeblik : du behøver ikke gøre noget.</p>
      </motion.div>
    );
  }

  // --------------------------------------------------------------------------
  if (phase === "running") {
    const warning = secs <= 300;
    const critical = secs <= 60;
    return (
      <div className="app-page lg:max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0 space-y-6">
            <div className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center justify-between gap-2 bg-[#faf8ff]/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-[#faf8ff]/80">
              <button
                type="button"
                onClick={() => setConfirmAbort(true)}
                className="inline-flex items-center rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-rose-300 hover:text-rose-600"
              >
                Afbryd prøve
              </button>
              <p className="text-xs font-semibold text-ink/50">
                {sats.title} · {sats.schoolLabel}
              </p>
              {/* Mobil-ur: ligger øverst ved siden af afbryd-knappen */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold tabular-nums lg:hidden",
                  critical ? "animate-pulse bg-rose-100 text-rose-700" : warning ? "bg-amber-100 text-amber-800" : cn(theme.accentChip)
                )}
                aria-live="polite"
              >
                <ClockIcon className="h-4 w-4" />
                {fmtTime(secs)}
              </span>
            </div>

            <ExamArticlePane article={sats.article} marks={marks} setMarks={setMarks} />

            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-extrabold text-ink">De {tasks.length} opgaver</h2>
                <p className="text-xs text-ink/50">
                  Skriv dit eget svar i feltet under hver opgave (det er det, du skal kunne sige mundtligt til eksamen), og besvar
                  delspørgsmålene, som appen retter. Besvaret: {writtenCount} af {tasks.length} opgaver · {checkAnsweredCount} af{" "}
                  {totalChecks} delspørgsmål.
                </p>
              </div>
              {tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  total={tasks.length}
                  written={written[t.id] ?? ""}
                  onWrite={(v) => setWritten((prev) => ({ ...prev, [t.id]: v }))}
                  answers={checkAnswers}
                  onAnswer={(id, a) => setCheckAnswers((prev) => ({ ...prev, [id]: a }))}
                />
              ))}

              <button
                type="button"
                onClick={() => (writtenCount < tasks.length || checkAnsweredCount < totalChecks ? setConfirmSubmit(true) : submit())}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-4 text-base font-extrabold text-white shadow-lg",
                  theme.gradient
                )}
              >
                Indsend prøven
              </button>
            </div>
          </div>

          {/* Ur + status i siden (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-3">
              <div className={cn("rounded-2xl border-2 bg-white p-4 text-center shadow-sm", critical ? "border-rose-400" : warning ? "border-amber-400" : "border-ink/10")}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Forberedelse · {sats.minutes} min</p>
                <p
                  className={cn(
                    "mt-1 font-display text-4xl font-extrabold tabular-nums",
                    critical ? "animate-pulse text-rose-600" : warning ? "text-amber-600" : "text-ink"
                  )}
                  aria-live="polite"
                >
                  {fmtTime(secs)}
                </p>
                <p className="mt-1 text-[11px] text-ink/45">Ringeklokken lyder, når tiden er gået ; så afleverer du med det samme.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Status</p>
                <div className="mt-2 space-y-1.5">
                  {tasks.map((t) => {
                    const hasText = (written[t.id] ?? "").trim().length > 0;
                    const done = t.checks.filter((c) => isCheckAnswered(checkAnswers[c.id])).length;
                    return (
                      <div key={t.id} className="flex items-center gap-2 text-xs">
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold",
                            hasText && done === t.checks.length ? cn(theme.solidBg, "text-white") : "bg-ink/10 text-ink/40"
                          )}
                        >
                          {t.no}
                        </span>
                        <span className={cn("flex-1 truncate", hasText ? "font-semibold text-ink" : "text-ink/40")}>{t.label}</span>
                        <span className="tabular-nums text-[10px] text-ink/35">
                          {done}/{t.checks.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => (writtenCount < tasks.length || checkAnsweredCount < totalChecks ? setConfirmSubmit(true) : submit())}
                  className={cn("mt-3 w-full rounded-full py-2.5 text-sm font-bold text-white shadow-md", theme.solidBg)}
                >
                  Indsend
                </button>
              </div>
              <p className="px-1 text-[10px] leading-relaxed text-ink/40">
                Timeren matcher forberedelsestiden til den virkelige eksamen ({sats.minutes} min). Brug markerings-værktøjerne i teksten som
                dine eksamens-ridser, og skriv svarene, som du vil læse dem op.
              </p>
            </div>
          </aside>
        </div>

        {/* Tiden er gået: klokken tvinger aflevering */}
        {timeUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171225]/75 p-4">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm space-y-3 rounded-3xl bg-white p-6 text-center shadow-2xl"
              role="alertdialog"
              aria-modal="true"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl" aria-hidden="true">
                🔔
              </span>
              <h3 className="font-display text-xl font-extrabold text-ink">Tiden er gået!</h3>
              <p className="text-sm text-ink/60">
                Klokken har ringet : præcis som i forberedelseslokalet. Nu beder vi dig om at aflevere din opgave med det samme.
              </p>
              <button
                type="button"
                onClick={submit}
                className={cn("w-full rounded-full bg-gradient-to-r py-3 text-sm font-extrabold text-white shadow-md", theme.gradient)}
              >
                Aflevér besvarelsen nu
              </button>
              <p className="text-[11px] text-ink/40">Du kan ikke svare mere, mens uret er løbet ud.</p>
            </motion.div>
          </div>
        )}

        {confirmSubmit && (
          <Modal title="Vil du aflevere nu?" onClose={() => setConfirmSubmit(false)}>
            <p className="text-sm text-ink/60">
              Du har besvaret {writtenCount} af {tasks.length} opgaver i skrivefelterne og {checkAnsweredCount} af {totalChecks}
              delspørgsmål. Til den virkelige eksamen tæller det, at du forsøger alle syv opgaver : vil du aflevere alligevel?
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setConfirmSubmit(false)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
                Svar færdig først
              </button>
              <button type="button" onClick={submit} className={cn("flex-1 rounded-full py-2.5 text-sm font-bold text-white", theme.solidBg)}>
                Aflevér alligevel
              </button>
            </div>
          </Modal>
        )}

        {confirmAbort && (
          <Modal title="Afbryd eksamensprøven?" onClose={() => setConfirmAbort(false)}>
            <p className="text-sm text-ink/60">Dine svar og markeringer gemmes ikke. Prøven starter forfra næste gang.</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setConfirmAbort(false)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
                Bliv i prøven
              </button>
              <button type="button" onClick={reset} className="flex-1 rounded-full bg-ink py-2.5 text-sm font-bold text-white">
                Afbryd
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RESULTAT
  const perTask = results?.perTask ?? [];
  const flat = results?.flat ?? [];
  const fullyRight = flat.filter((r) => r.score >= 0.999).length;
  const partly = flat.filter((r) => r.score > 0 && r.score < 0.999).length;
  const wrong = flat.filter((r) => r.answered && r.score === 0).length;

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="app-page space-y-5">
      <div className="text-center">
        <Mascot
          pose={pct >= 70 ? "celebrate" : pct >= 40 ? "thumbsup" : "encourage"}
          size="lg"
          className="mx-auto justify-center"
          reduceMotion={reduceMotion}
          speech={
            pct >= 85
              ? "Wow : du har fat i både fagsproget og grammatikken. Det her kan du til eksamen."
              : pct >= 56
                ? "Flot gennemført! Grundlaget er der : nu er det mønsteret i fejlene, vi skal have fat i."
                : pct >= 28
                  ? "Du er godt på vej. Gennemgangen herunder viser præcis, hvor du skal træne videre."
                  : "Godt gået at gennemføre hele prøven : nu er det gennemgangen, der gør dig skarpere."
          }
        />
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Prøven er afleveret : her er overblikket</h1>
        <p className="mt-1 text-ink/60">
          Du skrev en besvarelse i {perTask.filter((t) => t.answer.length > 0).length} af {tasks.length} opgaver og fik{" "}
          {fmtPoints(results?.points ?? 0)} af {totalChecks} point i delspørgsmålene ({pct}%).
        </p>
      </div>

      {/* 1) Rammen om karakteren (står øverst, som bedt) */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 dark:border-amber-500/40 dark:bg-amber-500/10">
        <p className="text-sm font-semibold leading-relaxed text-amber-900 dark:text-amber-200">
          <span className="font-extrabold">Vigtigt at læse først:</span> Denne prøve er lavet for at forberede dig : ikke for at dømme dig. Til
          den virkelige eksamen besvarer du de syv opgaver MUNDTLIGT, og den del kan hverken appen eller en AI bedømme. Derfor er karakteren her
          vejledende: den bygger kun på de lukkede delspørgsmål, og den kan godt være ligegyldig for din egentlige besvarelse. Bruger du den
          rigtigt, kan den til gengæld vise dit faglige niveau : læg mærke til MØNSTRET i, hvad du mestrer, og hvad du skal vende tilbage til.
          Dine skrevne svar får du feedback på ved at kopiere dem over til en AI længere nede.
        </p>
        {/* 2) Karakteren står lige under teksten */}
        <div className={cn("mt-4 flex items-center justify-center gap-4 rounded-xl bg-white/70 px-4 py-3 text-ink dark:bg-white/5", "sm:justify-between")}>
          <div className="flex items-center gap-4">
            <span className={cn("font-display text-5xl font-extrabold", theme.accentText)}>{grade.grade}</span>
            <div>
              <p className="text-sm font-bold">{grade.label}</p>
              <p className="text-[11px] text-ink/50">
                Vejledende karakter ud fra delspørgsmålene (7-trinsskalaen). Din fritekst tæller ikke med her ; den bedømmer AI&apos;en.
              </p>
            </div>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", theme.accentChip)}>{pct}%</span>
        </div>
      </div>

      {/* 2b) Hurtigt overblik */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { n: fullyRight, t: "Helt rigtige", c: "text-emerald-600 dark:text-emerald-400" },
          { n: partly, t: "Delvist rigtige", c: "text-amber-600 dark:text-amber-400" },
          { n: wrong, t: "Forkerte", c: "text-rose-600 dark:text-rose-400" },
          { n: fmtTime(usedSecs), t: "Tid brugt", c: "text-ink" },
        ].map((it) => (
          <div key={it.t} className="rounded-2xl border border-ink/10 bg-white p-3.5 text-center shadow-sm">
            <p className={cn("font-display text-xl font-extrabold tabular-nums", it.c)}>{it.n}</p>
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-ink/45">{it.t}</p>
          </div>
        ))}
      </div>

      {/* 3) "Vil du gemme din prøve?" - LIGE før aflevering til AI */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <p className="font-bold text-ink">Vil du gemme din prøve? Kopier din besvarelse til tekst her! Husk at indsætte det i et dokument.</p>
        <p className="mt-1 text-xs text-ink/50">
          Teksten indeholder alle syv opgaver, dine egne skrevne svar og dine svar på delspørgsmålene : altså det, du kan tage med ind som
          notepapir.
        </p>
        <button
          type="button"
          onClick={copyAnswer}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 py-3 text-sm font-bold transition",
            copied ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-ink/15 bg-white text-ink hover:border-blue-400 hover:bg-blue-50"
          )}
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : null}
          {copied ? "Besvarelsen er kopieret til udklipsholderen" : "Kopiér besvarelse som tekst"}
        </button>
      </div>

      {/* 4) Aflevér til AI */}
      <div className={cn("rounded-2xl border-2 bg-white p-5 shadow-sm", theme.borderActive)}>
        <p className="flex items-center gap-2 font-bold text-ink">
          <SparklesIcon className="h-4 w-4" /> Få feedback på dine skrevne svar
        </p>
        <p className="mt-1 text-sm text-ink/60">
          Knappen herunder kopierer en færdig censor-prompt med alle syv opgaver, DINE skrevne svar, dine delsvar og hele tekstgrundlaget, og
          åbner Copilot i en ny fane. Sæt ind (Ctrl/Cmd+V) og send : så får du en vejledende karakter og en gennemgang af hver opgave. Du kan
          også bruge en anden AI : teksten ligger i udklipsholderen.
        </p>
        <button
          type="button"
          onClick={handInToAi}
          className={cn("mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3 text-sm font-bold text-white shadow-md", theme.gradient)}
        >
          <SparklesIcon className="h-4 w-4" /> Aflevér din opgave til AI-bedømmelse
        </button>
        <p className="mt-2 text-[11px] text-ink/40">Indhold kopieres fra din browser ; intet sendes nogen steder automatisk.</p>
      </div>

      {/* 5) Gennemgang af hver opgave */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-extrabold text-ink">Gennemgang: én opgave ad gangen</h2>
        {perTask.map((r) => {
          const taskPoints = r.checks.reduce((sum, c) => sum + c.score, 0);
          return (
            <div key={r.task.id} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold text-white", theme.solidBg)}>
                  {r.task.no}
                </span>
                <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Opgave {r.task.no} · {r.task.label}</p>
                {r.checks.length > 0 && (
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold text-ink/60">
                    {fmtPoints(taskPoints)} / {r.checks.length} point
                  </span>
                )}
                {r.task.openEnded && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    mange rigtige svar
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{r.task.prompt}</p>

              {/* Elevens eget svar */}
              <div className="mt-2 rounded-xl bg-ink/[0.03] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink/40">Din besvarelse</p>
                {r.answer.length > 0 ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-ink/80">{r.answer}</p>
                ) : (
                  <p className="mt-1 text-sm italic text-ink/40">Du skrev ikke noget i denne opgave.</p>
                )}
              </div>

              {/* Checkliste: hvad et stærkt svar rammer */}
              <div className="mt-2 rounded-xl border border-ink/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink/40">Ret dig selv: det bør svaret ramme</p>
                <ul className="mt-1.5 space-y-1">
                  {r.task.points.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  <span className="font-bold text-ink">Sådan kunne et stærkt svar lyde: </span>
                  {r.task.modelAnswer}
                </p>
              </div>

              {/* Delspørgsmålene med rettelse */}
              {r.checks.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-ink/40">Delspørgsmål (dem gav karakteren)</p>
                  {r.checks.map((c) => {
                    const lab = scoreLabel(c.score, c.answered);
                    return (
                      <div key={c.check.id} className="rounded-xl border border-ink/10 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-extrabold text-white", lab.tone)}>
                            {c.score >= 0.999 ? <CheckIcon className="h-3 w-3" /> : c.answered ? <XIcon className="h-3 w-3" /> : "·"}
                            {lab.text}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm font-medium text-ink">{c.check.prompt}</p>
                        <CheckAnswerSummary check={c.check} answer={c.answer} />
                        <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{c.check.feedback}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mt-2 rounded-xl bg-ink/[0.03] p-3 text-sm leading-relaxed text-ink/70">{r.task.feedback}</p>
              <p className="mt-2 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="font-bold">Til selve eksamen:</span> {r.task.examTip}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 pb-2">
        <button type="button" onClick={onClose} className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink">
          Tilbage til prøver
        </button>
        <button type="button" onClick={reset} className={cn("rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md", theme.solidBg)}>
          {allUsed ? "Tag en ny prøve (puljen er blandet)" : "Næste prøve (nyt sæt)"}
        </button>
      </div>

      {aiModal === "copied" && (
        <Modal title="Prompten er kopieret" onClose={() => setAiModal(null)}>
          <p className="text-sm text-ink/60">
            Din censor-prompt (med alle syv opgaver, dine svar og tekstgrundlaget) ligger nu i udklipsholderen. Åbn Copilot via knappen
            herunder, sæt ind (Ctrl/Cmd+V) og send.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setAiModal(null)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
              Luk
            </button>
            <a
              href="https://copilot.microsoft.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAiModal(null)}
              className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r py-2.5 text-sm font-bold text-white shadow-md", theme.gradient)}
            >
              <SparklesIcon className="h-4 w-4" /> Åbn Copilot
            </a>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Ét opgavekort: hint-knap (?), fritekst-felt og de lukkede delspørgsmål.
// ---------------------------------------------------------------------------
function TaskCard({
  task,
  total,
  written,
  onWrite,
  answers,
  onAnswer,
}: {
  task: ExamTaskT;
  total: number;
  written: string;
  onWrite: (v: string) => void;
  answers: Record<string, CheckAns>;
  onAnswer: (checkId: string, a: CheckAns) => void;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const hasText = written.trim().length > 0;
  const doneChecks = task.checks.filter((c) => isCheckAnswered(answers[c.id])).length;
  const complete = hasText && doneChecks === task.checks.length;

  return (
    <div className={cn("rounded-3xl border-2 bg-white p-4 shadow-sm sm:p-5", complete ? "border-emerald-200" : "border-ink/10")}>
      <div className="flex items-center justify-between gap-2">
        <p className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-ink/45">
          Opgave {task.no} / {total}
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-ink/60">{task.label}</span>
          {complete && <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />}
        </p>
        <button
          type="button"
          onClick={() => setHintOpen((v) => !v)}
          aria-expanded={hintOpen}
          aria-label={`Hvad skal jeg i opgave ${task.no} (${task.label})?`}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold transition",
            hintOpen ? "border-amber-400 bg-amber-100 text-amber-700" : "border-ink/15 text-ink/50 hover:border-amber-400 hover:text-amber-600"
          )}
        >
          ?
        </button>
      </div>

      {hintOpen && (
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="font-bold">Sådan gør du:</span> {task.hint.replace(/^Sådan gør du:\s*/, "")}
        </div>
      )}

      <p className="mt-2 text-[15px] font-semibold leading-relaxed text-ink">{task.prompt}</p>

      {task.openEnded && (
        <p className="mt-1.5 text-[11px] font-semibold text-ink/45">
          Her er der mange rigtige svar : det er dokumentationen (citater) og fagsproget, der tæller. Dit skrevne svar rettes ikke automatisk.
        </p>
      )}

      {/* 1) Elevens egen besvarelse (som notepapiret til eksamen) */}
      <div className="mt-3">
        <label htmlFor={`svar-${task.id}`} className="text-[11px] font-bold uppercase tracking-wide text-ink/40">
          Din besvarelse (den du skal kunne sige mundtligt)
        </label>
        <textarea
          id={`svar-${task.id}`}
          value={written}
          onChange={(e) => onWrite(e.target.value)}
          rows={4}
          placeholder={task.placeholder}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-ink/[0.02] px-3 py-2 text-base text-ink placeholder:text-ink/35 focus:border-blue-400 focus:outline-none"
        />
      </div>

      {/* 2) Delspørgsmål: dem retter appen, og de giver karakteren */}
      {task.checks.length > 0 && (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-ink/[0.02] p-3 sm:p-4">
          <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-ink/45">
            Delspørgsmål : dem retter appen
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-ink/50">
              {doneChecks} af {task.checks.length} besvaret
            </span>
          </p>
          <div className="mt-3 space-y-4">
            {task.checks.map((c) => (
              <div key={c.id}>
                <p className="text-sm font-medium leading-relaxed text-ink">{c.prompt}</p>
                <div className="mt-2">
                  {c.kind === "choice" && <ChoiceBlocks check={c} answer={answers[c.id]} onChange={(a) => onAnswer(c.id, a)} />}
                  {c.kind === "multi" && <MultiBlocks check={c} answer={answers[c.id]} onChange={(a) => onAnswer(c.id, a)} />}
                  {c.kind === "wordclass" && <WordClassBlocks check={c} answer={answers[c.id]} onChange={(a) => onAnswer(c.id, a)} />}
                  {c.kind === "analysis" && <AnalysisBlocks check={c} answer={answers[c.id]} onChange={(a) => onAnswer(c.id, a)} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChoiceBlocks({ check, answer, onChange }: { check: ExamChoiceCheckT; answer: CheckAns | undefined; onChange: (a: CheckAns) => void }) {
  const sel = answer && answer.kind === "choice" ? answer.selected : -1;
  return (
    <div className="grid gap-2">
      {check.options.map((opt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange({ kind: "choice", selected: i })}
          className={cn(
            "flex items-start gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-sm transition",
            sel === i ? "border-blue-500 bg-blue-50 font-semibold text-ink shadow-sm" : "border-ink/10 bg-white text-ink/70 hover:border-blue-300 hover:bg-blue-50/40"
          )}
        >
          <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold", sel === i ? "bg-blue-500 text-white" : "bg-ink/10 text-ink/50")}>
            {String.fromCharCode(65 + i)}
          </span>
          <span className="pt-0.5">{opt}</span>
        </button>
      ))}
    </div>
  );
}

function MultiBlocks({ check, answer, onChange }: { check: ExamMultiCheckT; answer: CheckAns | undefined; onChange: (a: CheckAns) => void }) {
  const sel = answer && answer.kind === "multi" ? answer.selected : [];
  function toggle(i: number) {
    const next = sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i];
    onChange({ kind: "multi", selected: next });
  }
  return (
    <div className="grid gap-2">
      <p className="text-[11px] font-semibold text-ink/45">Flere kan være rigtige : klik alle de muligheder, der passer (valgt: {sel.length})</p>
      {check.options.map((opt, i) => {
        const on = sel.includes(i);
        return (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-sm transition",
              on ? "border-blue-500 bg-blue-50 font-semibold text-ink shadow-sm" : "border-ink/10 bg-white text-ink/70 hover:border-blue-300 hover:bg-blue-50/40"
            )}
          >
            <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2", on ? "border-blue-500 bg-blue-500" : "border-ink/20 bg-white")}>
              {on && <CheckIcon className="h-3.5 w-3.5 text-white" />}
            </span>
            <span className="pt-0.5">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function WordClassBlocks({ check, answer, onChange }: { check: ExamWordClassCheckT; answer: CheckAns | undefined; onChange: (a: CheckAns) => void }) {
  const tags = answer && answer.kind === "wordclass" ? answer.tags : check.words.map(() => null);
  const [open, setOpen] = useState<number | null>(null);

  function pick(i: number, tag: ExamWordClassTag | null) {
    const next = [...tags];
    next[i] = tag;
    onChange({ kind: "wordclass", tags: next });
    setOpen(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {check.words.map((w, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className={cn(
              "flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition",
              open === i ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : tags[i] ? "border-emerald-300 bg-emerald-50 text-ink" : "border-ink/15 bg-white text-ink hover:border-blue-300"
            )}
            aria-haspopup="listbox"
            aria-expanded={open === i}
          >
            <span className="italic">“{w.word}”</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink/35">→</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", tags[i] ? "bg-emerald-500 text-white" : "bg-ink/10 text-ink/40")}>
              {tags[i] ? wordClassLabel(tags[i]!) : "vælg ordklasse"}
            </span>
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-ink/10 bg-white p-3 shadow-md sm:grid-cols-3" role="listbox" aria-label={`Ordklasse for ${check.words[open]?.word}`}>
          {EXAM_WORD_CLASS_TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="option"
              aria-selected={tags[open] === t.id}
              onClick={() => pick(open, t.id)}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-left text-xs font-semibold transition",
                tags[open] === t.id ? "border-blue-500 bg-blue-50" : "border-ink/10 hover:border-blue-300 hover:bg-blue-50/50"
              )}
            >
              {t.label}
            </button>
          ))}
          <button type="button" onClick={() => pick(open, null)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50">
            Fjern valg
          </button>
        </div>
      )}
    </div>
  );
}

function AnalysisBlocks({ check, answer, onChange }: { check: ExamAnalysisCheckT; answer: CheckAns | undefined; onChange: (a: CheckAns) => void }) {
  const symbols = answer && answer.kind === "analysis" ? answer.symbols : check.chunks.map(() => null);
  const [active, setActive] = useState<number | null>(null);

  function assign(i: number, sym: LedSymbol | null) {
    const next = [...symbols];
    next[i] = sym;
    onChange({ kind: "analysis", symbols: next });
    setActive(null);
  }

  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-ink/5 px-3.5 py-2.5 text-sm italic text-ink/70">“{check.sentence}”</p>
      <div className="flex flex-wrap gap-2">
        {check.chunks.map((chunk, i) => {
          const sym = symbols[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(active === i ? null : i)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition",
                active === i ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : sym ? "border-emerald-300 bg-emerald-50" : "border-ink/15 bg-white hover:border-blue-300"
              )}
              aria-haspopup="menu"
              aria-expanded={active === i}
            >
              <span>{chunk}</span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-ink/45">
                {sym ? (
                  <>
                    <LedGlyph symbol={sym} className="h-3.5 w-3.5" />
                    {getSymbolDef(sym).short}
                  </>
                ) : (
                  "vælg led-symbol"
                )}
              </span>
            </button>
          );
        })}
      </div>
      {active !== null && (
        <div className="rounded-2xl border border-ink/10 bg-white p-3 shadow-md" role="menu" aria-label="Vælg symbol for leddet">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink/40">Led for «{check.chunks[active]}»</p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {SYMBOLS.map((sym) => (
              <button
                key={sym.symbol}
                type="button"
                role="menuitem"
                onClick={() => assign(active, sym.symbol)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold text-ink transition hover:border-blue-400 hover:bg-blue-50",
                  symbols[active] === sym.symbol ? "border-blue-500 bg-blue-50" : "border-ink/10"
                )}
                title={sym.name}
              >
                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border", sym.colorClasses)}>
                  <LedGlyph symbol={sym.symbol} className="h-4.5 w-4.5" />
                </span>
                <span>{sym.short}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => assign(active, null)} className="mt-2 rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50">
            Fjern symbol fra leddet
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-ink/45">
        {SYMBOLS.map((s) => (
          <span key={s.symbol} className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-1">
            <LedGlyph symbol={s.symbol} className="h-3.5 w-3.5" /> {s.short}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Elevens delsvar som ren tekst (bruges i kopiér-teksten).
// ---------------------------------------------------------------------------
function checkAnswerAsText(c: ExamCheckT, a: CheckAns | undefined): string {
  if (!a) return "Svar: (ikke besvaret)";
  switch (c.kind) {
    case "choice":
      return a.kind === "choice" ? `Svar: ${c.options[a.selected]}` : "Svar: (ikke besvaret)";
    case "multi":
      if (a.kind !== "multi" || a.selected.length === 0) return "Svar: (ikke besvaret)";
      return "Svar: " + [...a.selected].sort((x, y) => x - y).map((i) => c.options[i]).join(" ; ");
    case "wordclass":
      if (a.kind !== "wordclass") return "Svar: (ikke besvaret)";
      return "Svar: " + c.words.map((w, i) => `${w.word} = ${a.tags[i] ? wordClassLabel(a.tags[i]!) : "(ikke valgt)"}`).join(" ; ");
    case "analysis":
      if (a.kind !== "analysis") return "Svar: (ikke besvaret)";
      return "Svar: " + c.chunks.map((ch, i) => `${ch} → ${a.symbols[i] ? getSymbolDef(a.symbols[i]!).short : "(ikke valgt)"}`).join(" ; ");
  }
}

// ---------------------------------------------------------------------------
// Resumé på resultatsiden: hvad eleven valgte, og hvad der var korrekt.
// ---------------------------------------------------------------------------
function CheckAnswerSummary({ check, answer }: { check: ExamCheckT; answer: CheckAns | undefined }) {
  let body: React.ReactNode = <p className="italic text-ink/40">Ikke besvaret</p>;

  if (check.kind === "choice" && answer && answer.kind === "choice") {
    const ok = answer.selected === check.correctIndex;
    body = (
      <div className="space-y-1 text-sm">
        <p className={ok ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}>Dit svar: «{check.options[answer.selected]}»</p>
        {!ok && <p className="text-ink/60">Korrekt: «{check.options[check.correctIndex]}»</p>}
      </div>
    );
  }

  if (check.kind === "multi" && answer && answer.kind === "multi" && answer.selected.length > 0) {
    body = (
      <div className="flex flex-wrap gap-1.5">
        {check.options.map((opt, i) => {
          const picked = answer.selected.includes(i);
          const correct = check.correctIndexes.includes(i);
          if (!picked && !correct) return null;
          const tone = picked && correct ? "bg-emerald-100 text-emerald-700" : picked ? "bg-rose-100 text-rose-700" : "bg-ink/5 text-ink/50";
          return (
            <span key={i} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold", tone)}>
              {opt} {picked && correct ? "✓" : picked ? "✗" : "(manglede)"}
            </span>
          );
        })}
      </div>
    );
  }

  if (check.kind === "wordclass" && answer && answer.kind === "wordclass") {
    body = (
      <div className="flex flex-wrap gap-1.5">
        {check.words.map((w, i) => {
          const tag = answer.tags[i];
          const ok = tag === w.correct;
          return (
            <span key={i} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold", ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
              “{w.word}” = {tag ? wordClassLabel(tag) : "(tomt)"} {ok ? "✓" : `✗ (korrekt: ${wordClassLabel(w.correct)})`}
            </span>
          );
        })}
      </div>
    );
  }

  if (check.kind === "analysis" && answer && answer.kind === "analysis") {
    body = (
      <div className="flex flex-wrap gap-1.5">
        {check.chunks.map((ch, i) => {
          const sym = answer.symbols[i];
          const ok = sym === check.correctMap[i];
          return (
            <span key={i} className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold", ok ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-300 bg-rose-50 text-rose-700")}>
              {ch} → {sym ? getSymbolDef(sym).short : "(tomt)"}{" "}
              {!ok && <span className="font-semibold text-ink/50">(korrekt: {getSymbolDef(check.correctMap[i]).short})</span>}
            </span>
          );
        })}
      </div>
    );
  }

  return <div className="mt-1.5 rounded-xl bg-ink/[0.03] p-2.5">{body}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171225]/60 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-extrabold text-ink">{title}</h3>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
