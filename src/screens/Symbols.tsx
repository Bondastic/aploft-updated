import { SYMBOLS } from "../data/symbols";
import Mascot from "../components/Mascot";
import { LedGlyph } from "../components/icons";
import type { Progress } from "../types";

export default function SymbolsPage({ progress }: { progress: Progress }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Sætningsled-symboler</h1>
        <p className="text-sm text-ink/50">Alle 7 officielle symboler til at analysere sætningsled. Brug dem, når du løser analyse-opgaver.</p>
      </div>

      <Mascot pose="explain" size="md" speech="Nu er alle 7 symboler med: hensynsled og begge omsagnsled." reduceMotion={progress.settings.reduceMotion} />

      <div className="grid gap-3 sm:grid-cols-2">
        {SYMBOLS.map((s) => (
          <div key={s.symbol} className={`rounded-2xl border-2 p-4 shadow-sm ${s.colorClasses}`}>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70">
                <LedGlyph symbol={s.symbol} className="h-7 w-7" />
              </span>
              <div>
                <p className="font-bold">{s.name}</p>
                <p className="text-xs opacity-70">{s.short}</p>
              </div>
            </div>
            <p className="text-sm">{s.description}</p>
            <p className="mt-2 rounded-lg bg-white/60 px-3 py-1.5 text-xs italic">Eksempel: &quot;{s.example}&quot;</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 text-sm text-ink/60 shadow-sm">
        <p className="mb-1 font-bold text-ink">Sådan bruger du symbolerne</p>
        <p>
          I opgaverne under &quot;Sætningsled&quot; skal du klikke på hvert stykke af sætningen og vælge det symbol, der passer til leddets
          funktion. Start altid med at finde udsagnsleddet (○). Det gør det nemmere at finde de andre led ud fra spørgsmålene
          hvem/hvad, til/for hvem og hvordan/hvornår/hvor.
        </p>
      </div>
    </div>
  );
}
