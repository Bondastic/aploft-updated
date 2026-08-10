import { mc, ck, wr } from "../builders";
import type { Task } from "../../types";

const c = "kommunikation" as const;

// KOMMUNIKATION & KOMMUNIKATIONSMODELLEN (HHX-pensum: "elementær
// kommunikationsteori", "verbal og non-verbal kommunikation", "sproglig
// praksis" og "det udvidede tekstbegreb"). Alle eksempler er
// erhvervsrelaterede, som læreplanen lægger op til.
export const KOMMUNIKATION_TASKS: Task[] = [
 mc(
 "kommunikation-1",
 c,
 "Hvad er de tre helt grundlæggende elementer i enhver kommunikationssituation?",
 ["En afsender, et budskab og en modtager", "Et subjekt, et verbum og et objekt", "En overskrift, en brødtekst og en signatur", "Et sprog, en grammatik og et ordforråd"],
 0,
 "Kommunikation er altid nogen (afsender), der sender noget (budskab) til nogen (modtager). Alt det andet i modellen bygger ovenpå de tre."
 ),
 mc(
 "kommunikation-2",
 c,
 "I kommunikationsmodellen ; hvad kaldes den vej eller det medie, budskabet sendes igennem?",
 ["Kanalen", "Koden", "Støjen", "Konteksten"],
 0,
 "Kanalen er mediet: fx tale, skrift, e-mail, telefon eller video. Valget af kanal påvirker, hvordan budskabet udformes."
 ),
 mc(
 "kommunikation-3",
 c,
 "En kunde ringer ind og siger 'I har sendt mig en faktura, jeg ikke kan forstå'. Hvad er afsenderen i denne situation?",
 ["Kunden, fordi det er hende, der henvender sig", "Fakturaen, fordi den er genstand for samtalen", "Virksomhedens medarbejder, der taler med kunden", "Telefonen, fordi den bærer samtalen"],
 2,
 "Afsenderen er den, der kommunikerer ; her medarbejderen, der modtager og svarer på henvendelsen. Kunden er modtager af fakturaen, men afsender af klagen."
 ),
 mc(
 "kommunikation-4",
 c,
 "Hvad kaldes alt det, der kan forstyrre eller forvrænge et budskab på vej fra afsender til modtager?",
 ["Støj", "Feedback", "Parafrase", "Kanal"],
 0,
 "Støj kan være fysisk (baggrundslarm), sproglig (fremmedord, sludder) eller psykologisk (forudindtagethed). Støj er grunden til, at budskabet ikke altid når frem, som afsenderen havde tænkt det."
 ),
 mc(
 "kommunikation-5",
 c,
 "Hvilket af følgende er et eksempel på 'støj' i en kommunikationssituation?",
 ["En medarbejder svarer bekræftende på et spørgsmål", "Høj musik i baggrunden, så ordene drukner under et telefonmøde", "Modtageren videresender en mail til en kollega", "Afsenderen hilser pænt på modtageren"],
 1,
 "Støj er alt, der forstyrrer: baggrundslarm, dårlig forbindelse, uklart sprog eller fordomme hos modtageren."
 ),
 mc(
 "kommunikation-6",
 c,
 "Hvad kaldes modtagerens reaktion tilbage til afsenderen : fx et nik, et svar eller en mail tilbage?",
 ["Feedback", "Støj (forstyrrelse af budskabet)", "Kode (det sprog, budskabet er i)", "Monolog (en enetaler)"],
 0,
 "Feedback er modtagerens reaktion og gør kommunikationen til en dialog. Uden feedback kan afsenderen ikke vide, om budskabet nåede frem."
 ),
 mc(
 "kommunikation-7",
 c,
 "Hvad forstås ved 'konteksten' i en kommunikationssituation?",
 ["De omstændigheder og den situation, kommunikationen foregår i", "Det sprog og det medie, som budskabet bliver sendt igennem", "Afsenderens personlige ejendele og private forhold", "Antallet af ord i selve budskabet"],
 0,
 "Konteksten er situationen omkring kommunikationen: hvem, hvornår, hvor, hvorfor ; og hvilke forventninger parterne har. Konteksten styrer, hvordan et budskab skal forstås."
 ),
 mc(
 "kommunikation-8",
 c,
 "Hvorfor kan den samme sætning betyde forskellige ting i forskellige kontekster?",
 ["Fordi konteksten og modtageren er med til at afgøre forståelsen", "Fordi sætninger aldrig har en fast betydning, de har mange forskellige", "Fordi afsenderen altid lyver i den ene kontekst", "Det kan den ikke, for betydningen er altid præcis den samme"],
 0,
 "Betydningen opstår i mødet mellem budskab, situation og modtager. 'Det var da smart' kan være ros på et møde og ironi i en helt anden situation."
 ),
 mc(
 "kommunikation-9",
 c,
 "Hvilken form for kommunikation er kropssprog, mimik, gestik og stemmeføring?",
 ["Non-verbal kommunikation", "Verbal kommunikation", "Skriftlig kommunikation", "Indirekte kommunikation"],
 0,
 "Non-verbal kommunikation foregår uden ord: kropssprog, ansigtsudtryk, håndbevægelser, øjenkontakt og stemmens tone. Verbal kommunikation er ord ; mundtlige eller skriftlige."
 ),
 mc(
 "kommunikation-10",
 c,
 "En sælger siger 'Selvfølgelig kan vi klare den opgave' med nedslåede øjne og en usikker stemme. Hvad kan modtageren med rette lægge mærke til?",
 ["At det non-verbale (usikkerhed) modsiger det verbale (selvsikkerhed)", "At sælgeren taler for hurtigt til, at man kan følge med i det hele", "At sætningen er for lang og indviklet til at være professionel", "At der mangler et komma i sætningen"],
 0,
 "Når det verbale og non-verbale modsiger hinanden, stoler vi oftest på det non-verbale. Bevidsthed om det er kernestof i AP: viden om verbale og non-verbale kommunikationssituationer."
 ),
 mc(
 "kommunikation-11",
 c,
 "Hvilke af følgende tæller alle som 'tekster' i AP's udvidede tekstbegreb?",
 ["En reklameplakat, et Instagram-opslag og en mundtlig præsentation", "Kun bøger, avisartikler og andre trykte tekster på papir", "Kun tekster med mere end 100 ord og en overskrift", "Kun skriftlige tekster på dansk, ikke på andre sprog"],
 0,
 "Det udvidede tekstbegreb dækker alt, der kommunikerer: skrift, tale, billeder, film, reklamer, hjemmesider, SoMe-opslag, lyd og meget mere."
 ),
 mc(
 "kommunikation-12",
 c,
 "En virksomhed laver et opslag på Instagram med et foto, en kort tekst og tre hashtags. Hvad er kanalen her?",
 ["Instagram", "Fotografen", "Hashtagene", "Virksomheden"],
 0,
 "Kanalen er mediet, budskabet sendes igennem ; her Instagram. Virksomheden er afsender, følgerne er modtagere."
 ),
 mc(
 "kommunikation-13",
 c,
 "Hvorfor udformer man ofte det samme budskab forskelligt, alt efter hvilket medie det skal ud i?",
 ["Fordi mediet sætter rammer for længde, sprog og udtryk, fx kort på SoMe", "Fordi man altid skal skrive det samme, uanset hvilket medie det udgives i", "Fordi kun billeder ændrer sig fra medie til medie, aldrig teksten", "Det gør man ikke, budskabet er altid ens i alle medier"],
 0,
 "Mediebevidsthed handler om at tilpasse budskabet til kanalen: et SoMe-opslag er kort og i øjenhøjde, en forretningsmail er struktureret og formel, en annonce spiller på billeder."
 ),
 mc(
 "kommunikation-14",
 c,
 "Hvilken situation kræver den mest formelle sprogbrug?",
 ["En skriftlig henvendelse til en ny, vigtig kunde", "En SMS til en god ven", "En kommentar under en vens billede på sociale medier", "En chat med familien"],
 0,
 "Jo vigtigere relationen og jo mere ukendt modtageren er, desto mere formel bliver sprogbrugen. At vælge det rette niveau kaldes at kommunikere hensigtsmæssigt."
 ),
 mc(
 "kommunikation-15",
 c,
 "En leder sender samme besked til hele virksomheden pr. mail og siger den samme besked på et personalemøde. Hvad er den vigtigste forskel i situationen?",
 ["På mødet er der øjeblikkelig feedback, man kan se og høre reaktionen", "Mails er altid mere formelle end tale, uanset hvem man skriver til", "På møder må man kun bruge non-verbal kommunikation, ikke tale", "Der er ingen forskel, beskeden virker præcis ens i begge tilfælde"],
 0,
 "Ved mundtlig kommunikation i samme rum får afsenderen løbende feedback (nik, spørgsmål, mimik), som man kan reagere på med det samme. I en mail er feedback forsinket."
 ),
 ck(
 "kommunikation-16",
 c,
 "Klik på det ord, der er KANALEN i denne sætning.",
 "Mette sender en mail til kunden med det nye tilbud",
 [3],
 "'Mail' er kanalen ; den vej, budskabet sendes igennem. Mette er afsender, kunden er modtager."
 ),
 ck(
 "kommunikation-17",
 c,
 "Klik på de to ord, der beskriver NON-VERBAL feedback i denne sætning.",
 "Kunden kvitterede med et smil og et nik",
 [4, 8],
 "'Smil' og 'nik' er non-verbal feedback ; kunden reagerer uden ord."
 ),
 wr(
 "kommunikation-18",
 c,
 "I en jobannonce fra virksomheden Nordlys står: 'Vi søger en serviceminded kundekonsulent.' Hvem er afsenderen af annoncen?",
 "Hvem er afsenderen?",
 "nordlys",
 "Afsenderen er den, der har udformet budskabet ; her virksomheden Nordlys (eller arbejdsgiveren).",
 ["virksomheden", "arbejdsgiveren", "nordlys a/s", "virksomheden nordlys"]
 ),
 mc(
 "kommunikation-19",
 c,
 "Hvorfor er det vigtigt at kunne analysere afsender, modtager, emne og situation i en tekst?",
 ["Fordi det forklarer, hvorfor teksten er skrevet, som den er", "Fordi man så kan undgå at læse hele teksten grundigt igennem", "Fordi eksamen kræver, at man tæller ordene i teksten, ikke andet", "Det er kun vigtigt for reklamer, ikke for andre tekster"],
 0,
 "En elementær kommunikationsanalyse går på: Hvem skriver? Til hvem? Om hvad? I hvilken situation (og medie)? ; og vurderer, om sprogbrugen passer dertil. Det er en central del af HHX AP-prøven."
 ),
 mc(
 "kommunikation-20",
 c,
 "Hvilken påstand er korrekt om sammenhængen mellem sprog og situation?",
 ["Man vælger ord og tone efter modtager, emne og situation", "Sproget er helt det samme, uanset hvem man skriver til og hvorfor", "Kun i reklamer tilpasser man sproget", "Kun når man skriver på engelsk, tilpasser man sproget"],
 0,
 "Hensigtsmæssig kommunikation betyder netop, at sprogbrugen passer til situationen: en klage til en leverandør lyder anderledes end en tak til en kollega."
 ),

  mc("kommunikation-21", c, "Hvad er forskellen på enkeltkanalet og flerkanalet kommunikation?", ["Mundtlig kommunikation bruger flere kanaler (tale, mimik, kropssprog), skriftlig ofte kun én", "Skriftlig kommunikation bruger altid flere kanaler end mundtlig", "Der er ingen forskel, begge bruger præcis én kanal", "Enkeltkanalet betyder, at man kun må sige én ting ad gangen"], 0, "Når man taler ansigt til ansigt, sender man på flere kanaler samtidig (ord, tone, ansigt, krop). En skriftlig besked har typisk kun ordene (og evt. layout/emojis) som kanal."),
  mc("kommunikation-22", c, "Hvorfor kan en mundtlig aftale nemmere misforstås end en skriftlig?", ["Der er ingen fast dokumentation, og tone og kropssprog kan fortolkes forskelligt", "Fordi man taler hurtigere, end man skriver", "Fordi mundtlige aftaler altid er på et fremmedsprog", "Det kan den ikke, mundtlige aftaler er altid klare"], 0, "En skriftlig aftale kan man gå tilbage og tjekke; en mundtlig hviler på hukommelse og fortolkning af tone og kropssprog."),
  mc("kommunikation-23", c, "Hvilken kanal er bedst til en kort, tidskritisk besked til en kollega?", ["En chatbesked eller et hurtigt opkald", "Et formelt brev sendt med posten", "En 20 sider lang rapport", "En annonce i avisen"], 0, "Til korte, tidskritiske beskeder vælger man en hurtig kanal (chat, SMS, opkald). Lange, formelle kanaler passer til noget andet."),
  mc("kommunikation-24", c, "Hvad betyder 'at kommunikere hensigtsmæssigt'?", ["At vælge sprog og kanal, så budskabet passer til situationen og modtageren", "At man altid skriver så formelt som muligt", "At man altid bruger så få ord som muligt", "At man kun kommunikerer på engelsk"], 0, "Hensigtsmæssig kommunikation er tilpasset afsender, modtager, emne, situation og medie - det er kernen i HHX AP."),
  mc("kommunikation-25", c, "En virksomhed svarer på en dårlig anmeldelse online. Hvem er modtageren?", ["Både anmelderen og alle andre, der læser svaret", "Kun anmelderen, ingen andre", "Kun virksomhedens egne medarbejdere", "Kun platformens ejere"], 0, "Svaret er en offentlig tekst: Det henvender sig til anmelderen, men alle potentielle kunder kan læse det - derfor skal tonen være professionel."),
  mc("kommunikation-26", c, "Hvorfor er layout og emojis også kommunikation?", ["Fordi de sender signaler om tone og budskab uden ord", "Fordi de erstatter al skriftlig tekst", "Fordi de kun bruges i private beskeder", "Det er de ikke, kun ord tæller"], 0, "Non-verbal kommunikation findes også i skrift: layout, farver, emojis og tegnsætning sender signaler om, hvordan budskabet skal forstås."),
  mc("kommunikation-27", c, "Hvad er forskellen på en monolog og en dialog?", ["En monolog er en enetaler, en dialog er en samtale med feedback", "En monolog er skriftlig, en dialog er mundtlig", "En monolog er altid kort, en dialog altid lang", "Der er ingen forskel"], 0, "I en dialog giver modtageren feedback, så afsenderen kan justere undervejs. I en monolog er der ingen umiddelbar respons."),
  mc("kommunikation-28", c, "En leder sender en vigtig besked til alle medarbejdere. Hvilken kanal giver flest muligheder for misforståelser?", ["En mundtlig besked givet i en travl kantine", "En skriftlig mail med klare overskrifter", "En skriftlig besked på intranettet med punktliste", "En rapport med bilag og dokumentation"], 0, "Støj og manglende opmærksomhed i kantinen gør en mundtlig besked let at misforstå - især hvis den er vigtig og skal huskes."),
];