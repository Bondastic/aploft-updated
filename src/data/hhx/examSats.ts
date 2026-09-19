import type { ExamSatsT, ExamWordClassTag } from "../../types";

// ---------------------------------------------------------------------------
// HHX EKSAMENSSÆT (kun for HHX-siden!). Simulering af den virkelige
// AP-eksamen som den afvikles på Risskov: en tekst + et fast sæt af
// spørgsmål, 40 minutters forberedelse, aflevering til sidst.
//
// Indholdsstyreregler (vigtige!):
// 1. HINT må KUN forklare, hvad eleven skal gøre - aldrig hvad svaret er.
//    Ingen "eksempelbesvarelser" nogle steder i spørgsmålsteksterne.
// 2. Alle spørgsmål besvares med blokke og klik (valg, ordklasse-vælger,
//    led-symboler) - eleven behøver ikke at kende noget bestemt skriveformat.
// 3. Led-delene bruger de latinske betegnelser som primære (subjekt,
//    verballed, direkte/indirekte objekt) med de danske som hjælp, jf.
//    feedback fra AP-koordinatoren.
// ---------------------------------------------------------------------------

// Ordklasse-listen der bruges i både eksamensspørgsmål og artikel-mærkater.
export const EXAM_WORD_CLASS_TAGS: { id: ExamWordClassTag; label: string; short: string }[] = [
  { id: "substantiv", label: "Substantiv (navneord)", short: "Substantiv" },
  { id: "verbum", label: "Verbum (udsagnsord)", short: "Verbum" },
  { id: "adjektiv", label: "Adjektiv (tillægsord)", short: "Adjektiv" },
  { id: "adverbium", label: "Adverbium (biord)", short: "Adverbium" },
  { id: "pronomen", label: "Pronomen (stedfortræder)", short: "Pronomen" },
  { id: "præposition", label: "Præposition (forholdsord)", short: "Præposition" },
  { id: "konjunktion", label: "Konjunktion (bindeord)", short: "Konjunktion" },
  { id: "numerale", label: "Numerale (talord)", short: "Numerale" },
  { id: "interjektion", label: "Interjektion (råbeord)", short: "Interjektion" },
];

export function wordClassLabel(tag: ExamWordClassTag): string {
  return EXAM_WORD_CLASS_TAGS.find((t) => t.id === tag)?.short ?? tag;
}

