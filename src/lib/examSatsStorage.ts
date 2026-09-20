// Lille localStorage-lagrer for hvilke eksamenssæt, eleven har prøvet.
// Indeholder IKKE persondata : kun sæt-ids (og sidst spillede id), så
// rotationen ("aldrig det samme sæt to gange i træk") kan overleve genindlæsning.

const KEY = "aploft.examsats.used.v1";

export type ExamSatsUsage = { usedIds: string[]; lastId: string | null };

const EMPTY: ExamSatsUsage = { usedIds: [], lastId: null };

export function loadExamSatsUsage(): ExamSatsUsage {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as ExamSatsUsage).usedIds) &&
      typeof (parsed as ExamSatsUsage).lastId === "string"
    ) {
      const u = parsed as ExamSatsUsage;
      return { usedIds: u.usedIds.filter((x): x is string => typeof x === "string"), lastId: u.lastId };
    }
    // gammel/ugyldig struktur : start forfra (det er ikke data, vi er sure over at miste)
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Marker at et sæt er påbegyndt (kaldes når prøven startes, ikke når den afleveres). */
export function markExamSatsUsed(satsId: string): ExamSatsUsage {
  const next = loadExamSatsUsage();
  if (!next.usedIds.includes(satsId)) next.usedIds.push(satsId);
  next.lastId = satsId;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // privat tilstand/fuld disk : rotationen holder bare pause indtil næste gang
  }
  return next;
}

/** Nulstil prøvet-historik (bruges fra Profil → Nulstil, så man kan prøve alle sæt igen). */
export function clearExamSatsUsage(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
