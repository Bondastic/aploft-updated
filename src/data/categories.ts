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
 description: "Find subjekt, verballed, direkte objekt og de andre led med de 7 symboler.",
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
 description: "Find subjekt, verballed og direkte objekt med de 7 symboler ; og brug dem på dansk og engelsk.",
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

// Kategorifarver fra designsystemets dæmpede arkiv-toner (globals.css) — ikke
// Tailwinds standardpalet. Tonen vises som hårfin nøglelinje, ikonfarve og
// fin fremdriftsbjælke; aldrig som farvet boks eller glød. Flere kategorier
// deler bevidst tone, så paletten holdes rolig.
export const CATEGORY_COLOR_CLASSES: Record<string, { bg: string; text: string; ring: string; solid: string }> = {
 purple: { bg: "bg-plum-soft", text: "text-plum-base", ring: "ring-plum-base/30", solid: "bg-plum-base" },
 blue: { bg: "bg-slate-soft", text: "text-slate-base", ring: "ring-slate-base/30", solid: "bg-slate-base" },
 emerald: { bg: "bg-pine-soft", text: "text-pine-base", ring: "ring-pine-base/30", solid: "bg-pine-base" },
 amber: { bg: "bg-ochre-soft", text: "text-ochre-base", ring: "ring-ochre-base/30", solid: "bg-ochre-base" },
 rose: { bg: "bg-rust-soft", text: "text-rust-base", ring: "ring-rust-base/30", solid: "bg-rust-base" },
 orange: { bg: "bg-clay-soft", text: "text-clay-base", ring: "ring-clay-base/30", solid: "bg-clay-base" },
 teal: { bg: "bg-sea-soft", text: "text-sea-base", ring: "ring-sea-base/30", solid: "bg-sea-base" },
 indigo: { bg: "bg-slate-soft", text: "text-slate-base", ring: "ring-slate-base/30", solid: "bg-slate-base" },
 red: { bg: "bg-rust-soft", text: "text-rust-base", ring: "ring-rust-base/30", solid: "bg-rust-base" },
 cyan: { bg: "bg-sea-soft", text: "text-sea-base", ring: "ring-sea-base/30", solid: "bg-sea-base" },
 violet: { bg: "bg-plum-soft", text: "text-plum-base", ring: "ring-plum-base/30", solid: "bg-plum-base" },
 fuchsia: { bg: "bg-mulberry-soft", text: "text-mulberry-base", ring: "ring-mulberry-base/30", solid: "bg-mulberry-base" },
};
