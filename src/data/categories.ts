import type { CategoryDef } from "../types";

// Rækkefølgen herunder er bevidst: de mest grundlæggende og vigtigste emner
// (dem alt andet bygger ovenpå) står øverst, mens mere overordnede/abstrakte
// emner kommer sidst. Fx skal man kende kasus godt, før sætningsled og latinsk
// grammatik giver mening — derfor ligger "Kasus-masterclass" allerøverst.
export const ALMEN_CATEGORIES: CategoryDef[] = [
  {
    id: "kasus",
    track: "almen",
    title: "Kasus-masterclass",
    short: "Kasus",
    description: "Det vigtigste at kunne først: hvad danner hvad? Nominativ, akkusativ, dativ og genitiv med skemaer.",
    color: "violet",
    icon: "kasus",
  },
  {
    id: "ordklasser",
    track: "almen",
    title: "Ordklasser",
    short: "Ordklasser",
    description: "Kend forskel på substantiver, verber, adjektiver og de andre ordklasser.",
    color: "purple",
    icon: "ordklasser",
  },
  {
    id: "saetningsled",
    track: "almen",
    title: "Sætningsled",
    short: "Sætningsled",
    description: "Find grundled, udsagnsled, genstandsled og de andre led med de 7 symboler.",
    color: "blue",
    icon: "saetningsled",
  },
  {
    id: "tempus",
    track: "almen",
    title: "Tempus (verbaltider)",
    short: "Tempus",
    description: "Nutid, datid, førnutid, førdatid og fremtid på dansk, engelsk og latin.",
    color: "cyan",
    icon: "tempus",
  },
  {
    id: "morfologi",
    track: "almen",
    title: "Morfologi",
    short: "Morfologi",
    description: "Forstå hvordan ord er bygget op af forstavelser, rødder og endelser.",
    color: "emerald",
    icon: "morfologi",
  },
  {
    id: "syntaks",
    track: "almen",
    title: "Syntaks",
    short: "Syntaks",
    description: "Ledsætninger, komma, ordstilling og engelsk syntaks på tværs af sprog.",
    color: "amber",
    icon: "syntaks",
  },
  {
    id: "sprog",
    track: "almen",
    title: "Sprog & Kommunikation",
    short: "Sprog i verden",
    description: "Sprogfamilier, sprogtypologi og kommunikationsmodellen.",
    color: "rose",
    icon: "sprog",
  },
];

export const LATIN_CATEGORIES: CategoryDef[] = [
  {
    id: "sumesse",
    track: "latin",
    title: "Sum, es, est-forløbet",
    short: "Sum, es, est",
    description: "Fra nul til hero: lær 'esse' (at være) udenad — sum, es, est, sumus, estis, sunt.",
    color: "fuchsia",
    icon: "sumesse",
  },
  {
    id: "grammatik",
    track: "latin",
    title: "Latinsk grammatik",
    short: "Grammatik",
    description: "Kasus, bøjninger og grundlæggende latinsk sætningsbygning.",
    color: "teal",
    icon: "grammatik",
  },
  {
    id: "ordforraad",
    track: "latin",
    title: "Latinsk ordforråd",
    short: "Ordforråd",
    description: "Genkend latinske rødder og hvordan de lever videre i dansk og engelsk.",
    color: "orange",
    icon: "ordforraad",
  },
  {
    id: "oversaettelse",
    track: "latin",
    title: "Oversættelse",
    short: "Oversættelse",
    description: "Træn at oversætte latinske sætninger. Brug oversættelsesarket som hjælp.",
    color: "indigo",
    icon: "oversaettelse",
  },
  {
    id: "kultur",
    track: "latin",
    title: "Romersk kultur & historie",
    short: "Kultur & historie",
    description: "Romerriget, hverdagsliv og arven fra antikken.",
    color: "red",
    icon: "kultur",
  },
];

export const ALL_CATEGORIES: CategoryDef[] = [...ALMEN_CATEGORIES, ...LATIN_CATEGORIES];

export function getCategory(id: string): CategoryDef | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export const CATEGORY_COLOR_CLASSES: Record<string, { bg: string; text: string; ring: string; solid: string }> = {
  purple: { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-300", solid: "bg-purple-500" },
  blue: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-300", solid: "bg-blue-500" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-300", solid: "bg-emerald-500" },
  amber: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300", solid: "bg-amber-500" },
  rose: { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-300", solid: "bg-rose-500" },
  orange: { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300", solid: "bg-orange-500" },
  teal: { bg: "bg-teal-100", text: "text-teal-700", ring: "ring-teal-300", solid: "bg-teal-500" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700", ring: "ring-indigo-300", solid: "bg-indigo-500" },
  red: { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-300", solid: "bg-red-500" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-700", ring: "ring-cyan-300", solid: "bg-cyan-500" },
  violet: { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-300", solid: "bg-violet-500" },
  fuchsia: { bg: "bg-fuchsia-100", text: "text-fuchsia-700", ring: "ring-fuchsia-300", solid: "bg-fuchsia-500" },
};
