"use client";

import { useState } from "react";
import type { Education, Progress, TextSize } from "../types";
import { getLevelInfo } from "../lib/progress";
import { EDU_THEMES, getEducation } from "../lib/education";
import Mascot from "../components/Mascot";
import { CategoryIcon, FlameIcon, SettingsIcon, StxIcon, HhxIcon, TrendUpIcon } from "../components/icons";
import DarkModeToggle from "../components/DarkModeToggle";
import { cn } from "../utils/cn";

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string; sampleClass: string }[] = [
  { value: "normal", label: "Normal", sampleClass: "text-sm" },
  { value: "large", label: "Stor", sampleClass: "text-base" },
  { value: "extra-large", label: "Størst", sampleClass: "text-lg" },
];

export default function ProfilePage({
  progress,
  onNavigate,
  onSetNickname,
  onSetReduceMotion,
  onSetTextSize,
  onSetEducation,
  onReset,
}: {
  progress: Progress;
  onNavigate: (page: "udvikling") => void;
  onSetNickname: (name: string) => void;
  onSetReduceMotion: (v: boolean) => void;
  onSetTextSize: (size: TextSize) => void;
  onSetEducation: (education: Education) => void;
  onReset: () => void;
}) {
  const [nickname, setNicknameLocal] = useState(progress.nickname);
  const [confirmReset, setConfirmReset] = useState(false);
  const level = getLevelInfo(progress.xp);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
      <div className="flex items-center gap-4 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
        <Mascot pose="thumbsup" size="md" speech={null} reduceMotion={progress.settings.reduceMotion} />
        <div>
          <p className="font-display text-lg font-extrabold text-ink">
            {progress.nickname || "Din profil"} · Niveau {level.level}
          </p>
          <p className="text-sm text-ink/50">{level.title}</p>
          <p className="text-xs text-ink/40">{progress.xp} XP i alt</p>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <label htmlFor="nickname" className="mb-2 block text-sm font-bold text-ink">
          Kaldenavn (valgfrit, gemmes kun lokalt)
        </label>
        <div className="flex gap-2">
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNicknameLocal(e.target.value)}
            placeholder="Fx AP-jægeren"
            maxLength={20}
            autoComplete="off"
            className="flex-1 rounded-xl border-2 border-ink/15 px-3 py-2 text-base outline-none focus:border-purple"
          />
          <button
            onClick={() => onSetNickname(nickname)}
            className="rounded-xl bg-purple px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Gem
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center shadow-sm">
          <FlameIcon className="mx-auto mb-1 h-6 w-6 text-amber-500" />
          <p className="text-xl font-extrabold text-ink">{progress.streakDays}</p>
          <p className="text-xs text-ink/50">dages streak</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center shadow-sm">
          <p className="text-xl font-extrabold text-purple">{progress.multiplier.toFixed(1)}×</p>
          <p className="text-xs text-ink/50">nuværende XP-bonus</p>
        </div>
      </div>

      <button
        onClick={() => onNavigate("udvikling")}
        className="flex w-full items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
          <TrendUpIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-ink">Se din udvikling</span>
          <span className="block text-xs text-ink/50">Stats pr. kategori, anbefalinger og en standpunktskarakter af Lingua</span>
        </span>
      </button>

      {progress.examAttempts.length > 0 && (
        <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="mb-3 font-bold text-ink">Seneste prøver</p>
          <div className="space-y-2">
            {progress.examAttempts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 text-ink/60">
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
                <span className="font-bold text-ink">
                  {a.totalCorrect}/{a.totalQuestions}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4 text-ink/50" />
          <p className="font-bold text-ink">Indstillinger</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-ink/[0.02] p-4">
          <p className="mb-1 text-sm font-bold text-ink">Uddannelse</p>
          <p className="mb-3 text-xs text-ink/50">
            Valgte du forkert i starten? Skift her. Dine XP og resultater bliver bevaret, og du kan altid skifte tilbage.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSetEducation("stx")}
              aria-pressed={progress.education === "stx"}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold transition",
                progress.education === "stx"
                  ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                  : "border-ink/10 bg-white text-ink/50 hover:border-red-200"
              )}
            >
              <StxIcon className="h-4 w-4" />
              STX
            </button>
            <button
              onClick={() => onSetEducation("hhx")}
              aria-pressed={progress.education === "hhx"}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold transition",
                progress.education === "hhx"
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-ink/10 bg-white text-ink/50 hover:border-blue-200"
              )}
            >
              <HhxIcon className="h-4 w-4" />
              HHX
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/40">
            <CategoryIcon name={progress.education === "hhx" ? "hhx" : "stx"} className="h-3.5 w-3.5" />
            Aktiv: {EDU_THEMES[progress.education].fullName}
          </p>
        </div>

        <DarkModeToggle variant="full" />

        <div className="rounded-2xl border border-ink/10 bg-ink/[0.02] p-4">
          <div className="mb-3">
            <p className="text-sm font-bold text-ink">Tekststørrelse</p>
            <p className="mt-0.5 text-xs text-ink/50">
              Gør teksten større i hele appen. Vælg den størrelse, der er rarest at læse.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Vælg tekststørrelse">
            {TEXT_SIZE_OPTIONS.map((option) => {
              const selected = progress.settings.textSize === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSetTextSize(option.value)}
                  aria-pressed={selected}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center rounded-xl border-2 px-2 py-2 text-center font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple",
                    selected
                      ? "border-purple bg-purple/10 text-purple"
                      : "border-ink/10 bg-white text-ink/60 hover:border-purple/30 hover:text-ink"
                  )}
                >
                  <span className={cn("font-display font-extrabold leading-none", option.sampleClass)}>Aa</span>
                  <span className="mt-1 text-xs">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-ink/70">Reducér animationer</span>
          <input
            type="checkbox"
            checked={progress.settings.reduceMotion}
            onChange={(e) => onSetReduceMotion(e.target.checked)}
            className="h-5 w-5 accent-purple"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 text-xs text-ink/50 shadow-sm">
        <p className="mb-1 font-bold text-ink">Dine data</p>
        <p>
          AP Klar gemmer kun dine data lokalt på denne enhed: et tilfældigt bruger-id, dit valgfri kaldenavn, XP,
          kategori-resultater og eksamensforsøg. Der er ingen login, ingen cookies og ingen tredjepartssporing.
        </p>
      </div>

      {!confirmReset ? (
        <button
          onClick={() => setConfirmReset(true)}
          className="w-full rounded-full border-2 border-rose-200 py-3 text-sm font-semibold text-rose-600"
        >
          Nulstil alle data
        </button>
      ) : (
        <div className="space-y-2 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p>Er du sikker? Det sletter al din XP og alle dine resultater på denne enhed.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmReset(false)}
              className="flex-1 rounded-full border border-rose-300 py-2 text-sm font-semibold text-rose-700"
            >
              Fortryd
            </button>
            <button
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
              className={cn("flex-1 rounded-full bg-rose-600 py-2 text-sm font-semibold text-white")}
            >
              Ja, nulstil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
