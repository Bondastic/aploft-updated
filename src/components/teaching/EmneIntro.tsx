"use client";

// ---------------------------------------------------------------------------
// Læsesiden, eleven møder FØR opgaverne i et emne (kun HHX).
// "Der skal være en informationsside, hvor eleven lige læser hurtigt om, hvad
// han/hun skal igennem, inden de bare bliver kastet ud i spørgsmålene."
// Siden viser: et diagram, hvad du skal kunne, begreberne (latinske først),
// den typiske fælde og lærerens OBS.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import type { EmneIntroT } from "../../data/hhx/emneIntro";
import Diagram from "./Diagrams";
import Mascot from "../Mascot";
import { CheckIcon, InfoIcon, LightbulbIcon } from "../icons";
import { cn } from "../../utils/cn";

export default function EmneIntro({
  intro,
  accentSolid,
  reduceMotion,
  onStart,
  onBack,
  startLabel = "Jeg er klar : start opgaverne",
}: {
  intro: EmneIntroT;
  /** Tailwind-klasser for sporets farve (fx "bg-blue-600"). */
  accentSolid: string;
  reduceMotion: boolean;
  onStart: () => void;
  onBack?: () => void;
  startLabel?: string;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="app-page space-y-4"
    >
      {onBack && (
        <button type="button" onClick={onBack} className="text-sm font-semibold text-ink/50 transition hover:text-ink">
          ← Tilbage
        </button>
      )}

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink/40">Læs først : 1 minut</p>
        <h1 className="font-display text-2xl font-extrabold text-ink">{intro.title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">{intro.lead}</p>
      </div>

      <Diagram id={intro.diagram} />

      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <p className="font-bold text-ink">Det skal du kunne bagefter</p>
        <ul className="mt-2 space-y-1.5">
          {intro.goals.map((g) => (
            <li key={g} className="flex gap-2 text-sm text-ink/70">
              <CheckIcon className={cn("mt-0.5 h-4 w-4 shrink-0 rounded-full p-0.5 text-white", accentSolid)} />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <p className="font-bold text-ink">Begreberne, du skal bruge</p>
        <p className="text-[11px] text-ink/45">De latinske betegnelser er de primære : det er dem, du bruger til eksamen.</p>
        <dl className="mt-2 space-y-1.5">
          {intro.terms.map((t) => (
            <div key={t.term} className="rounded-xl bg-ink/[0.03] px-3 py-2">
              <dt className="text-sm font-bold text-ink">{t.term}</dt>
              <dd className="text-[13px] leading-relaxed text-ink/65">{t.def}</dd>
            </div>
          ))}
        </dl>
      </div>

      {intro.trap && (
        <div className="flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-bold">Den typiske fælde: </span>
            {intro.trap}
          </span>
        </div>
      )}

      {intro.obs && (
        <div className="flex gap-2 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-sm leading-relaxed text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{intro.obs}</span>
        </div>
      )}

      <Mascot pose="explain" size="sm" reduceMotion={reduceMotion} speech="Læs det roligt igennem : så giver opgaverne meget mere mening bagefter." />

      <button
        type="button"
        onClick={onStart}
        className={cn("flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white shadow-lg", accentSolid)}
      >
        {startLabel}
      </button>
    </motion.div>
  );
}
