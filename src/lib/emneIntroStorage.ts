// Hvilke emne-introduktioner eleven har læst. Gemmes lokalt (som resten af
// appen) : intet sendes nogen steder. Læsesiden vises automatisk første gang,
// man åbner et emne, og kan altid åbnes igen fra emnets forside.
const KEY = "aploft.emneintro.seen.v1";

export function loadSeenIntros(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function markIntroSeen(categoryId: string): string[] {
  const next = Array.from(new Set([...loadSeenIntros(), categoryId]));
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Kan ikke gemmes (privat vindue): læsesiden dukker bare op igen.
  }
  return next;
}

export function clearSeenIntros(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignoreres
  }
}
