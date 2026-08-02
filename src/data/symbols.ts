import type { LedSymbol } from "../types";

export interface SymbolDef {
  symbol: LedSymbol;
  name: string;
  short: string;
  description: string;
  example: string;
  colorClasses: string;
}

// De 7 officielle sætningsled-symboler (analysetegn).
// Hensynsled er firkanten (□), og omsagnsleddet er delt op i to tegn:
// subjektsprædikat (⊗, cirkel med kryds) og objektsprædikat
// (cirkel med trekant). Tegnene tegnes af LedGlyph i components/icons.tsx.
export const SYMBOLS: SymbolDef[] = [
  {
    symbol: "subjekt",
    name: "Grundled (subjekt)",
    short: "Grundled",
    description:
      "Den eller det, der udfører handlingen, eller som sætningen handler om. Spørg: hvem/hvad + udsagnsled?",
    example: "Katten sover på sofaen.",
    colorClasses: "bg-blue-100 text-blue-700 border-blue-300",
  },
  {
    symbol: "verbal",
    name: "Udsagnsled (verballed)",
    short: "Udsagnsled",
    description:
      "Det finitte verbum i sætningen. Det fortæller, hvad grundleddet gør, eller hvad der sker.",
    example: "Katten sover på sofaen.",
    colorClasses: "bg-red-100 text-red-700 border-red-300",
  },
  {
    symbol: "objekt",
    name: "Genstandsled (direkte objekt)",
    short: "Genstandsled",
    description: "Det, som handlingen går ud over. Spørg: udsagnsled + hvem/hvad?",
    example: "Peter læser bogen.",
    colorClasses: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
  {
    symbol: "dativ",
    name: "Hensynsled (indirekte objekt)",
    short: "Hensynsled",
    description:
      "Den, som handlingen kommer til gode eller går ud over (skaber dativ). Spørg: til/for hvem?",
    example: "Peter giver Mia bogen.",
    colorClasses: "bg-teal-100 text-teal-700 border-teal-300",
  },
  {
    symbol: "adverbial",
    name: "Adverbial (biled)",
    short: "Adverbial",
    description:
      "Fortæller om tid, sted, måde eller grad: omstændighederne omkring handlingen.",
    example: "Peter læser bogen i går aftes.",
    colorClasses: "bg-amber-100 text-amber-700 border-amber-300",
  },
  {
    symbol: "subjpred",
    name: "Subjektsprædikat (omsagnsled til grundled)",
    short: "Subjektsprædikat",
    description:
      "Siger noget om grundleddet og optræder ofte efter et kopulaverbum (er, bliver, hedder, kaldes).",
    example: "Peter er glad.",
    colorClasses: "bg-purple-100 text-purple-700 border-purple-300",
  },
  {
    symbol: "objpred",
    name: "Objektsprædikat (omsagnsled til genstandsled)",
    short: "Objektsprædikat",
    description:
      "Siger noget om genstandsleddet og optræder ofte efter verber som kalde, gøre, nævne, vælge.",
    example: "Vi kalder hunden Fido.",
    colorClasses: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
  },
];

export const SYMBOL_COLOR_CLASSES: Record<LedSymbol, string> = SYMBOLS.reduce(
  (acc, s) => ({ ...acc, [s.symbol]: s.colorClasses }),
  {} as Record<LedSymbol, string>
);

export function getSymbolDef(symbol: LedSymbol): SymbolDef {
  return SYMBOLS.find((s) => s.symbol === symbol)!;
}
