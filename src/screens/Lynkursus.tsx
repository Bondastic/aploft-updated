"use client";

import { useState } from "react";
import { cn } from "../utils/cn";
import Mascot from "../components/Mascot";
import { CategoryIcon } from "../components/icons";
import type { IconName, Progress, Track } from "../types";

interface LessonTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

interface Lesson {
  title: string;
  icon: IconName;
  points: string[];
  tables?: LessonTable[];
}

const ALMEN_LESSONS: Lesson[] = [
  {
    title: "Ordklasser på 60 sekunder",
    icon: "ordklasser",
    points: [
      "Substantiv (navneord): navnet på en person, ting eller begreb — fx 'hund', 'Peter', 'glæde'",
      "Verbum (udsagnsord): en handling eller tilstand — fx 'løbe', 'spise', 'være'",
      "Adjektiv (tillægsord): beskriver et substantiv — fx 'en glad hund', 'et hurtigt løb'",
      "Adverbium (biord): beskriver et verbum, adjektiv eller andet adverbium — fx 'han løber hurtigt', 'meget glad'",
      "De sidste fire ordklasser er: pronomen (fx 'han', 'min'), præposition (fx 'i', 'på'), konjunktion (fx 'og', 'men') og numerale, altså talord (fx 'tre')",
    ],
  },
  {
    title: "De 7 sætningsled",
    icon: "saetningsled",
    points: [
      "Grundled (subjekt): hvem eller hvad udfører handlingen? Fx: 'Peter' løber",
      "Udsagnsled: selve udsagnsordet i sætningen. Fx: Peter 'løber'",
      "Genstandsled (objekt): hvem eller hvad rammes af handlingen? Fx: Peter spiser 'en kage'",
      "Hensynsled: til eller for hvem sker handlingen? Fx: Peter giver 'Mette' en bog",
      "Adverbial: fortæller om tid, sted, måde eller grad. Fx: Peter løber 'hurtigt' 'i parken'",
      "Subjektsprædikat: siger noget om grundleddet. Fx: Peter er 'glad'",
      "Objektsprædikat: siger noget om genstandsleddet. Fx: De kalder hunden 'Fido'",
    ],
  },
  {
    title: "Morfologi: ords byggeklodser",
    icon: "morfologi",
    points: [
      "Morfem: den mindste del af et ord, der betyder noget, fx grundordet 'hund' eller endelsen '-e' i 'hunde'",
      "Afledning: et ord skifter ordklasse eller betydning ved hjælp af en forstavelse eller endelse — fx adjektivet 'klar' bliver til adjektivet 'uklar' (modsat betydning), eller adjektivet 'glad' bliver til substantivet 'glæde'",
      "Sammensætning: to hele ord sættes sammen til ét nyt ord, fx 'sol' + 'skin' = 'solskin'",
      "Bøjning ændrer aldrig ordklasse, kun ordets form — fx substantivet 'hund' bøjes til 'hunde' (stadig substantiv), og verbet 'løbe' bøjes til 'løber' og 'løb' (stadig verbum, bare i en anden tid)",
    ],
  },
  {
    title: "Tempus: verbernes tider",
    icon: "tempus",
    points: [
      "Spørg altid: er handlingen afsluttet, i gang eller fremtidig? Det afgør tempus.",
      "De sammensatte tider (perfektum, pluskvamperfektum, futurum) dannes med et hjælpeverbum (har/er/vil) + hovedverbets participium eller infinitiv.",
      "Bevægelses- og tilstandsskiftende verber (komme, gå, blive, dø) bruger 'er' i stedet for 'har': 'er kommet', ikke 'har kommet'.",
      "Latin har sine egne tider: præsens (nutid), imperfectum (datid, gentaget/i gang), perfectum (afsluttet fortid) og futurum (fremtid).",
    ],
    tables: [
      {
        caption: "De 5 danske tider på ét overblik",
        headers: ["Tid", "Eksempel", "Sådan dannes den"],
        rows: [
          ["Præsens (nutid)", "Han løber", "Grundform + bøjning (-er)"],
          ["Præteritum (datid)", "Han løb", "Uregelmæssig eller -ede/-te"],
          ["Perfektum (førnutid)", "Han har løbet", "har/er + kort tillægsform"],
          ["Pluskvamperfektum (førdatid)", "Han havde løbet", "havde/var + kort tillægsform"],
          ["Futurum (fremtid)", "Han vil løbe", "vil/skal + navnemåde"],
        ],
      },
    ],
  },
  {
    title: "Kasus-masterclass: hvad danner hvad?",
    icon: "kasus",
    points: [
      "En kasus er den grammatiske form, der viser et ords funktion i sætningen — dansk har kun rester af det (fx jeg/mig), mens latin har et fuldt system.",
      "Den vigtigste huskeregel: sætningsled og kasus hænger 1:1 sammen — lær dem parvis.",
      "Ordstillingen i latin er fri, fordi det er kasusendelsen, ikke pladsen i sætningen, der viser ordets funktion.",
      "Et adjektiv skal altid 'kongruere' (stemme overens) med sit substantiv i køn, tal og kasus.",
    ],
    tables: [
      {
        caption: "Sætningsled ↔ kasus: hvad danner hvad?",
        headers: ["Dansk sætningsled", "Latinsk kasus", "Spørgsmål", "Eksempel"],
        rows: [
          ["Grundled (subjekt)", "Nominativ", "hvem/hvad + verbum?", "Puella cantat (pigen synger)"],
          ["Genstandsled (objekt)", "Akkusativ", "verbum + hvem/hvad?", "Puellam video (jeg ser pigen)"],
          ["Hensynsled (indir. objekt)", "Dativ", "til/for hvem?", "Puellae dono (jeg giver pigen)"],
          ["Ejerskab (dansk -s)", "Genitiv", "hvis?", "Liber puellae (pigens bog)"],
          ["Adverbial (middel/sted/måde)", "Ablativ", "hvordan/hvormed/hvorfra?", "Cum puella (med pigen)"],
          ["Direkte tiltale", "Vokativ", "(ingen — direkte tiltale)", "Puella! (Pige!)"],
        ],
      },
      {
        caption: "Eksempel: 'puella' (pige) bøjet gennem alle 6 kasus, ental",
        headers: ["Kasus", "Form", "Betydning"],
        rows: [
          ["Nominativ", "puella", "pigen (subjekt)"],
          ["Genitiv", "puellae", "pigens"],
          ["Dativ", "puellae", "til/for pigen"],
          ["Akkusativ", "puellam", "pigen (objekt)"],
          ["Ablativ", "puella (langt a)", "med/i/fra pigen"],
          ["Vokativ", "puella", "Pige! (tiltale)"],
        ],
      },
    ],
  },
  {
    title: "Syntaks: sætningens orden",
    icon: "syntaks",
    points: [
      "Dansk er et V2-sprog: verbet (udsagnsleddet) skal altid stå som sætningens andet led. Fx: 'I går regnede det' — verbet 'regnede' er stadig andet led, selvom sætningen starter med tidsangivelsen",
      "En helsætning kan stå alene og give mening, fx 'Han spiser'. En ledsætning kan ikke stå alene, fx 'fordi han er sulten'",
      "Sideordning binder to ligestillede helsætninger sammen med fx 'og' eller 'men'. Underordning gør en ledsætning afhængig af en hovedsætning.",
      "Ledsætninger findes i tre hovedtyper: nominale (fungerer som subjekt/objekt), adverbielle (tid, årsag osv.) og relative (beskriver et substantiv).",
      "Topikalisering: man flytter et led frem foran verbet for at fremhæve det, fx 'Denne bog har jeg læst' i stedet for 'Jeg har læst denne bog'",
      "Engelsk er IKKE et V2-sprog og bruger 'do/does/did' til spørgsmål, hvor dansk i stedet bytter om på subjekt og verbum (inversion).",
    ],
  },
  {
    title: "Sprog & kommunikation",
    icon: "sprog",
    points: [
      "Dansk hører til de germanske sprog, ligesom engelsk og tysk. Fransk, spansk og italiensk hører til de romanske sprog, som stammer fra latin",
      "Fonem: den mindste lydenhed i sproget, fx forskellen på lyden 'p' og 'b' i 'pil' og 'bil'",
      "Morfem: den mindste betydningsenhed i sproget, fx grundordet 'hund' eller endelsen '-e' i 'hunde'",
      "Kommunikationsmodellen beskriver, hvordan en afsender sender et budskab til en modtager — og hvordan støj undervejs kan forstyrre budskabet",
      "Sprog forandrer sig hele tiden. Det kaldes sprogforandring og ses fx ved, at nye ord kommer til, mens gamle går af brug",
    ],
  },
];

