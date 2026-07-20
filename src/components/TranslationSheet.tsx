"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { LATIN_VOCAB } from "../data/latin/vocab";
import { ScrollIcon, XIcon } from "./icons";

const TYPE_LABELS: Record<string, string> = {
  substantiv: "Substantiver",
  verbum: "Verber",
  adjektiv: "Adjektiver",
  præposition: "Præpositioner",
  konjunktion: "Konjunktioner",
  pronomen: "Pronominer",
};

const TYPE_ORDER = ["substantiv", "verbum", "adjektiv", "pronomen", "præposition", "konjunktion"];

export default function TranslationSheet({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const [open, setOpen] = useState(false);

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    words: LATIN_VOCAB.filter((v) => v.type === type),
  })).filter((g) => g.words.length > 0);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={false}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        className="fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-300/50 ring-2 ring-white sm:bottom-8"
      >
        <ScrollIcon className="h-5 w-5" />
        Oversættelsesark
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={reduceMotion ? { opacity: 0 } : { y: "100%", rotate: -6, opacity: 0.5 }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0, rotate: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: "100%", rotate: 6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="relative mx-4 mb-0 flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-[#f5ecd7] p-3 pb-4 shadow-2xl sm:mb-4 sm:rounded-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <p className="flex items-center gap-1.5 font-serif text-sm font-semibold text-stone-700">
                  <ScrollIcon className="h-4 w-4" />
                  Oversættelsesark
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-stone-200 p-1.5 text-stone-600 hover:bg-stone-300"
                  aria-label="Luk"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto rounded-lg border-4 border-white bg-white/60 p-3 shadow-inner">
                {grouped.map((g) => (
                  <div key={g.type} className="mb-3 last:mb-0">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-500">{g.label}</p>
                    <ul className="space-y-1">
                      {g.words.map((w) => (
                        <li key={w.latin} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-stone-200 pb-1 text-sm last:border-0">
                          <span className="font-serif italic text-stone-800">{w.latin}</span>
                          <span className="text-stone-600">{w.danish}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-2 px-2 text-center text-xs text-stone-500">
                Ordforrådet her passer til de opgaver, du møder i oversættelsesdelen.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
