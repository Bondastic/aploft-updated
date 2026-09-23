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
// Terminologipolitik (vigtig!): De LATINSKE betegnelser er de PRIMÆRE overalt
// i appen - de danske (grundled, udsagnsled osv.) må kun stå i parentes som
// hjælp. Det er en direkte følge af feedback fra en AP-koordinator (STX), der
// kun underviser og eksaminerer i de latinske navne.
// Hensynsled/indirekte objekt er firkanten (□), og prædikaterne er delt op i
// to tegn: subjektsprædikat (⊗, cirkel med kryds) og objektsprædikat
// (cirkel med trekant). Tegnene tegnes af LedGlyph i components/icons.tsx.
export const SYMBOLS: SymbolDef[] = [
  {
    symbol: "subjekt",
    name: "Subjekt (grundled)",
    short: "Subjekt",
    description:
      "Den eller det, der udfører handlingen, eller som sætningen handler om. Spørg: hvem/hvad + verballed?",
    example: "Katten sover på sofaen.",
    colorClasses: "bg-slate-soft text-slate-base border-slate-base/40",
  },
  {
    symbol: "verbal",
    name: "Verballed (udsagnsled)",
    short: "Verballed",
    description:
      "Det finitte verbum i sætningen. Det fortæller, hvad subjektet gør, eller hvad der sker.",
    example: "Katten sover på sofaen.",
    colorClasses: "bg-rust-soft text-rust-base border-rust-base/40",
  },
  {
    symbol: "objekt",
    name: "Direkte objekt (genstandsled)",
    short: "Direkte objekt",
    description: "Det, som handlingen går ud over. Spørg: verballed + hvem/hvad?",
    example: "Peter læser bogen.",
    colorClasses: "bg-pine-soft text-pine-base border-pine-base/40",
  },
  {
    symbol: "dativ",
    name: "Indirekte objekt (hensynsled)",
    short: "Indirekte objekt",
    description:
      "Den, som handlingen kommer til gode eller går ud over (skaber dativ). Spørg: til/for hvem?",
    example: "Peter giver Mia bogen.",
    colorClasses: "bg-sea-soft text-sea-base border-sea-base/40",
  },
  {
    symbol: "adverbial",
    name: "Adverbial (biled)",
    short: "Adverbial",
    description:
      "Fortæller om tid, sted, måde eller grad: omstændighederne omkring handlingen.",
    example: "Peter læser bogen i går aftes.",
    colorClasses: "bg-ochre-soft text-ochre-base border-ochre-base/40",
  },
  {
    symbol: "subjpred",
    name: "Subjektsprædikat (omsagnsled til subjektet)",
    short: "Subjektsprædikat",
    description:
      "Siger noget om subjektet og optræder ofte efter et kopulaverbum (er, bliver, hedder, kaldes).",
    example: "Peter er glad.",
    colorClasses: "bg-plum-soft text-plum-base border-plum-base/40",
  },
  {
    symbol: "objpred",
    name: "Objektsprædikat (omsagnsled til det direkte objekt)",
    short: "Objektsprædikat",
    description:
      "Siger noget om det direkte objekt og optræder ofte efter verber som kalde, gøre, nævne, vælge.",
    example: "Vi kalder hunden Fido.",
    colorClasses: "bg-mulberry-soft text-mulberry-base border-mulberry-base/40",
  },
];

export const SYMBOL_COLOR_CLASSES: Record<LedSymbol, string> = SYMBOLS.reduce(
  (acc, s) => ({ ...acc, [s.symbol]: s.colorClasses }),
  {} as Record<LedSymbol, string>
);

export function getSymbolDef(symbol: LedSymbol): SymbolDef {
  return SYMBOLS.find((s) => s.symbol === symbol)!;
}
