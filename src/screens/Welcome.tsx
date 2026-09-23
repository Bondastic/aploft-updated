"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Education } from "../types";
import { EDU_THEMES } from "../lib/education";
import SchoolStep from "../components/onboarding/SchoolStep";
import { StxIcon, HhxIcon, CheckIcon, ChevronRightIcon } from "../components/icons";
import { cn } from "../utils/cn";

// Velkomstskærmen: det første, man ser. Her vælger man sin uddannelse
// (STX = rød, HHX = blå), og valget gemmes i localStorage, så man ikke skal
// vælge igen næste gang. Brugernavnet er valgfrit.
//
// Tre korte trin:
//  1) Vælg uddannelse. Det valgte kort får en tone-i-tone-nøglelinje i
//     uddannelsens farve; de andre dæmpes en smule.
//  2) Vælg skole (så kan eleven se NETOP sin skoles eksamensform under Prøve;
//     "Anden skole" viser de former, vi har for sporet). Valget gemmes KUN
//     lokalt paa enheden - der indsamles ingen data.
//  3) Brugernavn (valgfrit). Tryk "Kom i gang" (eller spring over).
//
// Visuelt: redaktionel titelside med venstrestillet masthead, skarpe hjørner
// og korte trinovergange. Ingen gradienter, glød eller spring-animationer.
export default function WelcomePage({
  reduceMotion,
  onComplete,
}: {
  reduceMotion: boolean;
  onComplete: (education: Education, nickname: string, school: string | null) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [education, setEducation] = useState<Education | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");

  function chooseEdu(id: Education) {
    // Valget markeres med farvenøglelinje og tone-i-tone-flade; de andre
    // rækker dæmpes, så der ikke er noget mærkeligt "blink".
    setEducation(id);
  }

  function finish() {
    if (education) onComplete(education, nickname.trim(), school);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12 sm:px-8">
      {/* Masthead: venstrestillet og asymmetrisk med trin-tæller i højre side */}
      <div className="flex items-baseline justify-between gap-4 border-t-[3px] border-ink pt-4">
        <div className="min-w-0">
          <p className="eyebrow">Velkommen</p>
          <h1 className="page-title mt-1">AP Klar</h1>
        </div>
        <p className="eyebrow shrink-0 tabular-nums">Trin 0{step} / 03</p>
      </div>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
        {step === 1
          ? "Vi har øvelser til begge uddannelser. Vælg din, så finder vi det rigtige pensum til dig."
          : step === 2
            ? "Eksamen ser forskellig ud fra skole til skole. Vælg din, så ser du den rigtige eksamensform under Prøve."
            : "Det tager kun 5 sekunder. Du kan altid skifte uddannelse senere under Profil → Indstillinger."}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="step-1"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-8 w-full space-y-4"
          >
            <div className="grid gap-3">
              {(["stx", "hhx"] as const).map((id) => {
                const selected = education === id;
                const dimmed = education !== null && !selected;
                const theme = EDU_THEMES[id];
                return (
                  <button
                    key={id}
                    onClick={() => chooseEdu(id)}
                    aria-pressed={selected}
                    className={cn(
                      "relative flex w-full items-center gap-4 rounded-lg border bg-card p-5 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                      selected
                        ? id === "stx"
                          ? "border-stx-mid border-l-4 border-l-stx-base bg-stx-soft"
                          : "border-hhx-mid border-l-4 border-l-hhx-base bg-hhx-soft"
                        : "border-ink/12 hover:border-ink/30",
                      dimmed && "opacity-60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
                        selected ? (id === "stx" ? "text-stx-base" : "text-hhx-base") : "text-ink/50"
                      )}
                    >
                      {id === "stx" ? <StxIcon className="h-7 w-7" /> : <HhxIcon className="h-7 w-7" />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-base font-extrabold tracking-tight text-ink">{theme.label}</span>
                      <span className="block text-sm text-ink/60">{theme.fullName}</span>
                      <span className="mt-0.5 block text-xs text-ink/45">{theme.tagline}</span>
                    </span>
                    {/* Kvadratisk markering: udfyldt firkant med flueben, når valgt */}
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border",
                        selected
                          ? id === "stx"
                            ? "border-stx-base bg-stx-base text-white"
                            : "border-hhx-base bg-hhx-base text-white"
                          : "border-ink/25"
                      )}
                    >
                      {selected && <CheckIcon className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {education && (
                <motion.button
                  key="vaelg-knap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  onClick={() => setStep(2)}
                  className={cn("btn w-full py-3", education === "stx" ? "bg-stx-base text-white" : "bg-hhx-base text-white")}
                >
                  Fortsæt med {EDU_THEMES[education].label}
                  <ChevronRightIcon className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
            {!education && (
              <button disabled className="btn w-full py-3 bg-ink/10 text-ink/35">
                Vælg din uddannelse
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        ) : step === 2 ? (
          <motion.div
            key="step-school"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-8 w-full space-y-4"
          >
            {education && <SchoolStep education={education} value={school} onChange={setSchool} reduceMotion={reduceMotion} />}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn btn-outline">
                ← Tilbage
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!school}
                className={cn(
                  "btn flex-1 py-3",
                  school ? (education === "stx" ? "bg-stx-base text-white" : "bg-hhx-base text-white") : "bg-ink/10 text-ink/35"
                )}
              >
                {school ? "Bekræft skolevalg" : "Vælg din skole (eller &lsquo;anden skole&rsquo;)"}
                {school && <ChevronRightIcon className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step-2"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-8 w-full space-y-4"
          >
            <div
              className={cn(
                "border-l-4 py-1 pl-4 text-sm",
                education === "stx" ? "border-stx-base text-stx-deep" : "border-hhx-base text-hhx-deep"
              )}
            >
              Du har valgt <span className="font-extrabold">{education ? EDU_THEMES[education].label : ""}</span>:{" "}
              {education ? EDU_THEMES[education].shortName : ""}
            </div>

            <div className="card p-5">
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
                className="field w-full"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn btn-outline">
                ← Tilbage
              </button>
              <button
                onClick={finish}
                className={cn("btn flex-1 py-3", education === "stx" ? "bg-stx-base text-white" : "bg-hhx-base text-white")}
              >
                Kom i gang
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
