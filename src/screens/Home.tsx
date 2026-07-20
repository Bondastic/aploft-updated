import type { Progress } from "../types";
import Mascot from "../components/Mascot";
import { getLevelInfo } from "../lib/progress";
import { BoltIcon, ExamIcon, FlameIcon, PracticeIcon, SparklesIcon, SymbolsIcon, TrendUpIcon } from "../components/icons";

export default function HomePage({
  progress,
  onNavigate,
}: {
  progress: Progress;
  onNavigate: (page: "practice" | "exam" | "symbols" | "lynkursus" | "udvikling") => void;
}) {
  const level = getLevelInfo(progress.xp);
  const greeting = progress.nickname ? `Hej, ${progress.nickname}!` : "Hej med dig!";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple to-purple-dark p-6 text-white shadow-lg shadow-purple/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-extrabold">{greeting}</p>
            <p className="mt-1 text-sm text-white/80">Klar til at træne Almen Sprogforståelse i dag?</p>
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
          <span className="text-xs text-ink/50">Følg forløbene, kategori for kategori</span>
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
          <span className="text-xs text-ink/50">Genopfrisk det vigtigste, inkl. kasus-masterclass</span>
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
          Nyt: Forløb med lås op, sum-es-est og din udvikling
        </p>
        <p className="text-sm text-ink/60">
          Hver kategori under &quot;Øv dig&quot; er nu bygget som et forløb af navngivne trin, du låser op ét ad gangen — de mest
          grundlæggende emner som kasus står øverst. Latindelen har fået sit eget sum-es-est-forløb, og under &quot;Din
          udvikling&quot; kan du se dine resultater og få en estimeret standpunktskarakter.
        </p>
      </div>
    </div>
  );
}
