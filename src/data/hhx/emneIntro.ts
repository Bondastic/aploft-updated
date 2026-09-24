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
  sproghandlinger: {
    title: "Sproghandlinger: hvad man gør med ord",
    lead: "Når du beskriver tekstens kommunikationssituation til eksamen, skal du kunne sætte navn på, hvad afsenderen GØR med sine sætninger. Det hører til opgave 2 og 3 på eksamensarket.",
    diagram: "sproghandlinger",
    goals: [
      "Sætte navn på en sproghandling med den latinske betegnelse.",
      "Se forskel på en direkte og en indirekte sproghandling.",
      "Forklare, hvad det betyder, at sprog er performativt, altså at ytringen selv er handlingen.",
      "Bruge sproghandlingerne til at sige noget om afsenderens hensigt.",
    ],
    terms: [
      { term: "Assertiv (konstativ)", def: "Påstår noget om verden og kan være sand eller falsk: 'Solen er varm'." },
      { term: "Direktiv (regulativ)", def: "Skal få modtageren til at gøre noget: befale, bede, opfordre, råde." },
      { term: "Kommissiv", def: "Afsenderen binder sig selv: love, tilbyde, garantere, undskylde." },
      { term: "Ekspressiv", def: "Udtrykker en følelse eller en holdning: takke, beklage, rose, klage." },
      { term: "Deklarativ (kvalitativ)", def: "Ændrer virkeligheden i samme øjeblik, den siges: 'Jeg erklærer jer for gift'." },
      { term: "Fatisk", def: "Holder kontakten i gang uden at give ny information: 'Hej', 'farvel', 'hvordan går det'." },
      { term: "Indirekte sproghandling", def: "Formen og hensigten er ikke den samme: 'Her er koldt' ser ud som en påstand, men er en opfordring." },
    ],
    trap: "Se på hensigten, ikke på formen. Et spørgsmål som 'Kan du lige kigge på det?' er formelt et spørgsmål, men reelt en direktiv. Chefens høflige spørgsmål er stadig en ordre.",
    obs: "En deklarativ virker kun, hvis afsenderen har retten til det. Præsten kan døbe, postbuddet kan ikke : det er en del af den pragmatiske forståelse.",
  },
  semantik: {
    title: "Semantik: ordenes betydning og ladning",
    lead: "Til eksamen er det ofte ordvalget, der afslører afsenderens holdning. Semantik giver dig begreberne til at sige HVORFOR teksten virker nøgtern eller farvet, og det bruges i opgave 3 om sproglige særtræk.",
    diagram: "denotation",
    goals: [
      "Skelne et ords denotation fra dets konnotationer.",
      "Vurdere, om teksten samlet er nøgtern eller holdningspræget, ud fra ordvalget.",
      "Finde tekstens semantiske felter og bruge dem til at sige noget om emnet.",
      "Genkende de vigtigste troper: metafor, besjæling, metonymi, sammenligning.",
    ],
    terms: [
      { term: "Denotation", def: "Ordets neutrale grundbetydning, den man finder i ordbogen: 'torsk' er en fisk." },
      { term: "Konnotation", def: "Bibetydning og følelsesmæssig ladning, positiv eller negativ: 'torsk' om en dum person." },
      { term: "Semantisk felt", def: "En ord-familie omkring samme emne: skole, blyant, skema, frikvarter." },
      { term: "Hyperonym og hyponym", def: "Overbegreb og underbegreb: møbel er hyperonym for stol og bord." },
      { term: "Synonym og antonym", def: "Ord med samme betydning og ord med modsat betydning: stigning over for fald." },
      { term: "Eufemisme", def: "Et pyntet ord, der gør noget ubehageligt mildere: 'afskedigelse' bliver 'tilpasning af medarbejderstaben'." },
      { term: "Metafor", def: "Et fænomen beskrives gennem et andet: 'min mor er en engel'." },
      { term: "Metonymi", def: "En del eller et symbol står for helheden: 'flere hænder i kantinen'." },
    ],
    trap: "Konnotationer er ikke private følelser, men sociale aftaler. Skriv ikke 'jeg synes, ordet er negativt', men vis hvilken gruppe ord teksten vælger, og hvad de tilsammen lægger op til.",
    obs: "Tæl ordene, før du konkluderer. Mange denotationer peger på et leksikon, en manual eller en fagartikel. Mange konnotationer peger på en tale, et debatindlæg eller en reklame.",
  },
  pragmatik: {
    title: "Pragmatik: sprog i brug",
    lead: "Pragmatik er læren om, hvad afsenderen vil OPNÅ, ikke kun hvad der står. Til eksamen bruger du det, når du beskriver kommunikationssituationen i opgave 2 og forklarer tekstens formål.",
    diagram: "pragmatik",
    goals: [
      "Forklare forskellen på det sagte og det mente ud fra konteksten.",
      "Vurdere, om tekstens register passer til modtageren og situationen.",
      "Bruge begrebet høflighedsstrategi om de forbehold, afsendere pakker budskaber i.",
      "Sige, hvad afsenderen vil opnå, og hvad der står i vejen for det.",
    ],
    terms: [
      { term: "Pragmatik", def: "Læren om sprogets funktion og formål i kommunikationen. Kort: hvad menes der egentlig?" },
      { term: "Kontekst", def: "Alt det uden om ordene, som er med til at bestemme betydningen: situation, relation, tidspunkt, medie." },
      { term: "Register", def: "Det leje, sproget lægges i: formelt, neutralt eller uformelt, afhængigt af modtageren." },
      { term: "Høflighedsstrategi", def: "De forbehold, man pakker et ubehageligt budskab i: 'Jeg er ked af at måtte sige det, men...'" },
      { term: "Sociolingvistik", def: "Studiet af sprog i sociale sammenhænge: sociolekt, dialekt, gruppesprog." },
      { term: "Implicit budskab", def: "Det, modtageren selv skal regne ud. Også tavshed kan være et budskab." },
    ],
    trap: "Pragmatik handler om HENSIGT, ikke om grammatik. Sætningen kan være helt korrekt og alligevel være helt forkert i situationen : fx en intern chatbesked skrevet i kancellisprog.",
    obs: "Læs afsender og modtager, før du læser ordene. Den samme sætning kan være en venlig forespørgsel fra en kollega og en ordre fra en chef.",
  },
  sproghistorie: {
    title: "Sproghistorie: hvor dansk kommer fra",
    lead: "Til eksamen skal du kunne sige noget om tekstens ordforråd, fx om den bruger arveord eller anglicismer. Sproghistorien giver dig forklaringen på, hvorfor ordene ser ud, som de gør.",
    diagram: "laaneord",
    goals: [
      "Skelne arveord, låneord og fremmedord og give eksempler på hver.",
      "Forklare, hvorfor dansk har så mange tyske og franske ord.",
      "Bruge begrebet anglicisme om engelsk påvirkning i nutidsdansk.",
      "Forklare sprogforandring som noget normalt, ikke som forfald.",
    ],
    terms: [
      { term: "Arveord", def: "Ord, der altid har været i dansk, sporet tilbage til urnordisk eller indoeuropæisk: blod, fader, hjul, ko." },
      { term: "Låneord", def: "Ord lånt fra et andet sprog og tilpasset dansk, så de ikke længere virker fremmede: kirke, borgmester, avis." },
      { term: "Fremmedord", def: "Ord optaget i dansk uden at være tilpasset, ofte med afvigende stavemåde: weekend, comeback." },
      { term: "Anglicisme", def: "Engelsk ord eller vending overført til dansk, også i grammatikken: 'jeg er god til det' efter 'I am good at it'." },
      { term: "Lingua franca", def: "Et fælles brugssprog mellem mennesker med forskellige modersmål. I dag er engelsk verdens lingua franca." },
      { term: "Sprogkontakt", def: "Når to sprog møder hinanden og påvirker hinandens ord, lyd og grammatik." },
      { term: "Den germanske lydforskydning", def: "De systematiske lydskift, Rasmus Rask påviste: latin p, d, k svarer til germansk f, t, h. Latin piscis over for dansk fisk." },
    ],
    trap: "Sprogforandring er ikke fejl. At nye ord kommer ind, og gamle forsvinder, er præcis det, der altid er sket. Beskriv forandringen og dens årsag i stedet for at vurdere den.",
    obs: "Ordforrådet følger samfundet. Arveordene dækker husets nødvendigheder, låneordene det, der gør livet bekvemt, og fremmedordene det luksuspræget nye. Ca. 17 % af ordene i en dansk tekst kommer fra tysk, ca. 3 % fra fransk.",
  },
  laeringsstrategier: {
    title: "Læringsstrategier: sådan lærer du sprog hurtigere",
    lead: "AP skal give dig redskaber til at lære alle dine sprogfag. Her er de strategier, forskningen er mest enig om, og som du kan bruge i morgen.",
    diagram: "gentagelse",
    goals: [
      "Planlægge dine gentagelser, så mellemrummene vokser i stedet for at ligge samme aften.",
      "Teste dig selv aktivt i stedet for at læse noterne igen.",
      "Bruge transfer: genkende det, du kan fra dansk, engelsk og tysk, i et nyt sprog.",
      "Føre en fejllog, så du fanger den samme fejl, før den bliver en vane.",
    ],
    terms: [
      { term: "Spaced repetition", def: "Gentagelse med stadig større mellemrum: i dag, i morgen, om tre dage, om en uge. Slår at læse det hele på én aften." },
      { term: "Aktivt genkald", def: "Sig eller skriv svaret, FØR du slår op. Selve anstrengelsen er det, der får ordet til at sidde fast." },
      { term: "Chunking", def: "Lær hele vendinger i stedet for løse ord: 'at tage stilling til' i stedet for 'stilling'." },
      { term: "Transfer", def: "At overføre det, du kan fra et sprog, til et andet. Kasus i latin gør tysk dativ lettere at forstå." },
      { term: "Kontekstgætning", def: "Gæt ordets betydning ud fra sammenhængen og bekræft derefter i ordbogen." },
      { term: "Metakognition", def: "At tænke over din egen læring: hvad forstod jeg faktisk, hvad gik galt, hvad gør jeg anderledes næste gang?" },
      { term: "Fejllog", def: "En liste over de fejl, du gentager. Skriv reglen ved siden af, og læs listen før prøven." },
    ],
    trap: "At genlæse noterne føles effektivt, fordi teksten bliver mere og mere velkendt. Men genkendelse er ikke det samme som at kunne. Dæk svaret, og prøv at huske det : det er ubehageligt, og det er netop derfor, det virker.",
    obs: "En regel, du ikke kan forklare med dine egne ord og et eget eksempel, kan du ikke endnu. Prøv at forklare den for en klassekammerat : det afslører hullerne med det samme.",
  },
};


