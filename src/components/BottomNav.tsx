import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { ExamIcon, HomeIcon, PracticeIcon, ProfileIcon, SymbolsIcon } from "./icons";

export type NavPage = "home" | "practice" | "exam" | "symbols" | "profile";

const ITEMS: { id: NavPage; label: string; icon: (c?: string) => ReactNode }[] = [
  { id: "home", label: "Hjem", icon: (c) => <HomeIcon className={c} /> },
  { id: "practice", label: "Øv dig", icon: (c) => <PracticeIcon className={c} /> },
  { id: "exam", label: "Prøve", icon: (c) => <ExamIcon className={c} /> },
  { id: "symbols", label: "Symboler", icon: (c) => <SymbolsIcon className={c} /> },
  { id: "profile", label: "Profil", icon: (c) => <ProfileIcon className={c} /> },
];

export default function BottomNav({ page, onNavigate }: { page: NavPage; onNavigate: (p: NavPage) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-ink/10 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-stretch justify-between px-2">
        {ITEMS.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
                active ? "text-purple" : "text-ink/40"
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
