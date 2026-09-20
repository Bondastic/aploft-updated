"use client";

// Fælles skolevalg-trin: bruges i velkomstflowet (Welcome), i "nyt
// opdaterings-skærmen" for eksisterende brugere (SchoolGate) og i Profil →
// Indstillinger. Kender eleven ikke sin skole på listen, vælges "Anden
// skole" - så vises listen over de eksamensformer, vi HAR for sporet, så
// eleven ved, hvad der gælder indtil videre.
//
// Databeskyttelse: valget gemmes udelukkende i appens lokale progress
// (localStorage på enheden). Der indsamles, sendes eller logges intet.

import { useState } from "react";
import { motion } from "framer-motion";
import type { Education } from "../../types";
import { SCHOOLS, UNKNOWN_SCHOOL_ID, schoolsFor } from "../../data/schools";
import { formatForSchoolId, formatsForEducation } from "../../data/hhx/examFormats";
import { getEducation } from "../../lib/education";
import { cn } from "../../utils/cn";
import { CheckIcon, InfoIcon } from "../icons";

export default function SchoolStep({
  education,
  value,
  onChange,
  reduceMotion,
}: {
  education: Education;
  value: string | null;
  onChange: (schoolId: string) => void;
  reduceMotion: boolean;
}) {
  const theme = getEducation(education);
  const schools = schoolsFor(education);
  const otherSelected = value === UNKNOWN_SCHOOL_ID;
  const otherFormats = formatsForEducation(education);

  return (
    <div className="w-full space-y-3">
      <div className="grid gap-2.5">
        {schools.map((school, i) => {
          const fmt = formatForSchoolId(school.formatId);
          const active = value === school.id;
          return (
            <motion.button
              key={school.id}
              type="button"
              onClick={() => onChange(school.id)}
              aria-pressed={active}
              animate={reduceMotion ? undefined : { scale: active ? 1.01 : 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 26, delay: reduceMotion ? 0 : i * 0.05 }}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition",
                active ? cn(theme.borderActive, "bg-white shadow-md") : "border-ink/10 bg-white hover:border-ink/25"
              )}
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", active ? theme.solidBg : theme.softBg)}>
                <CheckIcon className={cn("h-5 w-5", active ? "text-white" : "opacity-0")} />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-ink">{school.name}</span>
                <span className="block text-xs text-ink/50">
                  {school.city ? `${school.city} · ` : ""}
                  {fmt?.status === "klar" ? "Eksamensform: beskrivelsen er klar" : "Eksamensform: beskrivelse under udarbejdelse"}
                </span>
              </span>
            </motion.button>
          );
        })}

        <motion.button
          key="unknown"
          type="button"
          onClick={() => onChange(UNKNOWN_SCHOOL_ID)}
          aria-pressed={otherSelected}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full rounded-2xl border-2 border-dashed p-3.5 text-center text-sm font-semibold transition",
            otherSelected ? cn(theme.borderActive, "bg-white text-ink") : "border-ink/20 bg-transparent text-ink/55 hover:border-ink/35 hover:text-ink"
          )}
        >
          Min skole er ikke på listen (anden skole)
        </motion.button>
      </div>

      {otherSelected && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -6, height: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, height: "auto" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <InfoIcon className="h-4 w-4" /> Det her kan du se for dit spor ({theme.label})
            </p>
            <p className="mt-1 text-xs text-ink/55">
              Indtil din egen skole er kommet på listen, kan du bruge de eksamensformer, vi har beskrevet for {theme.label}. De er her:
            </p>
            <div className="mt-3 space-y-2">
              {otherFormats.map((f) => (
                <div key={f.id} className="rounded-xl bg-ink/[0.03] px-3 py-2.5">
                  <p className="text-xs font-bold text-ink">
                    {f.school} <span className={cn("ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide", theme.accentChip)}>{f.educationLabel}</span>
                    {f.status === "under-udarbejdelse" && (
                      <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">kommer snart</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink/60">{f.summary}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-ink/45">
              Din skoles form kan afvige ; tjek altid meldingen hos din AP-lærer. Vi tilføjer flere skoler løbende.
            </p>
          </div>
        </motion.div>
      )}

      <p className="flex items-start gap-1.5 px-1 text-[11px] leading-relaxed text-ink/45">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Vi bruger kun skolevalget til at vise den rigtige eksamensform. Det gemmes lokalt på din enhed : ingen data indsamles, ingen
          konto, ingen deling.
        </span>
      </p>
      <span className="sr-only">
        Tilgængelige skoler: {SCHOOLS.filter((s) => s.education === education).map((s) => s.name).join(", ")} Derudover kan man altid vælge valget Anden skole.
      </span>
    </div>
  );
}
