import type { Progress } from "../types";
import Link from "next/link";
import Mascot from "../components/Mascot";
import { getLevelInfo } from "../lib/progress";
import { ArrowUpRightIcon, BoltIcon, ExamIcon, FlameIcon, InfoIcon, InstagramIcon, PracticeIcon, SparklesIcon, SymbolsIcon, TrendUpIcon } from "../components/icons";
import { cn } from "../utils/cn";

const INSTAGRAM_URL = "https://www.instagram.com/lindouweb?igsi=amN6MHJ3cHd3aHVs&utm_source=qr";

export default function HomePage({
  progress,
  onNavigate,
}: {
  progress: Progress;
  onNavigate: (page: "practice" | "exam" | "symbols" | "lynkursus" | "udvikling") => void;
}) {
  const level = getLevelInfo(progress.xp);
  const greeting = progress.nickname ? `Hej, ${progress.nickname}!` : "Hej med dig!";
  const isHhx = progress.education === "hhx";

  return (
    <div className="app-page space-y-6">
      <div className={cn("overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg lg:p-8", isHhx ? "from-blue-500 to-indigo-600 shadow-blue-500/30" : "from-purple to-purple-dark shadow-purple/30")}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-extrabold lg:text-3xl">{greeting}</p>
            <p className="mt-1 text-sm text-white/80">
              {isHhx ? "Klar til at træne HHX Almen Sprogforståelse i dag?" : "Klar til at træne STX Almen Sprogforståelse i dag?"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-semibold">
                <FlameIcon className="h-4 w-4" /> {progress.streakDays} dages streak
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-semibold">
                <SparklesIcon className="h-4 w-4" /> {progress.xp} XP
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 font-semibold">Niveau {level.level}</span>
            </div>
          </div>
          <Mascot pose="welcome" size="lg" speech={null} reduceMotion={progress.settings.reduceMotion} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          onClick={() => onNavigate("practice")}
          className="flex flex-col items-start gap-2 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple">
            <PracticeIcon className="h-5 w-5" />
          </span>
          <span className="font-bold text-ink">Øv dig</span>
          <span className="text-xs text-ink/50">Fra bunden: hvert forløb underviser dig, før du bliver spurgt</span>
        </button>

        <button
          onClick={() => onNavigate("exam")}
          className="flex flex-col items-start gap-2 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <ExamIcon className="h-5 w-5" />
          </span>
          <span className="font-bold text-ink">Tag en prøve</span>
          <span className="text-xs text-ink/50">Vælg selv længde og spor, inkl. den ultimative test</span>
        </button>

        <button
          data-tour="hjem-lynkursus"
          onClick={() => onNavigate("lynkursus")}
          className="flex flex-col items-start gap-2 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <BoltIcon className="h-5 w-5" />
          </span>
          <span className="font-bold text-ink">Lynkursus</span>
          <span className="text-xs text-ink/50">Opslagsværk til genopfriskning, ikke et krav for at starte</span>
        </button>

        <button
          onClick={() => onNavigate("symbols")}
          className="flex flex-col items-start gap-2 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <SymbolsIcon className="h-5 w-5" />
          </span>
          <span className="font-bold text-ink">Symboler</span>
          <span className="text-xs text-ink/50">Alle sætningsled-symbolerne</span>
        </button>

        <button
          data-tour="hjem-udvikling"
          onClick={() => onNavigate("udvikling")}
          className="col-span-2 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple lg:col-span-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <TrendUpIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-ink">Din udvikling</span>
            <span className="block text-xs text-ink/50">Se dine stats pr. kategori og få en standpunktskarakter af Lingua</span>
          </span>
        </button>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-bold text-ink">
            <InfoIcon className="h-4 w-4 text-purple" />
            Om AP Klar
          </p>
          <Link
            href="/om"
            className="inline-flex items-center gap-1 rounded-full bg-purple/10 px-3 py-1.5 text-xs font-bold text-purple transition hover:bg-purple/20"
          >
            Læs mere
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="text-sm text-ink/60">
          AP Klar er lavet af gymnasieelever til gymnasieelever: en gratis øvelsesapp til Almen Sprogforståelse på STX og
          HHX. Hvert forløb starter med en rolig introduktion, før du bliver spurgt, så du kan lære uden at kunne noget i
          forvejen.
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-600 transition hover:text-fuchsia-700 dark:text-fuchsia-400"
        >
          <InstagramIcon className="h-4 w-4" />
          Følg os på Instagram
          <ArrowUpRightIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
