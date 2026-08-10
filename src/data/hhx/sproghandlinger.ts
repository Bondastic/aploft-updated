import { mc, ck, wr } from "../builders";
import type { Task } from "../../types";

const c = "sproghandlinger" as const;

// SPROGHANDLINGER (HHX-pensum: "sproghandlinger" + "elementær viden om
// sproghandlinger og kommunikationsteori ... både receptivt og produktivt").
// Kernepointen: når vi taler og skriver, GØR vi noget ; vi påstår, spørger,
// opfordrer, lover, råder, advarer, undskylder osv.
export const SPROGHANDLINGER_TASKS: Task[] = [
 mc(
 "sproghandlinger-1",
 c,
 "Hvad er en sproghandling?",
 ["Noget vi GØR med sprog, fx påstå, spørge eller love", "En handling, der udføres helt uden brug af sprog", "Et ord, der beskriver en fysisk bevægelse, fx at løbe", "En grammatisk bøjning af et verbum"],
 0,
 "Når vi siger 'Jeg lover det' eller 'Luk vinduet', gør vi noget med selve ytringen. At kunne genkende sproghandlinger er centralt i HHX AP."
 ),
 mc(
 "sproghandlinger-2",
 c,
 "Hvilken sproghandling udfører man med sætningen 'Jeg lover at sende tilbuddet i morgen'?",
 ["Et løfte", "En påstand", "Et spørgsmål", "En advarsel"],
 0,
 "Verbet 'lover' viser, at taleren forpligter sig til noget fremadrettet ; det er et løfte."
 ),
 mc(
 "sproghandlinger-3",
 c,
 "Hvilken sproghandling er 'Kan du sende mig referatet fra mødet?'?",
 ["En påstand, man kan vurdere som sand eller falsk", "En (høflig, indirekte) opfordring", "Et løfte, man forpligter sig til noget", "En undskyldning for noget, man har gjort"],
 1,
 "Selvom sætningen grammatisk er et spørgsmål, er FUNKTIONEN en opfordring: taleren vil have referatet sendt. Form og funktion behøver ikke at følges ad."
 ),
 mc(
 "sproghandlinger-4",
 c,
 "Hvilken sproghandling er 'Pas på med at sende fortrolige oplysninger i chatten'?",
 ["En advarsel", "Et løfte", "En påstand", "En hilsen"],
 0,
 "Taleren gør opmærksom på en risiko og opfordrer til forsigtighed ; en advarsel (ofte kombineret med en opfordring)."
 ),
 mc(
 "sproghandlinger-5",
 c,
 "Hvilken sproghandling er 'Undskyld, at svaret trak ud'?",
 ["En undskyldning", "Et spørgsmål", "En trussel", "Et tilbud"],
 0,
 "Taleren anerkender en fejl og beder om tilgivelse ; en klassisk undskyldning. I kundeservice er den vigtig for at bevare relationen."
 ),
 mc(
 "sproghandlinger-6",
 c,
 "Hvilken sproghandling er 'Rapporten er nu færdig og sendt til gennemsyn'?",
 ["En påstand", "En opfordring", "Et løfte", "En advarsel"],
 0,
 "Taleren fremsætter noget, der kan vurderes som sandt eller falsk ; en påstand."
 ),
 mc(
 "sproghandlinger-7",
 c,
 "Hvilken sproghandling er 'Jeg synes, du skal tage til netværksmødet på torsdag'?",
 ["Et råd", "Et løfte", "En undskyldning", "Et spørgsmål"],
 0,
 "Taleren anbefaler noget til modtagerens eget bedste ; et råd. Råd kan sagtens være indirekte: 'Jeg ville nok tage af sted, hvis jeg var dig.'"
 ),
 mc(
 "sproghandlinger-8",
 c,
 "En reklame slutter med 'Køb nu ; og få 20 % rabat i dag!'. Hvilken sproghandling dominerer?",
 ["En opfordring", "En påstand", "Et løfte", "En undskyldning"],
 0,
 "Reklamen opfordrer modtageren til at handle nu. Opfordringer er reklamens vigtigste sproghandling."
 ),
 mc(
 "sproghandlinger-9",
 c,
 "Hvad kendetegner en INDIREKTE sproghandling?",
 ["Formen og funktionen passer ikke sammen, fx et spørgsmål der er en opfordring", "Man bruger altid udråbstegn for at vise, at man mener det alvorligt", "Man siger det modsatte af, hvad man mener, hele tiden og i alle sammenhænge", "Man skriver kun på fremmedsprog, så modtageren ikke forstår det"],
 0,
 "Ved indirekte sproghandlinger må man slutte sig til funktionen ud fra konteksten: 'Kan du nå at sende den i dag?' er ikke et ja/nej-spørgsmål om evne, men en (høflig) opfordring."
 ),
 mc(
 "sproghandlinger-10",
 c,
 "Hvorfor bruger man ofte indirekte sproghandlinger i professionelle sammenhænge?",
 ["Fordi de lyder høfligere og giver modtageren plads til at sige nej", "Fordi de er kortere og hurtigere at skrive i en travl hverdag", "Fordi de altid er mere præcise og dækker flere betydninger", "Fordi man dermed undgår grammatiske fejl i sine formuleringer"],
 0,
 "Indirekte opfordringer ('Vil du være sød at ...?') blødgør budskabet og bevarer en god relation ; vigtigt, når man skal samarbejde med kunder og kolleger."
 ),
 mc(
 "sproghandlinger-11",
 c,
 "En chef siger på et møde: 'Jeg synes, vi skal overveje at udskyde deadline.' Hvad er den reelle sproghandling?",
 ["En indirekte opfordring til at udskyde deadline", "Et spørgsmål om tidspunkter og tidsplaner", "Et løfte om at arbejde hurtigere på projektet", "En ren påstand uden nogen betydning for mødet"],
 0,
 "Chefen lægger op til en beslutning uden at give en direkte ordre ; en indirekte opfordring, typisk for ledelseskommunikation."
 ),
 mc(
 "sproghandlinger-12",
 c,
 "Hvilken sproghandling er 'Må jeg byde dig på en kop kaffe?'?",
 ["Et tilbud", "Et løfte", "En advarsel", "En trussel"],
 0,
 "Taleren tilbyder modtageren noget. Tilbud kan genkendes på spørgsmålsform med 'må jeg'/'skal jeg' og en handling til modtagerens fordel."
 ),
 mc(
 "sproghandlinger-13",
 c,
 "Hvilken sproghandling er 'Stop! Det må du ikke gøre!'?",
 ["En ordre/forbud", "Et tilbud", "En undskyldning", "Et løfte"],
 0,
 "Taleren kræver, at modtageren stopper ; en ordre eller et forbud. Ordre er den mest direkte form for opfordring."
 ),
 mc(
 "sproghandlinger-14",
 c,
 "Hvilken sproghandling udfører man ved at sige 'Tillykke med fødselsdagen'?",
 ["En lykønskning", "En påstand", "Et spørgsmål", "En advarsel"],
 0,
 "Selve det at sige det ER handlingen: man lykønsker. Den slags kaldes også performative ytringer ; ordet gør det, det siger."
 ),
 mc(
 "sproghandlinger-15",
 c,
 "Hvad er forskellen på en påstand og et spørgsmål?",
 ["En påstand kan vurderes som sand eller falsk; et spørgsmål beder om svar", "En påstand er altid kort; et spørgsmål er altid langt og indviklet", "Et spørgsmål kan aldrig vurderes; en påstand kan altid vurderes", "Der er ingen forskel, de er to måder at sige det samme på"],
 0,
 "Påstanden fremsætter noget om verden ('Prisen er steget'), spørgsmålet efterspørger noget ('Er prisen steget?'). Begge er sproghandlinger."
 ),
 mc(
 "sproghandlinger-16",
 c,
 "I en pressemeddelelse står: 'Vi er stolte af at kunne meddele, at vi har indgået et nyt samarbejde.' Hvilke to sproghandlinger er i spil?",
 ["En meddelelse (påstand) og en værdiladet vurdering ('stolte')", "Et løfte om fremtidig handling og en trussel om konsekvenser", "En undskyldning for en fejl og en opfordring til at glemme den", "Et spørgsmål om samarbejdet og et tilbud om at mødes"],
 0,
 "Pressemeddelelsen meddeler en kendsgerning, men lægger også følelser og vurdering ind ('stolte', 'glæde') for at skabe positiv opmærksomhed. Sproghandlinger optræder sjældent alene."
 ),
 ck(
 "sproghandlinger-17",
 c,
 "Klik på det ord, der gør sætningen til en DIREKTE opfordring.",
 "Send venligst jeres tilbud inden fredag",
 [0],
 "'Send' er imperativformen (bydeform) ; den gør sætningen til en direkte opfordring."
 ),
 ck(
 "sproghandlinger-18",
 c,
 "Klik på det ord, der afslører, at sætningen er et LØFTE.",
 "Jeg lover at kontakte dig i næste uge",
 [1],
 "'Lover' er selve løftehandlingen: taleren forpligter sig til noget fremadrettet."
 ),
 wr(
 "sproghandlinger-19",
 c,
 "Hvilken sproghandling er 'Vil du have et glas vand?'?",
 "Skriv sproghandlingen:",
 "tilbud",
 "Taleren tilbyder modtageren noget ; et tilbud (ikke et løfte, for der er ingen forpligtelse før modtageren svarer).",
 ["et tilbud", "tilbuddet"]
 ),
 mc(
 "sproghandlinger-20",
 c,
 "Hvorfor er sproghandlinger vigtige at kunne analysere i HHX AP?",
 ["Fordi man skal kunne genkende, hvad en tekst prøver at GØRE ved sin læser", "Fordi man skal kunne stave dem korrekt i en tekst, ellers tæller det forkert", "Fordi de kun findes på engelsk, aldrig på dansk, så man skal oversætte", "Fordi de altid står i bydeform, også kaldet imperativ, i alle tekster"],
 0,
 "En tekst er ikke bare ord ; den handler. I prøven skal du kunne sige, hvilke sproghandlinger en tekst udfører, og vurdere om de passer til situationen."
 ),

  mc("sproghandlinger-21", c, "Hvad er forskellen på en advarsel og en trussel?", ["En advarsel gør opmærksom på en risiko; en trussel lover selv at skade eller straffe", "En advarsel er altid skriftlig, en trussel altid mundtlig", "En advarsel er en påstand, en trussel et spørgsmål", "Der er ingen forskel"], 0, "Ved en advarsel advarer man mod noget, der kan ske; ved en trussel forpligter taleren sig til at gøre noget skadeligt."),
  mc("sproghandlinger-22", c, "Hvilken sproghandling er 'Vil du være sød at sende mig referatet?'", ["En indirekte opfordring", "En påstand om referatet", "Et løfte om at læse referatet", "En undskyldning for at spørge"], 0, "Formen er et spørgsmål, men funktionen er en høflig opfordring: Taleren vil have referatet sendt."),
  mc("sproghandlinger-23", c, "Hvilken sproghandling dominerer i en brugsanvisning?", ["Instruktioner/opfordringer til at gøre noget i en bestemt rækkefølge", "Løfter om, at produktet virker", "Undskyldninger for, at produktet er svært", "Spørgsmål til brugeren"], 0, "En brugsanvisning består af instruktioner: 'Tryk på knappen', 'Vent 10 minutter' - det er opfordringer til handling."),
  mc("sproghandlinger-24", c, "'Jeg vil råde dig til at vente med at underskrive kontrakten.' Hvilken sproghandling er det?", ["Et råd", "Et løfte", "En trussel", "En undskyldning"], 0, "Taleren anbefaler noget til modtagerens eget bedste - det er et råd, også selvom det lyder lidt formelt."),
  mc("sproghandlinger-25", c, "Hvad betyder det, at sproghandlinger er 'performative'?", ["At selve ytringen udfører handlingen, fx 'jeg lover det'", "At de kun findes i teater og skuespil", "At de altid udføres med fagter", "At de kun bruges i reklamer"], 0, "Når man siger 'Jeg lover det', er selve det at sige det en handling: et løfte. Ordet gør det, det siger."),
  mc("sproghandlinger-26", c, "Hvilke sproghandlinger er 'Vi beklager fejlen og sender dig en ny faktura'?", ["En undskyldning og et løfte", "En trussel og en advarsel", "Et spørgsmål og et tilbud", "En påstand og en benægtelse"], 0, "Virksomheden undskylder fejlen (undskyldning) og forpligter sig til at sende en ny faktura (løfte)."),
  mc("sproghandlinger-27", c, "Hvilken sproghandling er 'Må jeg foreslå, at vi genovervejer deadline?'", ["Et forslag", "En ordre", "Et løfte", "En trussel"], 0, "Taleren lægger et forslag frem, som modtageren kan tage stilling til - typisk formuleret som et spørgsmål for at være høflig."),
  mc("sproghandlinger-28", c, "Hvilken sproghandling er 'Velkommen til teamet'?", ["En hilsen/velkomst", "En påstand", "Et løfte", "En advarsel"], 0, "Selve det at sige det er handlingen: man byder nogen velkommen. Det er en fast, performativ formel."),
];