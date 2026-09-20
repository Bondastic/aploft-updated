"use client";

// ---------------------------------------------------------------------------
// Eksamensteksten med "tusch"-værktøjer. Eleven kan:
//  • highlighter sætninger/ord med fire tuschfarver (og viske dem væk igen),
//  • markere led i teksten med de 7 analysetegn (samme symboler som i
//    analyseopgaverne; latinske betegnelser som primære),
//  • bekræfte/mærke enkelte ords ordklasse.
// Markeringerne er læseværktøj undervejs: de bliver ikke bedømt, men de følger
// med som note i den kopi, eleven kan sende til AI.
// ---------------------------------------------------------------------------

import { useMemo, useState } from "react";
import type { ExamArticleT, ExamWordClassTag, LedSymbol } from "../../types";
import { SYMBOLS, getSymbolDef } from "../../data/symbols";
import { EXAM_WORD_CLASS_TAGS } from "../../data/hhx/examSats";
import { LedGlyph } from "../icons";
import { cn } from "../../utils/cn";

export type HlColor = "gul" | "groen" | "pink" | "blaa";

const HL: Record<HlColor, { label: string; swatch: string; on: string }> = {
  gul: { label: "Gul", swatch: "bg-yellow-300", on: "bg-yellow-200/90 dark:bg-yellow-400/25 rounded px-0.5" },
  groen: { label: "Grøn", swatch: "bg-emerald-300", on: "bg-emerald-200/90 dark:bg-emerald-400/25 rounded px-0.5" },
  pink: { label: "Lyserød", swatch: "bg-pink-300", on: "bg-pink-200/90 dark:bg-pink-400/25 rounded px-0.5" },
  blaa: { label: "Blå", swatch: "bg-sky-300", on: "bg-sky-200/90 dark:bg-sky-400/25 rounded px-0.5" },
};

// Statisk kort over farvet underlining pr. led-symbol (Tailwind JIT-venligt).
const LED_LINE: Record<LedSymbol, string> = {
  subjekt: "border-b-[3px] border-blue-500",
  verbal: "border-b-[3px] border-red-500",
  objekt: "border-b-[3px] border-emerald-500",
  dativ: "border-b-[3px] border-teal-500",
  adverbial: "border-b-[3px] border-amber-500",
  subjpred: "border-b-[3px] border-purple",
  objpred: "border-b-[3px] border-fuchsia-500",
};

export interface ExamMark {
  hl?: HlColor;
  led?: LedSymbol;
  wc?: ExamWordClassTag;
}

interface WordTok {
  id: number;
  para: number;
  sent: number;
  text: string;
}

function tokenize(paragraphs: string[]): WordTok[] {
  const out: WordTok[] = [];
  let id = 0;
  paragraphs.forEach((para, paraIdx) => {
    // Sætninger skilles på . ! ? … (ikke på kolon: "18:" osv. må ikke klppe).
    const sents = para.match(/[^.!?…]+[.!?…]*/g) ?? [para];
    sents.forEach((sentText, sent) => {
      for (const w of sentText.split(/\s+/).filter(Boolean)) {
        out.push({ id: id++, para: paraIdx, sent, text: w });
      }
    });
  });
  return out;
}

export type ExamTool = "tusch" | "led" | "klasse";