export const HHX_EXAM_SAT: ExamSatsT = {
  id: "hhx-sats-01",
  title: "Eksamenssæt 1 · Da kassen blev en skærm",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: {
    heading: "Sådan er eksamensprøven",
    lead:
      "Prøven minder om den rigtige AP-eksamen på HHX: Du får én tekst og et sæt spørgsmål, og du har 40 minutter til at læse, analysere og besvare det hele. Indholdet er præcis det, du har trænet i appen: kommunikation, ordklasser, syntaktisk analyse med de latinske betegnelser, pragmatik og genrer.",
    steps: [
      "Læs artiklen grundigt først ; brug tuschfarverne til at markere stikord og pointer, mens du læser.",
      "Besvar spørgsmålene under teksten med blokkene: klik på svarmuligheder, ordklasser og led-symboler. Du skal aldrig skrive i et bestemt format.",
      "Er du i tvivl om, hvad en opgave kræver? Tryk på '?'-knappen ved spørgsmålet ; der får du en forklaring af, hvad du skal gøre.",
      "Undervejs i teksten kan du også mærke enkelte led eller ordklasser med analysetegn ; det er din skitseblok, ikke en bedømmelse.",
      "Til sidst trykker du 'Indsend'. Går tiden fra dig, lyder klokken, og du bedes aflevere med det samme.",
      "Efter aflevering kan du kopiere din besvarelse og få den bedømt af AI - og se en gennemgang af hvert spørgsmål.",
    ],
    examIn: [
      {
        title: "Indhold og kommunikation",
        body: "Hvad handler teksten om? Hvem skriver, til hvem, med hvilket formål og i hvilken situation?",
      },
      {
        title: "Sprog og analyse",
        body: "Ordklasser i kontekst og syntaktisk analyse af en helsætning med subjekt, verballed, objekter og adverbial.",
      },
      {
        title: "Pragmatik og genre",
        body: "Hvadsigelser, tone og virkemidler ; og hvilken genre teksten tilhører, og hvorfor.",
      },
    ],
    closingNote:
      "Husk: prøven er et træningsværktøj. Du må markere i teksten, som du vil, og du kan ikke 'ødelægge' noget ved at prøve kræfter med den.",
  },
  article: {
    title: "Da kassen blev en skærm",
    byline: "Kronik i Handels Nyt (fiktiv avis) ; af erhvervsredaktør Emil Holm ; 12. marts 2026",
    paragraphs: [
      "I morges fjernede supermarkedet ved Åboulevarden sit sidste kassebånd. I stedet kan kunderne nu selv scanne varerne med butikkens app, mens en algoritme holder øje med, at alt bliver betalt. Ledelsen kalder det 'tidens naturlige udvikling', mens flere stamkunder på de sociale medier taler om 'en butik uden mennesker'.",
      "'Vi sparer tid og kan bruge pengene på kunderne i stedet,' siger afdelingsleder Sara Westergaard, mens hun låser døren ind til det gamle kassekontor. 'De fleste kunder er glade for, at de slipper for køen.'",
      "Ikke alle er overbevist. Flere pensionister har klaget over, at de ikke kan få hjælp til at finde varerne i de nye selvscanning-gange. Og da appen kræver betalingskort, må kunder med kontanter simpelthen gå videre til nabobutikken.",
      "Tallene fra de første to uger er slående: køtiden er faldet fra ni til to minutter, og omsætningen er steget 18 procent i myldretiden. Butikken sender kunderne en påmindelse om ugens tilbud hver fredag. Der er altså tale om en handel, der i den grad er skruet sammen til hastighed.",
      "Men prisen for hastigheden er ikke til at overse. En butik er også et sted, hvor ensomme møder andre mennesker, hvor personalet kan mærke, om noget er galt, og hvor ældre kunder trygt kan spørge til vejrs. Hvis vi fjerner de samtaler, får teknologien en regning, som ingen kan betale med kort.",
      "Udviklingen er måske uundgåelig. Men den er ikke nødvendigvis god. Spørgsmålet er ikke, om butikken skal bruge kunstig intelligens. Spørgsmålet er, hvad den bruger os til.",
    ],
  },
  questions: [
    {
      id: "eks-1",
      kind: "choice",
      label: "Indhold",
      category: "kommunikation",
      prompt: "Hvad er hovedpointen i teksten?",
      hint:
        "Sådan gør du: Find først ud af, hvad teksten overhovedet handler om (emnet), og spørg derefter dig selv, hvad skribenten vil have læseren til at huske. Hovedpointen dækker typisk hele teksten ; de andre muligheder passer kun på ét afsnit eller peger på noget, teksten ikke siger.",
      options: [
        "Supermarkedet ved Åboulevarden har sparet så mange penge, at det kan sænke priserne.",
        "Teknologi i detailhandlen er klog forretning, men forfatteren advarer mod, at vi betaler med de menneskelige møder.",
        "Ældre kunder må vænne sig til at klare sig uden hjælp, for udviklingen kan ikke standses.",
        "Butikkens ledelse fortryder indførelsen af selvscanning, fordi omsætningen er faldet.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt er svarmuligheden om teknologi som klog forretning, MEN med en advarsel: De sidste to afsnit vender teksten mod prisens menneskelige omkostninger ('prisen for hastigheden', 'en regning, som ingen kan betale med kort'). Bemærk fælden i de forkerte muligheder: De bygger på detaljer fra ét afsnit eller påstande, teksten ikke kommer med (omsætningen steg faktisk 18 procent, ikke faldt).",
      examTip:
        "Til eksamen: Understreg første og sidste afsnit med tusch. Forfatterens pointe ligger meget ofte dér, og de rigtige svarmuligheder i en multiple choice dækker hele teksten, mens de forkerte ofte 'stjæler' én sætning ud af kontekst.",
    },
    {
      id: "eks-2",
      kind: "choice",
      label: "Kommunikation",
      category: "kommunikation",
      prompt: "Hvem er afsender, og hvem er den primære modtager?",
      hint:
        "Sådan gør du: Kig på byline (underskriften under overskriften) ; dér står, hvem teksten er skrevet af, og i hvilket medie. Tænk derefter over, hvem medie-typen når, og hvad teksten forudsætter at læseren allerede ved.",
      options: [
        "Afsender: butikkens afdelingsleder ; modtager: personalet i butikken.",
        "Afsender: en erhvervsredaktør i en erhvervsavis ; modtager: læsere med interesse for detailhandel, typisk kunder og erhvervsfolk.",
        "Afsender: en kunde ; modtager: supermarkedets ledelse.",
        "Afsender: en app-udvikler ; modtager: alle danskere over 67 år.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: Bylinen afslører afsenderen (erhvervsredaktør i avisen Handels Nyt), og mediets karakter (erhvervsavis) + indholdet (omsætning, myldretid, kassepolitik) afslører modtagerne. Afdelingslederen ER kun et citat i teksten, ikke afsenderen. Det er en klassisk fælde: Citerede personer forveksles med tekstens afsender.",
      examTip:
        "Til eksamen: Skil altid 'hvem der taler i teksten' fra 'hvem teksten ER af'. Afsender står ved byline/kilde ; citater er blot stemmer INDI i teksten.",
    },
    {
      id: "eks-3",
      kind: "choice",
      label: "Formål",
      category: "kommunikation",
      prompt: "Hvilket primært formål har teksten?",
      hint:
        "Sådan gør du: Spørg dig selv, hvad skribenten vil HAVE læseren til: Skal læseren oplyses (kun referere), overbevises (vælge en holdning), underholdes eller handle (købe noget)? Tekstens sidste linjer afslører ofte det reelle formål.",
      options: [
        "Oplysende: teksten refererer neutral og uden holdning en begivenhed i byen.",
        "Overbevisende (persuasive): teksten vil have læseren til at sætte spørgsmålstegn ved prisen for den hurtigere kasse-teknologi.",
        "Underholdende: teksten er skrevet for at more med en sjov butikshistorie.",
        "Sælgende: teksten skal få læseren til at downloade butikkens nye app.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: teksten er overbevisende. Den er ikke neutral (se 'Men prisen for hastigheden er ikke til at overse' og det afsluttende retoriske spørgsmål), og den sælger ikke appen. At formålet er persusasivt kan du blandt andet se ved, at teksten fremhæver modargumenter og derefter vender dem.",
      examTip:
        "Til eksamen: Find påstå-delen, ikke referat-delen. En tekst med 'men...', 'spørgsmålet er...' og afsluttende undren er næsten altid formidling med en holdning. Nævn formålet OG belæg det med et citat.",
    },
    {
      id: "eks-4",
      kind: "choice",
      label: "Genre",
      category: "genrer",
      prompt: "Hvilken genre tilhører teksten?",
      hint:
        "Sådan gør du: Saml genren af ud fra spor i teksten: Hvad står der i bylinen? Er der én afsenders holdning eller flere? Argumenterer teksten, eller refererer den? Sammenlign med genrens kendetegn fra Lynkurset.",
      options: [
        "Nyhedsreferat, fordi teksten refererer en begivenhed, der er sket i morges.",
        "Kronik/debatindlæg, fordi teksten har en klar afsender med en holdning, argumenterer for den og afslutter med et spørgsmål til læseren.",
        "Annonce, fordi teksten promoverer butikkens nye app.",
        "Læserbrev, fordi teksten er skrevet af en almindelig kunde.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: Genren er kronik/debatindlæg. Kendetegnene passer: navngiven afsender med stilling (erhvervsredaktør), subjektiv vinkel, påstande med belæg (statistik, modargumenter, pointer) og en afsluttende pointe formuleret som spørgsmål. Nyhedsreferat ville være neutralt, annonce ville sælge, læserbrev ville være skrevet af en læser.",
      examTip:
        "Til eksamen: Argumentér for genre-valget med tre elementer: afsender, opbygning (påstand/belæg) og sproglige træk (f.eks. den retoriske afslutning). Genre uden belæg giver ikke point.",
    },
    {
      id: "eks-5",
      kind: "choice",
      label: "Semantik",
      category: "semantik",
      prompt: "I 5. afsnit skriver forfatteren: 'får teknologien en regning, som ingen kan betale med kort.' Hvad betyder billedet 'en regning, som ingen kan betale med kort'?",
      hint:
        "Sådan gør du: Afsnit billedet fra den bogstavelige betydning (butikkens verden: kasse, betalingskort) og spørg, hvad det svarer til i virkeligheden uden for butikken. Billedet leger med to betydninger af samme ord ; find begge.",
      options: [
        "Teknologien bliver dyr for butikken, fordi regningen kun kan betales med kort i systemet.",
        "Der er en menneskelig pris (ensomhed, omsorg) som teknologien medfører ; og den kan ikke 'gøres op' som en økonomisk post.",
        "Kunder uden betalingskort bliver nægtet adgang til butikken.",
        "Samfundet skal betale skat af teknologisk udvikling.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: udtrykket er et billedsprog, der leger med butikkens egen jargon: En 'regning' normally skal betales ; her er det en overført, menneskelig omkostning, 'som ingen kan betale med kort' : altså en regning, der ikke kan gøres op økonomisk. Bemærk pointen: Forståelse af billedsprog kræver, at du kan forklare både det konkrete billede og det, det svarer til.",
      examTip:
        "Til eksamen: Når du forklarer et billede/citat, så brug denne skabelon: 'Billedet viser konkret ... ; overført betyder det ...'. Så rammer du begge dele og får point for begge.",
    },
    {
      id: "eks-6",
      kind: "wordclass",
      label: "Ordklasser",
      category: "ordklasser",
      prompt: "Hvilken ordklasse tilhører hvert af de fire ord? Klik på ordet og vælg ordklasse.",
      hint:
        "Sådan gør du: Test hvert ord i en ny sætning: Kan det bøjes i flertal og have et artikel foran (substantiv)? Kan det bøjes i nutid/datid (verbum)? Kan det siges med 'meget/mere' (adjektiv eller adverbium)? Præpositionen kan du kende på, at den styrer et led efter sig (tid, sted, forhold).",
      words: [
        { word: "låser", correct: "verbum" },
        { word: "glade", correct: "adjektiv" },
        { word: "simpelthen", correct: "adverbium" },
        { word: "med", correct: "præposition" },
      ],
      feedback:
        "Ordklasserne er: 'låser' : verbum (kan bøjes: låser/låste ; handlingen i bisætningen). 'glade' : adjektiv (beskriver kunderne, bøjes: glad/glade). 'simpelthen' : adverbium (fordenker/beskriver hele udsagnet og kan ikke bøjes med -t/-e). 'med' : præposition (indleder præpositiongruppen 'med kontanter'). Fælden ved 'simpelthen' er, at det kunne ligne et adjektiv i flertalsform ; husk at prøve det i 'meget'-testen.",
      examTip:
        "Til eksamen: Sæt altid testen ind i en test-sætning ('meget __', '__ede', 'en/det __') frem for at gætte ud fra ordet alene. Og nævn gerne, hvad ordklassen gør i sætningen (fx 'præpositionen indleder en præpositionsguppe').",
    },
    {
      id: "eks-7",
      kind: "analysis",
      label: "Syntaks · led",
      category: "saetningsled",
      prompt: "Analyser sætningen fra artiklen: Klik på hvert led-kort og vælg det rigtige symbol.",
      sentence: "Butikken sender kunderne en påmindelse om ugens tilbud hver fredag.",
      chunks: ["Butikken", "sender", "kunderne", "en påmindelse om ugens tilbud", "hver fredag"],
      correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
      hint:
        "Sådan gør du: Find altid verbet først (verballeddet) ; spørg derefter 'hvem/hvad + verbet?' for at finde subjektet, og se hvad verbet kræver af objekter. De to objekter kan du skelne ved at spørge 'til/for hvem?' (indirekte objekt) vs. 'hvad?' (direkte objekt). Resten er typisk adverbial ; tænk på, at præpositioner indgår i det led, de beskriver.",
      feedback:
        "Fuldt rigtige led: Butikken = subjekt (hvem sender?), sender = verballed, kunderne = indirekte objekt (til hvem?), 'en påmindelse om ugens tilbud' = direkte objekt, 'hver fredag' = adverbial (tid). Den hyppigste fejl her: at splitte 'en påmindelse' og 'om ugens tilbud' op i to led ; 'om ugens tilbud' beskriver 'påmindelse' og hører derfor til i det samme led.",
      examTip:
        "Til eksamen: Brug spørgsmålene HØJLYDT, mens du analyserer (hvem sender? hvad sender den? til hvem?). Husk de latinske navne i din besvarelse: subjekt, verballed, direkte og indirekte objekt ; skriv de danske kun hvis du er i tvivl.",
    },
    {
      id: "eks-8",
      kind: "choice",
      label: "Syntaks · ledsætning",
      category: "syntaks",
      prompt: "I 5. afsnit står der: 'Hvis vi fjerner de samtaler, får teknologien en regning...' Hvad er 'Hvis vi fjerner de samtaler' for en sætning?",
      hint:
        "Sådan gør du: Tjek om delen kan stå alene. Find hvad den binder til (hovedsætningen) og hvilken rolle den spiller: Tid, årsag, betingelse eller beskrivelse af et navneord? Underordnende konjunktioner som 'hvis' afslører typisk rollen.",
      options: [
        "En adverbiel ledsætning der udtrykker betingelse (den binder til hovedsætningen og angiver et 'hvis'-tilfælde).",
        "En selvstændig hovedsætning, fordi den starter med et stort bogstav.",
        "En nominal ledsætning, der fungerer som subjekt i sætningen.",
        "En relativsætning, der beskriver ordet 'samtaler'.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Det er en adverbiel betingelses-ledsætning. Den kan ikke stå alene (binder til hovedsætningen), og 'hvis' markerer betingelsen. Stor begyndelsesbogstav gør den ikke til en hovedsætning, og 'som/der'-mønsteret fra relativsætninger er der ikke.",
      examTip:
        "Til eksamen: Lav 'stå alene-testen' på alle sætningsdele, og navngiv derefter ledsætningens funktion (adverbiel/nominal/relativ). Skriv konjunktionen som belæg: 'hvis viser, at det er en betingelse'.",
    },
    {
      id: "eks-9",
      kind: "multi",
      label: "Argumentation",
      category: "pragmatik",
      prompt: "Klik på ALLE de udsagn, der er ARGUMENTER (belæg) i teksten ; altså udsagn der underbygger en påstand. Lad være med at klikke på selve påstandene.",
      hint:
        "Sådan gør du: Et argument svarer på 'hvorfor?'. Kan sætningen bruges til at BEGRUNDE noget andet, er den et argument (tal, erfaring, eksempel). Er sætningen i sig selv noget, man skal overbevises om, er den en påstand.",
      options: [
        "'køtiden er faldet fra ni til to minutter' (tal fra de første to uger).",
        "'Men den er ikke nødvendigvis god' (afsluttende pointe).",
        "'flere pensionister har klaget over, at de ikke kan få hjælp' (konkret erfaring).",
        "'Udviklingen er måske uundgåelig' (ramme for debatten).",
        "'Der er altså tale om en handel, der i den grad er skruet sammen til hastighed' (konsekvens-påstand ud af tallene).",
      ],
      correctIndexes: [0, 2],
      feedback:
        "Rigtige klik: 'køtiden er faldet...' (tal = belæg for at selvscanning sparer tid) og 'flere pensionister har klaget...' (erfaring = belæg for modargumentet om udelukkelse). 'Men den er ikke nødvendigvis god' og 'Udviklingen er måske uundgåelig' er påstande ; det er DEM, argumenterne skal underbygge. Den sidste er en mellemregning/påstand ud af tallene, ikke et belæg i sig selv.",
      examTip:
        "Til eksamen: Teg en pil fra hver sætning mod den påstand, den skal støtte. Kan sætningen besvare 'ja, men hvorfor?' : så er den et argument. Husk at nævne, HVILKEN påstand hvert argument understøtter.",
    },
    {
      id: "eks-10",
      kind: "choice",
      label: "Pragmatik",
      category: "pragmatik",
      prompt: "Afdelingslederen siger: 'Vi sparer tid og kan bruge pengene på kunderne i stedet.' Hvad sker der primært i den ytring, når man ser på hensigten bag ordene?",
      hint:
        "Sådan gør du: Sammenlign, hvad der står, med hvad der gøres: Informerer hun bare, eller forsvarer hun en beslutning? Påminding: hvem siger det, HVORFOR netop nu og til hvem? Vælg den mulighed, der beskriver handlingen (det hun GØR med ordene), ikke kun indholdet.",
      options: [
        "En neutral oplysning om butikkens drift, uden interesse i modpartens synspunkt.",
        "En retfærdiggørelse: Hun forsvarer besparelsen ved at vende den til en fordel for kunderne (en appell til at acceptere ændringen).",
        "En ordre: Hun befaler kunderne at bruge appen i stedet for køen.",
        "En selvmodsigelse: Hendes ord bekræfter, at besparelsen går ud over kunderne.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: Ytringen er en retfærdiggørelse ; hun forklarer og forsvarer en beslutning, og hun gør det ved at dreje 'besparelse' til 'gevinst for kunden' ('bruge pengene på kunderne'). Det er ikke neutralt (hun har en interesse i svaret), ikke en ordre, og det er ikke selvmodsigende ; men pointen i analysen er NETOP, at budskabet er indpakket i kundens interesse. En skarp analytiker nævner begge dele: ytringen er også en appelform.",
      examTip:
        "Til eksamen: Beskriv ytringens handling (påstandsledden: det er en forsvarstale) OG hvad den spiller ind i (hun skal holde kunderne rolige). Brug gerne ord som 'berettiger', 'appellerer' og 'implikerer' ; og underbyg med hvilke ord, der afslører det ('i stedet' afviser kritikken).",
    },
  ],
};

// Samling af eksamenssæt (én ad gangen; flere sæt kan tilføjes her, uden at
// skærmen skal ændres).
export const HHX_EXAM_SATS: ExamSatsT[] = [HHX_EXAM_SAT];

