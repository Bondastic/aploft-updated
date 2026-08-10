"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { LATIN_VOCAB, type VocabEntry } from "../data/latin/vocab";
import { ScrollIcon, SearchIcon, XIcon } from "./icons";
import { cn } from "../utils/cn";

const TYPE_LABELS: Record<string, string> = {
  substantiv: "Substantiver",
  verbum: "Verber",
  adjektiv: "Adjektiver",
  præposition: "Præpositioner",
  konjunktion: "Konjunktioner",
  pronomen: "Pronominer",
};

const TYPE_ORDER = ["substantiv", "verbum", "adjektiv", "pronomen", "præposition", "konjunktion"];

interface DeclensionTable {
  title: string;
  note: string;
  headers: string[];
  rows: string[][];
}

// Kort, "lige når du skal bruge det"-bøjningsreference. Matcher eksemplerne
// fra Lynkursus, så eleven møder de samme former igen og genkender dem.
const DECLENSION_TABLES: DeclensionTable[] = [
  {
    title: "1. deklination: puella (pige)",
    note: "Overvejende hunkøn, ender på -a i nominativ",
    headers: ["Kasus", "Ental", "Flertal"],
    rows: [
      ["Nominativ", "puella", "puellae"],
      ["Genitiv", "puellae", "puellarum"],
      ["Dativ", "puellae", "puellis"],
      ["Akkusativ", "puellam", "puellas"],
      ["Ablativ", "puella", "puellis"],
    ],
  },
  {
    title: "2. deklination: dominus (herre)",
    note: "Hankøn, ender på -us i nominativ",
    headers: ["Kasus", "Ental", "Flertal"],
    rows: [
      ["Nominativ", "dominus", "domini"],
      ["Genitiv", "domini", "dominorum"],
      ["Dativ", "domino", "dominis"],
      ["Akkusativ", "dominum", "dominos"],
      ["Ablativ", "domino", "dominis"],
    ],
  },
  {
    title: "2. deklination: templum (tempel)",
    note: "Intetkøn, ender på -um i nominativ",
    headers: ["Kasus", "Ental", "Flertal"],
    rows: [
      ["Nominativ", "templum", "templa"],
      ["Genitiv", "templi", "templorum"],
      ["Dativ", "templo", "templis"],
      ["Akkusativ", "templum", "templa"],
      ["Ablativ", "templo", "templis"],
    ],
  },
  {
    title: "Esse (at være), nutid",
    note: "Det vigtigste verbum: uregelmæssigt, men brug personendelserne",
    headers: ["Person", "Ental", "Flertal"],
    rows: [
      ["1. person", "sum (jeg er)", "sumus (vi er)"],
      ["2. person", "es (du er)", "estis (I er)"],
      ["3. person", "est (han/hun er)", "sunt (de er)"],
    ],
  },
  {
    title: "1. konjugation: amare (at elske), nutid",
    note: "Mønster for regelmæssige verber på -are",
    headers: ["Person", "Ental", "Flertal"],
    rows: [
      ["1. person", "amo", "amamus"],
      ["2. person", "amas", "amatis"],
      ["3. person", "amat", "amant"],
    ],
  },
];

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-200 px-0.5 text-stone-900">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function matches(entry: VocabEntry, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return entry.latin.toLowerCase().includes(q) || entry.danish.toLowerCase().includes(q) || (entry.note ?? "").toLowerCase().includes(q);
}