const LATIN_LESSONS: Lesson[] = [
  {
    title: "Hvorfor lærer vi latin?",
    icon: "ordforraad",
    points: [
      "Latin er roden til de romanske sprog: fransk, spansk, italiensk med flere",
      "Mange danske og engelske ord stammer fra latin",
      "At kende latinske rødder hjælper dig med at gætte betydningen af ukendte ord",
    ],
  },
  {
    title: "Esse i skemaer: sum, es, est — og datid",
    icon: "sumesse",
    points: [
      "'Esse' (at være) er det vigtigste og mest uregelmæssige verbum på latin — det bruges i næsten alle sætninger, du møder.",
      "Nutid (præsens) og datid (imperfectum) bruger de SAMME personendelser — kun grundformen skifter fra 'su-/es-' (nutid) til 'era-' (datid).",
      "Huskereglen 'o/m – s – t – mus – tis – nt' virker også på 'esse': sum (-m), es (-s), est (-t), sumus (-mus), estis (-tis), sunt (-nt).",
      "Ordstillingen er fri: 'Puella laeta est' og 'Puella est laeta' betyder præcis det samme, fordi det er endelserne — ikke pladsen i sætningen — der bærer betydningen.",
    ],
    tables: [
      {
        caption: "Esse i nutid (præsens) — ental og flertal",
        headers: ["Person", "Ental", "Betydning", "Flertal", "Betydning"],
        rows: [
          ["1. person (jeg/vi)", "sum", "jeg er", "sumus", "vi er"],
          ["2. person (du/I)", "es", "du er", "estis", "I er"],
          ["3. person (han-hun-den/de)", "est", "han/hun/den er", "sunt", "de er"],
        ],
      },
      {
        caption: "Esse i datid (imperfectum) — ental og flertal",
        headers: ["Person", "Ental", "Betydning", "Flertal", "Betydning"],
        rows: [
          ["1. person (jeg/vi)", "eram", "jeg var", "eramus", "vi var"],
          ["2. person (du/I)", "eras", "du var", "eratis", "I var"],
          ["3. person (han-hun-den/de)", "erat", "han/hun/den var", "erant", "de var"],
        ],
      },
      {
        caption: "Huskeregel: personendelserne 'o/m – s – t – mus – tis – nt'",
        headers: ["Person", "Endelse", "I 'esse' (nutid)", "I 'esse' (datid)"],
        rows: [
          ["1. ental (jeg)", "-o / -m", "sum", "eram"],
          ["2. ental (du)", "-s", "es", "eras"],
          ["3. ental (han/hun/den)", "-t", "est", "erat"],
          ["1. flertal (vi)", "-mus", "sumus", "eramus"],
          ["2. flertal (I)", "-tis", "estis", "eratis"],
          ["3. flertal (de)", "-nt", "sunt", "erant"],
        ],
      },
    ],
  },
  {
    title: "De 6 kasus",
    icon: "grammatik",
    points: [
      "Nominativ: grundleddet, den der handler — fx 'puella' (pigen) i 'Puella cantat' (Pigen synger)",
      "Akkusativ: genstandsleddet, den handlingen rammer — fx 'puellam' i 'Video puellam' (Jeg ser pigen)",
      "Dativ: hensynsleddet, til eller for nogen — fx 'puellae' i 'Do puellae rosam' (Jeg giver pigen en rose)",
      "Genitiv: viser ejerskab, svarer til dansk '-s' — fx 'puellae' i 'liber puellae' (pigens bog)",
      "Ablativ: bruges bl.a. om middel, sted eller måde, og svarer ofte til dansk 'med', 'i' eller 'fra'",
      "Vokativ: bruges når man tiltaler nogen direkte — fx 'Marce!' ('Marcus!')",
    ],
  },
  {
    title: "Deklinationer og konjugationer",
    icon: "grammatik",
    points: [
      "En deklination er den bøjningsrække, et substantiv følger gennem alle kasus. Latin har 5 deklinationer, men 1. og 2. er de vigtigste at starte med.",
      "1. deklination (fx 'puella') er overvejende hunkøn og ender på '-a' i nominativ.",
      "2. deklination (fx 'dominus', 'templum') er hankøn/intetkøn og ender på '-us'/'-um' i nominativ.",
      "En konjugation er den bøjningsrække, et verbum følger gennem person og tal. Latin har 4 konjugationer.",
    ],
    tables: [
      {
        caption: "1. deklination: 'puella' (pige) i ental og flertal",
        headers: ["Kasus", "Ental", "Flertal"],
        rows: [
          ["Nominativ", "puella", "puellae"],
          ["Genitiv", "puellae", "puellarum"],
          ["Dativ", "puellae", "puellis"],
          ["Akkusativ", "puellam", "puellas"],
          ["Ablativ", "puella", "puellis"],
        ],
      },
      {
        caption: "Verbet 'amare' (at elske) i præsens",
        headers: ["Person", "Form", "Betydning"],
        rows: [
          ["1. ental (jeg)", "amo", "jeg elsker"],
          ["2. ental (du)", "amas", "du elsker"],
          ["3. ental (han/hun)", "amat", "han/hun elsker"],
          ["1. flertal (vi)", "amamus", "vi elsker"],
          ["2. flertal (I)", "amatis", "I elsker"],
          ["3. flertal (de)", "amant", "de elsker"],
        ],
      },
    ],
  },
  {
    title: "Sådan oversætter du",
    icon: "oversaettelse",
    points: [
      "Find udsagnsordet (verbet) først — endelsen fortæller dig hvem der handler, og hvornår det sker",
      "Kig på ordendelserne for at finde nominativ (subjekt) og akkusativ (objekt). Det er endelsen, der afgør rollen, ikke ordets plads i sætningen",
      "Den latinske ordstilling er fri, så stol altid på endelserne frem for rækkefølgen af ordene",
      "Brug dit oversættelsesark til svære gloser, når du er til prøve — det matcher altid ordene i oversættelsesopgaverne",
    ],
  },
  {
    title: "Rom i korte træk",
    icon: "kultur",
    points: [
      "Forum var byens vigtigste torv — centrum for handel, politik og retssager",
      "Senatet var en forsamling af de fornemste romerske borgere, som rådgav og traf beslutninger",
      "Romerne er berømte for deres infrastruktur: brede veje, akvædukter (vandledninger) og et omfattende retssystem",
      "Vestrom, den vestlige del af Romerriget, faldt traditionelt i år 476 e.Kr.",
    ],
  },
];

