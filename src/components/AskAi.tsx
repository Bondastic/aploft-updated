"use client";

import { useState } from "react";
import type { Task } from "../types";
import { SparklesIcon, XIcon } from "./icons";

// "Spørg AI"-knap: åbner et Copilot-link med det aktuelle spørgsmål, så man
// kan få en intuitiv forklaring. Første gang bekræfter brugeren i en lille
// dialog (med mulighed for "Vis ikke igen", gemt i localStorage).
// Valget er Microsoft Copilot (gratis uden login) - ikke ChatGPT.
const CONSENT_KEY = "aploft.askAi.consent";

/** Finder den tekst, der beskriver det aktuelle spørgsmål. */
function questionText(task: Task): string {
  switch (task.type) {
    case "choice":
      return task.prompt;
    case "click-word":
      return `${task.instruction} (${task.sentence})`;
    case "analysis":
      return `${task.instruction} (${task.sentence})`;
    case "build-sentence":
      return task.instruction;
    case "write":
      return `${task.instruction} ${task.prompt}`.trim();
    case "table-fill":
      return task.instruction;
    case "teach":
      return task.title;
    case "info":
      return task.title;
  }
}

/** Bygger copilot.microsoft.com/?q=...-linket med en rammesættende, dansk besked. */
export function buildAskAiHref(task: Task): string {
  const q = questionText(task);
  const prompt =
    `Jeg er en dansk gymnasieelev, der lærer Almen Sprogforståelse (AP) på gymnasiet. ` +
    `Forklar venligst på en intuitiv, venlig og letforståelig måde, som en god lærer ville gøre: ${q}`;
  return `https://copilot.microsoft.com/?q=${encodeURIComponent(prompt)}`;
}

function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

export default function AskAiButton({ task }: { task: Task }) {
  const [consented] = useState<boolean>(hasConsent);
  const [open, setOpen] = useState(false);
  const [dontAsk, setDontAsk] = useState(false);
  const href = buildAskAiHref(task);

  // Har brugeren allerede sagt "vis ikke igen", er knappen et helt almindeligt
  // link til Copilot i en ny fane.
  if (consented) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline px-3 py-1.5 text-xs"
      >
        <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Spørg AI
      </a>
    );
  }

  function confirm() {
    if (dontAsk) {
      try {
        localStorage.setItem(CONSENT_KEY, "1");
      } catch {
        // ignore
      }
    }
    setOpen(false);
    window.open(href, "_blank", "noopener");
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-outline px-3 py-1.5 text-xs">
        <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Spørg AI
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Åbn Copilot"
          onClick={() => setOpen(false)}
        >
          <div className="modal w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 flex items-start justify-between gap-3">
              <h3 className="section-title">Spørg Copilot om hjælp?</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Luk"
                className="rounded-sm p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-ink/60">
              Denne knap tager dig til <span className="font-semibold text-ink">Microsoft Copilot</span>, hvor du kan få en
              intuitiv og letforståelig forklaring af spørgsmålet. Du åbner siden i en ny fane.
            </p>
            <p className="mt-2 border-l-2 border-ink/15 pl-3 text-xs italic text-ink/50">&quot;{questionText(task)}&quot;</p>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={dontAsk}
                onChange={(e) => setDontAsk(e.target.checked)}
                className="h-4 w-4 accent-purple"
              />
              Vis ikke igen
            </label>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setOpen(false)} className="btn btn-outline flex-1">
                Luk
              </button>
              <button onClick={confirm} className="btn btn-primary flex-1">
                <SparklesIcon className="h-4 w-4" aria-hidden="true" />
                Gå til Copilot
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
