"use client";

import { cn } from "../utils/cn";
import { ChevronRightIcon } from "./icons";

/** Tilbage/frem i et opgavesæt. Frem er kun aktiv op til det spørgsmål, man er nået til. */
export default function SessionNav({
  canBack,
  canForward,
  onBack,
  onForward,
}: {
  canBack: boolean;
  canForward: boolean;
  onBack: () => void;
  onForward: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onBack}
        disabled={!canBack}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition",
          canBack
            ? "border-ink/15 text-ink hover:border-ink/30"
            : "cursor-not-allowed border-ink/10 text-ink/30"
        )}
      >
        <ChevronRightIcon className="h-3.5 w-3.5 rotate-180" />
        Forrige svar
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={!canForward}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition",
          canForward
            ? "border-ink/15 text-ink hover:border-ink/30"
            : "cursor-not-allowed border-ink/10 text-ink/30"
        )}
      >
        Næste svar
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
