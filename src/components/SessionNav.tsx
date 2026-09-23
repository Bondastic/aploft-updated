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
        className={cn("btn btn-outline px-3 py-1.5 text-xs", !canBack && "cursor-not-allowed opacity-40")}
      >
        <ChevronRightIcon className="h-3.5 w-3.5 rotate-180" />
        Forrige svar
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={!canForward}
        className={cn("btn btn-outline px-3 py-1.5 text-xs", !canForward && "cursor-not-allowed opacity-40")}
      >
        Næste svar
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
