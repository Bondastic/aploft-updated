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
      {/* flex-wrap: på smalle skærme wrapper STX/HHX-mærket ned på sin egen
          række under logoet i stedet for at kollidere med streak/XP. */}
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-2 gap-y-1.5 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banner.png" alt="AP Klar" className="h-10 w-auto object-contain" />
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold",
              "w-full sm:w-auto",
              theme.accentChip,
              theme.darkChip
            )}
            title={`Du øver ${isHhx ? "HHX" : "STX"}-pensum. Skift under Profil → Indstillinger`}
          >
            <CategoryIcon name={isHhx ? "hhx" : "stx"} className="h-3 w-3" />
            {isHhx ? "HHX" : "STX"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
            title="Din nuværende streak: antal dage i træk du har øvet dig"
          >
            <FlameIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {progress.streakDays}{" "}
              <span className="hidden font-semibold opacity-80 sm:inline">dages streak</span>
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full bg-purple/10 px-3 py-1.5 text-xs font-bold text-purple"
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