// Oversættelsesarket: en modal med ordforråd + bøjningsskemaer. Vises kun,
// når en latinsk opgave faktisk kræver ordforråd/bøjning, og knappen til at
// åbne den ligger i selve opgaven (TaskRenderer), ikke som en permanent
// flydende knap. Arket kan ikke åbnes bagefter, når man har svaret.
export default function TranslationSheet({
  open,
  onClose,
  reduceMotion = false,
}: {
  open: boolean;
  onClose: () => void;
  reduceMotion?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"ord" | "boejning">("ord");

  const grouped = useMemo(() => {
    return TYPE_ORDER.map((type) => ({
      type,
      label: TYPE_LABELS[type],
      words: LATIN_VOCAB.filter((v) => v.type === type && matches(v, query)),
    })).filter((g) => g.words.length > 0);
  }, [query]);

  const totalMatches = grouped.reduce((sum, g) => sum + g.words.length, 0);

  function close() {
    setQuery("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Oversættelsesark"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0.5 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="relative flex h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-[#f5ecd7] shadow-2xl sm:h-[85vh] sm:rounded-2xl"
          >
            {/* Sticky top: titel, luk, faneblade og søgefelt */}
            <div className="shrink-0 border-b border-stone-300/60 bg-[#f5ecd7] px-3 pb-2 pt-3">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="flex items-center gap-1.5 font-serif text-sm font-semibold text-stone-700">
                  <ScrollIcon className="h-4 w-4" />
                  Oversættelsesark
                </p>
                <button onClick={close} className="rounded-full bg-stone-200 p-1.5 text-stone-600 hover:bg-stone-300" aria-label="Luk">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-2 flex rounded-xl bg-stone-200/70 p-1">
                <button
                  onClick={() => setTab("ord")}
                  className={cn("flex-1 rounded-lg py-1.5 text-xs font-bold transition", tab === "ord" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500")}
                >
                  Ordforråd
                </button>
                <button
                  onClick={() => setTab("boejning")}
                  className={cn("flex-1 rounded-lg py-1.5 text-xs font-bold transition", tab === "boejning" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500")}
                >
                  Bøjningsskemaer
                </button>
              </div>

              {tab === "ord" && (
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    inputMode="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Søg efter et ord (latin eller dansk)…"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="w-full rounded-xl border-2 border-stone-300 bg-white py-2 pl-9 pr-8 text-sm text-stone-800 outline-none focus:border-amber-500"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label="Ryd søgning"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-100"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Scrollbart indhold */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {tab === "ord" ? (
                <div className="rounded-lg border-4 border-white bg-white/60 p-3 shadow-inner">
                  {query && (
                    <p className="mb-2 text-xs font-semibold text-stone-500" aria-live="polite">
                      {totalMatches === 0 ? "Ingen ord matcher søgningen." : `${totalMatches} ord matcher "${query}"`}
                    </p>
                  )}
                  {grouped.map((g) => (
                    <div key={g.type} className="mb-3 last:mb-0">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-500">{g.label}</p>
                      <ul className="space-y-1">
                        {g.words.map((w) => (
                          <li
                            key={w.latin}
                            className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-stone-200 pb-1.5 text-sm last:border-0"
                          >
                            <span className="font-serif italic text-stone-800">{highlight(w.latin, query)}</span>
                            <span className="text-right text-stone-600">
                              {highlight(w.danish, query)}
                              {w.note && <span className="ml-1.5 rounded-full bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">{w.note}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {DECLENSION_TABLES.map((t) => (
                    <div key={t.title} className="overflow-hidden rounded-lg border-4 border-white bg-white/60 shadow-inner">
                      <div className="border-b border-stone-200 bg-white/70 px-3 py-1.5">
                        <p className="text-xs font-bold text-stone-700">{t.title}</p>
                        <p className="text-[11px] text-stone-500">{t.note}</p>
                      </div>
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr>
                            {t.headers.map((h) => (
                              <th key={h} className="border-b border-stone-200 px-3 py-1.5 font-bold text-stone-600">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {t.rows.map((row, i) => (
                            <tr key={i} className="odd:bg-white/40">
                              {row.map((cell, j) => (
                                <td key={j} className="border-b border-stone-100 px-3 py-1.5 font-serif italic text-stone-800 first:font-sans first:not-italic first:font-semibold first:text-stone-600">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="shrink-0 border-t border-stone-300/60 px-3 py-2 text-center text-xs text-stone-500">
              Ordforrådet passer til opgaverne i oversættelsesdelen. Du må altid bruge arket, også til en rigtig prøve.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
