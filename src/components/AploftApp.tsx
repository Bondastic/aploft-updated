"use client";

import { useEffect, useState } from "react";
import type { CategoryId, CategoryStat, Progress } from "../types";
import type { ExamTrack } from "../lib/examGenerator";
import {
  addXp,
  loadProgress,
  recordAnswer,
  recordExamAttempt,
  recordLessonResult,
  resetProgress,
  saveProgress,
  touchStreak,
} from "../lib/progress";
import TopBar from "./TopBar";
import BottomNav, { type NavPage } from "./BottomNav";
import HomePage from "../screens/Home";
import PracticePage from "../screens/Practice";
import ExamPage from "../screens/Exam";
import SymbolsPage from "../screens/Symbols";
import ProfilePage from "../screens/Profile";
import LynkursusPage from "../screens/Lynkursus";
import UdviklingPage from "../screens/Udvikling";

type AppPage = NavPage | "lynkursus" | "udvikling";

export default function AploftApp() {
  const [progress, setProgress] = useState<Progress>(() => touchStreak(loadProgress()));
  const [page, setPage] = useState<AppPage>("home");
  const [hydrated, setHydrated] = useState(false);

  // Undgå hydration-mismatch: gen-indlæs progress fra localStorage, når
  // komponenten er monteret i browseren.
  useEffect(() => {
    setProgress(touchStreak(loadProgress()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProgress(progress);
  }, [progress, hydrated]);

  function handleCorrect(category: CategoryId) {
    setProgress((p) => addXp(recordAnswer(p, category, true), 10));
  }

  function handleWrong(category: CategoryId) {
    setProgress((p) => addXp(recordAnswer(p, category, false), 2));
  }

  function handleLessonComplete(lessonId: string, pct: number) {
    setProgress((p) => recordLessonResult(p, lessonId, pct));
  }

  function handleExamComplete(
    track: ExamTrack,
    correct: number,
    total: number,
    byCategory: Record<string, CategoryStat>
  ) {
    setProgress((p) => {
      const withXp = addXp(p, correct * 15);
      return recordExamAttempt(withXp, { track, totalCorrect: correct, totalQuestions: total, byCategory });
    });
  }

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-purple focus:px-4 focus:py-2 focus:text-white"
      >
        Spring til indhold
      </a>
      <TopBar progress={progress} />
      <main id="main-content">
        {page === "home" && <HomePage progress={progress} onNavigate={(p) => setPage(p)} />}
        {page === "practice" && (
          <PracticePage progress={progress} onCorrect={handleCorrect} onWrong={handleWrong} onLessonComplete={handleLessonComplete} />
        )}
        {page === "exam" && (
          <ExamPage progress={progress} onCorrect={handleCorrect} onWrong={handleWrong} onExamComplete={handleExamComplete} />
        )}
        {page === "symbols" && <SymbolsPage progress={progress} />}
        {page === "lynkursus" && <LynkursusPage progress={progress} />}
        {page === "udvikling" && <UdviklingPage progress={progress} />}
        {page === "profile" && (
          <ProfilePage
            progress={progress}
            onNavigate={(p) => setPage(p)}
            onSetNickname={(name) => setProgress((p) => ({ ...p, nickname: name }))}
            onSetReduceMotion={(v) => setProgress((p) => ({ ...p, settings: { ...p.settings, reduceMotion: v } }))}
            onReset={() => setProgress(resetProgress())}
          />
        )}
      </main>
      <BottomNav
        page={(["home", "practice", "exam", "symbols", "profile"] as NavPage[]).includes(page as NavPage) ? (page as NavPage) : "home"}
        onNavigate={setPage}
      />
    </div>
  );
}
