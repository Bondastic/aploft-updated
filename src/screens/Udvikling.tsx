"use client";

import { useMemo, useState } from "react";
import type { Education, Progress } from "../types";
import { CATEGORY_COLOR_CLASSES, HHX_CATEGORIES, STX_CATEGORIES } from "../data/categories";
import { getCategoryPath } from "../data/paths";
import { getCategoryHighScoreAverage, LESSON_PASS_THRESHOLD } from "../lib/progress";
import { CategoryIcon } from "../components/icons";
import { cn } from "../utils/cn";

// Danske 7-trins-karakterer, fra lavest til højest.
const GRADE_SCALE: { grade: string; label: string; minPct: number }[] = [
  { grade: "12", label: "Fremragende", minPct: 90 },
  { grade: "10", label: "Fortrinligt", minPct: 78 },
  { grade: "7", label: "Godt", minPct: 63 },
  { grade: "4", label: "Jævnt", minPct: 48 },
  { grade: "02", label: "Tilstrækkeligt", minPct: 35 },
  { grade: "00", label: "Utilstrækkeligt", minPct: 20 },
  { grade: "-3", label: "Ikke-godkendt", minPct: 0 },
];

// Nogle kategorier vejer lidt tungere, fordi de er mere grundlæggende for AP-prøven.
const CATEGORY_WEIGHT: Record<string, number> = {
  kasus: 1.3,
  ordklasser: 1.2,
  saetningsled: 1.3,
  grammatik: 1.2,
  sumesse: 1.0,
  // HHX-vægte: kommunikation og pragmatik er kernen i HHX-pensum.
  kommunikation: 1.2,
  pragmatik: 1.1,
  semantik: 1.1,
  sproghandlinger: 1.1,
};

const MIN_ANSWERS_FOR_GRADE = 15;

