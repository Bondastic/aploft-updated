import type { IconName, LedSymbol } from "../types";

type IconProps = { className?: string };

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function PracticeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
      <path d="M4 19a2 2 0 0 0 2 2h14" />
      <path d="M8 7h8M8 11h8" />
    </svg>
  );
}

export function ExamIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

export function SymbolsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <circle cx="17.5" cy="6.5" r="3.5" />
      <path d="M3.5 21l6-11 6 11z" />
      <path d="M14 21h7" />
    </svg>
  );
}

export function ProfileIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c1 3-2 4-2 7a4 4 0 1 0 8 0c0-1-.5-2-1-2 .5 2-1 3-1 3 .3-2-1-3-1-4.5C15 4 13.5 2.5 12 2z" />
      <path d="M8.5 13a3.5 3.5 0 1 0 7 0c0-1.2-.6-2-1.3-2.8.2 1.3-.7 2-1.2 2.8.1-1.3-.5-2-1-3-.7 1-1.5 1.7-2 2.2-.5.5-1.5 1-1.5.8z" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ScrollIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 21h9a2 2 0 0 0 2-2v-1H10v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2h4" />
      <path d="M8 21a2 2 0 0 1-2-2V5" />
      <path d="M10 8h7M10 12h7" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l1.6 4.8L18 8.4l-4.4 1.6L12 15l-1.6-5L6 8.4l4.4-1.6z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" />
    </svg>
  );
}

export function BookLatinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 7h7M9 11h5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sætningsled-symboler (analysetegn). Tegnes som SVG, så de altid ser ens ud,
// også ⊗ og cirkel-med-trekant som ellers ikke findes som et enkelt Unicode-tegn.
// Alle tegn er originale streger: ingen copyright.
// ---------------------------------------------------------------------------

export function LedGlyph({ symbol, className, strokeWidth = 2 }: { symbol: LedSymbol; className?: string; strokeWidth?: number }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (symbol) {
    case "subjekt": // ×
      return (
        <svg {...common}>
          <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
        </svg>
      );
    case "verbal": // ○
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
    case "objekt": // △
      return (
        <svg {...common}>
          <path d="M12 4.5l8 14.5H4z" />
        </svg>
      );
    case "dativ": // □
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1.5" />
        </svg>
      );
    case "adverbial": // 〰
      return (
        <svg {...common}>
          <path d="M2 12q2.25-5 4.5 0t4.5 0t4.5 0t4.5 0" />
        </svg>
      );
    case "subjpred": // ⊗ cirkel med kryds
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.2" />
          <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" />
        </svg>
      );
    case "objpred": // cirkel med trekant
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.2" />
          <path d="M12 5l6 10.5H6z" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
// Kategori- og sporikoner (erstatter emojis). Originale linje-ikoner.
// ---------------------------------------------------------------------------

export function WordClassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M8.5 16.5L12 7l3.5 9.5" />
      <path d="M9.8 13.2h4.4" />
    </svg>
  );
}

export function SentenceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="9" width="6.5" height="6" rx="1.6" />
      <rect x="14.5" y="9" width="6.5" height="6" rx="1.6" />
      <path d="M9.5 12h5" />
    </svg>
  );
}

export function BlocksIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  );
}

export function BranchTreeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5.5v5.5" />
      <path d="M12 11l-5 5.5" />
      <path d="M12 11l5 5.5" />
      <circle cx="12" cy="4" r="1.7" />
      <circle cx="6.4" cy="17.4" r="1.7" />
      <circle cx="17.6" cy="17.4" r="1.7" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.6 2.6 15.4 0 18" />
      <path d="M12 3c-2.6 2.6-2.6 15.4 0 18" />
    </svg>
  );
}

export function CodexIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8" />
      <path d="M6 4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2" />
      <path d="M8 4v16" />
      <path d="M11 9h5M11 13h5" />
    </svg>
  );
}

export function TempleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10l9-6 9 6" />
      <path d="M4 10h16" />
      <path d="M6 10v9" />
      <path d="M10 10v9" />
      <path d="M14 10v9" />
      <path d="M18 10v9" />
      <path d="M3.5 20.5h17" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 6.5C10.4 5.3 8.3 4.8 6 4.8H4v13.4h2c2.3 0 4.4.5 6 1.6" />
      <path d="M12 6.5c1.6-1.2 3.7-1.7 6-1.7h2v13.4h-2c-2.3 0-4.4.5-6 1.6" />
      <path d="M12 6.5v13.3" />
    </svg>
  );
}

export function AmphoraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.5 4h5" />
      <path d="M10 4v2.4C7.5 7.8 6.3 10.3 6.3 13.7c0 3.6 2.1 6.3 5.7 6.3s5.7-2.7 5.7-6.3c0-3.4-1.2-5.9-3.7-7.3V4" />
      <path d="M10.2 8.2c-2 0-3.4 1.2-3.4 3.6" />
      <path d="M13.8 8.2c2 0 3.4 1.2 3.4 3.6" />
    </svg>
  );
}

export function TextIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  );
}

export function GraduationCapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9l9-4 9 4-9 4-9-4z" />
      <path d="M7 11v3.6c0 1.1 2.3 2.4 5 2.4s5-1.3 5-2.4V11" />
      <path d="M21 9.5v4" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2L4.5 13.2H11l-1.4 8.8L19.5 10H13l1-8z" />
    </svg>
  );
}

export function ClockHistoryIcon({ className }: IconProps) {
  // Tempus/verbaltider: et ur med en pil, der antyder tidens gang.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 8a8 8 0 1 1-1 5" />
      <path d="M4 3v5h5" />
      <path d="M12 8v5l3 2" />
    </svg>
  );
}

export function CaseTableIcon({ className }: IconProps) {
  // Kasus-masterclass: en lille skematabel.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9.5h18" />
      <path d="M9 4v16" />
      <path d="M15 4v16" />
    </svg>
  );
}

export function InfinityStarIcon({ className }: IconProps) {
  // Den ultimative test: en stjerne i en cirkel af score.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l1.6 3.4 3.7.4-2.8 2.5.8 3.7L12 15.2l-3.3 1.8.8-3.7-2.8-2.5 3.7-.4z" />
    </svg>
  );
}

export function VerbTableIcon({ className }: IconProps) {
  // Sum/es/est-forløb: en lille bøjningstabel med person-rækker.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 8.5h18M3 13.5h18M3 18h18" />
      <path d="M10 3v18" />
    </svg>
  );
}

export function TrendUpIcon({ className }: IconProps) {
  // Udvikling: en graf/kurve der peger opad.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="10.5" width="14" height="10" rx="1.8" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

const ICON_MAP: Record<IconName, (p: IconProps) => React.ReactElement> = {
  ordklasser: WordClassIcon,
  saetningsled: SentenceIcon,
  morfologi: BlocksIcon,
  tempus: ClockHistoryIcon,
  kasus: CaseTableIcon,
  syntaks: BranchTreeIcon,
  sprog: GlobeIcon,
  sumesse: VerbTableIcon,
  ordforraad: CodexIcon,
  grammatik: TempleIcon,
  oversaettelse: BookIcon,
  kultur: AmphoraIcon,
  almen: TextIcon,
  latin: TempleIcon,
  fuld: GraduationCapIcon,
  bolt: BoltIcon,
  ultimativ: InfinityStarIcon,
  udvikling: TrendUpIcon,
  lock: LockIcon,
};

export function CategoryIcon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = ICON_MAP[name];
  return <Cmp className={className} />;
}
