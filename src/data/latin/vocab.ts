// Latinsk ordforråd brugt i oversættelsesopgaverne. Dette er den "kilde",
// som både opgaverne OG oversættelsesarket (TranslationSheet) bygger på, så
// eleven altid kan slå de ord op, der rent faktisk optræder i øvelserne.
// Alle sætninger/gloser er skrevet fra bunden til APLOFT — intet er kopieret
// fra andre undervisningsmaterialer.

export interface VocabEntry {
  latin: string;
  danish: string;
  type: "substantiv" | "verbum" | "adjektiv" | "præposition" | "konjunktion" | "pronomen";
  note?: string; // fx bøjningsklasse eller grundform-info
}

export const LATIN_VOCAB: VocabEntry[] = [
  // ---- Substantiver, 1. deklination (a-stammer, overvejende hunkøn) ----
  { latin: "puella, puellae", danish: "pige", type: "substantiv", note: "1. deklination (f)" },
  { latin: "puer, pueri", danish: "dreng", type: "substantiv", note: "2. deklination (m)" },
  { latin: "femina, feminae", danish: "kvinde", type: "substantiv", note: "1. deklination (f)" },
  { latin: "agricola, agricolae", danish: "bonde", type: "substantiv", note: "1. deklination (m, uregelmæssigt køn)" },
  { latin: "rosa, rosae", danish: "rose", type: "substantiv", note: "1. deklination (f)" },
  { latin: "via, viae", danish: "vej", type: "substantiv", note: "1. deklination (f)" },
  { latin: "aqua, aquae", danish: "vand", type: "substantiv", note: "1. deklination (f)" },
  { latin: "terra, terrae", danish: "jord, land", type: "substantiv", note: "1. deklination (f)" },
  { latin: "insula, insulae", danish: "ø", type: "substantiv", note: "1. deklination (f)" },
  { latin: "silva, silvae", danish: "skov", type: "substantiv", note: "1. deklination (f)" },
  { latin: "vita, vitae", danish: "liv", type: "substantiv", note: "1. deklination (f)" },
  { latin: "fortuna, fortunae", danish: "held, skæbne", type: "substantiv", note: "1. deklination (f)" },
  // ---- Substantiver, 2. deklination (o-stammer, overvejende hankøn/intetkøn) ----
  { latin: "dominus, domini", danish: "herre", type: "substantiv", note: "2. deklination (m)" },
  { latin: "servus, servi", danish: "slave, tjener", type: "substantiv", note: "2. deklination (m)" },
  { latin: "amicus, amici", danish: "ven", type: "substantiv", note: "2. deklination (m)" },
  { latin: "deus, dei", danish: "gud", type: "substantiv", note: "2. deklination (m)" },
  { latin: "magister, magistri", danish: "lærer", type: "substantiv", note: "2. deklination (m)" },
  { latin: "liber, libri", danish: "bog", type: "substantiv", note: "2. deklination (m)" },
  { latin: "equus, equi", danish: "hest", type: "substantiv", note: "2. deklination (m)" },
  { latin: "gladius, gladii", danish: "sværd", type: "substantiv", note: "2. deklination (m)" },
  { latin: "templum, templi", danish: "tempel", type: "substantiv", note: "2. deklination (n)" },
  { latin: "bellum, belli", danish: "krig", type: "substantiv", note: "2. deklination (n)" },
  { latin: "donum, doni", danish: "gave", type: "substantiv", note: "2. deklination (n)" },
  { latin: "verbum, verbi", danish: "ord", type: "substantiv", note: "2. deklination (n)" },
  // ---- Substantiver, 3. deklination (blandet) ----
  { latin: "rex, regis", danish: "konge", type: "substantiv", note: "3. deklination (m)" },
  { latin: "canis, canis", danish: "hund", type: "substantiv", note: "3. deklination (m/f)" },
  { latin: "miles, militis", danish: "soldat", type: "substantiv", note: "3. deklination (m)" },
  { latin: "pater, patris", danish: "far", type: "substantiv", note: "3. deklination (m)" },
  { latin: "mater, matris", danish: "mor", type: "substantiv", note: "3. deklination (f)" },
  { latin: "urbs, urbis", danish: "by", type: "substantiv", note: "3. deklination (f)" },
  { latin: "pax, pacis", danish: "fred", type: "substantiv", note: "3. deklination (f)" },
  { latin: "tempus, temporis", danish: "tid", type: "substantiv", note: "3. deklination (n)" },
  // ---- Verber ----
  { latin: "esse, sum, fui", danish: "at være", type: "verbum" },
  { latin: "amare, amo, amavi", danish: "at elske", type: "verbum", note: "1. konjugation" },
  { latin: "vocare, voco, vocavi", danish: "at kalde", type: "verbum", note: "1. konjugation" },
  { latin: "laudare, laudo, laudavi", danish: "at rose", type: "verbum", note: "1. konjugation" },
  { latin: "portare, porto, portavi", danish: "at bære", type: "verbum", note: "1. konjugation" },
  { latin: "dare, do, dedi", danish: "at give", type: "verbum", note: "1. konjugation (uregelmæssig kort a)" },
  { latin: "habere, habeo, habui", danish: "at have", type: "verbum", note: "2. konjugation" },
  { latin: "videre, video, vidi", danish: "at se", type: "verbum", note: "2. konjugation" },
  { latin: "manere, maneo, mansi", danish: "at blive (på et sted)", type: "verbum", note: "2. konjugation" },
  { latin: "dicere, dico, dixi", danish: "at sige", type: "verbum", note: "3. konjugation" },
  { latin: "scribere, scribo, scripsi", danish: "at skrive", type: "verbum", note: "3. konjugation" },
  { latin: "mittere, mitto, misi", danish: "at sende", type: "verbum", note: "3. konjugation" },
  { latin: "currere, curro, cucurri", danish: "at løbe", type: "verbum", note: "3. konjugation" },
  { latin: "audire, audio, audivi", danish: "at høre", type: "verbum", note: "4. konjugation" },
  { latin: "venire, venio, veni", danish: "at komme", type: "verbum", note: "4. konjugation" },
  { latin: "cantare, canto, cantavi", danish: "at synge", type: "verbum", note: "1. konjugation" },
  // ---- Adjektiver ----
  { latin: "bonus, bona, bonum", danish: "god", type: "adjektiv" },
  { latin: "malus, mala, malum", danish: "dårlig, ond", type: "adjektiv" },
  { latin: "magnus, magna, magnum", danish: "stor", type: "adjektiv" },
  { latin: "parvus, parva, parvum", danish: "lille", type: "adjektiv" },
  { latin: "longus, longa, longum", danish: "lang", type: "adjektiv" },
  { latin: "pulcher, pulchra, pulchrum", danish: "smuk", type: "adjektiv" },
  { latin: "novus, nova, novum", danish: "ny", type: "adjektiv" },
  { latin: "multus, multa, multum", danish: "megen, mange", type: "adjektiv" },
  // ---- Præpositioner ----
  { latin: "in (+ abl./akk.)", danish: "i / ind i", type: "præposition" },
  { latin: "ad (+ akk.)", danish: "til, hen imod", type: "præposition" },
  { latin: "cum (+ abl.)", danish: "med", type: "præposition" },
  { latin: "de (+ abl.)", danish: "om, fra", type: "præposition" },
  { latin: "ex/e (+ abl.)", danish: "ud af, fra", type: "præposition" },
  { latin: "sine (+ abl.)", danish: "uden", type: "præposition" },
  // ---- Konjunktioner ----
  { latin: "et", danish: "og", type: "konjunktion" },
  { latin: "sed", danish: "men", type: "konjunktion" },
  { latin: "quod / quia", danish: "fordi", type: "konjunktion" },
  { latin: "si", danish: "hvis", type: "konjunktion" },
  { latin: "ubi", danish: "hvor / da", type: "konjunktion" },
  // ---- Pronominer ----
  { latin: "ego, mei", danish: "jeg", type: "pronomen" },
  { latin: "tu, tui", danish: "du", type: "pronomen" },
  { latin: "is, ea, id", danish: "han, hun, det (den/det)", type: "pronomen" },
  { latin: "hic, haec, hoc", danish: "denne, dette", type: "pronomen" },
  { latin: "qui, quae, quod", danish: "som, der (relativt pronomen)", type: "pronomen" },
  { latin: "nos", danish: "vi", type: "pronomen" },
  { latin: "vos", danish: "I", type: "pronomen" },
  { latin: "ei, eae, ea", danish: "de", type: "pronomen" },
];

export function findVocab(latinWord: string): VocabEntry | undefined {
  const norm = latinWord.toLowerCase();
  return LATIN_VOCAB.find((v) => v.latin.toLowerCase().startsWith(norm));
}
