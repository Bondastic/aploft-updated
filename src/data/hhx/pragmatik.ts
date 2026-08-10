import { mc, ck, wr } from "../builders";
import type { Task } from "../../types";

const c = "pragmatik" as const;

// PRAGMATIK ; sproget i brug (HHX-pensum: "sprog brugt i private, faglige og
// professionelle sammenhænge", "pragmatiske synsvinkler på tekster").
// Pragmatik handler om, hvad konteksten gør ved betydningen.
export const PRAGMATIK_TASKS: Task[] = [
 mc(
 "pragmatik-1",
 c,
 "Hvad er pragmatik?",
 ["Læren om, hvordan sprog bruges i konkrete situationer", "Læren om ordenes grundbetydning, som man finder den i ordbogen", "Læren om, hvordan man bygger sætninger op i et sprog", "Læren om ords oprindelse og historie"],
 0,
 "Hvor semantik ser på ordets faste betydning, ser pragmatik på, hvad ytringen BETYDER i den konkrete situation ; hvem siger det, til hvem, og hvorfor."
 ),
 mc(
 "pragmatik-2",
 c,
 "En kollega siger 'Det var da en god idé' med sarkastisk tone efter et møde. Hvorfor forstår man, at det ikke er ros?",
 ["Fordi konteksten og tonen viser det modsatte, det er pragmatik", "Fordi ordet 'god' altid betyder det samme", "Fordi sætningen er grammatisk forkert", "Fordi man ikke kan sige 'god idé' efter et møde, det er upassende"],
 0,
 "Betydningen opstår i mødet mellem ord, tone og situation. At aflæse dét er pragmatisk forståelse ; og vigtigt i professionel kommunikation."
 ),
 mc(
 "pragmatik-3",
 c,
 "Hvad betyder 'at læse mellem linjerne'?",
 ["At forstå det underforståede budskab, der ikke står direkte", "At læse teksten grundigt flere gange i træk", "At læse med blyant og notere undervejs", "At læse teksten på et helt fremmedsprog"],
 0,
 "Meget kommunikation er indirekte: man siger ét, men mener noget mere. At læse mellem linjerne er at inddrage konteksten og det usagte."
 ),
 mc(
 "pragmatik-4",
 c,
 "En kunde skriver bare '?!?' som svar på en mail. Hvad signalerer det mest sandsynligt?",
 ["Forvirring eller utilfredshed med den modtagne mail", "Glæde over at have modtaget svaret", "At kunden er enig i alt, hvad mailen siger", "At kunden vil have mere information om noget andet"],
 0,
 "Tegnene er non-verbal feedback i skrift: kunden er forvirret eller irriteret. At kunne aflæse sådanne signaler er en del af at kommunikere hensigtsmæssigt."
 ),
 mc(
 "pragmatik-5",
 c,
 "Hvilken sætning er mest hensigtsmæssig, når man skriver til en ny, vigtig kunde?",
 ["Kære hr. Jensen. Tak for henvendelsen. Jeg vender tilbage med et tilbud.", "Hej! Sender lige et tilbud, ok? ;) Skriv endelig, hvis der er noget, jeg kan hjælpe med.", "Kære Jensen! Hvad så? Har du tænkt over tilbuddet, eller hvad?", "Hej du. Her er prisen. Mvh mig. Vi kan også tale sammen i morgen."],
 0,
 "Til en ukendt, vigtig modtager vælger man en formel, struktureret og høflig tone. Det er at tilpasse sproget til situationen ; pragmatisk kompetence."
 ),
 mc(
 "pragmatik-6",
 c,
 "Hvorfor siger man ofte 'Kan du sende mig rapporten?' i stedet for 'Send mig rapporten!'?",
 ["Fordi den indirekte form er høfligere og giver modtageren plads", "Fordi den er kortere og hurtigere at skrive i en travl hverdag", "Fordi den altid er mere præcis og dækker flere betydninger", "Fordi man kun må bruge spørgsmål på arbejdspladsen"],
 0,
 "Indirekte opfordringer blødgør budskabet og bevarer en god relation. Valget mellem direkte og indirekte sprog er situationsafhængigt."
 ),
 mc(
 "pragmatik-7",
 c,
 "Hvilken sammenhæng passer sproget 'Jeg beklager ulejligheden og vil straks undersøge sagen' bedst til?",
 ["En professionel kundeservice-situation", "En SMS til en god ven (uformel)", "En tale til en fødselsdag (festlig)", "Et opslag på sociale medier (offentligt)"],
 0,
 "Den formelle, ansvarlige tone passer til professionel kommunikation. Det samme indhold ville lyde forkert i en SMS til en ven ; derfor er registerbevidsthed vigtig."
 ),
 mc(
 "pragmatik-8",
 c,
 "Hvad kalder man de forskellige sproglige stillejer : fx privat, faglig og professionel ; som man skifter mellem efter situationen?",
 ["Registre", "Dialekter", "Sprogfamilier", "Synonymer"],
 0,
 "Et register er den variant af sproget, der passer til situationen: uformel tone til venner, fagudtryk til kolleger, formel tone til kunder og myndigheder."
 ),
 mc(
 "pragmatik-9",
 c,
 "En virksomhed skriver 'Vi har desværre måttet hæve prisen på grund af stigende råvareomkostninger' i stedet for 'Prisen er steget'. Hvorfor?",
 ["For at forklare og tage brodden af en negativ besked", "For at skjule sandheden om, at prisen i virkeligheden er steget", "Fordi lange sætninger altid er bedre end korte", "Der er ingen forskel, de to sætninger betyder helt det samme"],
 0,
 "Ved at forklare årsagen og undskylde blødgør man en negativ besked. At tage hensyn til modtagerens reaktion er en central del af pragmatisk kompetence."
 ),
 mc(
 "pragmatik-10",
 c,
 "Hvilken af følgende er en underforstået måde at sige nej på?",
 ["'Det kan desværre ikke lade sig gøre i denne omgang, men lad os se på det igen næste kvartal.'", "'Nej, det kan jeg desværre ikke, fordi jeg har alt for travlt i denne uge.', fordi det er ærligt og direkte", "'Det vil jeg ikke.', fordi det er ærligt og direkte", "'Glem det.', fordi det er en tydelig afvisning"],
 0,
 "Det indirekte nej afviser uden at såre: man giver et lille håb og holder døren åben. I professionelle sammenhænge foretrækkes ofte den bløde afvisning."
 ),
 mc(
 "pragmatik-11",
 c,
 "Hvorfor bruger virksomheder ofte 'vi' i stedet for 'jeg' i kundekommunikation?",
 ["Fordi 'vi' signalerer, at hele virksomheden står bag budskabet", "Fordi 'vi' er grammatisk korrekt, mens 'jeg' er en stavefejl", "Fordi 'jeg' altid er uprofessionelt, også i private mails", "Der er ingen forskel, man kan bruge begge i flæng"],
 0,
 "'Vi' skaber afstand til den enkelte medarbejder og signalerer en fælles, professionel afsender. Valget af pronomen er også en pragmatisk handling."
 ),
 mc(
 "pragmatik-12",
 c,
 "To venner skriver SMS'er til hinanden, og den ene svarer kun 'ok'. Hvordan skal det forstås?",
 ["Det afhænger af konteksten, fx tone, tidligere beskeder og relationen", "Det betyder altid, at vedkommende er sur og ikke gider skrive mere", "Det betyder altid, at vedkommende er glad og tilfreds med beskeden", "Det er en stavefejl, man skulle have skrevet 'okay'"],
 0,
 "Et kort 'ok' kan betyde alt fra 'fint' til 'jeg er irriteret' ; alt efter situationen. Pragmatik handler netop om at fortolke ytringer i kontekst."
 ),
 mc(
 "pragmatik-13",
 c,
 "Hvilken påstand om sprog og situation er korrekt?",
 ["En sætning kan være passende i én situation og upassende i en anden", "En sætning er enten altid passende eller også altid upassende", "Kun længden på sætningen afgør, om den passer", "Situationen har overhovedet ingen betydning for sprogbrugen"],
 0,
 "Hensigtsmæssig kommunikation betyder, at sproget passer til afsender, modtager, emne og situation ; læreplanens helt centrale krav."
 ),
 ck(
 "pragmatik-14",
 c,
 "Klik på det ord, der gør denne sætning til UFORMEL (privat) kommunikation.",
 "Hej! Kan du lige sende mig priserne på nye kontorstole",
 [0],
 "'Hej!' og 'lige' er uformelle markører, der passer til en privat eller uformel relation ; ikke til en formel henvendelse."
 ),
 wr(
 "pragmatik-15",
 c,
 "Hvad kaldes den sprogvidenskabelige disciplin, der undersøger, hvordan sprog bruges i konkrete situationer?",
 "Skriv disciplinen:",
 "pragmatik",
 "Pragmatik er læren om sprog i brug ; hvordan kontekst og situation styrer betydning og valg af sprog.",
 ["pragmatikken"]
 ),
 mc(
 "pragmatik-16",
 c,
 "Hvorfor er pragmatik et selvstændigt punkt i HHX AP-pensum?",
 ["Fordi man i erhvervslivet skal kunne tilpasse sprog til kunder og situationer", "Fordi man skal kunne stave ordet pragmatik korrekt i alle tekster", "Fordi det kun handler om ironi og humor i tekster og tale", "Fordi det er det samme som grammatik og semantik, bare et andet navn"],
 0,
 "Læreplanen lægger vægt på at kunne kommunikere hensigtsmæssigt i nationale og internationale, herunder erhvervsmæssige, sammenhænge ; dét er pragmatik i praksis."
 ),

  mc("pragmatik-17", c, "Hvorfor skriver man 'På forhånd tak' i slutningen af en mail?", ["Som en høflig formel, der forventer en handling fra modtageren", "Fordi man skal sige tak mindst én gang i hver mail", "For at gøre mailen længere og mere formel", "Det er en stavefejl, man skal undgå"], 0, "'På forhånd tak' er en fast høflighedsformel: Man takker på forhånd for det, man beder modtageren om at gøre."),
  mc("pragmatik-18", c, "Hvad kan det signalere, hvis en virksomhed ikke svarer på en kundes mail?", ["At kunden ikke er prioriteret - manglende svar er også kommunikation", "At virksomheden altid er enig med kunden", "At mailen automatisk er blevet læst og godkendt", "Intet, tavshed er aldrig et signal"], 0, "Man kan ikke lade være med at kommunikere: Tavshed og manglende svar sender også et signal til modtageren."),
  mc("pragmatik-19", c, "Hvilket register passer til en intern chat med kolleger?", ["Et uformelt, men fagligt register", "Et helt formelt register med 'Kære hr.'", "Et juridisk register med kontraktvilkår", "Et poetisk register med metaforer"], 0, "Intern chat er typisk uformel, men stadig faglig: Man skriver kort og direkte, uden at være uprofessionel."),
  mc("pragmatik-20", c, "Hvorfor siger man 'Jeg er ked af at måtte sige det, men...' før dårligt nyt?", ["For at blødgøre budskabet og vise hensyn til modtageren", "Fordi man er bange for at blive fyret", "For at gøre budskabet længere", "Det er kun en talemåde uden funktion"], 0, "Markøren forbereder modtageren på dårligt nyt og viser, at afsenderen har modtagerens reaktion i tankerne."),
  mc("pragmatik-21", c, "En chef skriver 'Kan du lige kigge på det?' til en medarbejder. Hvad er det reelt?", ["En indirekte opfordring til at tage sig af sagen", "Et spørgsmål om chefens syn", "Et tilbud om hjælp", "En ren høflighedsfrase"], 0, "Selvom det er formuleret som et spørgsmål, er det en opfordring: Medarbejderen forventes at handle. Det afgør konteksten."),
  mc("pragmatik-22", c, "Hvorfor tilpasser man sprog og indhold til modtageren?", ["For at sikre forståelse og vise respekt for modtageren", "Fordi det er et krav i grammatikken", "For at gøre teksten længere", "Det gør man kun i reklamer"], 0, "Man skriver ikke det samme til en kunde, en kollega og en myndighed. Tilpasning til modtageren er hensigtsmæssig kommunikation."),
  mc("pragmatik-23", c, "Hvad betyder 'at tale udenom'?", ["Ikke at sige det vigtigste direkte, men gå udenom det", "At tale med en udenlandsk kollega", "At tale hurtigere end normalt", "At gentage det samme flere gange"], 0, "At tale udenom er at undgå at sige tingene lige ud - ofte for at undgå at såre eller forpligte sig."),
  mc("pragmatik-24", c, "Hvilken sætning er mest hensigtsmæssig i en klage til en virksomhed?", ["Jeg modtog en defekt vare den 3. maj og ønsker en ny eller refusion", "I er nogle amatører, jeg er så vred", "Hvad sker der? Kan I ikke finde ud af noget?", "Glem det, jeg handler aldrig hos jer igen"], 0, "En saglig klage med konkrete oplysninger (hvad, hvornår, hvad man ønsker) er mest hensigtsmæssig og giver hurtigst svar."),
];