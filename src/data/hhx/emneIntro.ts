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
  /** Selve forklaringen af emnet, skrevet i korte afsnit. Eleverne bad om
   *  "meget mere tydelig forklaring", så her står HVAD emnet er, og hvorfor
   *  det overhovedet giver mening : ikke bare en liste af begreber. */
  explain: string[];
  /** Diagrammet, der tegnes øverst. */
  diagram: DiagramId;
  /** Det skal du kunne, når du er færdig med emnet. */
  goals: string[];
  /** De begreber, du skal kunne bruge (latinske betegnelser er de primære). */
  terms: { term: string; def: string }[];
  /** Et gennemregnet eksempel, trin for trin. Det er her, eleven ser metoden
   *  brugt på en rigtig sætning i stedet for kun at læse om den. */
  walkthrough?: {
    /** Den sætning, ordet eller teksten, eksemplet bygger på. */
    case: string;
    steps: { step: string; text: string }[];
    /** Det færdige svar, som eleven ville skrive til eksamen. */
    result?: string;
  };
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
    explain: [
      "Et sætningsled er ikke det samme som et ord. Et led er den bid af sætningen, der udfylder ÉN rolle : det kan være ét ord ('hun') eller fem ord ('den nye chef fra Aarhus'). Derfor er første skridt altid at finde, hvor leddene begynder og slutter, og først bagefter sætte navn på dem.",
      "Hele analysen hænger på verballeddet. Når du ved, hvad der sker, kan du spørge dig frem til resten: hvem gør det (subjekt), hvad går det ud over (direkte objekt), hvem er det rettet mod (indirekte objekt), og under hvilke omstændigheder (adverbial). Derfor går du altid samme vej rundt : det er analysepilen.",
      "Verbet bestemmer, hvad der overhovedet kan stå i sætningen. Et kopulaverbum (være, blive, hedde, synes) kan ikke tage et objekt : det tager et subjektsprædikat, der siger noget OM subjektet. Et handlingsverbum kan tage objekt. Derfor kigger du på verbet, før du gætter på leddene.",
    ],
    goals: [
      "Finde leddene i den rigtige rækkefølge (analysepilen) i stedet for at gætte.",
      "Navngive hvert led med den latinske betegnelse og sætte det rigtige analysetegn.",
      "Kende forskel på direkte objekt og subjektsprædikat : og vide, hvorfor de aldrig står i samme sætning.",
    ],
    walkthrough: {
      case: "Den nye salgschef gav kunden en pæn rabat i går.",
      steps: [
        { step: "1. Find verballeddet", text: "Hvad sker der? 'gav'. Det er et handlingsverbum, ikke et kopulaverbum : så der kan godt være objekter i sætningen." },
        { step: "2. Find subjektet", text: "Hvem gav? 'Den nye salgschef'. Læg mærke til, at hele gruppen er ét led, ikke tre." },
        { step: "3. Find det direkte objekt", text: "Gav hvad? 'en pæn rabat'. Det er det, handlingen går ud over." },
        { step: "4. Find det indirekte objekt", text: "Gav til hvem? 'kunden'. Et indirekte objekt kan kun stå der, fordi der også er et direkte objekt." },
        { step: "5. Find adverbialerne", text: "Hvornår? 'i går'. Det er et tidsadverbial. Nu er alle ord brugt, og analysen er færdig." },
      ],
      result: "Den nye salgschef (S) gav (V) kunden (IO) en pæn rabat (DO) i går (A).",
    },
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
    explain: [
      "Morfologi er ordets indre byggeri. Du deler ordet op i de mindste dele, der stadig betyder noget, og sætter navn på hver del. Det kan virke småt, men det er en af de opgaver, hvor du hurtigst kan score point, fordi svaret enten er rigtigt eller forkert : der er ikke noget at diskutere.",
      "Den vigtigste skelnen er mellem afledning og bøjning. Afledning laver et NYT ord: 'klog' bliver til 'kloghed', som er et andet ord i en anden ordklasse. Bøjning laver en ny FORM af det samme ord: 'bog' bliver til 'bøger', men det er stadig ordet bog. Afledningsdelene er præfikser og suffikser, bøjningsdelene er fleksiver.",
      "Start altid med at finde rodmorfemet, altså den del der bærer grundbetydningen. Derefter er resten enten sat foran (præfiks), sat bagpå som ny betydning (suffiks), sat bagpå som bøjning (fleksiv) eller sat ind som lim mellem to ord (bindebogstav).",
    ],
    goals: [
      "Dele et ord i morfemer med bindestreger og navngive hver del.",
      "Kende forskel på afledning (nyt ord) og bøjning (samme ord, ny form).",
      "Genkende bindebogstavet i sammensatte ord, fx stol-e-ben.",
    ],
    walkthrough: {
      case: "pensionsordningerne",
      steps: [
        { step: "1. Find rodmorfemerne", text: "Ordet er sammensat af to ord: 'pension' og 'ordning'. Begge dele har hver sit rodmorfem : 'pension' og 'ordn'." },
        { step: "2. Find bindebogstavet", text: "Mellem de to dele står et '-s-'. Det betyder ikke noget i sig selv : det binder bare de to ord sammen. Det er et bindebogstav, ikke en genitiv." },
        { step: "3. Find afledningen", text: "I 'ordning' sidder '-ing', der laver verbet 'at ordne' om til et substantiv. Det er et suffiks, altså en afledning." },
        { step: "4. Find bøjningen", text: "Til sidst står '-erne', som er flertal og bestemt form. Det er et fleksiv, altså bøjning : ordet er stadig det samme ord." },
        { step: "5. Skriv opdelingen", text: "Sæt bindestreger mellem delene og skriv navnet på hver del. Husk at skrive det hele, også bindebogstavet." },
      ],
      result: "pension-s-ordn-ing-erne : rodmorfem + bindebogstav + rodmorfem + suffiks (afledning) + fleksiv (bøjning).",
    },
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
    explain: [
      "Tempus er den tid, verbet står i. Den fortæller, hvornår handlingen sker i forhold til NU. Det lyder enkelt, men til eksamen skal du kunne mere end at sige 'datid': du skal kunne sætte den latinske betegnelse på og omskrive sætningen til en anden tid, uden at ødelægge resten af sætningen.",
      "Dansk har kun to tider, der dannes ved at bøje selve verbet: præsens ('løber') og præteritum ('løb'). Alle de andre tider er sammensatte : de bruger et hjælpeverbum plus en form af hovedverbet. Perfektum er 'har løbet', pluskvamperfektum er 'havde løbet', og futurum er 'vil løbe'.",
      "Den hurtigste måde at bestemme tempus på er at se på HJÆLPEVERBET, hvis der er et. Står hjælpeverbet i nutid ('har'), er det førnutid. Står det i datid ('havde'), er det førdatid. Er der intet hjælpeverbum, kigger du på hovedverbets egen form.",
    ],
    goals: [
      "Bestemme tiden med både det latinske og det danske navn.",
      "Omskrive en hel sætning til en anden tid uden at ændre resten.",
      "Forklare, hvad tiden gør i teksten: præsens skaber nærhed, præteritum fortæller på afstand.",
    ],
    walkthrough: {
      case: "Virksomheden havde allerede lukket afdelingen, før pressen skrev om sagen.",
      steps: [
        { step: "1. Find verballeddene", text: "Der er to: 'havde lukket' i hovedsætningen og 'skrev' i ledsætningen." },
        { step: "2. Se på hjælpeverbet", text: "'havde' er datidsformen af 'at have'. Hjælpeverbum i datid plus participium giver pluskvamperfektum, altså førdatid." },
        { step: "3. Bestem det andet verbum", text: "'skrev' står alene uden hjælpeverbum og er datidsformen af 'at skrive'. Det er præteritum." },
        { step: "4. Forklar hvorfor", text: "Førdatid bruges netop her, fordi lukningen skete FØR et andet tidspunkt i fortiden : før pressen skrev." },
        { step: "5. Omskriv hvis du bliver bedt om det", text: "Til førnutid sætter du hjælpeverbet i nutid: 'Virksomheden har allerede lukket afdelingen'. Resten af sætningen skal følge med." },
      ],
      result: "'havde lukket' = pluskvamperfektum (førdatid). 'skrev' = præteritum (datid).",
    },
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
    explain: [
      "Syntaks handler om, hvordan sætninger er bygget, og hvordan de hænger sammen. Til eksamen er hovedspørgsmålet: hvad er hovedsætning, og hvad er ledsætning? En hovedsætning kan stå alene og give mening. En ledsætning kan ikke : den hænger fast i noget andet.",
      "Den sikreste test er ikke-reglen. Sæt 'ikke' ind i sætningen. I en hovedsætning lander 'ikke' EFTER det bøjede verbum ('han kom ikke'). I en ledsætning lander 'ikke' FØR det bøjede verbum ('fordi han ikke kom'). Det virker, også når din mavefornemmelse er i tvivl.",
      "Dansk er et V2-sprog: i en helsætning står det bøjede verbum altid som andet led, uanset hvad der står forrest. Derfor hedder det 'I går REGNEDE det' og ikke 'I går det regnede'. Det er den regel, der bliver brudt, når noget lyder oversat fra engelsk.",
    ],
    goals: [
      "Bruge ikke-reglen som test i stedet for at gætte.",
      "Kende indlederne: at, fordi, hvis, når, da (konjunktioner) og som, der (relative pronominer).",
      "Sige hvilket led ledsætningen er i hovedsætningen: subjekt, objekt, adverbial, subjektsprædikat eller attribut.",
    ],
    walkthrough: {
      case: "Fordi kunderne blev væk, måtte butikken lukke i oktober.",
      steps: [
        { step: "1. Del op ved indlederen", text: "'Fordi' er en underordnende konjunktion. Alt fra 'fordi' til kommaet hører til ledsætningen." },
        { step: "2. Test med ikke-reglen", text: "'fordi kunderne IKKE blev væk' : 'ikke' står foran verbet 'blev'. Det bekræfter, at det er en ledsætning." },
        { step: "3. Test den anden del", text: "'butikken måtte IKKE lukke' : her står 'ikke' efter verbet 'måtte'. Det er altså hovedsætningen." },
        { step: "4. Find indlederen og funktionen", text: "Indlederen er 'fordi', og ledsætningen fortæller ÅRSAGEN til, at butikken lukkede. Den er derfor adverbiel." },
        { step: "5. Tjek kommaet", text: "Ledsætningen står først, så der skal komma lige inden hovedsætningen begynder." },
      ],
      result: "Ledsætning: 'Fordi kunderne blev væk' (indleder: fordi, adverbiel, angiver årsag). Hovedsætning: 'måtte butikken lukke i oktober'.",
    },
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
    explain: [
      "En ordklasse er den kasse, et ord hører til i sprogsystemet. Det er ikke det samme som sætningsled: ordklassen følger ordet overalt, mens sætningsleddet skifter, alt efter hvor ordet står. 'Bogen' er altid et substantiv, men det kan være subjekt i én sætning og objekt i en anden.",
      "Du bestemmer ordklassen ved at PRØVE at bøje ordet, ikke ved at gætte på betydningen. Kan du sætte 'en' eller 'et' foran og lave flertal? Så er det et substantiv. Kan du sætte 'at' foran og bøje det i tid? Så er det et verbum. Kan du gradbøje det (stor, større, størst)? Så er det et adjektiv.",
      "De ord, der driller mest, er dem der kan optræde i flere klasser. 'Hurtig' er adjektiv ('en hurtig bil'), mens 'hurtigt' i 'han løber hurtigt' er adverbium, fordi det beskriver verbet og ikke et substantiv. Kig altid på, hvad ordet knytter sig til.",
    ],
    goals: [
      "Bestemme ordklassen ud fra ordets EGENSKABER, ikke ud fra hvad det handler om.",
      "Bruge bøjningstest: kan ordet bøjes i tal, bestemthed eller tid?",
      "Koble ordklasserne til tekstens stil, fx mange adjektiver i en reklame.",
    ],
    walkthrough: {
      case: "Den nye direktør talte meget roligt til de bekymrede medarbejdere.",
      steps: [
        { step: "1. Tag ét ord ad gangen", text: "Begynd forfra. 'Den' peger ud og hører til en bestemt person : det er et determinativ (kendeord)." },
        { step: "2. Prøv adjektivtesten", text: "'nye' : kan gradbøjes (ny, nyere, nyest) og beskriver 'direktør'. Altså adjektiv." },
        { step: "3. Prøv substantivtesten", text: "'direktør' : du kan sige 'en direktør, direktøren, direktører'. Altså substantiv." },
        { step: "4. Prøv verbumtesten", text: "'talte' : du kan sige 'at tale, taler, talte, har talt'. Altså verbum." },
        { step: "5. Se hvad ordet beskriver", text: "'roligt' beskriver HVORDAN han talte, altså verbet. Det gør det til et adverbium, selvom det ligner et adjektiv." },
      ],
      result: "Den (determinativ) nye (adjektiv) direktør (substantiv) talte (verbum) meget (adverbium) roligt (adverbium) til (præposition) de (determinativ) bekymrede (adjektiv) medarbejdere (substantiv).",
    },
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
    explain: [
      "En kommunikationssituation er alt det, der omgiver teksten: hvem skriver, til hvem, om hvad, hvorfor, hvor og hvornår. Til eksamen er det opgave 2, og den kan du ikke svare rigtigt eller forkert på : du skal argumentere ud fra teksten. Derfor er det vigtigt at pege på konkrete steder i teksten frem for at skrive løse formodninger.",
      "Ciceros pentagram er den model, du bruger til at komme hele vejen rundt. De fem punkter er afsender, modtager, emne, omstændigheder og sprog. Pointen er, at de hænger sammen: når emnet er alvorligt og modtageren er en kunde, ændrer sproget sig med det samme.",
      "Husk at skelne mellem den FAKTISKE og den TÆNKTE modtager. En annonce i et fagblad er trykt til alle læsere, men den er skrevet til en bestemt type kunde. Det er tit i den forskel, at analysen bliver interessant.",
    ],
    goals: [
      "Gå pentagrammets fem punkter igennem ét ad gangen med et citat til hvert.",
      "Skelne afsenderen fra de personer, der bare CITERES i teksten.",
      "Formulere formålet som en hensigt: hvad vil afsenderen have modtageren til?",
    ],
    walkthrough: {
      case: "En mail fra en butikschef til alle medarbejdere om, at lukketiden ændres fra på mandag.",
      steps: [
        { step: "1. Afsender", text: "Butikschefen : en person med formel magt over modtagerne. Det giver mailen vægt, uanset hvor venligt den er formuleret." },
        { step: "2. Modtager", text: "Alle medarbejdere. Det er en gruppe med forskellige vagter, så beskeden skal kunne forstås uden ekstra forklaring." },
        { step: "3. Emne", text: "Ændring af lukketid. Det rammer modtagernes hverdag direkte, og derfor er der risiko for modstand." },
        { step: "4. Omstændigheder", text: "Sendt som mail, kort tid før ændringen træder i kraft. Mediet gør beskeden envejs : der er ikke lagt op til diskussion." },
        { step: "5. Sprog", text: "Kig efter, om sproget er formelt eller uformelt, og om chefen bruger høflighedsstrategier for at dæmpe budskabet. Det siger noget om, hvordan magtforholdet håndteres." },
      ],
      result: "Skriv altid din konklusion sammen: afsenderen bruger sit sprog til at gøre en upopulær beslutning acceptabel for en modtagergruppe, der ikke kan svare igen.",
    },
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
    explain: [
      "En genre er et fast mønster for kommunikation. Læseren har lært mønstret udenad, og derfor ved man med det samme, om man læser en nyhedsartikel eller en reklame. De forventninger kaldes genrekoder : de 'spilleregler', afsender og modtager er fælles om.",
      "Når du skal bestemme genren, kigger du ikke på emnet, men på TRÆKKENE: Hvem taler? Er der en afsender med holdning, eller forsøger teksten at virke neutral? Er der kilder og citater? Er der opfordringer til at købe eller gøre noget? Er der billeder, mellemrubrikker, kontaktoplysninger?",
      "Pas på hybridformerne. En advertorial ser ud som en artikel, men er betalt indhold, der vil sælge. En holdningsartikel kan indeholde masser af fakta og alligevel være en opinionstekst. Skriv derfor altid HVILKE træk du bygger din bestemmelse på : det er det, der giver point.",
    ],
    goals: [
      "Placere teksten i en af de fem genrer, du kan komme op i.",
      "Begrunde med genretræk: byline, formål, opbygning, tiltale og virkemidler.",
      "Kende hybridformerne, hvor en genre låner en andens form.",
    ],
    walkthrough: {
      case: "En tekst med rubrikken 'Derfor skal din virksomhed droppe firmabilen' med et billede af skribenten, en holdning i hver anden sætning og ingen kilder.",
      steps: [
        { step: "1. Kig efter afsenderen", text: "Der er et billede og et navn på skribenten. Afsenderen træder frem som person : det peger væk fra nyhedsartiklen." },
        { step: "2. Kig efter holdning", text: "Rubrikken indeholder 'skal' og 'droppe'. Teksten anbefaler noget, i stedet for at referere hvad andre mener." },
        { step: "3. Kig efter kilder", text: "Der er ingen interviewede eksperter eller tal. En informerende artikel ville bygge på kilder." },
        { step: "4. Kig efter salg", text: "Der er ingen pris, intet produkt og ingen opfordring til at købe. Så det er ikke en reklame eller en advertorial." },
        { step: "5. Konkludér med begrundelse", text: "Navngiv genren OG nævn de træk, du byggede den på. Det er begrundelsen, der bliver bedømt." },
      ],
      result: "Det er en opinionsartikel (et debatindlæg), fordi afsenderen træder frem som person, argumenterer for en holdning og ikke bruger kilder.",
    },
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
    explain: [
      "En sproghandling er det, afsenderen GØR med sin sætning. Når nogen siger 'jeg lover at komme', er det ikke en beskrivelse af et løfte : det ER løftet. Derfor siger man, at sprog er performativt. Sætningen udfører handlingen i samme øjeblik, den bliver sagt.",
      "Du bestemmer sproghandlingen ved at spørge: hvad vil afsenderen opnå her? Vil de have mig til at tro noget (assertiv), gøre noget (direktiv), stole på dem (kommissiv), forstå deres følelse (ekspressiv), eller ændrer de selve virkeligheden (deklarativ)?",
      "Det svære er de indirekte sproghandlinger, hvor formen og hensigten ikke stemmer overens. 'Kan du lige kigge på det?' er formelt et spørgsmål, men reelt en ordre, hvis chefen siger det. Derfor skal du altid se på afsender og situation, ikke kun på sætningens form.",
    ],
    goals: [
      "Sætte navn på en sproghandling med den latinske betegnelse.",
      "Se forskel på en direkte og en indirekte sproghandling.",
      "Forklare, hvad det betyder, at sprog er performativt, altså at ytringen selv er handlingen.",
      "Bruge sproghandlingerne til at sige noget om afsenderens hensigt.",
    ],
    walkthrough: {
      case: "En kundeservicemail: 'Vi beklager forsinkelsen. Din pakke er afsendt i dag, og vi sender dig et rabatkort som undskyldning. Giv os endelig besked, hvis noget mangler.'",
      steps: [
        { step: "1. Tag én sætning ad gangen", text: "'Vi beklager forsinkelsen' : afsenderen udtrykker en følelse over noget, der er sket. Det er en ekspressiv sproghandling." },
        { step: "2. Næste sætning", text: "'Din pakke er afsendt i dag' : her påstås noget om virkeligheden, som kan være sandt eller falsk. Det er assertiv." },
        { step: "3. Næste sætning", text: "'vi sender dig et rabatkort' : afsenderen binder sig selv til en fremtidig handling. Det er kommissiv." },
        { step: "4. Sidste sætning", text: "'Giv os endelig besked' : afsenderen vil have modtageren til at gøre noget. Det er direktiv, selvom den er pakket ind i høflighed." },
        { step: "5. Se det samlede mønster", text: "Mailen bevæger sig fra undskyldning til løfte til opfordring. Det er en bevidst strategi, der skal genoprette tilliden." },
      ],
      result: "Ekspressiv (beklagelse) → assertiv (oplysning) → kommissiv (løfte) → direktiv (opfordring).",
    },
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
    explain: [
      "Semantik er læren om betydning. Ord har en grundbetydning, som står i ordbogen : det hedder denotationen. Men de slæber også en masse associationer med sig, som ikke står i ordbogen : det hedder konnotationerne. 'Torsk' betyder en fisk, men kan også betyde en dum person.",
      "Konnotationer er ikke private følelser. De er sociale aftaler: de virker, fordi en hel sproggruppe er enige om, hvad et ord vækker. Derfor kan du bruge dem i en analyse : du påstår ikke noget om dig selv, du påstår noget om, hvordan teksten regner med at virke på sin modtager.",
      "Til eksamen bruger du forholdet mellem de to. Er teksten fuld af neutrale, saglige ord, virker den nøgtern og objektiv : det er typisk for manualer og fagartikler. Er den fuld af ladede ord, virker den holdningspræget : det er typisk for taler, debatindlæg og reklamer.",
    ],
    goals: [
      "Skelne et ords denotation fra dets konnotationer.",
      "Vurdere, om teksten samlet er nøgtern eller holdningspræget, ud fra ordvalget.",
      "Finde tekstens semantiske felter og bruge dem til at sige noget om emnet.",
      "Genkende de vigtigste troper: metafor, besjæling, metonymi, sammenligning.",
    ],
    walkthrough: {
      case: "Fra en artikel: 'Ledelsen har iværksat en tilpasning af medarbejderstaben efter et år med skuffende tal.'",
      steps: [
        { step: "1. Find de ladede ord", text: "'tilpasning' og 'skuffende' springer i øjnene. De er ikke neutrale beskrivelser." },
        { step: "2. Slå denotationen fast", text: "'Tilpasning' betyder egentlig bare en justering. Men her dækker det over, at medarbejdere er blevet fyret." },
        { step: "3. Navngiv virkemidlet", text: "Når et ubehageligt forhold pakkes ind i et mildere ord, hedder det en eufemisme. Den dæmper modstanden hos læseren." },
        { step: "4. Se på konnotationen", text: "'Skuffende' er negativt ladet, men lægger ansvaret et neutralt sted : tallene skuffer, ingen bestemt person har fejlet." },
        { step: "5. Konkludér om afsenderen", text: "Ordvalget beskytter ledelsen. Det peger på, at teksten er skrevet fra virksomhedens side, ikke fra medarbejdernes." },
      ],
      result: "'Tilpasning af medarbejderstaben' er en eufemisme for fyringer. Ordvalget er valgt, fordi det flytter opmærksomheden væk fra ledelsens ansvar.",
    },
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
    explain: [
      "Pragmatik er læren om sprog i brug. Den spørger ikke 'hvad står der?', men 'hvad vil afsenderen opnå?'. Det er forskellen på at læse ordene og at forstå beskeden. 'Her er koldt' betyder rent sprogligt en temperatur, men i en stue med et åbent vindue betyder det 'luk vinduet'.",
      "Konteksten er alt det uden om ordene: hvem taler, til hvem, hvornår, i hvilket medie og med hvilket magtforhold. Skift konteksten, og den samme sætning betyder noget andet. 'Kan du lige kigge på det?' er en venlig forespørgsel fra en kollega og en ordre fra en chef.",
      "Registret er det leje, sproget lægges i. Vi skifter automatisk mellem formelt, neutralt og uformelt sprog efter modtageren. Når registret rammer forkert, føles teksten skæv : en intern chatbesked i kancellisprog virker akavet, og en klage skrevet i smileys bliver ikke taget alvorligt.",
    ],
    goals: [
      "Forklare forskellen på det sagte og det mente ud fra konteksten.",
      "Vurdere, om tekstens register passer til modtageren og situationen.",
      "Bruge begrebet høflighedsstrategi om de forbehold, afsendere pakker budskaber i.",
      "Sige, hvad afsenderen vil opnå, og hvad der står i vejen for det.",
    ],
    walkthrough: {
      case: "En medarbejder skriver til sin chef: 'Jeg er ked af at måtte sige det, men jeg tror desværre ikke, at deadline kan holde.'",
      steps: [
        { step: "1. Find det, der faktisk siges", text: "Kerneoplysningen er kort: deadline holder ikke." },
        { step: "2. Se på indpakningen", text: "'Jeg er ked af at måtte sige det', 'jeg tror', 'desværre' : tre forbehold på én sætning, der alle blødgør beskeden." },
        { step: "3. Navngiv strategien", text: "Det er høflighedsstrategier. De bruges, fordi beskeden er dårligt nyt, og fordi modtageren står over afsenderen." },
        { step: "4. Se på magtforholdet", text: "Medarbejderen skal levere en kritik af planen uden at virke ansvarsløs. Derfor pakkes budskabet ind." },
        { step: "5. Vurdér om det virker", text: "Risikoen er, at chefen overser alvoren, fordi beskeden er dæmpet. Det er netop den slags vurdering, du kan skrive til eksamen." },
      ],
      result: "Sproghandlingen er en advarsel, pakket ind i høflighedsstrategier på grund af magtforholdet mellem afsender og modtager.",
    },
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
    explain: [
      "Dansk er ikke opstået af ingenting. Det er en gren på et meget stort træ: den indoeuropæiske sprogæt, som cirka halvdelen af jordens befolkning taler et sprog fra. Derfra går grenen videre til germansk, til nordgermansk, og til sidst til østnordisk, hvor dansk og svensk sidder sammen.",
      "Rasmus Rask påviste i begyndelsen af 1800-tallet, at slægtskabet kan bevises med systematiske lydskift. De indoeuropæiske lyde p, d og k blev til f, t og h på germansk. Derfor hedder det 'piscis' på latin og 'fisk' på dansk, 'dens' og 'tand', 'cornu' og 'horn'. Det er ikke tilfældigt : det er en regel.",
      "Ordforrådet fortæller sin egen historie om samfundet. Arveordene dækker det, man ikke kan undvære (blod, fader, hjul, ko). Låneordene dækker det, der gør livet bekvemt, og de kom med kristendommen, de tyske handelsfolk og det franske hof. Fremmedordene er de nyeste og er ikke tilpasset dansk endnu.",
    ],
    goals: [
      "Skelne arveord, låneord og fremmedord og give eksempler på hver.",
      "Forklare, hvorfor dansk har så mange tyske og franske ord.",
      "Bruge begrebet anglicisme om engelsk påvirkning i nutidsdansk.",
      "Forklare sprogforandring som noget normalt, ikke som forfald.",
    ],
    walkthrough: {
      case: "Fire ord fra en moderne tekst: ko, kirke, borgmester, weekend.",
      steps: [
        { step: "1. Spørg: kan ordet spores til urnordisk?", text: "'Ko' er et gammelt kerneord, der findes i hele den indoeuropæiske familie. Det er et arveord." },
        { step: "2. Spørg: er det tilpasset dansk?", text: "'Kirke' stammer fra græsk og kom med kristendommen omkring år 1000. Det er tilpasset fuldstændigt og føles dansk. Det er et låneord." },
        { step: "3. Kig på perioden", text: "'Borgmester' kom fra tysk i middelalderen med handelsfolkene. Det er også et låneord : ca. 17 % af ordene i en dansk tekst er tyske." },
        { step: "4. Kig på stavemåde og udtale", text: "'Weekend' staves og udtales ikke efter danske regler. Det er et fremmedord, og det er kommet inden for de sidste 150 år." },
        { step: "5. Konkludér om teksten", text: "Hvis en tekst er fuld af fremmedord, siger det noget om, hvem den er skrevet til, og hvornår den er skrevet." },
      ],
      result: "ko = arveord, kirke = låneord (græsk/latin), borgmester = låneord (tysk), weekend = fremmedord (engelsk).",
    },
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
    explain: [
      "Der er stor forskel på at læse noget og at kunne det. Når du genlæser dine noter, bliver teksten mere og mere velkendt, og det FØLES som om du lærer. Men genkendelse er ikke det samme som at kunne hente svaret frem, når du sidder til eksamen uden noterne foran dig.",
      "Det, der virker, er at teste dig selv. Dæk svaret, prøv at huske det, og tjek først bagefter. Det er ubehageligt, og det er netop derfor, det virker: anstrengelsen er det, der bygger hukommelsen. Det kaldes aktivt genkald.",
      "Den anden halvdel er timingen. Fem gentagelser fordelt over en måned slår fem gentagelser samme aften, fordi hukommelsen bliver stærkest lige når den er ved at glemme. Derfor skal mellemrummene mellem dine gentagelser blive større og større.",
    ],
    goals: [
      "Planlægge dine gentagelser, så mellemrummene vokser i stedet for at ligge samme aften.",
      "Teste dig selv aktivt i stedet for at læse noterne igen.",
      "Bruge transfer: genkende det, du kan fra dansk, engelsk og tysk, i et nyt sprog.",
      "Føre en fejllog, så du fanger den samme fejl, før den bliver en vane.",
    ],
    walkthrough: {
      case: "Du har 30 begreber til AP-prøven om tre uger og en time om dagen.",
      steps: [
        { step: "1. Del stoffet op", text: "Tag 10 begreber ad gangen i stedet for alle 30. Små bunker er lettere at teste dig selv i." },
        { step: "2. Test i stedet for at læse", text: "Læs kun begrebet, ikke forklaringen. Sig forklaringen højt, og slå først op bagefter." },
        { step: "3. Læg en plan med voksende mellemrum", text: "Gentag i dag, i morgen, om tre dage, om en uge og om to uger. Skriv datoerne ned : ellers glider det." },
        { step: "4. Før en fejllog", text: "Hver gang du rammer forkert, skriver du begrebet ned på en liste. Kun den liste læser du dagen før prøven." },
        { step: "5. Forklar det for en anden", text: "Kan du ikke forklare et begreb med dine egne ord og dit eget eksempel, kan du det ikke endnu. Det afslører hullerne med det samme." },
      ],
      result: "En plan, hvor du tester dig selv fem gange med voksende mellemrum, slår at læse noterne igennem fem gange i træk.",
    },
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
    explain: [
      "Kasus er den form, et substantiv eller et pronomen får, alt efter hvilken funktion det har i sætningen. Dansk har næsten mistet systemet : tilbage er forskellen på 'jeg' og 'mig' og ejefalds-s'et. Latin har derimod seks kasus, og det er derfor endelserne fylder så meget, når du oversætter.",
      "Pointen er, at kasus og sætningsled er to sider af samme sag. Subjektet står i nominativ, det direkte objekt i akkusativ, det indirekte objekt i dativ, ejeren i genitiv. Kan du sætningsanalysen på dansk, kan du også aflæse, hvad endelserne på latin fortæller dig.",
      "Fordi endelsen viser funktionen, er ordstillingen fri på latin. 'Puella puerum videt' og 'Puerum puella videt' betyder det samme. Derfor kan du ikke gætte ud fra rækkefølgen : du skal se på endelsen, hver gang.",
    ],
    goals: [
      "Kende de fem kasus og deres funktion i sætningen.",
      "Koble kasus til sætningsleddene: nominativ = subjekt, akkusativ = direkte objekt, dativ = indirekte objekt.",
      "Bruge endelsen frem for ordstillingen, når du oversætter.",
    ],
    walkthrough: {
      case: "Do puellae rosam.",
      steps: [
        { step: "1. Find verbet", text: "'Do' betyder 'jeg giver'. Subjektet ligger i endelsen : der er ikke noget selvstændigt ord for 'jeg'." },
        { step: "2. Kig på endelserne, ikke rækkefølgen", text: "'puellae' og 'rosam' har hver sin endelse, og det er dem, der afgør funktionen." },
        { step: "3. Bestem 'rosam'", text: "Endelsen '-am' er akkusativ ental. Akkusativ er det direkte objekt : det er rosen, der bliver givet." },
        { step: "4. Bestem 'puellae'", text: "Endelsen '-ae' kan være både dativ og genitiv. Men der er allerede et direkte objekt, og nogen skal modtage det. Derfor er det dativ." },
        { step: "5. Oversæt", text: "Sæt det sammen i dansk ordstilling, hvor pladsen viser funktionen i stedet for endelsen." },
      ],
      result: "Jeg (subjekt, i endelsen) giver pigen (dativ = indirekte objekt) en rose (akkusativ = direkte objekt).",
    },
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
    explain: [
      "Verdens cirka 6500 sprog er ikke tilfældigt spredt. De fleste hører til i familier, hvor sprogene nedstammer fra det samme ursprog. Den største hedder den indoeuropæiske sprogæt, og den dækker alt fra dansk og engelsk over fransk og russisk til hindi. Det er derfor, du kan genkende ord på tværs af Europa.",
      "Slægtskab er ikke det samme som lighed. To sprog kan ligne hinanden, fordi det ene har lånt ord af det andet : det siger intet om familie. Ægte slægtskab viser sig i de ældste kerneord (mor, far, fisk, hjul) og i systematiske lydskift, som gælder hele vejen igennem sproget.",
      "Når du beskriver sprog, arbejder du på tre niveauer. Fonemet er den mindste lyd, der kan skelne betydning (p og b i pil og bil). Morfemet er den mindste del, der betyder noget (læs i læser). Grafemet er det skrevne tegn for lyden. De tre niveauer blandes tit sammen, og det koster point.",
    ],
    goals: [
      "Placere dansk i sprogætten: indoeuropæisk, germansk, nordgermansk, østnordisk.",
      "Forklare, hvorfor fx dansk 'fisk' og latin 'piscis' ligner hinanden.",
      "Skelne sprogæt, sprogfamilie og enkeltsprog fra hinanden.",
      "Bruge de tre niveauer fonem, morfem og grafem præcist.",
    ],
    walkthrough: {
      case: "Latin 'piscis', dansk 'fisk', engelsk 'fish', tysk 'Fisch'.",
      steps: [
        { step: "1. Se hvad der er ens", text: "Alle fire ord betyder det samme og har samme grundstruktur. Det er ikke tilfældigt : de er i familie." },
        { step: "2. Find lydskiftet", text: "Latin har 'p' i begyndelsen, de germanske sprog har 'f'. Det er den germanske lydforskydning." },
        { step: "3. Tjek at reglen holder", text: "Prøv med flere ord: latin 'dens' over for dansk 'tand', latin 'cornu' over for dansk 'horn'. Samme mønster hver gang." },
        { step: "4. Placér sprogene", text: "Latin ligger i den italiske gren, dansk, engelsk og tysk i den germanske. Begge grene sidder på den indoeuropæiske sprogæt." },
        { step: "5. Konkludér", text: "Ligheden skyldes fælles ophav, ikke lån. Det kan du vise, fordi lydskiftet er systematisk." },
      ],
      result: "Ordene er beslægtede gennem den indoeuropæiske sprogæt, og forskellen p/f skyldes den germanske lydforskydning, som Rasmus Rask påviste.",
    },
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