// ---------------------------------------------------------------------------
// STX-LÆSESIDER.
//
// STX har sin egen AP-undervisning med latindelen, så teksterne herunder er
// skrevet til det pensum : diagrammerne og begrebslisterne er de samme, fordi
// grammatikken er den samme. Har vi først materialet fra en STX-lærer, kan
// teksterne strammes yderligere.
// ---------------------------------------------------------------------------
const base = (c: CategoryId): EmneIntroT => HHX_EMNE_INTRO[c] as EmneIntroT;

export const STX_EMNE_INTRO: Partial<Record<CategoryId, EmneIntroT>> = {
  saetningsled: {
    ...base("saetningsled"),
    lead: "Sætningsanalyse er kernen i AP: du skal kunne dele en sætning i led og navngive dem med de latinske betegnelser : både på dansk og i de latinske sætninger.",
    goals: [
      "Finde leddene i den rigtige rækkefølge (analysepilen) i stedet for at gætte.",
      "Navngive hvert led med den latinske betegnelse og sætte det rigtige analysetegn.",
      "Bruge analysen som bro til latin: leddene hænger sammen med kasus.",
    ],
  },
  morfologi: {
    ...base("morfologi"),
    lead: "Morfologi handler om ordets byggeklodser. På STX bruger du det både til dansk orddannelse og til at gennemskue latinske ord, der er bygget af de samme dele.",
    goals: [
      "Dele et ord i morfemer og navngive hver del.",
      "Kende forskel på afledning (nyt ord) og bøjning (samme ord, ny form).",
      "Genkende de latinske præfikser og suffikser, der også findes i dansk.",
    ],
    obs: undefined,
  },
  tempus: {
    ...base("tempus"),
    lead: "Tiderne hedder det samme på dansk og latin : præsens, præteritum, perfektum, pluskvamperfektum og futurum. Kan du dem på dansk, kan du genkende dem i latinske verber.",
    goals: [
      "Bestemme tiden med både det latinske og det danske navn.",
      "Omskrive en sætning til en anden tid uden at ændre resten.",
      "Overføre tidsbegreberne til latinske verbalformer.",
    ],
  },
  syntaks: {
    ...base("syntaks"),
    lead: "Hoved- og ledsætninger er en fast del af AP. Ikke-reglen er den sikreste test, og den virker både i dansk og i oversatte latinske sætninger.",
    goals: [
      "Bruge ikke-reglen som test i stedet for at gætte.",
      "Kende indlederne: at, fordi, hvis, når, da og som, der.",
      "Sige hvilket led ledsætningen er i hovedsætningen.",
    ],
  },
  ordklasser: {
    ...base("ordklasser"),
    lead: "Ordklasserne er grundlaget for hele AP: de bestemmer, hvordan et ord kan bøjes, og hvilken funktion det kan få i sætningen.",
    goals: [
      "Bestemme ordklassen ud fra ordets egenskaber, ikke ud fra hvad det handler om.",
      "Bruge bøjningstest: kan ordet bøjes i tal, bestemthed eller tid?",
      "Genkende de samme ordklasser i latinske ord.",
    ],
  },
  kasus: {
    title: "Kasus: formen viser funktionen",
    lead: "Latin markerer sætningsleddene med endelser i stedet for med ordstilling. Kender du kasus, kan du læse en latinsk sætning, uanset hvilken rækkefølge ordene står i.",
    diagram: "kasus",
    goals: [
      "Kende de fem kasus og deres funktion i sætningen.",
      "Koble kasus til sætningsleddene: nominativ = subjekt, akkusativ = direkte objekt, dativ = indirekte objekt.",
      "Bruge endelsen frem for ordstillingen, når du oversætter.",
    ],
    terms: [
      { term: "Nominativ", def: "Subjektets kasus: puella cantat : pigen synger." },
      { term: "Akkusativ", def: "Det direkte objekts kasus: video puellam : jeg ser pigen." },
      { term: "Dativ", def: "Det indirekte objekts kasus: do puellae librum : jeg giver pigen bogen." },
      { term: "Genitiv", def: "Ejerforholdets kasus: liber puellae : pigens bog." },
      { term: "Ablativ", def: "Bruges om middel, sted og måde: cum puella : sammen med pigen." },
    ],
    trap: "Dansk har kun rester af kasus (jeg/mig, hans/hendes og genitiv-s). Derfor skal du lede efter ENDELSEN på latin, ikke efter ordets plads i sætningen.",
  },
  sprog: {
    title: "Sprog i verden: familier og slægtskab",
    lead: "Til eksamen skal du kunne placere dansk blandt verdens sprog og forklare, hvorfor du kan genkende ord på tværs af sprog. Det bruges både i genreopgaven og når du kommenterer tekstens ordforråd.",
    diagram: "sprogtraeet",
    goals: [
      "Placere dansk i sprogætten: indoeuropæisk, germansk, nordgermansk, østnordisk.",
      "Forklare, hvorfor fx dansk 'fisk' og latin 'piscis' ligner hinanden.",
      "Skelne sprogæt, sprogfamilie og enkeltsprog fra hinanden.",
      "Bruge de tre niveauer fonem, morfem og grafem præcist.",
    ],
    terms: [
      { term: "Sprogæt", def: "Den største gruppe: alle sprog, der stammer fra samme ursprog. Indoeuropæisk er verdens største og tales af ca. halvdelen af jordens befolkning." },
      { term: "Sprogfamilie", def: "En gren inden i sprogætten, fx germansk, romansk eller slavisk." },
      { term: "Fonem", def: "Den mindste lydenhed, der kan skelne betydning: p over for b i pil og bil." },
      { term: "Morfem", def: "Den mindste betydningsbærende enhed: læs i læser og læsning." },
      { term: "Grafem", def: "Det skrevne tegn for en lyd, altså bogstavet." },
      { term: "Isolat", def: "Et sprog uden kendt slægtskab med nogen sprogæt, fx baskisk." },
    ],
    trap: "Sprog kan godt ligne hinanden uden at være i familie, fx fordi det ene har lånt ord af det andet. Slægtskab viser sig i de gamle kerneord (mor, far, fisk, hjul) og i systematiske lydskift, ikke i moderne låneord som computer.",
  },
};

/** Læsesiden for emnet i det spor, eleven går på. */
export function getEmneIntro(category: CategoryId, education: string): EmneIntroT | null {
  const map = education === "hhx" ? HHX_EMNE_INTRO : STX_EMNE_INTRO;
  return map[category] ?? null;
}
