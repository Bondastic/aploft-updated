import { mc, ck, wr } from "../builders";
import type { Task } from "../../types";

const c = "semantik" as const;

// SEMANTIK ; sprogets udtryks- og indholdsside (HHX-pensum: "sprogets
// udtryks- og indholdsside", "anvende viden om grammatik, semantik og
// pragmatik i arbejdet med tekster"). Semantik er læren om betydning.
export const SEMANTIK_TASKS: Task[] = [
 mc(
 "semantik-1",
 c,
 "Hvad er semantik?",
 ["Læren om ordenes og sætningers betydning", "Læren om sætningers opbygning", "Læren om lydene i et sprog", "Læren om, hvordan sprog bruges i situationer"],
 0,
 "Semantik handler om betydning: hvad ord og sætninger betyder ; uafhængigt af, hvem der siger dem, og i hvilken situation."
 ),
 mc(
 "semantik-2",
 c,
 "Ordet 'hest' har en lydside og en betydningsside. Hvad kaldes lydsiden/bogstavsiden af ordet?",
 ["Udtrykssiden", "Indholdssiden", "Konteksten", "Pragmatikken"],
 0,
 "Udtrykssiden er ordets fysiske form (lyde/bogstaver): h-e-s-t. Indholdssiden er den betydning, formen er knyttet til: det firbenede dyr."
 ),
 mc(
 "semantik-3",
 c,
 "Hvad kaldes to forskellige ord med samme eller næsten samme betydning : fx 'starte' og 'begynde'?",
 ["Synonymer", "Antonymer", "Homonymer", "Polysemer"],
 0,
 "Synonymer er forskellige udtryk med samme eller næsten samme indhold. De giver sproget variation og nuancer."
 ),
 mc(
 "semantik-4",
 c,
 "Hvad kaldes ord med modsat betydning : fx 'stigning' og 'fald'?",
 ["Antonymer", "Synonymer", "Homonymer", "Hyperonymer"],
 0,
 "Antonymer er ordpar med modsat betydning: stigning/fald, køb/salg, underskud/overskud."
 ),
 mc(
 "semantik-5",
 c,
 "Ordet 'bog' kan betyde både 'en bog, man læser' og 'et bøgetræ'. Hvad kaldes sådan et ord?",
 ["Et homonym", "Et synonym", "Et antonym", "Et lånord"],
 0,
 "Homonymer staves og udtales ens, men har forskellig (uafhængig) betydning: 'bog' (læsestof) og 'bog' (træ) er klassiske homonymer."
 ),
 mc(
 "semantik-6",
 c,
 "Ordet 'mus' betyder både dyret og computerens mus. Hvad kaldes det, når et ord har flere BESLÆGTEDE betydninger?",
 ["Polysemi", "Homonymi", "Synonymi", "Antonymi"],
 0,
 "Ved polysemi er betydningerne beslægtede ; computermusen er opkaldt efter dyret pga. formen. Ved homonymi er betydningerne helt uafhængige."
 ),
 mc(
 "semantik-7",
 c,
 "En virksomhed skriver 'prisbevidst' om sig selv og 'billig' om konkurrenten. Hvad kalder man forskellen i ordets følelsesmæssige medbetydning?",
 ["Konnotation", "Denotation", "Synonymi", "Syntaks"],
 0,
 "Denotation er ordets grundbetydning (lav pris). Konnotation er de følelser og associationer, ordet vækker ; 'prisbevidst' lyder positivt, 'billig' kan lyde negativt."
 ),
 mc(
 "semantik-8",
 c,
 "Hvilket ord har den mest POSITIVE konnotation i en reklame?",
 ["Eksklusiv", "Dyr", "Prisdyr", "Kostbar i overført betydning"],
 0,
 "'Eksklusiv' vækker associationer til luksus og kvalitet. Ordvalget i markedsføring handler i høj grad om at vælge de rigtige konnotationer."
 ),
 mc(
 "semantik-9",
 c,
 "En salgschef siger: 'Vores team er et velsmurt maskineri.' Hvilken sproglig figur bruger hun?",
 ["En metafor", "Et homonym", "En antonym", "En lydlig efterligning"],
 0,
 "Hun overfører billedet af et maskineri til teamet: en metafor, der beskriver noget abstrakt (samarbejde) med et konkret billede."
 ),
 mc(
 "semantik-10",
 c,
 "Ordet 'afkast' betyder i en årsrapport noget andet end i en skov. Hvad viser det?",
 ["At ords betydning afhænger af fagområde og kontekst", "At ord altid kun har én fast betydning i alle sammenhænge", "At årsrapporter er metaforiske", "At 'afkast' er et lånord"],
 0,
 "I økonomi er 'afkast' = det, en investering giver tilbage; i skovbrug = det, træerne kaster. Fagområdet afgør betydningen ; derfor er fagterminologi vigtig at kende."
 ),
 mc(
 "semantik-11",
 c,
 "Hvorfor bruger økonomiske tekster fagudtryk som 'likviditet' og 'rentabilitet'?",
 ["Fordi fagudtryk er præcise for dem, der kender dem", "Fordi man vil forvirre læseren med svære ord og udtryk", "Fordi der ikke findes danske ord for det", "Fordi alle forstår dem uden videre"],
 0,
 "Fagudtryk (jargon) giver præcis og effektiv kommunikation inden for et fagområde ; men kun hvis modtageren kender dem. Derfor skal man tilpasse sproget til modtageren."
 ),
 mc(
 "semantik-12",
 c,
 "Hvad betyder udtrykket 'at slå to fluer med ét smæk'?",
 ["At løse to problemer med én handling", "At man er god til at fange fluer med et smæk", "At man arbejder hurtigt", "At man laver fejl"],
 0,
 "Det er et idiom: et fast udtryk, hvis betydning ikke kan udledes ord for ord. Idiomer skal læres som hele enheder ; også på fremmedsprog."
 ),
 mc(
 "semantik-13",
 c,
 "Engelsk 'awful' betød engang 'ærefrygtindgydende' og betyder nu 'forfærdelig'. Hvad kaldes det fænomen?",
 ["Betydningsforandring (semantisk forandring)", "Polysemi, et ord med flere beslægtede betydninger", "Konnotation, ordets følelsesmæssige medbetydning", "Låneord, et ord fra et andet sprog"],
 0,
 "Ords betydning ændrer sig over tid ; det kaldes semantisk forandring. Det er en af grundene til, at ældre tekster kan være svære at læse."
 ),
 mc(
 "semantik-14",
 c,
 "Hvilken betydning har ordet 'bæredygtig' i en moderne virksomhedskontekst typisk?",
 ["Miljømæssigt og socialt holdbar på lang sigt", "At noget kan bæres på ryggen, fx en god rygsæk", "At noget er billigt og kan købes i store mængder", "At noget er gammelt og har holdt i mange år"],
 0,
 "'Bæredygtig' har fået en udvidet, moderne betydning om klimamæssig og social holdbarhed. Betydninger ændrer sig med tiden og samfundet ; det er også semantik."
 ),
 ck(
 "semantik-15",
 c,
 "Klik på ordet, der bruges i OVERFØRT betydning (metaforisk) i denne sætning.",
 "Markedet eksploderede efter lanceringen af det nye produkt",
 [1],
 "'Eksploderede' bruges metaforisk: markedet voksede voldsomt, men eksploderede bogstaveligt talt ikke."
 ),
 wr(
 "semantik-16",
 c,
 "Hvad kaldes et ord med samme eller næsten samme betydning som et andet ord : fx 'starte' og 'begynde'?",
 "Skriv ordet:",
 "synonym",
 "Et synonym er et ord med samme eller næsten samme betydning som et andet ord.",
 ["et synonym", "synonymer"]
 ),
 mc(
 "semantik-17",
 c,
 "Hvorfor er viden om semantik vigtig i HHX AP?",
 ["Fordi man skal kunne vælge og forstå ord præcist i erhvervstekster", "Fordi man skal kunne stave alle ord korrekt, også de svære fagord og udtryk", "Fordi semantik kun handler om latin og græsk, som man skal kunne", "Fordi man skal kunne lave sin egen ordbog over alle fagudtryk"],
 0,
 "Læreplanen kræver, at du kan arbejde med sprogets udtryks- og indholdsside i tekster ; og i erhvervslivet kan ét ord valgt forkert ændre hele budskabet."
 ),

  mc("semantik-18", c, "Hvad betyder 'bundlinje' i en virksomhedskontekst?", ["Det endelige resultat - og i overført betydning: det vigtigste", "Den nederste linje i en kontrakt", "Et synonym for omsætning", "En måde at skrive tal på"], 0, "'Bundlinje' betyder bogstaveligt den sidste linje i et regnskab og bruges metaforisk om det vigtigste i en sag."),
  mc("semantik-19", c, "Hvilket ord er et hyperonym (overbegreb) for 'bord', 'stol' og 'sofa'?", ["Møbel", "Træ", "Rum", "Bygning"], 0, "Et hyperonym er et overbegreb: 'møbel' dækker bord, stol, sofa osv. De enkelte ord er hyponymer (underbegreber)."),
  mc("semantik-20", c, "Hvad betyder 'rent' i udtrykket 'rent overskud'?", ["Overskud efter alle fradrag og omkostninger", "Overskud før noget er trukket fra", "Et overskud, der er rent og pænt", "Overskud kun fra salg af rengøring"], 0, "'Rent' betyder her 'efter fradrag' - modsat 'brutto' (før fradrag). Betydningen afhænger af fagområdet."),
  mc("semantik-21", c, "Hvilken betydning har 'skarp' i 'en skarp pris'?", ["En lav og konkurrencedygtig pris (metafor)", "En pris med skarpe kanter", "En pris, der er dyr", "En pris, der ændrer sig hele tiden"], 0, "'Skarp' bruges metaforisk om en pris, der er så lav, at den 'skærer' - en overført betydning fra det fysiske til det økonomiske."),
  mc("semantik-22", c, "Hvad er forskellen på et ords denotation og konnotation?", ["Denotation er grundbetydningen, konnotation er de følelsesmæssige medbetydninger", "Denotation er udtalen, konnotation er stavningen", "Denotation er et ords oprindelse, konnotation er dets bøjning", "Der er ingen forskel"], 0, "'Billig' og 'prisbevidst' kan have samme denotation (lav pris), men forskellig konnotation (negativ vs positiv klang)."),
  mc("semantik-23", c, "Hvad er en eufemisme?", ["En pæn omskrivning af noget ubehageligt, fx 'afgået ved døden'", "Et ord med modsat betydning", "Et ord lånt fra et andet sprog", "En stavefejl, der er blevet normalt"], 0, "Eufemismer bruges for at mildne: 'afgået ved døden' i stedet for 'død', 'at skille sig af med' i stedet for 'fyre'."),
  mc("semantik-24", c, "Hvilket ord er et antonym til 'stigning'?", ["Fald", "Vækst", "Fremgang", "Opsving"], 0, "Antonymer er ord med modsat betydning: stigning/fald, vækst/krise, overskud/underskud."),
  mc("semantik-25", c, "Hvad kaldes ord på tværs af sprog, der ligner hinanden og har samme betydning, fx 'information' på dansk, engelsk og fransk?", ["Kognater", "Antonymer", "Homonymer", "Neologismer"], 0, "Kognater er beslægtede ord med samme oprindelse og betydning på tværs af sprog. At genkende dem er en stærk læringsstrategi."),
];