export default function ExamArticlePane({
  article,
  marks,
  setMarks,
}: {
  article: ExamArticleT;
  marks: Record<number, ExamMark>;
  setMarks: (m: Record<number, ExamMark>) => void;
}) {
  const [tool, setTool] = useState<ExamTool>("tusch");
  const [color, setColor] = useState<HlColor>("gul");
  const [sentenceMode, setSentenceMode] = useState(false);
  const [eraser, setEraser] = useState(false);
  // Vælg-område: første klik sætter start, andet klik afslutter.
  const [start, setStart] = useState<WordTok | null>(null);
  // Åbne vælgere (til led- og ordklasseværktøjet).
  const [ledRange, setLedRange] = useState<[number, number] | null>(null);
  const [wcWord, setWcWord] = useState<WordTok | null>(null);

  const tokens = useMemo(() => tokenize(article.paragraphs), [article.paragraphs]);
  const byId = useMemo(() => new Map(tokens.map((t) => [t.id, t])), [tokens]);

  function applyRange(from: number, to: number, mark: Partial<ExamMark>, removeKeys: (keyof ExamMark)[]) {
    const [a, b] = from <= to ? [from, to] : [to, from];
    const next = { ...marks };
    for (const t of tokens) {
      if (t.id < a || t.id > b) continue;
      const cur = next[t.id] ?? {};
      const merged: ExamMark = { ...cur, ...mark };
      for (const k of removeKeys) delete merged[k];
      next[t.id] = merged;
    }
    setMarks(next);
  }

  function removeRange(from: number, to: number, keys: (keyof ExamMark)[]) {
    applyRange(from, to, {}, keys);
  }

  function tapWord(tok: WordTok) {
    if (tool === "klasse") {
      setWcWord(wcWord && wcWord.id === tok.id ? null : tok);
      setStart(null);
      setLedRange(null);
      return;
    }
    if (tool === "led") {
      if (start && byId.has(start.id) && start.para === tok.para && start.id !== tok.id) {
        // Andet klik i samme afsnit: området er valgt.
        setLedRange([start.id, tok.id]);
        setStart(null);
      } else if (start && start.id === tok.id) {
        // Samme ord to gange: leddet er ét ord.
        setLedRange([tok.id, tok.id]);
        setStart(null);
      } else {
        setStart(tok);
        setLedRange(null);
      }
      setWcWord(null);
      return;
    }
    // tusch
    if (eraser) {
      if (start && byId.has(start.id) && start.para === tok.para) {
        removeRange(start.id, tok.id, ["hl"]);
        setStart(null);
      } else {
        removeRange(tok.id, tok.id, ["hl"]);
        setStart(tok);
      }
      return;
    }
    if (sentenceMode) {
      const group = tokens.filter((t) => t.para === tok.para && t.sent === tok.sent);
      applyRange(group[0].id, group[group.length - 1].id, { hl: color }, []);
      setStart(null);
      return;
    }
    if (start && byId.has(start.id) && start.para === tok.para && start.id !== tok.id) {
      applyRange(start.id, tok.id, { hl: color }, []);
      setStart(null);
    } else {
      setStart(tok);
    }
  }

  function selectLedRange(tok: WordTok) {
    // Led-værktøjet: klik på markeret ord genåbner værktøjet til det led, ordet indgår i.
    const marked = marks[tok.id];
    if (marked?.led) {
      let a = tok.id;
      let b = tok.id;
      while (byId.has(a - 1) && byId.get(a - 1)!.para === tok.para && marks[a - 1]?.led === marked.led) a--;
      while (byId.has(b + 1) && byId.get(b + 1)!.para === tok.para && marks[b + 1]?.led === marked.led) b++;
      setLedRange([a, b]);
      return true;
    }
    return false;
  }

  const pendingLabel =
    tool === "led"
      ? start
        ? "Klik på sidste ord i leddet (eller brug kortet igen for ét ord)"
        : "Klik på første ord i leddet"
      : tool === "klasse"
        ? "Klik på et ord for at sætte dets ordklasse"
        : eraser
          ? "Sletter tusch : klik på ordet (eller første/sidste ord i området)"
          : sentenceMode
            ? "Klik på en sætning for at tusche den hele"
            : start
              ? "Klik på sidste ord for at tusche området"
              : "Klik på et ord (eller første ord i et område)";

  return (
    <div className="rounded-3xl border border-ink/10 bg-white shadow-sm">
      {/* Værktøjslinje */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-t-3xl border-b border-ink/10 bg-ink/[0.03] px-3 py-2">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-ink/40">Læseværktøj</span>
        <ToolButton active={tool === "tusch" && !eraser} onClick={() => { setTool("tusch"); setEraser(false); setStart(null); }}>
          🖍 Tusch
        </ToolButton>
        <ToolButton active={tool === "led"} onClick={() => { setTool("led"); setStart(null); setWcWord(null); }}>
          <LedGlyph symbol="subjekt" className="h-3.5 w-3.5" /> Led
        </ToolButton>
        <ToolButton active={tool === "klasse"} onClick={() => { setTool("klasse"); setStart(null); setLedRange(null); }}>
          Aa Ordklasse
        </ToolButton>
        <ToolButton active={eraser} onClick={() => { setTool("tusch"); setEraser(true); setStart(null); }}>
          ⌫ Slet
        </ToolButton>
        <div className="ml-auto flex items-center gap-1.5">
          {tool === "tusch" && !eraser &&
            (Object.keys(HL) as HlColor[]).map((c) => (
              <button
                key={c}
                type="button"
                title={HL[c].label}
                aria-label={`Vælg ${HL[c].label} tusch`}
                onClick={() => setColor(c)}
                className={cn(
                  "h-5 w-5 rounded-full border transition",
                  HL[c].swatch,
                  color === c ? "scale-110 border-ink/60 ring-2 ring-ink/20" : "border-ink/20 hover:scale-105"
                )}
              />
            ))}
          <label className={cn("ml-1 inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-ink/50", tool !== "tusch" || eraser ? "pointer-events-none opacity-30" : "")}>
            <input type="checkbox" className="h-3.5 w-3.5 accent-blue-600" checked={sentenceMode} onChange={(e) => setSentenceMode(e.target.checked)} />
            hele sætningen
          </label>
        </div>
      </div>

      {/* Teksten */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">{article.title}</h2>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-ink/40">{article.byline}</p>
        <div className="mt-4 space-y-4 text-[15px] leading-7 text-ink/80">
          {article.paragraphs.map((_, pi) => {
              const group = tokens.filter((t) => t.para === pi);
              return (
                <p key={pi} className="flex flex-wrap gap-x-1.5 gap-y-2">
                  {group.map((tok) => {
                    const m = marks[tok.id];
                    const isFirstLed = !!m?.led && (!byId.has(tok.id - 1) || marks[tok.id - 1]?.led !== m.led || byId.get(tok.id - 1)!.para !== tok.para);
                    return (
                      <button
                        key={tok.id}
                        type="button"
                        onClick={() => {
                          if (tool === "led" && !start && !ledRange && selectLedRange(tok)) return;
                          tapWord(tok);
                        }}
                        className={cn(
                          "relative inline-flex flex-col items-center rounded-md text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-400",
                          "hover:bg-ink/5",
                          m?.hl && HL[m.hl].on,
                          m?.led && cn("px-0.5", LED_LINE[m.led]),
                          m?.wc && "underline decoration-indigo-400 decoration-dotted underline-offset-4",
                          start?.id === tok.id && "ring-2 ring-blue-400"
                        )}
                      >
                        <span className="h-3.5">{isFirstLed && m?.led ? <LedGlyph symbol={m.led} className="h-3.5 w-3.5 text-ink/70" /> : m?.wc ? <span className="text-[8px] font-bold uppercase text-indigo-500">{m.wc.slice(0, 4)}</span> : null}</span>
                        <span>{tok.text}</span>
                      </button>
                    );
                  })}
                </p>
              );
            })}
        </div>
      </div>

      {/* Vælgere + status */}
      {(start || ledRange || wcWord) && (
        <div className="border-t border-ink/10 px-4 py-2 text-[11px] font-semibold text-ink/50">{pendingLabel}</div>
      )}

      {ledRange && (
        <div className="border-t border-ink/10 px-4 py-3" role="menu" aria-label="Vælg ledsymbol">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-ink">Hvilket led er «{tokensInRange(tokens, ledRange).map((t) => t.text).join(" ")}»?</p>
            <button type="button" onClick={() => { setLedRange(null); setStart(null); }} className="text-xs font-semibold text-ink/50 hover:text-ink">
              Annuller
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SYMBOLS.map((s) => (
              <button
                key={s.symbol}
                type="button"
                onClick={() => {
                  applyRange(ledRange[0], ledRange[1], { led: s.symbol }, []);
                  setLedRange(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-blue-400 hover:bg-blue-50" 
                title={s.name}
              >
                <LedGlyph symbol={s.symbol} className="h-4 w-4" />
                {s.short}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                removeRange(ledRange[0], ledRange[1], ["led"]);
                setLedRange(null);
              }}
              className="inline-flex items-center rounded-xl border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              Fjern led
            </button>
          </div>
        </div>
      )}

      {wcWord && (
        <div className="border-t border-ink/10 px-4 py-3" role="menu" aria-label="Vælg ordklasse">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-ink">Hvilken ordklasse er «{wcWord.text}»?</p>
            <button type="button" onClick={() => setWcWord(null)} className="text-xs font-semibold text-ink/50 hover:text-ink">
              Annuller
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAM_WORD_CLASS_TAGS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  applyRange(wcWord.id, wcWord.id, { wc: t.id }, []);
                  setWcWord(null);
                }}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition",
                  marks[wcWord.id]?.wc === t.id ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-ink/10 text-ink hover:border-indigo-300 hover:bg-indigo-50/50"
                )}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                removeRange(wcWord.id, wcWord.id, ["wc"]);
                setWcWord(null);
              }}
              className="rounded-xl border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              Fjern ordklasse
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-ink/10 px-4 py-2">
        <p className="text-[11px] text-ink/40">Markeringerne er dit læseværktøj ; de bliver ikke bedømt, men de ryger med i kopien af din besvarelse.</p>
        {Object.keys(marks).length > 0 && (
          <button type="button" onClick={() => setMarks({})} className="shrink-0 rounded-full border border-ink/15 px-2.5 py-1 text-[11px] font-bold text-ink/60 hover:border-rose-300 hover:text-rose-600">
            Ryd alle markeringer
          </button>
        )}
      </div>
    </div>
  );
}

function tokensInRange(all: WordTok[], [a, b]: [number, number]): WordTok[] {
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return all.filter((t) => t.id >= lo && t.id <= hi);
}

function ToolButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition",
        active ? "border-blue-500 bg-blue-500 text-white shadow-sm" : "border-ink/15 bg-white text-ink/70 hover:border-blue-300 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

export function countExamMarks(marks: Record<number, ExamMark>): { hl: number; led: number; wc: number } {
  let hl = 0;
  let led = 0;
  let wc = 0;
  for (const m of Object.values(marks)) {
    if (m.hl) hl++;
    if (m.led) led++;
    if (m.wc) wc++;
  }
  return { hl, led, wc };
}

export { getSymbolDef };
