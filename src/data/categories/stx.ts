import type { CategoryDef } from "../../types";

// STX-kategorierne er bevidst samlet i deres egen fil. De må aldrig blandes
// med HHX-definitionerne i en liste, der bruges direkte af en skærm.

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

export const STX_CATEGORIES: CategoryDef[] = [...ALMEN_CATEGORIES, ...LATIN_CATEGORIES];
