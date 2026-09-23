import { FlameIcon, SparklesIcon, CategoryIcon } from "./icons";
import DarkModeToggle from "./DarkModeToggle";
import type { Progress } from "../types";
import { getEducation } from "../lib/education";
import { cn } from "../utils/cn";

export default function TopBar({ progress }: { progress: Progress }) {
  const theme = getEducation(progress.education);
  const isHhx = progress.education === "hhx";
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-card/90 backdrop-blur-md">
      {/* Én lav række på alle skærme: logo + STX/HHX-mærke til venstre,
          streak/XP/mørk til højre. På telefoner er streak/XP-teksterne
          (\"dages streak\"/\"XP\") skjult, så der er plads til mærket, og
          mærke-ikonet skjules, så rækken aldrig bliver høj eller bred. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 lg:pl-60">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banner.webp" alt="AP Klar" className="h-9 w-auto object-contain sm:h-10" />
          <span
            className={cn("chip", theme.accentChip)}
            title={`Du øver ${isHhx ? "HHX" : "STX"}-pensum. Skift under Profil → Indstillinger`}
          >
            <CategoryIcon name={isHhx ? "hhx" : "stx"} className="h-3 w-3 shrink-0" />
            {isHhx ? "HHX" : "STX"}
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className="flex items-center gap-1.5 text-xs font-bold tabular-nums text-ink/70"
            title="Din nuværende streak: antal dage i træk du har øvet dig"
          >
            <FlameIcon className="h-3.5 w-3.5 shrink-0 text-ochre-base" aria-hidden="true" />
            {progress.streakDays}
            <span className="hidden font-semibold text-ink/45 sm:inline">dages streak</span>
          </span>
          <span className="h-3 w-px bg-ink/15" aria-hidden="true" />
          <span
            className="flex items-center gap-1.5 text-xs font-bold tabular-nums text-ink/70"
            title="Din samlede erfaring (XP), som du optjener ved at svare på opgaver"
          >
            <SparklesIcon className="h-3.5 w-3.5 shrink-0 text-ink/45" aria-hidden="true" />
            {progress.xp}
            <span className="hidden font-semibold text-ink/45 sm:inline">XP</span>
          </span>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
