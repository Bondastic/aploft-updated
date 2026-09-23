"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Education, Progress } from "../types";
import { getLevelInfo } from "../lib/progress";
import { EDU_THEMES, getEducation } from "../lib/education";
import { CategoryIcon, FlameIcon, SettingsIcon, StxIcon, HhxIcon, TrendUpIcon } from "../components/icons";
import DarkModeToggle from "../components/DarkModeToggle";
import SchoolStep from "../components/onboarding/SchoolStep";
import { getSchool } from "../data/schools";
import { cn } from "../utils/cn";

export default function ProfilePage({
  progress,
  onNavigate,
  onSetNickname,
  onSetReduceMotion,
  onSetEducation,
  onSetSchool,
  onReset,
}: {
  progress: Progress;
  onNavigate: (page: "udvikling") => void;
  onSetNickname: (name: string) => void;
  onSetReduceMotion: (v: boolean) => void;
  onSetEducation: (education: Education) => void;
  onSetSchool: (school: string | null) => void;
  onReset: () => void;
}) {
  const [nickname, setNicknameLocal] = useState(progress.nickname);
  const [confirmReset, setConfirmReset] = useState(false);
  const [schoolDraft, setSchoolDraft] = useState<string | null>(null);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const schoolDef = getSchool(progress.school);
  const level = getLevelInfo(progress.xp);
  const reduceMotion = progress.settings.reduceMotion;
  const isHhx = progress.education === "hhx";

  return (
    <div className="app-page space-y-8">
      {/* Tekst-first: navn og niveau som redaktionel overskrift */}
      <header className={cn("border-t-4 pt-5", isHhx ? "border-hhx-base" : "border-stx-base")}>
        <p className="eyebrow">Profil</p>
        <h1 className="page-title mt-1">{progress.nickname || "Din profil"}</h1>
        <p className="mt-2 text-sm text-ink/60">
          Niveau {level.level} · {level.title} · <span className="tabular-nums">{progress.xp} XP</span> i alt
        </p>
      </header>

      <section>
        <label htmlFor="nickname" className="eyebrow mb-2 block">
          Kaldenavn (valgfrit, gemmes kun lokalt)
        </label>
        <div className="flex gap-2">
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNicknameLocal(e.target.value)}
            placeholder="Fx AP-jægeren"
            maxLength={20}
            className="field flex-1"
          />
          <button onClick={() => onSetNickname(nickname)} className="btn btn-primary">
            Gem
          </button>
        </div>
      </section>

      {/* To nøgletal side om side med hårfint overstreg */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden border-y border-ink/10 bg-ink/10">
        <div className="bg-paper py-4">
          <dt className="eyebrow flex items-center gap-1.5">
            <FlameIcon className="h-3.5 w-3.5 text-ochre-base" /> Streak
          </dt>
          <dd className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{progress.streakDays}</dd>
          <dd className="text-[11px] text-ink/45">dage i træk</dd>
        </div>
        <div className="bg-paper px-4 py-4">
          <dt className="eyebrow">XP-bonus</dt>
          <dd className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{progress.multiplier.toFixed(1)}×</dd>
          <dd className="text-[11px] text-ink/45">nuværende</dd>
        </div>
      </dl>

      <button onClick={() => onNavigate("udvikling")} className="group flex w-full items-center gap-3 border-y border-ink/10 py-4 text-left transition-colors hover:bg-ink/[0.04]">
        <span className="shrink-0 text-ink/50">
          <TrendUpIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold tracking-tight text-ink">Se din udvikling</span>
          <span className="mt-0.5 block text-xs text-ink/50">Stats pr. kategori, anbefalinger og en standpunktskarakter af Lingua</span>
        </span>
        <span className="text-ink/25 transition-colors group-hover:text-ink/60">→</span>
      </button>

      {progress.examAttempts.length > 0 && (
        <section>
          <p className="eyebrow mb-3">Seneste prøver</p>
          <div className="border-t border-ink/15">
            {progress.examAttempts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-ink/10 py-2.5 text-sm">
                <span className="inline-flex items-center gap-2 text-ink/60">
                  <CategoryIcon
                    name={
                      a.track === "almen"
                        ? "almen"
                        : a.track === "latin"
                          ? "latin"
                          : a.track === "hhx"
                            ? "hhx"
                            : a.track === "ultimativ"
                              ? "ultimativ"
                              : "fuld"
                    }
                    className="h-4 w-4"
                  />
                  {a.track === "almen"
                    ? "Almen"
                    : a.track === "latin"
                      ? "Latin"
                      : a.track === "hhx"
                        ? "HHX"
                        : a.track === "ultimativ"
                          ? "Ultimativ"
                          : "Fuld"}{" "}
                  · {new Date(a.date).toLocaleDateString("da-DK")}
                </span>
                <span className="font-bold tabular-nums text-ink">
                  {a.totalCorrect}/{a.totalQuestions}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Indstillinger: én rolig sektion med interne skillelinjer */}
      <section>
        <div className="flex items-center gap-2 border-t-[3px] border-ink pt-4">
          <SettingsIcon className="h-4 w-4 text-ink/50" />
          <p className="section-title">Indstillinger</p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-md border border-ink/10 bg-card p-4">
            <p className="text-sm font-bold text-ink">Uddannelse</p>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-ink/50">
              Valgte du forkert i starten? Skift her. Dine XP og resultater bliver bevaret, og du kan altid skifte tilbage.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetEducation("stx")}
                aria-pressed={progress.education === "stx"}
                className={cn(
                  "btn",
                  progress.education === "stx"
                    ? "border-l-4 border-stx-base bg-stx-soft text-stx-deep"
                    : "border border-ink/12 bg-card text-ink/55 hover:border-ink/30"
                )}
              >
                <StxIcon className="h-4 w-4" />
                STX
              </button>
              <button
                onClick={() => onSetEducation("hhx")}
                aria-pressed={progress.education === "hhx"}
                className={cn(
                  "btn",
                  progress.education === "hhx"
                    ? "border-l-4 border-hhx-base bg-hhx-soft text-hhx-deep"
                    : "border border-ink/12 bg-card text-ink/55 hover:border-ink/30"
                )}
              >
                <HhxIcon className="h-4 w-4" />
                HHX
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink/45">
              <CategoryIcon name={progress.education === "hhx" ? "hhx" : "stx"} className="h-3.5 w-3.5" />
              Aktiv: {EDU_THEMES[progress.education].fullName}
            </p>
          </div>

          {/* Skole: afgør hvilken eksamensform eleven ser under Prøve. Kun lokalt. */}
          <div className="rounded-md border border-ink/10 bg-card p-4">
            <p className="text-sm font-bold text-ink">Skole</p>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-ink/50">
              Din skole afgør, hvilken eksamensform du ser under Prøve. Vælg kun lokalt : data sendes eller indsamles ikke.
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">
                {schoolDef ? schoolDef.name : progress.school === "unknown" ? "Anden skole (jeg er i tvivl)" : "Ikke valgt endnu"}
              </p>
              <button
                onClick={() => {
                  setSchoolDraft(progress.school === "unknown" ? null : progress.school);
                  setSchoolOpen(true);
                }}
                className="btn btn-outline px-4 py-1.5 text-xs"
              >
                {progress.school && progress.school !== "unknown" ? "Skift skole" : "Vælg skole"}
              </button>
            </div>
          </div>

          <DarkModeToggle variant="full" />
          <label className="flex items-center justify-between gap-3 px-1 text-sm">
            <span className="text-ink/70">Reducér animationer</span>
            <input
              type="checkbox"
              checked={progress.settings.reduceMotion}
              onChange={(e) => onSetReduceMotion(e.target.checked)}
              className="h-5 w-5 accent-purple"
            />
          </label>
        </div>
      </section>

      <p className="border-t border-ink/15 pt-4 text-xs leading-relaxed text-ink/50">
        <span className="font-bold text-ink">Dine data. </span>
        AP Klar gemmer kun dine data lokalt på denne enhed: et tilfældigt bruger-id, dit valgfri kaldenavn, XP,
        kategori-resultater og eksamensforsøg. Der er ingen login, ingen cookies og ingen tredjepartssporing.
      </p>

      {!confirmReset ? (
        <button onClick={() => setConfirmReset(true)} className="btn btn-danger w-full py-3">
          Nulstil alle data
        </button>
      ) : (
        <div className="rounded-md border border-rust-base/40 bg-rust-soft p-4 text-sm text-rust-base">
          <p>Er du sikker? Det sletter al din XP og alle dine resultater på denne enhed.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setConfirmReset(false)} className="btn btn-outline flex-1">
              Fortryd
            </button>
            <button
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
              className="btn btn-danger-solid flex-1"
            >
              Ja, nulstil
            </button>
          </div>
        </div>
      )}

      {schoolOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vælg din skole"
          onClick={() => setSchoolOpen(false)}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="modal max-h-[86vh] w-full max-w-md overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Skolevalg</p>
                <h3 className="page-title mt-1">Hvilken skole går du på?</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/55">Valget bestemmer hvilken eksamensform, appen viser. Det gemmes kun på din enhed.</p>
              </div>
              <button onClick={() => setSchoolOpen(false)} aria-label="Luk" className="rounded-sm p-1.5 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink">
                ✕
              </button>
            </div>
            <div className="mt-4">
              <SchoolStep education={progress.education} value={schoolDraft} onChange={setSchoolDraft} reduceMotion={reduceMotion} />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setSchoolOpen(false)} className="btn btn-outline flex-1">
                Fortryd
              </button>
              <button
                disabled={!schoolDraft}
                onClick={() => {
                  if (schoolDraft) onSetSchool(schoolDraft);
                  setSchoolOpen(false);
                }}
                className="btn btn-primary flex-1"
              >
                Gem skolevalg
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
