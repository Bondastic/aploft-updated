// "Fra nul til helt med" ; grundlæggende undervisningstrin, der indsættes
// FØRST i hver kategoris allerførste forløbstrin (se paths.ts).
//
// Formålet er at gøre APklar til en lærer, ikke kun en quiz: eleven skal
// aldrig mødes af et spørgsmål om noget, hun ikke lige har fået forklaret.
// Hvert afsnit her følger så vidt muligt: hvad er det? hvorfor er det
// vigtigt? hvordan kender jeg det? et eksempel, og evt. en lille opgave med
// det samme, så eleven kan mærke, at hun allerede forstår det.
//
// Disse trin tælles IKKE med i procent-score (se isContentTask i types.ts).
// kun de rigtige opgaver (mc/ck/an/bs/wr/table-fill), der kommer efter, gør.
import type { CategoryId, Task } from "../types";
import { teach, info, mc, ck, tf } from "./builders";

export const CATEGORY_INTRO: Partial<Record<CategoryId, Task[]>> = {
 // -------------------------------------------------------------------
 // ALMEN SPROGFORSTÅELSE
 // -------------------------------------------------------------------
 kasus: [
 teach(
 "t-kasus-1",
 "kasus",
 "Hvad er en kasus?",
 [
 {
 body:
 "En kasus (også kaldet et 'fald') er den grammatiske form, et navneord, adjektiv eller pronomen får, for at vise, hvilken rolle det spiller i sætningen : fx om det er den, der handler, eller den, handlingen rammer.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Sprog som latin (og til dels tysk) bruger kasusendelser til at vise sætningsled. Kender du kasussystemet, forstår du automatisk logikken bag danske sætningsled OGSÅ ; for de bygger på nøjagtig de samme grundfunktioner.",
 },
 {
 heading: "Har dansk kasus?",
 body:
 "Dansk har næsten ingen kasusendelser tilbage ; bortset fra genitiv-s ('Peters bog') og forskellen på pronomenernes former ('jeg' over for 'mig'). Men de FUNKTIONER, kasus udtrykker, findes stadig i dansk: vi kalder dem bare sætningsled.",
 },
 ],
 { examples: ["Peter (nominativ-agtig funktion: han handler) ser Mette (akkusativ-agtig funktion: hende rammer handlingen)."] }
 ),
 teach(
 "t-kasus-2",
 "kasus",
 "Nominativ: grundleddets kasus",
 [
 {
 body:
 "Nominativ er den kasus, der bruges om sætningens subjekt (grundled) ; den eller det, der udfører handlingen, eller som sætningen handler om.",
 },
 {
 heading: "Sådan kender du den",
 body: "Spørg 'hvem/hvad + verbet?'. Svaret står i nominativ. Det er også den form, du slår et ord op under i en ordbog.",
 },
 ],
 {
 examples: ["Puella cantat. (Pigen synger.) ; 'puella' er nominativ, fordi hun er den, der synger."],
 tip: "Nominativ = grundformen. Når du er i tvivl, så spørg altid: hvem gør det?",
 }
 ),
 mc(
 "t-kasus-ex-1",
 "kasus",
 "'Hunden løber.' Hvilket ord ville stå i nominativ, hvis sætningen var på latin?",
 ["Hunden", "løber", "Ingen af dem"],
 0,
 "'Hunden' er den, der udfører handlingen (løber), og ville derfor stå i nominativ på latin."
 ),
 teach(
 "t-kasus-3",
 "kasus",
 "Akkusativ: genstandsleddets kasus",
 [
 {
 body: "Akkusativ er den kasus, der markerer det direkte objekt (genstandsled) ; det, som handlingen går direkte ud over.",
 },
 {
 heading: "Sådan kender du den",
 body: "Spørg 'verbet + hvem/hvad?'. Svaret er genstandsleddet og ville stå i akkusativ på latin.",
 },
 ],
 { examples: ["Puella puerum videt. (Pigen ser drengen.) ; 'puerum' er akkusativ, fordi han er den, der bliver set."] }
 ),
 mc(
 "t-kasus-ex-2",
 "kasus",
 "'Peter spiser en kage.' Hvilket led ville stå i akkusativ på latin?",
 ["Peter", "en kage", "spiser"],
 1,
 "'En kage' er genstandsleddet (det, handlingen 'spiser' rammer), og ville derfor stå i akkusativ."
 ),
 teach(
 "t-kasus-4",
 "kasus",
 "Dativ og genitiv: de to sidste 'nemme'",
 [
 {
 heading: "Dativ",
 body: "Dativ markerer hensynsleddet ; den, noget gives til eller gøres for. Spørg: 'til/for hvem?'.",
 },
 {
 heading: "Genitiv",
 body: "Genitiv viser ejerskab, ligesom dansk '-s'. Spørg: 'hvis?'.",
 },
 ],
 {
 examples: [
 "Do puellae rosam. (Jeg giver pigen en rose.) ; 'puellae' er dativ (til hvem).",
 "Liber puellae. (Pigens bog.) ; 'puellae' er her genitiv (hvis bog).",
 ],
 tip: "Bemærk at 'puellae' kan være både dativ og genitiv i dette eksempel ; det er betydningen i sætningen, der afgør det, ikke kun formen.",
 }
 ),
 teach(
 "t-kasus-5",
 "kasus",
 "Ablativ og vokativ",
 [
 {
 heading: "Ablativ",
 body: "En bred 'omstændigheds-kasus' der dækker middel, sted, tid og måde ; svarer ofte til dansk 'med', 'i' eller 'fra'.",
 },
 {
 heading: "Vokativ",
 body: "Bruges kun til direkte tiltale ; når man kalder på nogen.",
 },
 {
 heading: "Husk",
 body: "Latin har i alt 6 kasus: nominativ, genitiv, dativ, akkusativ, ablativ og vokativ.",
 },
 ],
 { examples: ["Cum amico venit. (Han kommer med vennen.) ; ablativ.", "Marce, veni! (Marcus, kom!) ; vokativ."] }
 ),
 info(
 "t-kasus-table",
 "kasus",
 "Overblik: sætningsled ↔ kasus",
 "Nu hvor du kender begreberne enkeltvis, er her hele sammenhængen samlet i ét skema. Vend gerne tilbage til den, når du er i tvivl.",
 [
 { label: "Grundled (subjekt)", value: "Nominativ ; hvem/hvad + verbum?" },
 { label: "Genstandsled (objekt)", value: "Akkusativ ; verbum + hvem/hvad?" },
 { label: "Hensynsled (indir. objekt)", value: "Dativ ; til/for hvem?" },
 { label: "Ejerskab ('-s')", value: "Genitiv ; hvis?" },
 { label: "Adverbial (middel/sted/måde)", value: "Ablativ ; hvordan/hvormed/hvorfra?" },
 { label: "Direkte tiltale", value: "Vokativ ; (ingen, direkte tiltale)" },
 ],
 "Videre til opgaverne →"
 ),
 tf(
 "t-kasus-fill",
 "kasus",
 "Prøv at huske sammenhængen: udfyld de tomme felter.",
 "Sætningsled ↔ kasus",
 [
 { label: "Grundled (subjekt)", value: "Nominativ" },
 { label: "Genstandsled (objekt)", value: "Akkusativ" },
 { label: "Hensynsled (indir. objekt)", value: "Dativ" },
 { label: "Ejerskab ('-s')", value: "Genitiv" },
 ],
 [1, 2],
 "Genstandsled = akkusativ (verbum + hvem/hvad?), hensynsled = dativ (til/for hvem?).",
 ["Vokativ", "Ablativ"]
 ),
 ],

 ordklasser: [
 teach(
 "t-ordkl-1",
 "ordklasser",
 "Hvad er en ordklasse?",
 [
 {
 body:
 "En ordklasse er en gruppe af ord, der opfører sig grammatisk ens ; de har samme slags 'job' i en sætning. Dansk har 10 ordklasser i alt.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "For at kunne analysere sætninger, forstå grammatik og lære nye sprog (fx latin) skal du først kunne se, hvilken 'slags' ord du har foran dig.",
 },
 ]
 ),
 teach(
 "t-ordkl-2",
 "ordklasser",
 "Substantiv og verbum",
 [
 {
 heading: "Substantiv (navneord)",
 body: "Navnet på en person, ting, sted eller begreb. Kan typisk sættes 'en/et' foran: en hund, et hus, en glæde.",
 },
 {
 heading: "Verbum (udsagnsord)",
 body: "Udtrykker en handling eller en tilstand. Kan typisk sættes 'at' foran i grundformen: at løbe, at sove, at være.",
 },
 ],
 { examples: ["Hunden (substantiv) løber (verbum) hurtigt."] }
 ),
 mc(
 "t-ordkl-ex-1",
 "ordklasser",
 "Hvilket ord i 'Katten sover' er verbum?",
 ["Katten", "sover"],
 1,
 "'Sover' udtrykker en tilstand/handling og er derfor verbum. 'Katten' navngiver et væsen og er substantiv."
 ),
 teach(
 "t-ordkl-3",
 "ordklasser",
 "Adjektiv og adverbium",
 [
 {
 heading: "Adjektiv (tillægsord)",
 body: "Beskriver et substantiv. Det bøjes typisk efter køn og tal: glad/glad-t/glad-e.",
 },
 {
 heading: "Adverbium (biord)",
 body: "Beskriver et verbum, et adjektiv eller et andet adverbium ; ofte 'hvordan' noget sker. Bøjes ikke på samme måde.",
 },
 {
 heading: "Sådan kender du forskel",
 body: "Spørg: beskriver ordet et navneord? Så er det adjektiv. Beskriver det i stedet en handling eller en egenskab? Så er det adverbium.",
 },
 ],
 { examples: ["En glad (adjektiv) hund løber glad-t → 'glad' som adverbium hedder 'gladeligt'/'glad' afhængigt af sammenhæng ; men 'hurtigt' er tydeligere: 'Han løber hurtigt' (adverbium) vs. 'en hurtig bil' (adjektiv)."] }
 ),
 mc(
 "t-ordkl-ex-2",
 "ordklasser",
 "'Hun synger smukt.' Hvorfor er 'smukt' her et adverbium?",
 ["Fordi det beskriver verbet 'synger' (hvordan hun synger)", "Fordi det står sidst i sætningen", "Fordi det ender på -t"],
 0,
 "'Smukt' fortæller, HVORDAN hun synger ; det beskriver altså verbet, ikke et substantiv, og er derfor adverbium."
 ),
 info(
 "t-ordkl-table",
 "ordklasser",
 "Alle 10 ordklasser på ét overblik",
 "De sidste seks ordklasser møder du løbende i opgaverne. Her er hele listen samlet, så du altid kan slå op.",
 [
 { label: "Substantiv", value: "Navneord ; hund, glæde" },
 { label: "Verbum", value: "Udsagnsord ; løbe, være" },
 { label: "Adjektiv", value: "Tillægsord ; glad, stor" },
 { label: "Adverbium", value: "Biord ; hurtigt, meget" },
 { label: "Pronomen", value: "Stedord ; han, min, som" },
 { label: "Præposition", value: "Forholdsord ; i, på, med" },
 { label: "Konjunktion", value: "Bindeord ; og, men, fordi" },
 { label: "Numerale", value: "Talord ; tre, første" },
 { label: "Interjektion", value: "Udråbsord ; av, hurra" },
 { label: "Artikel", value: "Kendeord ; en, et, den" },
 ],
 "Videre til opgaverne →"
 ),
 ],

 saetningsled: [
 teach(
 "t-sled-1",
 "saetningsled",
 "Hvad er et sætningsled?",
 [
 {
 body:
 "En sætning kan deles op i 'led' ; byggeklodser, der hver har en bestemt funktion. Et sætningsled kan bestå af ét ord eller flere ord, der hører sammen ('den lille hund' er ét led).",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body: "At kunne finde sætningsled er kernen i AP's grammatikdel ; og de 7 officielle symboler bruges i næsten alle analyseopgaver.",
 },
 {
 heading: "Den gode nyhed",
 body: "Der er kun 7 sætningsled i alt. Vi tager dem to og to, så det aldrig føles overvældende.",
 },
 ]
 ),
 teach(
 "t-sled-2",
 "saetningsled",
 "Grundled og udsagnsled",
 [
 {
 heading: "Grundled (subjekt) ; symbol: ×",
 body: "Den eller det, der udfører handlingen, eller som sætningen handler om. Spørg: 'hvem/hvad + udsagnsled?'.",
 },
 {
 heading: "Udsagnsled (verballed) ; symbol: ○",
 body: "Det bøjede verbum i sætningen. Find altid dette FØRST ; det gør det meget nemmere at finde resten.",
 },
 ],
 { examples: ["Katten (grundled, ×) sover (udsagnsled, ○) på sofaen."] }
 ),
 ck(
 "t-sled-ex-1",
 "saetningsled",
 "Klik på udsagnsleddet (det bøjede verbum) i sætningen.",
 "Peter læser en bog",
 [1],
 "'Læser' er det bøjede verbum og dermed udsagnsleddet. Det er ofte klogt at finde dette led først."
 ),
 teach(
 "t-sled-3",
 "saetningsled",
 "Genstandsled og hensynsled",
 [
 {
 heading: "Genstandsled (direkte objekt) ; symbol: △",
 body: "Det, handlingen rammer direkte. Spørg: 'udsagnsled + hvem/hvad?'.",
 },
 {
 heading: "Hensynsled (indirekte objekt) ; symbol: □",
 body: "Den, handlingen kommer til gode eller gives til. Spørg: 'til/for hvem?'.",
 },
 ],
 { examples: ["Peter (×) giver (○) Mia (□, hensynsled) bogen (△, genstandsled)."] }
 ),
 ck(
 "t-sled-ex-2",
 "saetningsled",
 "Klik på genstandsleddet (det direkte objekt) i sætningen.",
 "Læreren skriver ordene på tavlen",
 [2],
 "'Ordene' er det, handlingen 'skriver' går direkte ud over, og er derfor genstandsleddet."
 ),
 teach(
 "t-sled-4",
 "saetningsled",
 "Adverbial",
 [
 {
 body: "Adverbialet (biledet) fortæller om omstændighederne omkring handlingen: tid, sted, måde eller grund. Symbol: 〰",
 },
 { heading: "Sådan kender du det", body: "Spørg: 'hvornår, hvor, hvordan eller hvorfor?'." },
 ],
 { examples: ["Han løb (○) hurtigt gennem skoven (〰, adverbial: måde og sted)."] }
 ),
 teach(
 "t-sled-5",
 "saetningsled",
 "Subjektsprædikat og objektsprædikat",
 [
 {
 heading: "Subjektsprædikat ; symbol: ⊗",
 body: "Siger noget om grundleddet. Optræder efter kopulaverber som 'er', 'bliver', 'hedder', 'virker'.",
 },
 {
 heading: "Objektsprædikat ; symbol: cirkel med trekant",
 body: "Siger noget om genstandsleddet. Optræder efter verber som 'kalde', 'gøre', 'vælge', 'udnævne'.",
 },
 {
 heading: "Huskeregel",
 body: "Begge 'prædikater' beskriver et andet led i stedet for at være et selvstændigt objekt ; de fortæller, hvad nogen/noget ER eller BLIVER kaldt.",
 },
 ],
 { examples: ["Peter (×) er (○) glad (⊗, subjektsprædikat).", "Vi (×) kalder (○) hunden (△) Fido (objektsprædikat)."] }
 ),
 mc(
 "t-sled-ex-3",
 "saetningsled",
 "'Mette bliver lærer.' Hvad er 'lærer' for et led?",
 ["Genstandsled", "Subjektsprædikat", "Hensynsled"],
 1,
 "'Lærer' siger noget om grundleddet 'Mette' efter kopulaverbet 'bliver' ; det er derfor subjektsprædikat (⊗)."
 ),
 info(
 "t-sled-table",
 "saetningsled",
 "Alle 7 symboler samlet",
 "Du har nu mødt alle 7 sætningsled. Du kan altid finde denne oversigt igen under fanen 'Symboler' i bunden af appen.",
 [
 { label: "Grundled", value: "× ; hvem/hvad + verbum?" },
 { label: "Udsagnsled", value: "○ ; det bøjede verbum" },
 { label: "Genstandsled", value: "△ ; verbum + hvem/hvad?" },
 { label: "Hensynsled", value: "□ ; til/for hvem?" },
 { label: "Adverbial", value: "〰 ; hvornår/hvor/hvordan/hvorfor?" },
 { label: "Subjektsprædikat", value: "⊗ ; hvad ER/BLIVER grundleddet?" },
 { label: "Objektsprædikat", value: "cirkel m. trekant ; hvad kaldes/gøres genstandsleddet til?" },
 ],
 "Videre til opgaverne →"
 ),
 ],

 tempus: [
 teach(
 "t-tempus-1",
 "tempus",
 "Hvad er tempus?",
 [
 { body: "Tempus er verbets tidsform ; det fortæller, om noget sker nu, er sket før, eller vil ske i fremtiden." },
 {
 heading: "Hvorfor er det vigtigt?",
 body: "AP-prøven tester, om du kan genkende og navngive de forskellige tider korrekt på dansk, engelsk og latin.",
 },
 ]
 ),
 teach(
 "t-tempus-2",
 "tempus",
 "Nutid og datid",
 [
 { heading: "Præsens (nutid)", body: "Handlingen sker nu, eller er en generel sandhed. Fx: 'Han løber'." },
 { heading: "Præteritum (datid)", body: "Handlingen er afsluttet i fortiden. Fx: 'Han løb'." },
 ]
 ),
 mc(
 "t-tempus-ex-1",
 "tempus",
 "Hvilket tempus har verbet i 'Hun spiste morgenmad'?",
 ["Præsens (nutid)", "Præteritum (datid)"],
 1,
 "'Spiste' beskriver en afsluttet handling i fortiden og står derfor i præteritum (datid)."
 ),
 teach(
 "t-tempus-3",
 "tempus",
 "Førnutid og førdatid",
 [
 {
 heading: "Perfektum (førnutid)",
 body: "Dannes med 'har/er' + kort tillægsform (participium). Bruges om noget, der er sket, men stadig har betydning nu. Fx: 'Han har løbet'.",
 },
 {
 heading: "Pluskvamperfektum (førdatid)",
 body: "Dannes med 'havde/var' + participium. Bruges om noget, der var sket, FØR et andet punkt i fortiden. Fx: 'Han havde løbet'.",
 },
 ],
 { tip: "Bevægelsesverber (komme, gå, blive, dø) bruger 'er/var' i stedet for 'har/havde': 'er kommet', ikke 'har kommet'." }
 ),
 info(
 "t-tempus-table",
 "tempus",
 "De 5 danske tider på ét overblik",
 "Her er alle fem tider samlet, nu hvor du kender dem hver især.",
 [
 { label: "Præsens (nutid)", value: "Han løber" },
 { label: "Præteritum (datid)", value: "Han løb" },
 { label: "Perfektum (førnutid)", value: "Han har løbet" },
 { label: "Pluskvamperfektum (førdatid)", value: "Han havde løbet" },
 { label: "Futurum (fremtid)", value: "Han vil løbe" },
 ],
 "Videre til opgaverne →"
 ),
 ],

 morfologi: [
 teach(
 "t-morf-1",
 "morfologi",
 "Hvad er et morfem?",
 [
 {
 body:
 "Et morfem er den mindste del af et ord, der bærer en betydning. Det kan være et helt ord i sig selv ('hund') eller en lille endelse ('-e' i 'hunde').",
 },
 { heading: "Hvorfor er det vigtigt?", body: "Morfologi handler om, hvordan ord er bygget op ; det hjælper dig med at gætte betydningen af ukendte ord." },
 ],
 { examples: ["'hunde' = 'hund' (grundmorfem) + '-e' (bøjningsmorfem, flertal)."] }
 ),
 teach(
 "t-morf-2",
 "morfologi",
 "Bøjning, afledning og sammensætning",
 [
 { heading: "Bøjning", body: "Ændrer aldrig ordklasse ; kun formen. 'Hund' → 'hunde' er stadig substantiv." },
 {
 heading: "Afledning",
 body: "Skifter ofte ordklasse eller betydning ved hjælp af en for-/endelse. 'Glad' (adj.) → 'glæde' (subst.).",
 },
 { heading: "Sammensætning", body: "To hele ord sættes sammen til ét nyt ord. 'Sol' + 'skin' = 'solskin'." },
 ]
 ),
 mc(
 "t-morf-ex-1",
 "morfologi",
 "'Uklar' er dannet af 'klar' + forstavelsen 'u-'. Hvad kalder vi denne proces?",
 ["Bøjning", "Afledning", "Sammensætning"],
 1,
 "Der dannes et nyt ord med en anden betydning (det modsatte) ved hjælp af en forstavelse ; det er afledning."
 ),
 ],

 syntaks: [
 teach(
 "t-synt-1",
 "syntaks",
 "Hvad er syntaks?",
 [
 { body: "Syntaks handler om, hvordan ord og sætningsled sættes sammen til hele, korrekte sætninger ; reglerne for sætningsbygning." },
 ]
 ),
 teach(
 "t-synt-2",
 "syntaks",
 "Helsætning og ledsætning",
 [
 { heading: "Helsætning", body: "Kan stå alene og give mening. Fx: 'Han spiser.'" },
 {
 heading: "Ledsætning",
 body: "Kan IKKE stå alene ; den er afhængig af en helsætning, og indledes ofte af ord som 'fordi', 'at', 'som', 'hvis'. Fx: '..., fordi han er sulten.'",
 },
 ]
 ),
 mc(
 "t-synt-ex-1",
 "syntaks",
 "Hvilken af disse er en ledsætning (kan ikke stå alene)?",
 ["Hun løber hurtigt", "fordi hun er glad"],
 1,
 "'Fordi hun er glad' giver ikke fuld mening alene og er afhængig af en hovedsætning ; det er en ledsætning."
 ),
 teach(
 "t-synt-3",
 "syntaks",
 "Dansk ordstilling: V2-reglen",
 [
 {
 body:
 "Dansk er et 'V2-sprog': det bøjede verbum (udsagnsleddet) skal altid stå som sætningens andet led ; uanset hvad der står først.",
 },
 ],
 {
 examples: ["I går regnede det. ; Selvom sætningen starter med tidsangivelsen 'i går', er 'regnede' stadig andet led."],
 tip: "Engelsk er IKKE et V2-sprog ; det bruger i stedet 'do/does/did' i spørgsmål, hvor dansk bytter om på subjekt og verbum.",
 }
 ),
 ],

 sprog: [
 teach(
 "t-sprog-1",
 "sprog",
 "Sprogfamilier",
 [
 {
 body:
 "Sprog grupperes i familier efter deres fælles oprindelse. Dansk hører til de germanske sprog, ligesom engelsk og tysk. Fransk, spansk og italiensk hører til de romanske sprog, som stammer fra latin.",
 },
 ]
 ),
 teach(
 "t-sprog-2",
 "sprog",
 "Fonem og morfem",
 [
 { heading: "Fonem", body: "Den mindste lydenhed i et sprog. Fx forskellen på lyden 'p' og 'b' i 'pil' og 'bil'." },
 { heading: "Morfem", body: "Den mindste betydningsenhed. Fx grundordet 'hund' eller endelsen '-e' i 'hunde'." },
 ]
 ),
 mc(
 "t-sprog-ex-1",
 "sprog",
 "Hvad kaldes den mindste lydenhed i et sprog?",
 ["Morfem", "Fonem", "Leksem"],
 1,
 "Et fonem er den mindste lydenhed, der kan ændre betydningen af et ord (fx 'p' vs. 'b')."
 ),
 teach(
 "t-sprog-3",
 "sprog",
 "Kommunikationsmodellen",
 [
 {
 body:
 "Modellen beskriver, hvordan en afsender sender et budskab gennem en kanal til en modtager ; og hvordan 'støj' undervejs kan forstyrre budskabet.",
 },
 ]
 ),
 ],

 // -------------------------------------------------------------------
 // LATINDEL
 // -------------------------------------------------------------------
 sumesse: [
 teach(
 "t-sum-1",
 "sumesse",
 "Det vigtigste latinske verbum: esse",
 [
 {
 body: "'Esse' betyder 'at være' og er det mest brugte ; men også mest uregelmæssige ; verbum i latin.",
 },
 {
 heading: "Hvorfor starte her?",
 body: "Næsten alle latinske sætninger, du møder til AP-prøven, indeholder en form af 'esse'. Kan du den udenad, er du allerede godt på vej.",
 },
 {
 heading: "Person og tal",
 body: "Ligesom på dansk ('jeg er', 'du er', 'han er') har latin en form for hver 'person' (jeg/du/han-hun-den) og hvert 'tal' (ental/flertal).",
 },
 ]
 ),
 info(
 "t-sum-table",
 "sumesse",
 "Esse i nutid (præsens) ; hele tabellen på én gang",
 "Kig roligt på skemaet. Du skal ikke huske det udenad endnu ; de næste trin lærer dig hver form for sig.",
 [
 { label: "jeg er", value: "sum" },
 { label: "du er", value: "es" },
 { label: "han/hun/den er", value: "est" },
 { label: "vi er", value: "sumus" },
 { label: "I er", value: "estis" },
 { label: "de er", value: "sunt" },
 ],
 "Videre til opgaverne →"
 ),
 tf(
 "t-sum-fill",
 "sumesse",
 "Prøv straks at huske et par af formerne: udfyld de tomme felter.",
 "Esse i nutid (præsens)",
 [
 { label: "jeg er", value: "sum" },
 { label: "du er", value: "es" },
 { label: "han/hun/den er", value: "est" },
 { label: "vi er", value: "sumus" },
 { label: "I er", value: "estis" },
 { label: "de er", value: "sunt" },
 ],
 [1, 4],
 "'Es' (du er) og 'estis' (I er) hører begge til 2. person ; ental og flertal.",
 ["erat", "amat"]
 ),
 ],

 ordforraad: [
 teach(
 "t-ordfor-1",
 "ordforraad",
 "Hvorfor lære latinske rødder?",
 [
 {
 body:
 "Latin er roden til de romanske sprog (fransk, spansk, italiensk) og har givet talrige ord til både dansk og engelsk.",
 },
 {
 heading: "Hvordan hjælper det dig?",
 body: "Kender du en latinsk rod, kan du ofte gætte betydningen af helt ukendte danske eller engelske ord.",
 },
 ],
 { examples: ["Latin 'aqua' (vand) → dansk 'akvarium', engelsk 'aquatic'."] }
 ),
 ],

 grammatik: [
 teach(
 "t-gram-1",
 "grammatik",
 "Deklination og konjugation",
 [
 {
 heading: "Deklination",
 body: "Den bøjningsrække, et navneord følger gennem alle kasus. Latin har 5 deklinationer ; 1. og 2. er vigtigst at kunne først.",
 },
 {
 heading: "Konjugation",
 body: "Den bøjningsrække, et verbum følger gennem person og tal. Latin har 4 konjugationer.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body: "Når du kender mønstret, kan du 'regne ud' formen af ord, du aldrig har set før ; i stedet for at skulle huske dem enkeltvis.",
 },
 ],
 { examples: ["1. deklination (fx 'puella'): ender på '-a' i nominativ og er overvejende hunkøn."] }
 ),
 ],

 oversaettelse: [
 teach(
 "t-overs-1",
 "oversaettelse",
 "Sådan oversætter du en latinsk sætning",
 [
 { heading: "1. Find verbet", body: "Find udsagnsordet først ; endelsen fortæller dig hvem der handler, og hvornår det sker." },
 {
 heading: "2. Se på endelserne, ikke rækkefølgen",
 body: "Latinsk ordstilling er fri. Stol på kasusendelserne (nominativ = subjekt, akkusativ = objekt), ikke på hvor ordet står.",
 },
 { heading: "3. Brug oversættelsesarket", body: "Du må altid bruge oversættelsesarket til svære gloser ; også til den rigtige prøve." },
 ],
 { tip: "Byg altid sætningen op i denne rækkefølge: find verbet → find subjektet (nominativ) → find objektet (akkusativ) → resten." }
 ),
 ],

 kultur: [
 teach(
 "t-kultur-1",
 "kultur",
 "Hvorfor arbejde med romersk kultur?",
 [
 {
 body:
 "AP-prøven tester ikke kun sprog, men også kendskab til den romerske verden, som latin og europæisk kultur er groet ud af.",
 },
 { heading: "Hvad skal du vide?", body: "De vigtigste emner er samfundsstruktur (senat, forum), hverdagsliv og arven fra antikken i vores egen tid." },
 ]
 ),
 ],
};
