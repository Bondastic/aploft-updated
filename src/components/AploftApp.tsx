"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryId, CategoryStat, Education, Progress } from "../types";
import type { ExamTrack } from "../lib/examGenerator";
import {
  addXp,
  completeOnboarding,
  finishGuide,
  loadProgress,
  recordAnswer,
  recordExamAttempt,
  recordLessonResult,
  resetProgress,
  saveProgress,
  setEducation,
  touchStreak,
} from "../lib/progress";
import TopBar from "./TopBar";
import BottomNav, { type NavPage } from "./BottomNav";
import GuidedTour, { type TourPage } from "./GuidedTour";
import ErrorBoundary from "./ErrorBoundary";
import WelcomePage from "../screens/Welcome";
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
  // Spotlight-rundvisningen for nye brugere (starter på Profil lige efter
  // velkomstskærmen og gennemgår hele appen).
  const [guideActive, setGuideActive] = useState(false);

  // Undgå hydration-mismatch: gen-indlæs progress fra localStorage, når
  // komponenten er monteret i browseren.
  useEffect(() => {
    setProgress(touchStreak(loadProgress()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProgress(progress);
  }, [progress, hydrated]);

  // Hvis brugeren har gennemgået velkomstskærmen, men ikke har fået (eller
  // afsluttet) rundvisningen endnu, så start den på Profil. Det dækker både
  // første besøg og en bruger, der lukkede fanen midt i turen.
  useEffect(() => {
    if (!hydrated || !progress.onboarded || progress.guideDone || guideActive) return;
    setPage("profile");
    setGuideActive(true);
  }, [hydrated, progress.onboarded, progress.guideDone, guideActive]);

  const handleGuideFinish = useCallback(() => {
    setProgress((p) => finishGuide(p));
    setGuideActive(false);
    setPage("home");
    // Når rundvisningen slutter (eller springes over), rul forsiden pænt op til
    // toppen, så man starter forfra ved heroen. Scrollen udsættes kort, så
    // scroll-låsen (overflow:hidden) er ophævet, ellers blokerer den scroll.
    const reduceMotion = progress.settings.reduceMotion;
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }, 60);
  }, [progress.settings.reduceMotion]);

  const handleTourNavigate = useCallback((p: TourPage) => setPage(p), []);

  // Før hydration kender vi ikke brugerens rigtige tilstand (uddannelse,
  // onboarded, XP): den ligger i localStorage. For at undgå en hydration-
  // mismatch mellem server- og klient-rendering viser vi derfor en tom,
  // neutral skal, indtil vi har læst tilstanden i browseren.
  if (!hydrated) {
    return <div className="min-h-screen bg-[#faf8ff]" aria-hidden="true" />;
  }

  // Første besøg: vis velkomstskærmen (uddannelsesvalg + valgfrit brugernavn).
  // Når valget er taget, gemmes det i localStorage, så næste besøg starter
  // direkte i appen med den valgte uddannelse. Herefter lander man på Profil,
  // hvor spotlight-rundvisningen starter.
  if (!progress.onboarded) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-[#faf8ff]">
          <WelcomePage
            reduceMotion={progress.settings.reduceMotion}
            onComplete={(education, nickname) => {
              setProgress((p) => completeOnboarding(p, education, nickname));
              setPage("profile");
              setGuideActive(true);
            }}
          />
        </div>
      </ErrorBoundary>
    );
  }

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

  function handleSetEducation(education: Education) {
    // XP, streak og resultater beholdes; kun indholdet skifter spor.
    setProgress((p) => setEducation(p, education));
  }

  const education = progress.education;

  return (
    <ErrorBoundary onReset={() => setPage("home")}>
    <div className="min-h-screen bg-[#faf8ff]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-purple focus:px-4 focus:py-2 focus:text-white"
      >
        Spring til indhold
      </a>
      <TopBar progress={progress} />
      <main id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={progress.settings.reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={progress.settings.reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {page === "home" && <HomePage progress={progress} onNavigate={(p) => setPage(p)} />}
            {page === "practice" && (
              <PracticePage
                education={education}
                progress={progress}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onLessonComplete={handleLessonComplete}
              />
            )}
            {page === "exam" && (
              <ExamPage
                education={education}
                progress={progress}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onExamComplete={handleExamComplete}
              />
            )}
            {page === "symbols" && <SymbolsPage progress={progress} />}
            {page === "lynkursus" && <LynkursusPage education={education} progress={progress} />}
            {page === "udvikling" && <UdviklingPage education={education} progress={progress} />}
            {page === "profile" && (
              <ProfilePage
                progress={progress}
                onNavigate={(p) => setPage(p)}
                onSetNickname={(name) => setProgress((p) => ({ ...p, nickname: name }))}
                onSetReduceMotion={(v) => setProgress((p) => ({ ...p, settings: { ...p.settings, reduceMotion: v } }))}
                onSetEducation={handleSetEducation}
                onReset={() => setProgress(resetProgress())}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav
        page={(["home", "practice", "exam", "symbols", "profile"] as NavPage[]).includes(page as NavPage) ? (page as NavPage) : "home"}
        onNavigate={setPage}
      />
      <GuidedTour
        active={guideActive}
        onNavigate={handleTourNavigate}
        onFinish={handleGuideFinish}
        reduceMotion={progress.settings.reduceMotion}
      />
    </div>
    </ErrorBoundary>
  );
}
