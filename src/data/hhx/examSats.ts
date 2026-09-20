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
        body: "Talehandlinger, tone og virkemidler ; og hvilken genre teksten tilhører, og hvorfor.",
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

// (samlingen + rotation finder du i bunden af filen)

// ---------------------------------------------------------------------------
// YDERLIGERE EKSAMENSSÆT (2-6). Alle tekster er DIGTEDE fra bunden af os :
// fiktive medier, fiktive personer, fiktive tal. Ingen ophavsret ; ingen
// kopiering fra virkelige aviser. Formålet er, at man kan træne Eksamensprøven
// igen og igen uden at få det samme sæt to gange i træk (se pickNextExamSats).
// ---------------------------------------------------------------------------

// Fælles informations-side for alle sæt (indholdet er det samme på tværs).
const SAT_INTRO: ExamSatsT["intro"] = {
  heading: "Sådan er eksamensprøven",
  lead:
    "Prøven minder om den rigtige AP-eksamen på HHX: Du får én tekst og et sæt spørgsmål, og du har 40 minutter til at læse, analysere og besvare det hele. Indholdet er præcis det, du har trænet i appen: kommunikation, ordklasser, syntaktisk analyse med de latinske betegnelser, pragmatik og genrer.",
  steps: [
    "Læs artiklen grundigt først ; brug tuschfarverne til at markere stikord og pointer, mens du læser.",
    "Besvar spørgsmålene under teksten med blokkene: klik på svarmuligheder, ordklasser og led-symboler. Du skal aldrig skrive i et bestemt format.",
    "Er du i tvivl om, hvad en opgave kræver? Tryk på '?'-knappen ved spørgsmålet ; der får du en forklaring af, hvad du skal gøre.",
    "Undervejs i teksten kan du også mærke enkelte led eller ordklasser med analysetegn ; det er din skitseblok, ikke en bedømmelse.",
    "Til sidst trykker du 'Indsend'. Går tiden fra dig, lyder klokken, og du bedes aflevere med det samme.",
    "Efter aflevering kan du kopiere din besvarelse og få den bedømt af en AI efter eget valg og se en gennemgang af hvert spørgsmål.",
  ],
  examIn: [
    {
      title: "Indhold og kommunikation",
      body: "Hvad handler teksten om? Hvem skriver, til hvem, med hvilket formål og i hvilken situation?",
    },
    {
      title: "Sprog og analyse",
      body: "Ordklasser i kontekst og syntaktisk analyse af en helsætning med subjekt, verballed, objekter og adverbialer.",
    },
    {
      title: "Pragmatik og genre",
      body: "Talehandlinger, tone og virkemidler ; og hvilken genre teksten tilhører, og hvorfor.",
    },
  ],
  closingNote:
    "Husk: prøven er et træningsværktøj. Du må markere i teksten, som du vil, og du kan ikke 'ødelægge' noget ved at prøve kræfter med den.",
};

