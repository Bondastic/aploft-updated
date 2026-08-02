"use client";

import { useEffect, useState } from "react";
import { isDarkModeOn, setDarkMode } from "../utils/darkMode";
import { MoonIcon, SunIcon } from "./icons";
import { cn } from "../utils/cn";

/**
 * Nattetilstand-kontakt. Findes både i topbaren (altid synlig, nem at finde)
 * og i profil-/indstillingssiden. Begge steder styrer den samme globale
 * tilstand (klasse på <html> + localStorage), så de altid er i sync.
 */
export default function DarkModeToggle({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOn(isDarkModeOn());
    setMounted(true);
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    setDarkMode(next);
  }

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        aria-pressed={on}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-ink/10 bg-white p-4 text-left transition hover:border-purple/30 dark:bg-white/5"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            {on ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </span>
          <span>
            <span className="block font-bold text-ink">Nattetilstand</span>
            <span className="block text-xs text-ink/50">Øver du AP om aftenen? Slå nattetilstand til, så skærmen bliver skånsom for øjnene.</span>
          </span>
        </span>
        <span
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
            on ? "bg-purple" : "bg-ink/15"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform",
              on ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={mounted && on ? "Slå nattetilstand fra" : "Slå nattetilstand til"}
      title={mounted && on ? "Slå nattetilstand fra" : "Slå nattetilstand til"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink/70 transition hover:bg-purple/10 hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-white/10 dark:text-ink"
    >
      {mounted && on ? <SunIcon className="h-4.5 w-4.5" /> : <MoonIcon className="h-4.5 w-4.5" />}
    </button>
  );
}
