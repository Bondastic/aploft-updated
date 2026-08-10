import type { Progress } from "../types";
import Mascot from "../components/Mascot";
import { getLevelInfo } from "../lib/progress";
import { getEducation } from "../lib/education";
import { BoltIcon, ExamIcon, FlameIcon, PracticeIcon, SparklesIcon, SymbolsIcon, TrendUpIcon, CategoryIcon } from "../components/icons";
import { cn } from "../utils/cn";

export default function HomePage({
  progress,
  onNavigate,
}: {
  progress: Progress;
  onNavigate: (page: "practice" | "exam" | "symbols" | "lynkursus" | "udvikling") => void;
}) {
  const level = getLevelInfo(progress.xp);
  const greeting = progress.nickname ? `Hej, ${progress.nickname}!` : "Hej med dig!";
  const theme = getEducation(progress.education);
  const isHhx = progress.education === "hhx";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
      <div className={cn("overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg", isHhx ? "from-blue-500 to-indigo-600 shadow-blue-500/30" : "from-purple to-purple-dark shadow-purple/30")}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-extrabold">{greeting}</p>
            <p className="mt-1 text-sm text-white/80">
              {isHhx ? "Klar til at træne HHX Almen Sprogforståelse i dag?" : "Klar til at træne STX Almen Sprogforståelse i dag?"}
            </p>
            <span className={cn("mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold")}>
              <CategoryIcon name={isHhx ? "hhx" : "stx"} className="h-3.5 w-3.5" />
              {theme.label} · {theme.shortName}
            </span>
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

      <div className="grid grid-cols-2 gap-3">
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
          onClick={() => onNavigate("lynkursus")}
          className="flex flex-col items-start gap-2 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <BoltIcon className="h-5 w-5" />
          </span>
          <span className="font-bold text-ink">Lynkursus</span>
          <span className="text-xs text-ink/50">Opslagsværk til genopfriskning — ikke et krav for at starte</span>
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
          onClick={() => onNavigate("udvikling")}
          className="col-span-2 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
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
        <p className="mb-3 flex items-center gap-2 font-bold text-ink">
          <SparklesIcon className="h-4 w-4 text-purple" />
          Nyt: APklar underviser dig nu fra bunden
        </p>
        <p className="text-sm text-ink/60">
          Hvert forløb under &quot;Øv dig&quot; starter med en kort, rolig introduktion, der forklarer emnet fra nul — du behøver
          ikke kunne noget i forvejen. Første gang du tager et forløb, kommer opgaverne i en fast, gennemtænkt rækkefølge; når
          du har bestået, kan du træne igen med tilfældige spørgsmål. &quot;Tag en prøve&quot; er stadig altid tilfældig, ligesom en
          rigtig eksamen.
        </p>
      </div>
    </div>
  );
}
