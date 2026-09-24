"use client";

// ---------------------------------------------------------------------------
// Diagrammer til emne-introduktionerne (HHX). De er tegnet som inline-SVG, så
// de er skarpe på alle skærme, virker i både lys og mørk tilstand (farverne
// arves med currentColor) og ikke kræver billedfiler.
//
// Indholdet følger AP-undervisningens eget materiale: analysepilen, morfem-
// typerne, Ciceros pentagram, tiderne og ikke-reglen.
// ---------------------------------------------------------------------------

export type DiagramId =
  | "analysepilen"
  | "kasus"
  | "morfemer"
  | "tempus"
  | "hovedled"
  | "ordklasser"
  | "pentagram"
  | "genrer"
  | "sproghandlinger"
  | "denotation"
  | "pragmatik"
  | "laaneord"
  | "sprogtraeet"
  | "gentagelse";

const BOX = "fill-white stroke-current";
const LABEL = "fill-current text-[11px] font-bold";
const SMALL = "fill-current text-[9px]";

/** Analysepilen: den rækkefølge, man finder leddene i. */
function Analysepilen() {
  const steps = [
    ["1", "Verballed", "Hvad sker der?"],
    ["2", "Subjekt", "Hvem/hvad + V?"],
    ["3", "Direkte objekt", "Hvem/hvad + V + S?"],
    ["4", "Indirekte objekt", "Til hvem?"],
    ["5", "Adverbial", "Hvornår, hvor, hvordan?"],
    ["6", "Subjekts-/objektsprædikat", "Siger noget om S eller DO"],
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full text-ink/80" role="img" aria-label="Analysepilen: find leddene i rækkefølgen verballed, subjekt, direkte objekt, indirekte objekt, adverbial og prædikater">
      {steps.map(([n, title, hint], i) => {
        const y = 6 + i * 33;
        return (
          <g key={n}>
            <rect x="26" y={y} width="288" height="26" rx="8" className={BOX} strokeWidth="1.2" opacity="0.95" />
            <circle cx="14" cy={y + 13} r="10" className="fill-current opacity-90" />
            <text x="14" y={y + 17} textAnchor="middle" className="fill-white text-[11px] font-extrabold">{n}</text>
            <text x="36" y={y + 12} className={LABEL}>{title}</text>
            <text x="36" y={y + 22} className={SMALL} opacity="0.65">{hint}</text>
            {i < steps.length - 1 && <path d={`M14 ${y + 24} L14 ${y + 33}`} className="stroke-current" strokeWidth="2" opacity="0.5" />}
          </g>
        );
      })}
    </svg>
  );
}

/** Morfem-modellen: præfiks + rodmorfem + suffiks + fleksiv. */
function Morfemer() {
  const parts = [
    ["u-", "Præfiks", "forstavelse"],
    ["lykke", "Rodmorfem", "grundbetydning"],
    ["-lig", "Suffiks", "ny ordklasse"],
    ["-e", "Fleksiv", "bøjning"],
  ];
  return (
    <svg viewBox="0 0 340 132" className="w-full text-ink/80" role="img" aria-label="Ordet ulykkelige delt i morfemer: præfiks, rodmorfem, suffiks og fleksiv">
      <text x="170" y="16" textAnchor="middle" className="fill-current text-[13px] font-extrabold">ulykkelige</text>
      {parts.map(([piece, name, hint], i) => {
        const x = 4 + i * 84;
        return (
          <g key={name}>
            <path d={`M170 22 L${x + 40} 36`} className="stroke-current" strokeWidth="1" opacity="0.3" />
            <rect x={x} y="36" width="80" height="50" rx="10" className={BOX} strokeWidth="1.2" />
            <text x={x + 40} y="53" textAnchor="middle" className="fill-current text-[12px] font-extrabold">{piece}</text>
            <text x={x + 40} y="66" textAnchor="middle" className="fill-current text-[10px] font-bold">{name}</text>
            <text x={x + 40} y="78" textAnchor="middle" className="fill-current text-[8px]" opacity="0.6">{hint}</text>
          </g>
        );
      })}
      <text x="170" y="104" textAnchor="middle" className={SMALL} opacity="0.7">
        Femte type: bindebogstavet i sammensatte ord, fx stol-e-ben
      </text>
      <text x="170" y="120" textAnchor="middle" className={SMALL} opacity="0.7">
        Afledning (præfiks/suffiks) laver et nyt ord : bøjning (fleksiv) gør ikke
      </text>
    </svg>
  );
}

