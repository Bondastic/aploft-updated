"use client";

// "Vælg din skole"-skærmen for eksisterende brugere: kommer OP kun for dem,
// der endnu ikke har valgt en specifik skole (fx opgraderet fra en ældre
// version). Ny-brugere får valget inde i velkomstflowet. Herefter ses det
// aldrig igen - medmindre man skifter uddannelse, så spørges der for det nye
// spors skoler.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Education } from "../types";
import SchoolStep from "../components/onboarding/SchoolStep";
import { getEducation } from "../lib/education";
import { cn } from "../utils/cn";
import { ChevronRightIcon } from "../components/icons";

export default function SchoolGatePage({
  education,
  reduceMotion,
  onDone,
}: {
  education: Education;
  reduceMotion: boolean;
  onDone: (schoolId: string | null) => void;
}) {
  const theme = getEducation(education);
  const [school, setSchool] = useState<string | null>(null);
  const canContinue = school !== null;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12 sm:px-8">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key="head"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn("border-t-[3px] pt-4", education === "stx" ? "border-stx-base" : "border-hhx-base")}
        >
          <p className="eyebrow">Opdatering</p>
          <h1 className="page-title mt-1">Vælg din skole</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
            Du har allerede valgt {theme.label}. Nu skal vi bare vide, hvilken skole du går på, så du kan se eksamensformen på{" "}
            <span className="font-semibold text-ink">præcis din skole</span> under fanen Prøve.
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 w-full">
        <SchoolStep education={education} value={school} onChange={setSchool} reduceMotion={reduceMotion} />
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => onDone(school)}
        className={cn(
          "btn mt-5 w-full py-3",
          canContinue ? cn(theme.solidBg) : "bg-ink/10 text-ink/35"
        )}
      >
        {canContinue ? "Gem mit skolevalg" : "Vælg først en skole (eller 'anden skole')"}
        {canContinue && <ChevronRightIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}
