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
  needsSchoolChoice,
  recordAnswer,
  recordExamAttempt,
  recordLessonResult,
  resetProgress,
  saveProgress,
  setEducation,
  setSchool,
  unlockLessonsThrough,
} from "../lib/progress";
import { lockViewportZoom } from "../utils/viewport";
import TopBar from "./TopBar";
import BottomNav, { type NavPage } from "./BottomNav";
import GuidedTour, { type TourPage } from "./GuidedTour";
import ErrorBoundary from "./ErrorBoundary";
import WelcomePage from "../screens/Welcome";
import SchoolGatePage from "../screens/SchoolGate";
import { clearExamSatsUsage } from "../lib/examSatsStorage";
import HomePage from "../screens/Home";
import PracticePage from "../screens/Practice";
import ExamPage from "../screens/Exam";
import SymbolsPage from "../screens/Symbols";
import ProfilePage from "../screens/Profile";
import LynkursusPage from "../screens/Lynkursus";
import UdviklingPage from "../screens/Udvikling";

type AppPage = NavPage | "lynkursus" | "udvikling";

export default function AploftApp() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [page, setPage] = useState<AppPage>("home");
  const [hydrated, setHydrated] = useState(false);
  // "Er du sikker"-vagten: mens en opgave/prove er i gang, advarer appen for
  // navigation vaek, fordi fremdriften i netop den session gaar tabt.
  const [sessionActive, setSessionActive] = useState(false);
  const [pendingNav, setPendingNav] = useState<AppPage | null>(null);
  // Spotlight-rundvisningen for nye brugere (starter på Profil lige efter
  // velkomstskærmen og gennemgår hele appen).
  const [guideActive, setGuideActive] = useState(false);

  // Undgå hydration-mismatch: gen-indlæs progress fra localStorage, når
  // komponenten er monteret i browseren.
  useEffect(() => {
    lockViewportZoom();
    setProgress(loadProgress());
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

  // Navigation med session-vagt: i en igangvaerende opgave/prove skal brugeren
  // bekræfte, at fremdriften i sessionen forsvinder, hvis de gaar vaek.
  const requestNavigate = useCallback(
    (target: AppPage) => {
      if (sessionActive && target !== page) {
        setPendingNav(target);
        return;
      }
      setPage(target);
      window.scrollTo({ top: 0, behavior: progress.settings.reduceMotion ? "auto" : "smooth" });
    },
    [sessionActive, page, progress.settings.reduceMotion]
  );

  function confirmLeaveSession() {
    if (pendingNav) setPage(pendingNav);
    setPendingNav(null);
    setSessionActive(false);
    window.scrollTo({ top: 0, behavior: progress.settings.reduceMotion ? "auto" : "smooth" });
  }

  // Før hydration kender vi ikke brugerens rigtige tilstand (uddannelse,
  // onboarded, XP): den ligger i localStorage. For at undgå en hydration-
  // mismatch mellem server- og klient-rendering viser vi derfor en tom,
  // neutral skal, indtil vi har læst tilstanden i browseren.
  if (!hydrated) {
    return <div className="min-h-screen bg-paper" aria-hidden="true" />
  }

  // Første besøg: vis velkomstskærmen (uddannelsesvalg + valgfrit brugernavn).
  // Når valget er taget, gemmes det i localStorage, så næste besøg starter
  // direkte i appen med den valgte uddannelse. Herefter lander man på Profil,
  // hvor spotlight-rundvisningen starter.
  if (!progress.onboarded) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-paper">
          <WelcomePage
            reduceMotion={progress.settings.reduceMotion}
            onComplete={(education, nickname, school) => {
              setProgress((p) => completeOnboarding(p, education, nickname, school));
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

  // Eksisterende brugere (og brugere der skifter spor) uden skolevalg møder
  // én skærm, indtil de har valgt skole - se data/schools.ts og progress.ts.
  if (needsSchoolChoice(progress)) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-paper">
          <SchoolGatePage
            education={progress.education}
            reduceMotion={progress.settings.reduceMotion}
            onDone={(school) => {
              setProgress((p) => setSchool(p, school));
              setPage("home");
              window.scrollTo({ top: 0 });
            }}
          />
        </div>
      </ErrorBoundary>
    );
  }

  const education = progress.education;

  return (
    <ErrorBoundary onReset={() => setPage("home")}>
    <div className="min-h-screen bg-paper">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Spring til indhold
      </a>
      <TopBar progress={progress} />
      <main id="main-content" className="lg:pl-56">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={progress.settings.reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={progress.settings.reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {page === "home" && <HomePage progress={progress} onNavigate={(p) => requestNavigate(p)} />}
            {page === "practice" && (
              <PracticePage
                education={education}
                progress={progress}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onLessonComplete={handleLessonComplete}
                onUnlockLessons={(ids) => setProgress((p) => unlockLessonsThrough(p, ids))}
                onSessionChange={setSessionActive}
              />
            )}
            {page === "exam" && (
              <ExamPage
                education={education}
                progress={progress}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onExamComplete={handleExamComplete}
                onSessionChange={setSessionActive}
              />
            )}
            {page === "symbols" && <SymbolsPage progress={progress} />}
            {page === "lynkursus" && <LynkursusPage education={education} progress={progress} />}
            {page === "udvikling" && <UdviklingPage education={education} progress={progress} />}
            {page === "profile" && (
              <ProfilePage
                progress={progress}
                onNavigate={(p) => requestNavigate(p)}
                onSetNickname={(name) => setProgress((p) => ({ ...p, nickname: name }))}
                onSetReduceMotion={(v) => setProgress((p) => ({ ...p, settings: { ...p.settings, reduceMotion: v } }))}
                onSetEducation={handleSetEducation}
                onSetSchool={(school) => setProgress((p) => setSchool(p, school))}
                onReset={() => {
                  setProgress(resetProgress());
                  clearExamSatsUsage();
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav
        page={(["home", "practice", "exam", "symbols", "profile"] as NavPage[]).includes(page as NavPage) ? (page as NavPage) : "home"}
        onNavigate={requestNavigate}
      />

      {pendingNav && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-label="Bekræft at du forlader en igangværende opgave"
          onClick={() => setPendingNav(null)}
        >
          <div className="modal w-full max-w-sm space-y-3 p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="section-title">Du er midt i en opgave</h3>
            <p className="text-sm text-ink/60">
              Går du væk nu, forlader du den igangværende opgave eller prøve : <span className="font-bold text-ink">fremdriften i netop den
              session bliver ikke gemt</span>, og den skal startes forfra. Dine gemte resultater og dit XP er selvfølgelig sikre.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPendingNav(null)} className="btn btn-outline flex-1">
                Bliv i opgaven
              </button>
              <button onClick={confirmLeaveSession} className="btn btn-danger-solid flex-1">
                Gå alligevel
              </button>
            </div>
          </div>
        </div>
      )}
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
