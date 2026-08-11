"use client";

import { useMemo, useState } from "react";
import type { CategoryDef, Education, Progress } from "../types";
import { CATEGORY_COLOR_CLASSES, getCategoriesForEducation } from "../data/categories";
import { getCategoryPath } from "../data/paths";
import { LESSON_PASS_THRESHOLD } from "../lib/progress";
import Mascot from "../components/Mascot";
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
const MIN_ANSWERS_PER_CATEGORY = 4;

function gradeFor(pct: number): { grade: string; label: string } {
  const found = GRADE_SCALE.find((g) => pct >= g.minPct);
  return found ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

function categoryScopeLabel(category: CategoryDef, education: Education): string {
  if (education === "hhx") return "HHX";
  return category.track === "latin" ? "STX · Latin" : "STX · Almen";
}

export default function UdviklingPage({ education, progress }: { education: Education; progress: Progress }) {
  const [showGrade, setShowGrade] = useState(false);
  const reduceMotion = progress.settings.reduceMotion;
  const isHhx = education === "hhx";
  const activeEducationLabel = isHhx ? "HHX" : "STX";
  const activeScopeLabel = isHhx ? "HHX-sprogforståelse" : "STX: Almen sprogforståelse og latin";

  // Kun den aktive uddannelses kategorier indgår her. STX og HHX deler nogle
  // id'er (fx ordklasser), men de må aldrig stå dobbelt eller tælle dobbelt i
  // den estimerede karakter.
  const rows = useMemo(() => {
    const cats = getCategoriesForEducation(education);
    return cats.map((cat) => {
      const stat = progress.categoryStats[cat.id];
      const total = stat?.total ?? 0;
      const correct = stat?.correct ?? 0;
      const pct = total > 0 ? Math.round((correct / total) * 100) : null;
      const path = getCategoryPath(cat.id, education);
      const lessonsPassed = path.nodes.filter((n) => (progress.completedLessons[n.id]?.bestPct ?? 0) >= LESSON_PASS_THRESHOLD).length;
      return { cat, total, correct, pct, lessonsPassed, lessonsTotal: path.nodes.length };
    });
  }, [progress, education]);

  const totalAnswered = rows.reduce((s, r) => s + r.total, 0);
  const eligibleRows = rows.filter((r) => r.total >= MIN_ANSWERS_PER_CATEGORY);
  const canGrade = totalAnswered >= MIN_ANSWERS_FOR_GRADE && eligibleRows.length >= 2;

  const weightedPct = useMemo(() => {
    if (eligibleRows.length === 0) return 0;
    let weightSum = 0;
    let scoreSum = 0;
    for (const r of eligibleRows) {
      const w = (CATEGORY_WEIGHT[r.cat.id] ?? 1) * r.total;
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
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold text-ink">Din udvikling</h1>
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", isHhx ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700")}>
            {activeEducationLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink/50">
          Viser kun {activeScopeLabel}. Hver kategori tæller højst én gang i din estimerede standpunktskarakter.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center shadow-sm">
          <p className="text-xl font-extrabold text-ink">{totalAnswered}</p>
          <p className="text-xs text-ink/50">opgaver i dette spor</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center shadow-sm">
          <p className="text-xl font-extrabold text-purple">{progress.xp}</p>
          <p className="text-xs text-ink/50">XP i alt</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center shadow-sm">
          <p className="text-xl font-extrabold text-amber-600">{rows.reduce((s, r) => s + r.lessonsPassed, 0)}</p>
          <p className="text-xs text-ink/50">forløb bestået</p>
        </div>
      </div>

      {(weakest.length > 0 || untouched.length > 0) && (
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="mb-3 font-bold text-ink">Hvad skal du øve dig på?</p>
          {weakest.length > 0 && (
            <ul className="space-y-2">
              {weakest.map((r) => (
                <li key={r.cat.id} className="flex items-center gap-3 text-sm">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", CATEGORY_COLOR_CLASSES[r.cat.color].bg, CATEGORY_COLOR_CLASSES[r.cat.color].text)}>
                    <CategoryIcon name={r.cat.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-ink/70">
                    <span className="font-semibold text-ink">{r.cat.short}</span>
                    <span className="ml-1.5 text-xs font-semibold text-ink/40">{categoryScopeLabel(r.cat, education)}</span>: {r.pct}% rigtige indtil videre
                  </span>
                </li>
              ))}
            </ul>
          )}
          {untouched.length > 0 && (
            <p className="mt-3 text-xs text-ink/50">
              Du har endnu ikke prøvet: {untouched.map((r) => r.cat.short).join(", ")}. Start et forløb i disse kategorier for at få et
              billede af, hvor du står.
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold text-ink">Resultat pr. kategori</p>
          <span className={cn("rounded-full px-2 py-1 text-xs font-bold", isHhx ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700")}>
            {activeEducationLabel}
          </span>
        </div>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.cat.id} className="flex items-center gap-3 text-sm">
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", CATEGORY_COLOR_CLASSES[r.cat.color].bg, CATEGORY_COLOR_CLASSES[r.cat.color].text)}>
                <CategoryIcon name={r.cat.icon} className="h-4 w-4" />
              </span>
              <span className="w-32 shrink-0 text-ink/70">
                <span className="block truncate">{r.cat.short}</span>
                <span className="block text-xs font-semibold text-ink/40">{categoryScopeLabel(r.cat, education)}</span>
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div className={cn("h-full rounded-full", CATEGORY_COLOR_CLASSES[r.cat.color].solid)} style={{ width: `${r.pct ?? 0}%` }} />
              </div>
              <span className="w-12 shrink-0 text-right text-xs font-semibold text-ink/50">{r.pct !== null ? `${r.pct}%` : "-"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border-2 border-purple/20 bg-gradient-to-br from-purple/5 to-transparent p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <Mascot pose="explain" size="md" speech={null} reduceMotion={reduceMotion} />
          <div className="flex-1">
            <p className="font-display text-lg font-extrabold text-ink">Linguas vurdering</p>
            <p className="mt-1 text-sm text-ink/60">
              Lingua vurderer kun kategorierne vist ovenfor i {activeScopeLabel}. Hver kategori står én gang og tæller derfor kun én gang.
            </p>
          </div>
        </div>

        {!showGrade ? (
          <button
            onClick={() => setShowGrade(true)}
            disabled={!canGrade}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-purple to-purple-dark py-3 text-sm font-bold text-white shadow-md shadow-purple/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Få en standpunktskarakter af Lingua
          </button>
        ) : (
          <div className="mt-4 space-y-3 rounded-2xl border border-purple/20 bg-white p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple/70">Estimeret standpunktskarakter</p>
            <p className="font-display text-5xl font-extrabold text-ink">{grade.grade}</p>
            <p className="text-sm font-semibold text-ink/60">{grade.label}</p>
            <p className="text-xs text-ink/50">Baseret på et vægtet gennemsnit på {Math.round(weightedPct)}% rigtige på tværs af de kategorier, du har trænet.</p>
          </div>
        )}

        {!canGrade && (
          <p className="mt-3 text-xs text-ink/50">
            Svar på flere opgaver (mindst {MIN_ANSWERS_FOR_GRADE} i alt, fordelt på mindst 2 kategorier), så Lingua har nok data til at give
            dig en vurdering.
          </p>
        )}

        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          Bemærk: opgavebanken i AP Klar er endnu ikke fuldt færdig. Karakteren er derfor kun et estimat baseret på det, du allerede har
          trænet. Den kan blive langt mere præcis, når flere kategorier og forløb er fuldt udbyggede.
        </p>
      </div>
    </div>
  );
}
