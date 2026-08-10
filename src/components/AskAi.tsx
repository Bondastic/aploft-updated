"use client";

import { useState } from "react";
import type { Task } from "../types";
import { SparklesIcon, XIcon } from "./icons";

// "Spørg AI"-knap: åbner et ChatGPT-link med det aktuelle spørgsmål, så man
// kan få en intuitiv forklaring. Første gang bekræfter brugeren i en lille
// dialog (med mulighed for "Vis ikke igen", gemt i localStorage).
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

/** Bygger chatgpt.com/?q=...-linket med en rammesættende, dansk besked. */
export function buildAskAiHref(task: Task): string {
  const q = questionText(task);
  const prompt =
    `Jeg er en dansk gymnasieelev, der lærer Almen Sprogforståelse (AP) på gymnasiet. ` +
    `Forklar venligst på en intuitiv, venlig og letforståelig måde, som en god lærer ville gøre: ${q}`;
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
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
  // link til ChatGPT i en ny fane.
  if (consented) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-purple/25 bg-purple/5 px-3.5 py-1.5 text-xs font-bold text-purple transition hover:bg-purple/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
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
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-purple/25 bg-purple/5 px-3.5 py-1.5 text-xs font-bold text-purple transition hover:bg-purple/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
      >
        <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Spørg AI
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Åbn ChatGPT"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-extrabold text-ink">Spørg AI om hjælp?</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Luk"
                className="rounded-full p-1 text-ink/40 transition hover:bg-ink/5 hover:text-ink"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-ink/60">
              Denne knap tager dig til <span className="font-semibold text-ink">chatgpt.com</span>, hvor du kan få en
              intuitiv og letforståelig forklaring af spørgsmålet. Du åbner siden i en ny fane.
            </p>
            <p className="mt-2 rounded-xl bg-purple/5 px-3 py-2 text-xs italic text-ink/50">
              &quot;{questionText(task)}&quot;
            </p>
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
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border-2 border-ink/15 py-2.5 text-sm font-semibold text-ink/60 transition hover:border-ink/30 hover:text-ink"
              >
                Luk
              </button>
              <button
                onClick={confirm}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-purple to-purple-dark py-2.5 text-sm font-bold text-white shadow-md shadow-purple/30"
              >
                <SparklesIcon className="h-4 w-4" aria-hidden="true" />
                Gå til ChatGPT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
