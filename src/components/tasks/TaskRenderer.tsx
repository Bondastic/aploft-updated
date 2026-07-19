"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import type { LedSymbol, Task } from "../../types";
import { SYMBOLS, getSymbolDef } from "../../data/symbols";
import { isWriteAnswerCorrect } from "../../data/builders";
import { CheckIcon, XIcon, LedGlyph } from "../icons";
import { cn } from "../../utils/cn";

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
}: {
  task: Task;
  onSubmit: (correct: boolean) => void;
}) {
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  function finish(correct: boolean) {
    setAnswered(true);
    setWasCorrect(correct);
    onSubmit(correct);
  }

  return (
    <div className="space-y-4">
      {task.type === "choice" && <ChoiceTask task={task} answered={answered} onFinish={finish} />}
      {task.type === "click-word" && <ClickWordTask task={task} answered={answered} onFinish={finish} />}
      {task.type === "analysis" && <AnalysisTask task={task} answered={answered} onFinish={finish} />}
      {task.type === "build-sentence" && <BuildSentenceTask task={task} answered={answered} onFinish={finish} />}
      {task.type === "write" && <WriteTask task={task} answered={answered} onFinish={finish} />}

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
            {wasCorrect ? "Rigtigt!" : "Ikke helt."}
          </div>
          <p>{task.explanation}</p>
        </motion.div>
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
}: {
  task: Extract<Task, { type: "choice" }>;
  answered: boolean;
  onFinish: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  // Svarmulighedernes rækkefølge blandes tilfældigt hver gang opgaven vises,
  // så det rigtige svar ikke systematisk ligger som første/anden mulighed.
  // `order[displayPosition] = originalIndex`.
  const order = useMemo(() => shuffle(task.options.map((_, i) => i)), [task.id]);

  function check() {
    if (selected === null) return;
    onFinish(selected === task.correctIndex);
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
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-dark"
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
}: {
  task: Extract<Task, { type: "click-word" }>;
  answered: boolean;
  onFinish: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

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
    onFinish(isCorrect);
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
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 disabled:opacity-40"
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
}: {
  task: Extract<Task, { type: "analysis" }>;
  answered: boolean;
  onFinish: (correct: boolean) => void;
}) {
  const [assignments, setAssignments] = useState<Record<number, LedSymbol>>({});
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
    onFinish(isCorrect);
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
          const isCorrect = answered && assigned === task.correctMap[i];
          const isWrong = answered && assigned !== task.correctMap[i];
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
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 disabled:opacity-40"
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

function BuildSentenceTask({
  task,
  answered,
  onFinish,
}: {
  task: Extract<Task, { type: "build-sentence" }>;
  answered: boolean;
  onFinish: (correct: boolean) => void;
}) {
  const shuffledWords = useMemo(() => shuffle(task.words), [task]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [orderDiffers, setOrderDiffers] = useState(false);

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
      setOrderDiffers(isCorrect && !exactOrder);
      onFinish(isCorrect);
    } else {
      setOrderDiffers(false);
      onFinish(exactOrder);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-ink">{task.instruction}</p>
      <div className="min-h-14 rounded-xl border-2 border-dashed border-ink/20 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {chosen.length === 0 && <span className="text-sm text-ink/30">Klik på ordene nedenfor for at bygge sætningen</span>}
          {chosen.map((idx, pos) => (
            <button
              key={pos}
              onClick={() => removeWord(pos)}
              disabled={answered}
              className="rounded-lg bg-purple/10 px-3 py-1.5 text-sm font-medium text-purple ring-1 ring-purple/30"
            >
              {shuffledWords[idx]}
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
            Din sætning er grammatisk korrekt, fordi det er kasusendelserne — ikke pladsen i sætningen — der viser
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
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 disabled:opacity-40"
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
}: {
  task: Extract<Task, { type: "write" }>;
  answered: boolean;
  onFinish: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");

  function check() {
    if (value.trim().length === 0) return;
    onFinish(isWriteAnswerCorrect(task, value));
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
          className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 disabled:opacity-40"
        >
          Tjek svar
        </button>
      )}
    </div>
  );
}
