import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { ExamIcon, HomeIcon, PracticeIcon, ProfileIcon, SymbolsIcon } from "./icons";

export type NavPage = "home" | "practice" | "exam" | "symbols" | "profile";

const ITEMS: { id: NavPage; label: string; tour: string; icon: (c?: string) => ReactNode }[] = [
  { id: "home", label: "Hjem", tour: "hjem", icon: (c) => <HomeIcon className={c} /> },
  { id: "practice", label: "Øv dig", tour: "ov-dig", icon: (c) => <PracticeIcon className={c} /> },
  { id: "exam", label: "Prøve", tour: "proeve", icon: (c) => <ExamIcon className={c} /> },
  { id: "symbols", label: "Symboler", tour: "symboler", icon: (c) => <SymbolsIcon className={c} /> },
  { id: "profile", label: "Profil", tour: "profil", icon: (c) => <ProfileIcon className={c} /> },
];

export default function BottomNav({ page, onNavigate }: { page: NavPage; onNavigate: (p: NavPage) => void }) {
  return (
    <nav
      className={cn(
        "fixed z-20 border-ink/10 bg-white/95 backdrop-blur-md dark:bg-[#171225]/90",
        "bottom-0 left-0 right-0 border-t",
        "lg:bottom-0 lg:top-0 lg:right-auto lg:w-56 lg:border-r lg:border-t-0 lg:pt-[4.25rem]"
      )}
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)] lg:max-w-none lg:flex-col lg:items-stretch lg:gap-1 lg:px-3 lg:py-4">
        {ITEMS.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              data-tour={item.tour}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
                "lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:py-2.5 lg:text-sm",
                active ? "text-purple lg:bg-purple/10" : "text-ink/40 hover:lg:bg-ink/5"
              )}
            >
              {item.icon(cn("h-5 w-5", active ? "text-purple" : "text-ink/40"))}
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
