"use client";

// ---------------------------------------------------------------------------
// EKSAMENSPRØVE (kun HHX, og kun på skoler der har netop denne eksamensform).
//
// Prøven spejler AP-eksamen på Risskov: du trækker en ukendt tekst med SYV
// opgaver og har 40 minutters skriftlig forberedelse. Hver opgave har sin egen
// svarform, præcis som på skolens ark:
//   1 genre (vælg + begrund) · 2 Ciceros pentagram (seks felter) ·
//   3 sproglige særtræk (ét felt) · 4 morfologi (fire ord: opdeling + ét
//   morfem) · 5 syntaktisk analyse (led-symboler) · 6 verballedets tid (to
//   sætninger: vælg tid + omskriv) · 7 hoved- og ledsætninger (opdel +
//   indleder + funktion).
//
// Karakteren bygger på det, der kan rettes entydigt. Pentagrammet, de
// sproglige observationer og begrundelserne rettes ALDRIG automatisk : de
// følger med, når besvarelsen kopieres over til AI-feedback.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type {
  CategoryStat,
  Education,
  ExamAnalysisPartT,
  ExamClauseFnId,
  ExamClausePartT,
  ExamFieldT,
  ExamFieldsPartT,
  ExamGenreId,
  ExamGenrePartT,
  ExamMorphologyPartT,
  ExamTaskT,
  ExamTenseId,
  ExamTensePartT,
  LedSymbol,
  Progress,
} from "../types";
import {
  EXAM_CLAUSE_FUNCTIONS,
  EXAM_GENRES,
  EXAM_TENSES,
  HHX_EXAM_SATS,
  clauseFnLabel,
  genreLabel,
  pickNextExamSats,
  tenseLabel,
  tenseLatin,
} from "../data/hhx/examSats";
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

/** Elevens svar på én opgave. Tomme felter betyder "ikke besvaret". */
type Ans = {
  genre?: ExamGenreId;
  /** Alle skrivefelter i opgaven, nøglet på feltets id. */
  text: Record<string, string>;
  /** Opgave 5: ét symbol pr. led-klump. */
  led?: (LedSymbol | null)[];
  /** Opgave 6: valgt tid pr. sætning. */
  tense?: Record<string, ExamTenseId>;
  /** Opgave 7: hoved/led pr. sætningsdel + ledsætningens funktion. */
  clause?: ("hoved" | "led" | null)[];
  clauseFn?: ExamClauseFnId;
};

const EMPTY: Ans = { text: {} };

// Karakterskalaen. Den er en smule mildere end prøvegeneratorens, fordi den
// sidder oven på en rigtig eksamensopgave: karakteren skal kunne vise fagligt
// niveau uden at slå benene væk under en, der er ved at lære stoffet.
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

