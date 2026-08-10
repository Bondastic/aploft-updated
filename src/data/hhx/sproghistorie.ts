import { mc, ck, wr } from "../builders";
import type { Task } from "../../types";

const c = "sproghistorie" as const;

// SPROGHISTORIE & SPROG I VERDEN (HHX-pensum: "elementær sproghistorie",
// "identificere forskelle og ligheder mellem dansk og fremmedsprog med
// inddragelse af sproghistorisk viden", "sprog og nationalitet samt sprog i
// en globaliseret verden").
export const SPROGHISTORIE_TASKS: Task[] = [
 mc(
 "sproghistorie-1",
 c,
 "Hvilken stor sprogfamilie hører dansk, engelsk, fransk, russisk og græsk alle til?",
 ["De indoeuropæiske sprog", "De uralske sprog", "De semitiske sprog", "De sino-tibetanske sprog"],
 0,
 "De fleste europæiske sprog ; germanske, romanske, slaviske, keltiske m.fl. ; stammer fra samme oldtidssprog: indoeuropæisk."
 ),
 mc(
 "sproghistorie-2",
 c,
 "Hvilke sprog er TÆTTEST beslægtet med dansk?",
 ["Svensk og norsk", "Fransk og spansk", "Russisk og polsk", "Finsk og ungarsk"],
 0,
 "Dansk, svensk og norsk er nordgermanske sprog, der har udviklet sig fra fællesnordisk. De er så tæt beslægtede, at vi nogenlunde kan forstå hinanden."
 ),
 mc(
 "sproghistorie-3",
 c,
 "Hvorfor ligner engelsk og dansk hinanden i grundordforråd : fx 'house'/'hus' og 'mother'/'mor'?",
 ["Fordi begge sprog er germanske og stammer fra samme oldtidssprog", "Fordi engelsk har lånt fra dansk gennem vikingetidens kontakter", "Fordi dansk har lånt fra engelsk gennem de seneste årtier", "Det er en tilfældighed, sprogene har intet med hinanden at gøre"],
 0,
 "Engelsk er (ligesom dansk) et germansk sprog. Derfor deler de grundlæggende ord og mønstre ; noget man kan udnytte, når man lærer sprog."
 ),
 mc(
 "sproghistorie-4",
 c,
 "Hvilke sprog udviklede sig fra latin?",
 ["Fransk, spansk, italiensk, portugisisk og rumænsk", "Engelsk, tysk og hollandsk, som er germanske sprog", "Russisk, polsk og tjekkisk, som er slaviske sprog", "Finsk og ungarsk, som er uralske sprog"],
 0,
 "De romanske sprog er 'datter-sprog' af latin, talt i det tidligere Romerrige. Derfor ligner de hinanden og latin i ordforråd og grammatik."
 ),
 mc(
 "sproghistorie-5",
 c,
 "Hvad kaldes et ord, der er overtaget fra et andet sprog : fx dansk 'chef' fra fransk?",
 ["Et låneord", "Et homonym", "Et antonym", "Et grundord"],
 0,
 "Låneord er ord, der vandrer fra ét sprog til et andet gennem kontakt ; handel, kultur, teknologi. De tilpasses ofte det nye sprogs udtale og stavning."
 ),
 mc(
 "sproghistorie-6",
 c,
 "Hvorfor er der så mange engelske ord i dansk erhvervsliv : fx 'meeting', 'deadline' og 'branding'?",
 ["På grund af globalisering og engelsk som internationalt erhvervssprog", "Fordi dansk mangler ord, så man er tvunget til at låne fra engelsk", "Fordi engelsk er et romansk sprog, som passer bedre til forretning", "Fordi det er forbudt at bruge danske ord i erhvervslivet"],
 0,
 "Engelsk er i høj grad det globale lingua franca for handel og business. Kontakten fører anglicismer ind i dansk ; et levende eksempel på sprogforandring."
 ),
 mc(
 "sproghistorie-7",
 c,
 "Hvad betyder 'lingua franca'?",
 ["Et fælles kommunikationssprog mellem folk med forskellige modersmål", "Et dødt sprog, som ingen taler længere, og som ingen kan læse i dag", "Et sprog, som kun ét land taler", "Et skriftsprog uden nogen talt form"],
 0,
 "Et lingua franca er et sprog, der bruges som fælles bro mellem mennesker med forskellige modersmål. I dag fungerer engelsk sådan globalt ; også i danske virksomheder."
 ),
 mc(
 "sproghistorie-8",
 c,
 "Hvilken påstand om sammenhængen mellem sprog og nationalitet er korrekt?",
 ["Sprog og nationalitet følges ikke altid ad, sprog deles på tværs af lande", "Ethvert land har præcis ét sprog, og det er altid officielt og lovbestemt", "Nationalitet bestemmer altid, hvilket sprog man taler", "Sprog kan aldrig deles mellem flere forskellige lande"],
 0,
 "Engelsk tales i mange lande; Schweiz har fire officielle sprog. Sprog og nationalitet er to forskellige størrelser ; pensum kalder det 'sprog og nationalitet'."
 ),
 mc(
 "sproghistorie-9",
 c,
 "Hvilket fænomen er et eksempel på sprogforandring?",
 ["At 'mobil' først betød 'noget bevægeligt' og nu betyder 'mobiltelefon'", "At alle ord altid betyder det samme, uanset hvornår de bruges", "At grammatikken aldrig ændrer sig, kun ordforrådet gør", "At sprog dør, når de trykkes på papir og ikke tales"],
 0,
 "Ord og betydninger ændrer sig hele tiden ; nye ord opstår, gamle forsvinder eller skifter betydning. Sprogforandring er normalt, ikke undtagelsen."
 ),
 mc(
 "sproghistorie-10",
 c,
 "Hvorfor kan kendskab til sproghistorie hjælpe dig med at lære nye fremmedsprog?",
 ["Fordi man kan genkende fælles rødder og mønstre, fx latinske ord i flere europæiske sprog", "Fordi man skal lære alle sprogs historie udenad, før man kan lære sprog", "Fordi sproghistorie erstatter al glosetræning og grammatik", "Det kan det ikke, for sprogene har intet til fælles overhovedet"],
 0,
 "Kender man ét sprogs rødder, kan man gætte ord i andre: 'information' findes i næsten samme form på dansk, engelsk, fransk og tysk. Det kaldes transfer."
 ),
 mc(
 "sproghistorie-11",
 c,
 "Hvilken sprogfamilie er finsk og ungarsk eksempler på ; og hvorfor er de specielle i Europa?",
 ["De uralske sprog, som IKKE er indoeuropæiske", "De romanske sprog, som stammer fra latin", "De germanske sprog, som dansk og engelsk", "De keltiske sprog, som irsk og walisisk"],
 0,
 "Finsk, estisk og ungarsk hører til den uralske familie og er bygget helt anderledes op end de indoeuropæiske sprog omkring dem."
 ),
 mc(
 "sproghistorie-12",
 c,
 "Hvorfor skriver danske virksomheder ofte deres hjemmeside på engelsk?",
 ["For at nå internationale kunder og samarbejdspartnere", "Fordi dansk er forbudt på internettet, så man må bruge engelsk", "Fordi engelsk er pænere og mere moderne end dansk", "Fordi kunderne altid er britiske eller amerikanske"],
 0,
 "Globaliseringen gør engelsk til det naturlige valg, når man vil nå ud over landets grænser. Sprogvalg er også en kommunikativ beslutning."
 ),
 ck(
 "sproghistorie-13",
 c,
 "Klik på de ord i sætningen, der er LÅNEORD i dansk.",
 "Vi sender en faktura og en kvittering via e-mail",
 [3, 6, 8],
 "'Faktura' (fra latin/italiensk), 'kvittering' (fra tysk/fransk) og 'e-mail' (fra engelsk) er låneord ; de er vandret ind i dansk fra andre sprog."
 ),
 wr(
 "sproghistorie-14",
 c,
 "Hvilken sprogfamilie hører engelsk til?",
 "Skriv familien:",
 "germansk",
 "Engelsk er et germansk sprog ; nærmere bestemt vestgermansk, ligesom tysk og hollandsk.",
 ["de germanske sprog", "den germanske sprogfamilie"]
 ),
 mc(
 "sproghistorie-15",
 c,
 "Hvorfor er sproghistorie en del af HHX AP-pensum?",
 ["Fordi man skal kunne identificere ligheder og forskelle mellem dansk og fremmedsprog", "Fordi man skal lære alle sprogs historie udenad, inklusive årstal og navne", "Fordi det kun handler om dansk sprog og dets oprindelse gennem tiden", "Fordi det er det samme som at lære latin og dets grammatik"],
 0,
 "Sproghistorisk viden gør sprogene gennemsigtige: man ser, hvorfor engelsk og dansk ligner hinanden, og hvorfor fransk og spansk også gør ; og kan bruge det aktivt."
 ),

  mc("sproghistorie-16", c, "Hvilket sprog er tættest beslægtet med fransk?", ["Italiensk og spansk (alle romanske sprog)", "Engelsk og tysk (germanske sprog)", "Russisk og polsk (slaviske sprog)", "Finsk og ungarsk (uralske sprog)"], 0, "Fransk, italiensk og spansk er alle romanske sprog, der stammer fra latin - derfor ligner de hinanden i ordforråd og grammatik."),
  mc("sproghistorie-17", c, "Hvad er en anglicisme?", ["Et engelsk ord eller udtryk, der bruges på dansk", "En engelsk grammatisk fejl", "Et ord, der er forbudt på engelsk", "En dansk dialekt i England"], 0, "Anglicismer er engelske lån i dansk, fx 'meeting', 'deadline' og 'branding' - et tegn på sprogkontakt og globalisering."),
  mc("sproghistorie-18", c, "Hvorfor har dansk mange låneord fra tysk?", ["På grund af århundreders handel, håndværk og kulturel kontakt", "Fordi tysk er et romansk sprog", "Fordi dansk stammer fra tysk", "Det er en tilfældighed"], 0, "Tysk har gennem historien været et vigtigt handels- og kultursprog i Nordeuropa, og mange fagord (fx håndværk og handel) kom derfra."),
  mc("sproghistorie-19", c, "Hvordan bruges engelsk mest i verden i dag?", ["Flest taler det som andetsprog eller fremmedsprog", "Flest taler det som modersmål", "Det tales kun i USA og Storbritannien", "Det er et uddødt sprog"], 0, "Engelsk fungerer som globalt lingua franca: Flere taler det som andetsprog end som modersmål - også i danske virksomheder."),
  mc("sproghistorie-20", c, "Hvilket ord er et eksempel på sprogforandring i dag?", ["'At google' - et firmanavn, der blev et verbum", "Alle ord, der altid betyder det samme", "Ord, der aldrig skifter betydning", "Kun ord fra middelalderen"], 0, "'At google' viser, hvordan nye ord opstår og spreder sig - en levende sprogforandring, man kan følge lige nu."),
  mc("sproghistorie-21", c, "Hvorfor kan man genkende ord på tværs af europæiske sprog?", ["Fordi mange sprog deler oprindelse eller har lånt af hinanden", "Fordi alle sprog er ens", "Fordi man har lavet en fælles europæisk ordbog", "Det kan man ikke"], 0, "Fælles indoeuropæisk oprindelse og århundreders lånekontakt gør, at ord som 'information' findes i næsten samme form mange steder."),
  mc("sproghistorie-22", c, "Hvilken sprogfamilie hører russisk, polsk og tjekkisk til?", ["De slaviske sprog", "De romanske sprog", "De germanske sprog", "De keltiske sprog"], 0, "Russisk, polsk og tjekkisk er slaviske sprog - en anden gren af den indoeuropæiske familie end de germanske og romanske."),
  mc("sproghistorie-23", c, "Hvad er sprogkontakt?", ["Når to sprog mødes og påvirker hinanden, fx gennem handel", "Når man taler to sprog i samme sætning", "Når et sprog uddør", "Når man lærer et sprog i skolen"], 0, "Sprogkontakt opstår, når mennesker med forskellige sprog mødes - og det fører typisk til låneord og andre forandringer."),
];