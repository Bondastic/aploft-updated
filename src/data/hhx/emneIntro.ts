import type { CategoryId } from "../../types";
import type { DiagramId } from "../../components/teaching/Diagrams";

// ---------------------------------------------------------------------------
// EMNE-INTRODUKTIONER (kun HHX-sporet).
//
// Elevernes tilbagemelding fra testrunden: man bliver kastet direkte ud i
// opgaverne uden at vide, hvad emnet går ud på. Derfor møder HHX-eleven nu en
// kort læseside med et diagram, før opgaverne starter : hvad skal du kunne,
// hvilke begreber bruger vi, og hvordan hænger det sammen.
//
// Indholdet følger AP-undervisningens eget materiale fra Risskov (analysepilen,
// morfemtyperne, ikke-reglen, tiderne og Ciceros pentagram). Det er derfor
// bevidst KUN på HHX-siden : STX har sin egen AP-undervisning og sit eget
// pensum med latindelen.
// ---------------------------------------------------------------------------

export interface EmneIntroT {
  /** Overskrift på læsesiden. */
  title: string;
  /** Én sætning om, hvad emnet bruges til til eksamen. */
  lead: string;
  /** Diagrammet, der tegnes øverst. */
  diagram: DiagramId;
  /** Det skal du kunne, når du er færdig med emnet. */
  goals: string[];
  /** De begreber, du skal kunne bruge (latinske betegnelser er de primære). */
  terms: { term: string; def: string }[];
  /** Det, eleverne oftest falder i. */
  trap?: string;
  /** Lærerens OBS, fx om AI og grammatik. */
  obs?: string;
}

