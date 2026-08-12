import type { CategoryDef, Education } from "../types";

// Rækkefølgen herunder er bevidst: de mest grundlæggende og vigtigste emner
// (dem alt andet bygger ovenpå) står øverst, mens mere overordnede/abstrakte
// emner kommer sidst. Fx skal man kende kasus godt, før sætningsled og latinsk
// grammatik giver mening ; derfor ligger "Kasus-masterclass" allerøverst.
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
 description: "Fra nul til hero: lær 'esse' (at være) udenad ; sum, es, est, sumus, estis, sunt.",
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

// HHX SPOR: de fælles grammatik-kategorier (genbrugt fra STX-siden, da de
// svarer til læreplanens "grammatisk terminologi og analysefærdighed") plus
// de HHX-specifikke emner fra læreplanens faglige indhold. Rækkefølgen er
// bevidst progressiv: først det fælles fundament, så kommunikation og
// betydning, til sidst sproghistorie og læringsstrategier.
export const HHX_CATEGORIES: CategoryDef[] = [
 {
 id: "ordklasser",
 track: "hhx",
 title: "Ordklasser",
 short: "Ordklasser",
 description: "Kend forskel på substantiver, verber, adjektiver og de andre ordklasser ; samme grundlag på HHX.",
 color: "blue",
 icon: "ordklasser",
 },
 {
 id: "saetningsled",
 track: "hhx",
 title: "Sætningsled & syntaktisk analyse",
 short: "Sætningsled",
 description: "Find grundled, udsagnsled og genstandsled med de 7 symboler ; og brug dem på dansk og engelsk.",
 color: "cyan",
 icon: "saetningsled",
 },
 {
 id: "morfologi",
 track: "hhx",
 title: "Morfologi & bøjning",
 short: "Morfologi",
 description: "Forstå hvordan ord er bygget op af forstavelser, rødder og endelser ; og hvordan ord bøjes.",
 color: "teal",
 icon: "morfologi",
 },
 {
 id: "tempus",
 track: "hhx",
 title: "Tempus (verbaltider)",
 short: "Tempus",
 description: "Nutid, datid, førnutid, førdatid og fremtid på dansk og engelsk.",
 color: "indigo",
 icon: "tempus",
 },
 {
 id: "syntaks",
 track: "hhx",
 title: "Sætningstyper & syntaks",
 short: "Syntaks",
 description: "Helsætninger, ledsætninger, komma og ordstilling ; også på engelsk.",
 color: "violet",
 icon: "syntaks",
 },
 {
 id: "kommunikation",
 track: "hhx",
 title: "Kommunikation",
 short: "Kommunikation",
 description: "Kommunikationsmodellen, verbal & non-verbal kommunikation og det udvidede tekstbegreb.",
 color: "blue",
 icon: "kommunikation",
 },
 {
 id: "sproghandlinger",
 track: "hhx",
 title: "Sproghandlinger",
 short: "Sproghandlinger",
 description: "Hvad vi GØR med sprog: påstå, spørge, opfordre, love, råde ; direkte og indirekte.",
 color: "amber",
 icon: "sproghandlinger",
 },
 {
 id: "semantik",
 track: "hhx",
 title: "Semantik (betydning)",
 short: "Semantik",
 description: "Sprogets udtryks- og indholdsside: synonymer, homonymer, metaforer og konnotationer.",
 color: "violet",
 icon: "semantik",
 },
 {
 id: "pragmatik",
 track: "hhx",
 title: "Pragmatik (sprog i brug)",
 short: "Pragmatik",
 description: "Sprog i private, faglige og professionelle sammenhænge ; og det, der står mellem linjerne.",
 color: "teal",
 icon: "pragmatik",
 },
 {
 id: "genrer",
 track: "hhx",
 title: "Genrer & medier",
 short: "Genrer & medier",
 description: "Genre- og mediebevidst formidling: forretningsmailen, reklamen, pressemeddelelsen og SoMe.",
 color: "rose",
 icon: "genrer",
 },
 {
 id: "sproghistorie",
 track: "hhx",
 title: "Sproghistorie & sprog i verden",
 short: "Sproghistorie",
 description: "Sprogfamilier, lånord, engelsk som lingua franca og sprog i globaliseringens tidsalder.",
 color: "indigo",
 icon: "sproghistorie",
 },
 {
 id: "laeringsstrategier",
 track: "hhx",
 title: "Læringsstrategier",
 short: "Læringsstrategier",
 description: "Lær fremmedsprog klogt: transfer, mønstergenkendelse, gloser og kontekstgætning.",
 color: "emerald",
 icon: "laeringsstrategier",
 },
];

export const STX_CATEGORIES: CategoryDef[] = [...ALMEN_CATEGORIES, ...LATIN_CATEGORIES];

// Bemærk: STX og HHX deler nogle kategori-id'er (fx "ordklasser"). Brug
// derfor altid getCategory(id, education), så HHX ikke får STX-farver/tekst.
export const ALL_CATEGORIES: CategoryDef[] = [...STX_CATEGORIES, ...HHX_CATEGORIES];

export function getCategory(id: string, education?: Education): CategoryDef | undefined {
  if (education === "hhx") {
    return HHX_CATEGORIES.find((c) => c.id === id) ?? STX_CATEGORIES.find((c) => c.id === id);
  }
  return STX_CATEGORIES.find((c) => c.id === id) ?? HHX_CATEGORIES.find((c) => c.id === id);
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