const SAT_2_GROENT_SKIFTE: ExamSatsT = {
  id: "hhx-sats-02",
  title: "Eksamenssæt 2 · Det grønne skifte",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
  article: {
    title: "Nu er det mælk fra ærter, der hældes i kaffen",
    byline: "Nyhedsreferat i Dags Avisen (fiktiv avis) ; af reporter Laila Brandt ; 8. april 2026",
    paragraphs: [
      "Cafékæden Kaffevinken lægger i morgen alle komælkskartoner fra hylderne i sine 14 caféer. Fremover hældes drikke af havre, havtorn og ærteprotein i kaffemaskinerne. Kæden forventer at spare 300.000 kroner om året på mælkekøbet.",
      "'Vi følger simpelthen, hvad vores unge gæster efterspørger,' siger kædechef Nadia Bloch til fagbladet Fødevarewatch. Ifølge hende falder klimaaftrykket pr. kop med 40 procent ved de nye drikke.",
      "Forbrugerforeningen anerkender kædens forsøg, men påpeger, at mange bælgfrugtedrikke indeholder tilsætningsstoffer. 'Et produkt er ikke grønt i sig selv, fordi det kommer fra planter,' siger analytiker Tim Sørensen.",
      "Danmarks Statistik viser, at danskerne har købt 9 procent mindre komælk siden 2021, og samtidig er priserne på kaffe steget på verdensplan. Skiftet hos Kaffevinken sker derfor i en tid, hvor branchen jagter både klima og bundlinje.",
      "Kæden oplyser, at den nye menu gælder fra i morgen i Aarhus, Randers, Silkeborg, Horsens og Vejle.",
    ],
  },
  questions: [
    {
      id: "g2-1",
      kind: "choice",
      label: "Indhold",
      category: "kommunikation",
      prompt: "Hvad er hovedpointen i teksten?",
      hint:
        "Sådan gør du: Find emnet (hvad handler teksten overordnet om?) og spørg derefter, hvad teksten samlet set oplyser om det. Hovedpointen dækker typisk flere afsnit ; detaljer fra ét afsnit er ikke hovedpointen.",
      options: [
        "Cafékædens nye mælkeleverandør bliver kritisret for at bruge for mange tilsætningsstoffer i produktionen.",
        "En cafékæde udskifter koens mælk med plantebaserede drikke af klima-, pris- og kundeårsager, mens fagfolk minder om, at planter ikke i sig selv er det grønne valg.",
        "Danskerne drikker i dag så meget kaffe, at komælken er ved at slippe op på det danske marked.",
        "Cafébranchen mister overskud, fordi unge gæster er holdt op med at drikke kaffe på café.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt er muligheden, der samler BEGGE (skiftet og årsagerne: klima, besparelse, efterspørgsel) OG forbeholdet fra Forbrugerforeningen. De forkerte muligheder trykker på én detalje (tilsætningsstoffer) eller finder på sammenhænge, teksten slet ikke nævner (mælkeleverandøren, kaffemangel).",
      examTip:
        "Til eksamen: En hovedpointe skal kunne genfindes i både begyndelsen, midten og slutningen af teksten. Kan den kun genfindes i ét afsnit, er det en detail, ikke pointen.",
    },
    {
      id: "g2-2",
      kind: "choice",
      label: "Kommunikation",
      category: "kommunikation",
      prompt: "Hvem er afsender, og hvem er den primære modtager?",
      hint:
        "Sådan gør du: Byline (navnet under overskriften) afslører afsenderen og mediet. Mediet afslører modtagerkredsen. Vær opmærksom på, at personer, der CITERES i teksten, ikke er dens afsender.",
      options: [
        "Afsender: kædechef Nadia Bloch ; modtager: caféens stamgæster.",
        "Afsender: avisen Danmarks Statistik ; modtager: politikerne.",
        "Afsender: en reporter i en avis ; modtager: avisens almene læsekreds med interesse for forbrug og erhverv.",
        "Afsender: Forbrugerforeningen ; modtager: danske producenter af plante-mælk.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: Laila Brandt skriver for Dags Avisen, altså er afsender en journalist/reporter, og modtager er avisens læsere. Bloch og Sørensen er blot citerede kilder ; Danmarks Statistik er et datagrundlag, ikke en afsender.",
      examTip:
        "Til eksamen: Skel mellem 'citeret kilde' og 'afsender' : det er en af de hyppigste fejl i karaktergivningen. Nævn også mediets type (dagsavis, fagblad, skoleblad), for det afgrænser modtagerne.",
    },
    {
      id: "g2-3",
      kind: "choice",
      label: "Genre",
      category: "genrer",
      prompt: "Hvilken genre tilhører teksten?",
      hint:
        "Sådan gør du: Tjek tre spor: Hvem skriver (byline)? Hvad gør teksten (refererer den eller argumenterer den)? Hvordan opbygger den (vinkling, citater, tal)? Sammenlign med genrkendetegnene fra Lynkurset.",
      options: [
        "Nyhedsreferat, fordi en reporter neutralt refererer en beslutning og inddrager to parter med tal fra en officiel kilde.",
        "Kronik, fordi teksten tager stilling til det grønne skifte og sluttes med en pointe til læseren.",
        "Annonce, fordi teksten får cafékæden til at fremstå positiv.",
        "Læserbrev, fordi teksten handler om noget, der angår almindelige forbrugere.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Nyhedsreferat. Teksten refererer en konkret begivenhed ('i morgen lægger kæden...'), vinkler uden selv at mene noget og lader to parter komme til orde med tal fra Danmarks Statistik bag. At kæden fremstår pænt, gør den ikke til en annonce, og 'handler om forbrugere' gør den ikke til et læserbrev.",
      examTip:
        "Til eksamen: Genre + BELEG. Skriv fx: 'Det er et nyhedsreferat, fordi teksten er neutralt refererende, har en reporter som afsender og inddrager modparten.' Uden belæg tæller genre-svaret halvt.",
    },
    {
      id: "g2-4",
      kind: "choice",
      label: "Semantik",
      category: "semantik",
      prompt: "I 4. afsnit står der, at branchen 'jagter både klima og bundlinje'. Hvad betyder udtrykket?",
      hint:
        "Sådan gør du: Afsnit billedets to dele: Hvad jager man konkret, og hvad betyder de to jagter overført i en virksomhedskontekst? 'Bundlinje' er et fagord fra regnskabsverdenen ; find ud af, hvad det står for.",
      options: [
        "Branchen laver kampagner med jagt- og naturtema i caféerne for at sælge flere kaffeprodukter.",
        "Branchen må vælge mellem hensynet til klimaet og hensynet til, hvad virksomheden tjener penge på.",
        "Branchen søger aktivt at forene to mål på én gang: at gøre en klimaindsats OG at få flere penge ind i kassen.",
        "Branchen jagter grønne profileringer for at skjule, at indtjening falder.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: 'Jagter både A og B' betyder, at man stræber efter BEGGE DELE : både klimaindsatsen (det grønne skifte) og bundlinjen (overskuddet i regnskabet). Sætningen nævner ikke, at målene er i modstrid, så det svar, hvor branchen 'må vælge', er forkert : pointen er netop DUALITETEN. Det sidste svar indlæser en sammenhæng, teksten ikke giver.",
      examTip:
        "Til eksamen: Når du forklarer et udtryk, så sig (1) hvad de enkelte ord betyder konkret, (2) hvad hele udtrykket betyder overført, (3) hvorfor netop dette ordvalg passer til afsenderen (her: erhvervssprog).",
    },
    {
      id: "g2-5",
      kind: "wordclass",
      label: "Ordklasser",
      category: "ordklasser",
      prompt: "Hvilken ordklasse tilhører hvert af de fem ord? Klik på ordet og vælg ordklasse.",
      hint:
        "Sådan gør du: Prøv hvert ord i bøjninger og tests (meget ..., -ede, en/det ...). Husk at ordklassen bestemmes af ordets EGENSKABER, ikke af hvad det handler om.",
      words: [
        { word: "hældes", correct: "verbum" },
        { word: "unge", correct: "adjektiv" },
        { word: "siden", correct: "præposition" },
        { word: "derfor", correct: "adverbium" },
        { word: "grønt", correct: "adjektiv" },
      ],
      feedback:
        "'hældes' : verbum (præsens passiv af at hælde). 'unge' : adjektiv (beskriver 'gæster', bøjes: ung/unge). 'siden' : præposition her (indleder præpositiongruppen 'siden 2021' ; pas på, 'siden' KAN være konjunktion, men ikke her). 'derfor' : adverbium (kan stå i feltet og bøjes ikke). 'grønt' : adjektiv (intetkønsform af 'grøn', tillægsord til 'produkt').",
      examTip:
        "Til eksamen: 'siden'-fælden viser, hvorfor ordklasse altid bestemmes i kontekst. Skriv derfor til eksamen: 'siden er præposition i netop denne sætning, fordi...' så viser du metoden, ikke bare svaret.",
    },
    {
      id: "g2-6",
      kind: "analysis",
      label: "Syntaks · led",
      category: "saetningsled",
      prompt: "Analyser sætningen fra 1. afsnit: Klik på hvert led-kort og vælg det rigtige symbol.",
      sentence: "Fremover hældes drikke af havre, havtorn og ærteprotein i kaffemaskinerne.",
      chunks: ["Fremover", "hældes", "drikke af havre, havtorn og ærteprotein", "i kaffemaskinerne"],
      correctMap: ["adverbial", "verbal", "subjekt", "adverbial"],
      hint:
        "Sådan gør du: Find verbet ('hældes') og spørg 'HVAD hældes?' : det svar er subjektet, selv når det står EFTER verbet (omvendt ledstilling, fordi adverbialen er rykket først). Resten: 'i kaffemaskinerne' svarer på spørgsmålet hvor.",
      feedback:
        "Rigtigt: 'Fremover' = adverbial (tid, rykket frem for betoning), 'hældes' = verballed, 'drikke af havre, havtorn og ærteprotein' = subjekt (det, der hældes), 'i kaffemaskinerne' = adverbial (sted). Læreringen: subjektet behøver IKKE stå før verbet; i vendinger står det bagefter. 'af havre...' hører med til 'drikke' og er ikke et selvstændigt led.",
      examTip:
        "Til eksamen: Omvendt ledstilling er en favorit-fælde. Spørg altid 'hvem/hvad + verbet?' uanset ordstilling, og husk at NAVNGIVE: subjekt, verballed, adverbial (tid/sted).",
    },
    {
      id: "g2-7",
      kind: "choice",
      label: "Syntaks · ledsætning",
      category: "syntaks",
      prompt: "I 3. afsnit står der: '... påpeger, at mange bælgfrugtedrikke indeholder tilsætningsstoffer.' Hvad er 'at mange bælgfrugtedrikke indeholder tilsætningsstoffer' for en sætning?",
      hint:
        "Sådan gør du: Kan delen stå alene? Hvad indleder den (konjunktion)? Og hvilken FUNKTION har den i hovedsætningen : svarer den på 'hvad?' efter verbet 'påpeger'?",
      options: [
        "En relativsætning, der beskriver ordet 'tilsætningsstoffer'.",
        "En nominal ledsætning (at-sætning), der fungerer som objekt til verbet 'påpeger'.",
        "En selvstændig hovedsætning, som bare er skilt ud med komma.",
        "En temporal adverbiel ledsætning, der angiver, hvornår noget sker.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: 'at'-sætningen svarer på spørgsmålet 'påpeger HVAD?' og er derfor et objekt : en nominal ledsætning. Den kan ikke stå alene (uledsætning), og den beskriver ikke et navneord (så ingen relativsætning).",
      examTip:
        "Til eksamen: Navngiv ledsætningen i TO trin: (1) underordnet type (nominal/adverbiel/relativ), (2) funktion i helsætningen (subjekt/objekt/adverbial). 'At'-sætninger efter tales-verber (sige, påpege, mene) er næsten altid objekt-sætninger.",
    },
    {
      id: "g2-8",
      kind: "choice",
      label: "Tone",
      category: "pragmatik",
      prompt: "Hvordan er sprogtonen i teksten som helhed?",
      hint:
        "Sådan gør du: Kig efter værdiladede ord (domme), udråbstegn, spin og spotte. Sammenlign med, hvad en neutral referat-tone KRÆVER: at kilderne taler, og reporteren holder sig i baggrunden.",
      options: [
        "Provokerende og satirisk, fordi teksten gør grin med de grønne valg.",
        "Følelsesladet og personlig, fordi reporteren fortæller om sine egne kaffevaner.",
        "Sælger-agtig, fordi teksten skal få læseren til at skifte til ærtemælk i morgen.",
        "Saklig og neutral, fordi reporteren refererer, lader kilder komme til orde og underbygger med tal uden selv at tage stilling.",
      ],
      correctIndex: 3,
      feedback:
        "Rigtigt: Saklig nyhedstone. Der ER modstemmer (Forbrugerforeningen), men den kommer til orde gennem citat, ikke gennem reporterens egne domme. Værdiladede tillægsord og udråbstegn lyser ved deres fravær : dét ER kendetegnet på referat-genren.",
      examTip:
        "Til eksamen: Dokumentér tonen med FRAVÆR og NÆRVÆR: 'Der er ingen værdiladede ord hos reporteren, og begge parter citeres' er et stærkt svar. Nævn evt. én konkret sætning, der VISER det.",
    },
    {
      id: "g2-9",
      kind: "multi",
      label: "Fakta vs. mening",
      category: "pragmatik",
      prompt: "Klik på ALLE de oplysninger, teksten FREMLÆGGER SOM FAKTISKE (kan måles eller verificeres) ; ikke holdningsudsagn.",
      hint:
        "Sådan gør du: En oplysning er faktabaseret, hvis den kan efterprøves (tal, datoer, beslutninger). Holdningsudsagn ('det er godt', 'det er for dumt') kan man uenige om uden at måle.",
      options: [
        "Kæden forventer at spare 300.000 kroner om året på mælkekøbet.",
        "Det grønne skifte er den rigtige beslutning for branchen.",
        "Danmarks Statistik viser et fald i salget af komælk på 9 procent siden 2021.",
        "Ærteprotein dækker smagen bedre end havre.",
        "Den nye menu gælder fra i morgen i kædens 14 caféer.",
      ],
      correctIndexes: [0, 2, 4],
      feedback:
        "Fakta: besparelsesforventningen (en oplyst forventning er en faktuel oplysning om, hvad kæden siger/tæller), statistik-faldet på 9 procent og menu-datoen med 14 caféer. HOLDNINGER uden for teksten: 'den rigtige beslutning' og 'dækker smagen bedre' : det kan man ikke måle, og ingen kilde i teksten påstår det.",
      examTip:
        "Til eksamen: En 'forventning' er også en faktuel del af referatet, når den tilskrives en kilde. Skel på 'hvem siger hvad' : fakta = verificerbart udsagn, holdning = vurdering.",
    },
    {
      id: "g2-10",
      kind: "choice",
      label: "Kildekritik",
      category: "kommunikation",
      prompt: "Hvorfor nævner teksten BÅDE kædens egen forklaring OG Forbrugerforeningens forbehold?",
      hint:
        "Sådan gør du: Tænk over, hvad genren KRÆVER af en nyhedsartikel, når en aktør laver en sælger beslutning. Hvem vinder ved kun den positive vinkel, og hvem vinder ved balancen?",
      options: [
        "Fordi avisen er ejet af Forbrugerforeningen og er forpligtet til at bringe deres pressemeddelelser.",
        "For at gøre artiklen længere, så læserne bruger mere tid på avisens site.",
        "Fordi nyhedsreferat-genren kræver balance: når en part med interesse i sagen udtaler sig, skal modparten komme til orde for at referatet ikke bliver reklame.",
        "Fordi reporteren selv er uenig i kædens valg og vil undergrave nyheden.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: Det handler om genrens krav til belæg og balance : Kæden har en interesse (den vil gerne have ros for skiftet), så referatet inddrager kritisk kilde. De andre muligheder påstår ting om ejerskab, klickjageri eller reporterens holdning, som teksten ikke indeholder.",
      examTip:
        "Til eksamen: Kildekritik giver bonus-point i kommunikationsanalysen: Skriv hvem der taler, hvilken interesse taleren har, og om teksten inddrager modparten. Det viser, at du kan gennemskue referatets mekanik.",
    },
  ],
};

const SAT_3_ADVERTORIAL: ExamSatsT = {
  id: "hhx-sats-03",
  title: "Eksamenssæt 3 · Pension som nyansat",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
  article: {
    title: "Sådan kommer du godt fra start med pension, også som helt ny i job",
    byline: "Annonceforløb i Handels Nyt (fiktivt medie) ; bragt i samarbejde med PensionPartner ; marts 2026",
    paragraphs: [
      "At få sit første rigtige job handler om løn, kolleger og faglighed. Men der er ét stykke papir, mange unge først griber ti år for sent: pensionsordningen.",
      "De tre gode vaner er at sætte et lille beløb til side hver måned. Lige så vigtigt er det at samle sine ordninger ét sted og opdatere sine data ved jobsift.",
      "Hos PensionPartner samler medlemmerne sine ordninger med tre klik i appen. 'Vi gør det overskueligt at se, hvad du har, og hvad du mangler,' siger produktdirektør Mia Lindholm.",
      "Lige nu kan du booke en gratis formuecheck-samtale hos PensionPartner på hjemmesiden. Det tager tyve minutter, og du får en personlig oversigt med hjem.",
    ],
  },
  questions: [
    {
      id: "g3-1",
      kind: "choice",
      label: "Genre",
      category: "genrer",
      prompt: "Hvilken genre tilhører teksten?",
      hint:
        "Sådan gør du: Kig i bylinen efter, HVEM teksten er bragt i samarbejde med, og læg mærke til, om teksten giver gode råd eller promoverer et bestemt produkt. Genren kan være en blanding: hvad dominerer?",
      options: [
        "Kronik, fordi en navngiven skribent debatterer danskernes pensionsvaner.",
        "Annonce/advertorial, fordi teksten er fagligt inspireret af journalistisk stil (gode råd), men i bund og grund er betalt af et firma, der sælger netop det, den anbefaler.",
        "Nyhedsreferat, fordi teksten refererer en aktuel beslutning i PensionPartner.",
        "Oplysende feature, fordi teksten udelukkende giver gode råd uden kommerciel hensigt.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: Advertorial (annoncerende reportage). 'Bragt i samarbejde med PensionPartner' er det afgørende spor : teksten klæder salget i journalistisk tøj med 'gode vaner'-råd og afslører først i 4. afsnit, at det hele munder ud i et tilbud. Der er ingen debat (kronik), ingen begivenhed (referat).",
      examTip:
        "Til eksamen: Advertorial er en yndlings-genre til eksamen, fordi den kræver kildekritik. Nøglespørgsmålet er altid: Hvem TJENER på, at jeg læser teksten? Nævn bylinens 'i samarbejde med' som belæg.",
    },
    {
      id: "g3-2",
      kind: "choice",
      label: "Afsender",
      category: "kommunikation",
      prompt: "Hvem er den reelle afsender bag teksten?",
      hint:
        "Sådan gør du: Skel mellem MEDIE (hvor teksten står) og AFSENDER (hvem der står bag budskabet og betaler for det). Spørg: Hvem har skrevet teksten til formålet?",
      options: [
        "Handels Nyt, fordi avisen altid er afsender på alt, der står i den.",
        "Produktdirektøren Mia Lindholm, fordi hun er den eneste navngivne kilde i teksten.",
        "PensionPartner, fordi teksten er et betalt samarbejde, der promoverer virksomhedens app og tilbud.",
        "Avisens redaktion, som selv har fundet på de tre gode vaner.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: PensionPartner er den reelle afsender : avisen er kun mediet. Lindholm er kun en kilde, der citeres (en klassisk annonce-floskel), og 'vanerne' er et begreb, ikke en person.",
      examTip:
        "Til eksamen: Sæt altid 'reel afsender' vs. 'medium' op mod hinanden. I betalte samarbejder SKAL du kunne nævne begge dele og forklare, hvorfor de ikke er det samme.",
    },
    {
      id: "g3-3",
      kind: "choice",
      label: "Formål",
      category: "kommunikation",
      prompt: "Hvad er tekstens PRIMÆRE formål?",
      hint:
        "Sådan gør du: Formålet afsløres af, hvad teksten vil have dig til TIL SIDST (opfordringen/konklusionen). Rådgivning kan være pynt ; hvad er målet bag pynten?",
      options: [
        "At oplyse neutralt om danske regler for pension, på linje med det offentlige.",
        "At underholde med sjove eksempler på nyansattes bondefangeri.",
        "At danne dækning for, at avisen ikke længere skriver pension-artikler.",
        "At få læseren til at få øjnene op for PensionPartner og booke den gratis samtale.",
      ],
      correctIndex: 3,
      feedback:
        "Rigtigt: Det salgsrettede formål afsløres i 4. afsnit med 'lige nu'-presset, 'gratis'-lavetærsklen og call-to-action på hjemmesiden. De gode råd fra 2. afsnit bruges som mellemled frem mod formålet : indholdsmarkedsføring (content marketing).",
      examTip:
        "Til eksamen: Formålet findes hvor opfordringen er: slutningen af teksten er næsten altid afgørende. Citér selve call-to-action som belæg, når du konkluderer formålet.",
    },
    {
      id: "g3-4",
      kind: "choice",
      label: "Modtager",
      category: "kommunikation",
      prompt: "Hvem er tekstens målgruppe, og hvordan kan du se det i sproget?",
      hint:
        "Sådan gør du: Find tiltale-former og henvendelser ('du', 'din alder'), stikord om livsfase og hvor mange teksten forudsætter, at modtageren ALREADY ved om økonomi.",
      options: [
        "Pensionister, fordi teksten handler om pension og bruger rolig, gammeldags prosa.",
        "Unge, der er ved at falde til på arbejdsmarkedet, fordi tiltalen 'du', eksemplet 'første rigtige job' og de enkle penge-råd signalerer nybegynderen.",
        "Virksomhedsejere, fordi det er dem, der tegner pension til de ansatte.",
        "Fagøkonomer, fordi teksten forudsætter kendskab til begreber som bundlinje og fradrag.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: Målgruppen er de helt nyansatte. Det ses af 'første rigtige job', 'mange unge først griber ti år for sent' og de fundamentale gode råd. Sproget er bevidst lavt og 'du'-rettet : det henvender sig til begynderen, ikke til eksperter.",
      examTip:
        "Til eksamen: Modtager-analysen: Knyk sproglige spor (tiltale, ordvalg, forudsætninger) til livsfase og viden. Undgå at gætte på alder uden tekstligt belæg.",
    },
    {
      id: "g3-5",
      kind: "choice",
      label: "Semantik",
      category: "semantik",
      prompt: "1. afsnit: 'Men der er ét stykke papir, mange unge først griber ti år for sent.' Hvad mener skribenten med det billede?",
      hint:
        "Sådan gør du: Hvad griber man IKKE bogstaveligt? Hvad sker der reelt, når 'ti år er gået'? Afsnit billedet som en forsinkelse med konsekvenser.",
      options: [
        "De unge køber fysisk papir til at skrive kontrakter på, men papiret slipper op i butikkerne.",
        "Mange unge venter for længe med at sætte sig ind i deres pensionsforhold, og hver udsættelse koster penge senere.",
        "PensionPartner sender papiransøgninger, der kommer frem for sent til de unge.",
        "Unge i dag gider ikke læse lange dokumenter, fordi de er vant til kort.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: 'Stykke papir' står metonymisk for pensionsordningen, og 'ti år for sent' understreger prisen for udskydelsen : jo før beløbene sættes ind, jo mere når de at vokse. Billedet rummer en bevidst overdrivelse, der skal skabe handlingstryk hos de unge.",
      examTip:
        "Til eksamen: Forklare-billeder i tre led: 'Billedet viser konkret ... ; overført betyder det ... ; effekten på læseren er ...'. Så får du point for indhold OG virkning.",
    },
    {
      id: "g3-6",
      kind: "choice",
      label: "Pragmatik",
      category: "pragmatik",
      prompt: "4. afsnit: 'Lige nu kan du booke en gratis formuecheck-samtale ... Det tager tyve minutter.' Hvad GØR teksten med den ytring?",
      hint:
        "Sådan gør du: Sammenlign indhold med handling: Informerer teksten kun, eller forsøger den at få dig til noget? Hvilke 'salgsgreb' ligger i 'lige nu', 'gratis' og 'tyve minutter'?",
      options: [
        "Den udfører en opfordring (direktiv talehandling) pakket ind i tilbud : tidsbegrænsning, gratis-indgang og lav tids-forpligtelse skal få dig til at handle nu.",
        "At den bare informerer uden hensigt, fordi 'kan' blot er et neutralt mulighedsord.",
        "Den truer læseren med at miste sin pension, hvis hun ikke booker.",
        "Den underholder med en vittig pointer om kort tid.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Det er en opfordring/call-to-action. 'Lige nu' (urgency), 'gratis' (lav tærskel) og 'tyve minutter' (lav risiko) er klassiske salgsgreb. 'Kan' er her ikke neutralt, men lokkende ; der verken trues eller spøges.",
      examTip:
        "Til eksamen: Prøv ytringen mod Searles tre led: lokution ( hvad der siges), illokution ( hvad der GØRES: her en opfordring), perlokution ( hvad den skal opnå: booking). Nævn de tre grebe som belæg for illokutionen.",
    },
    {
      id: "g3-7",
      kind: "wordclass",
      label: "Ordklasser",
      category: "ordklasser",
      prompt: "Hvilken ordklasse tilhører hvert af de fem ord? Klik på ordet og vælg ordklasse.",
      hint:
        "Sådan gør du: Brug bøje-testene. Husk at småord som 'ved', 'og' og 'for' altid skal tjekkes i kontekst: hvad hæfter de ved?",
      words: [
        { word: "booke", correct: "verbum" },
        { word: "personlig", correct: "adjektiv" },
        { word: "sine", correct: "pronomen" },
        { word: "ved", correct: "præposition" },
        { word: "og", correct: "konjunktion" },
      ],
      feedback:
        "'booke' : verbum i navneform (efter 'kan' ; bøjes: booker, bookede ; låneord fra engelsk 'to book'). 'personlig' : adjektiv (fælleskønsform, bøjes: personligt/personlige). 'sine' : pronomen (sit/sin/sine ; refleksivt possessivt pronomen, der viser tilbage til subjektet). 'ved' : præposition her ('ved jobsift' indleder en præpositionsguppe). 'og' : konjunktion (bindeord).",
      examTip:
        "Til eksamen: 'sine' er refleksivt : det skal vise tilbage til subjektet ('han opdaterer sine data' = hans egne). Prøv at erstatte med 'hans' : skifter betydningen, har du fundet den refleksive fælde.",
    },
    {
      id: "g3-8",
      kind: "analysis",
      label: "Syntaks · led",
      category: "saetningsled",
      prompt: "Analyser sætningen fra 2. afsnit: Klik på hvert led-kort og vælg det rigtige symbol.",
      sentence: "De tre gode vaner er at sætte et lille beløb til side hver måned.",
      chunks: ["De tre gode vaner", "er", "at sætte et lille beløb til side hver måned"],
      correctMap: ["subjekt", "verbal", "subjpred"],
      hint:
        "Sådan gør du: Efter 'være' (er) kan verbet IKKE have et objekt: hvad der kommer efter, TILBARUOR subjektet : det er et subjektsprædikat. Test det ved at bytte om: 'At sætte ... er de tre gode vaner'.",
      feedback:
        "Rigtigt: 'De tre gode vaner' = subjekt, 'er' = verballed (kopulumverbet), og 'at sætte et lille beløb til side hver måned' = subjektsprædikat (det fortæller, hvad subjektet ER). Leddet efter 'er' er altså IKKE et objekt : 'være'-sætninger har prædikat, ikke objekt.",
      examTip:
        "Til eksamen: Husk tommelfingerreglen: subjektsprædikat kræver et 'være'-agtigt kopulumverbum (er, bliver, virker). Er der et handlingsverb med et objekt, er det et objekt, ikke et prædikat. Navngiv begge led korrekt.",
      },
    {
      id: "g3-9",
      kind: "multi",
      label: "Salgsgreb",
      category: "pragmatik",
      prompt: "Klik på ALLE de elementer, der er SALGSGREB i teksten (måden at overtale på), ikke neutrale oplysninger.",
      hint:
        "Sådan gør du: Salgsgreb er bevidste påvirkningsstrategier: følelser, tidspres, gratis, 'alle gør det'. Neutrale oplysninger er faktuelle henvisninger uden overtalelseshensigt.",
      options: [
        "Oplysningen om, at 'det tager tyve minutter' : en lavt præsenteret tidsramme, der skal gøre 'ja'-svaret nemmere.",
        "At teksten nævner pension som et generelt samfundsforhold.",
        "App-navnet 'PensionPartner' gentages tre steder i teksten.",
        "At de tre gode vaner er formuleret som en generel rådgivning, teksten IKKE tjener penge på.",
        "'Lige nu' og 'gratis' : ord der skaber pres og sænker tærsklen for at sige ja.",
      ],
      correctIndexes: [0, 2, 4],
      feedback:
        "Rigtigt: Tidsangivelsen 'tyve minutter' sænker risikoen, det gentagede brand-navn skaber genkendelse (klassisk reklamegreb), og 'lige nu + gratis' kombinerer pres med lav tærskel. 'Pension som samfundsforhold' er en emneoplysning, ikke et greb ; og 'gode vaner'-delen ER en del af salgsstrategien (content marketing), så den er IKKE neutral.",
      examTip:
        "Til eksamen: Salgsgreb-finderen: Spørg ved hvert element 'HVAD SKAL det gøre ved læseren?'. Kan du navngive effekten (pres, tillid, genkendelse), er det et greb : nævn effekten i dit svar.",
    },
    {
      id: "g3-10",
      kind: "choice",
      label: "Indhold",
      category: "kommunikation",
      prompt: "Hvilken af de 'tre gode vaner' optræder IKKE i tekstens opremsning?",
      hint:
        "Sådan gør du: Læs 2. afsnit omhyggeligt og streg de tre vaner over i hånden (eller med app-tusch). Sammenlign derefter liste for liste. Én mulighed ligner, men er byttet ud.",
      options: [
        "At sætte et lille beløb til side hver måned.",
        "At lægge sine betalingskort om til en fælles pensionskonto.",
        "At opdatere sine data ved jobsift.",
        "At samle sine ordninger ét sted.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt svar (den, der IKKE er i teksten): 'betalingskort om til en fælles pensionskonto' er opspind : teksten siger intet om kort, kun om beløb, samlingssted og data-opdatering. De tre andre genfindes ordret i 2. afsnit.",
      examTip:
        "Til eksamen: Find-ikke-spørgsmålene er lette point, men kræver nærlæsning: understrøg i teksten, hvad listen ER, før du ser på mulighederne. ellers bider du på alternativer, der 'lyder rigtigt'.",
    },
  ],
};

const SAT_4_LESERBREV: ExamSatsT = {
  id: "hhx-sats-04",
  title: "Eksamenssæt 4 · Kiosken, kantinen og principperne",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
  article: {
    title: "Min mor købte også slik i den gamle kantine",
    byline: "Læserbrev i Aarhus Stifts Avis (fiktiv avis) ; af Mette Dahl, forælder i Risskov ; 3. maj 2026",
    paragraphs: [
      "I denne uge vedtog skolebestyrelsen at forbyde slik og sodavand i skolekiosken. Jeg forstår godt tanken om sundere mad, men jeg forstår ikke, at man glemmer, hvad kiosken også er: et sted, hvor børn og voksne taler sammen.",
      "Da jeg gik i skole, købte min mor også slik i kantinen. Hendes venner taler den dag i dag om frikatterne i frikvarteret. Det er netop de små ritualer, der gør en skoledag til mere end timer foran en tavle.",
      "Sundhedsstyrelsen har ret i, at for mange børn drikker sodavand. Løsningen er dog ikke et totalforbud, men et udvalg: Bed eleverne selv om at sammensætte den nye menu, og lad kiosken sælge både boller og knækbrød.",
      "Jeg opfordrer skolebestyrelsen til at genoptage sagen på næste møde. Et forbud er nemt at vedtage ; tillid hos eleverne er svær at genoprette.",
    ],
  },
  questions: [
    {
      id: "g4-1",
      kind: "choice",
      label: "Genre",
      category: "genrer",
      prompt: "Hvilken genre tilhører teksten, og hvad er det VIGTIGSTE kendetegn?",
      hint:
        "Sådan gør du: Genren afgøres af, HVEM der skriver (privat person? redaktion? reporter?) og med hvilken RET (ønske om at påvirke?). Bylinen er dit hurtigste spor.",
      options: [
        "Læserbrev, fordi en privat person (en forælder) henvender sig til en konkret beslutningstager og debatten med sin egen mening og erfaring.",
        "Kronik, fordi teksten er skrevet af en redaktionel fagperson med et bredt analytisk sigte.",
        "Nyhedsreferat, fordi 1. afsnit refererer et reelt vedtag fra skolebestyrelsen.",
        "Annonce, fordi teksten foreslår nye varer til kiosken.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Læserbrev. Nøglekendetegnene: privat afsender ('forælder i Risskov'), personlig erfaring ('min mor købte også'), konkret opfordring til beslutningstageren og debat-deltagelse om en aktuel sag. At første afsnit INDEHOLDER et referat, gør ikke teksten til et nyhedsreferat : referatet er blot sagen, der debatteres.",
      examTip:
        "Til eksamen: Genre-bestemmelsen: Afsender + formål + opbygning i én sætning. 'Det er et læserbrev, fordi en privat person med personlige belæg retter en konkret opfordring til beslutningstageren' er et hele svar.",
    },
    {
      id: "g4-2",
      kind: "choice",
      label: "Afsender og modtager",
      category: "kommunikation",
      prompt: "Hvad kan man sige om afsenders position, og hvem er de primære modtagere?",
      hint:
        "Sådan gør du: Afsenders POSITION betyder: hvilken rolle taler hun fra ( ekspert? berørt forælder?). Modtagerne kan være flere lag: hvem tiltales direkte, og hvem læser med?",
      options: [
        "Afsender: sundhedsfaglig ekspert ; modtagere: læger og sygeplejersker på regionalt niveau.",
        "Afsender: skolebestyrelsens formand ; modtagere: forældrene, som skal stemme ved næste valg.",
        "Afsender: en berørt forælder (ikke-instans) ; primær modtager: skolebestyrelsen ; sekundær modtager: de øvrige læsere, som skal bakke op om sagen.",
        "Afsender: avisens redaktion ; modtagere: kommunens sundhedsafdeling og politikere.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: Mette Dahl skriver som berørt forælder, IKKE som sagkyndig. Hun retter sig direkte til bestyrelsen ('Jeg opfordrer skolebestyrelsen') men udgives i avisen, så hele byen læser med : dobbelt modtager-retning er et klassisk træk ved læserbrevet.",
      examTip:
        "Til eksamen: Skeln primær og sekundær modtager, når genren er offentligt (læserbrev, debatindlæg). Det giver point at kunne forklare, hvorfor tekstens skarpe formuleringer også handler om at vinde de tilstedeværende læsere.",
    },
    {
      id: "g4-3",
      kind: "choice",
      label: "Semantik",
      category: "semantik",
      prompt: "1. afsnit: 'hvad kiosken OGSÅ er: et sted, hvor børn og voksne taler sammen'. Hvilken pointe ligger i ordet 'også'?",
      hint:
        "Sådan gør du: Småord som 'også' peger typisk på en modsætning til en anden opfattelse. Spørg: Hvad mener modparten at kiosken ER (først og fremmest)? Hvad lægger 'også' dermed til?",
      options: [
        "'Også' signalerer, at kiosken ud over slik SALGER andre ting også: papir, blyanter og drikkevarer.",
        "'Også' anerkender modpartens pointe om det sundhedsfaglige, men insisterer på den ANDEN mening : kiosken er også et socialt rum, som et forbud rammer.",
        "'Også' er en henvisning til, at MOREN også købte slik, så det er en familietradition.",
        "'Også' understreger, at forfatteren er ligeglad, for det ændrer intet.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: 'Også' bærer hele brevets strategi : forfatteren afviser ikke sundhedshensynet (se endda 'Sundhedsstyrelsen har ret'), men tilføjer det sociale lag, som forbudet overser. Det er en anerkendende forhandling, ikke afvisning.",
      examTip:
        "Til eksamen: Nøgle-ord som 'også', 'dog', 'netop', 'stadig' er debatmarkører : ét ord kan vende hele tekstens strategi. Læg mærke til dem, og citér dem som belæg.",
    },
    {
      id: "g4-4",
      kind: "choice",
      label: "Pragmatik",
      category: "pragmatik",
      prompt: "Slutningen: 'Et forbud er nemt at vedtage ; tillid hos eleverne er svær at genoprette.' Hvilket virkemiddel skaber effekten?",
      hint:
        "Sådan gør du: Sammenlign de to halvdeles sætningsstruktur og indhold: Er de ens opbygget? Er indholdet modsatrettet? Det afgrænser virkemidlet fra f.eks. gentagelse og sammenligning.",
      options: [
        "Allitteration, fordi 'forbud' og 'følelser' deler startkonsonant i hele brevet.",
        "Sammenligning, fordi 'nemt' og 'svært' sammenlignes med en 'som'-konstruktion.",
        "Antitese (modsætning): to symmetriske halvdele stiller 'nem at vedtage' op mod 'svær at genoprette', så prisen ved forbuddet står knivskarp.",
        "Ironi, fordi forfatteren egentlig synes, at et forbud er en fremragende idé.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: Antitese : spejlvendt opbygning (A er nemt ; B er svær) med modsatrettet indhold. Der er ingen 'som'-sammenligning, ingen systematisk stavelsesgentagelse, og intet tyder på, at forfatteren mener det modsatte : modsat slutningens opfordring ville ironi være selvmord for budskabet.",
      examTip:
        "Til eksamen: Navngiv virkemidlet OG forklar virkningen: 'Modsætningen gør prisen ved forbuddet håndgribelig for bestyrelsen'. Virknings-delen er det, der giver point.",
    },
    {
      id: "g4-5",
      kind: "wordclass",
      label: "Ordklasser",
      category: "ordklasser",
      prompt: "Hvilken ordklasse tilhører hvert af de fire ord? Klik på ordet og vælg ordklasse.",
      hint:
        "Sådan gør du: 'dog' kan forveksles med navneordet 'en hund' (kæledyret) : kig på, hvor ordet står i sætningen. Præpositionen styrer altid et navneled efter sig.",
      words: [
        { word: "vedtog", correct: "verbum" },
        { word: "små", correct: "adjektiv" },
        { word: "dog", correct: "adverbium" },
        { word: "om", correct: "præposition" },
      ],
      feedback:
        "'vedtog' : verbum (præteritum af 'vedtage'). 'små' : adjektiv (beskriver 'ritualer'; grundform 'lille' med flertalsform 'små'). 'dog' : adverbium HER (betydningen 'alligevel', en modsætning til det foregående; det modificerer hele udsagnet). Det er IKKE navneordet 'en hund' (et kæledyr) : som navneord kunne det stå med artikel (en hund), og det gør det ikke her. 'om' : præposition i 'tanken om sundere mad' (styrer navneleddet 'sundere mad').",
      examTip:
        "Til eksamen: Et ords ordklasse er ALDRIG fast : den afhænger af pladsen. Skriv derfor 'om er præposition i THIS sætning, fordi...' : dét viser, at du forstår konteksten.",
    },
    {
      id: "g4-6",
      kind: "analysis",
      label: "Syntaks · led",
      category: "saetningsled",
      prompt: "Analyser sætningen fra 2. afsnit: Klik på hvert led-kort og vælg det rigtige symbol.",
      sentence: "Hendes venner taler den dag i dag om frikatterne i frikvarteret.",
      chunks: ["Hendes venner", "taler", "den dag i dag", "om frikatterne i frikvarteret"],
      correctMap: ["subjekt", "verbal", "adverbial", "adverbial"],
      hint:
        "Sådan gør du: Verbet 'taler' kan ikke have et direkte objekt alene ('venner taler frikatterne' går ikke) : 'om ...' er derfor IKKE objekt, men et adverbialled med præposition. Tæl ledene : to adverbialer (tid og indhold/om) er tilladt.",
      feedback:
        "Rigtigt: 'Hendes venner' = subjekt, 'taler' = verballed, 'den dag i dag' = adverbial (tid), 'om frikatterne i frikvarteret' = adverbial (præpositions-led). Fælden var at kalde 'om frikatterne' for et objekt : men tale-verbet kræver 'om', og det led er en valgfri tilføjelse (adverbial), ikke et obligatorisk objekt.",
      examTip:
        "Til eksamen: Objekt-test for 'tale'-sætninger: kan man sige 'én taler NOGET' uden præposition? Hvis nej, er præpositions-leddet et adverbial. Den test gælder generelt for verber med faste-præposition (tale om, drømme om, glæde sig over).",
    },
    {
      id: "g4-7",
      kind: "choice",
      label: "Syntaks · ledsætning",
      category: "syntaks",
      prompt: "2. afsnit: 'Da jeg gik i skole, købte min mor også slik i kantinen.' Hvad er 'Da jeg gik i skole'?",
      hint:
        "Sådan gør du: 'Da' er en underordnende konjunktion. Spørg hvad delen angiver i hovedsætningen : tid, grund eller betingelse? Og tjek om delen kan stå alene.",
      options: [
        "En temporal adverbiel ledsætning (tid) : den kan ikke stå alene og angiver, HVORNÅR købet skete.",
        "En kausal adverbiel ledsætning (grund) : den forklarer, HVORFOR moren købte slik.",
        "En hovedsætning, fordi 'da' kan erstatte 'derfor' i talesprog.",
        "En relativsætning, der nærmere bestimmer 'jeg'.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Temporal ledsætning : 'da' svarer til 'på det tidspunkt, hvor' (tid, dengang). Grund-fortolkningen (B) frister, men 'da' angiver tidspunktet, ikke årsagen : sammenlign 'Fordi jeg var sulten...' som ville være kausal. Dele med underordnende konjunktion er ALDRIG hovedsætninger.",
      examTip:
        "Til eksamen: 'Da' vs 'fordi' er den klassiske modstilling : 'da' svarer på 'hvornår?' (tid), 'fordi' svarer på 'hvorfor?' (grund). Skriv begge tests ind i besvarelsen, så er du sikker.",
    },
    {
      id: "g4-8",
      kind: "multi",
      label: "Argumentation",
      category: "pragmatik",
      prompt: "Klik på ALLE de sætninger, der er ARGUMENTER (belæg for forfatterens påstand) ; ikke påstande, indrømmelser eller henvisninger til modparten.",
      hint:
        "Sådan gør du: Argumentet svarer på 'hvorfor skal vi tro påstand?'. Forfatterens påstand er: totalforbudet er en dårlig idé. Er sætningen en ERFARING eller en BEGRUNDELSE for den påstand? Indrømmelser ('Sundhedsstyrelsen har ret...') støtter MODPARTEN.",
      options: [
        "'Det er netop de små ritualer, der gør en skoledag til mere end timer foran en tavle.'",
        "'Sundhedsstyrelsen har ret i, at for mange børn drikker sodavand.'",
        "'Hendes venner taler den dag i dag om frikatterne i frikvarteret.' (konkret erfaring som belæg for mening 2 : de sociale minder)",
        "'Jeg forstår godt tanken om sundere mad.'",
        "'Et forbud er nemt at vedtage ; tillid hos eleverne er svær at genoprette.'",
      ],
      correctIndexes: [0, 2],
      feedback:
        "Rigtigt: (1) sætningen med den generelle erfaring/pointe om ritualerne OG barndomshistorien med frikatterne er BEGGE belæg for, at forbudet rammer noget vigtigt. 'Sundhedsstyrelsen har ret' er en INDRØMMEELSE til modparten, 'Jeg forstår godt tanken' er en indledende imødekommenhed, og slutningen er en POINTE/PÅSTAND (konsekvens-budskab), ikke et selvstændigt belæg.",
      examTip:
        "Til eksamen: Tegner du argumentskemaet (påstand over belæg), bliver indrømmelserne synlige for sig : de er modpartens belæg, du anerkender, før du vender. Det er det svar, censor elsker.",
    },
    {
      id: "g4-9",
      kind: "choice",
      label: "Formål",
      category: "kommunikation",
      prompt: "Hvad vil forfatteren OPNÅ med brevet?",
      hint:
        "Sådan gør du: Find opfordringen (til sidste afsnit, 'Jeg opfordrer ...'). Formålet er det, Handlingen bagsved opfordringen skal føre til. Vælg ikke 'formidle holdning', når teksten vil HAVE noget.",
      options: [
        "At få skolebestyrelsen til at genoptage sagen og inddrage eleverne i menuens sammensætning i stedet for totalforbudet.",
        "At fortælle sin barndoms sjove kantinhistorier for underholdningens skyld.",
        "At få vedtaget et endnu skærpet forbud mod sodavand i hele kommunen.",
        "At reklamere for de nyåbnede økologiske knækbrød fra den lokale bagemand.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Brevet er en handlingsorienteret debatdeltagelse : genoptagelse + elevinddragelse + 'boller OG knækbrød' (moderat udvalg som alternativ). Historierne er belæg, ikke formål ; C er det modsatte af brevet ; D er opdigtet (knækbrød nævnes som princip, ikke som produkt).",
      examTip:
        "Til eksamen: Formål = 'det, afsenderen vil opnå HOS HVEM'. Sæt det i én formel: 'Afsenderen vil opnå X hos Y ved at Z.' Så undgår du det løse 'formidle en holdning'.",
    },
  ],
};

const SAT_5_ELEVBLAD_Ai: ExamSatsT = {
  id: "hhx-sats-05",
  title: "Eksamenssæt 5 · AI i skoletasken",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
  article: {
    title: "Lektiehjælp fra en maskine : er det snyd eller redning?",
    byline: "Leder i Elevbladet, Risskov Gymnasium (fiktivt skoleblad) ; skrevet af elevredaktør Albert Nyborg ; 19. september 2026",
    paragraphs: [
      "Næsten hver aften sidder en elev fra mit årgang og spørger en chatbot, hvordan en stil nu skal bygges op. Lærerne kalder det genvej ; eleverne kalder det læring. Måske har begge ret.",
      "Kritikken har et point : hvis AI'en tænker for dig, bliver du ikke bedre af at tænke selv, og de skriftlige karakterer risikerer derfor at måle maskinen frem for eleven.",
      "Til gengæld hjælper AI'en, hvor en lærer umuligt kan være : hjemme ved køkkenbordet klokken 22. Eleven bruger værktøjet hver aften. Når du sidder fast, behøver du ikke vente til i morgen med at få et skub i den rigtige retning.",
      "Derfor : forbyd ikke værktøjet. Lær os i stedet at bruge det. Bed os fx om at aflevere AI-udkastet og forklare, hvad vi ændrede ved det, og hvorfor.",
    ],
  },
  questions: [
    {
      id: "g5-1",
      kind: "choice",
      label: "Afsender",
      category: "kommunikation",
      prompt: "Hvem er afsender, og hvorfor ER det særligt vigtigt at vide her?",
      hint:
        "Sådan gør du: Byline: elevredaktør i skolebladet. Spørg hvad den POSITION indebærer : hvem taler hun PÅ VEGNE af, og hvem taler hun til? Afsenders rolle afgør også, hvordan 'lederen' skal læses.",
      options: [
        "En skole-elev (elevredaktør) som taler fra EGEN erfaring til kammerater og lærere : positionen gør appellen troværdig hos eleverne, men giver ham også en inhabilitet, han må tage højde for.",
        "Skolets ledelse, fordi en leder altid skriver på vegne af institutionen.",
        "En AI-forsker, fordi teksten handler om kunstig intelligens.",
        "Forældrerådet, fordi forældre er dem, der betaler skolebladet.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Afsender er elevredaktør : en 'leder' i et SKOLEblad, ikke en institutionel direktør. Positionen er dobbelt : han taler til ligestillede (medelever) OG om en sag, der gælder ham selv (inhabilitet/egeninteresse er værd at nævne i analysen).",
      examTip:
        "Til eksamen: Afsender-analysen : rolle + interesse + troværdighed. At nævne afsenders EGEN berørthed viser overskud og hører til de kriterier, censor lægger mærke til.",
    },
    {
      id: "g5-2",
      kind: "choice",
      label: "Genre",
      category: "genrer",
      prompt: "Hvilken genre er teksten? (Tip: 'leder' er en genre!)",
      hint:
        "Sådan gør du: En leder (editorial) er en kort, meningsbærende tekst fra en redaktion. Tjek opbygningen: aktuel anledning, synspunkt, argumenter, konklusion/opfordring. Hvad adskiller lederen fra en kronik?",
      options: [
        "Nyhedsreferat, fordi lederen bringer læserne opdateret viden om elevernes chatbot-forbrug.",
        "Annonce, fordi 'værktøjet' markedsføres over for målgruppen.",
        "Læserbrev, fordi teksten er sendt ind til bladet af en anonym læser.",
        "Leder/editorial, fordi redaktionen (her elevredaktøren) præsenterer et synspunkt i en aktuel sag på bladets vegne med anledning, argumenter og konklusion.",
      ],
      correctIndex: 3,
      feedback:
        "Rigtigt: Leder-genren: kollektiv afsender (redaktionen), kort struktur (anledning -> kritik -> men-modpart -> konklusion -> opfordring) og et klart synspunkt. Den er IKKE anonymt læserbrev (der står navn og rolle) og slet ikke neutralt referat.",
      examTip:
        "Til eksamen: Genre-med-belæg: citér NETOP strukturen (anledning, synspunkt, opfordring) som genre-bevis. Kronik vs. leder skiller man ved afsender: ekstern gæst (kronik) vs. bladets egen redaktion (leder).",
    },
    {
      id: "g5-3",
      kind: "choice",
      label: "Komposition",
      category: "genrer",
      prompt: "Hvad gør 'Til gengæld' (3. afsnit) ved tekstens opbygning?",
      hint:
        "Sådan gør du: Find hvad 'til gengæld' vender : 2. afsnit gav modpartens argument. Et vendepunkt i en argumentativ tekst har et navn og en funktion. Hvad opnås ved at give modpartens pointe plads først?",
      options: [
        "Det indleder en VENDING : forfatteren har præsenteret kritikken (og delvist anerkendt den) og vender nu til sit eget hovedargument, så teksten fremstår nuanceret og modparten ikke kan afvises som ignorant.",
        "Det indleder en bipoint om lærernes arbejdstid, som teksten slet ikke diskuterer.",
        "Det afslutter teksten, fordi 'til gengæld' altid er sidste sætning i en artikel.",
        "Det er et rent fyld-ord uden funktion, der bare kan fjernes uden konsekvens.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt: Klassisk argumentatorisk vending (indrømmelse + genmæle). Modpartens argument gives plads i 2. afsnit og anerkendes ('Kritikken har et point') for derefter at blive vendt : dét er netop opskriften på den overbevisende debattekst. De andre svar misforstår eller overfortolker bindeordsfunktionen.",
      examTip:
        "Til eksamen: Navngiv kompositionen: anledning -> modargument -> indrømmelse -> vending -> påstand -> opfordring. Vis hvor hvert led sidder. Det er hele point-strukturer, der gives i kompositionsspørgsmål.",
    },
    {
      id: "g5-4",
      kind: "choice",
      label: "Semantik",
      category: "semantik",
      prompt: "1. afsnit slutter: 'Måske har begge ret.' Hvad afslører den korte sætning om forfatterens strategi?",
      hint:
        "Sådan gør du: Hvad gør det ved læseren, at forfatteren IKKE straks vælger lejr? Kald det ved navn (nuancering) og forklar, hvad den forbereder i de næste afsnit.",
      options: [
        "At forfatteren reelt er ligeglad og overlader spørgsmålet til lærerne.",
        "At forfatteren er utroværdig, fordi hun ikke kan bestemme sig.",
        "At forfatteren med vilje indtager midterpositionen først : hun anerkender begge lejre for derefter at argumentere sig frem til sin egen løsning. Strategien hedder nuancering og skal gøre budskabet sværere at afvise.",
        "At forfatteren pointerer, at karakterer er ligegyldige for læring.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: Sætningen er strategisk : en indledende 'begge-parter-omfavnelse', der klargør, at svaret IKKE er sort-hvidt, og at resten af lederen vil udfolde syntesen (brug det, lær det). Ligegyldighed eller vaklen ville staa i modsætning til den skarpe slutopfordring.",
      examTip:
        "Til eksamen: Korte sætninger er ofte AFSPORINGER: forfatterens position. Citér den, navngiv strategien (nuancering/indrømmelse) og vis, hvordan den hænger sammen med konklusionen.",
    },
    {
      id: "g5-5",
      kind: "choice",
      label: "Pragmatik",
      category: "pragmatik",
      prompt: "4. afsnit: 'Forbyd ikke værktøjet. Lær os i stedet at bruge det.' Hvad karakteriserer disse ytringer?",
      hint:
        "Sådan gør du: Find verbernes form (bydemåde) og retningen (til hvem?). Hvad GØR to på hinanden følgende bydemåder med tonen? Er de dialog eller direktiver?",
      options: [
        "De er konstaterende referater af, hvad skolebestyrelsen allerede har vedtaget.",
        "De er to direktiver (bydeforms-opfordringer) rettet til lærerne : den ene afviser én løsning, den anden kræver en anden, og sammen former de et kontant krav med åbenlys løsningsorientering.",
        "De er spørgsmål, fordi alle sætninger i en leder er uomgåelige spørgsmål.",
        "De er citater fra skolets pc-policy, som forfatteren refererer neutralt.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: Imperativer ('forbyd', 'lær') rettet mod lærerkollegiet = direktiver : talhandlingen er at kræve handling. Den modsatte parallel-konstruktion (ej X, men Y) skaber en kontant tone : skarp, men IKKE vred : lederen er saglig og løsningsorienteret (se det konkrete forslag bagefter).",
      examTip:
        "Til eksamen: Talehandlinger: klassificér som repræsentativer (påstande), direktiver (bydelse/opfordring), kommissiver (løfter) eller expressiver (følelser). Her: direktiver. Nævn HVEM de rettes til. Det er hele karakteren.",
    },
    {
      id: "g5-6",
      kind: "wordclass",
      label: "Ordklasser",
      category: "ordklasser",
      prompt: "Hvilken ordklasse tilhører hvert af de fem ord? Klik på ordet og vælg ordklasse.",
      hint:
        "Sådan gør du: 'genvej' kan testes med 'en/noget' foran (substantiv-testen). 'derfor' er et biord (adverbium) der peger på en grund. Husk præpositionens kendetegn : navneord efter sig.",
      words: [
        { word: "kalder", correct: "verbum" },
        { word: "genvej", correct: "substantiv" },
        { word: "bedre", correct: "adjektiv" },
        { word: "derfor", correct: "adverbium" },
        { word: "ved", correct: "præposition" },
      ],
      feedback:
        "'kalder' : verbum (nutidsform). 'genvej' : substantiv (en genvej ; modtager bestemt artikel). 'bedre' : adjektiv (komparativ af 'god' ; beskriver 'du' via 'bliver bedre'). 'derfor' : adverbium (kan stå i grundfeltet, bøjes ikke). 'ved' : præposition ('ved køkkenbordet', 'ved det' styrer navneled). Bemærk : 'ved' kan OGSÅ være verbum ('han ved noget') : konteksten afgør det, og her er det præposition.",
      examTip:
        "Til eksamen: Homonymer som 'ved' er yndlingsfælden. Skriv altid den test, du brugte : 'ved' + navneord (bordet) = præposition, 'ved' bøjet efter han/hun = verbum fra 'vide'.",
    },
    {
      id: "g5-7",
      kind: "analysis",
      label: "Syntaks · led",
      category: "saetningsled",
      prompt: "Analyser sætningen fra 3. afsnit: Klik på hvert led-kort og vælg det rigtige symbol.",
      sentence: "Eleven bruger værktøjet hver aften.",
      chunks: ["Eleven", "bruger", "værktøjet", "hver aften"],
      correctMap: ["subjekt", "verbal", "objekt", "adverbial"],
      hint:
        "Sådan gør du: 'bruge HVAD?' : det svar er det direkte objekt. 'hver aften' kan flyttes og udelades uden at sætningen holder op med at være grammatisk hel : det er adverbial (tid).",
      feedback:
        "Rigtigt: Eleven = subjekt, bruger = verballed, værktøjet = direkte objekt, hver aften = adverbial (tid). Flytte-testen viser det: 'Hver aften bruger eleven værktøjet' virker (adverbialer kan flyttes) ; 'værktøjet bruger eleven hver aften' knækker objektets binding til verbet.",
      examTip:
        "Til eksamen: Brug FLYTTE- og UDELADELSE-testen (ledene kan flyttes = adverbialer) og 'hvilket/hvad?'-testen (objekter). Navngiv med de latinske betegnelser og sig hvilken test der afgjorde det.",
    },
    {
      id: "g5-8",
      kind: "choice",
      label: "Medier og situation",
      category: "kommunikation",
      prompt: "Hvad kan man udlede om tekstens formål ud fra situationen (skoleblad, nyt skoleår, aktuel AI-debat)?",
      hint:
        "Sådan gør du: Situation = tidspunkt, medie, anledning. Hæft 'september starter et nyt skoleår' og 'AI-debatten er aktuel' sammen med genren leder : hvad siger den kombination om hensigten?",
      options: [
        "Situationen afslører en skolereform i realtid, som bladet refererer fortløbende.",
        "Situationen gør teksten til juridisk dokumentation, der kan bruges i en klagesag.",
        "Situationen (starten på et nyt skoleår, aktuel AI-debat, eget medie) signalerer en aktuelt forankret appel : lederen vil ændre skoledagens praksis : elever skal lære at bruge AI synligt, og lærerne skal inddrage det i opgaverne.",
        "Situationen er ligegyldig : en leder er altid generel og tidsløs.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt: Kommunikationssituationen skærper formålet : netop NU (skolestart, AI-eufori) skal der handles på skolen. 'reform i realtid' og 'juridisk dokumentation' er påstande uden belæg ; D er forkert : tid og sted påvirker ALLE teksters formål, dét er hele pointen med led-et 'situation'.",
      examTip:
        "Til eksamen: 'Situation' er ikke en løst nævnt dato : forklar HVAD anledningen gør ved formål og modtagere. Én sætning om sammenhængen slår hårdere end tre om emnet.",
    },
    {
      id: "g5-9",
      kind: "multi",
      label: "Påstand vs. belæg",
      category: "pragmatik",
      prompt: "Klik på ALLE de udsagn, der er PÅSTANDE (det forfatteren vil have dig til at tro/gøre) ; klik ikke på belæg.",
      hint:
        "Sådan gør du: Påstande kan man være uenige i uden at kunne måle sig frem. Belæg er observationsdata (hvad elever faktisk gør, hvad andre siger). Spørg: Er sætningen noget, man skal overbevises om?",
      options: [
        "'AI'en hjælper dér, hvor en lærer umuligt kan være.'",
        "'Næsten hver aften sidder en elev fra mit årgang og spørger en chatbot...' (observation)",
        "'Lær os i stedet at bruge det.'",
        "'Kritikken har et point.'",
        "'De skriftlige karakterer risikerer derfor at måle maskinen frem for eleven.' (modpartens belæg, refereret)",
      ],
      correctIndexes: [0, 2, 3],
      feedback:
        "PÅSTANDE : hjælper-påstanden (forfatterens vending), opfordringen 'lær os' og anerkendelses-påstanden 'kritikken har et point'. Observationen med chatbot-sætningen er BELÆG (genkendelig virkelighed), og karakter-risikoen er REFERAT af modpartens belæg. At kunne skelne påstand/belæg hos ANDRE kilder er kernekompetencen i analyse-opgaver.",
      examTip:
        "Til eksamen: Når du refererer modparten, så marker det tydeligt: 'Modpartens påstand er ... ; dens belæg er ...'. Det viser overblik og giver point for begge dele.",
    },
  ],
};

const SAT_6_FAGBLAD: ExamSatsT = {
  id: "hhx-sats-06",
  title: "Eksamenssæt 6 · Din overenskomst er ikke bare papir",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
  article: {
    title: "Din overenskomst er ikke bare papir",
    byline: "Medlemsnyt fra Butiksansattes Fagforening (fiktiv) ; skrevet af kommunikationsansvarlig Kenan Yildiz ; juni 2026",
    paragraphs: [
      "To gange om året forhandler vi en ny overenskomst på dit område. For de fleste af os er det bare en tyk bunke papir i indbakken. Men det er netop den bunke, der afgør, hvad din timeløn er, hvornår du har ret til fri, og hvad du får udbetalt, når du bliver syg.",
      "Denne gang kæmper vi for tre ting: et ekstra tillæg til dig, der møder ind før butikkens åbning, en fritvalgskonto til alle fuldtidsansatte og en skærpet regel om planlagte vagter. Forhandlingsudvalget møder arbejdsgiverne i august. Vi sender medlemmerne det nye forhandlingskatalog bagefter.",
      "Husk at opdatere dit medlemskort, inden overenskomsten træder i kraft : uden et gyldigt kort kan din a-kasse nemlig ikke dokumentere dine timer, hvis uheldet er ude.",
      "Vores styrke er fællesskabet. En enkelt, der klager alene, kan blive overset ; men 11.000 organiserede butiksansatte bliver ikke overset. Meld dig ind i netværket for unge, og følg os i august.",
    ],
  },
  questions: [
    {
      id: "g6-1",
      kind: "choice",
      label: "Genre",
      category: "genrer",
      prompt: "Hvilken genre er teksten?",
      hint:
        "Sådan gør du: Genre findes ud fra MEDIE (medlemsblad), AFSENDER (organisation) og KENDETENDE (praktisk info + opfordring + fællesskabstone). Hvad hedder den blanding?",
      options: [
        "Kronik, fordi kommunikationsansvarlige altid skriver kronikker om arbejdsmarkedet.",
        "Nyhedsreferat, fordi forhandlingerne først skal finde sted i august.",
        "Annonce, fordi fagforeningen vil have flere medlemmer.",
        "Medlemsnyt/medlemsinformation (organisatorisk info- og kampagnetekst) : praktisk information og opfordring i foreningens egen kanal med 'os-mod-verden'-tone.",
      ],
      correctIndex: 3,
      feedback:
        "Rigtigt: Medlemsblad-nyt. Kendetegn : organisationen henvender sig til sine egne i eget medie (egen kanal = fri ramme for tonen), teksten kombinerer viden (hvad er en overenskomst), handling (opdater kort) og fællesskabsdannelse ('vi', 'vores styrke'). Den er hverken neutral (referat), eksternt debattør-indlæg (kronik) eller produktsælgende (annonce : 'meld dig ind' handler om medlemskab, ikke et køb).",
      examTip:
        "Til eksamen: Organisatoriske genrer skal du kunne nævne PRÆCIST : 'medlemsinformation i fagforeningens medlemsblad' slår 'en artikel om fagforeninger'. Medie + afsender + modtager i ét træk.",
    },
    {
      id: "g6-2",
      kind: "choice",
      label: "Afsender-modtager",
      category: "kommunikation",
      prompt: "Hvilket AFSÆNDER-MODTAGER-forhold er det mest præcise?",
      hint:
        "Sådan gør du: Ydre afsender (den skrev ordene) vs. kollektiv afsender (den organisation, der taler). Modtageren er MEDLEMMERNE, men hvilke lag af dem, og med hvilke videns-forudsætninger?",
      options: [
        "Afsender : en journalist på overenskomst-området ; modtager : arbejdsgiverne i detailbranchen.",
        "Afsender : fagforeningens kommunikationsansvarlige på foreningens vegne ; modtager : foreningens medlemmer (butiksansatte), antaget som let informerede om faglige begreber.",
        "Afsender : forhandlingsudvalget ; modtager : alle danske lønmodtagere, også ikke-medlemmer.",
        "Afsender : a-kassen ; modtager : ledige uden arbejde.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: Kenan Yildiz skriver for foreningen til medlemmerne. Forudsætningerne ses i stikord som 'tillæg', 'fritvalgskonto' og 'katalog', der bruges uden forklaring : målgruppen kender spillereglerne ; men netop derfor forklares 'hvad en overenskomst ER' i 1. afsnit. A-kassen er kun nævnt som led i rækken, ikke som afsender.",
      examTip:
        "Til eksamen : Modtageranalysen : spørg 'hvad forudsættes kendt?'. Nævn 1-2 fagord brugt uden forklaring som belæg for, at modtageren er insider, og 1 forklaret begreb som belæg for, at teksten også henvender sig til den almindelige del af målgruppen.",
    },
    {
      id: "g6-3",
      kind: "choice",
      label: "Semantik",
      category: "semantik",
      prompt: "Titlen og 1. afsnit: 'Din overenskomst er ikke bare papir... det er netop den bunke, der afgør...'. Hvad sker der med ordet 'papir' i denne sammenhæng?",
      hint:
        "Sådan gør du: Hvad betyder 'bare papir' normally (negligerende)? Hvad gør teksten ved den betydning (nægter den, vender den)? Forklar det modsatte billede af papirbunken, teksten bygger op.",
      options: [
        "'Papir' bruges nedværdigende om teksters ubetydelighed generelt, også om selve medlemsbladet.",
        "Ordet bruges først som andres afvisning ('bare papir' : noget kedeligt man ignorerer) og VENDS derefter til sin modsætning : bunken er fundamentet for løn, fri og sygdom. Det er en afvisning-og-vending-struktur.",
        "'Papir' er en fagbetegnelse for selve forhandlingsresultatet, der trykkes i aviser.",
        "Ordet bruges som teknisk fagbetegnelse for dokumenttypen i en overenskomst-sag.",
      ],
      correctIndex: 1,
      feedback:
        "Rigtigt: 'Bare papir' ER modtagerens fordom, som teksten anerkender og vender : netop det kedelige fyldte er dit sikkerhedsnet. Billedet 'bunken, der afgør...' gør abstrakte rettigheder konkrete. De andre muligheder misser vendingen : ordet bruges ikke generelt nedværdigende, ej heller som fagbetegnelse.",
      examTip:
        "Til eksamen: Såkaldt 'avvisning-og-vending' (X er IKKE bare Y ; det er NETOP Z) er en klassisk åbnings-manovre. Navngiv den, og forklar virkningen : den taler læserens fordom om kedsomhed i møde i stedet for at skælde ud.",
    },
    {
      id: "g6-4",
      kind: "choice",
      label: "Pragmatik",
      category: "pragmatik",
      prompt: "3. afsnit: 'Husk at opdatere dit medlemskort, inden overenskomsten træder i kraft.' Hvad er den primære talehandling, og hvad understøtter den?",
      hint:
        "Sådan gør du: 'Husk at' er en opfordring, men hvilken SORT (venlig påmindelse? advarsel?)? Hvilken konsekvens ligger i bisætningen 'uden et gyldigt kort... dokumentere dine timer'?",
      options: [
        "En konstatering (repræsentativ) om, at kortet tit er forældet blandt medlemmerne.",
        "Et løfte (kommissiv) om at foreningen opdaterer medlemmernes kort automatisk.",
        "En invitation til en fest, fordi overenskomstens ikrafttræden skal markeres.",
        "En direktiv påmindelse med advarsels-baggrund (hvis ikke, kan a-kassen ikke dokumentere dine timer) : formålet er at sikre medlemmernes rettigheder og samtidig synliggøre foreningens værdi.",
      ],
      correctIndex: 3,
      feedback:
        "Rigtigt : Direktiv (opfordring) med en 'ellers-konsekvens' : det er advarende omsorg. Påmindelsen har en bi-effekt : den minder læseren om, hvad foreningen gør for ham : 'vi holder styr på dine papirer' hvilket understøtter foreningens andet formål (medlemsfastholdelse).",
      examTip:
        "Til eksamen: Talehandling + BIVIRKNING : nævn både hovedhandling (pågode advarsel/påmindelse) og den underliggende effekt (medlemsfastholdelse). Det løfter besvarelsen fra 'korrekt' til 'analytisk'.",
    },
    {
      id: "g6-5",
      kind: "choice",
      label: "Virkemiddel",
      category: "pragmatik",
      prompt: "4. afsnit: 'En enkelt, der klager alene, kan blive overset ; men 11.000 organiserede butiksansatte bliver ikke overset.' Hvilket virkemiddel + hvilken effekt?",
      hint:
        "Sådan gør du: Sammenlign de to halvdele på tre planer: TAL (én vs. 11.000), POSITION i sætningen og indbyrdes modretning. Hvad opnås ved at lade tallene stå alene uden adjektiver?",
      options: [
        "Sammenligning + numerisk kontrast (antitese): effekten er, at styrke fremstår som MATEMATIK, ikke følelse : tallet overtaler, uden at forfatteren behøver at råbe.",
        "Hyperbel, fordi 11.000 er en urimelig forstørrelse af virkeligheden.",
        "Personifikation, fordi medlemmerne omtales som væsener, der kan blive 'overset'.",
        "Understatement, fordi teksten undlader at nævne strejkeret og blokader.",
      ],
      correctIndex: 0,
      feedback:
        "Rigtigt : 1 vs. 11.000 i spejlvendte sætningsled. Pointen er 'tallet som argument' : forfatteren lader statistikken om 'overset/ikke overset' gøre arbejdet. Tallet er foreningens oplyste medlemsantal, ikke en forstørrelse (ingen hyperbel).",
      examTip:
        "Til eksamen: Effekten af 'tallenes retorik' : forklar HVORFOR et tal virker mere objektivt end et adjektiv ('meget mange'). Det er den slags refleksion, der løfter karakteren i analysen.",
    },
    {
      id: "g6-6",
      kind: "wordclass",
      label: "Ordklasser",
      category: "ordklasser",
      prompt: "Hvilken ordklasse tilhører hvert af de fem ord? Klik på ordet og vælg ordklasse.",
      hint:
        "Sådan gør du: 'forhandler' ser ud som et navneord-led (en forhandler = en person/butik!), men kig på pladsen i sætningen 'vi forhandler'. 'tyk' kan føjes 'meget' foran.",
      words: [
        { word: "forhandler", correct: "verbum" },
        { word: "tyk", correct: "adjektiv" },
        { word: "uden", correct: "præposition" },
        { word: "og", correct: "konjunktion" },
        { word: "styrke", correct: "substantiv" },
      ],
      feedback:
        "'forhandler' : verbum her (vi forhandler = handling; HUSK det OGSÅ kan være et navneord 'en forhandler'). 'tyk' : adjektiv (meget tyk, bøjes: tykt/tykke). 'uden' : præposition ('uden et gyldigt kort'). 'og' : konjunktion (bindeord mellem led/sætninger). 'styrke' : substantiv (en styrke, vores styrke). Fælden : 'styrke' KAN også være verbum ('at styrke') : i teksten står det efter 'vores', altså navneord.",
      examTip:
        "Til eksamen: At læse 'forhandler' som navneord er opgavens fælde : vis at du ser konteksten (efter 'vi' = bøjet verbum). Mange ord har flere mulige ordklasser : det er sætningen, der vælger.",
    },
    {
      id: "g6-7",
      kind: "analysis",
      label: "Syntaks · led",
      category: "saetningsled",
      prompt: "Analyser sætningen fra 2. afsnit: Klik på hvert led-kort og vælg det rigtige symbol.",
      sentence: "Vi sender medlemmerne det nye forhandlingskatalog bagefter.",
      chunks: ["Vi", "sender", "medlemmerne", "det nye forhandlingskatalog", "bagefter"],
      correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
      hint:
        "Sådan gør du: 'sender HVEM noget?' (modtager = indirekte objekt, 'dativ'-formen) og 'sender HVAD?' (direkte objekt). 'bagefter' bøjes ikke og kan flyttes : adverbial.",
      feedback:
        "Rigtigt: Vi = subjekt, sender = verballed, medlemmerne = indirekte objekt (til hvem?), det nye forhandlingskatalog = direkte objekt (hvad?), bagefter = adverbial. Husk : ditransitive verber som 'sende' har TO objekter ; det uden præposition er det indirekte objekt (det led, der svarer på 'til hvem?').",
      examTip:
        "Til eksamen: To-objekt-testen: byt om på rækkefølgen med 'til': 'sender kataloget TIL medlemmerne'. Kan begge, og det ene kan stå uden 'til', er det det indirekte objekt (dativ). Navngiv gerne med begge betegnelser : 'indirekte objekt (dativ)'. For fulldækning.",
    },
    {
      id: "g6-8",
      kind: "multi",
      label: "Indhold",
      category: "kommunikation",
      prompt: "Klik på ALLE de tre ting, foreningen kæmper for DENNE gang.",
      hint:
        "Sådan gør du: 2. afsnit nævner punkterne i opremsning. Vær opmærksom på alternativer, der nævner andre elementer fra TEKSTEN (som medlemskortet fra 3. afsnit) : de er IKKE en del af kampen denne gang.",
      options: [
        "Et ekstra tillæg til dig, der møder ind før butikkens åbning.",
        "Lønforhøjelse til alle medlemmer, uanset anciennitet.",
        "En skærpet regel om planlagte vagter.",
        "Et gratis medlemskab for alle under 18 år.",
        "En fritvalgskonto til alle fuldtidsansatte.",
      ],
      correctIndexes: [0, 2, 4],
      feedback:
        "Rigtigt: Tillæg for morgenmøder, skærpet vagt-regel og fritvalgskonto (ordret fra 2. afsnit). Lønforhøjelse generelt og 'gratis under 18' er næsten-rigtige fælder : de ligner sagens elementer (der ER tale om løn, og der ER tale om medlemskab), men står ikke i opremsningen.",
      examTip:
        "Til eksamen: Find-alle-opgaver afgøres af nærlæsning af OPTELLINGEN. Streg de tre punkter over i teksten, før du klikker : så bider du ikke på 'næsten-rigtige' muligheder.",
    },
    {
      id: "g6-9",
      kind: "choice",
      label: "Tone og fællesskabssprog",
      category: "pragmatik",
      prompt: "Teksten veksler mellem 'vi', 'os', 'du' og 'din'. Hvad gør den sproglige ramme ved læseren?",
      hint:
        "Sådan gør du: Kort: hvem er 'vi'? hvem er 'du'? Hvem er IKKE med i 'vi'? Pronominernes FORDELING skaber alliancer (inkluderings-strategi).",
      options: [
        "Den skaber distance, fordi medlemmerne bliver reduceret til tal i et regneark.",
        "Den er neutral og udelukkende praktisk : pronominer har ingen retorisk funktion i fagforeninger.",
        "Den skaber FÆLLESSKAB og gør sagen personlig : 'vi/os' er foreningen + medlemmer som ét hold over for 'arbejdsgiverne' (den usynlige modstander), mens 'du/din' gør sagen konkret for den enkelte : kombinationen af kollektiv styrke og individuel gevinst.",
        "Den skaber forvirring, fordi læseren ikke kan vide, hvem 'vi' er.",
      ],
      correctIndex: 2,
      feedback:
        "Rigtigt : Inkluderingsstrategien 'os-mod-dem' + den directe tiltale. 'Vi' er bevidst flydende (foreningen OG medlemmerne = samme hold), og det ER formålet med tonen. Forvirring? Nej : 'vores styrke er fællesskabet' definerer 'vi' eksplicit.",
      examTip:
        "Til eksamen: Pronominer er analyse-guld: kortlæg dem (vi=os+modtager? de=hvem?). Husk at 'arbejdsgiverne' er tekstens fraværende tredjepart : modstanderen optræder kun som genstandsled, ikke som tiltalt.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Samling + rotation. Eleven skal aldrig have det samme sæt to gange i
// træk ; når ALLE sæt er prøvet, blandes puljen igen (og det får eleven at
// vide, forklaringen står på prøveskærmen).
// ---------------------------------------------------------------------------
export const HHX_EXAM_SATS: ExamSatsT[] = [
  HHX_EXAM_SAT,
  SAT_2_GROENT_SKIFTE,
  SAT_3_ADVERTORIAL,
  SAT_4_LESERBREV,
  SAT_5_ELEVBLAD_Ai,
  SAT_6_FAGBLAD,
];

/**
 * Vælg næste prøve-sæt ud fra hvilke, eleven allerede har prøvet.
 * - Ubetydelige sæt først: et tilfældigt ubenyttet sæt.
 * - Alle prøvet: et tilfældigt sæt, der er ANDET end sidst brugte
 *   (så man aldrig får det samme to gange i træk) ; `allUsed` fortæller
 *   UI'en, at den skal forklare, hvorfor gentagelser nu kan forekomme.
 */
export function pickNextExamSats(
  usedIds: string[],
  lastSatsId: string | null
): { sats: ExamSatsT; allUsed: boolean } {
  const pool = HHX_EXAM_SATS;
  const fresh = pool.filter((s) => !usedIds.includes(s.id));
  if (fresh.length > 0) {
    return { sats: fresh[Math.floor(Math.random() * fresh.length)], allUsed: false };
  }
  let candidates = pool.filter((s) => s.id !== lastSatsId);
  if (candidates.length === 0) candidates = pool;
  return { sats: candidates[Math.floor(Math.random() * candidates.length)], allUsed: true };
}