function LessonTableView({ table }: { table: LessonTable }) {
  return (
    <div className="mb-3 overflow-x-auto rounded-xl border border-ink/10">
      {table.caption && <p className="border-b border-ink/10 bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink/70">{table.caption}</p>}
      <table className="w-full min-w-[420px] border-collapse text-left text-xs sm:text-sm">
        <thead>
          <tr className="bg-ink/5">
            {table.headers.map((h) => (
              <th key={h} scope="col" className="border-b border-ink/10 px-3 py-2 font-bold text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-ink/[0.02]">
              {row.map((cell, j) => (
                <td key={j} className="border-b border-ink/5 px-3 py-2 text-ink/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LynkursusPage({ progress }: { progress: Progress }) {
  const [tab, setTab] = useState<Track>("almen");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const lessons = tab === "almen" ? ALMEN_LESSONS : LATIN_LESSONS;
  const accent = tab === "almen" ? "text-purple" : "text-orange-600";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Lynkursus</h1>
        <p className="text-sm text-ink/50">Hurtig genopfriskning af det vigtigste, inden du øver eller tager en prøve.</p>
      </div>

      <Mascot pose="thinking" size="md" speech="Klik på et emne for at folde det ud." reduceMotion={progress.settings.reduceMotion} />

      <div className="flex rounded-2xl bg-ink/5 p-1">
        <button
          onClick={() => {
            setTab("almen");
            setOpenIndex(0);
          }}
          className={cn("inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition", tab === "almen" ? "bg-white text-purple shadow-sm" : "text-ink/40")}
        >
          <CategoryIcon name="almen" className="h-4 w-4" />
          Almen del
        </button>
        <button
          onClick={() => {
            setTab("latin");
            setOpenIndex(0);
          }}
          className={cn("inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition", tab === "latin" ? "bg-white text-orange-600 shadow-sm" : "text-ink/40")}
        >
          <CategoryIcon name="latin" className="h-4 w-4" />
          Latindel
        </button>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, i) => {
          const open = openIndex === i;
          return (
            <div key={lesson.title} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink/5", accent)}>
                  <CategoryIcon name={lesson.icon} className="h-5 w-5" />
                </span>
                <span className="flex-1 font-bold text-ink">{lesson.title}</span>
                <span className={cn("text-ink/30 transition-transform", open && "rotate-90")} aria-hidden="true">
                  ›
                </span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-ink/10 px-4 py-3">
                  <ul className="space-y-1.5 text-sm text-ink/70">
                    {lesson.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span className={accent}>•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {lesson.tables?.map((t) => (
                    <LessonTableView key={t.caption ?? t.headers.join()} table={t} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
