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
        className="flex w-full items-center justify-between gap-3 rounded-md border border-ink/10 bg-card p-4 text-left transition-colors hover:border-ink/25"
      >
        <span className="flex items-center gap-3">
          <span className="shrink-0 text-ink/60">
            {on ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </span>
          <span>
            <span className="block text-sm font-extrabold text-ink">Nattetilstand</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-ink/50">
              Øver du AP om aftenen? Slå nattetilstand til, så skærmen bliver skånsom for øjnene.
            </span>
          </span>
        </span>
        {/* Kontakten er én af de få bevidst runde former: den er en fysisk vippe */}
        <span
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            on ? "bg-purple" : "bg-ink/20"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform",
              on ? "translate-x-[1.625rem]" : "translate-x-0.5"
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
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {mounted && on ? <SunIcon className="h-4.5 w-4.5" /> : <MoonIcon className="h-4.5 w-4.5" />}
    </button>
  );
}
