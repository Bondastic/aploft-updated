// Lille, afhængighedsfri hjælper til nattetilstand (dark mode).
// Tilstanden gemmes i localStorage, så den huskes på tværs af besøg,
// og "dark"-klassen sættes/fjernes direkte på <html>, som Tailwinds
// class-baserede dark-variant (se globals.css) lytter efter.
const KEY = "aploft.darkmode";

export function isDarkModeOn(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function setDarkMode(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", on);
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // ignore
  }
}

export function loadStoredDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}
