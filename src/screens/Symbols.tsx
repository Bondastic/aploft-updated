import { SYMBOLS } from "../data/symbols";
import { LedGlyph } from "../components/icons";
import type { Progress } from "../types";
import { cn } from "../utils/cn";

export default function SymbolsPage({ progress }: { progress: Progress }) {
  return (
    <div className="app-page space-y-8">
      {/* Redaktionel sidehoved: eyebrow + stor titel + hårfint overstreg */}
      <header>
        <p className="eyebrow">Reference</p>
        <h1 className="page-title mt-1">Sætningsled-symboler</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
          Alle 7 officielle symboler til at analysere sætningsled. De latinske navne (subjekt, verballed, direkte og
          indirekte objekt) er dem, du bruger til eksamen; de danske står i parentes som hjælp.
        </p>
      </header>

      {/* Ordbogs-agtigt opslag: tegn i skarp ramme til venstre, definition til
          højre — adskilt af hårfine linjer, ikke af farvede kort-bokse */}
      <dl className="border-t border-ink/15">
        {SYMBOLS.map((s) => (
          <div key={s.symbol} className="flex gap-4 border-b border-ink/10 py-4 sm:gap-6">
            <dt className="shrink-0">
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-md border", s.colorClasses)}>
                <LedGlyph symbol={s.symbol} className="h-6 w-6" />
              </span>
            </dt>
            <dd className="min-w-0 flex-1">
              <p className="text-[15px] font-extrabold tracking-tight text-ink">{s.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{s.description}</p>
              <p className="mt-2 border-l-2 border-ink/15 pl-3 text-sm italic text-ink/50">Eksempel: &quot;{s.example}&quot;</p>
            </dd>
          </div>
        ))}
      </dl>

      <section className="border-t border-ink/15 pt-5">
        <p className="section-title mb-2">Sådan bruger du symbolerne</p>
        <p className="max-w-2xl text-sm leading-relaxed text-ink/60">
          I opgaverne under &quot;Sætningsled&quot; skal du klikke på hvert stykke af sætningen og vælge det symbol, der passer til leddets
          funktion. Start altid med at finde verballeddet (○). Det gør det nemmere at finde de andre led ud fra spørgsmålene
          hvem/hvad, til/for hvem og hvordan/hvornår/hvor.
        </p>
      </section>
    </div>
  );
}