export const HHX_EMNE_INTRO: Partial<Record<CategoryId, EmneIntroT>> = {
  saetningsled: {
    title: "Syntaktisk analyse: de syv sætningsled",
    lead: "Til eksamen får du en sætning fra teksten, som du skal dele i led og navngive med de latinske betegnelser. Det er opgave 5 på eksamensarket.",
    diagram: "analysepilen",
    goals: [
      "Finde leddene i den rigtige rækkefølge (analysepilen) i stedet for at gætte.",
      "Navngive hvert led med den latinske betegnelse og sætte det rigtige analysetegn.",
      "Kende forskel på direkte objekt og subjektsprædikat : og vide, hvorfor de aldrig står i samme sætning.",
    ],
    terms: [
      { term: "Verballed (V)", def: "Det bøjede verbum: hvad sker der?" },
      { term: "Subjekt (S)", def: "Hvem eller hvad udfører handlingen? Spørg: hvem/hvad + verballed." },
      { term: "Direkte objekt (DO)", def: "Det, handlingen går ud over. Spørg: hvem/hvad + verballed + subjekt." },
      { term: "Indirekte objekt (IO)", def: "Den, handlingen er rettet mod (til/for hvem). Kræver altid et direkte objekt." },
      { term: "Adverbial (A)", def: "Tid, sted, måde eller årsag. Spørg: hvornår, hvor, hvordan, hvorfor?" },
      { term: "Subjektsprædikat (SP)", def: "Siger noget om subjektet. Kræver et kopulaverbum: være, blive, hedde, synes." },
      { term: "Objektsprædikat (OP)", def: "Siger noget om det direkte objekt, fx 'De kalder hende Fru Jensen'." },
    ],
    trap: "Subjektsprædikat og direkte objekt kan ikke optræde i samme sætning. Kig på verbet: er det et kopulaverbum (være, blive, hedde, synes), leder du efter et subjektsprædikat : er det et handlingsverbum, leder du efter et objekt.",
  },
  morfologi: {
    title: "Morfologisk analyse: ordets byggeklodser",
    lead: "Til eksamen skal du dele ord fra teksten i morfemer og sætte navn på hver del. Det er opgave 4 på eksamensarket, og det er en af de opgaver, man hurtigst kan score point på.",
    diagram: "morfemer",
    goals: [
      "Dele et ord i morfemer med bindestreger og navngive hver del.",
      "Kende forskel på afledning (nyt ord) og bøjning (samme ord, ny form).",
      "Genkende bindebogstavet i sammensatte ord, fx stol-e-ben.",
    ],
    terms: [
      { term: "Rodmorfem", def: "Grundbetydningen, kan ofte stå alene: læs i læser og læsning." },
      { term: "Præfiks", def: "Forstavelse, der ændrer betydningen: gen- i genbruge, u- i umulig." },
      { term: "Suffiks", def: "Afledningsendelse, der ofte skifter ordklasse: -hed i kloghed, -lig i venlig." },
      { term: "Fleksiv", def: "Bøjningsendelse for tid, tal, bestemthed eller køn: -er i bøger, -ede i besvarede." },
      { term: "Bindebogstav", def: "Binder sammensatte ord og betyder ikke noget i sig selv: stol-e-ben." },
    ],
    trap: "Kald ikke alt, der sidder bagerst, for en 'endelse'. En afledning (suffiks) laver et NYT ord og skifter tit ordklasse ; en bøjning (fleksiv) bøjer bare det ord, du har.",
    obs: "OBS fra din AP-lærer: AI-værktøjer svarer ofte misvisende om grammatik, og særligt om morfologi. Brug dem til at få forklaringer på tekster og idéer : men tjek morfem-opdelinger i din bog eller hos din lærer.",
  },
  tempus: {
    title: "Verballedets tid",
    lead: "Til eksamen skal du bestemme verballeddets tid i en sætning fra teksten og omskrive sætningen til en anden tid. Det er opgave 6 på eksamensarket.",
    diagram: "tempus",
    goals: [
      "Bestemme tiden med både det latinske og det danske navn.",
      "Omskrive en hel sætning til en anden tid uden at ændre resten.",
      "Forklare, hvad tiden gør i teksten: præsens skaber nærhed, præteritum fortæller på afstand.",
    ],
    terms: [
      { term: "Præsens (nutid)", def: "læser : handlingen sker nu." },
      { term: "Præteritum (datid)", def: "læste : handlingen skete tidligere." },
      { term: "Perfektum (førnutid)", def: "har læst : skete tidligere, men har effekt nu." },
      { term: "Pluskvamperfektum (førdatid)", def: "havde læst : skete før en anden handling i fortiden." },
      { term: "Futurum (fremtid)", def: "vil læse : sker i fremtiden." },
    ],
    trap: "I de sammensatte tider er det HJÆLPEVERBET, der bøjes (har → havde), mens hovedverbet står i participium. Og husk, at dansk ofte bruger præsens om fremtiden, når der står et tidsadverbial: 'Vi mødes i august'.",
  },
  syntaks: {
    title: "Hoved- og ledsætninger",
    lead: "Til eksamen skal du finde en hovedsætning og en ledsætning i teksten, vise ikke-reglen og sige, hvilket led ledsætningen er. Det er opgave 7 på eksamensarket.",
    diagram: "hovedled",
    goals: [
      "Bruge ikke-reglen som test i stedet for at gætte.",
      "Kende indlederne: at, fordi, hvis, når, da (konjunktioner) og som, der (relative pronominer).",
      "Sige hvilket led ledsætningen er i hovedsætningen: subjekt, objekt, adverbial, subjektsprædikat eller attribut.",
    ],
    terms: [
      { term: "Hovedsætning (HS)", def: "Kan stå alene. Ikke-testen: 'ikke' står EFTER verballeddet." },
      { term: "Ledsætning (LS)", def: "Kan ikke stå alene. Ikke-testen: 'ikke' står MELLEM subjekt og verballed." },
      { term: "Paratakse", def: "Sideordning med og, men, eller : let og mundtligt præg." },
      { term: "Hypotakse", def: "Underordning med at, fordi, hvis : komplekst og formelt præg." },
    ],
    trap: "Står ledsætningen først, overtager den forpladsen, og hovedsætningen får omvendt ledstilling: 'Da jeg gik i skole, KØBTE MIN MOR slik.' Det gør den ikke til en ledsætning.",
  },
  ordklasser: {
    title: "Ordklasser i kontekst",
    lead: "Ordklasserne bruges i opgave 3 om sproglige særtræk: hvilke ordklasser dominerer teksten, og hvad gør de ved læseren?",
    diagram: "ordklasser",
    goals: [
      "Bestemme ordklassen ud fra ordets EGENSKABER, ikke ud fra hvad det handler om.",
      "Bruge bøjningstest: kan ordet bøjes i tal, bestemthed eller tid?",
      "Koble ordklasserne til tekstens stil, fx mange adjektiver i en reklame.",
    ],
    terms: [
      { term: "Substantiv", def: "Navneord: bøjes i tal og bestemthed (hund, hunden, hunde)." },
      { term: "Verbum", def: "Udsagnsord: bøjes i tid (læser, læste, har læst)." },
      { term: "Adjektiv", def: "Tillægsord: beskriver et substantiv og kan gradbøjes (stor, større)." },
      { term: "Adverbium", def: "Biord: beskriver verbet eller hele sætningen og bøjes ikke." },
      { term: "Pronomen", def: "Stedord: står i stedet for et substantiv (jeg, hun, den, min)." },
      { term: "Præposition", def: "Forholdsord: styrer et led efter sig (på, under, mellem)." },
      { term: "Konjunktion", def: "Bindeord: forbinder ord og sætninger (og, men, fordi)." },
      { term: "Interjektion", def: "Udråbsord: av!, hej!, åh!" },
    ],
    trap: "Samme ord kan skifte ordklasse efter sammenhængen: 'siden' er præposition i 'siden 2021', men konjunktion i 'siden du spørger'. Bestem altid ordklassen i den konkrete sætning.",
  },
  kommunikation: {
    title: "Kommunikationssituationen",
    lead: "Opgave 2 til eksamen: redegør for kommunikationssituationen med Ciceros pentagram, og slut af med formålet i midten.",
    diagram: "pentagram",
    goals: [
      "Gå pentagrammets fem punkter igennem ét ad gangen med et citat til hvert.",
      "Skelne afsenderen fra de personer, der bare CITERES i teksten.",
      "Formulere formålet som en hensigt: hvad vil afsenderen have modtageren til?",
    ],
    terms: [
      { term: "Afsender", def: "Hvem taler eller skriver, og med hvilken baggrund og interesse?" },
      { term: "Emne", def: "Hvad handler kommunikationen om?" },
      { term: "Modtager", def: "Hvem er målgruppen, og hvordan kan man se det i sproget?" },
      { term: "Situation", def: "Hvor, hvornår og hvorfor netop nu?" },
      { term: "Sprog og genre", def: "Hvilken form er valgt, og hvordan lyder sproget?" },
    ],
    trap: "Mediet er ikke det samme som afsenderen: en avis kan bringe en annonce, hvor virksomheden er den reelle afsender.",
  },
  genrer: {
    title: "Genretræk",
    lead: "Opgave 1 til eksamen: bestem tekstens genre, og vis med mindst én ting fra teksten, hvordan du kan se det.",
    diagram: "genrer",
    goals: [
      "Placere teksten i en af de fem genrer, du kan komme op i.",
      "Begrunde med genretræk: byline, formål, opbygning, tiltale og virkemidler.",
      "Kende hybridformerne, hvor en genre låner en andens form.",
    ],
    terms: [
      { term: "Informerende artikel", def: "Oplyser neutralt: rubrik, underrubrik, brødtekst, faktaboks." },
      { term: "Opinionsartikel", def: "Tager stilling: kronik, leder, anmeldelse, læserbrev, kommentar." },
      { term: "Reklame", def: "Sælger eller vinder tilslutning, ofte med skjult hensigt." },
      { term: "Politisk tale", def: "Overbeviser og samler: etos, patos og logos." },
      { term: "Ejendomsannonce", def: "Fremhæver styrker og nedtoner svagheder med positive konnotationer." },
    ],
    trap: "Genre uden belæg tæller kun halvt. Sig genren, og læg straks to eller tre træk fra teksten ovenpå.",
  },
};

/** Findes der en læseside for emnet? (Kun HHX : se filens hoved.) */
export function getEmneIntro(category: CategoryId, education: string): EmneIntroT | null {
  if (education !== "hhx") return null;
  return HHX_EMNE_INTRO[category] ?? null;
}
