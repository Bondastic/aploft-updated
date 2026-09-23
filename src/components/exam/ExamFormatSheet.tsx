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
import { SCHOOL_EXAM_LABELS, getSchool } from "../../data/schools";
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Eksamensform"
      onClick={onClose}
    >
      <div
        className="modal max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-b-none p-5 sm:rounded-b-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Eksamensform</p>
            <h2 className="page-title mt-1">
              {school ? school.name : `${theme.label}-sporet`}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{EXAM_FORMAT_INTRO}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Luk"
            className="rounded-sm p-1.5 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {formats.map((f) => (
            <FormatCard key={f.id} format={f} />
          ))}
        </div>

        {/* Prøverne er skoleopdelte: sig tydeligt, om skolens egen
            eksamensprøve findes i appen. */}
        {school && (
          <p className="mt-3 border-l-2 border-ink/15 py-1 pl-3 text-xs leading-relaxed text-ink/60">
            {school.exams.length > 0 ? (
              <>
                <span className="font-bold text-ink">Prøver for {school.name}: </span>
                {school.exams.map((ex) => SCHOOL_EXAM_LABELS[ex].title).join(" · ")} : den finder du under fanen Prøve.
              </>
            ) : (
              <>
                <span className="font-bold text-ink">Prøver for {school.name}: </span>
                vi har endnu ikke bygget en eksamens-simulering til jeres form, så brug prøvegeneratoren under fanen Prøve. Den træner de samme
                fagbegreber.
              </>
            )}
          </p>
        )}

        {!ownFormat && (
          <p className="mt-4 rounded-md bg-ochre-soft px-4 py-3 text-xs leading-relaxed text-ochre-base">{EXAM_FORMAT_OTHER_NOTE}</p>
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
    <div className={cn("card border-l-4 p-4", theme.borderActive)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("shrink-0", theme.softBg)}>
          <CategoryIcon name={format.education} className="h-5 w-5" />
        </span>
        <p className="font-bold text-ink">{format.school}</p>
        <span className={cn("chip", theme.accentChip)}>{format.educationLabel}</span>
        {format.status === "under-udarbejdelse" && <span className="chip bg-ochre-soft text-ochre-base">kommer snart</span>}
      </div>

      <p className="mt-2 text-[11px] font-extrabold uppercase tracking-widest text-ink/45">{format.headline}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink/70">{format.summary}</p>

      <dl className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {format.facts.map((f) => (
          <div key={f.label} className="rounded-md bg-ink/[0.04] px-3 py-2">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-ink/45">{f.label}</dt>
            <dd className="text-xs text-ink/70">{f.value}</dd>
          </div>
        ))}
      </dl>

      {format.sections.map((sec) => (
        <div key={sec.heading} className="mt-3">
          <p className={cn("text-sm font-bold", theme.accentText)}>{sec.heading}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-ink/70">{sec.body}</p>
        </div>
      ))}

      <p className="mt-3 rounded-md bg-ochre-soft px-3 py-2 text-[11px] leading-relaxed text-ochre-base">{format.note}</p>
    </div>
  );
}
