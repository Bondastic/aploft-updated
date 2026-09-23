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
            <div className="pointer-events-none fixed inset-0 z-40" style={{ background: "rgba(15, 13, 18, 0.82)" }} aria-hidden="true" />
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
                  boxShadow: "0 0 0 9999px rgba(15, 13, 18, 0.82)",
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

          <div className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-black/90 px-4 py-2.5 text-white shadow-lg">
            <div className="flex min-w-0 items-center gap-2.5">
              <p className="truncate text-sm font-extrabold tracking-tight">Rundvisning med Lingua</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white/80">
                Trin {step + 1} af {STEPS.length}
              </span>
              <button onClick={onFinish} className="rounded-sm px-2 py-1 text-xs font-semibold text-white/60 transition-colors hover:text-white">
                Spring over
              </button>
              <button
                onClick={onFinish}
                aria-label="Luk rundvisning"
                className="rounded-sm bg-white/10 p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
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
            <div className="modal p-4">
              <p className="eyebrow">Rundvisning</p>
              <p className="section-title mt-1">{current.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">{current.text}</p>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={next}
                className="btn bg-white px-6 py-2.5 text-ink hover:bg-white/90"
              >
                {isLast ? "Færdig" : "Næste"}
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
