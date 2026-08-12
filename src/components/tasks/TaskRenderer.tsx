"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import type { LedSymbol, SavedAnswer, Task } from "../../types";
import { isContentTask } from "../../types";
import { SYMBOLS, getSymbolDef } from "../../data/symbols";
import { isWriteAnswerCorrect } from "../../data/builders";
import { CheckIcon, XIcon, LedGlyph, LightbulbIcon, ScrollIcon } from "../icons";
import AskAiButton from "../AskAi";
import TranslationSheet from "../TranslationSheet";
import { cn } from "../../utils/cn";

// Kategorier, hvor ordforråd/bøjning faktisk er en del af opgaven. Her må
// eleven altid slå op i oversættelsesarket, inden hun svarer. Logikken ligger
// samlet her i TaskRenderer, så arket opfører sig ens i Øv dig og i prøver.
const SHEET_CATEGORIES = new Set<string>(["oversaettelse", "grammatik", "sumesse", "ordforraad"]);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TaskRenderer({
  task,
  onSubmit,
  reduceMotion = false,
  review = false,
  reviewCorrect = true,
  savedAnswer,
}: {
  task: Task;
  onSubmit: (correct: boolean, answer?: SavedAnswer) => void;
  reduceMotion?: boolean;
  review?: boolean;
  reviewCorrect?: boolean;
  savedAnswer?: SavedAnswer;
}) {
  const [answered, setAnswered] = useState(review);
  const [wasCorrect, setWasCorrect] = useState(review ? reviewCorrect : false);
  const [checking, setChecking] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!task) return null;

  // Oversættelsesarket vises kun ved latinske opgaver, hvor ordforråd eller
  // bøjning er en del af opgaven (oversættelse, grammatik, sum/esse og
  // ordforråd) - og kun indtil opgaven er besvaret, så man ikke kan "snyde"
  // bagefter.
  const showSheet = !answered && (task.showSheet === true || SHEET_CATEGORIES.has(task.category));

  function finish(correct: boolean, answer?: SavedAnswer) {
    if (review) return;
    setAnswered(true);
    setWasCorrect(correct);
    onSubmit(correct, answer);
  }

  // Lille "Lingua tænker…"-pause, før svaret afsløres. Det gør oplevelsen
  // lidt mere levende, som om maskotten lige skal vurdere svaret.
  function finishWithPause(correct: boolean, answer?: SavedAnswer) {
    if (checking) return;
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      finish(correct, answer);
    }, 450);
  }

  const footer = (
    <div className={cn("flex flex-wrap items-center gap-2", showSheet ? "justify-between" : "justify-end")}>
      {showSheet && (
        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          <ScrollIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Oversættelsesark
        </button>
      )}
      <AskAiButton task={task} />
    </div>
  );

  // Rene undervisningstrin ("teach"/"info") har ikke noget rigtigt/forkert:
  // eleven læser stoffet og trykker "Forstået, fortsæt" for at gå videre.
  if (isContentTask(task)) {
    return (
      <div className="space-y-4">
        {task.type === "teach" && <TeachTask task={task} onContinue={review ? undefined : () => finish(true, { kind: "content" })} />}
        {task.type === "info" && <InfoTask task={task} onContinue={review ? undefined : () => finish(true, { kind: "content" })} />}
        {footer}
        <TranslationSheet open={sheetOpen} onClose={() => setSheetOpen(false)} reduceMotion={reduceMotion} />
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {task.type === "choice" && <ChoiceTask task={task} answered={answered} onFinish={finishWithPause} saved={savedAnswer} />}
      {task.type === "click-word" && <ClickWordTask task={task} answered={answered} onFinish={finishWithPause} saved={savedAnswer} />}
      {task.type === "analysis" && <AnalysisTask task={task} answered={answered} onFinish={finishWithPause} saved={savedAnswer} />}
      {task.type === "build-sentence" && <BuildSentenceTask task={task} answered={answered} onFinish={finishWithPause} saved={savedAnswer} />}
      {task.type === "write" && <WriteTask task={task} answered={answered} onFinish={finishWithPause} saved={savedAnswer} />}
      {task.type === "table-fill" && <TableFillTask task={task} answered={answered} onFinish={finishWithPause} saved={savedAnswer} />}

      {checking && (
        <div
          className="absolute -inset-5 z-10 flex items-center justify-center rounded-3xl bg-white/90 backdrop-blur-sm dark:bg-[#241d38]/92"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-md">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple border-t-transparent" aria-hidden="true" />
            <span className="text-sm font-semibold text-ink/70">Lingua tænker…</span>
          </div>
        </div>
      )}

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
          className={cn(
            "rounded-2xl border-2 p-4 text-sm",
            wasCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-rose-300 bg-rose-50 text-rose-800"
          )}
        >
          <div className="mb-1 flex items-center gap-2 font-semibold">
            {wasCorrect ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
            {wasCorrect ? "Rigtigt! 🎉" : "Næsten! Sådan hænger det sammen:"}
          </div>
          <p>{task.explanation}</p>
        </motion.div>
      )}
      {footer}
      <TranslationSheet open={sheetOpen} onClose={() => setSheetOpen(false)} reduceMotion={reduceMotion} />
    </div>
  );
}

