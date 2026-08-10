import { mc, ck, wr } from "../builders";
import type { Task } from "../../types";

const c = "laeringsstrategier" as const;

// LÆRINGSSTRATEGIER (HHX-pensum: "anvende forskellige strategier til
// indlæring af fremmedsprog", "strategier for sprogtilegnelse", "anvende
// faglige opslagsværker og hjælpemidler").
export const LAERINGSSTRATEGIER_TASKS: Task[] = [
 mc(
 "laeringsstrategier-1",
 c,
 "Hvad er en læringsstrategi?",
 ["En bevidst metode eller plan for, hvordan man lærer noget", "En grammatisk regel for, hvordan man bøjer verber i nutid og datid", "En tekstgenre, som fx en forretningsmail", "En sprogfamilie, som fx de germanske sprog"],
 0,
 "Læringsstrategier er de bevidste greb, man bruger for at lære og huske: gentagelser, ordkort, mønstergenkendelse, kontekstgætning og meget andet."
 ),
 mc(
 "laeringsstrategier-2",
 c,
 "Du skal læse en tysk forretningsmail og møder ordet 'Information'. Du gætter, at det betyder 'information'. Hvad bruger du?",
 ["Transfer, hvor du overfører viden fra andre sprog, du kan", "En sproghandling, man opfordrer nogen til noget", "En metafor, man sammenligner med noget andet", "En grammatisk bøjning, man genkender endelsen"],
 0,
 "Transfer er at bruge viden fra ét sprog i et andet: 'Information' findes på dansk, engelsk og fransk i næsten samme form. Det er en af de vigtigste strategier."
 ),
 mc(
 "laeringsstrategier-3",
 c,
 "Hvorfor hjælper det at kende endelsen '-tion' (fx 'information', 'kommunikation'), når man lærer engelsk?",
 ["Fordi mange engelske '-tion'-ord ligner danske ord med samme betydning", "Fordi '-tion' altid betyder det modsatte af det danske ord, man kender", "Fordi alle ord på engelsk ender på '-tion', så det er en sikker regel", "Det hjælper ikke, man skal lære hvert ord udenad for sig"],
 0,
 "Mønstergenkendelse: engelske ord på '-tion' svarer ofte til danske på '-tion' (information, kommunikation, organisation). At spotte mønstre gør ordforrådet lettere."
 ),
 mc(
 "laeringsstrategier-4",
 c,
 "Hvilken metode er mest effektiv til at huske nye gloser på et fremmedsprog?",
 ["Gentagne møder med ordet i forskellige sammenhænge, fx ordkort med jævne mellemrum", "At skrive ordet ned én gang i sin notesbog og aldrig se på det igen", "At læse ordet højt for sig selv én gang og gentage det dagen efter", "At undgå ordet, indtil man møder det igen i en helt ny tekst"],
 0,
 "Hjernen husker bedst ved gentagne møder spredt over tid (spaced repetition) og når ordet optræder i meningfulde sammenhænge ; ikke ved at proppe det på én gang."
 ),
 mc(
 "laeringsstrategier-5",
 c,
 "Du møder sætningen 'The company will launch the product next week' og kender ikke 'launch'. Hvad er den bedste strategi?",
 ["Gæt betydningen ud fra konteksten omkring ordet", "Stop med at læse, hvis der er ord, man ikke kender", "Slå hvert eneste ord op med det samme, også kendte", "Gæt altid tilfældigt uden at se på sammenhængen"],
 0,
 "Kontekstgætning: omkringordene ('company', 'product', 'next week') afslører, at 'launch' må betyde 'lancere'. Man slår kun op, når gættet ikke er godt nok."
 ),
 mc(
 "laeringsstrategier-6",
 c,
 "Hvornår er det klogt at slå et ord op i en ordbog eller et digitalt opslagsværk?",
 ["Når konteksten ikke er nok, og ordet er vigtigt for forståelsen", "Aldrig, man skal altid gætte sig frem i stedet for at slå op", "Altid, for hvert eneste ord man ikke kender med det samme", "Kun i eksamener, aldrig i hverdagen"],
 0,
 "Opslagsværker er et hjælpemiddel, man skal kunne bruge hensigtsmæssigt: slå op, når det betaler sig ; ikke for hvert eneste ord."
 ),
 mc(
 "laeringsstrategier-7",
 c,
 "På engelsk siger man 'make a decision', ikke 'do a decision'. Hvad kaldes sådanne faste ordforbindelser?",
 ["Kollokationer", "Homonymer (samme form, forskellig betydning)", "Antonymer (modsatte betydninger)", "Låneord (fra andre sprog)"],
 0,
 "Kollokationer er ord, der typisk optræder sammen. At lære ord sammen med deres kollokationer gør sproget langt mere naturligt."
 ),
 mc(
 "laeringsstrategier-8",
 c,
 "Du får en rettet engelsk opgave tilbage med fejl understreget. Hvad er den bedste måde at bruge feedbacken på?",
 ["Gennemgå fejlene, forstå reglerne bag, og øv de mønstre", "Lægge opgaven væk og glemme alt om de fejl, man har lavet", "Kun se på karakteren og ikke på fejlene", "Omskrive hele teksten fra bunden uden at se på fejlene først"],
 0,
 "Feedback er en gave: fejlene viser præcis, hvad du skal øve. At lære af sine fejl er en læringsstrategi i sig selv."
 ),
 mc(
 "laeringsstrategier-9",
 c,
 "Hvorfor er det en god idé at lære gloser i SÆTNINGER i stedet for enkeltvis?",
 ["Fordi man lærer ordets betydning og brug på samme tid", "Fordi sætninger er kortere og hurtigere end enkeltord", "Fordi man så slipper for at læse ordene enkeltvis", "Det er ikke en god idé, enkeltord er bedst"],
 0,
 "Ord i kontekst giver både betydning, grammatik og brug: man lærer ikke bare 'launch', men også 'launch a product'."
 ),
 mc(
 "laeringsstrategier-10",
 c,
 "Hvilken strategi bruger du, når du deler et langt engelsk ord op i dele for at forstå det : fx 'un-believ-able'?",
 ["Morfemanalyse: man deler ordet i betydningsbærende dele", "Kontekstgætning, hvor man gætter ud fra sætningen", "Transfer, man bruger et andet sprog", "Oversættelse ord-for-ord med en ordbog ved siden af"],
 0,
 "Morfemanalyse er at dele ordet i betydningsbærende dele: 'un-' (ikke), 'believe' (tro), '-able' (kan). Så kan man ofte gætte betydningen."
 ),
 mc(
 "laeringsstrategier-11",
 c,
 "Hvorfor er læringsstrategier en del af HHX AP-pensum?",
 ["Fordi man skal kunne lære sprog effektivt gennem gymnasietiden og i erhvervslivet", "Fordi man skal undervise andre i at lære sprog, det er pensum", "Fordi det kun handler om at bestå eksamen med en god karakter", "Fordi alle strategier virker præcis ens, så man skal kende dem"],
 0,
 "Læreplanen kræver, at du kan anvende forskellige strategier til indlæring af fremmedsprog ; det er en studiekompetence, der rækker ud over selve AP."
 ),
 ck(
 "laeringsstrategier-9b",
 c,
 "Klik på det ord i sætningen, du lettest kan gætte betydningen af, hvis du kan engelsk.",
 "Appen er brugervenlig og meget intuitiv",
 [5],
 "'Intuitiv' ligner engelsk 'intuitive' (og fransk 'intuitif') ; transfer fra andre sprog afslører betydningen."
 ),
 wr(
 "laeringsstrategier-12",
 c,
 "Hvad kaldes det, når man bruger viden fra ét sprog til at forstå eller lære et andet sprog?",
 "Skriv ordet:",
 "transfer",
 "Transfer er overførsel af viden mellem sprog : fx at genkende 'information' på tværs af dansk, engelsk og tysk.",
 ["sprogtransfer", "transfer mellem sprog"]
 ),
 mc(
 "laeringsstrategier-13",
 c,
 "Hvilken strategi er bedst, når du skal forberede dig til en mundtlig præsentation på engelsk?",
 ["Øv højt, gerne for andre, og lær nøglefraser udenad", "Læs præsentationen grundigt i hovedet et par gange", "Skriv den og glem den", "Undgå at forberede dig"],
 0,
 "At øve højt og bruge faste vendinger giver tryghed og flow. Sprogtilegnelse kræver aktiv produktion ; ikke kun passiv læsning."
 ),
 mc(
 "laeringsstrategier-14",
 c,
 "Hvad er forskellen på at lære et ord 'receptivt' og 'produktivt'?",
 ["Receptivt = genkende; produktivt = selv bruge det i tale og skrift", "Receptivt betyder at skrive, og produktivt betyder at lytte og læse", "Der er ingen forskel, det er to navne for det samme", "Receptivt er kun for børn, produktivt for voksne"],
 0,
 "Man forstår typisk flere ord, end man selv bruger. At flytte ord fra det receptive til det produktive ordforråd kræver aktiv brug ; netop dét, strategierne handler om."
 ),

  mc("laeringsstrategier-15", c, "Hvad er 'spaced repetition'?", ["At gentage stof med stigende mellemrum over tid", "At lære alt på én gang lige før eksamen", "At gentage det samme ord 100 gange på én dag", "At lære uden at gentage noget"], 0, "Spaced repetition udnytter, at hjernen husker bedst, når man møder stoffet igen lige før man glemmer det - fx med ordkort."),
  mc("laeringsstrategier-16", c, "Hvorfor hjælper det at læse fremmedsprog højt?", ["Man får udtalen med, og hjernen husker gennem flere sanser", "Fordi man så ikke behøver at forstå det", "Fordi det altid er hurtigere", "Det hjælper ikke"], 0, "At læse højt aktiverer både syn, tale og hørelse - og træner udtalen, så ordene bliver nemmere at bruge selv."),
  mc("laeringsstrategier-17", c, "Hvad er 'chunking' i sprogindlæring?", ["At lære faste fraser som hele enheder, fx 'I would like to...'", "At dele ord i enkeltbogstaver", "At lære kun ét ord om dagen", "At skrive alt ned med store bogstaver"], 0, "Chunking er at lære ord i faste klumper og fraser i stedet for enkeltord - så bliver sproget hurtigere og mere naturligt."),
  mc("laeringsstrategier-18", c, "Hvad gør man klogt, hvis man gentager den samme fejl igen og igen?", ["Øver netop det mønster bevidst og bruger feedbacken aktivt", "Lader være med at lave opgaver", "Skifter helt emne", "Accepterer, at man ikke kan lære det"], 0, "Gentagne fejl viser præcis, hvor man skal øve: Lav målrettede øvelser i mønstret, og tjek reglen hver gang."),
  mc("laeringsstrategier-19", c, "Hvorfor er aktiv brug af sproget bedre end kun at lytte og læse?", ["Fordi man dermed flytter ord fra passivt til aktivt ordforråd", "Fordi man så ikke behøver at lære grammatik", "Fordi lytning aldrig hjælper", "Det er det ikke, passiv læring er bedst"], 0, "At lytte og læse er receptivt; at tale og skrive er produktivt. Aktiv brug gør ordene til ens egne og styrker hukommelsen."),
  mc("laeringsstrategier-20", c, "Hvad er fordelen ved at bruge flashcards (ordkort)?", ["Man træner aktiv genkaldelse og kan blande rækkefølgen", "Man kan gemme dem i en skuffe", "De er altid billigere end bøger", "De erstatter al undervisning"], 0, "Flashcards tvinger hjernen til aktivt at genkalde ordet (i stedet for bare at genkende det) - og man kan gentage netop de svære kort."),
  mc("laeringsstrategier-21", c, "Hvordan lærer man en svær grammatikregel bedst?", ["Ved at se mange eksempler og selv lave sætninger med reglen", "Ved at læse reglen én gang i en grammatikbog", "Ved at undgå reglen", "Ved kun at lave multiple choice-opgaver"], 0, "Regler giver mening gennem eksempler og egen produktion: Man skal selv bruge reglen i sætninger for at gøre den til sin."),
  mc("laeringsstrategier-22", c, "Hvad betyder 'metakognition' i forhold til læring?", ["At man tænker over sin egen læring og justerer sin strategi", "At man lærer udenad uden at tænke", "At man lærer sammen med andre", "At man kun lærer gennem apps"], 0, "Metakognition er 'tænkning om tænkning': Man vurderer, hvad man kan, hvad der virker, og lægger om, hvis noget ikke dur."),
];