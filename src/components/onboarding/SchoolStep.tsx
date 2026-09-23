"use client";

// Fælles skolevalg-trin: bruges i velkomstflowet (Welcome), i "nyt
// opdaterings-skærmen" for eksisterende brugere (SchoolGate) og i Profil →
// Indstillinger. Kender eleven ikke sin skole på listen, vælges "Anden
// skole" - så vises listen over de eksamensformer, vi HAR for sporet, så
// eleven ved, hvad der gælder indtil videre.
//
// Skolerne er også delt op efter, hvilke PRØVER de kan tage: hvert skolekort
// viser, om skolens egen eksamensprøve findes i appen, og "anden skole"
// fortæller tydeligt, at eksamensprøven ikke kan tages (men at
// prøvegeneratoren altid kan).
//
// Databeskyttelse: valget gemmes udelukkende i appens lokale progress
// (localStorage på enheden). Der indsamles, sendes eller logges intet.

import { useState } from "react";
import { motion } from "framer-motion";
import type { Education } from "../../types";
import { SCHOOLS, SCHOOL_EXAM_LABELS, UNKNOWN_SCHOOL_ID, schoolsFor } from "../../data/schools";
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
        {schools.map((school) => {
          const fmt = formatForSchoolId(school.formatId);
          const active = value === school.id;
          return (
            <button
              key={school.id}
              type="button"
              onClick={() => onChange(school.id)}
              aria-pressed={active}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-lg border bg-card p-4 text-left transition-colors",
                active
                  ? cn(theme.borderActive, "border-l-4", education === "stx" ? "bg-stx-soft" : "bg-hhx-soft")
                  : "border-ink/12 hover:border-ink/30"
              )}
            >
              {/* Kvadratisk markering i stedet for farvet ikonboks */}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border",
                  active ? cn(theme.borderActive, theme.solidBg, "border text-white") : "border-ink/25"
                )}
              >
                {active && <CheckIcon className="h-3.5 w-3.5" />}
              </span>
              <span className="flex-1">
                <span className="block font-bold text-ink">{school.name}</span>
                <span className="block text-xs text-ink/50">
                  {school.city ? `${school.city} · ` : ""}
                  {fmt?.status === "klar" ? "Eksamensform: beskrivelsen er klar" : "Eksamensform: beskrivelse under udarbejdelse"}
                </span>
                <span className="mt-1.5 flex flex-wrap gap-1">
                  {school.exams.length > 0 ? (
                    school.exams.map((ex) => (
                      <span key={ex} className={cn("chip", theme.accentChip)}>
                        {SCHOOL_EXAM_LABELS[ex].short} findes i appen
                      </span>
                    ))
                  ) : (
                    <span className="chip bg-ink/[0.06] text-ink/50">Ingen eksamensprøve endnu : kun prøvegeneratoren</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onChange(UNKNOWN_SCHOOL_ID)}
          aria-pressed={otherSelected}
          className={cn(
            "w-full rounded-md border border-dashed p-3.5 text-center text-sm font-semibold transition-colors",
            otherSelected ? cn(theme.borderActive, "bg-card text-ink") : "border-ink/25 bg-transparent text-ink/55 hover:border-ink/40 hover:text-ink"
          )}
        >
          Min skole er ikke på listen (anden skole)
        </button>
      </div>

      {otherSelected && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -6, height: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, height: "auto" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="card p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <InfoIcon className="h-4 w-4" /> Det her kan du se for dit spor ({theme.label})
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink/55">
              Indtil din egen skole er kommet på listen, kan du bruge de eksamensformer, vi har beskrevet for {theme.label}. De er her:
            </p>
            <div className="mt-3 space-y-2">
              {otherFormats.map((f) => (
                <div key={f.id} className="rounded-md bg-ink/[0.04] px-3 py-2.5">
                  <p className="text-xs font-bold text-ink">
                    {f.school}{" "}
                    <span className={cn("chip ml-1 align-middle", theme.accentChip)}>{f.educationLabel}</span>
                    {f.status === "under-udarbejdelse" && (
                      <span className="chip ml-1 align-middle bg-ochre-soft text-ochre-base">kommer snart</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink/60">{f.summary}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-ink/45">
              Din skoles form kan afvige ; tjek altid meldingen hos din AP-lærer. Vi tilføjer flere skoler løbende.
            </p>
            <p className="mt-1.5 rounded-md bg-ochre-soft px-3 py-2 text-[11px] leading-relaxed text-ochre-base">
              Bemærk: eksamensprøven i Prøve-fanen simulerer én bestemt skoles eksamensark, og den kan derfor ikke tages, når du har valgt
              &quot;anden skole&quot;. Prøvegeneratoren og alle øvelser virker som normalt : de træner de samme fagbegreber.
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
