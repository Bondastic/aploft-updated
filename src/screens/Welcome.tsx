"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Education } from "../types";
import { EDU_THEMES } from "../lib/education";
import Mascot from "../components/Mascot";
import { StxIcon, HhxIcon, CheckIcon, ChevronRightIcon } from "../components/icons";
import { cn } from "../utils/cn";

// Velkomstskærmen: det første, man ser. Her vælger man sin uddannelse
// (STX = rød, HHX = blå), og valget gemmes i localStorage, så man ikke skal
// vælge igen næste gang. Brugernavnet er valgfrit.
//
// To korte trin:
//  1) Vælg uddannelse. Kortet "lyser op" med en glidende skala- og glød-
//     animation, og "Vælg"-knappen glider op, når der er valgt noget.
//  2) Brugernavn (valgfrit). Tryk "Kom i gang" (eller spring over).
export default function WelcomePage({
  reduceMotion,
  onComplete,
}: {
  reduceMotion: boolean;
  onComplete: (education: Education, nickname: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [education, setEducation] = useState<Education | null>(null);
  const [nickname, setNickname] = useState("");

  const anim = reduceMotion ? { initial: false } : {};

  function chooseEdu(id: Education) {
    // Kortet der trykkes på bliver valgt med en glidende animation, mens de
    // andre kort forbliver synlige (bare lidt dæmpede), så der ikke er noget
    // mærkeligt "blink".
    setEducation(id);
  }

  function finish() {
    if (education) onComplete(education, nickname.trim());
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-10 lg:max-w-3xl">
      <Mascot
        pose={step === 1 ? "welcome" : "explain"}
        size="lg"
        speech={step === 1 ? "Velkommen! Hvilken uddannelse går du på?" : "Skriv gerne et navn, så jeg kan hilse på dig. Du kan også springe over."}
        reduceMotion={reduceMotion}
      />

      <div className="mt-4 w-full text-center">
        <p className="font-display text-3xl font-extrabold text-ink">Velkommen til AP Klar</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink/50">
          {step === 1
            ? "Vi har øvelser til begge uddannelser. Vælg din, så finder vi det rigtige pensum til dig."
            : "Det tager kun 5 sekunder. Du kan altid skifte uddannelse senere under Profil → Indstillinger."}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="step-1"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-8 w-full space-y-4"
          >
            <div className="grid gap-4">
              <motion.button
                onClick={() => chooseEdu("stx")}
                aria-pressed={education === "stx"}
                animate={{ scale: education === "stx" ? 1.02 : 1, opacity: education && education !== "stx" ? 0.75 : 1 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={cn(
                  "relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border-2 p-5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  education === "stx"
                    ? "border-red-500 bg-red-50 shadow-xl shadow-red-500/25 ring-4 ring-red-300/60"
                    : "border-ink/10 bg-white shadow-sm hover:border-red-300 hover:shadow-md"
                )}
              >
                <span
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-200",
                    education === "stx" ? "bg-red-500 text-white" : "bg-red-100 text-red-600"
                  )}
                >
                  <StxIcon className="h-7 w-7" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg font-extrabold text-ink">STX</span>
                  <span className="block text-sm text-ink/60">{EDU_THEMES.stx.fullName}</span>
                  <span className="mt-0.5 block text-xs text-ink/40">{EDU_THEMES.stx.tagline}</span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                    education === "stx" ? "border-red-500 bg-red-500 text-white" : "border-ink/20"
                  )}
                >
                  <AnimatePresence>
                    {education === "stx" && (
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="flex"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>

              <motion.button
                onClick={() => chooseEdu("hhx")}
                aria-pressed={education === "hhx"}
                animate={{ scale: education === "hhx" ? 1.02 : 1, opacity: education && education !== "hhx" ? 0.75 : 1 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={cn(
                  "relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border-2 p-5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  education === "hhx"
                    ? "border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/25 ring-4 ring-blue-300/60"
                    : "border-ink/10 bg-white shadow-sm hover:border-blue-300 hover:shadow-md"
                )}
              >
                <span
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-200",
                    education === "hhx" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"
                  )}
                >
                  <HhxIcon className="h-7 w-7" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg font-extrabold text-ink">HHX</span>
                  <span className="block text-sm text-ink/60">{EDU_THEMES.hhx.fullName}</span>
                  <span className="mt-0.5 block text-xs text-ink/40">{EDU_THEMES.hhx.tagline}</span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                    education === "hhx" ? "border-blue-500 bg-blue-500 text-white" : "border-ink/20"
                  )}
                >
                  <AnimatePresence>
                    {education === "hhx" && (
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="flex"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            </div>

            <AnimatePresence>
              {education && (
                <motion.button
                  key="vaelg-knap"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  onClick={() => setStep(2)}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3.5 text-base font-bold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    education === "stx" ? "from-red-500 to-rose-600 shadow-red-500/40" : "from-blue-500 to-indigo-600 shadow-blue-500/40"
                  )}
                >
                  Vælg {EDU_THEMES[education].label}
                  <ChevronRightIcon className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
            {!education && (
              <button
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-ink/10 py-3.5 text-base font-bold text-ink/30"
              >
                Vælg din uddannelse
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="step-2"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-8 w-full space-y-4"
          >
            <div
              className={cn(
                "rounded-2xl border-2 p-4 text-center text-sm font-semibold",
                education === "stx" ? "border-red-200 bg-red-50 text-red-700" : "border-blue-200 bg-blue-50 text-blue-700"
              )}
            >
              Du har valgt <span className="font-extrabold">{education ? EDU_THEMES[education].label : ""}</span>:{" "}
              {education ? EDU_THEMES[education].shortName : ""}
            </div>

            <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
              <label htmlFor="welcome-nickname" className="mb-1.5 block text-sm font-bold text-ink">
                Hvad skal vi kalde dig? <span className="font-semibold text-ink/40">(valgfrit)</span>
              </label>
              <p className="mb-3 text-xs text-ink/50">Dit navn gemmes kun på denne enhed. Du kan ændre det senere på Profil.</p>
              <input
                id="welcome-nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finish();
                }}
                placeholder="Fx AP-jægeren"
                maxLength={20}
                autoComplete="off"
                className="w-full rounded-xl border-2 border-ink/15 px-3 py-2.5 text-base outline-none transition focus:border-purple"
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setStep(1)}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border-2 border-ink/15 px-5 py-3 text-sm font-semibold text-ink/60 transition hover:border-ink/30 hover:text-ink"
              >
                ← Tilbage
              </motion.button>
              <motion.button
                onClick={finish}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r py-3.5 text-base font-bold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  education === "stx" ? "from-red-500 to-rose-600 shadow-red-500/40" : "from-blue-500 to-indigo-600 shadow-blue-500/40"
                )}
              >
                Kom i gang
                <ChevronRightIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