function TeachTask({ task, onContinue }: { task: Extract<Task, { type: "teach" }>; onContinue?: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple/10 text-purple">
          <LightbulbIcon className="h-4.5 w-4.5" />
        </span>
        <h3 className="pt-1 text-lg font-extrabold text-ink">{task.title}</h3>
      </div>
      <div className="space-y-3">
        {task.sections.map((s, i) => (
          <div key={i}>
            {s.heading && <p className="mb-0.5 text-xs font-bold uppercase tracking-wide text-purple">{s.heading}</p>}
            <p className="text-[15px] leading-relaxed text-ink/80">{s.body}</p>
          </div>
        ))}
      </div>
      {task.examples && task.examples.length > 0 && (
        <div className="space-y-1.5 rounded-xl bg-ink/5 p-3">
          {task.examples.map((ex, i) => (
            <p key={i} className="text-sm italic text-ink/70">
              {ex}
            </p>
          ))}
        </div>
      )}
      {task.tip && (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
          💡 {task.tip}
        </div>
      )}
      {onContinue && (
        <button
          onClick={onContinue}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-dark"
        >
          {task.continueLabel ?? "Forstået, fortsæt →"}
        </button>
      )}
    </div>
  );
}

function InfoTask({ task, onContinue }: { task: Extract<Task, { type: "info" }>; onContinue?: () => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-ink">{task.title}</h3>
      <p className="text-[15px] leading-relaxed text-ink/80">{task.intro}</p>
      <div className="overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full min-w-[280px] border-collapse text-left text-sm">
          <tbody>
            {task.rows.map((row, i) => (
              <tr key={i} className="odd:bg-white even:bg-ink/[0.03]">
                <td className="border-b border-ink/5 px-3 py-2 font-semibold text-ink/70 last:border-0">{row.label}</td>
                <td className="border-b border-ink/5 px-3 py-2 font-bold text-ink last:border-0">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onContinue && (
        <button
          onClick={onContinue}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-dark"
        >
          {task.continueLabel ?? "Videre →"}
        </button>
      )}
    </div>
  );
}

function OptionButton({
  children,
  state,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  state: "idle" | "selected" | "correct" | "wrong";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={cn(
        "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
        state === "idle" && "border-ink/10 bg-white hover:border-purple/40 hover:bg-purple/5",
        state === "selected" && "border-purple bg-purple/10",
        state === "correct" && "border-emerald-400 bg-emerald-50 text-emerald-800",
        state === "wrong" && "border-rose-400 bg-rose-50 text-rose-800"
      )}
    >
      <span className="inline-flex items-center gap-2">
        {state === "correct" && <CheckIcon className="h-4 w-4 shrink-0" />}
        {state === "wrong" && <XIcon className="h-4 w-4 shrink-0" />}
        <span>{children}</span>
      </span>
    </button>
  );
}

function ChoiceTask({
  task,
  answered,
  onFinish,
  saved,
}: {
  task: Extract<Task, { type: "choice" }>;
  answered: boolean;
  onFinish: (correct: boolean, answer?: SavedAnswer) => void;
  saved?: SavedAnswer;
}) {
  const [selected, setSelected] = useState<number | null>(saved?.kind === "choice" ? saved.selected : null);

  // Svarmulighedernes rækkefølge blandes tilfældigt hver gang opgaven vises,
  // så det rigtige svar ikke systematisk ligger som første/anden mulighed.
  // `order[displayPosition] = originalIndex`.
  const order = useMemo(() => shuffle(task.options.map((_, i) => i)), [task.id]);

  function check() {
    if (selected === null) return;
    onFinish(selected === task.correctIndex, { kind: "choice", selected });
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">{task.prompt}</p>
      <div className="space-y-2" role="radiogroup" aria-label={task.prompt}>
        {order.map((originalIndex, displayPos) => {
          let state: "idle" | "selected" | "correct" | "wrong" = "idle";
          if (answered) {
            if (originalIndex === task.correctIndex) state = "correct";
            else if (originalIndex === selected) state = "wrong";
          } else if (originalIndex === selected) {
            state = "selected";
          }
          return (
            <OptionButton key={displayPos} state={state} disabled={answered} onClick={() => setSelected(originalIndex)}>
              {task.options[originalIndex]}
            </OptionButton>
          );
        })}
      </div>
      {!answered && (
        <button
          onClick={check}
          disabled={selected === null}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 transition active:scale-[0.97] disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-dark"
        >
          Tjek svar
        </button>
      )}
    </div>
  );
}

function ClickWordTask({
  task,
  answered,
  onFinish,
  saved,
}: {
  task: Extract<Task, { type: "click-word" }>;
  answered: boolean;
  onFinish: (correct: boolean, answer?: SavedAnswer) => void;
  saved?: SavedAnswer;
}) {
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(saved?.kind === "click-word" ? saved.selected : [])
  );

  function toggle(i: number) {
    if (answered) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function check() {
    const correctSet = new Set(task.correctIndexes);
    const isCorrect =
      selected.size === correctSet.size && [...selected].every((i) => correctSet.has(i));
    onFinish(isCorrect, { kind: "click-word", selected: [...selected] });
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">{task.instruction}</p>
      <div className="flex flex-wrap gap-2 rounded-2xl border-2 border-ink/10 bg-white p-4">
        {task.tokens.map((token, i) => {
          const isSelected = selected.has(i);
          const isCorrectIdx = task.correctIndexes.includes(i);
          let cls = "border-ink/15 bg-white text-ink hover:border-purple/50";
          if (answered) {
            if (isCorrectIdx) cls = "border-emerald-400 bg-emerald-50 text-emerald-800";
            else if (isSelected) cls = "border-rose-400 bg-rose-50 text-rose-800";
          } else if (isSelected) {
            cls = "border-purple bg-purple/10 text-purple";
          }
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              disabled={answered}
              aria-pressed={isSelected}
              className={cn("rounded-lg border-2 px-3 py-1.5 text-base font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple", cls)}
            >
              {token}
            </button>
          );
        })}
      </div>
      {!answered && (
        <button
          onClick={check}
          disabled={selected.size === 0}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 transition active:scale-[0.97] disabled:opacity-40"
        >
          Tjek svar
        </button>
      )}
    </div>
  );
}

function AnalysisTask({
  task,
  answered,
  onFinish,
  saved,
}: {
  task: Extract<Task, { type: "analysis" }>;
  answered: boolean;
  onFinish: (correct: boolean, answer?: SavedAnswer) => void;
  saved?: SavedAnswer;
}) {
  const [assignments, setAssignments] = useState<Record<number, LedSymbol>>(() => restoreAnalysis(saved));
  const [activeChunk, setActiveChunk] = useState<number | null>(null);

  const chunkRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [pickerStyle, setPickerStyle] = useState<CSSProperties>({ opacity: 0 });

  function assign(chunkIdx: number, symbol: LedSymbol) {
    if (answered) return;
    setAssignments((prev) => ({ ...prev, [chunkIdx]: symbol }));
    setActiveChunk(null);
  }

  function check() {
    const isCorrect = task.chunks.every((_, i) => assignments[i] === task.correctMap[i]);
    onFinish(isCorrect, {
      kind: "analysis",
      assignments: { ...assignments },
      symbols: task.chunks.map((_, i) => assignments[i] ?? null),
    });
  }

  const allAssigned = task.chunks.every((_, i) => assignments[i]);

  useLayoutEffect(() => {
    if (activeChunk === null) return;
    const btn = chunkRefs.current[activeChunk];
    const picker = pickerRef.current;
    if (!btn || !picker) return;

    const margin = 10;
    const vw = window.innerWidth;
    const r = btn.getBoundingClientRect();

    const maxW = Math.min(288, vw - margin * 2);
    picker.style.width = `${maxW}px`;
    const pw = picker.offsetWidth;
    const ph = picker.offsetHeight;

    let left = r.left + r.width / 2 - pw / 2;
    left = Math.max(margin, Math.min(left, vw - pw - margin));

    const spaceBelow = window.innerHeight - r.bottom;
    const openAbove = spaceBelow < ph + margin + 8 && r.top > ph + margin;
    const top = openAbove ? r.top - ph - 8 : r.bottom + 8;

    setPickerStyle({ position: "fixed", top, left, width: maxW, opacity: 1 });
  }, [activeChunk]);

  useEffect(() => {
    if (activeChunk === null) return;
    function close() {
      setActiveChunk(null);
    }
    function onPointer(e: PointerEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setActiveChunk(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveChunk(null);
    }
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [activeChunk]);

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">{task.instruction}</p>
      <p className="rounded-xl bg-ink/5 px-4 py-3 text-base italic text-ink/70">&quot;{task.sentence}&quot;</p>
      <div className="flex flex-wrap gap-2">
        {task.chunks.map((chunk, i) => {
          const assigned = assignments[i];
          const isCorrect = answered && !!assigned && assigned === task.correctMap[i];
          const isWrong = answered && !!assigned && assigned !== task.correctMap[i];
          return (
            <div key={i} className="relative">
              <button
                ref={(el) => {
                  chunkRefs.current[i] = el;
                }}
                onClick={() => !answered && setActiveChunk(activeChunk === i ? null : i)}
                disabled={answered}
                aria-haspopup="true"
                aria-expanded={activeChunk === i}
                aria-label={`${chunk}: ${assigned ? getSymbolDef(assigned).short : "intet symbol valgt endnu"}`}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
                  isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-800",
                  isWrong && "border-rose-400 bg-rose-50 text-rose-800",
                  !answered && activeChunk === i && "border-purple bg-purple/5 ring-2 ring-purple/20",
                  !answered && activeChunk !== i && "border-ink/15 bg-white hover:border-purple/50"
                )}
              >
                <span>{chunk}</span>
                <span className="flex h-5 w-5 items-center justify-center text-current">
                  {assigned ? (
                    <LedGlyph symbol={assigned} className="h-5 w-5" />
                  ) : (
                    <span className="text-base leading-none text-ink/30">?</span>
                  )}
                </span>
              </button>
              {answered && (
                <div className="mt-1 flex items-center justify-center gap-1 text-center text-xs text-ink/50">
                  <span className="text-ink/40">skal være</span>
                  <LedGlyph symbol={task.correctMap[i]} className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-ink/50">
        {SYMBOLS.map((s) => (
          <span key={s.symbol} className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-1">
            <LedGlyph symbol={s.symbol} className="h-3.5 w-3.5" /> {s.short}
          </span>
        ))}
      </div>
      {!answered && (
        <button
          onClick={check}
          disabled={!allAssigned}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 transition active:scale-[0.97] disabled:opacity-40"
        >
          Tjek svar
        </button>
      )}

      {activeChunk !== null && !answered && (
        <div
          ref={pickerRef}
          style={pickerStyle}
          role="menu"
          aria-label="Vælg symbol"
          className="z-40 grid grid-cols-4 gap-1.5 rounded-2xl border border-ink/10 bg-white p-2 shadow-xl"
        >
          {SYMBOLS.map((s) => (
            <button
              key={s.symbol}
              onClick={() => assign(activeChunk, s.symbol)}
              title={`${s.short} (${getSymbolDef(s.symbol).name})`}
              aria-label={`${s.short}: ${getSymbolDef(s.symbol).name}`}
              className="flex aspect-square items-center justify-center rounded-xl border border-ink/10 text-ink transition hover:border-purple/50 hover:bg-purple/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
            >
              <LedGlyph symbol={s.symbol} className="h-7 w-7" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function sameMultiset(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((w, i) => w === sortedB[i]);
}

function restoreAnalysis(saved?: SavedAnswer): Record<number, LedSymbol> {
  if (!saved || saved.kind !== "analysis") return {};
  const out: Record<number, LedSymbol> = {};
  if (saved.symbols && saved.symbols.length > 0) {
    saved.symbols.forEach((symbol, i) => {
      if (symbol) out[i] = symbol;
    });
    return out;
  }
  for (const [key, value] of Object.entries(saved.assignments ?? {})) {
    const i = Number(key);
    if (Number.isFinite(i) && value) out[i] = value;
  }
  return out;
}

function chosenFromSavedWords(savedWords: string[] | null, bank: string[]): number[] {
  if (!savedWords || savedWords.length === 0) return [];
  const used = new Set<number>();
  const chosen: number[] = [];
  for (const word of savedWords) {
    const idx = bank.findIndex((item, i) => item === word && !used.has(i));
    if (idx >= 0) {
      used.add(idx);
      chosen.push(idx);
    }
  }
  return chosen;
}

function BuildSentenceTask({
  task,
  answered,
  onFinish,
  saved,
}: {
  task: Extract<Task, { type: "build-sentence" }>;
  answered: boolean;
  onFinish: (correct: boolean, answer?: SavedAnswer) => void;
  saved?: SavedAnswer;
}) {
  const shuffledWords = useMemo(() => shuffle(task.words), [task]);
  const savedWords = saved?.kind === "build-sentence" ? saved.words : null;
  const [chosen, setChosen] = useState<number[]>([]);
  const [orderDiffers, setOrderDiffers] = useState(saved?.kind === "build-sentence" ? !!saved.orderDiffers : false);
  const builtDisplay = savedWords ?? chosen.map((i) => shuffledWords[i]);

  function addWord(idx: number) {
    if (answered || chosen.includes(idx)) return;
    setChosen((prev) => [...prev, idx]);
  }

  function removeWord(pos: number) {
    if (answered) return;
    setChosen((prev) => prev.filter((_, i) => i !== pos));
  }

  function check() {
    const built = chosen.map((i) => shuffledWords[i]);
    const exactOrder =
      built.length === task.correctOrder.length && built.every((w, i) => w === task.correctOrder[i]);

    if (task.wordOrderFree) {
      // Latin har fri ordstilling: alle ord i den rigtige rækkefølge ELLER en
      // anden rækkefølge med præcis de samme ord tæller som korrekt.
      const isCorrect = sameMultiset(built, task.correctOrder);
      const differs = isCorrect && !exactOrder;
      setOrderDiffers(differs);
      onFinish(isCorrect, { kind: "build-sentence", words: built, orderDiffers: differs });
    } else {
      setOrderDiffers(false);
      onFinish(exactOrder, { kind: "build-sentence", words: built });
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">{task.instruction}</p>
      <div className="min-h-14 rounded-xl border-2 border-dashed border-ink/20 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {builtDisplay.length === 0 && <span className="text-sm text-ink/30">Klik på ordene nedenfor for at bygge sætningen</span>}
          {builtDisplay.map((word, pos) => (
            <button
              key={pos}
              onClick={() => removeWord(pos)}
              disabled={answered}
              className="rounded-lg bg-purple/10 px-3 py-1.5 text-sm font-medium text-purple ring-1 ring-purple/30"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {shuffledWords.map((word, idx) => (
          <button
            key={idx}
            onClick={() => addWord(idx)}
            disabled={answered || chosen.includes(idx)}
            className="rounded-lg border-2 border-ink/15 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-purple/50 disabled:opacity-30"
          >
            {word}
          </button>
        ))}
      </div>
      {answered && task.wordOrderFree && orderDiffers && (
        <div
          role="status"
          className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <p className="mb-1 font-semibold">Bemærk: latin har fri ordstilling</p>
          <p>
            Din sætning er grammatisk korrekt, fordi det er kasusendelserne (ikke pladsen i sætningen), der viser
            ordenes funktion. Den mest almindelige rækkefølge (typisk med verbet sidst) er dog:{" "}
            <span className="font-semibold text-ink">{task.correctOrder.join(" ")}</span>.
          </p>
        </div>
      )}
      {answered && !(task.wordOrderFree && orderDiffers) && (
        <p className="text-sm text-ink/60">
          Rigtig rækkefølge: <span className="font-semibold text-ink">{task.correctOrder.join(" ")}</span>
        </p>
      )}
      {!answered && (
        <button
          onClick={check}
          disabled={chosen.length !== task.words.length}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 transition active:scale-[0.97] disabled:opacity-40"
        >
          Tjek svar
        </button>
      )}
    </div>
  );
}

function TableFillTask({
  task,
  answered,
  onFinish,
  saved,
}: {
  task: Extract<Task, { type: "table-fill" }>;
  answered: boolean;
  onFinish: (correct: boolean, answer?: SavedAnswer) => void;
  saved?: SavedAnswer;
}) {
  const blankSet = useMemo(() => new Set(task.blankIndexes), [task.blankIndexes]);
  const [assignments, setAssignments] = useState<Record<number, string>>(
    () => (saved?.kind === "table-fill" ? { ...saved.assignments } : {})
  );
  const [activeBlank, setActiveBlank] = useState<number | null>(null);

  // Ordbank: de rigtige svar til de tomme felter + evt. distraktorer, blandet.
  const wordBank = useMemo(() => {
    const correctWords = task.blankIndexes.map((i) => task.rows[i].value);
    const words = [...correctWords, ...(task.extraDistractors ?? [])];
    return shuffle(words);
  }, [task]);

  function pick(word: string) {
    if (activeBlank === null || answered) return;
    setAssignments((prev) => ({ ...prev, [activeBlank]: word }));
    setActiveBlank(null);
  }

  function check() {
    const isCorrect = task.blankIndexes.every((i) => assignments[i] === task.rows[i].value);
    onFinish(isCorrect, { kind: "table-fill", assignments });
  }

  const allFilled = task.blankIndexes.every((i) => assignments[i]);
  // Undgå at samme ord kan bruges to gange, hvis det kun findes én gang i banken
  // (medmindre svaret optræder flere gange i selve tabellen).
  const usedCounts = new Map<string, number>();
  for (const i of task.blankIndexes) {
    const v = assignments[i];
    if (v) usedCounts.set(v, (usedCounts.get(v) ?? 0) + 1);
  }
  const bankCounts = new Map<string, number>();
  for (const w of wordBank) bankCounts.set(w, (bankCounts.get(w) ?? 0) + 1);

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">{task.instruction}</p>
      <div className="overflow-x-auto rounded-xl border border-ink/10">
        <p className="border-b border-ink/10 bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink/70">{task.tableTitle}</p>
        <table className="w-full min-w-[260px] border-collapse text-left text-sm">
          <tbody>
            {task.rows.map((row, i) => {
              const isBlank = blankSet.has(i);
              const value = assignments[i];
              const isCorrect = answered && isBlank && value === row.value;
              const isWrong = answered && isBlank && value !== row.value;
              return (
                <tr key={i} className="odd:bg-white even:bg-ink/[0.03]">
                  <td className="border-b border-ink/5 px-3 py-2 font-semibold text-ink/70 last:border-0">{row.label}</td>
                  <td className="border-b border-ink/5 px-3 py-2 last:border-0">
                    {isBlank ? (
                      <button
                        onClick={() => !answered && setActiveBlank(activeBlank === i ? null : i)}
                        disabled={answered}
                        className={cn(
                          "min-w-[4.5rem] rounded-lg border-2 px-2.5 py-1 text-sm font-bold transition",
                          isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-800",
                          isWrong && "border-rose-400 bg-rose-50 text-rose-800",
                          !answered && activeBlank === i && "border-purple bg-purple/5",
                          !answered && activeBlank !== i && "border-dashed border-ink/25 bg-white text-ink/40 hover:border-purple/50"
                        )}
                      >
                        {value ?? "?"}
                      </button>
                    ) : (
                      <span className="font-bold text-ink">{row.value}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!answered && (
        <div className="flex flex-wrap gap-2">
          {wordBank.map((word, i) => {
            const remaining = (bankCounts.get(word) ?? 0) - (usedCounts.get(word) ?? 0);
            const currentValue = activeBlank !== null ? assignments[activeBlank] : undefined;
            const isCurrentSelection = currentValue === word;
            const disabled = activeBlank === null || (remaining <= 0 && !isCurrentSelection);
            return (
              <button
                key={`${word}-${i}`}
                onClick={() => pick(word)}
                disabled={disabled}
                className="rounded-lg border-2 border-ink/15 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-purple/50 disabled:opacity-30"
              >
                {word}
              </button>
            );
          })}
        </div>
      )}
      {!answered && activeBlank === null && (
        <p className="text-xs text-ink/40">Klik først på et tomt felt i tabellen, og vælg derefter et ord herunder.</p>
      )}
      {!answered && (
        <button
          onClick={check}
          disabled={!allFilled}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 transition active:scale-[0.97] disabled:opacity-40"
        >
          Tjek svar
        </button>
      )}
    </div>
  );
}

function WriteTask({
  task,
  answered,
  onFinish,
  saved,
}: {
  task: Extract<Task, { type: "write" }>;
  answered: boolean;
  onFinish: (correct: boolean, answer?: SavedAnswer) => void;
  saved?: SavedAnswer;
}) {
  const [value, setValue] = useState(saved?.kind === "write" ? saved.value : "");

  function check() {
    if (value.trim().length === 0) return;
    onFinish(isWriteAnswerCorrect(task, value), { kind: "write", value });
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">{task.instruction}</p>
      <p className="rounded-xl bg-ink/5 px-4 py-3 text-base text-ink/80">{task.prompt}</p>
      <label htmlFor={`write-${task.id}`} className="sr-only">
        Dit svar
      </label>
      <input
        id={`write-${task.id}`}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") check();
        }}
        disabled={answered}
        placeholder={task.placeholder ?? "Skriv dit svar her..."}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={cn(
          "w-full rounded-xl border-2 px-4 py-3 text-base outline-none transition disabled:opacity-70",
          answered
            ? "border-ink/10 bg-ink/5"
            : "border-ink/15 bg-white focus:border-purple"
        )}
      />
      {answered && (
        <p className="text-sm text-ink/60">
          Korrekt svar: <span className="font-semibold text-ink">{task.answer}</span>
        </p>
      )}
      {!answered && (
        <button
          onClick={check}
          disabled={value.trim().length === 0}
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 transition active:scale-[0.97] disabled:opacity-40"
        >
          Tjek svar
        </button>
      )}
    </div>
  );
}