function gradeFor(pct: number): { grade: string; label: string } {
  const found = GRADE_SCALE.find((g) => pct >= g.minPct);
  return found ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

// Udvikling: redaktionel statistikside. Nøgletal uden kortkasser, kategorier
// som hårfine regneark-rækker, og karakteren som sidens store display-øjeblik.
export default function UdviklingPage({ education, progress }: { education: Education; progress: Progress }) {
  const [showGrade, setShowGrade] = useState(false);
  const isHhx = education === "hhx";

  const rows = useMemo(() => {
    const cats = isHhx ? HHX_CATEGORIES : STX_CATEGORIES;
    return cats.map((cat) => {
      const stat = progress.categoryStats[cat.id];
      const total = stat?.total ?? 0;
      const correct = stat?.correct ?? 0;
      const hs = getCategoryHighScoreAverage(progress, cat.id, education);
      const pct = hs.avg;
      const path = getCategoryPath(cat.id, education);
      const lessonsPassed = path.nodes.filter((n) => (progress.completedLessons[n.id]?.bestPct ?? 0) >= LESSON_PASS_THRESHOLD).length;
      return { cat, total, correct, pct, lessons: hs.lessons, lessonsPassed, lessonsTotal: path.nodes.length };
    });
  }, [progress, education, isHhx]);

  const totalAnswered = rows.reduce((s, r) => s + r.total, 0);
  const eligibleRows = rows.filter((r) => r.lessons > 0);
  const canGrade = totalAnswered >= MIN_ANSWERS_FOR_GRADE && eligibleRows.length >= 2;

  const weightedPct = useMemo(() => {
    if (eligibleRows.length === 0) return 0;
    let weightSum = 0;
    let scoreSum = 0;
    for (const r of eligibleRows) {
      const w = (CATEGORY_WEIGHT[r.cat.id] ?? 1) * r.lessons;
      weightSum += w;
      scoreSum += w * (r.pct ?? 0);
    }
    return weightSum > 0 ? scoreSum / weightSum : 0;
  }, [eligibleRows]);

  const grade = gradeFor(weightedPct);
  const sortedByWeakest = [...rows].filter((r) => r.total > 0).sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0));
  const weakest = sortedByWeakest.slice(0, 3);
  const untouched = rows.filter((r) => r.total === 0);

  return (
    <div className="app-page space-y-10">
      <header className={cn("border-t-4 pt-5", isHhx ? "border-hhx-base" : "border-stx-base")}>
        <p className="eyebrow">Statistik</p>
        <h1 className="page-title mt-1">Din udvikling</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
          Se hvor du står i hver kategori, hvad du bør øve mest, og få en estimeret standpunktskarakter.
        </p>
      </header>

      {/* Nøgletal i fri luft med hårfine skillelinjer */}
      <dl className="grid grid-cols-3 gap-px overflow-hidden border-y border-ink/10 bg-ink/10">
        <div className="bg-paper py-4">
          <dt className="eyebrow">Besvaret</dt>
          <dd className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{totalAnswered}</dd>
          <dd className="text-[11px] text-ink/45">opgaver</dd>
        </div>
        <div className="bg-paper px-4 py-4">
          <dt className="eyebrow">Erfaring</dt>
          <dd className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{progress.xp}</dd>
          <dd className="text-[11px] text-ink/45">XP i alt</dd>
        </div>
        <div className="bg-paper px-4 py-4">
          <dt className="eyebrow">Forløb</dt>
          <dd className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{rows.reduce((s, r) => s + r.lessonsPassed, 0)}</dd>
          <dd className="text-[11px] text-ink/45">bestået</dd>
        </div>
      </dl>

      {(weakest.length > 0 || untouched.length > 0) && (
        <section className="border-t border-ink/15 pt-5">
          <p className="section-title mb-3">Hvad skal du øve dig på?</p>
          {weakest.length > 0 && (
            <ul className="space-y-2">
              {weakest.map((r) => (
                <li key={r.cat.id} className="flex items-center gap-3 text-sm">
                  <span className="shrink-0 text-ink/50">
                    <CategoryIcon name={r.cat.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-ink/70">
                    <span className="font-semibold text-ink">{r.cat.short}</span>: {r.pct}% rigtige indtil videre
                  </span>
                </li>
              ))}
            </ul>
          )}
          {untouched.length > 0 && (
            <p className="mt-3 text-xs leading-relaxed text-ink/50">
              Du har endnu ikke prøvet: {untouched.map((r) => r.cat.short).join(", ")}. Start et forløb i disse kategorier for at få et
              billede af, hvor du står.
            </p>
          )}
        </section>
      )}

      <section>
        <p className="eyebrow mb-3">Resultat pr. kategori</p>
        <div className="border-t border-ink/15">
          {rows.map((r) => (
            <div key={r.cat.id} className="flex items-center gap-3 border-b border-ink/10 py-2.5 text-sm">
              <span className="shrink-0 text-ink/50">
                <CategoryIcon name={r.cat.icon} className="h-4 w-4" />
              </span>
              <span className="w-32 shrink-0 truncate text-ink/70">{r.cat.short}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div className={cn("h-full rounded-full", CATEGORY_COLOR_CLASSES[r.cat.color].solid)} style={{ width: `${r.pct ?? 0}%` }} />
              </div>
              <span className="w-14 shrink-0 text-right text-xs font-bold tabular-nums text-ink/50">{r.pct !== null ? `${r.pct}%` : "-"}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Linguas vurdering: tekst-first med karakteren som stort display-tal */}
      <section className="border-t-[3px] border-ink pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="eyebrow">Linguas vurdering</p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/60">
              Lingua kan give dig en hardcoded standpunktskarakter ud fra dine resultater i de kategorier, du allerede har trænet.
            </p>
          </div>
        </div>

        {!showGrade ? (
          <button
            onClick={() => setShowGrade(true)}
            disabled={!canGrade}
            className={cn("btn mt-4", isHhx ? "bg-hhx-base text-white" : "bg-stx-base text-white")}
          >
            Få en standpunktskarakter af Lingua
          </button>
        ) : (
          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3 border-y border-ink/15 py-6">
            {/* Det store tal er et af de få steder, display-fonten bruges */}
            <p className={cn("font-display text-6xl font-extrabold leading-none tabular-nums sm:text-7xl", isHhx ? "text-hhx-deep" : "text-stx-deep")}>
              {grade.grade}
            </p>
            <div className="pb-1">
              <p className="text-sm font-extrabold text-ink">{grade.label}</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-ink/50">
                Baseret på et vægtet gennemsnit på {Math.round(weightedPct)}% rigtige på tværs af de kategorier, du har trænet.
              </p>
            </div>
          </div>
        )}

        {!canGrade && (
          <p className="mt-3 text-xs leading-relaxed text-ink/50">
            Gennemfør flere forløb (mindst {MIN_ANSWERS_FOR_GRADE} opgaver i alt, fordelt på mindst 2 kategorier), så Lingua har nok data til at
            give dig en vurdering.
          </p>
        )}

        <p className="mt-4 rounded-md bg-ochre-soft px-3 py-2 text-[11px] leading-relaxed text-ochre-base">
          Bemærk: opgavebanken i AP Klar er endnu ikke fuldt færdig. Karakteren er derfor kun et estimat baseret på det, du allerede har
          trænet. Den kan blive langt mere præcis, når flere kategorier og forløb er fuldt udbyggede.
        </p>
      </section>
    </div>
  );
}