/** Tiderne fra førdatid til fremtid, med tidspilen i siden. */
function Tempus() {
  const items = [
    ["Pluskvamperfektum", "førdatid", "havde læst", "skete før en anden handling i fortiden"],
    ["Præteritum", "datid", "læste", "skete tidligere"],
    ["Perfektum", "førnutid", "har læst", "skete tidligere, har effekt nu"],
    ["Præsens", "nutid", "læser", "sker nu"],
    ["Futurum", "fremtid", "vil læse", "sker i fremtiden"],
  ];
  return (
    <svg viewBox="0 0 320 196" className="w-full text-ink/80" role="img" aria-label="De fem tider fra førdatid til fremtid med eksempler">
      <line x1="12" y1="10" x2="12" y2="168" className="stroke-current" strokeWidth="1.5" opacity="0.35" />
      <polygon points="12,176 8,166 16,166" className="fill-current" opacity="0.45" />
      <text x="24" y="190" className={SMALL} opacity="0.65">Tiden går nedad : i de sammensatte tider bøjes HJÆLPEVERBET (har → havde)</text>
      {items.map(([latin, dk, ex, hint], i) => {
        const y = 6 + i * 33;
        return (
          <g key={latin}>
            <circle cx="12" cy={y + 13} r="4.5" className="fill-current" opacity="0.85" />
            <rect x="26" y={y} width="288" height="26" rx="8" className={BOX} strokeWidth="1.2" />
            <text x="36" y={y + 12} className={LABEL}>
              {latin} <tspan className="font-medium" opacity="0.6">({dk})</tspan>
            </text>
            <text x="36" y={y + 22} className={SMALL} opacity="0.7">{ex} : {hint}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Ikke-reglen: hoved- eller ledsætning? */
function Hovedled() {
  return (
    <svg viewBox="0 0 320 160" className="w-full text-ink/80" role="img" aria-label="Ikke-reglen: i en hovedsætning står ikke efter verballeddet, i en ledsætning mellem subjekt og verballed">
      <rect x="4" y="6" width="312" height="60" rx="10" className={BOX} strokeWidth="1.2" />
      <text x="14" y="22" className={LABEL}>Hovedsætning : kan stå alene</text>
      <text x="14" y="40" className="fill-current text-[12px]">Hun læser <tspan className="font-extrabold">ikke</tspan> bogen.</text>
      <text x="14" y="56" className={SMALL} opacity="0.7">&quot;ikke&quot; står EFTER verballeddet</text>

      <rect x="4" y="76" width="312" height="60" rx="10" className={BOX} strokeWidth="1.2" />
      <text x="14" y="92" className={LABEL}>Ledsætning : kan ikke stå alene</text>
      <text x="14" y="110" className="fill-current text-[12px]">... fordi hun <tspan className="font-extrabold">ikke</tspan> læser bogen.</text>
      <text x="14" y="126" className={SMALL} opacity="0.7">&quot;ikke&quot; står MELLEM subjekt og verballed</text>

      <text x="160" y="152" textAnchor="middle" className={SMALL} opacity="0.75">
        Indledere: at, fordi, hvis, når, da, som, der
      </text>
    </svg>
  );
}

/** De ti ordklasser, grupperet. */
function Ordklasser() {
  const groups: [string, string[]][] = [
    ["Bøjes i tal og bestemthed", ["Substantiv", "Adjektiv", "Numerale"]],
    ["Bøjes i tid", ["Verbum"]],
    ["Bøjes ikke", ["Adverbium", "Præposition", "Konjunktion", "Interjektion"]],
    ["Står i stedet for et substantiv", ["Pronomen"]],
  ];
  let y = 6;
  return (
    <svg viewBox="0 0 320 180" className="w-full text-ink/80" role="img" aria-label="Oversigt over ordklasserne grupperet efter, hvordan de bøjes">
      {groups.map(([title, items]) => {
        const rows = Math.ceil(items.length / 3);
        const h = 20 + rows * 22;
        const g = (
          <g key={title}>
            <rect x="4" y={y} width="312" height={h} rx="10" className={BOX} strokeWidth="1.2" />
            <text x="14" y={y + 15} className={SMALL} opacity="0.7">{title}</text>
            {items.map((it, i) => (
              <g key={it}>
                <rect x={12 + (i % 3) * 100} y={y + 20 + Math.floor(i / 3) * 22} width="94" height="18" rx="6" className="fill-current" opacity="0.12" />
                <text x={59 + (i % 3) * 100} y={y + 33 + Math.floor(i / 3) * 22} textAnchor="middle" className="fill-current text-[10px] font-bold">{it}</text>
              </g>
            ))}
          </g>
        );
        y += h + 6;
        return g;
      })}
    </svg>
  );
}

/** Ciceros pentagram. */
function Pentagram() {
  // x, y, hvor teksten skal sidde (så navnene ikke løber ud over kanten).
  const pts: [string, number, number, "start" | "middle" | "end", number, number][] = [
    ["Afsender", 170, 26, "middle", 0, -10],
    ["Emne", 286, 88, "end", -10, -8],
    ["Modtager", 240, 156, "middle", 0, 16],
    ["Situation", 100, 156, "middle", 0, 16],
    ["Sprog og genre", 54, 88, "start", 10, -8],
  ];
  const poly = pts.map(([, x, y]) => `${x},${y}`).join(" ");
  return (
    <svg viewBox="0 0 340 186" className="w-full text-ink/80" role="img" aria-label="Ciceros pentagram med afsender, emne, modtager, situation og sprog omkring formålet">
      <polygon points={poly} className="fill-current" opacity="0.08" />
      <polygon points={poly} className="stroke-current" fill="none" strokeWidth="1.2" opacity="0.45" />
      <circle cx="170" cy="96" r="34" className={BOX} strokeWidth="1.2" />
      <text x="170" y="93" textAnchor="middle" className="fill-current text-[11px] font-extrabold">Formål</text>
      <text x="170" y="105" textAnchor="middle" className="fill-current text-[8px]" opacity="0.7">hvad vil afsender?</text>
      {pts.map(([label, x, y, anchor, dx, dy]) => (
        <g key={label}>
          <circle cx={x} cy={y} r="4" className="fill-current" />
          <text x={x + dx} y={y + dy} textAnchor={anchor} className="fill-current text-[10px] font-bold">{label}</text>
        </g>
      ))}
    </svg>
  );
}

/** Genrerne, man kan komme op i. */
function Genrer() {
  const rows = [
    ["Informerende artikel", "oplyser neutralt"],
    ["Opinionsartikel", "kronik, leder, læserbrev : tager stilling"],
    ["Reklame", "sælger, ofte med skjult hensigt"],
    ["Politisk tale", "vinder tilslutning : etos, patos, logos"],
    ["Ejendomsannonce", "fremhæver styrker, nedtoner svagheder"],
  ];
  return (
    <svg viewBox="0 0 320 170" className="w-full text-ink/80" role="img" aria-label="De fem genrer man kan komme op i til AP-eksamen">
      {rows.map(([name, hint], i) => (
        <g key={name}>
          <rect x="4" y={6 + i * 32} width="312" height="26" rx="8" className={BOX} strokeWidth="1.2" />
          <text x="14" y={17 + i * 32} className={LABEL}>{name}</text>
          <text x="14" y={28 + i * 32} className={SMALL} opacity="0.65">{hint}</text>
        </g>
      ))}
      <text x="160" y="166" textAnchor="middle" className={SMALL} opacity="0.7">
        Husk hybridformer: en advertorial ligner en artikel, men vil sælge
      </text>
    </svg>
  );
}

/** Kasus: hvilken form et ord får efter sin funktion i sætningen. */
function Kasus() {
  const rows = [
    ["Nominativ", "subjekt", "puella : pigen synger"],
    ["Akkusativ", "direkte objekt", "puellam : jeg ser pigen"],
    ["Dativ", "indirekte objekt", "puellae : jeg giver pigen bogen"],
    ["Genitiv", "ejerforhold", "puellae : pigens bog"],
    ["Ablativ", "middel, sted, måde", "puella : med pigen"],
  ];
  return (
    <svg viewBox="0 0 320 176" className="w-full text-ink/80" role="img" aria-label="Kasus og deres funktion i sætningen">
      {rows.map(([navn, funktion, ex], i) => (
        <g key={navn}>
          <rect x="4" y={6 + i * 33} width="312" height="26" rx="8" className={BOX} strokeWidth="1.2" />
          <text x="14" y={17 + i * 33} className={LABEL}>{navn} <tspan className="font-medium" opacity="0.6">: {funktion}</tspan></text>
          <text x="14" y={28 + i * 33} className={SMALL} opacity="0.65">{ex}</text>
        </g>
      ))}
      <text x="160" y="172" textAnchor="middle" className={SMALL} opacity="0.7">
        Endelsen viser funktionen : derfor er ordstillingen fri på latin
      </text>
    </svg>
  );
}

/** Sproghandlinger: hvad man GØR med ordene. */
function Sproghandlinger() {
  const rows = [
    ["Assertiv (konstativ)", "påstår noget om verden : Solen er varm"],
    ["Direktiv (regulativ)", "skal få modtageren til at handle : Luk vinduet"],
    ["Kommissiv", "afsenderen binder sig selv : Jeg lover at komme"],
    ["Ekspressiv", "udtrykker følelse eller holdning : Jeg elsker pizza"],
    ["Deklarativ (kvalitativ)", "ændrer virkeligheden : Jeg erklærer jer for gift"],
    ["Fatisk", "holder kontakten i gang : Hej, farvel, hvordan går det"],
  ];
  return (
    <svg viewBox="0 0 320 204" className="w-full text-ink/80" role="img" aria-label="De seks typer sproghandlinger med eksempler">
      {rows.map(([navn, ex], i) => (
        <g key={navn}>
          <rect x="4" y={6 + i * 31} width="312" height="26" rx="8" className={BOX} strokeWidth="1.2" />
          <text x="14" y={17 + i * 31} className={LABEL}>{navn}</text>
          <text x="14" y={28 + i * 31} className={SMALL} opacity="0.65">{ex}</text>
        </g>
      ))}
      <text x="160" y="198" textAnchor="middle" className={SMALL} opacity="0.7">
        Indirekte sproghandling: Her er koldt betyder Luk vinduet
      </text>
    </svg>
  );
}

/** Denotation og konnotation: samme ord, to slags betydning. */
function Denotation() {
  return (
    <svg viewBox="0 0 320 172" className="w-full text-ink/80" role="img" aria-label="Forskellen på et ords denotation og konnotation">
      <rect x="110" y="6" width="100" height="28" rx="10" className={BOX} strokeWidth="1.4" />
      <text x="160" y="24" textAnchor="middle" className={LABEL}>torsk</text>
      <line x1="140" y1="34" x2="86" y2="56" className="stroke-current" strokeWidth="1.2" opacity="0.5" />
      <line x1="180" y1="34" x2="234" y2="56" className="stroke-current" strokeWidth="1.2" opacity="0.5" />

      <rect x="8" y="56" width="146" height="64" rx="10" className={BOX} strokeWidth="1.2" />
      <text x="18" y="73" className={LABEL}>Denotation</text>
      <text x="18" y="87" className={SMALL} opacity="0.7">grundbetydningen</text>
      <text x="18" y="99" className={SMALL} opacity="0.7">en fisk</text>
      <text x="18" y="113" className={SMALL} opacity="0.55">nøgtern, objektiv tekst</text>

      <rect x="166" y="56" width="146" height="64" rx="10" className={BOX} strokeWidth="1.2" />
      <text x="176" y="73" className={LABEL}>Konnotation</text>
      <text x="176" y="87" className={SMALL} opacity="0.7">bibetydning og ladning</text>
      <text x="176" y="99" className={SMALL} opacity="0.7">en dum person</text>
      <text x="176" y="113" className={SMALL} opacity="0.55">holdningspræget tekst</text>

      <text x="160" y="142" textAnchor="middle" className={SMALL} opacity="0.7">
        Konnotationer er sociale aftaler: de virker, fordi vi er enige om dem
      </text>
      <text x="160" y="158" textAnchor="middle" className={SMALL} opacity="0.7">
        Mange konnotationer betyder en subjektiv afsender
      </text>
    </svg>
  );
}

/** Pragmatik: fra det sagte, gennem konteksten, til det mente. */
function Pragmatik() {
  const steps = [
    ["Ytringen", "Her er koldt"],
    ["Konteksten", "vinduet står åbent, og du er gæst i huset"],
    ["Sproghandlingen", "Luk vinduet, tak"],
  ];
  return (
    <svg viewBox="0 0 320 168" className="w-full text-ink/80" role="img" aria-label="Pragmatik: fra ytring gennem kontekst til den handling afsenderen vil udføre">
      {steps.map(([navn, ex], i) => (
        <g key={navn}>
          <rect x="20" y={6 + i * 50} width="280" height="34" rx="10" className={BOX} strokeWidth="1.2" />
          <text x="32" y={21 + i * 50} className={LABEL}>{navn}</text>
          <text x="32" y={33 + i * 50} className={SMALL} opacity="0.65">{ex}</text>
          {i < 2 && (
            <path d={`M160 ${40 + i * 50} L160 ${56 + i * 50}`} className="stroke-current" strokeWidth="1.4" opacity="0.5" fill="none" />
          )}
          {i < 2 && (
            <path d={`M156 ${50 + i * 50} L160 ${56 + i * 50} L164 ${50 + i * 50}`} className="fill-none stroke-current" strokeWidth="1.4" strokeLinejoin="round" opacity="0.5" />
          )}
        </g>
      ))}
      <text x="160" y="162" textAnchor="middle" className={SMALL} opacity="0.7">
        Pragmatik spørger: hvad vil afsenderen opnå, ikke kun hvad står der
      </text>
    </svg>
  );
}

/** Arveord, låneord og fremmedord: hvor det danske ordforråd kommer fra. */
function Laaneord() {
  const rows = [
    ["Arveord", "har altid været i dansk : blod, fader, hjul, ko"],
    ["Låneord", "lånt og tilpasset : kirke fra latin, borgmester fra tysk"],
    ["Fremmedord", "optaget, men stadig fremmed : weekend, comeback"],
  ];
  return (
    <svg viewBox="0 0 320 172" className="w-full text-ink/80" role="img" aria-label="Arveord, låneord og fremmedord i dansk">
      {rows.map(([navn, ex], i) => (
        <g key={navn}>
          <rect x="4" y={6 + i * 36} width="312" height="30" rx="9" className={BOX} strokeWidth="1.2" />
          <text x="14" y={19 + i * 36} className={LABEL}>{navn}</text>
          <text x="14" y={31 + i * 36} className={SMALL} opacity="0.65">{ex}</text>
        </g>
      ))}
      <text x="160" y="132" textAnchor="middle" className={SMALL} opacity="0.7">
        Arveord er husets nødvendigheder, låneord gør livet bekvemt,
      </text>
      <text x="160" y="146" textAnchor="middle" className={SMALL} opacity="0.7">
        og fremmedord peger på luksus : ordforrådet følger samfundet
      </text>
      <text x="160" y="164" textAnchor="middle" className={SMALL} opacity="0.55">
        Ca. 17 % af ordene kommer fra tysk, ca. 3 % fra fransk
      </text>
    </svg>
  );
}

/** Sprogtræet: fra den indoeuropæiske sprogæt ned til dansk. */
function Sprogtraeet() {
  return (
    <svg viewBox="0 0 320 206" className="w-full text-ink/80" role="img" aria-label="Sprogtræet fra indoeuropæisk over germansk og nordisk til dansk">
      <rect x="85" y="6" width="150" height="26" rx="9" className={BOX} strokeWidth="1.4" />
      <text x="160" y="23" textAnchor="middle" className={LABEL}>Indoeuropæisk sprogæt</text>

      <path d="M160 32 L160 40 M58 40 L262 40 M58 40 L58 48 M160 40 L160 48 M262 40 L262 48"
        className="stroke-current" strokeWidth="1.2" opacity="0.5" fill="none" />

      <rect x="8" y="48" width="100" height="32" rx="9" className={BOX} strokeWidth="1.2" />
      <text x="18" y="62" className={LABEL}>Germansk</text>
      <text x="18" y="74" className={SMALL} opacity="0.65">dansk, engelsk</text>

      <rect x="110" y="48" width="100" height="32" rx="9" className={BOX} strokeWidth="1.2" />
      <text x="120" y="62" className={LABEL}>Romansk</text>
      <text x="120" y="74" className={SMALL} opacity="0.65">fransk, spansk</text>

      <rect x="212" y="48" width="100" height="32" rx="9" className={BOX} strokeWidth="1.2" />
      <text x="222" y="62" className={LABEL}>Slavisk</text>
      <text x="222" y="74" className={SMALL} opacity="0.65">russisk, polsk</text>

      <path d="M58 80 L58 96" className="stroke-current" strokeWidth="1.2" opacity="0.5" fill="none" />
      <rect x="8" y="96" width="140" height="32" rx="9" className={BOX} strokeWidth="1.2" />
      <text x="18" y="110" className={LABEL}>Nordgermansk</text>
      <text x="18" y="122" className={SMALL} opacity="0.65">urnordisk indtil ca. år 700</text>

      <path d="M58 128 L58 136 M58 136 L212 136 M58 136 L58 144 M212 136 L212 144"
        className="stroke-current" strokeWidth="1.2" opacity="0.5" fill="none" />

      <rect x="8" y="144" width="140" height="32" rx="9" className={BOX} strokeWidth="1.2" />
      <text x="18" y="158" className={LABEL}>Østnordisk</text>
      <text x="18" y="170" className={SMALL} opacity="0.65">dansk, svensk</text>

      <rect x="160" y="144" width="152" height="32" rx="9" className={BOX} strokeWidth="1.2" />
      <text x="170" y="158" className={LABEL}>Vestnordisk</text>
      <text x="170" y="170" className={SMALL} opacity="0.65">norsk, islandsk, færøsk</text>

      <text x="160" y="196" textAnchor="middle" className={SMALL} opacity="0.7">
        Rasmus Rask påviste slægtskabet i begyndelsen af 1800-tallet
      </text>
    </svg>
  );
}

/** Spaced repetition: mellemrummene mellem gentagelserne skal vokse. */
function Gentagelse() {
  const nodes = [
    ["1", "i dag"],
    ["2", "efter 1 dag"],
    ["3", "efter 3 dage"],
    ["4", "efter 1 uge"],
    ["5", "efter 1 md."],
  ];
  return (
    <svg viewBox="0 0 320 136" className="w-full text-ink/80" role="img" aria-label="Spaced repetition: gentag med stadig større mellemrum">
      <text x="160" y="22" textAnchor="middle" className={SMALL} opacity="0.7">
        Hver gentagelse gør sporet stærkere : derfor må mellemrummet vokse
      </text>
      <line x1="24" y1="62" x2="296" y2="62" className="stroke-current" strokeWidth="1.2" opacity="0.4" />
      {nodes.map(([n, label], i) => (
        <g key={n}>
          <circle cx={32 + i * 64} cy="62" r="11" className={BOX} strokeWidth="1.4" />
          <text x={32 + i * 64} y="66" textAnchor="middle" className={LABEL}>{n}</text>
          <text x={32 + i * 64} y="88" textAnchor="middle" className={SMALL} opacity="0.65">{label}</text>
        </g>
      ))}
      <text x="160" y="116" textAnchor="middle" className={SMALL} opacity="0.7">
        Genkald svaret aktivt, før du slår op
      </text>
    </svg>
  );
}

const DIAGRAMS: Record<DiagramId, () => React.JSX.Element> = {
  analysepilen: Analysepilen,
  kasus: Kasus,
  morfemer: Morfemer,
  tempus: Tempus,
  hovedled: Hovedled,
  ordklasser: Ordklasser,
  pentagram: Pentagram,
  genrer: Genrer,
  sproghandlinger: Sproghandlinger,
  denotation: Denotation,
  pragmatik: Pragmatik,
  laaneord: Laaneord,
  sprogtraeet: Sprogtraeet,
  gentagelse: Gentagelse,
};

export default function Diagram({ id }: { id: DiagramId }) {
  const C = DIAGRAMS[id];
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-3 shadow-sm">
      <C />
    </div>
  );
}
