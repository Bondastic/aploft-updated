import type { ReactNode } from "react";
import type { Progress } from "../types";
import Link from "next/link";
import { getLevelInfo } from "../lib/progress";
import { ArrowUpRightIcon, BoltIcon, ExamIcon, FlameIcon, InfoIcon, InstagramIcon, PracticeIcon, SparklesIcon, SymbolsIcon, TrendUpIcon } from "../components/icons";
import { cn } from "../utils/cn";

const INSTAGRAM_URL = "https://www.instagram.com/lindouweb?igsi=amN6MHJ3cHd3aHVs&utm_source=qr";

// Hjem: redaktionel opsætning med tydelig asymmetri — hero som typografisk
// blok med accent-bjælke i uddannelsens farve, genveje som nummereret
// indeks (01-05) med hårfine skillelinjer og sidetekst som en fodnote.
// Ingen kort-gitter-kopi, ingen gradienter og ingen farvede ikonbokse.
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

  const shortcuts: {
    id: "practice" | "exam" | "lynkursus" | "symbols" | "udvikling";
    tour?: string;
    title: string;
    desc: string;
    icon: ReactNode;
  }[] = [
    {
      id: "practice",
      title: "Øv dig",
      desc: "Fra bunden: hvert forløb underviser dig, før du bliver spurgt",
      icon: <PracticeIcon className="h-5 w-5" />,
    },
    {
      id: "exam",
      title: "Tag en prøve",
      desc: "Vælg selv længde og spor, inkl. den ultimative test",
      icon: <ExamIcon className="h-5 w-5" />,
    },
    {
      id: "lynkursus",
      tour: "hjem-lynkursus",
      title: "Lynkursus",
      desc: "Opslagsværk til genopfriskning, ikke et krav for at starte",
      icon: <BoltIcon className="h-5 w-5" />,
    },
    {
      id: "symbols",
      title: "Symboler",
      desc: "Alle sætningsled-symbolerne",
      icon: <SymbolsIcon className="h-5 w-5" />,
    },
    {
      id: "udvikling",
      tour: "hjem-udvikling",
      title: "Din udvikling",
      desc: "Se dine stats pr. kategori og få en standpunktskarakter af Lingua",
      icon: <TrendUpIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="app-page space-y-10">
      {/* Hero: typografi og én accent-bjælke i STX-rød eller HHX-blå */}
      <header className={cn("border-t-4 pt-5", isHhx ? "border-hhx-base" : "border-stx-base")}>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p className="eyebrow">{isHhx ? "HHX · Almen Sprogforståelse" : "STX · Almen Sprogforståelse"}</p>
            <h1 className="page-title mt-1.5">{greeting}</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60">
              {isHhx ? "Klar til at træne HHX Almen Sprogforståelse i dag?" : "Klar til at træne STX Almen Sprogforståelse i dag?"}
            </p>
          </div>
        </div>

        {/* Statuslinje: tal og etiketter med hårfine skillelinjer — ingen piller */}
        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden border-y border-ink/10 bg-ink/10">
          <div className="bg-paper px-1 py-3">
            <dt className="eyebrow flex items-center gap-1.5">
              <FlameIcon className="h-3.5 w-3.5" /> Streak
            </dt>
            <dd className="mt-1 text-xl font-extrabold tabular-nums text-ink">
              {progress.streakDays} <span className="text-xs font-semibold text-ink/45">dage</span>
            </dd>
          </div>
          <div className="bg-paper px-3 py-3">
            <dt className="eyebrow flex items-center gap-1.5">
              <SparklesIcon className="h-3.5 w-3.5" /> Erfaring
            </dt>
            <dd className="mt-1 text-xl font-extrabold tabular-nums text-ink">
              {progress.xp} <span className="text-xs font-semibold text-ink/45">XP</span>
            </dd>
          </div>
          <div className="bg-paper px-3 py-3">
            <dt className="eyebrow">Niveau</dt>
            <dd className="mt-1 text-xl font-extrabold tabular-nums text-ink">
              {level.level} <span className="text-xs font-semibold text-ink/45">· {level.title}</span>
            </dd>
          </div>
        </dl>
      </header>

      {/* Genveje: nummereret indeks i stedet for gentagne kort */}
      <nav aria-label="Genveje">
        <p className="eyebrow mb-1">Genveje</p>
        <ol className="border-t border-ink/15">
          {shortcuts.map((s, i) => (
            <li key={s.id} className="border-b border-ink/10">
              <button
                data-tour={s.tour}
                onClick={() => onNavigate(s.id)}
                className="group flex w-full items-baseline gap-4 py-4 text-left transition-colors hover:bg-ink/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:items-center"
              >
                <span className="font-display w-8 shrink-0 pt-0.5 text-sm font-extrabold tabular-nums text-ink/30 sm:pt-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("shrink-0 transition-colors", isHhx ? "text-hhx-base" : "text-stx-base")}>{s.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-extrabold tracking-tight text-ink">{s.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink/50">{s.desc}</span>
                </span>
                <ArrowUpRightIcon className="h-4 w-4 shrink-0 self-center text-ink/25 transition-colors group-hover:text-ink/60" />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Om-blok som fodnote med hårfint overstreg */}
      <section className="border-t border-ink/15 pt-5 text-sm leading-relaxed text-ink/60">
        <p className="section-title mb-2 flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-ink/40" />
          Om AP Klar
        </p>
        <p className="max-w-2xl">
          AP Klar er lavet af gymnasieelever til gymnasieelever: en gratis øvelsesapp til Almen Sprogforståelse på STX og
          HHX. Hvert forløb starter med en rolig introduktion, før du bliver spurgt, så du kan lære uden at kunne noget i
          forvejen.{" "}
          <Link href="/om" className="font-semibold text-ink underline decoration-ink/25 underline-offset-2 transition hover:decoration-ink/60">
            Læs mere
          </Link>
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink/70 underline decoration-ink/20 underline-offset-2 transition hover:text-ink hover:decoration-ink/50"
        >
          <InstagramIcon className="h-4 w-4" />
          Følg os på Instagram
          <ArrowUpRightIcon className="h-4 w-4" />
        </a>
      </section>
    </div>
  );
}
