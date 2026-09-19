"use client";

// ---------------------------------------------------------------------------
// EKSAMENSPRØVE (kun HHX). Flowet:
//   intro (informationstekst om eksamen og dens forløb)
//     → selve prøven (artikel øverst + spørgsmålene nedenunder, ur i siden)
//     → Indsend (eller klokken ringer ved tidens udløb og beder om aflevering)
//     → "gem din prøve" (kopiér besvarelsen til tekst, før den sendes til AI)
//     → AI-bedømmelse via ChatGPT-prompt + lokal karakter (anslået) og
//       spørgsmålsvis gennemgang med "hvad du kan gøre til selve eksamen".
// Alle svar afgives som blokke/klik (ingen særlig skrivemåde krævet).
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type {
  CategoryStat,
  Education,
  ExamAnalysisQuestionT,
  ExamChoiceQuestionT,
  ExamMultiChoiceQuestionT,
  ExamQuestionT,
  ExamWordClassTag,
  LedSymbol,
  Progress,
} from "../types";
import { HHX_EXAM_SATS, EXAM_WORD_CLASS_TAGS, wordClassLabel } from "../data/hhx/examSats";
import { SYMBOLS, getSymbolDef } from "../data/symbols";
import { getEducation } from "../lib/education";
import Mascot from "../components/Mascot";
import ExamArticlePane, { type ExamMark, countExamMarks } from "../components/exam/ExamArticlePane";
import ExamFormatSheet from "../components/exam/ExamFormatSheet";
import { CheckIcon, ClockIcon, LightbulbIcon, SparklesIcon, XIcon, LedGlyph } from "../components/icons";
import { cn } from "../utils/cn";

type Phase = "intro" | "running" | "result";

type Ans =
  | { kind: "choice"; selected: number }
  | { kind: "multi"; selected: number[] }
  | { kind: "wordclass"; tags: (ExamWordClassTag | null)[] }
  | { kind: "analysis"; symbols: (LedSymbol | null)[] };

// Samme 7-trins-skala som "Din udvikling" bruger (hold dem i takt).
const GRADE_SCALE: { grade: string; label: string; minPct: number }[] = [
  { grade: "12", label: "Fremragende", minPct: 90 },
  { grade: "10", label: "Fortrinligt", minPct: 78 },
  { grade: "7", label: "Godt", minPct: 63 },
  { grade: "4", label: "Jævnt", minPct: 48 },
  { grade: "02", label: "Tilstrækkeligt", minPct: 35 },
  { grade: "00", label: "Utilstrækkeligt", minPct: 20 },
  { grade: "-3", label: "Ikke-godkendt", minPct: 0 },
];

