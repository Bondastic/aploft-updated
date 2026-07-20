"use client";

import { useState } from "react";
import type { Progress } from "../types";
import { getLevelInfo } from "../lib/progress";
import Mascot from "../components/Mascot";
import { CategoryIcon, FlameIcon, SettingsIcon, TrendUpIcon } from "../components/icons";
import DarkModeToggle from "../components/DarkModeToggle";
import { cn } from "../utils/cn";

export default function ProfilePage({
  progress,
  onNavigate,
  onSetNickname,
  onSetReduceMotion,
  onReset,
}: {
  progress: Progress;
  onNavigate: (page: "udvikling") => void;
  onSetNickname: (name: string) => void;
  onSetReduceMotion: (v: boolean) => void;
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
            className="flex-1 rounded-xl border-2 border-ink/15 px-3 py-2 text-sm outline-none focus:border-purple"
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
                    name={a.track === "almen" ? "almen" : a.track === "latin" ? "latin" : a.track === "ultimativ" ? "ultimativ" : "fuld"}
                    className="h-4 w-4"
                  />
                  {a.track === "almen" ? "Almen" : a.track === "latin" ? "Latin" : a.track === "ultimativ" ? "Ultimativ" : "Fuld"} ·{" "}
                  {new Date(a.date).toLocaleDateString("da-DK")}
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
        <DarkModeToggle variant="full" />
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
