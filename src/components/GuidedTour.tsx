"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon, XIcon } from "./icons";
import { cn } from "../utils/cn";

// Spotlight-rundvisningen: en kort guide for nye brugere, der starter på
// Profil (hvor man lander efter velkomstskærmen) og går gennem hele appen:
// Hjem → Øv dig → Prøve → Symboler → Lynkursus → Din udvikling → Hjem.
// De to sidste trin fremhæver genvejsknapperne på forsiden (som tager en
// ind på lynkurset hhv. udviklingssiden), ikke selve siderne.
// Alt andet end det aktuelle element mørklægges (spotlight-hul), scroll
// låses, og Lingua forklarer kort i en taleboble. Kan springes over.
//
// Hvert trin peger på et element via en data-tour-attribut. Trinnet skifter
// selv side via onNavigate, venter på at siden er rendret, ruller målet ind
// midt på skærmen og måler så elementets position for at placere hullet.

export type TourPage = "profile" | "home" | "practice" | "exam" | "symbols" | "lynkursus" | "udvikling";

interface TourStep {
  page: TourPage;
  target: string; // CSS-selector for det element, der skal fremhæves
  title: string;
  text: string;
}

const STEPS: TourStep[] = [
  {
    page: "profile",
    target: '[data-tour="profil"]',
    title: "Profil",
    text: "Her finder du din XP, din streak og dine indstillinger. Du kan også skifte mellem STX og HHX her, hvis du valgte forkert i starten.",
  },
  {
    page: "home",
    target: '[data-tour="hjem"]',
    title: "Hjem",
    text: "Hjem-fanen nederst på skærmen fører dig altid tilbage til forsiden med dine statusser og genveje til hele appen.",
  },
  {
    page: "practice",
    target: '[data-tour="ov-dig"]',
    title: "Øv dig",
    text: "Vælg en kategori og følg forløbet fra bunden. Hvert forløb underviser dig først, før du bliver spurgt.",
  },
  {
    page: "exam",
    target: '[data-tour="proeve"]',
    title: "Prøve",
    text: "Tag en prøve som til den rigtige eksamen. Du vælger selv spor og længde, og du kan altid afslutte undervejs.",
  },
  {
    page: "symbols",
    target: '[data-tour="symboler"]',
    title: "Symboler",
    text: "De syv sætningsledssymboler, du skal bruge til syntaktisk analyse. Du kan slå dem op, når du har brug for det.",
  },
  {
    page: "home",
    target: '[data-tour="hjem-lynkursus"]',
    title: "Lynkursus-knappen",
    text: "På forsiden finder du knappen \"Lynkursus\" blandt genvejene. Den fører dig ind på lynkurset, hvor du kan slå regler, bøjninger og oversættelsesteknikker op, når du skal genopfriske noget.",
  },
  {
    page: "home",
    target: '[data-tour="hjem-udvikling"]',
    title: "Din udvikling-knappen",
    text: "Den aflange knap \"Din udvikling\" nederst på forsiden tager dig til siden med dine fremskridt: statistik pr. kategori, anbefalinger og en standpunktskarakter fra Lingua.",
  },
];