/** Point med dansk decimalkomma (2,5 - ikke 2.5). */
function fmtPoints(n: number): string {
  return (Math.round(n * 10) / 10).toLocaleString("da-DK");
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Mild tekst-sammenligning. Eleven skal ikke straffes for mellemrum, store
// bogstaver, tankestreger eller et punktum til sidst.
// ---------------------------------------------------------------------------
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[–—‐‑‒]/g, "-")
    .replace(/[.,;:!?"'«»]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

/** Morfem-opdeling: "impuls-køb-e-ne" (bindestreger betyder noget her). */
function matchSplit(input: string, answer: string, accepts?: string[]): boolean {
  const n = norm(input);
  if (!n) return false;
  return [answer, ...(accepts ?? [])].some((a) => norm(a) === n);
}

/** Ét enkelt morfem: her er bindestreger ligegyldige ("-en" = "en"). */
function matchMorpheme(input: string, answer: string, accepts?: string[]): boolean {
  const strip = (x: string) => norm(x).replace(/-/g, "");
  const n = strip(input);
  if (!n) return false;
  return [answer, ...(accepts ?? [])].some((a) => strip(a) === n);
}

/** Omskrivning: de rigtige verbumsformer skal være med. */
function matchRewrite(input: string, keys: string[]): boolean {
  const n = " " + input.toLowerCase().normalize("NFKC").replace(/[.,;:!?"'«»]/g, " ").replace(/\s+/g, " ").trim() + " ";
  if (n.trim().length === 0) return false;
  return keys.every((k) => n.includes(" " + k.toLowerCase() + " "));
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

// ---------------------------------------------------------------------------
// Rettelse. Ét point pr. entydigt delsvar ; de åbne felter tæller ikke med.
// ---------------------------------------------------------------------------
type Scored = { label: string; got: string; facit: string; ok: boolean };

function scoreTask(task: ExamTaskT, a: Ans | undefined): { rows: Scored[]; points: number; max: number } {
  const ans = a ?? EMPTY;
  const rows: Scored[] = [];
  const p = task.part;

  if (p.kind === "genre") {
    rows.push({
      label: "Genre",
      got: ans.genre ? genreLabel(ans.genre) : "(ikke valgt)",
      facit: genreLabel(p.correct),
      ok: ans.genre === p.correct,
    });
  }

  if (p.kind === "morphology") {
    p.words.forEach((w, i) => {
      const split = ans.text[`${i}-split`] ?? "";
      const ask = ans.text[`${i}-ask`] ?? "";
      rows.push({
        label: `"${w.word}" : morfemer`,
        got: split.trim() || "(tomt)",
        facit: w.split,
        ok: matchSplit(split, w.split, w.splitAccepts),
      });
      rows.push({
        label: `"${w.word}" : ${w.ask.label.toLowerCase()}`,
        got: ask.trim() || "(tomt)",
        facit: w.ask.answer,
        ok: matchMorpheme(ask, w.ask.answer, w.ask.accepts),
      });
    });
  }

  if (p.kind === "analysis") {
    p.chunks.forEach((chunk, i) => {
      const sym = ans.led?.[i] ?? null;
      rows.push({
        label: `«${chunk}»`,
        got: sym ? getSymbolDef(sym).short : "(tomt)",
        facit: getSymbolDef(p.correctMap[i]).short,
        ok: sym === p.correctMap[i],
      });
    });
  }

  if (p.kind === "tense") {
    p.items.forEach((it) => {
      const picked = ans.tense?.[it.id];
      rows.push({
        label: `"${it.verb}" : tid`,
        got: picked ? tenseLabel(picked) : "(ikke valgt)",
        facit: tenseLabel(it.correct),
        ok: picked === it.correct,
      });
      const rewrite = ans.text[`${it.id}-rewrite`] ?? "";
      rows.push({
        label: `Omskrivning til ${tenseLatin(it.rewriteTo)}`,
        got: rewrite.trim() || "(tomt)",
        facit: it.rewriteAnswer,
        ok: matchRewrite(rewrite, it.rewriteKeys),
      });
    });
  }

  if (p.kind === "clause") {
    p.parts.forEach((part, i) => {
      const picked = ans.clause?.[i] ?? null;
      rows.push({
        label: `«${part.text}»`,
        got: picked === "hoved" ? "Hovedsætning" : picked === "led" ? "Ledsætning" : "(ikke markeret)",
        facit: part.type === "hoved" ? "Hovedsætning" : "Ledsætning",
        ok: picked === part.type,
      });
    });
    const ind = ans.text["indleder"] ?? "";
    rows.push({
      label: "Ledsætningens indleder",
      got: ind.trim() || "(tomt)",
      facit: p.indleder,
      ok: matchMorpheme(ind, p.indleder, p.indlederAccepts),
    });
    rows.push({
      label: "Ledsætningens funktion",
      got: ans.clauseFn ? clauseFnLabel(ans.clauseFn) : "(ikke valgt)",
      facit: clauseFnLabel(p.funktion),
      ok: ans.clauseFn === p.funktion,
    });
  }

  return { rows, points: rows.filter((r) => r.ok).length, max: rows.length };
}

/** Har eleven overhovedet rørt opgaven? (Bruges til status og aflevering.) */
function taskTouched(task: ExamTaskT, a: Ans | undefined): boolean {
  if (!a) return false;
  if (a.genre || a.clauseFn) return true;
  if (a.led?.some((s) => s !== null)) return true;
  if (a.tense && Object.keys(a.tense).length > 0) return true;
  if (a.clause?.some((c) => c !== null)) return true;
  return Object.values(a.text).some((v) => v.trim().length > 0);
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
  const [answers, setAnswers] = useState<Record<string, Ans>>({});
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
  const touchedCount = useMemo(() => tasks.filter((t) => taskTouched(t, answers[t.id])).length, [tasks, answers]);
  const maxPoints = useMemo(() => tasks.reduce((n, t) => n + scoreTask(t, undefined).max, 0), [tasks]);

  const results = useMemo(() => {
    if (submittedAt === null) return null;
    const perTask = tasks.map((t) => ({ task: t, ans: answers[t.id] ?? EMPTY, ...scoreTask(t, answers[t.id]) }));
    const points = perTask.reduce((n, t) => n + t.points, 0);
    const byCategory: Record<string, CategoryStat> = {};
    for (const t of perTask) {
      if (!t.task.category || t.max === 0) continue;
      const stat = byCategory[t.task.category] ?? { correct: 0, total: 0 };
      byCategory[t.task.category] = { correct: stat.correct + t.points, total: stat.total + t.max };
    }
    return { perTask, points, byCategory };
  }, [submittedAt, tasks, answers]);

  const pct = results && maxPoints > 0 ? Math.round((results.points / maxPoints) * 100) : 0;
  const grade = gradeFor(pct);

  useEffect(() => {
    onSessionChange?.(phase === "running" || phase === "grading");
  }, [phase, onSessionChange]);

  useEffect(() => {
    if (phase !== "running") return;
    const iv = window.setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    if (phase !== "grading") return;
    const iv = window.setInterval(() => setGradingTick((t) => t + 1), 620);
    const t = window.setTimeout(() => setPhase("result"), reduceMotion ? 900 : 2600);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(t);
    };
  }, [phase, reduceMotion]);

  const timeUp = phase === "running" && secs === 0;
  useEffect(() => {
    if (timeUp) playExamBell();
  }, [timeUp]);

  useEffect(() => {
    const lock = timeUp || confirmSubmit || confirmAbort || confirmStart || aiModal !== null || showFormatHint;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [timeUp, confirmSubmit, confirmAbort, confirmStart, aiModal, showFormatHint]);

  const update = useCallback((taskId: string, patch: (prev: Ans) => Ans) => {
    setAnswers((prev) => ({ ...prev, [taskId]: patch(prev[taskId] ?? { text: {} }) }));
  }, []);

  const startExam = useCallback(() => {
    setConfirmStart(false);
    setUsage(markExamSatsUsed(sats.id));
    setPhase("running");
    setShowFormatHint(false);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion, sats.id]);

  const submit = useCallback(() => {
    let points = 0;
    const byCat: Record<string, CategoryStat> = {};
    for (const t of tasks) {
      const s = scoreTask(t, answers[t.id]);
      points += s.points;
      if (t.category && s.max > 0) {
        const stat = byCat[t.category] ?? { correct: 0, total: 0 };
        byCat[t.category] = { correct: stat.correct + s.points, total: stat.total + s.max };
      }
    }
    setSubmittedAt(Date.now());
    setUsedSecs(sats.minutes * 60 - secs);
    setConfirmSubmit(false);
    setPhase("grading");
    onExamComplete("hhx", points, maxPoints, byCat);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [answers, maxPoints, onExamComplete, reduceMotion, sats.minutes, secs, tasks]);

  /** Elevens besvarelse som ren tekst (aldrig facit). */
  function buildCopyText(): string {
    const L: string[] = [];
    L.push(`AP-eksamensprøve (HHX) · ${sats.title}`);
    L.push(`Tekst: "${sats.article.title}" (${sats.article.byline})`);
    L.push(`Forberedelsestid: ${sats.minutes} minutter · ${tasks.length} opgaver`);
    L.push("");
    for (const t of tasks) {
      const a = answers[t.id] ?? EMPTY;
      L.push(`OPGAVE ${t.no}: ${t.prompt}`);
      const p = t.part;
      if (p.kind === "genre") {
        L.push(`  Genre: ${a.genre ? genreLabel(a.genre) : "(ikke valgt)"}`);
        L.push(`  ${p.justify.label} ${(a.text["begrundelse"] ?? "").trim() || "(ikke besvaret)"}`);
      }
      if (p.kind === "fields") {
        for (const f of p.fields) L.push(`  ${f.label}: ${(a.text[f.id] ?? "").trim() || "(ikke besvaret)"}`);
      }
      if (p.kind === "morphology") {
        p.words.forEach((w, i) => {
          L.push(`  "${w.word}"`);
          L.push(`    Morfemer: ${(a.text[`${i}-split`] ?? "").trim() || "(ikke besvaret)"}`);
          L.push(`    ${w.ask.label}: ${(a.text[`${i}-ask`] ?? "").trim() || "(ikke besvaret)"}`);
        });
      }
      if (p.kind === "analysis") {
        L.push(`  Sætning: "${p.sentence}"`);
        L.push("  " + p.chunks.map((c, i) => `${c} → ${a.led?.[i] ? getSymbolDef(a.led[i]!).short : "(ikke valgt)"}`).join(" ; "));
      }
      if (p.kind === "tense") {
        for (const it of p.items) {
          L.push(`  "${it.sentence}"`);
          L.push(`    "${it.verb}" står i: ${a.tense?.[it.id] ? tenseLabel(a.tense[it.id]!) : "(ikke valgt)"}`);
          L.push(`    Omskrevet til ${tenseLatin(it.rewriteTo)}: ${(a.text[`${it.id}-rewrite`] ?? "").trim() || "(ikke besvaret)"}`);
        }
      }
      if (p.kind === "clause") {
        L.push(`  Sætning: "${p.sentence}"`);
        p.parts.forEach((part, i) => {
          const v = a.clause?.[i];
          L.push(`    "${part.text}" = ${v === "hoved" ? "hovedsætning" : v === "led" ? "ledsætning" : "(ikke markeret)"}`);
        });
        L.push(`    Indleder: ${(a.text["indleder"] ?? "").trim() || "(ikke besvaret)"}`);
        L.push(`    Ledsætningens funktion: ${a.clauseFn ? clauseFnLabel(a.clauseFn) : "(ikke valgt)"}`);
      }
      L.push("");
    }
    const m = countExamMarks(marks);
    if (m.hl + m.led + m.wc > 0) {
      L.push("Markeringer i teksten:");
      L.push(`- ${m.hl} tusch-markeringer, ${m.led} led-mærkater, ${m.wc} ordklasse-mærkater (mine noter i teksten).`);
      L.push("");
    }
    return L.join("\n");
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
    setAnswers({});
    setMarks({});
    setSubmittedAt(null);
    setConfirmSubmit(false);
    setConfirmAbort(false);
    setAiModal(null);
    setConfirmStart(false);
    const u = loadExamSatsUsage();
    setUsage(u);
    const next = pickNextExamSats(u.usedIds, sats.id);
    setPick(next);
    setSecs(next.sats.minutes * 60);
  }

  // --------------------------------------------------------------------------
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
            <span className="rounded-full bg-white/15 px-3 py-1.5">Mundtlig eksamen bagefter</span>
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
            speech="Tag det roligt. Læs teksten grundigt, og skriv svarene ned som på notepapiret ; her findes der ingen forkerte forsøg."
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
              Hver opgave har sin egen svarform, præcis som på eksamensarket. Det, der kan rettes entydigt (genre, morfemer, led, tider,
              omskrivninger, indleder og ledfunktion), retter appen, og det giver den vejledende karakter. Pentagrammet og dine sproglige
              observationer rettes ikke : de sendes til AI&apos;en, hvis du vil have feedback på dem.
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
            className={cn("flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3.5 text-base font-bold text-white shadow-lg", theme.gradient)}
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
      "Retter morfemer, led og tider …",
      "Tæller point sammen …",
      "Pakker gennemgang og kopiér-tekst ind …",
    ];
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
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
                  Besvar opgaverne, som du vil læse dem op til eksamen. Du er i gang med {touchedCount} af {tasks.length}.
                </p>
              </div>
              {tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  total={tasks.length}
                  ans={answers[t.id] ?? EMPTY}
                  onChange={(patch) => update(t.id, patch)}
                />
              ))}

              <button
                type="button"
                onClick={() => (touchedCount < tasks.length ? setConfirmSubmit(true) : submit())}
                className={cn("flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-4 text-base font-extrabold text-white shadow-lg", theme.gradient)}
              >
                Indsend prøven
              </button>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-3">
              <div className={cn("rounded-2xl border-2 bg-white p-4 text-center shadow-sm", critical ? "border-rose-400" : warning ? "border-amber-400" : "border-ink/10")}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Forberedelse · {sats.minutes} min</p>
                <p
                  className={cn("mt-1 font-display text-4xl font-extrabold tabular-nums", critical ? "animate-pulse text-rose-600" : warning ? "text-amber-600" : "text-ink")}
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
                    const done = taskTouched(t, answers[t.id]);
                    return (
                      <div key={t.id} className="flex items-center gap-2 text-xs">
                        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold", done ? cn(theme.solidBg, "text-white") : "bg-ink/10 text-ink/40")}>
                          {t.no}
                        </span>
                        <span className={cn("flex-1 truncate", done ? "font-semibold text-ink" : "text-ink/40")}>{t.label}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => (touchedCount < tasks.length ? setConfirmSubmit(true) : submit())}
                  className={cn("mt-3 w-full rounded-full py-2.5 text-sm font-bold text-white shadow-md", theme.solidBg)}
                >
                  Indsend
                </button>
              </div>
              <p className="px-1 text-[10px] leading-relaxed text-ink/40">
                Timeren matcher forberedelsestiden til den virkelige eksamen ({sats.minutes} min). Brug markerings-værktøjerne i teksten som
                dine eksamens-ridser.
              </p>
            </div>
          </aside>
        </div>

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
              <button type="button" onClick={submit} className={cn("w-full rounded-full bg-gradient-to-r py-3 text-sm font-extrabold text-white shadow-md", theme.gradient)}>
                Aflevér besvarelsen nu
              </button>
              <p className="text-[11px] text-ink/40">Du kan ikke svare mere, mens uret er løbet ud.</p>
            </motion.div>
          </div>
        )}

        {confirmSubmit && (
          <Modal title="Vil du aflevere nu?" onClose={() => setConfirmSubmit(false)}>
            <p className="text-sm text-ink/60">
              Du er i gang med {touchedCount} af {tasks.length} opgaver. Til den virkelige eksamen tæller det, at du forsøger alle syv : vil du
              aflevere alligevel?
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
  const allRows = perTask.flatMap((t) => t.rows);
  const right = allRows.filter((r) => r.ok).length;
  const wrong = allRows.filter((r) => !r.ok).length;
  const written = perTask.filter((t) => taskTouched(t.task, t.ans)).length;

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
          Du var i gang med {written} af {tasks.length} opgaver og fik {fmtPoints(results?.points ?? 0)} af {maxPoints} point i de opgaver, der
          kan rettes ({pct}%).
        </p>
      </div>

      {/* 1) Rammen om karakteren (står øverst) */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 dark:border-amber-500/40 dark:bg-amber-500/10">
        <p className="text-sm font-semibold leading-relaxed text-amber-900 dark:text-amber-200">
          <span className="font-extrabold">Vigtigt at læse først:</span> Denne prøve er lavet for at forberede dig : ikke for at dømme dig. Til
          den virkelige eksamen besvarer du de syv opgaver MUNDTLIGT, og den del kan hverken appen eller en AI bedømme. Derfor er karakteren her
          vejledende: den bygger kun på det, der kan rettes entydigt (genre, morfemer, led, tider, omskrivninger, indleder og ledfunktion), og
          den kan godt være ligegyldig for din egentlige besvarelse. Bruger du den rigtigt, kan den til gengæld vise dit faglige niveau : læg
          mærke til MØNSTRET i, hvad du mestrer. Pentagrammet og dine sproglige observationer får du feedback på ved at kopiere besvarelsen over
          til en AI længere nede.
        </p>
        <div className={cn("mt-4 flex items-center justify-center gap-4 rounded-xl bg-white/70 px-4 py-3 text-ink dark:bg-white/5", "sm:justify-between")}>
          <div className="flex items-center gap-4">
            <span className={cn("font-display text-5xl font-extrabold", theme.accentText)}>{grade.grade}</span>
            <div>
              <p className="text-sm font-bold">{grade.label}</p>
              <p className="text-[11px] text-ink/50">
                Vejledende karakter (7-trinsskalaen). Opgave 2 og 3 tæller ikke med : der er mange rigtige svar, og dem bedømmer AI&apos;en.
              </p>
            </div>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", theme.accentChip)}>{pct}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { n: right, t: "Rigtige delsvar", c: "text-emerald-600 dark:text-emerald-400" },
          { n: wrong, t: "Forkerte/tomme", c: "text-rose-600 dark:text-rose-400" },
          { n: `${written}/${tasks.length}`, t: "Opgaver i gang", c: "text-ink" },
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
          Teksten indeholder alle syv opgaver og alle dine svar : altså det, du kan tage med ind som notepapir.
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
          Knappen herunder kopierer en færdig censor-prompt med alle syv opgaver, DINE svar og hele tekstgrundlaget, og åbner Copilot i en ny
          fane. Sæt ind (Ctrl/Cmd+V) og send : så får du en vejledende karakter og en gennemgang af hver opgave. Du kan også bruge en anden AI :
          teksten ligger i udklipsholderen.
        </p>
        <button
          type="button"
          onClick={handInToAi}
          className={cn("mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3 text-sm font-bold text-white shadow-md", theme.gradient)}
        >
          <SparklesIcon className="h-4 w-4" /> Aflevér din opgave til AI-bedømmelse
        </button>
        <p className="mt-2 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <span className="font-bold">OBS fra din AP-lærer:</span> AI svarer nogle gange misvisende om grammatik, og særligt om morfologi.
            Brug den til at få forklaringer og feedback på dine formuleringer : men tjek grammatikken i din bog eller hos din lærer.
          </span>
        </p>
        <p className="mt-2 text-[11px] text-ink/40">Indhold kopieres fra din browser ; intet sendes nogen steder automatisk.</p>
      </div>

      {/* 5) Gennemgang af hver opgave */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-extrabold text-ink">Gennemgang: én opgave ad gangen</h2>
        {perTask.map((r) => (
          <div key={r.task.id} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold text-white", theme.solidBg)}>
                {r.task.no}
              </span>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/40">
                Opgave {r.task.no} · {r.task.label}
              </p>
              {r.max > 0 ? (
                <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold text-ink/60">
                  {r.points} / {r.max} point
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                  mange rigtige svar : rettes ikke
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">{r.task.prompt}</p>

            <ReviewAnswer task={r.task} ans={r.ans} />

            {r.rows.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {r.rows.map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-3 py-2 text-xs",
                      row.ok ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-rose-50/60"
                    )}
                  >
                    <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full text-white", row.ok ? "bg-emerald-500" : "bg-rose-500")}>
                      {row.ok ? <CheckIcon className="h-3 w-3" /> : <XIcon className="h-3 w-3" />}
                    </span>
                    <span className="font-bold text-ink">{row.label}</span>
                    <span className="text-ink/70">Dit svar: {row.got}</span>
                    {!row.ok && <span className="font-semibold text-ink/60">Facit: {row.facit}</span>}
                  </div>
                ))}
              </div>
            )}

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

            <p className="mt-2 rounded-xl bg-ink/[0.03] p-3 text-sm leading-relaxed text-ink/70">{r.task.feedback}</p>
            <p className="mt-2 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-bold">Til selve eksamen:</span> {r.task.examTip}
              </span>
            </p>
          </div>
        ))}
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
// Ét opgavekort: nummer, opgavetekst, "?"-knap og opgavens egen svarform.
// ---------------------------------------------------------------------------
function TaskCard({
  task,
  total,
  ans,
  onChange,
}: {
  task: ExamTaskT;
  total: number;
  ans: Ans;
  onChange: (patch: (prev: Ans) => Ans) => void;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const touched = taskTouched(task, ans);

  return (
    <div className={cn("rounded-3xl border-2 bg-white p-4 shadow-sm sm:p-5", touched ? "border-emerald-200" : "border-ink/10")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 font-display text-sm font-extrabold text-blue-600">
            {task.no}
          </span>
          <h3 className="font-display text-lg font-extrabold leading-tight text-ink">{task.prompt}</h3>
        </div>
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
      <p className="sr-only">
        Opgave {task.no} af {total}
      </p>

      {hintOpen && (
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="font-bold">Sådan gør du:</span> {task.hint.replace(/^Sådan gør du:\s*/, "")}
        </div>
      )}

      {task.openEnded && (
        <p className="mt-2 text-[11px] font-semibold text-ink/45">
          Her er der mange rigtige svar : det er dokumentationen (citater) og fagsproget, der tæller. Svaret rettes ikke automatisk.
        </p>
      )}

      <div className="mt-3">
        {task.part.kind === "genre" && <GenrePart part={task.part} ans={ans} onChange={onChange} />}
        {task.part.kind === "fields" && <FieldsPart part={task.part} ans={ans} onChange={onChange} />}
        {task.part.kind === "morphology" && <MorphologyPart part={task.part} ans={ans} onChange={onChange} />}
        {task.part.kind === "analysis" && <AnalysisPart part={task.part} ans={ans} onChange={onChange} />}
        {task.part.kind === "tense" && <TensePart part={task.part} ans={ans} onChange={onChange} />}
        {task.part.kind === "clause" && <ClausePart part={task.part} ans={ans} onChange={onChange} />}
      </div>
    </div>
  );
}

type PartProps<T> = { part: T; ans: Ans; onChange: (patch: (prev: Ans) => Ans) => void };

function setText(id: string, value: string) {
  return (prev: Ans): Ans => ({ ...prev, text: { ...prev.text, [id]: value } });
}

/** Lille skrivefelt med label + hjælpetekst, som på skolens ark. */
function FieldBox({ field, value, onChange }: { field: ExamFieldT; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={`f-${field.id}`} className="text-sm font-bold text-ink">
        {field.label} {field.help && <span className="font-medium text-ink/40">{field.help}</span>}
      </label>
      <textarea
        id={`f-${field.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={field.rows ?? 2}
        placeholder={field.placeholder}
        className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-base text-ink placeholder:text-ink/35 focus:border-blue-400 focus:outline-none"
      />
    </div>
  );
}

/** Opgave 1: de fem genrer + begrundelsen. */
function GenrePart({ part, ans, onChange }: PartProps<ExamGenrePartT>) {
  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {EXAM_GENRES.map((g) => {
          const on = ans.genre === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, genre: g.id }))}
              aria-pressed={on}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition",
                on ? "border-blue-500 bg-blue-50 text-ink shadow-sm" : "border-ink/10 bg-white text-ink/80 hover:border-blue-300 hover:bg-blue-50/40"
              )}
            >
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", on ? "border-blue-500 bg-blue-500" : "border-ink/25 bg-white")}>
                {on && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              {g.label}
            </button>
          );
        })}
      </div>
      <FieldBox field={part.justify} value={ans.text[part.justify.id] ?? ""} onChange={(v) => onChange(setText(part.justify.id, v))} />
    </div>
  );
}

/** Opgave 2 og 3: kun skrivefelter. */
function FieldsPart({ part, ans, onChange }: PartProps<ExamFieldsPartT>) {
  return (
    <div className="space-y-3">
      {part.fields.map((f) => (
        <FieldBox key={f.id} field={f} value={ans.text[f.id] ?? ""} onChange={(v) => onChange(setText(f.id, v))} />
      ))}
    </div>
  );
}

/** Opgave 4: fire ord : opdeling i morfemer + ét bestemt morfem. */
function MorphologyPart({ part, ans, onChange }: PartProps<ExamMorphologyPartT>) {
  return (
    <div className="space-y-3">
      {part.words.map((w, i) => (
        <div key={w.word} className="rounded-2xl bg-ink/[0.03] p-3.5">
          <p className="font-display text-sm font-extrabold text-ink">&ldquo;{w.word}&rdquo;</p>
          <div className="mt-2 space-y-2.5">
            <div>
              <label htmlFor={`m-${i}-split`} className="text-sm font-bold text-ink">
                Del ordet i morfemer <span className="font-medium text-ink/40">(brug bindestreger)</span>
              </label>
              <input
                id={`m-${i}-split`}
                type="text"
                value={ans.text[`${i}-split`] ?? ""}
                onChange={(e) => onChange(setText(`${i}-split`, e.target.value))}
                placeholder={w.splitPlaceholder}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-base text-ink placeholder:text-ink/35 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor={`m-${i}-ask`} className="text-sm font-bold text-ink">
                {w.ask.label}
              </label>
              <input
                id={`m-${i}-ask`}
                type="text"
                value={ans.text[`${i}-ask`] ?? ""}
                onChange={(e) => onChange(setText(`${i}-ask`, e.target.value))}
                placeholder={w.ask.placeholder}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-base text-ink placeholder:text-ink/35 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Opgave 5: led-symboler på sætningens klumper (samme som i resten af appen). */
function AnalysisPart({ part, ans, onChange }: PartProps<ExamAnalysisPartT>) {
  const symbols = ans.led ?? part.chunks.map(() => null);
  const [active, setActive] = useState<number | null>(null);

  function assign(i: number, sym: LedSymbol | null) {
    const next = [...symbols];
    next[i] = sym;
    onChange((prev) => ({ ...prev, led: next }));
    setActive(null);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-ink">
        Sætningen: <span className="font-medium italic text-ink/70">&ldquo;{part.sentence}&rdquo;</span>
      </p>
      <p className="text-xs text-ink/45">
        Tryk på et led og vælg det rigtige symbol (følg analysepilen: verballed først, så subjekt, objekter, adverbialer og prædikater).
      </p>
      <div className="flex flex-wrap gap-2">
        {part.chunks.map((chunk, i) => {
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
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink/40">Led for «{part.chunks[active]}»</p>
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

/** Opgave 6: to sætninger : vælg tid + omskriv. */
function TensePart({ part, ans, onChange }: PartProps<ExamTensePartT>) {
  return (
    <div className="space-y-3">
      {part.items.map((it) => (
        <div key={it.id} className="rounded-2xl bg-ink/[0.03] p-3.5">
          <p className="text-sm italic text-ink/70">&ldquo;{it.sentence}&rdquo;</p>
          <p className="mt-2 text-xs font-semibold text-ink/55">Hvilken tid står &ldquo;{it.verb}&rdquo; i?</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {EXAM_TENSES.map((t) => {
              const on = ans.tense?.[it.id] === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, tense: { ...(prev.tense ?? {}), [it.id]: t.id } }))}
                  aria-pressed={on}
                  className={cn(
                    "rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition",
                    on ? "border-blue-500 bg-blue-500 text-white shadow-sm" : "border-ink/15 bg-white text-ink hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <label htmlFor={`t-${it.id}`} className="mt-3 block text-sm font-bold text-ink">
            Omskriv hele sætningen til {tenseLatin(it.rewriteTo)}
          </label>
          <input
            id={`t-${it.id}`}
            type="text"
            value={ans.text[`${it.id}-rewrite`] ?? ""}
            onChange={(e) => onChange(setText(`${it.id}-rewrite`, e.target.value))}
            placeholder="Skriv hele sætningen med verbet i den nye tid..."
            className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-base text-ink placeholder:text-ink/35 focus:border-blue-400 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}

/** Opgave 7: del sætningen op, find indlederen og ledsætningens funktion. */
function ClausePart({ part, ans, onChange }: PartProps<ExamClausePartT>) {
  const marks = ans.clause ?? part.parts.map(() => null);

  function cycle(i: number) {
    const next = [...marks];
    next[i] = next[i] === null ? "hoved" : next[i] === "hoved" ? "led" : null;
    onChange((prev) => ({ ...prev, clause: next }));
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-ink">
        Sætningen: <span className="font-medium italic text-ink/70">&ldquo;{part.sentence}&rdquo;</span>
      </p>
      <p className="text-xs text-ink/45">
        Test med ikke-reglen: Hovedsætning: ikke EFTER verballedet. Ledsætning: ikke MELLEM subjekt og verballed. Tryk på hver del for at
        markere den.
      </p>
      <div className="space-y-2">
        {part.parts.map((p, i) => {
          const v = marks[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => cycle(i)}
              className={cn(
                "flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left text-sm transition",
                v === "hoved"
                  ? "border-blue-500 bg-blue-50"
                  : v === "led"
                    ? "border-purple-400 bg-purple-50"
                    : "border-ink/15 bg-white hover:border-blue-300"
              )}
            >
              <span className="text-ink">{p.text}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide",
                  v === "hoved" ? "bg-blue-500 text-white" : v === "led" ? "bg-purple-500 text-white" : "bg-ink/10 text-ink/45"
                )}
              >
                {v === "hoved" ? "Hovedsætning" : v === "led" ? "Ledsætning" : "tryk for at vælge"}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <label htmlFor="indleder" className="text-sm font-bold text-ink">
          Hvilken indleder har ledsætningen?
        </label>
        <input
          id="indleder"
          type="text"
          value={ans.text["indleder"] ?? ""}
          onChange={(e) => onChange(setText("indleder", e.target.value))}
          placeholder="Skriv indlederen her"
          className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-base text-ink placeholder:text-ink/35 focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <p className="text-sm font-bold text-ink">Hvilken funktion har ledsætningen i hovedsætningen?</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {EXAM_CLAUSE_FUNCTIONS.map((f) => {
            const on = ans.clauseFn === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, clauseFn: f.id }))}
                aria-pressed={on}
                className={cn(
                  "rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition",
                  on ? "border-blue-500 bg-blue-500 text-white shadow-sm" : "border-ink/15 bg-white text-ink hover:border-blue-300 hover:bg-blue-50"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gennemgangen: elevens egne SKREVNE svar (dem appen ikke retter).
// ---------------------------------------------------------------------------
function ReviewAnswer({ task, ans }: { task: ExamTaskT; ans: Ans }) {
  const p = task.part;
  const rows: { label: string; value: string }[] = [];

  if (p.kind === "genre") rows.push({ label: p.justify.label, value: ans.text[p.justify.id] ?? "" });
  if (p.kind === "fields") for (const f of p.fields) rows.push({ label: f.label, value: ans.text[f.id] ?? "" });
  if (rows.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5 rounded-xl bg-ink/[0.03] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-ink/40">Dine skrevne svar (dem bedømmer AI&apos;en)</p>
      {rows.map((r) => (
        <p key={r.label} className="text-sm">
          <span className="font-bold text-ink">{r.label}: </span>
          {r.value.trim() ? <span className="whitespace-pre-wrap text-ink/80">{r.value}</span> : <span className="italic text-ink/40">ikke besvaret</span>}
        </p>
      ))}
    </div>
  );
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
