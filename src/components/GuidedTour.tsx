"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon, XIcon } from "./icons";
import { cn } from "../utils/cn";
import { resetViewportZoom, viewportBox } from "../utils/viewport";

// Spotlight-rundvisningen. Hullet følger målets egne afrundede hjørner
// (box-shadow), så der ikke sidder en firkant uden om runde knapper.
// Zoom nulstilles, når turen starter, så spotlightet rammer det rigtige.

export type TourPage = "profile" | "home" | "practice" | "exam" | "symbols" | "lynkursus" | "udvikling";

interface TourStep {
  page: TourPage;
  target: string;
  title: string;
  text: string;
  alignTop?: boolean;
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
    text: "Hjem-fanen nederst på skærmen (på computer i venstre side) fører dig altid tilbage til forsiden med dine statusser og genveje til hele appen.",
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
    alignTop: true,
  },
  {
    page: "home",
    target: '[data-tour="hjem-udvikling"]',
    title: "Din udvikling-knappen",
    text: "Den aflange knap \"Din udvikling\" nederst på forsiden tager dig til siden med dine fremskridt: statistik pr. kategori, anbefalinger og en standpunktskarakter fra Lingua.",
    alignTop: true,
  },
];

interface HoleRect {
  top: number;
  left: number;
  width: number;
  height: number;
  radius: number;
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

  const prevActive = useRef(false);
  useEffect(() => {
    if (active && !prevActive.current) {
      setStep(0);
      setRect(null);
      resetViewportZoom();
    }
    prevActive.current = active;
  }, [active]);

  const measure = useCallback(() => {
    const el = document.querySelector<HTMLElement>(STEPS[step].target);
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (STEPS[step].alignTop) {
      const before = el.getBoundingClientRect();
      window.scrollBy({ top: before.top - 80, behavior: "auto" });
    } else {
      el.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
    }
    const r = el.getBoundingClientRect();
    const top = Math.max(0, r.top);
    const left = Math.max(0, r.left);
    const width = Math.min(vw - left, r.width);
    const height = Math.min(vh - top, r.height);
    if (width < 4 || height < 4) return;
    const rawRadius = parseFloat(window.getComputedStyle(el).borderRadius);
    const radius = Number.isFinite(rawRadius) ? rawRadius : 16;
    setRect({ top, left, width, height, radius });
  }, [step]);

  useEffect(() => {
    if (!active) return;
    onNavigate(STEPS[step].page);
    setRect(null);
    const delays = [40, 120, 280, 480, 800, 1400];
    const timers = delays.map((ms) => window.setTimeout(measure, ms));
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [active, step, onNavigate, measure]);

  useEffect(() => {
    if (!active) return;
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);
    window.visualViewport?.addEventListener("resize", onChange);
    window.visualViewport?.addEventListener("scroll", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
      window.visualViewport?.removeEventListener("resize", onChange);
      window.visualViewport?.removeEventListener("scroll", onChange);
    };
  }, [active, measure]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFinish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onFinish]);

  useEffect(() => {
    if (!rect) return;
    const { height: vh } = viewportBox();
    const bottom = rect.top + rect.height;
    setBubbleAbove(vh - bottom < 240);
  }, [rect]);

  function next() {
    if (isLast) {
      onFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  const PAD = 4;
  const hole = rect
    ? {
        top: Math.max(0, rect.top - PAD),
        left: Math.max(0, rect.left - PAD),
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        borderRadius: Math.max(rect.radius + PAD, 8),
      }
    : null;

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
          <div className="fixed inset-0 z-40" aria-hidden="true" />
          {!hole && (
            <div className="pointer-events-none fixed inset-0 z-40" style={{ background: "rgba(23, 18, 37, 0.8)" }} aria-hidden="true" />
          )}
          {hole && (
            <>
              <div
                className="pointer-events-none fixed z-40"
                style={{
                  top: hole.top,
                  left: hole.left,
                  width: hole.width,
                  height: hole.height,
                  borderRadius: hole.borderRadius,
                  boxShadow: "0 0 0 9999px rgba(23, 18, 37, 0.8)",
                }}
              />
              <div
                className="pointer-events-none fixed z-40 ring-2 ring-white/80"
                style={{
                  top: hole.top,
                  left: hole.left,
                  width: hole.width,
                  height: hole.height,
                  borderRadius: hole.borderRadius,
                }}
              />
            </>
          )}

          <div className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[#171225]/95 px-4 py-2.5 text-white shadow-lg">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/mascot/welcome.png" alt="" className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white/30" />
              <p className="truncate text-sm font-extrabold">Rundvisning med Lingua</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/80">
                Trin {step + 1} af {STEPS.length}
              </span>
              <button onClick={onFinish} className="rounded-full px-2 py-1 text-xs font-semibold text-white/60 transition hover:text-white">
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

          <motion.div
            className="fixed inset-x-4 z-50 mx-auto max-w-md"
            style={
              bubbleAbove
                ? { bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }
                : { top: (rect ? rect.top + rect.height : 0) + 18 }
            }
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start gap-3 rounded-3xl bg-white p-4 shadow-2xl dark:bg-[#241d38]">
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
