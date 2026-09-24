"use client";

// ---------------------------------------------------------------------------
// Mellemskærmen mellem emnelisten og selve emnet.
//
// Elevernes tilbagemelding: "når man trykker på et emne, skal man have en
// skærm med Lingua og en procesbar, så man ved, hvad man er ved at starte."
// Skærmen gør tre ting: den siger tydeligt HVAD du er på vej ind i, den viser
// hvor meget der venter, og den giver dig et sidste valg, før du går i gang.
//
// Ved reduceMotion springes optællingen over : så står baren fuld med det
// samme, og knappen er klar fra start.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Mascot from "../Mascot";
import { cn } from "../../utils/cn";

export default function EmneLoader({
  title,
  description,
  lessonCount,
  taskCount,
  accentSolid,
  reduceMotion,
  onReady,
  onCancel,
}: {
  title: string;
  description: string;
  /** Antal forløb i emnet. */
  lessonCount: number;
  /** Antal opgaver i alt i emnet. */
  taskCount: number;
  accentSolid: string;
  reduceMotion: boolean;
  onReady: () => void;
  onCancel: () => void;
}) {
  const [pct, setPct] = useState(reduceMotion ? 100 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    // Baren fyldes på ca. 1,1 sekund. Den er et signal om, at emnet gøres
    // klar : ikke en rigtig indlæsning, for alt indhold ligger allerede lokalt.
    const steps = [18, 42, 67, 88, 100];
    const timers = steps.map((v, i) => window.setTimeout(() => setPct(v), 120 + i * 220));
    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  const klar = pct >= 100;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      className="app-page-narrow flex min-h-[60vh] flex-col items-center justify-center space-y-5 text-center"
    >
      <Mascot
        pose={klar ? "thumbsup" : "thinking"}
        size="md"
        className="mx-auto justify-center"
        reduceMotion={reduceMotion}
      />

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink/40">
          {klar ? "Emnet er klar" : "Gør emnet klar…"}
        </p>
        <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink/60">{description}</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className={cn("h-full rounded-full", accentSolid)}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-[12px] font-semibold text-ink/50">
          {lessonCount} forløb · {taskCount} opgaver i alt
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2.5">
        <button
          type="button"
          onClick={onReady}
          disabled={!klar}
          className={cn(
            "w-full rounded-full py-3.5 text-base font-bold text-white shadow-lg transition",
            accentSolid,
            !klar && "cursor-not-allowed opacity-50"
          )}
        >
          {klar ? "Ja, jeg er klar : gå i gang" : "Vent et øjeblik…"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-full py-2.5 text-sm font-semibold text-ink/50 transition hover:text-ink"
        >
          Nej, vælg et andet emne
        </button>
      </div>
    </motion.div>
  );
}