interface HoleRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function GuidedTour({
  active,
  onNavigate,
  onFinish,
  reduceMotion = false,
}: {
  active: boolean;
  onNavigate: (page: TourPage) => void;
  onFinish: () => void;
  reduceMotion?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<HoleRect | null>(null);
  const [bubbleAbove, setBubbleAbove] = useState(false);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  // Nulstil turen, hver gang den aktiveres (fx efter et "Nulstil alle data"
  // + nyt velkomstflow), så den altid starter forfra på Profil.
  const prevActive = useRef(false);
  useEffect(() => {
    if (active && !prevActive.current) {
      setStep(0);
      setRect(null);
    }
    prevActive.current = active;
  }, [active]);

  // Mål det aktuelle trins målelement og gem dets position (viewport-koordinater).
  // Først rulles målet ind midt på skærmen, så hullet altid er synligt (fx
  // genvejsknapperne nederst på forsiden). Scroll-låsen fjernes kortvarigt,
  // fordi overflow:hidden ellers blokerer programmatisk scroll.
  const NAV_GAP = 72;
  const measure = useCallback(() => {
    const el = document.querySelector<HTMLElement>(STEPS[step].target);
    if (!el) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "";
    el.scrollIntoView({ block: "center", behavior: "auto" });
    document.body.style.overflow = prevOverflow;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Hold hullet inden for vinduet og over bund-navigationen.
    const top = Math.max(0, r.top);
    const left = Math.max(0, r.left);
    const right = Math.min(vw, r.right);
    const bottom = r.bottom > vh ? vh - NAV_GAP : Math.min(vh, r.bottom);
    if (right <= left || bottom <= top) return;
    setRect({ top, left, width: right - left, height: bottom - top });
  }, [step]);

  // Skift til trinnets side, og mål målet, når siden er rendret. To forsøg:
  // ét lige efter side-skiftet (fx faner i bund-navigationen, som altid er
  // monteret) og ét efter sideovergangen (~160 ms AnimatePresence) er færdig.
  useEffect(() => {
    if (!active) return;
    onNavigate(STEPS[step].page);
    setRect(null);
    const t1 = window.setTimeout(measure, 80);
    const t2 = window.setTimeout(measure, 280);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [active, step, onNavigate, measure]);

  // Lås scroll, mens turen kører.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Genmål, hvis vinduet ændrer størrelse (fx rotation af telefonen).
  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, measure]);

  // Escape springer turen over.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFinish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onFinish]);

  // Taleboblen placeres under målet, hvis der er plads; ellers over det
  // (fx når målet er en fane i bund-navigationen).
  useEffect(() => {
    if (!rect) return;
    const bottom = rect.top + rect.height;
    setBubbleAbove(window.innerHeight - bottom < 260);
  }, [rect]);

  function next() {
    if (isLast) {
      onFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  const holeStyle: React.CSSProperties | undefined = rect
    ? {
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }
    : undefined;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-40"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Rundvisning med Lingua"
        >
          {/* Klik-spærre: fanger alle klik, så man ikke kommer ud af turen */}
          <div className="fixed inset-0 z-40" aria-hidden="true" />

          {/* Mørklægning med spotlight-hul (box-shadow-tricket): hullet er en
              gennemsigtig boks, hvis enorme skygge mørklægger resten af skærmen. */}
          {holeStyle && (
            <>
              <div
                className="pointer-events-none fixed z-40 rounded-2xl transition-all duration-200 ease-out"
                style={{ ...holeStyle, boxShadow: "0 0 0 9999px rgba(23, 18, 37, 0.8)" }}
              />
              <div
                className="pointer-events-none fixed z-40 rounded-2xl ring-2 ring-white/80"
                style={holeStyle}
              />
            </>
          )}

          {/* Mørk topbar med trin-/sideindikator */}
          <div className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[#171225]/95 px-4 py-2.5 text-white shadow-lg">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascot/welcome.png"
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white/30"
              />
              <p className="truncate text-sm font-extrabold">Rundvisning med Lingua</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/80">
                Trin {step + 1} af {STEPS.length}
              </span>
              <button
                onClick={onFinish}
                className="rounded-full px-2 py-1 text-xs font-semibold text-white/60 transition hover:text-white"
              >
                Spring over
              </button>
              <button
                onClick={onFinish}
                aria-label="Luk rundvisning"
                className="rounded-full bg-white/10 p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Taleboble med Lingua + forklaring + næste-knap */}
          <motion.div
            className="fixed inset-x-4 z-50 mx-auto max-w-md"
            style={
              bubbleAbove
                ? { bottom: 92 }
                : { top: (rect ? rect.top + rect.height : 0) + 14 }
            }
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start gap-3 rounded-3xl bg-white p-4 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascot/explain.png"
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-purple/20"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-extrabold text-ink">{current.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink/70">{current.text}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={next}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple to-purple-dark px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple/30 transition active:scale-[0.97]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                )}
              >
                {isLast ? "Færdig 🎉" : "Næste"}
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