function gradeFor(pct: number): { grade: string; label: string } {
  return GRADE_SCALE.find((g) => pct >= g.minPct) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
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
    // Lyd er en bonus - prøven må aldrig fejle pga. aflyttet audio.
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

function isAnswered(a: Ans | undefined): boolean {
  if (!a) return false;
  switch (a.kind) {
    case "choice":
      return true;
    case "multi":
      return a.selected.length > 0;
    case "wordclass":
      return a.tags.every((t) => t !== null);
    case "analysis":
      return a.symbols.every((s) => s !== null);
  }
}

function gradeAnswer(q: ExamQuestionT, a: Ans | undefined): boolean {
  if (!a) return false;
  switch (q.kind) {
    case "choice":
      return a.kind === "choice" && a.selected === q.correctIndex;
    case "multi":
      if (a.kind !== "multi") return false;
      return q.correctIndexes.length === a.selected.length && q.correctIndexes.every((i) => a.selected.includes(i));
    case "wordclass":
      if (a.kind !== "wordclass") return false;
      return q.words.every((w, i) => a.tags[i] === w.correct);
    case "analysis":
      if (a.kind !== "analysis") return false;
      return q.chunks.every((_, i) => a.symbols[i] === q.correctMap[i]);
  }
}

export default function ExamSatsPage({
  education,
  progress,
  onClose,
  onExamComplete,
}: {
  education: Education;
  progress: Progress;
  onClose: () => void;
  onExamComplete: (track: "hhx", correct: number, total: number, byCategory: Record<string, CategoryStat>) => void;
}) {
  const sats = HHX_EXAM_SATS[0];
  const theme = getEducation(education);
  const reduceMotion = progress.settings.reduceMotion;

  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, Ans>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<Record<number, ExamMark>>({});
  const [secs, setSecs] = useState(sats.minutes * 60);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmAbort, setConfirmAbort] = useState(false);
  const [showFormatHint, setShowFormatHint] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const [aiModal, setAiModal] = useState<null | "copied">(null);
  const [copied, setCopied] = useState(false);

  const totalQ = sats.questions.length;
  const answeredCount = useMemo(() => sats.questions.filter((q) => isAnswered(answers[q.id])).length, [answers, sats.questions]);

  const results = useMemo(() => {
    if (submittedAt === null) return null;
    const perQuestion = sats.questions.map((q) => ({ q, ok: gradeAnswer(q, answers[q.id]), answered: isAnswered(answers[q.id]) }));
    const correct = perQuestion.filter((r) => r.ok).length;
    const byCategory: Record<string, CategoryStat> = {};
    for (const r of perQuestion) {
      if (!r.q.category) continue;
      const stat = byCategory[r.q.category] ?? { correct: 0, total: 0 };
      byCategory[r.q.category] = { correct: stat.correct + (r.ok ? 1 : 0), total: stat.total + 1 };
    }
    return { perQuestion, correct, byCategory };
  }, [submittedAt, answers, sats.questions]);

  const pct = results ? Math.round((results.correct / totalQ) * 100) : 0;
  const grade = gradeFor(pct);

  // Nedtælling (kun mens prøven kører).
  useEffect(() => {
    if (phase !== "running") return;
    const iv = window.setInterval(() => {
      setSecs((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(iv);
  }, [phase]);

  // Tiden er gået: klokken ringer, og aflevering kræves med det samme.
  const timeUp = phase === "running" && secs === 0;
  useEffect(() => {
    if (timeUp) playExamBell();
  }, [timeUp]);

  // Lås scroll når en dialog er åben (ligesom rundvisningen).
  useEffect(() => {
    const lock = timeUp || confirmSubmit || confirmAbort || aiModal !== null || showFormatHint;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [timeUp, confirmSubmit, confirmAbort, aiModal, showFormatHint]);

  const startExam = useCallback(() => {
    setPhase("running");
    setShowFormatHint(false);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  const submit = useCallback(() => {
    // Beregnes her (ikke i memo'en) fordi resultatet skal registreres med det samme.
    const perQuestion = sats.questions.map((q) => ({ q, ok: gradeAnswer(q, answers[q.id]) }));
    const correct = perQuestion.filter((r) => r.ok).length;
    const byCat: Record<string, CategoryStat> = {};
    for (const r of perQuestion) {
      if (!r.q.category) continue;
      const stat = byCat[r.q.category] ?? { correct: 0, total: 0 };
      byCat[r.q.category] = { correct: stat.correct + (r.ok ? 1 : 0), total: stat.total + 1 };
    }
    setSubmittedAt(Date.now());
    setConfirmSubmit(false);
    setPhase("result");
    onExamComplete("hhx", correct, totalQ, byCat);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [answers, onExamComplete, reduceMotion, sats.questions, totalQ]);

  function buildCopyText(): string {
    const lines: string[] = [];
    lines.push(`AP-prøve (HHX) · ${sats.title}`);
    lines.push(`Tekst: "${sats.article.title}" (${sats.article.byline})`);
    lines.push("");
    sats.questions.forEach((q, i) => {
      lines.push(`SPØRGSMÅL ${i + 1} [${q.label}]: ${q.prompt}`);
      const a = answers[q.id];
      if (a && a.kind === "choice" && q.kind === "choice") {
        lines.push(`  Svar: ${q.options[a.selected]}`);
      } else if (a && a.kind === "multi" && q.kind === "multi") {
        lines.push("  Svar:");
        for (const idx of [...a.selected].sort((x, y) => x - y)) lines.push(`   - ${q.options[idx]}`);
      } else if (a && a.kind === "wordclass" && q.kind === "wordclass") {
        lines.push(
          "  Svar: " +
            q.words.map((w, wi) => `${w.word} = ${a.tags[wi] ? wordClassLabel(a.tags[wi]!) : "(ikke valgt)"}`).join(" ; ")
        );
      } else if (a && a.kind === "analysis" && q.kind === "analysis") {
        lines.push(
          "  Svar: " +
            q.chunks.map((c, ci) => `${c} → ${a.symbols[ci] ? getSymbolDef(a.symbols[ci]!).short : "(ikke valgt)"}`).join(" ; ")
        );
      } else {
        lines.push("  Svar: (ikke besvaret)");
      }
      const note = notes[q.id]?.trim();
      if (note) lines.push(`  Noter: ${note}`);
      lines.push("");
    });
    const m = countExamMarks(marks);
    if (m.hl + m.led + m.wc > 0) {
      lines.push("Markeringer i teksten:");
      lines.push(`- ${m.hl} tusch-markeringer, ${m.led} led-mærkater, ${m.wc} ordklasse-mærkater (se skærmen; husk også dine blyantsnoter).`);
      lines.push("");
    }
    return lines.join("\n");
  }

  function buildAiPrompt(): string {
    return [
      "Jeg går på HHX og træner Almen Sprogforståelse (AP). Min skole har en prøve, hvor man får en tekst + faste spørgsmål og 40 minutters forberedelse.",
      "Bedøm venligst min besvarelelse nedenfor som en opmuntrende, men ærlig AP-censor:",
      "1. Skriv først kort, at bedømmelsen kun er til forberedelse (en AI-karakter kan sige noget om mit faglige niveau, men er ikke en officiel karakter).",
      "2. Giv mig derefter en estimeret karakter på 7-trinsskalaen (12, 10, 7, 4, 02, 00, -3) med en begrundelse.",
      "3. Til sidst: gå HVERT spørgsmål igennem én ad gangen og forklar, hvad jeg har rigtigt og forkert, og hvad jeg konkret kan gøre bedre til selve eksamen.",
      "Bemærk: Jeg har svaret i blokke (valg af svarmuligheder, ordklasser og sætningsled-symboler), så bedøm indholdet, ikke formatet. Brug de latinske betegnelser for led (subjekt, verballed, direkte/indirekte objekt) som primære.",
      "",
      "TEKSTGRUNDLAG (prøvens artikel, ordret):",
      `"${sats.article.title}" (${sats.article.byline})`,
      ...sats.article.paragraphs,
      "",
      "SPØRGSMÅL OG MINE SVAR:",
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
    setNotes({});
    setMarks({});
    setSecs(sats.minutes * 60);
    setSubmittedAt(null);
    setConfirmSubmit(false);
    setConfirmAbort(false);
    setAiModal(null);
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
              <ClockIcon className="h-4 w-4" /> {sats.minutes} minutters ur
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5">{sats.questions.length} spørgsmål</span>
            <span className="rounded-full bg-white/15 px-3 py-1.5">Blok-svar (ingen fritekst krævet)</span>
          </div>
        </div>

        <div className="space-y-3">
          <Mascot
            pose="explain"
            size="md"
            reduceMotion={reduceMotion}
            speech="Tag det roligt. Læs teksten grundigt, brug værktøjerne undervejs ; husk at der ikke findes forkerte forsøg her."
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

          <div className={cn("rounded-2xl border-2 p-4 text-sm", theme.borderActive, "bg-white")}>
            <p className="font-bold text-ink">Eksamensformen på din skole</p>
            <p className="mt-1 text-ink/60">
              Prøven her følger HHX-formen fra Risskov (tekstsæt + spørgsmål, 40 minutters forberedelse). Egå Gymnasium (STX) har en anden form,
              så den bruges ikke på den blå side.
            </p>
            <button type="button" onClick={() => setShowFormatHint(true)} className="mt-2 rounded-full border-2 border-ink/15 px-3.5 py-1.5 text-xs font-bold text-ink transition hover:border-blue-400 hover:bg-blue-50">
              Læs hele eksamensformen (forløb, indhold og bedømmelse)
            </button>
          </div>

          <p className="text-center text-xs text-ink/45">{sats.intro.closingNote}</p>

          <button
            type="button"
            onClick={startExam}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3.5 text-base font-bold text-white shadow-lg",
              theme.gradient
            )}
          >
            <ClockIcon className="h-5 w-5" /> Start prøven ( {sats.minutes} min )
          </button>
        </div>

        {showFormatHint && <ExamFormatSheet education={education} onClose={() => setShowFormatHint(false)} />}
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
                <h2 className="font-display text-xl font-extrabold text-ink">Spørgsmålene</h2>
                <p className="text-xs text-ink/50">
                  Besvar alt med blokkene. Under hvert spørgsmål kan du skrive noter (frivilligt) til din AI-bedømmelse. {answeredCount} af{" "}
                  {totalQ} er besvaret.
                </p>
              </div>
              {sats.questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  index={i}
                  total={totalQ}
                  q={q}
                  answer={answers[q.id]}
                  note={notes[q.id] ?? ""}
                  onChange={(a) => setAnswers((prev) => ({ ...prev, [q.id]: a }))}
                  onNote={(n) => setNotes((prev) => ({ ...prev, [q.id]: n }))}
                />
              ))}

              <button
                type="button"
                onClick={() => (answeredCount < totalQ ? setConfirmSubmit(true) : submit())}
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Eksamen-ur · {sats.minutes} min</p>
                <p className={cn("mt-1 font-display text-4xl font-extrabold tabular-nums", critical ? "animate-pulse text-rose-600" : warning ? "text-amber-600" : "text-ink")} aria-live="polite">
                  {fmtTime(secs)}
                </p>
                <p className="mt-1 text-[11px] text-ink/45">Ringeklokken lyder, når tiden er gået ; så afleverer du med det samme.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Status</p>
                <div className="mt-2 space-y-1.5">
                  {sats.questions.map((q, qi) => {
                    const done = isAnswered(answers[q.id]);
                    return (
                      <div key={q.id} className="flex items-center gap-2 text-xs">
                        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold", done ? cn(theme.solidBg, "text-white") : "bg-ink/10 text-ink/40")}>
                          {qi + 1}
                        </span>
                        <span className={cn("truncate", done ? "font-semibold text-ink" : "text-ink/40")}>{q.label}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => (answeredCount < totalQ ? setConfirmSubmit(true) : submit())}
                  className={cn("mt-3 w-full rounded-full py-2.5 text-sm font-bold text-white shadow-md", theme.solidBg)}
                >
                  Indsend
                </button>
              </div>
              <p className="px-1 text-[10px] leading-relaxed text-ink/40">
                Timeren matcher forberedelsen til den virkelige eksamen på Risskov (40 min). Brug markerings-værktøjerne i teksten som dine
                eksamens-ridser.
              </p>
            </div>
          </aside>
        </div>

        {/* Tiden er gået: klokke-bedømmelse tvinger aflevering */}
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
                Klokken har ringet : præcis som til den rigtige eksamen. Nu beder vi dig om at aflevere din opgave med det samme.
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
          <Modal title={`${totalQ - answeredCount} spørgsmål er ubesvarede`} onClose={() => setConfirmSubmit(false)}>
            <p className="text-sm text-ink/60">
              Til den virkelige eksamen tæller det, at du forsøger alle opgaverne. Vil du aflevere nu alligevel, eller vil du svare på de
              manglende først?
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
  const perQuestion = results?.perQuestion ?? [];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-page space-y-5"
    >
      <div className="text-center">
        <Mascot pose={pct >= 70 ? "celebrate" : pct >= 40 ? "thumbsup" : "encourage"} size="md" className="mx-auto justify-center" reduceMotion={reduceMotion} speech={null} />
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Prøven er afleveret</h1>
        <p className="mt-1 text-ink/60">
          Du besvarede {perQuestion.filter((r) => r.answered).length} af {totalQ} spørgsmål og fik {results?.correct ?? 0} rigtige ({pct}%).
        </p>
      </div>

      {/* 1) Rammen om karakteren (står øverst, som bedt) */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 dark:border-amber-500/40 dark:bg-amber-500/10">
        <p className="text-sm font-semibold leading-relaxed text-amber-900 dark:text-amber-200">
          <span className="font-extrabold">Vigtigt at læse først:</span> Denne prøve er kun lavet for at forberede dig. Derfor kan karakteren fra
          AI&apos;en godt være ligegyldig for selve besvarelsen : den officielle bedømmelse til den virkelige eksamen foregår altid som en samlet,
          faglig vurdering. Til gengæld kan AI-karakteren, hvis du bruger den rigtigt, vise dit faglige niveau : læg mærke til MØNSTRET i, hvad
          du mester, og hvad du skal vende tilbage til.
        </p>
        {/* 2) Karakteren står lige under teksten */}
        <div className={cn("mt-4 flex items-center justify-center gap-4 rounded-xl bg-white/70 px-4 py-3 text-ink dark:bg-white/5", "sm:justify-between")}>
          <div className="flex items-center gap-4">
            <span className={cn("font-display text-5xl font-extrabold", theme.accentText)}>{grade.grade}</span>
            <div>
              <p className="text-sm font-bold">{grade.label}</p>
              <p className="text-[11px] text-ink/50">
                Estimeret karakter ud fra dine blok-svar (7-trinsskalaen). AI&apos;ens bud kan afvige ; brug den som spejl, ikke som dom.
              </p>
            </div>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", theme.accentChip)}>{pct}% rigtige</span>
        </div>
      </div>

      {/* 3) "Vil du gemme din prøve?" - LIGE før aflevering til AI */}
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <p className="font-bold text-ink">Vil du gemme din prøve? Kopier din besvarelse til tekst her! Husk at indsætte det i et dokument.</p>
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
          <SparklesIcon className="h-4 w-4" /> Få AI-bedømmelse
        </p>
        <p className="mt-1 text-sm text-ink/60">
          Knappen herunder kopierer en færdig censor-prompt med DIT spørgsmålssæt, DINE svar og tekstgrundlaget, og åbner ChatGPT i en ny fane.
          Sæt ind (Ctrl/Cmd+V) og send : så får du karakter + en gennemgang af hvert spørgsmål.
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

      {/* 5) Gennemgang af hvert spørgsmål */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-extrabold text-ink">Gennemgang: ét spørgsmål ad gangen</h2>
        {perQuestion.map((r, i) => (
          <div key={r.q.id} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-extrabold text-white", r.ok ? "bg-emerald-500" : r.answered ? "bg-rose-500" : "bg-ink/30")}>
                {r.ok ? <CheckIcon className="h-3 w-3" /> : r.answered ? <XIcon className="h-3 w-3" /> : "·"}
                {r.ok ? "Rigtigt" : r.answered ? "Forkert" : "Ikke besvaret"}
              </span>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/40">
                Spørgsmål {i + 1} · {r.q.label}
              </p>
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">{r.q.prompt}</p>
            <ExamAnswerSummary q={r.q} a={answers[r.q.id]} />
            <p className="mt-2 rounded-xl bg-ink/[0.03] p-3 text-sm leading-relaxed text-ink/70">{r.q.feedback}</p>
            <p className="mt-2 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-bold">Til selve eksamen:</span> {r.q.examTip}
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
          Tag prøven igen
        </button>
      </div>

      {aiModal === "copied" && (
        <Modal title="Prompten er kopieret" onClose={() => setAiModal(null)}>
          <p className="text-sm text-ink/60">
            Din censor-prompt (med alle spørgsmål, dine svar og tekstgrundlaget) ligger nu i udklipsholderen. Åbn ChatGPT via knappen herunder, sæt ind (Ctrl/Cmd+V) og send.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setAiModal(null)} className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink">
              Luk
            </button>
            <a
              href="https://chatgpt.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAiModal(null)}
              className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r py-2.5 text-sm font-bold text-white shadow-md", theme.gradient)}
            >
              <SparklesIcon className="h-4 w-4" /> Åbn ChatGPT
            </a>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Spørgmålskort med hint-knap (?) og blok-baserede svar-widgetter.
// ---------------------------------------------------------------------------
function QuestionCard({
  index,
  total,
  q,
  answer,
  note,
  onChange,
  onNote,
}: {
  index: number;
  total: number;
  q: ExamQuestionT;
  answer: Ans | undefined;
  note: string;
  onChange: (a: Ans) => void;
  onNote: (n: string) => void;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(note.trim().length > 0);
  const answered = isAnswered(answer);

  return (
    <div className={cn("rounded-3xl border-2 bg-white p-4 shadow-sm sm:p-5", answered ? "border-emerald-200" : "border-ink/10")}>
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-ink/45">
          Spørgsmål {index + 1} / {total}
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-ink/60">{q.label}</span>
          {answered && <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />}
        </p>
        <button
          type="button"
          onClick={() => setHintOpen((v) => !v)}
          aria-expanded={hintOpen}
          aria-label={`Hvad skal jeg i ${q.label}-opgaven?`}
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
          <span className="font-bold">Sådan gør du:</span> {q.hint.replace(/^Sådan gør du:\s*/, "")}
        </div>
      )}

      <p className="mt-2 text-[15px] font-semibold leading-relaxed text-ink">{q.prompt}</p>

      <div className="mt-3">
        {q.kind === "choice" && <ChoiceBlocks q={q} answer={answer} onChange={onChange} />}
        {q.kind === "multi" && <MultiBlocks q={q} answer={answer} onChange={onChange} />}
        {q.kind === "wordclass" && <WordClassBlocks q={q} answer={answer} onChange={onChange} />}
        {q.kind === "analysis" && <AnalysisBlocks q={q} answer={answer} onChange={onChange} />}
      </div>

      {noteOpen ? (
        <textarea
          value={note}
          onChange={(e) => onNote(e.target.value)}
          rows={2}
          placeholder="Noter til AI-bedømmelsen (frivilligt ; bliver ikke automatisk bedømt)"
          className="mt-3 w-full rounded-xl border border-ink/15 bg-ink/[0.02] px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-blue-400 focus:outline-none"
        />
      ) : (
        <button type="button" onClick={() => setNoteOpen(true)} className="mt-3 text-[11px] font-semibold text-ink/40 underline decoration-dotted hover:text-ink/70">
          + skriv noter til dette spørgsmål (frivilligt)
        </button>
      )}
    </div>
  );
}

function ChoiceBlocks({ q, answer, onChange }: { q: ExamChoiceQuestionT; answer: Ans | undefined; onChange: (a: Ans) => void }) {
  const sel = answer && answer.kind === "choice" ? answer.selected : -1;
  return (
    <div className="grid gap-2">
      {q.options.map((opt, i) => (
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

function MultiBlocks({ q, answer, onChange }: { q: ExamMultiChoiceQuestionT; answer: Ans | undefined; onChange: (a: Ans) => void }) {
  const sel = answer && answer.kind === "multi" ? answer.selected : [];
  function toggle(i: number) {
    const next = sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i];
    onChange({ kind: "multi", selected: next });
  }
  return (
    <div className="grid gap-2">
      <p className="text-[11px] font-semibold text-ink/45">
        Flere kan være rigtige : klik alle de muligheder, der passer (valgt: {sel.length})
      </p>
      {q.options.map((opt, i) => {
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

function WordClassBlocks({ q, answer, onChange }: { q: ExamQuestionT & { kind: "wordclass" }; answer: Ans | undefined; onChange: (a: Ans) => void }) {
  const tags = answer && answer.kind === "wordclass" ? answer.tags : q.words.map(() => null);
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
        {q.words.map((w, i) => (
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
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-ink/10 bg-white p-3 shadow-md sm:grid-cols-3" role="listbox" aria-label={`Ordklasse for ${q.words[open]?.word}`}>
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

function AnalysisBlocks({ q, answer, onChange }: { q: ExamAnalysisQuestionT; answer: Ans | undefined; onChange: (a: Ans) => void }) {
  const symbols = answer && answer.kind === "analysis" ? answer.symbols : q.chunks.map(() => null);
  const [active, setActive] = useState<number | null>(null);

  function assign(i: number, sym: LedSymbol | null) {
    const next = [...symbols];
    next[i] = sym;
    onChange({ kind: "analysis", symbols: next });
    setActive(null);
  }

  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-ink/5 px-3.5 py-2.5 text-sm italic text-ink/70">“{q.sentence}”</p>
      <div className="flex flex-wrap gap-2">
        {q.chunks.map((chunk, i) => {
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
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink/40">Led for «{q.chunks[active]}»</p>
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
// Resumo: hvad eleven svarede, i ren tekst (til resultatsiden).
// ---------------------------------------------------------------------------
function ExamAnswerSummary({ q, a }: { q: ExamQuestionT; a: Ans | undefined }) {
  let body: React.ReactNode = <p className="italic text-ink/40">Ikke besvaret</p>;
  if (a && a.kind === "choice" && q.kind === "choice") body = <p className="text-sm text-ink/80">Dit svar: «{q.options[a.selected]}»</p>;
  if (a && a.kind === "multi" && q.kind === "multi") {
    body = (
      <ul className="list-disc space-y-0.5 pl-5 text-sm text-ink/80">
        {a.selected.length === 0 && <li className="italic text-ink/40">Ikke besvaret</li>}
        {a.selected.map((i) => (
          <li key={i}>{q.options[i]}</li>
        ))}
      </ul>
    );
  }
  if (a && a.kind === "wordclass" && q.kind === "wordclass") {
    body = (
      <div className="flex flex-wrap gap-1.5">
        {q.words.map((w, i) => {
          const tag = a.tags[i];
          const ok = tag === w.correct;
          return (
            <span key={i} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold", ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
              “{w.word}” = {tag ? wordClassLabel(tag) : "(tomt)"} {ok ? "✓" : tag ? `✗ (korrekt: ${wordClassLabel(w.correct)})` : "(tomt)"}
            </span>
          );
        })}
      </div>
    );
  }
  if (a && a.kind === "analysis" && q.kind === "analysis") {
    body = (
      <div className="flex flex-wrap gap-1.5">
        {q.chunks.map((c, i) => {
          const sym = a.symbols[i];
          const ok = sym === q.correctMap[i];
          return (
            <span key={i} className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold", ok ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-300 bg-rose-50 text-rose-700")}>
              {c} → {sym ? getSymbolDef(sym).short : "(tomt)"} {!ok && <span className="font-semibold text-ink/50">(korrekt: {getSymbolDef(q.correctMap[i]).short})</span>}
            </span>
          );
        })}
      </div>
    );
  }
  return <div className="mt-2 rounded-xl bg-ink/[0.03] p-3">{body}</div>;
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
