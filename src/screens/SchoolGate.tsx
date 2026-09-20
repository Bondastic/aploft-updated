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
import Mascot from "../components/Mascot";
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
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-10">
      <Mascot pose="welcome" size="md" reduceMotion={reduceMotion} speech="Ny opdatering! Én lille ting mangler stadig hos dig." />
      <div className="mt-3 w-full text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key="head"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Opdatering : vælg din skole</p>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-ink/55">
              Du har allerede valgt {theme.label}. Nu skal vi bare vide, hvilken skole du går på, så du kan se eksamensformen på{" "}
              <span className="font-semibold text-ink">præcis din skole</span> under fanen Prøve.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 w-full">
        <SchoolStep education={education} value={school} onChange={setSchool} reduceMotion={reduceMotion} />
      </div>

      <motion.button
        type="button"
        disabled={!canContinue}
        onClick={() => onDone(school)}
        whileTap={canContinue ? { scale: 0.97 } : undefined}
        className={cn(
          "mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white shadow-lg transition",
          canContinue ? cn("bg-gradient-to-r", theme.gradient) : "cursor-not-allowed bg-ink/15 text-ink/30"
        )}
      >
        {canContinue ? "Gem mit skolevalg" : "Vælg først en skole (eller 'anden skole')"}
        {canContinue && <ChevronRightIcon className="h-5 w-5" />}
      </motion.button>
    </div>
  );
}
