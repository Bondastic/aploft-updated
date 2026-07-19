// SUM-FORLØBET: det uregelmæssige verbum "esse" (at være) — sum, es, est,
// sumus, estis, sunt. Bygget som en trinvis progression fra "hvad betyder
// sum overhovedet" til at kunne udfylde hele bøjningstabellen udenad.
// Alle sætninger er skrevet fra bunden til APLOFT.
import { mc, ck, wr, bs, an } from "../builders";
import type { Task } from "../../types";

const c = "sumesse" as const;

export const SUMESSE_TASKS: Task[] = [
  // --- Trin 1: Hvad betyder "sum"? ---------------------------------------
  mc("latin-sum-1", c, "Hvad betyder det latinske verbum 'esse' i navnemåde (infinitiv)?", ["at have", "at være", "at gøre", "at give"], 1, "'Esse' er navnemåden (infinitiv) af det latinske grundverbum for 'at være'. Det bøjes meget uregelmæssigt."),
  mc("latin-sum-2", c, "'Sum' er 1. person ental af 'esse'. Hvad betyder 'sum'?", ["jeg er", "du er", "han/hun/den er", "vi er"], 0, "'Sum' = 'jeg er'. Det er den form, du bruger, når DU selv er subjektet."),
  mc("latin-sum-3", c, "'Es' er 2. person ental af 'esse'. Hvad betyder 'es'?", ["jeg er", "du er", "han/hun/den er", "de er"], 1, "'Es' = 'du er'. Bemærk at det kun er ét bogstav anderledes end 'est' — nem at forveksle, så øv dig ekstra på den!"),
  mc("latin-sum-4", c, "'Est' er 3. person ental af 'esse'. Hvad betyder 'est'?", ["jeg er", "du er", "han/hun/den er", "I er"], 2, "'Est' = 'han/hun/den er'. Det er den mest brugte form, fordi de fleste latinske sætninger handler om en 'han/hun/den'."),
  mc("latin-sum-5", c, "Hvilket latinsk pronomen svarer til dansk 'jeg' og bruges (valgfrit) sammen med 'sum'?", ["ego", "tu", "is", "nos"], 0, "'Ego' betyder 'jeg'. Det bruges kun til at lægge ekstra vægt på, HVEM der er — verbet 'sum' viser det allerede."),
  mc(
    "latin-sum-6",
    c,
    "Hvorfor skriver man ofte IKKE et selvstændigt pronomen foran 'sum', 'es' eller 'est', selvom dansk altid siger 'jeg er', 'du er'?",
    [
      "Fordi verbets endelse allerede viser, hvem der er subjekt",
      "Fordi latin slet ikke har ord for 'jeg' og 'du'",
      "Fordi det er en stavefejl at skrive pronomenet",
      "Fordi 'esse' ikke kan have et subjekt",
    ],
    0,
    "Latinske verbers endelser ('-m/-o', '-s', '-t' osv.) fortæller i sig selv, hvilken person der er tale om — derfor er selve pronomenet ofte overflødigt.",
  ),
  ck("latin-sum-7", c, "Klik på verbet (udsagnsordet) i sætningen 'Ego sum magister' (Jeg er lærer).", "Ego sum magister", [1], "'Sum' er verbet ('jeg er'). 'Ego' er det valgfrie pronomen, og 'magister' er navneordet, der beskriver subjektet."),
  wr("latin-sum-8", c, "Skriv den latinske form af 'jeg er'.", "Hvordan siger man 'jeg er' på latin?", "sum", "'Jeg er' på latin er 'sum' — 1. person ental af 'esse'.", []),

  // --- Trin 2: Ental i sætninger -------------------------------------------
  wr("latin-sum-9", c, "Skriv den latinske form af 'du er'.", "Hvordan siger man 'du er' på latin?", "es", "'Du er' på latin er 'es' — 2. person ental af 'esse'.", []),
  wr("latin-sum-10", c, "Skriv den latinske form af 'han/hun/den er'.", "Hvordan siger man 'han/hun/den er' på latin?", "est", "'Han/hun/den er' på latin er 'est' — 3. person ental af 'esse'.", []),
  mc("latin-sum-11", c, "'Puella laeta est.' (laeta = glad) Hvad betyder sætningen?", ["Pigen er glad", "Pigen elsker glæden", "Den glade pige løber", "Pigen var glad"], 0, "'Puella' = pigen (subjekt, nominativ), 'laeta' = glad (beskriver pigen), 'est' = er. Ordret: 'Pigen glad er'."),
  mc("latin-sum-12", c, "'Magister bonus est.' (bonus = god) Hvad betyder sætningen?", ["Læreren er god", "Den gode lærer ser", "Læreren har en god bog", "Lærerne er gode"], 0, "'Magister' = læreren, 'bonus' = god, 'est' = er. Latin sætter ofte verbet sidst: 'Læreren god er'."),
  wr("latin-sum-13", c, "Udfyld sætningen med den rigtige form af 'esse'.", "'Puer ___ laetus.' (Drengen er glad — brug 3. person ental af 'esse'.)", "est", "'Puer' er 3. person ental (han), så verbet skal være 'est'.", []),
  wr("latin-sum-14", c, "Udfyld sætningen med den rigtige form af 'esse'.", "'Ego ___ magister.' (Jeg er lærer — brug 1. person ental af 'esse'.)", "sum", "'Ego' er 1. person ental, så verbet skal være 'sum'.", []),
  wr("latin-sum-15", c, "Udfyld sætningen med den rigtige form af 'esse'.", "'Tu ___ bonus.' (Du er god — brug 2. person ental af 'esse'.)", "es", "'Tu' er 2. person ental, så verbet skal være 'es'.", []),
  mc(
    "latin-sum-16",
    c,
    "Hvilken kasus står navneordet 'magister' i, i sætningen 'Ego sum magister' (Jeg er lærer)?",
    ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
    0,
    "Efter 'esse' (et kopulaverbum, ligesom dansk 'er'/'bliver') står navneordet i samme kasus som subjektet — altså nominativ. Det svarer til et subjektsprædikat på dansk.",
  ),

  // --- Trin 3: Flertal -------------------------------------------------------
  mc("latin-sum-17", c, "'Sumus' er 1. person flertal af 'esse'. Hvad betyder 'sumus'?", ["vi er", "I er", "de er", "han er"], 0, "'Sumus' = 'vi er' — 1. person flertal."),
  mc("latin-sum-18", c, "'Estis' er 2. person flertal af 'esse'. Hvad betyder 'estis'?", ["vi er", "I er", "de er", "du er"], 1, "'Estis' = 'I er' — 2. person flertal (flere personer, du taler til)."),
  mc("latin-sum-19", c, "'Sunt' er 3. person flertal af 'esse'. Hvad betyder 'sunt'?", ["vi er", "I er", "de er", "han er"], 2, "'Sunt' = 'de er' — 3. person flertal."),
  wr("latin-sum-20", c, "Skriv den latinske form af 'vi er'.", "Hvordan siger man 'vi er' på latin?", "sumus", "'Vi er' på latin er 'sumus' — 1. person flertal af 'esse'.", []),
  wr("latin-sum-21", c, "Skriv den latinske form af 'I er'.", "Hvordan siger man 'I er' (flertal, til flere personer) på latin?", "estis", "'I er' på latin er 'estis' — 2. person flertal af 'esse'.", []),
  wr("latin-sum-22", c, "Skriv den latinske form af 'de er'.", "Hvordan siger man 'de er' på latin?", "sunt", "'De er' på latin er 'sunt' — 3. person flertal af 'esse'.", []),
  mc("latin-sum-23", c, "'Servi sunt fessi.' (fessi = trætte) Hvad betyder sætningen?", ["Slaverne er trætte", "Slaven er træt", "Vi er trætte", "Slaverne var trætte"], 0, "'Servi' = slaverne (flertal), 'fessi' = trætte, 'sunt' = er (flertal). 'Servi ... sunt' skal stemme overens i tal (begge flertal)."),
  wr("latin-sum-24", c, "Udfyld sætningen med den rigtige form af 'esse'.", "'Nos ___ amici.' (Vi er venner — brug 1. person flertal af 'esse'.)", "sumus", "'Nos' (vi) er 1. person flertal, så verbet skal være 'sumus'.", []),

  // --- Trin 4: Byg hele tabellen selv ----------------------------------------
  wr("latin-sum-25", c, "Skriv formen for 1. person ental (jeg er) af 'esse'.", "1. person ental (jeg er):", "sum", "1. person ental af 'esse' er 'sum'.", []),
  wr("latin-sum-26", c, "Skriv formen for 2. person ental (du er) af 'esse'.", "2. person ental (du er):", "es", "2. person ental af 'esse' er 'es'.", []),
  wr("latin-sum-27", c, "Skriv formen for 3. person ental (han/hun/den er) af 'esse'.", "3. person ental (han/hun/den er):", "est", "3. person ental af 'esse' er 'est'.", []),
  wr("latin-sum-28", c, "Skriv formen for 1. person flertal (vi er) af 'esse'.", "1. person flertal (vi er):", "sumus", "1. person flertal af 'esse' er 'sumus'.", []),
  wr("latin-sum-29", c, "Skriv formen for 2. person flertal (I er) af 'esse'.", "2. person flertal (I er):", "estis", "2. person flertal af 'esse' er 'estis'.", []),
  wr("latin-sum-30", c, "Skriv formen for 3. person flertal (de er) af 'esse'.", "3. person flertal (de er):", "sunt", "3. person flertal af 'esse' er 'sunt'.", []),
  bs(
    "latin-sum-31",
    c,
    "Byg den latinske sætning 'Vi er venner' (den mest almindelige latinske rækkefølge sætter verbet sidst — men prøv gerne en anden rækkefølge, hvis du vil se, hvad der sker).",
    ["Nos", "amici", "sumus"],
    "Latin sætter ofte verbet sidst: 'Nos' (vi) + 'amici' (venner) + 'sumus' (er) = 'Nos amici sumus.' Men fordi latin har fri ordstilling, ville fx 'Nos sumus amici' også være grammatisk korrekt.",
    true
  ),
  mc(
    "latin-sum-32",
    c,
    "Hvad er en god huskestrategi for at kunne 'sum, es, est, sumus, estis, sunt' udenad til prøven?",
    [
      "Remse dem højt i fast rækkefølge — ental (sum, es, est), så flertal (sumus, estis, sunt)",
      "Lære dem i en ny, tilfældig rækkefølge hver gang",
      "Springe 'es' og 'estis' over, fordi de ligner hinanden",
      "Det er ikke nødvendigt at kunne dem udenad til prøven",
    ],
    0,
    "En fast remse (ligesom gangetabellen) gør det nemt at hente formen frem i hovedet under en prøve: sum – es – est – sumus – estis – sunt.",
  ),

  // --- Trin 5: Datid (imperfectum) — eram, eras, erat... ---------------------
  mc("latin-sum-33", c, "'Eram' er 1. person ental, datid (imperfectum) af 'esse'. Hvad betyder 'eram'?", ["jeg var", "jeg er", "du var", "vi var"], 0, "'Eram' = 'jeg var'. Datidsformerne af 'esse' dannes ved at sætte 'era-' foran de samme personendelser, du allerede kender.", ),
  mc("latin-sum-34", c, "'Eras' er 2. person ental, datid, af 'esse'. Hvad betyder 'eras'?", ["jeg var", "du var", "han/hun var", "I var"], 1, "'Eras' = 'du var' — 2. person ental datid."),
  mc("latin-sum-35", c, "'Erat' er 3. person ental, datid, af 'esse'. Hvad betyder 'erat'?", ["jeg var", "du var", "han/hun/den var", "de var"], 2, "'Erat' = 'han/hun/den var' — den mest brugte datidsform, ligesom 'est' er den mest brugte nutidsform."),
  wr("latin-sum-36", c, "Skriv den latinske form af 'jeg var'.", "Hvordan siger man 'jeg var' på latin (datid af 'esse')?", "eram", "'Jeg var' på latin er 'eram' — 1. person ental, imperfectum (datid) af 'esse'.", []),
  wr("latin-sum-37", c, "Skriv den latinske form af 'han/hun/den var'.", "Hvordan siger man 'han/hun/den var' på latin (datid af 'esse')?", "erat", "'Han/hun/den var' på latin er 'erat' — 3. person ental, imperfectum af 'esse'.", []),
  mc("latin-sum-38", c, "'Eramus' og 'eratis' er flertalsformerne i 1. og 2. person datid. Hvad betyder 'eramus'?", ["vi var", "I var", "de var", "vi er"], 0, "'Eramus' = 'vi var' — 1. person flertal, imperfectum af 'esse'."),
  wr("latin-sum-39", c, "Skriv den latinske form af 'I var' (flertal).", "Hvordan siger man 'I var' på latin (datid af 'esse')?", "eratis", "'I var' på latin er 'eratis' — 2. person flertal, imperfectum af 'esse'.", []),
  mc("latin-sum-40", c, "'Erant' er 3. person flertal, datid, af 'esse'. Hvad betyder 'erant'?", ["vi var", "I var", "de var", "han var"], 2, "'Erant' = 'de var' — 3. person flertal, imperfectum af 'esse'."),
  wr("latin-sum-41", c, "Skriv den latinske form af 'de var'.", "Hvordan siger man 'de var' på latin (datid af 'esse')?", "erant", "'De var' på latin er 'erant' — 3. person flertal, imperfectum af 'esse'.", []),
  mc(
    "latin-sum-42",
    c,
    "'Puella laeta erat.' Hvad betyder sætningen?",
    ["Pigen er glad", "Pigen var glad", "Pigerne var glade", "Pigen bliver glad"],
    1,
    "'Erat' er datid ental (3. person), så sætningen betyder 'Pigen var glad' — modsat 'est', der ville betyde 'er'.",
  ),
  wr("latin-sum-43", c, "Udfyld sætningen med den rigtige datidsform af 'esse'.", "'Nos amici ___.' (Vi var venner — brug 1. person flertal, datid, af 'esse'.)", "eramus", "'Nos' (vi) er 1. person flertal, datid, så verbet skal være 'eramus'.", []),
  bs(
    "latin-sum-44",
    c,
    "Byg den latinske sætning 'Vi var venner' (datid — prøv evt. flere rækkefølger, ordstillingen er fri).",
    ["Nos", "amici", "eramus"],
    "'Nos' (vi) + 'amici' (venner) + 'eramus' (var) = 'Nos amici eramus.' Ligesom i nutid er ordstillingen fri, fordi det er endelsen '-mus', ikke pladsen i sætningen, der viser, hvem der 'var'.",
    true,
  ),
  an(
    "latin-sum-45",
    c,
    "Skema-øvelse: sæt sætningen sammen med den rigtige LED-symbolik ved at tænke over, hvad hvert ord gør.",
    "Magister bonus erat.",
    ["Magister", "bonus", "erat"],
    ["subjekt", "subjpred", "verbal"],
    "'Magister' = grundled (×, nominativ), 'bonus' = subjektsprædikat (⊗, siger noget om grundleddet), 'erat' = udsagnsled (○, datid af 'esse'). Sammenlign med nutidssætningen 'Magister bonus est' — kun tempus er ændret.",
  ),

  // --- Trin 6: Endelser-huskereglen "o/m – s – t – mus – tis – nt" -----------
  mc(
    "latin-sum-46",
    c,
    "Huskereglen for latinske personendelser lyder 'o/m – s – t – mus – tis – nt'. Hvad viser disse endelser?",
    [
      "Hvilken kasus et navneord står i",
      "Hvilken person (jeg/du/han .../vi/I/de) og hvilket tal verbet står i",
      "Om ordet er hankøn eller hunkøn",
      "Om sætningen er en helsætning eller en ledsætning",
    ],
    1,
    "Personendelserne '-o/-m, -s, -t, -mus, -tis, -nt' sidder bagerst på næsten alle latinske verber og fortæller, HVEM der handler: jeg, du, han/hun/den, vi, I eller de.",
  ),
  mc(
    "latin-sum-47",
    c,
    "Se på 'esse': sum (-m), es (-s), est (-t), sumus (-mus), estis (-tis), sunt (-nt). Hvad viser det?",
    [
      "At 'esse' slet ikke følger huskereglen 'o/m – s – t – mus – tis – nt'",
      "At selv det uregelmæssige verbum 'esse' bruger de samme genkendelige personendelser som regelmæssige verber",
      "At 'esse' kun har tre former i alt",
      "At huskereglen kun gælder navneord",
    ],
    1,
    "Selvom 'esse' er uregelmæssigt (grundformen skifter: 'su-'/'es-'/'er-'), sidder de velkendte personendelser stadig bagerst — det gør det nemmere at genkende, HVEM der 'er', selv i et uregelmæssigt verbum.",
  ),
  wr(
    "latin-sum-48",
    c,
    "Brug huskereglen 'o/m – s – t – mus – tis – nt' til at afgøre personen.",
    "Hvilken endelse hører til 'vi' (1. person flertal)?",
    "mus",
    "1. person flertal ender altid på '-mus' — derfor 'su-mus', 'era-mus', 'ama-mus' osv.",
    [],
  ),
  wr(
    "latin-sum-49",
    c,
    "Brug huskereglen 'o/m – s – t – mus – tis – nt' til at afgøre personen.",
    "Hvilken endelse hører til 'de' (3. person flertal)?",
    "nt",
    "3. person flertal ender altid på '-nt' — derfor 'su-nt', 'era-nt', 'ama-nt' osv.",
    [],
  ),
  mc(
    "latin-sum-50",
    c,
    "Hvilken endelse hører til 'I' (2. person flertal) ifølge 'o/m – s – t – mus – tis – nt'?",
    ["-s", "-t", "-tis", "-nt"],
    2,
    "2. person flertal ender altid på '-tis' — derfor 'es-tis', 'era-tis', 'ama-tis' osv.",
  ),
  wr(
    "latin-sum-51",
    c,
    "Brug huskereglen til at bygge en ny form.",
    "'Ama-' betyder 'elske'. Hvilken endelse skal du sætte på 'ama-' for at få '3. person ental' (han/hun elsker)?",
    "t",
    "3. person ental ender altid på '-t' — derfor 'ama-t' (han/hun elsker), ligesom 'es-t' og 'era-t'.",
    [],
  ),
  mc(
    "latin-sum-52",
    c,
    "Hvorfor er det så nyttigt at kunne huskereglen 'o/m – s – t – mus – tis – nt' udenad til AP-prøven?",
    [
      "Fordi den ALTID afslører hvem der handler i en sætning, uanset hvilket verbum det er",
      "Fordi den kun virker på verbet 'esse'",
      "Fordi den erstatter behovet for at kunne kasus",
      "Fordi den kun bruges i datid",
    ],
    0,
    "Personendelserne går igen på tværs af næsten alle latinske verber og alle tider — kan du dem, kan du altid finde ud af, HVEM der er subjekt, selv i en sætning med ukendte ord.",
  ),
  bs(
    "latin-sum-53",
    c,
    "Byg den latinske sætning 'Læreren var god' (datid — ordstillingen er fri, så prøv selv en anden rækkefølge).",
    ["Magister", "bonus", "erat"],
    "'Magister' (læreren) + 'bonus' (god) + 'erat' (var) = 'Magister bonus erat.' Endelsen '-t' i 'erat' viser 3. person ental, uanset hvor i sætningen ordet står.",
    true,
  ),
];
