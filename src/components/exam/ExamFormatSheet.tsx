"use client";

// "Eksamensform"-arket: den SKOLEspecifikke beskrivelse af, hvordan
// AP-eksamen foregår. Eleven ser KUN guiden for sit eget spor:
//  • valgt kendt skole → den skoles form,
//  • "anden skole" / intet valg → listen over de former, vi har for sporet
//    (lige nu kun Én pr. spor), med tydelig note om at former kan variere.
// Senere udvides SCHOOLS/EXAM_FORMATS bare - arket skal ikke omskrives.

import { useEffect } from "react";
import type { Education } from "../../types";
import {
  EXAM_FORMAT_INTRO,
  EXAM_FORMAT_OTHER_NOTE,
  formatForSchoolId,
  formatsForEducation,
  type SchoolExamFormat,
} from "../../data/hhx/examFormats";
import { getSchool } from "../../data/schools";
import { getEducation } from "../../lib/education";
import { cn } from "../../utils/cn";
import { CategoryIcon, XIcon } from "../icons";

export default function ExamFormatSheet({
  education,
  schoolId,
  onClose,
}: {
  education: Education;
  schoolId?: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const school = getSchool(schoolId);
  const ownFormat = school ? formatForSchoolId(school.formatId) : null;
  const formats = ownFormat ? [ownFormat] : formatsForEducation(education);
  const theme = getEducation(education);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#171225]/70 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Eksamensform"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#faf8ff] p-5 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-extrabold text-ink">
              {school ? `Eksamensformen på ${school.name}` : `Sådan foregår AP-eksamen på ${theme.label}`}
            </h2>
            <p className="mt-1 text-sm text-ink/60">{EXAM_FORMAT_INTRO}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Luk"
            className="rounded-full p-1.5 text-ink/40 transition hover:bg-ink/5 hover:text-ink"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {formats.map((f) => (
            <FormatCard key={f.id} format={f} />
          ))}
        </div>

        {!ownFormat && (
          <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            {EXAM_FORMAT_OTHER_NOTE}
          </p>
        )}

        <p className="mt-3 text-center text-[11px] text-ink/40">
          Du kan altid skifte skole under Profil → Indstillinger. Valget gemmes kun på din enhed.
        </p>
      </div>
    </div>
  );
}

function FormatCard({ format }: { format: SchoolExamFormat }) {
  const theme = getEducation(format.education);
  return (
    <div className={cn("rounded-2xl border-2 bg-white p-4 shadow-sm", theme.borderActive)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", theme.softBg)}>
          <CategoryIcon name={format.education} className="h-5 w-5" />
        </span>
        <p className="font-bold text-ink">{format.school}</p>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide", theme.accentChip)}>{format.educationLabel}</span>
        {format.status === "under-udarbejdelse" && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">kommer snart</span>
        )}
      </div>

      <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wide text-ink/40">{format.headline}</p>
      <p className="mt-1 text-sm text-ink/70">{format.summary}</p>

      <dl className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {format.facts.map((f) => (
          <div key={f.label} className="rounded-xl bg-ink/[0.03] px-3 py-2">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-ink/40">{f.label}</dt>
            <dd className="text-xs text-ink/70">{f.value}</dd>
          </div>
        ))}
      </dl>

      {format.sections.map((sec) => (
        <div key={sec.heading} className="mt-3">
          <p className={cn("text-sm font-bold", theme.accentText)}>{sec.heading}</p>
          <p className="mt-0.5 text-sm text-ink/70">{sec.body}</p>
        </div>
      ))}

      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">{format.note}</p>
    </div>
  );
}
