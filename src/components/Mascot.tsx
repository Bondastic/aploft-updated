"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MascotPose } from "../types";

const POSE_IMAGES: Record<MascotPose, string> = {
  welcome: "/mascot/welcome.png",
  explain: "/mascot/explain.png",
  celebrate: "/mascot/celebrate.png",
  surprise: "/mascot/surprise.png",
  encourage: "/mascot/encourage.png",
  thinking: "/mascot/thinking.png",
  thumbsup: "/mascot/thumbsup.png",
  chaos: "/mascot/chaos.png",
};

const POSE_LINES: Record<MascotPose, string[]> = {
  welcome: ["Hej med dig! Klar til at træne AP?", "Godt at se dig igen!"],
  explain: ["Lad mig forklare det her.", "Se lige denne regel."],
  celebrate: ["Fantastisk klaret!", "Du er i topform i dag!"],
  surprise: ["Uh, den var svær!", "Det havde jeg ikke set komme."],
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
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-36 w-36",
    xl: "h-52 w-52",
  }[size];

  const line = speech === undefined ? POSE_LINES[pose][0] : speech;

  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <div className={`relative shrink-0 ${sizeClasses}`}>
        <AnimatePresence mode="wait">
          {reduceMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={pose}
              src={POSE_IMAGES[pose]}
              alt={`Maskot: ${pose}`}
              className="h-full w-full rounded-full object-cover shadow-lg shadow-purple-200 ring-4 ring-white"
            />
          ) : (
            <motion.img
              key={pose}
              src={POSE_IMAGES[pose]}
              alt={`Maskot: ${pose}`}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-full w-full rounded-full object-cover shadow-lg shadow-purple-200 ring-4 ring-white"
            />
          )}
        </AnimatePresence>
      </div>
      {line ? (
        reduceMotion ? (
          <div className="relative mb-1 max-w-[220px] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm font-medium text-ink shadow-md ring-1 ring-black/5">
            {line}
          </div>
        ) : (
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-1 max-w-[220px] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm font-medium text-ink shadow-md ring-1 ring-black/5"
          >
            {line}
          </motion.div>
        )
      ) : null}
    </div>
  );
}
