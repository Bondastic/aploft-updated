"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MascotPose } from "../types";

// Lingua er appens figur, men udtrykket er bevidst redaktionelt frem for
// "cute maskot": et gråtonet portræt i skarp ramme og en kort, kursiveret
// replik som et citation med en hårfin venstrestreg — ikke en taleboble.
// Komponentens API er uændret, så al kald-logik bevares.

const POSE_IMAGES: Record<MascotPose, string> = {
  welcome: "/mascot/welcome.webp",
  explain: "/mascot/explain.webp",
  celebrate: "/mascot/celebrate.webp",
  surprise: "/mascot/surprise.webp",
  encourage: "/mascot/encourage.webp",
  thinking: "/mascot/thinking.webp",
  thumbsup: "/mascot/thumbsup.webp",
  chaos: "/mascot/chaos.webp",
};

const POSE_LINES: Record<MascotPose, string[]> = {
  welcome: ["Hej med dig! Klar til at træne AP?", "Godt at se dig igen!"],
  explain: ["Lad mig forklare det her.", "Se lige denne regel."],
  celebrate: ["Fantastisk klaret!", "Du er i topform i dag!"],
  surprise: ["Uh, den var svær!", "Det havde jeg ikke set kommet."],
  encourage: ["Du kan godt! Prøv igen.", "Næsten! Kom nu."],
  thinking: [
    "Tag dig god tid.",
    "Du kan godt – tænk det igennem.",
    "Hvad virker mest sandsynligt?",
    "Læs spørgsmålet én gang mere.",
    "Hvilket svar passer bedst?",
    "Du har tid til at overveje det.",
    "Prøv at bruge det, du allerede ved.",
    "Ét skridt ad gangen.",
    "Tænk roligt over mulighederne.",
    "Jeg tror på, at du kan finde svaret.",
  ],
  thumbsup: [
    "Lige præcis!",
    "Godt set!",
    "Det var helt rigtigt.",
    "Flot klaret!",
    "Ja, den sad!",
    "Godt arbejde!",
    "Du har styr på den.",
    "Det var et godt valg.",
    "Perfekt!",
    "Spot on!",
    "Det er korrekt.",
    "Sådan!",
    "Den klarede du flot.",
    "Det var skarpt set.",
    "Yes! Det var rigtigt.",
    "Det ser godt ud.",
    "Du er godt på vej.",
    "Du ramte plet.",
    "Det var en sikker besvarelse.",
    "Fortsæt det gode arbejde!",
  ],
  chaos: ["Puha, det gik stærkt!", "Lad os samle trådene igen."],
};

export default function Mascot({
  pose,
  size = "md",
  speech,
  reduceMotion = false,
  className = "",
}: {
  pose: MascotPose;
  size?: "sm" | "md" | "lg" | "xl";
  speech?: string | null;
  reduceMotion?: boolean;
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-14 w-14",
    md: "h-20 w-20",
    lg: "h-28 w-28",
    xl: "h-44 w-44",
  }[size];

  const line = speech === undefined ? POSE_LINES[pose][0] : speech;

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <div className={`relative shrink-0 ${sizeClasses}`}>
        <AnimatePresence mode="wait" initial={false}>
          {reduceMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={pose}
              src={POSE_IMAGES[pose]}
              alt={`Lingua: ${pose}`}
              className="h-full w-full rounded-sm border border-ink/15 object-cover grayscale contrast-[1.05]"
            />
          ) : (
            <motion.img
              key={pose}
              src={POSE_IMAGES[pose]}
              alt={`Lingua: ${pose}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="h-full w-full rounded-sm border border-ink/15 object-cover grayscale contrast-[1.05]"
            />
          )}
        </AnimatePresence>
      </div>
      {line ? (
        reduceMotion ? (
          <p className="mb-1 max-w-[240px] border-l-2 border-ink/20 pl-3 text-sm italic leading-relaxed text-ink/60">
            {line}
          </p>
        ) : (
          <motion.p
            key={line}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mb-1 max-w-[240px] border-l-2 border-ink/20 pl-3 text-sm italic leading-relaxed text-ink/60"
          >
            {line}
          </motion.p>
        )
      ) : null}
    </div>
  );
}
