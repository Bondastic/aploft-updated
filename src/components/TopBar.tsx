import { FlameIcon, SparklesIcon, CategoryIcon } from "./icons";
import DarkModeToggle from "./DarkModeToggle";
import type { Progress } from "../types";
import { getEducation } from "../lib/education";
import { cn } from "../utils/cn";

export default function TopBar({ progress }: { progress: Progress }) {
  const theme = getEducation(progress.education);
  const isHhx = progress.education === "hhx";
  return (
    <header className="sticky top-0 z-20 border-b border-ink/5 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-[#171225]/85">
      {/* Én lav række på alle skærme: logo + STX/HHX-mærke til venstre,
          streak/XP/mørk til højre. På telefoner er streak/XP-teksterne
          ("dages streak"/"XP") skjult, så der er plads til mærket, og
          mærke-ikonet skjules, så rækken aldrig bliver høj eller bred. */}
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banner.png" alt="AP Klar" className="h-9 w-auto object-contain sm:h-10" />
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[10px] font-bold sm:px-2 sm:text-[11px]",
              theme.accentChip,
              theme.darkChip
            )}
            title={`Du øver ${isHhx ? "HHX" : "STX"}-pensum. Skift under Profil → Indstillinger`}
          >
            <CategoryIcon name={isHhx ? "hhx" : "stx"} className="hidden h-3 w-3 sm:block" />
            {isHhx ? "HHX" : "STX"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-1.5 text-xs font-bold text-amber-700 sm:px-3 dark:bg-amber-500/15 dark:text-amber-300"
            title="Din nuværende streak: antal dage i træk du har øvet dig"
          >
            <FlameIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {progress.streakDays}{" "}
              <span className="hidden font-semibold opacity-80 sm:inline">dages streak</span>
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full bg-purple/10 px-2 py-1.5 text-xs font-bold text-purple sm:px-3"
            title="Din samlede erfaring (XP), som du optjener ved at svare på opgaver"
          >
            <SparklesIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {progress.xp} <span className="hidden font-semibold opacity-80 sm:inline">XP</span>
            </span>
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
