import type { CategoryDef, Education } from "../types";
import { ALMEN_CATEGORIES, LATIN_CATEGORIES, STX_CATEGORIES } from "./categories/stx";
import { HHX_CATEGORIES } from "./categories/hhx";

// Denne fil er kun en lille facade for fælles opslag og farveklasser. Selve
// STX- og HHX-definitionerne bor med vilje i hver sin fil (categories/stx.ts
// og categories/hhx.ts), så de ikke kan havne i samme renderliste ved et uheld.
export { ALMEN_CATEGORIES, LATIN_CATEGORIES, STX_CATEGORIES } from "./categories/stx";
export { HHX_CATEGORIES } from "./categories/hhx";

/** Returnerer kun kategorierne for den aktive uddannelse, uden dubletter. */
export function getCategoriesForEducation(education: Education): CategoryDef[] {
  return education === "hhx" ? HHX_CATEGORIES : STX_CATEGORIES;
}

/** Slår en kategori op i det aktive uddannelsesspor. */
export function getCategory(id: string, education: Education): CategoryDef | undefined {
  return getCategoriesForEducation(education).find((category) => category.id === id);
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
