// HHX: "fra bunden"-undervisningstrin, der indsættes FØRST i hver kategoris
// allerførste forløbstrin (se paths.ts). Samme filosofi som STX-siden: eleven
// skal aldrig mødes af et spørgsmål om noget, hun ikke lige har fået forklaret.
//
// For de fælles grammatik-kategorier (ordklasser, sætningsled, morfologi,
// tempus, syntaks) er introerne skrevet om med HHX-briller: dansk + engelsk,
// uden latin-henvisninger, så de passer til HHX-pensum.
import type { CategoryId, Task } from "../../types";
import { teach } from "../builders";

export const HHX_CATEGORY_INTRO: Partial<Record<CategoryId, Task[]>> = {
 // -------------------------------------------------------------------
 // FÆLLES GRAMMATIK (HHX-version uden latin)
 // -------------------------------------------------------------------
 ordklasser: [
 teach(
 "t-hhx-ordklasser-1",
 "ordklasser",
 "Ordklasser: sprogets byggeklodser",
 [
 {
 body:
 "Ordklasser er kategorier for ord ud fra, hvordan de opfører sig i sætningen: substantiver (navneord) navngiver ting og personer, verber (udsagnsord) fortæller om handlinger og tilstande, og adjektiver (tillægsord) beskriver substantiver.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Når du skal analysere en tekst ; også en erhvervsrelateret tekst ; er ordklasserne det første lag: de fortæller dig, hvad ordene GØR. Og når du lærer engelsk, er mange ordklasser genkendelige fra dansk.",
 },
 {
 heading: "Sådan kender du dem",
 body:
 "Substantiver kan typisk stå med 'en' eller 'et' foran (en kunde, et møde). Verber kan bøjes i tid (sælger, solgte, har solgt). Adjektiver kan gradbøjes (stor, større, størst).",
 },
 ],
 {
 examples: ["Kunden (substantiv) køber (verbum) en dyr (adjektiv) vare."],
 tip: "Spørg: kan ordet stå med 'en'/'et'? Så er det et substantiv.",
 }
 ),
 ],
 saetningsled: [
 teach(
 "t-hhx-saetningsled-1",
 "saetningsled",
 "Sætningsled: sætningens roller",
 [
 {
 body:
 "Sætningsled er de roller, ordene spiller i en sætning: grundleddet (subjekt) er den, der handler, udsagnsleddet (verbal) er handlingen, og genstandsleddet (objekt) er det, handlingen rammer.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Syntaktisk analyse er et eksplicit krav i HHX-læreplanen ; på dansk OG på fremmedsprog. Og når du skriver klart, hjælper det at vide, hvem der gør hvad i dine egne sætninger.",
 },
 {
 heading: "Sådan finder du dem",
 body:
 "Find først udsagnsleddet (verbet). Spørg derefter 'hvem/hvad + verbet?' → grundled. Spørg 'verbet + hvem/hvad?' → genstandsled. Spørg 'til/for hvem?' → hensynsled.",
 },
 ],
 {
 examples: ["Virksomheden (grundled) sender (udsagnsled) kunden (hensynsled) en faktura (genstandsled)."],
 tip: "Udsagnsleddet er din nøgle: find verbet først, så falder resten på plads.",
 }
 ),
 ],
 morfologi: [
 teach(
 "t-hhx-morfologi-1",
 "morfologi",
 "Morfologi: ordenes indre byggesten",
 [
 {
 body:
 "Morfologi er læren om, hvordan ord er bygget op af morfemer ; de mindste dele, der bærer betydning. 'Uvenlig' består af 'u-' (ikke), 'ven' (rod) og '-lig' (endelse).",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Når du kender morfemernes logik, kan du gætte betydningen af nye ord ; både på dansk og på engelsk: 'unhelpful' = u-hjælp(s)-fuld. Det er en direkte læringsstrategi.",
 },
 {
 heading: "Bøjning vs. afledning",
 body:
 "Bøjning ændrer ordets form, men ikke betydning eller ordklasse (kunde → kunder). Afledning skaber et nyt ord, ofte i en ny ordklasse (kunde → kundevenlig).",
 },
 ],
 {
 examples: ["sælge → sælgeren → salg → salgbar: samme rod, forskellige ord."],
 tip: "Del ukendte ord i forstavelse + rod + endelse ; så er de fleste ord gennemsigtige.",
 }
 ),
 ],
 tempus: [
 teach(
 "t-hhx-tempus-1",
 "tempus",
 "Tempus: handlingens tid",
 [
 {
 body:
 "Tempus er verbets tid: nutid (han sælger), datid (han solgte), førnutid (han har solgt), førdatid (han havde solgt) og fremtid (han vil sælge).",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "I erhvervskommunikation er tid præcis: 'vi har sendt ordren' er ikke det samme som 'vi sender ordren'. På engelsk er tidssystemet en af de største fejlkilder ; og en af de vigtigste at mestre.",
 },
 {
 heading: "De sammensatte tider",
 body:
 "Førnutid, førdatid og fremtid dannes med et hjælpeverbum (har/havde/vil) + hovedverbets participium eller navnemåde: har sendt, havde sendt, vil sende.",
 },
 ],
 {
 examples: ["Vi sender (nutid) → vi sendte (datid) → vi har sendt (førnutid) → vi havde sendt (førdatid) → vi vil sende (fremtid)."],
 tip: "Spørg altid: er handlingen i gang, afsluttet eller fremtidig?",
 }
 ),
 ],
 syntaks: [
 teach(
 "t-hhx-syntaks-1",
 "syntaks",
 "Syntaks: sætningens orden",
 [
 {
 body:
 "Syntaks er læren om, hvordan ord sættes sammen til sætninger. En helsætning kan stå alene ('Vi sender ordren i dag'), en ledsætning kan ikke ('fordi vi har travlt').",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Læreplanen kræver, at du kan identificere sætningstyper og foretage syntaktisk analyse på dansk og fremmedsprog. Og klare, korte sætninger er guld i forretningskommunikation.",
 },
 {
 heading: "Dansk og engelsk er forskellige",
 body:
 "Dansk er et V2-sprog: verbet står som andet led ('I går sendte vi ordren'). Engelsk er ikke V2 ('Yesterday we sent the order') og bruger 'do/does/did' i spørgsmål.",
 },
 ],
 {
 examples: ["Helsætning: 'Vi har modtaget din ordre.' Ledsætning: '...da vi modtog din ordre.'"],
 tip: "Kan sætningen stå alene og give mening? Så er den en helsætning.",
 }
 ),
 ],
 // -------------------------------------------------------------------
 // HHX-SPECIFIKKE EMNER
 // -------------------------------------------------------------------
 kommunikation: [
 teach(
 "t-hhx-kommunikation-1",
 "kommunikation",
 "Kommunikation: nogen sender noget til nogen",
 [
 {
 body:
 "Kommunikation er altid en afsender, der sender et budskab gennem en kanal til en modtager ; i en kontekst, hvor støj kan forstyrre, og modtageren kan give feedback.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Kommunikationsanalyse er kernen i HHX AP: Du skal kunne analysere afsender, modtager, emne og situation i en tekst og vurdere, om sprogbrugen passer dertil.",
 },
 {
 heading: "Verbal og non-verbal",
 body:
 "Kommunikation foregår med ord (verbal) ; og uden ord (non-verbal): kropssprog, mimik, gestik, stemmeføring, tegn og signaler. I skriftlige medier er layout og emojis også non-verbal kommunikation.",
 },
 ],
 {
 examples: [
 "En kunde (afsender) skriver en klage (budskab) pr. mail (kanal) til virksomheden (modtager), fordi en leverance var forsinket (kontekst).",
 ],
 tip: "Analyser altid: Hvem skriver? Til hvem? Om hvad? I hvilken situation? Gennem hvilket medie?",
 }
 ),
 teach(
 "t-hhx-kommunikation-2",
 "kommunikation",
 "Det udvidede tekstbegreb",
 [
 {
 body:
 "I AP arbejder vi med et udvidet tekstbegreb: en 'tekst' er ikke kun en skreven artikel ; det er alt, der kommunikerer: reklamer, film, hjemmesider, SoMe-opslag, taler, grafik og meget mere.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "I erhvervslivet møder du hele tiden tekster i mange formater. At kunne analysere dem alle med samme begreber gør dig til en skarpere kommunikator.",
 },
 ],
 {
 examples: ["En reklameplakat, et Instagram-opslag og en mundtlig præsentation er alle tekster i AP-forstand."],
 }
 ),
 ],
 sproghandlinger: [
 teach(
 "t-hhx-sproghandlinger-1",
 "sproghandlinger",
 "Sproghandlinger: hvad vi GØR med sprog",
 [
 {
 body:
 "Når vi taler og skriver, gør vi noget: vi påstår, spørger, opfordrer, lover, råder, advarer, undskylder. Det kaldes sproghandlinger ; og selve ytringen ER handlingen.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Læreplanen kræver, at du kan anvende elementær viden om sproghandlinger og kommunikationsteori i arbejdet med tekster ; både når du læser (receptivt) og når du selv skriver (produktivt).",
 },
 {
 heading: "Direkte og indirekte",
 body:
 "En direkte opfordring er 'Send mig rapporten'. En indirekte er 'Kan du sende mig rapporten?' ; formen er et spørgsmål, men funktionen er en opfordring. Indirekte sproghandlinger er ofte høfligere.",
 },
 ],
 {
 examples: ["'Jeg lover at sende tilbuddet i morgen' = et løfte. 'Pas på med fortrolige oplysninger' = en advarsel."],
 tip: "Spørg altid: hvad prøver denne tekst at GØRE ved mig?",
 }
 ),
 ],
 semantik: [
 teach(
 "t-hhx-semantik-1",
 "semantik",
 "Semantik: læren om betydning",
 [
 {
 body:
 "Semantik er læren om ordenes betydning. Et ord har en udtryksside (lyden/bogstaverne) og en indholdsside (betydningen). 'Hest' og 'hest' ; samme udtryk, samme indhold. 'Hest' og 'pony' ; forskelligt udtryk, næsten samme indhold.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "I erhvervstekster er ordvalg afgørende: 'prisbevidst' og 'billig' kan betyde næsten det samme, men vækker meget forskellige følelser (konnotationer). At kunne vælge og forstå ord præcist er en kernekompetence.",
 },
 {
 heading: "Centrale begreber",
 body:
 "Synonymer (samme betydning), antonymer (modsat betydning), homonymer (samme form, forskellig betydning), polysemi (beslægtede betydninger) og metafor (overført betydning).",
 },
 ],
 {
 examples: ["'Vores team er et velsmurt maskineri' ; metafor: samarbejdet beskrives med et konkret billede."],
 tip: "Skeln altid mellem ordets grundbetydning (denotation) og dets følelsesmæssige medbetydning (konnotation).",
 }
 ),
 ],
 pragmatik: [
 teach(
 "t-hhx-pragmatik-1",
 "pragmatik",
 "Pragmatik: sproget i brug",
 [
 {
 body:
 "Pragmatik handler om, hvad en ytring BETYDER i den konkrete situation ; ikke kun hvad ordene betyder i sig selv. Den samme sætning kan være ros i én situation og hån i en anden.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Læreplanen kræver, at du kender karakteristiske træk ved sprog brugt i private, faglige og professionelle sammenhænge ; og at du kan kommunikere hensigtsmæssigt. Det er pragmatik i praksis.",
 },
 {
 heading: "Registre",
 body:
 "Vi skifter stilleje (register) efter situationen: uformel tone til venner, fagudtryk til kolleger, formel og høflig tone til kunder. At vælge det rette register er at kommunikere hensigtsmæssigt.",
 },
 ],
 {
 examples: [
 "'Det kan desværre ikke lade sig gøre i denne omgang' er et indirekte, høfligt nej i en professionel sammenhæng.",
 ],
 tip: "Læs altid mellem linjerne: hvad betyder ytringen i DENNE situation?",
 }
 ),
 ],
 genrer: [
 teach(
 "t-hhx-genrer-1",
 "genrer",
 "Genrer: teksttyper med genkendelige træk",
 [
 {
 body:
 "En genre er en teksttype med faste, genkendelige træk: en forretningsmail har emnelinje og formel hilsen, en reklame vil overtale, en pressemeddelelse informerer medierne, et SoMe-opslag er kort og visuelt.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Læreplanen kræver 'genre- og mediebevidst formidling': du skal både kunne analysere tekster (hvilken genre er det, og hvorfor er den skrevet sådan?) og selv producere tekster, der passer til formål og modtager.",
 },
 {
 heading: "Genre og medie",
 body:
 "Genren er teksttypen; mediet er kanalen, den udgives i. En reklame (genre) kan stå i en avis, på tv eller på Instagram (medier) ; og skal tilpasses hvert medie.",
 },
 ],
 {
 examples: ["En jobannonce vil tiltrække kandidater; en ansøgning vil overbevise en arbejdsgiver."],
 tip: "Spørg: hvem er afsender, hvem er modtager, og hvad vil teksten opnå?",
 }
 ),
 ],
 sproghistorie: [
 teach(
 "t-hhx-sproghistorie-1",
 "sproghistorie",
 "Sproghistorie: hvor kommer sprogene fra?",
 [
 {
 body:
 "De fleste europæiske sprog hører til den indoeuropæiske sprogfamilie. Dansk, svensk, norsk og engelsk er germanske; fransk, spansk og italiensk er romanske (fra latin); russisk og polsk er slaviske.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Læreplanen kræver, at du kan identificere forskelle og ligheder mellem dansk og fremmedsprog med inddragelse af sproghistorisk viden. Sproghistorie gør sprogene gennemsigtige ; og hjælper dig med at lære dem.",
 },
 {
 heading: "Sprog i en globaliseret verden",
 body:
 "Engelsk fungerer i dag som globalt lingua franca ; et fælles kommunikationssprog ; og dansk låner hele tiden ord (anglicismer). Sprog forandrer sig, og kontakt mellem sprog er normalt.",
 },
 ],
 {
 examples: ["'Information' findes i næsten samme form på dansk, engelsk, fransk og tysk ; fælles rødder giver genkendelige mønstre."],
 tip: "Ligheder mellem sprog er din ven: genkend rødderne, så kan du gætte ordene.",
 }
 ),
 ],
 laeringsstrategier: [
 teach(
 "t-hhx-laeringsstrategier-1",
 "laeringsstrategier",
 "Læringsstrategier: lær sprog klogt",
 [
 {
 body:
 "Læringsstrategier er bevidste metoder til at lære sprog: transfer (bruge viden fra ét sprog i et andet), mønstergenkendelse (fx endelsen '-tion'), kontekstgætning, ordkort med gentagne møder ; og at lære af feedback.",
 },
 {
 heading: "Hvorfor er det vigtigt?",
 body:
 "Læreplanen har 'strategier for sprogtilegnelse' som selvstændigt punkt. Gode strategier gør dig hurtigere og stærkere til alle de sprog, du møder i gymnasiet og i erhvervslivet.",
 },
 {
 heading: "Receptivt og produktivt",
 body:
 "Du forstår altid flere ord, end du selv bruger. Flyt ord fra dit passive (receptive) til dit aktive (produktive) ordforråd ved at bruge dem i tale og skrift.",
 },
 ],
 {
 examples: ["'Un-believ-able' → u-tro-lig: del ordet i morfemer, og gæt betydningen."],
 tip: "Gentagne møder med ord i sammenhæng slår udenadslære ; også på engelsk.",
 }
 ),
 ],
};
