import type { ExamSatsT, ExamWordClassTag } from "../../types";

// ---------------------------------------------------------------------------
// HHX EKSAMENSSÆT (kun HHX-siden!). Simulering af den virkelige AP-eksamen,
// som den afvikles på Risskov:
//
//   Eleven trækker en UKENDT tekst med SYV opgaver og har 40 minutters
//   skriftlig forberedelse (forberedelseslokale, tilsynsførende, egne noter,
//   bøger og ordbog). Til selve eksamen (12-15 min) besvares de syv opgaver
//   MUNDTLIGT for lærer og censor.
//
// Hver opgave har SIN EGEN svarform, præcis som på skolens ark:
//   1) genre      : vælg blandt de fem genrer + begrund med tekstbelæg
//   2) pentagram  : seks små felter (afsender, emne, modtager, situation,
//                   genre/sprog + formålet i midten)
//   3) særtræk    : ét observationsfelt (med citater fra teksten)
//   4) morfologi  : fire ord : del i morfemer + træk ét bestemt morfem ud
//   5) syntaks    : led-symboler på sætningens klumper
//   6) verbaltid  : to sætninger : vælg tid + omskriv til en anden tid
//   7) hoved/led  : del sætningen op + indleder + ledfunktion
//
// Det, der kan rettes entydigt (genre, morfemer, led, tider, omskrivninger,
// indleder og ledfunktion), giver karakteren. De åbne felter (begrundelse,
// pentagram og særtræk) rettes ALDRIG automatisk : de kopieres med over til
// AI-feedback, fordi der er mange rigtige svar netop dér.
//
// De syv opgaver følger skolens eget ark, i den rækkefølge:
//   1) genretræk  2) kommunikationssituation (Ciceros pentagram)
//   3) sproglige særtræk  4) morfologisk analyse  5) syntaktisk analyse
//   6) verballedets tid  7) hoved- og ledsætninger
//
// Indholdsstyreregler (vigtige!):
// 1. HINT må KUN forklare metoden (trin for trin) - aldrig hvad svaret er.
// 2. AP-læreren har meldt, at opgave 2 og 3 har MANGE rigtige svar og er
//    individuelle fra tekst til tekst. De er derfor mærket `openEnded` og
//    rettes aldrig som rigtigt/forkert. Til gengæld vægter opgave 4-7
//    (morfologi, syntaks, verbaltid, hoved-/ledsætninger) tungest i
//    karakteren : det er dem, eleverne har sværest ved.
// 3. Svarmuligheder må ALDRIG indeholde begrundelsen ('Nyhedsartikel fordi
//    ...'). Genrelisten er bare de fem genrer ; begrundelsen skriver eleven
//    selv i feltet nedenunder.
// 3. Led-delene bruger de latinske betegnelser som primære (subjekt,
//    verballed, direkte/indirekte objekt) med de danske som hjælp.
// 4. Alle tekster er DIGTEDE fra bunden: fiktive medier, fiktive personer,
//    fiktive tal. Ingen ophavsret, ingen kopiering fra virkelige aviser.
// ---------------------------------------------------------------------------


import type { ExamClauseFnId, ExamFieldT, ExamGenreId, ExamTenseId } from "../../types";

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

// ---------------------------------------------------------------------------
// Faste valglister. De er de samme ved hver tekst, præcis som på skolens ark:
// man kan komme op i alle fem genrer, og tiderne/ledfunktionerne er de samme.
// ---------------------------------------------------------------------------
export const EXAM_GENRES: { id: ExamGenreId; label: string }[] = [
  { id: "politisk-tale", label: "Politisk tale" },
  { id: "ejendomsannonce", label: "Ejendomsannonce" },
  { id: "opinionsartikel", label: "Opinionsartikel" },
  { id: "informerende-artikel", label: "Informerende artikel" },
  { id: "reklame", label: "Reklame" },
];

export function genreLabel(id: ExamGenreId): string {
  return EXAM_GENRES.find((g) => g.id === id)?.label ?? id;
}

/** Tiderne som knapper (dansk), med det latinske navn til gennemgangen. */
export const EXAM_TENSES: { id: ExamTenseId; label: string; latin: string }[] = [
  { id: "praesens", label: "Nutid", latin: "præsens" },
  { id: "praeteritum", label: "Datid", latin: "præteritum" },
  { id: "perfektum", label: "Førnutid", latin: "perfektum" },
  { id: "pluskvamperfektum", label: "Førdatid", latin: "pluskvamperfektum" },
  { id: "futurum", label: "Fremtid", latin: "futurum" },
];

export function tenseLabel(id: ExamTenseId): string {
  const t = EXAM_TENSES.find((x) => x.id === id);
  return t ? `${t.latin} (${t.label.toLowerCase()})` : id;
}

export function tenseLatin(id: ExamTenseId): string {
  return EXAM_TENSES.find((x) => x.id === id)?.latin ?? id;
}

/** Ledsætningens funktion i hovedsætningen. */
export const EXAM_CLAUSE_FUNCTIONS: { id: ExamClauseFnId; label: string }[] = [
  { id: "subjekt", label: "Subjekt" },
  { id: "objekt", label: "Objekt" },
  { id: "adverbial", label: "Adverbial" },
  { id: "subjektspraedikat", label: "Subjektsprædikat" },
  { id: "attribut", label: "Attribut" },
];

export function clauseFnLabel(id: ExamClauseFnId): string {
  return EXAM_CLAUSE_FUNCTIONS.find((f) => f.id === id)?.label ?? id;
}

// ---------------------------------------------------------------------------
// Metode-hints ('?'-knappen) og råd til den mundtlige eksamen. Metoden er den
// samme uanset tekst, så de ligger her ét sted.
// ---------------------------------------------------------------------------
const METHOD = {
  genre:
    "Sådan gør du: Placer først teksten i en overordnet kategori (sagprosa eller skønlitteratur), og find derefter formålet: vil teksten informere neutralt, argumentere for en holdning eller sælge/vinde tilslutning? Hold det op mod de genrer, du kan komme op i: politisk tale, ejendomsannonce, opinionsartikel (kommentar, leder, anmeldelse, læserbrev, kronik), informerende artikel og reklame. Husk hybridformer (faktion, genrehybrid). Slut altid med at pege på de genretræk i teksten, der beviser dit valg: byline, opbygning, tiltale og virkemidler.",
  kommunikation:
    "Sådan gør du: Gå Ciceros pentagram igennem ét punkt ad gangen: afsender (hvem taler, med hvilken baggrund og interesse?), emne (hvad handler teksten om?), modtager (hvem er målgruppen, og hvordan kan du se det i sproget?), situation (hvor, hvornår og hvorfor netop nu?) og genre/sprog (hvilken form er valgt?). I midten står formålet: hvad vil afsenderen opnå (informere, overbevise, underholde, sælge)? Pas på fælden: en person, der CITERES i teksten, er ikke tekstens afsender.",
  saertraek:
    "Sådan gør du: Arbejd i lag, og tag ét citat med som dokumentation for hvert træk. 1) Hvilke ordklasser dominerer (mange adjektiver? pronominer i 1. person?). 2) Hvilke semantiske felter hører ordene til? 3) Er ordene konkrete eller abstrakte? 4) Hvilke konnotationer har de (positive, negative, ironiske, eufemismer), og hvilket stilleje giver det? 5) Hvordan er sætningerne bygget: paratakse eller hypotakse, forvægt eller bagvægt, omvendt ordstilling, retoriske spørgsmål? Sig til sidst, hvad hvert træk GØR ved læseren.",
  morfologi:
    "Sådan gør du: Del ordet i morfemer, altså de mindste dele, der har betydning. Find først rodmorfemet (grundbetydningen, som ofte kan stå alene). Se derefter efter præfiks (forstavelse, fx gen-, u-), suffiks (afledningsendelse, som ofte ændrer ordklasse, fx -hed, -lig, -ning), fleksiv (bøjningsendelse for tid, tal eller bestemthed, fx -er, -ede, -en) og bindebogstav i sammensatte ord (stol-e-ben). Ved sammensatte ord: del først i rodmorfemer, og tag derefter for- og endelser.",
  syntaks:
    "Sådan gør du: Følg analysepilen. 1) Find verballeddet (det bøjede verbum). 2) Spørg hvem/hvad + verbet, og find subjektet. 3) Spørg hvem/hvad + verbet + subjektet, og find det direkte objekt. 4) Er der et indirekte objekt (til/for hvem?)? Det kræver altid et direkte objekt. 5) Resten er typisk adverbialer (tid, sted, måde, årsag). 6) Er verbet kopulativt (være, blive, hedde, synes), står der et subjektsprædikat i stedet for et direkte objekt : de to kan ikke stå i samme sætning. Husk, at en præpositionsgruppe hører med til det led, den beskriver.",
  verbaltid:
    "Sådan gør du: Find verballeddet, og bestem tiden: præsens (nutid: læser), præteritum (datid: læste), perfektum (førnutid: har læst), pluskvamperfektum (førdatid: havde læst) eller futurum (fremtid: vil læse). Omskriv derefter sætningen til de andre tider, og hold øje med, at det er HJÆLPEVERBET, der skifter i de sammensatte tider, ikke kun endelsen. Sig til sidst, hvad tiden gør i teksten: præsens skaber nærhed, præteritum fortæller på afstand.",
  hovedled:
    "Sådan gør du: Brug ikke-reglen, for den er den sikreste test. Sæt ikke ind i sætningen: kommer ikke EFTER verballeddet, er det en hovedsætning (den kan stå alene). Kommer ikke MELLEM subjekt og verballed, er det en ledsætning (den kan ikke stå alene). Kig også efter indledere: at, fordi, hvis, når, da (hypotaktiske konjunktioner) og som, der (relative pronominer). Slut med at sige, hvilket led ledsætningen er i hovedsætningen: subjekt, objekt, adverbial, subjektsprædikat eller attribut.",
} as const;

const ADVICE = {
  genre:
    "Til eksamen: Sig genren i din første sætning, og læg straks to eller tre genretræk fra teksten ovenpå (byline, formål, opbygning, sprog). Genre uden belæg tæller kun halvt, og censor spørger altid videre: hvorfor ikke den nærliggende nabogenre? Har du et svar på det, er opgaven i hus.",
  kommunikation:
    "Til eksamen: Tegn pentagrammet på dit notepapir, og sæt et kort citat ved hvert hjørne, så du ikke går i stå. Nævn formålet til sidst som konklusion, ikke som det første. Og hold afsender og citerede kilder adskilt : det er en af de fejl, censor hurtigst hører.",
  saertraek:
    "Til eksamen: Vælg TRE træk, du kan dokumentere, frem for otte du kun kan nævne. Sig trækket, citer eksemplet, forklar virkningen. Her er der mange rigtige svar, så det er dokumentationen og fagsproget (konnotation, semantisk felt, paratakse, stilleje), der giver point.",
  morfologi:
    "Til eksamen: Skriv opdelingen på notepapiret med bindestreger og sæt navn under hver del (rodmorfem, præfiks, suffiks, fleksiv). Så kan du læse den op uden at rode dig ud i det. Husk at sige, hvad delen GØR: suffikset -hed gør adjektivet til et substantiv.",
  syntaks:
    "Til eksamen: Læs sætningen op, og analyser i den rigtige rækkefølge: verballed, subjekt, objekter, adverbialer. Brug de latinske betegnelser som de primære (subjekt, verballed, direkte og indirekte objekt), og nævn de danske i parentes, hvis du vil. Tegn gerne symbolerne på notepapiret, så du kan pege undervejs.",
  verbaltid:
    "Til eksamen: Sig tiden med både det latinske navn og det danske (præteritum/datid), og lav omskrivningerne HØJT, mens du peger på hjælpeverbet. Censor lytter efter, om du kan forklare forskellen mellem perfektum og præteritum, ikke kun ramme den.",
  hovedled:
    "Til eksamen: Lav ikke-testen højt: det viser metoden, og du kan ikke huske forkert. Slut altid med at sige, hvilket LED ledsætningen er i hovedsætningen : det er den del, de fleste glemmer, og den, der løfter svaret.",
} as const;

const PENTAGRAM_FIELDS: ExamFieldT[] = [
  { id: "afsender", label: "Afsender", help: "(Hvem taler/skriver, og med hvilken baggrund?)", placeholder: "Skriv kort her...", rows: 2 },
  { id: "emne", label: "Emne (indhold)", help: "(Hvad handler kommunikationen om?)", placeholder: "Skriv kort her...", rows: 2 },
  { id: "modtager", label: "Modtager", help: "(Hvem er målgruppen?)", placeholder: "Skriv kort her...", rows: 2 },
  { id: "situation", label: "Situation (omstændigheder)", help: "(Hvor, hvornår og hvorfor?)", placeholder: "Skriv kort her...", rows: 2 },
  { id: "genresprog", label: "Genre/Sprog", help: "(Hvilken form vælges, og hvordan lyder sproget?)", placeholder: "Skriv kort her...", rows: 2 },
  { id: "formaal", label: "Formål (midten af pentagrammet)", help: "(Hvad vil afsenderen opnå: informere, overbevise, sælge?)", placeholder: "Skriv kort her...", rows: 2 },
];

const SAERTRAEK_FIELDS: ExamFieldT[] = [
  {
    id: "observationer",
    label: "Dine observationer",
    help: "(husk citater fra teksten)",
    placeholder: "Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ...",
    rows: 6,
  },
];

// Fælles informations-side for alle sæt: den følger skolens eget eksamensark.
const SAT_INTRO: ExamSatsT["intro"] = {
  heading: "Sådan er eksamensprøven",
  lead:
    "Prøven er bygget som den rigtige AP-eksamen på HHX: Du trækker en ukendt tekst med syv opgaver og har 40 minutter til forberedelsen. Til selve eksamen besvarer du de syv opgaver mundtligt for din lærer og en censor ; her i appen skriver og markerer du svarene, præcis som på notepapiret, du må tage med ind.",
  steps: [
    "Læs teksten grundigt først ; brug tuschfarverne til at markere genretræk, ordvalg og de sætninger, du vil bruge i din analyse.",
    "Gå opgaverne igennem én ad gangen. Hver opgave har sin egen svarform: genren vælges på en liste, pentagrammet skrives i seks små felter, morfemerne deles med bindestreger, leddene får symboler, tiderne vælges og omskrives, og til sidst deles sætningen i hoved- og ledsætning.",
    "Er du i tvivl om, hvad en opgave kræver? Tryk på '?'-knappen ved opgaven : der får du metoden trin for trin, aldrig facit.",
    "Det, der kan rettes entydigt (genre, morfemer, led, tider, omskrivninger, indleder og ledfunktion), retter appen, og det er dét, karakteren bygger på.",
    "Pentagrammet, dine sproglige observationer og dine begrundelser rettes ikke automatisk : der er mange rigtige svar. De kommer med, når du kopierer besvarelsen over til en AI bagefter.",
    "Til sidst trykker du 'Indsend'. Går tiden fra dig, lyder klokken, og du bedes aflevere med det samme, ligesom i forberedelseslokalet.",
  ],
  examIn: [
    {
      title: "Genre og kommunikation",
      body: "Opgave 1-2: genretræk i teksten, og kommunikationssituationen med Ciceros pentagram (afsender, emne, modtager, situation, sprog + formålet i midten).",
    },
    {
      title: "Sproglige særtræk",
      body: "Opgave 3: ordklasser, semantiske felter, konkrete og abstrakte ord, konnotationer, stilleje og sætningskonstruktion (paratakse, hypotakse, retoriske spørgsmål).",
    },
    {
      title: "Grammatikken : den tunge del",
      body: "Opgave 4-7: morfologisk analyse, syntaktisk analyse med led-symbolerne, verballedets tid (og omskrivningen) samt hoved- og ledsætninger med ikke-reglen.",
    },
  ],
  closingNote:
    "Husk: prøven er et forberedelsesværktøj. Karakteren er vejledende, og du kan ikke 'ødelægge' noget ved at prøve kræfter med den.",
};

// Sæt 1. Kronik/opinionsartikel med erhvervsvinkel.
export const HHX_EXAM_SAT: ExamSatsT = {
  id: "hhx-sats-01",
  title: "Eksamenssæt 1 · Da kassen blev en skærm",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
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
    ]
  },
  tasks: [
    {
      id: "eks-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "opinionsartikel",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa (ikke-fiktion).",
        "Bestemmer genren som opinionsartikel : en kronik eller et debatindlæg.",
        "Begrunder med afsenderen: navngiven erhvervsredaktør, der skriver subjektivt.",
        "Peger på argumentationen, modargumenterne og det retoriske spørgsmål til sidst.",
      ],
      modelAnswer: "Teksten er sagprosa og hører til opinionsgenrerne: det er en kronik (opinionsartikel) i erhvervsavisen Handels Nyt. Afsenderen er navngiven med stilling (erhvervsredaktør Emil Holm), han bruger 'vi' og tager tydeligt stilling, han fremlægger påstande med belæg (køtiden, omsætningen) og inddrager modargumenter, før han vender dem. Teksten slutter med et retorisk spørgsmål ('hvad den bruger os til'), som netop skal få læseren til at tænke videre. Formålet er at overbevise, ikke kun at informere.",
      feedback: "Det afgørende er at skelne informerende fra argumenterende sagprosa. De første afsnit LIGNER et nyhedsreferat (en begivenhed, citater, tal), men fra 'Men prisen for hastigheden er ikke til at overse' tager teksten stilling, og der er ingen neutral balance mellem parterne. Svarer du kun 'en artikel' eller 'en avistekst', mangler du formålet, og så mangler halvdelen af opgaven.",
      examTip: ADVICE.genre,
    },
    {
      id: "eks-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "afsender",
            label: "Afsender",
            help: "(Hvem taler/skriver, og med hvilken baggrund?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "emne",
            label: "Emne (indhold)",
            help: "(Hvad handler kommunikationen om?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "modtager",
            label: "Modtager",
            help: "(Hvem er målgruppen?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "situation",
            label: "Situation (omstændigheder)",
            help: "(Hvor, hvornår og hvorfor?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "genresprog",
            label: "Genre/Sprog",
            help: "(Hvilken form vælges, og hvordan lyder sproget?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "formaal",
            label: "Formål (midten af pentagrammet)",
            help: "(Hvad vil afsenderen opnå: informere, overbevise, sælge?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
        ],
      },
      points: [
        "Afsender: erhvervsredaktør Emil Holm i Handels Nyt : en fagligt bevidst journaliststemme, ikke butikkens.",
        "Emne: selvscanning i detailhandlen og prisen for hastigheden.",
        "Modtager: avisens læsere med interesse for handel, altså både erhvervsfolk og kunder.",
        "Situation: aktuel anledning (butikken fjernede kassebåndet i morges) + debatten om teknologi i butikkerne.",
        "Formål: at få læseren til at sætte spørgsmålstegn ved, hvad teknologien koster menneskeligt.",
      ],
      modelAnswer: "Afsenderen er erhvervsredaktør Emil Holm, som skriver i erhvervsavisen Handels Nyt : han har fagligt overblik og en holdning, men ingen økonomisk interesse i butikken. Emnet er selvbetjening i supermarkedet og de menneskelige omkostninger. Modtagerne er avisens læsere: erhvervsfolk og forbrugere, hvilket man kan se på fagordene (omsætning, myldretid) og på, at teksten forudsætter interesse for detailhandel. Situationen er helt aktuel: kassebåndet forsvandt 'i morges', og stamkunderne diskuterer det på de sociale medier. Genren er en kronik, og sproget er letforståeligt, men holdningspræget. I midten af pentagrammet står formålet: at overbevise læseren om, at vi skal tænke over prisen for hastigheden.",
      feedback: "Her er mange rigtige svar, men to fælder koster point hver gang. 1) Afdelingsleder Sara Westergaard er en CITERET kilde, ikke tekstens afsender. 2) Formålet skal formuleres som en hensigt ('afsenderen vil have læseren til at ...'), ikke som et emne. Bind altid hvert punkt til et kort citat, så bliver redegørelsen dokumenteret i stedet for gættet.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "eks-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "observationer",
            label: "Dine observationer",
            help: "(husk citater fra teksten)",
            placeholder: "Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ...",
            rows: 6,
          },
        ],
      },
      points: [
        "Nævner mindst tre træk med citat fra teksten.",
        "Bruger fagbegreberne: konnotation, semantisk felt, konkret/abstrakt, paratakse/hypotakse, stilleje.",
        "Peger på det retoriske spørgsmål og billedsproget ('en regning, som ingen kan betale med kort').",
        "Forklarer virkningen: hvad trækket gør ved læseren, ikke kun hvad det heder.",
      ],
      modelAnswer: "Teksten blander to semantiske felter: butikkens økonomiske sprog (kassebånd, omsætning, myldretid, regning, kort) og et menneskeligt felt (ensomme, mennesker, samtaler, trygt). Kontrasten er hele pointen, og den samles i billedsproget 'en regning, som ingen kan betale med kort', hvor det konkrete ord 'regning' bruges abstrakt om en menneskelig omkostning. Ordvalget er styret af konnotationer: 'tidens naturlige udvikling' lyder positivt og uundgåeligt (ledelsens ord), mens 'en butik uden mennesker' er negativt ladet (kundernes ord). Sætningerne er overvejende parataktiske og korte i referat-delen, men slutningen bruger et retorisk spørgsmål ('Spørgsmålet er, hvad den bruger os til') som appellerer direkte til læseren. Stillejet er neutralt til let højt: skrevet sagligt, men med tydelig holdning.",
      feedback: "Denne opgave er meget individuel : hvad der er værd at kommentere, skifter fra tekst til tekst, og der er mange rigtige svar. Derfor tæller metoden mere end mængden: nævn trækket, citer eksemplet, forklar virkningen. Tre dokumenterede træk er bedre end otte, du kun kan nævne. I netop denne tekst er de lettest at dokumentere i ordvalget (konnotationerne i 'tidens naturlige udvikling' over for 'en butik uden mennesker'), i billedsproget og i det retoriske spørgsmål til sidst.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "eks-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "uundgåelig",
            split: "u-undgå-elig",
            splitAccepts: ["u-und-gå-elig"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Præfikset (forstavelsen)",
              placeholder: "Skriv morfemet her",
              answer: "u-",
            },
            explain: "u- (præfiks) + undgå (rodmorfem) + -elig (suffiks, der gør verbet til et adjektiv).",
          },
          {
            word: "omsætningen",
            split: "omsæt-ning-en",
            splitAccepts: ["om-sæt-ning-en", "om-sætning-en", "omsætning-en"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-en",
            },
            explain: "omsæt (rodmorfem) + -ning (suffiks, der laver verbet om til et substantiv) + -en (fleksiv, bestemt form ental).",
          },
          {
            word: "betalingskort",
            split: "betal-ing-s-kort",
            splitAccepts: ["betaling-s-kort"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bindebogstavet",
              placeholder: "Skriv morfemet her",
              answer: "-s-",
              accepts: ["s", "-s"],
            },
            explain: "betal (rodmorfem) + -ing (suffiks) + -s- (bindebogstav) + kort (rodmorfem). Ordet er både afledt og sammensat, og der er ingen bøjningsendelse.",
          },
          {
            word: "pensionister",
            split: "pension-ist-er",
            splitAccepts: ["pensionist-er"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-er",
            },
            explain: "pension (rodmorfem) + -ist (suffiks om en person) + -er (fleksiv, ubestemt flertal).",
          },
        ],
      },
      points: [
        "Deler 'uundgåelig' i u- (præfiks) + undgå (rodmorfem) + -elig (suffiks).",
        "Deler 'omsætningen' i omsæt (rodmorfem) + -ning (suffiks) + -en (fleksiv).",
        "Bruger de rigtige navne: rodmorfem, præfiks, suffiks, fleksiv.",
        "Forklarer hvad delene GØR: -elig og -ning skifter ordklasse, -en er bestemt form.",
      ],
      modelAnswer: "'uundgåelig' = u- + undgå + -elig. u- er et præfiks, der nægter betydningen ; undgå er rodmorfemet og kan stå alene som verbum ; -elig er et suffiks, der gør verbet til et adjektiv. 'omsætningen' = omsæt + -ning + -en. omsæt er rodmorfemet (verbet omsætte), -ning er et suffiks, der laver verbet om til et substantiv, og -en er en fleksiv (bøjningsendelse for bestemt form ental). Læg mærke til rækkefølgen: afledningen kommer før bøjningen.",
      feedback: "Den klassiske fejl er at kalde alt, der sidder bagerst, for en 'endelse'. Skil de to slags: en AFLEDNING (suffiks) ændrer ordklasse eller betydning og hører til ordets opbygning (-ning, -elig, -hed, -lig), mens en BØJNING (fleksiv) kun viser tal, bestemthed eller tid (-en, -er, -ede). Og husk bindebogstavet i sammensatte ord: betaling-s-kort.",
      examTip: ADVICE.morfologi,
    },
    {
      id: "eks-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "Butikken sender kunderne en påmindelse om ugens tilbud hver fredag.",
        chunks: ["Butikken", "sender", "kunderne", "en påmindelse om ugens tilbud", "hver fredag"],
        correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
        explain: "Fuldt rigtige led: Butikken = subjekt (hvem sender?), sender = verballed, kunderne = indirekte objekt (til hvem?), 'en påmindelse om ugens tilbud' = direkte objekt, 'hver fredag' = adverbial (tid). Den hyppigste fejl her: at splitte 'en påmindelse' og 'om ugens tilbud' op i to led ; 'om ugens tilbud' beskriver 'påmindelse' og hører derfor til i det samme led.",
      },
      points: [
        "Verballed: sender.",
        "Subjekt: Butikken.",
        "Indirekte objekt: kunderne (til hvem?).",
        "Direkte objekt: en påmindelse om ugens tilbud (hele gruppen).",
        "Adverbial: hver fredag (tid).",
      ],
      modelAnswer: "Verballeddet er 'sender'. Subjektet er 'Butikken' (hvem sender?). Det direkte objekt er 'en påmindelse om ugens tilbud' (hvad sender den?), og præpositionsgruppen 'om ugens tilbud' hører med til objektet, fordi den beskriver påmindelsen. Det indirekte objekt er 'kunderne' (til hvem?), og det kan kun stå der, fordi der også er et direkte objekt. 'hver fredag' er et adverbial, der svarer på hvornår.",
      feedback: "Den hyppigste fejl i netop denne sætning er at splitte 'en påmindelse' og 'om ugens tilbud' i to led. Testen er, om delen kan flyttes alene : det kan den ikke, for den beskriver påmindelsen. Den næsthyppigste fejl er at bytte de to objekter om: spørg 'hvad sender den?' (direkte objekt) og 'til hvem?' (indirekte objekt), i den rækkefølge.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "eks-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "I morges fjernede supermarkedet ved Åboulevarden sit sidste kassebånd.",
            verb: "fjernede",
            correct: "praeteritum",
            rewriteTo: "perfektum",
            rewriteAnswer: "I morges har supermarkedet ved Åboulevarden fjernet sit sidste kassebånd.",
            rewriteKeys: ["har", "fjernet"],
            explain: "'fjernede' er præteritum (datid): ét ord bøjet med -ede. I perfektum bliver det til hjælpeverbet 'har' + participiet 'fjernet'.",
          },
          {
            id: "t2",
            sentence: "Køtiden er faldet fra ni til to minutter.",
            verb: "er faldet",
            correct: "perfektum",
            rewriteTo: "pluskvamperfektum",
            rewriteAnswer: "Køtiden var faldet fra ni til to minutter.",
            rewriteKeys: ["var", "faldet"],
            explain: "'er faldet' er perfektum (førnutid). I pluskvamperfektum bøjes HJÆLPEVERBET i datid: er bliver til var, mens 'faldet' står uændret.",
          },
        ],
      },
      points: [
        "Bestemmer tiden som præteritum (datid).",
        "Præsens: fjerner. Perfektum: har fjernet. Pluskvamperfektum: havde fjernet.",
        "Nævner, at hjælpeverbet (har/havde) bøjes i de sammensatte tider.",
        "Siger hvad tiden gør i teksten: datiden fortæller om en begivenhed, der er sket.",
      ],
      modelAnswer: "Verballeddet 'fjernede' står i præteritum (datid). Omskrevet: præsens 'I morges fjerner supermarkedet ...' (nutid, giver nærhed), perfektum 'I morges har supermarkedet fjernet ...' (førnutid: handlingen er sket, men rækker ind i nuet), pluskvamperfektum 'I morges havde supermarkedet fjernet ...' (førdatid: sket før et andet tidspunkt i fortiden) og futurum 'I morgen vil supermarkedet fjerne ...'. I teksten skifter tiderne bevidst: referatet står i datid og perfektum, mens holdningsdelen står i præsens ('Udviklingen er måske uundgåelig'), fordi den gælder nu.",
      feedback: "Det er ikke nok at ramme tiden : du skal kunne omskrive. Læg mærke til, at det i perfektum og pluskvamperfektum er HJÆLPEVERBET, der bøjes (har → havde), mens hovedverbet står i participium (fjernet). Og bemærk, at nogle verber tager 'er' i stedet for 'har': køtiden ER faldet.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "eks-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Hvis vi fjerner de samtaler, får teknologien en regning, som ingen kan betale med kort.",
        parts: [
          { text: "Hvis vi fjerner de samtaler,", type: "led" },
          { text: "får teknologien en regning,", type: "hoved" },
          { text: "som ingen kan betale med kort.", type: "led" },
        ],
        indleder: "hvis",
        funktion: "adverbial",
        explain: "'Hvis vi fjerner de samtaler' er en ledsætning (ikke står mellem subjekt og verballed: 'hvis vi IKKE fjerner'), den indledes af konjunktionen 'hvis' og er adverbial (betingelse) i hovedsætningen 'får teknologien en regning'. Den sidste del er også en ledsætning : en relativsætning med 'som', der beskriver 'regning'.",
      },
      points: [
        "Finder en hovedsætning, der kan stå alene, fx 'Ledelsen kalder det tidens naturlige udvikling'.",
        "Finder en ledsætning, fx 'Hvis vi fjerner de samtaler' eller 'at alt bliver betalt'.",
        "Bruger ikke-reglen korrekt: efter verballeddet = hovedsætning, mellem subjekt og verballed = ledsætning.",
        "Siger hvilket led ledsætningen er (adverbial, objekt, subjekt, attribut).",
      ],
      modelAnswer: "Hovedsætning: 'Ledelsen kalder det tidens naturlige udvikling'. Ikke-testen: 'Ledelsen kalder det IKKE ...' : 'ikke' står efter verballeddet, og sætningen kan stå alene. Ledsætning: 'Hvis vi fjerner de samtaler' (5. afsnit). Ikke-testen: 'Hvis vi IKKE fjerner de samtaler' : 'ikke' står mellem subjekt ('vi') og verballed ('fjerner'), og sætningen kan ikke stå alene. Den indledes af den hypotaktiske konjunktion 'hvis' og fungerer som et adverbial (betingelse) i hovedsætningen 'får teknologien en regning ...'. En anden mulighed er 'at alt bliver betalt' (1. afsnit), som er en at-ledsætning i objektsposition efter 'holder øje med'.",
      feedback: "Svarer du kun 'det er en ledsætning', mangler du den halve opgave: sig ALTID hvilket led ledsætningen er i hovedsætningen. Og lav testen højt : det er den, censor vil høre, fordi den viser metoden frem for hukommelsen.",
      examTip: ADVICE.hovedled,
    },
  ],
};

// ---------------------------------------------------------------------------
// YDERLIGERE EKSAMENSSÆT (2-6). Alle tekster er DIGTEDE fra bunden af os :
// fiktive medier, fiktive personer, fiktive tal. Ingen ophavsret ; ingen
// kopiering fra virkelige aviser. Formålet er, at man kan træne
// Eksamensprøven igen og igen uden at få det samme sæt to gange i træk
// (se pickNextExamSats). Genrerne dækker dem, man kan komme op i.
// ---------------------------------------------------------------------------
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
    ]
  },
  tasks: [
    {
      id: "g2-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "informerende-artikel",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa.",
        "Bestemmer genren som informerende artikel (nyhedsartikel/nyhedsreferat).",
        "Begrunder med den neutrale, upartiske tone og reporter-bylinen.",
        "Peger på opbygningen: vinkel, citater fra to parter, tal fra en officiel kilde.",
      ],
      modelAnswer: "Teksten er sagprosa, og genren er en informerende artikel : et nyhedsreferat i dagsavisen Dags Avisen. Afsenderen er en reporter (Laila Brandt), og der er ingen 'jeg' eller holdning: teksten refererer en beslutning ('lægger i morgen alle komælkskartoner fra hylderne') og lader to modsatrettede parter komme til orde, kædechefen og Forbrugerforeningen. Tallene kommer fra Danmarks Statistik, altså en kilde uden for teksten, og slutningen er en praktisk oplysning om, hvor menuen gælder : ikke en pointe til læseren. Formålet er at oplyse neutralt.",
      feedback: "Fælden er at blande 'teksten fremstiller kæden pænt' sammen med 'teksten er en reklame'. Et nyhedsreferat MÅ gerne referere en virksomheds egen forklaring : det afgørende er, at teksten selv ikke tager stilling, og at modparten også kommer til orde. Brug altid modsætningsprøven: kan du finde en sætning, hvor afsenderen selv mener noget? Kan du ikke det, er teksten informerende.",
      examTip: ADVICE.genre,
    },
    {
      id: "g2-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "afsender",
            label: "Afsender",
            help: "(Hvem taler/skriver, og med hvilken baggrund?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "emne",
            label: "Emne (indhold)",
            help: "(Hvad handler kommunikationen om?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "modtager",
            label: "Modtager",
            help: "(Hvem er målgruppen?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "situation",
            label: "Situation (omstændigheder)",
            help: "(Hvor, hvornår og hvorfor?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "genresprog",
            label: "Genre/Sprog",
            help: "(Hvilken form vælges, og hvordan lyder sproget?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "formaal",
            label: "Formål (midten af pentagrammet)",
            help: "(Hvad vil afsenderen opnå: informere, overbevise, sælge?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
        ],
      },
      points: [
        "Afsender: reporter Laila Brandt for Dags Avisen : ikke de citerede kilder.",
        "Emne: en cafékædes skifte fra komælk til plantedrikke og årsagerne til det.",
        "Modtager: avisens brede læserkreds med interesse for forbrug og erhverv.",
        "Situation: skiftet sker i morgen, midt i en tid med klimadebat og stigende kaffepriser.",
        "Formål: at oplyse neutralt, også om forbeholdet fra Forbrugerforeningen.",
      ],
      modelAnswer: "Afsenderen er reporter Laila Brandt, der skriver for Dags Avisen : kædechef Nadia Bloch og analytiker Tim Sørensen er citerede kilder, ikke afsendere. Emnet er Kaffevinkens skifte til plantebaserede drikke og de tre årsager: efterspørgsel, klima og økonomi. Modtagerne er avisens almene læsere, og sproget er derfor letforståeligt med forklarede tal (9 procent, 40 procent, 300.000 kroner). Situationen er aktuel og konkret: skiftet gælder fra i morgen i fem byer, samtidig med at mælkesalget falder og kaffepriserne stiger. Genren er et nyhedsreferat med neutralt stilleje. Formålet i midten af pentagrammet er at oplyse : og netop derfor får modparten plads.",
      feedback: "Der er mange rigtige måder at beskrive situationen på, men to ting skal være på plads: afsenderen skal være journalisten (ikke kilderne), og formålet skal formuleres som en hensigt. Læg også mærke til, at MEDIET afgrænser modtagerne: en dagsavis rammer bredere end fagbladet Fødevarewatch, som nævnes inde i teksten.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "g2-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "observationer",
            label: "Dine observationer",
            help: "(husk citater fra teksten)",
            placeholder: "Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ...",
            rows: 6,
          },
        ],
      },
      points: [
        "Nævner mindst tre træk med citat.",
        "Bruger fagbegreberne: semantisk felt, konnotation, konkret/abstrakt, paratakse/hypotakse.",
        "Peger på det neutrale stilleje og de mange tal (fakta-markører).",
        "Forklarer virkningen, fx at tallene skaber troværdighed.",
      ],
      modelAnswer: "Teksten har to tydelige semantiske felter: et klimafelt (klimaaftryk, grønt, planter) og et økonomifelt (spare, priser, bundlinje, omsætning). De to felter mødes i sætningen om, at branchen 'jagter både klima og bundlinje', hvor billedsproget (jagten) gør en forretningsstrategi konkret. Ordvalget er mest neutralt, som genren kræver, men konnotationerne er alligevel i spil: 'grønt' er positivt ladet, og derfor er analytikerens sætning ('Et produkt er ikke grønt i sig selv, fordi det kommer fra planter') en direkte korrektion af ordets ladning. Sprogets vigtigste særtræk er tæthed af tal: 14 caféer, 300.000 kroner, 40 procent, 9 procent : de virker som dokumentation og gør teksten troværdig. Sætningerne er hovedsagelig parataktiske og korte, med enkelte hypotaktiske at-sætninger efter verber som 'påpeger' og 'viser'.",
      feedback: "Opgaven er individuel, og der er mange rigtige svar : det er dokumentationen, der tæller. Et godt greb i en informerende tekst er at undersøge, hvor teksten SELV kunne have taget stilling, men ikke gør: 'anerkender ... men påpeger' viser fx, at afsenderen balancerer parterne. Nævn også, hvad ordklasserne siger: her er mange substantiver og talord, få adjektiver med holdning.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "g2-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "komælkskartoner",
            split: "ko-mælk-s-karton-er",
            splitAccepts: ["ko-mælks-karton-er", "ko-mælk-s-kartoner"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bindebogstavet",
              placeholder: "Skriv morfemet her",
              answer: "-s-",
              accepts: ["s", "-s"],
            },
            explain: "ko + mælk + karton er tre rodmorfemer, -s- er et bindebogstav, og -er er fleksiven (ubestemt flertal).",
          },
          {
            word: "kaffemaskinerne",
            split: "kaffe-maskin-er-ne",
            splitAccepts: ["kaffe-maskine-rne", "kaffe-maskiner-ne", "kaffe-maskine-r-ne"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-erne",
              accepts: ["-ne", "ne", "erne"],
            },
            explain: "kaffe + maskin er rodmorfemerne, og -erne er fleksiven (bestemt flertal).",
          },
          {
            word: "tilsætningsstoffer",
            split: "til-sæt-ning-s-stof-fer",
            splitAccepts: ["til-sætning-s-stoffer", "til-sæt-ning-s-stoffer", "tilsætning-s-stoffer"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Suffikset (afledningsendelsen)",
              placeholder: "Skriv morfemet her",
              answer: "-ning",
              accepts: ["ning"],
            },
            explain: "til- (præfiks) + sæt (rodmorfem) + -ning (suffiks, der laver verbet om til et substantiv) + -s- (bindebogstav) + stof + -er (fleksiv).",
          },
          {
            word: "forventer",
            split: "for-vent-er",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Rodmorfemet",
              placeholder: "Skriv morfemet her",
              answer: "vent",
              accepts: ["vente"],
            },
            explain: "for- (præfiks) + vent (rodmorfemet, som kan stå alene som verbum) + -er (fleksiv, præsens).",
          },
        ],
      },
      points: [
        "Deler 'komælkskartoner': ko + mælk + s (bindebogstav) + karton + -er (fleksiv).",
        "Deler 'tilsætningsstoffer': til- (præfiks) + sæt (rodmorfem) + -ning (suffiks) + s (bindebogstav) + stof + -er (fleksiv).",
        "Bruger navnene rodmorfem, præfiks, suffiks, fleksiv og bindebogstav.",
        "Forklarer forskellen på afledning (-ning) og bøjning (-er).",
      ],
      modelAnswer: "'komælkskartoner' er et sammensat ord: ko + mælk + karton er tre rodmorfemer, -s- er et bindebogstav, og -er er en fleksiv (ubestemt flertal). 'tilsætningsstoffer' er både afledt og sammensat: til- er et præfiks, sæt er rodmorfemet, -ning er et suffiks, der gør verbet til et substantiv, -s- er et bindebogstav, stof er endnu et rodmorfem, og -er er fleksiven. Rækkefølgen er værd at lægge mærke til: afledning før sammensætning, bøjning til sidst.",
      feedback: "Sammensatte ord er en gave til eksamen, hvis du har metoden: del først i rodmorfemer (de dele, der kan stå alene), og tag derefter for- og endelser. Den typiske fejl er at kalde bindebogstavet -s- for en bøjningsendelse eller en genitiv : det er hverken, det binder kun ordene sammen (jf. stol-e-ben).",
      examTip: ADVICE.morfologi,
    },
    {
      id: "g2-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "Fremover hældes drikke af havre, havtorn og ærteprotein i kaffemaskinerne.",
        chunks: ["Fremover", "hældes", "drikke af havre, havtorn og ærteprotein", "i kaffemaskinerne"],
        correctMap: ["adverbial", "verbal", "subjekt", "adverbial"],
        explain: "Rigtigt: 'Fremover' = adverbial (tid, rykket frem for betoning), 'hældes' = verballed, 'drikke af havre, havtorn og ærteprotein' = subjekt (det, der hældes), 'i kaffemaskinerne' = adverbial (sted). Læreringen: subjektet behøver IKKE stå før verbet; i vendinger står det bagefter. 'af havre...' hører med til 'drikke' og er ikke et selvstændigt led.",
      },
      points: [
        "Verballed: hældes (passiv).",
        "Subjekt: drikke af havre, havtorn og ærteprotein : det står EFTER verbet.",
        "Adverbial: Fremover (tid) og i kaffemaskinerne (sted).",
        "Nævner omvendt ledstilling, fordi adverbialet står forrest.",
      ],
      modelAnswer: "Verballeddet er 'hældes' (præsens passiv). Subjektet er 'drikke af havre, havtorn og ærteprotein', for det er det, der hældes : og præpositionsgruppen 'af havre, havtorn og ærteprotein' hører med til subjektet, fordi den beskriver drikkene. 'Fremover' er et adverbial (tid), som står på forpladsen, og derfor kommer subjektet EFTER verballeddet (omvendt ledstilling). 'i kaffemaskinerne' er et adverbial (sted). Der er intet objekt: i passiv er det, der ellers ville være objekt, blevet subjekt.",
      feedback: "Omvendt ledstilling er en klassisk fælde: mange leder efter subjektet før verbet og ender med at kalde 'Fremover' for subjekt. Spørg altid 'hvem/hvad + verbet?' uanset ordstilling. Læg også mærke til passiven (-s på verbet): den skjuler, HVEM der handler, og det er værd at nævne både i syntaksopgaven og i opgaven om sproglige særtræk.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "g2-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "Danskerne har købt 9 procent mindre komælk siden 2021.",
            verb: "har købt",
            correct: "perfektum",
            rewriteTo: "praeteritum",
            rewriteAnswer: "Danskerne købte 9 procent mindre komælk siden 2021.",
            rewriteKeys: ["købte"],
            explain: "'har købt' er perfektum (førnutid): hjælpeverbet i præsens + participium. I præteritum bliver det ét ord: 'købte'.",
          },
          {
            id: "t2",
            sentence: "Kæden forventer at spare 300.000 kroner om året på mælkekøbet.",
            verb: "forventer",
            correct: "praesens",
            rewriteTo: "pluskvamperfektum",
            rewriteAnswer: "Kæden havde forventet at spare 300.000 kroner om året på mælkekøbet.",
            rewriteKeys: ["havde", "forventet"],
            explain: "'forventer' er præsens (nutid). Pluskvamperfektum dannes med hjælpeverbet i DATID: 'havde forventet'. Infinitiven 'at spare' ændrer sig ikke : det er kun verballeddet, der bøjes.",
          },
        ],
      },
      points: [
        "Bestemmer tiden som perfektum (førnutid).",
        "Præsens: køber. Præteritum: købte. Pluskvamperfektum: havde købt.",
        "Forklarer, at perfektum er hjælpeverbum i præsens + participium.",
        "Siger hvad tiden gør: forbindelsen mellem fortid og nu (udviklingen gælder stadig).",
      ],
      modelAnswer: "'har købt' står i perfektum (førnutid): hjælpeverbet 'har' i præsens plus participiet 'købt'. Omskrevet: præsens 'danskerne køber 9 procent mindre komælk', præteritum 'danskerne købte 9 procent mindre komælk', pluskvamperfektum 'danskerne havde købt 9 procent mindre komælk' og futurum 'danskerne vil købe 9 procent mindre komælk'. Perfektum er valgt, fordi tallet dækker en periode fra 2021 og frem til nu : udviklingen er ikke slut. Det er også derfor, teksten kan bruge tallet som argument for, at skiftet sker 'i en tid', hvor markedet flytter sig.",
      feedback: "Til eksamen skal du både ramme tiden og kunne forklare valget. Perfektum og præteritum forveksles tit: præteritum lukker handlingen inde i fortiden ('købte i 2021'), mens perfektum trækker den frem til nu ('har købt siden 2021'). Netop tidsadverbialet 'siden' er et fingerpeg om perfektum.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "g2-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Forbrugerforeningen anerkender kædens forsøg, men påpeger, at mange bælgfrugtedrikke indeholder tilsætningsstoffer.",
        parts: [
          { text: "Forbrugerforeningen anerkender kædens forsøg,", type: "hoved" },
          { text: "men påpeger,", type: "hoved" },
          { text: "at mange bælgfrugtedrikke indeholder tilsætningsstoffer.", type: "led" },
        ],
        indleder: "at",
        funktion: "objekt",
        explain: "De to første dele er sideordnede HOVEDsætninger (paratakse med 'men'; subjektet er underforstået i den anden). Den sidste er en ledsætning indledt af 'at', og den er direkte objekt for 'påpeger' : hvad påpeger foreningen?",
      },
      points: [
        "Finder en hovedsætning, fx 'Forbrugerforeningen anerkender kædens forsøg'.",
        "Finder en ledsætning, fx 'at mange bælgfrugtedrikke indeholder tilsætningsstoffer'.",
        "Bruger ikke-reglen korrekt på begge.",
        "Siger, at at-ledsætningen er direkte objekt for 'påpeger'.",
      ],
      modelAnswer: "Hovedsætning: 'Forbrugerforeningen anerkender kædens forsøg'. Ikke-testen: 'Forbrugerforeningen anerkender IKKE kædens forsøg' : 'ikke' står efter verballeddet, og sætningen kan stå alene. Ledsætning: 'at mange bælgfrugtedrikke indeholder tilsætningsstoffer'. Ikke-testen: 'at mange bælgfrugtedrikke IKKE indeholder tilsætningsstoffer' : 'ikke' står mellem subjekt og verballed. Ledsætningen indledes af konjunktionen 'at' og er direkte objekt for verbet 'påpeger' (hvad påpeger foreningen?). En anden mulighed er 'at danskerne har købt 9 procent mindre komælk siden 2021', som er objekt for 'viser'.",
      feedback: "Husk, at 'men' og 'og' SIDEORDNER hovedsætninger (paratakse), mens 'at', 'fordi', 'hvis', 'når' og 'da' UNDERORDNER (hypotakse). Det er den forskel, opgaven i virkeligheden tester. Og slut altid med ledfunktionen: uden den er svaret halvt.",
      examTip: ADVICE.hovedled,
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
    ]
  },
  tasks: [
    {
      id: "g3-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "reklame",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa med et salgsformål.",
        "Bestemmer genren som reklame : et annonceforløb (advertorial), der er bygget som en guide.",
        "Begrunder med bylinen: bragt i samarbejde med PensionPartner.",
        "Peger på salgstrækkene: du-tiltale, gode råd, produktnavn og en opfordring til at booke.",
      ],
      modelAnswer: "Teksten er sagprosa, men genren er en reklame : nærmere bestemt et annonceforløb (en advertorial), der er skrevet, så det LIGNER en hjælpsom guide. Bylinen afslører det: 'Annonceforløb ... bragt i samarbejde med PensionPartner'. Genretrækkene er du-tiltale ('du kan booke'), gode råd i punktform, et navngivent produkt, et citat fra virksomhedens egen produktdirektør og til sidst en direkte opfordring med et gratis tilbud. Det er en hybrid: informationsformen er lånt fra den informerende artikel, men formålet er salg og tilslutning.",
      feedback: "Netop hybriden er pointen i denne opgave, og den er værd at sige højt: teksten bruger den informerende artikels form (overskrift, gode råd, citat), men afsenderens formål er kommercielt. Kalder du den bare 'en artikel', har du overset det vigtigste. Den skjulte hensigt er et af reklamens kendetegn : reklamen ligner ofte underholdning eller fakta.",
      examTip: ADVICE.genre,
    },
    {
      id: "g3-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "afsender",
            label: "Afsender",
            help: "(Hvem taler/skriver, og med hvilken baggrund?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "emne",
            label: "Emne (indhold)",
            help: "(Hvad handler kommunikationen om?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "modtager",
            label: "Modtager",
            help: "(Hvem er målgruppen?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "situation",
            label: "Situation (omstændigheder)",
            help: "(Hvor, hvornår og hvorfor?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "genresprog",
            label: "Genre/Sprog",
            help: "(Hvilken form vælges, og hvordan lyder sproget?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "formaal",
            label: "Formål (midten af pentagrammet)",
            help: "(Hvad vil afsenderen opnå: informere, overbevise, sælge?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
        ],
      },
      points: [
        "Afsender: PensionPartner (virksomheden), ikke mediet eller journalisten.",
        "Emne: pension for nyansatte og tre gode vaner.",
        "Modtager: unge i deres første job : du-tiltale og enkelt sprog viser det.",
        "Situation: annonceforløb i et erhvervsmedie, hvor læseren er i job-humør.",
        "Formål: at sælge (få læseren til at booke en samtale og samle sin ordning hos PensionPartner).",
      ],
      modelAnswer: "Den reelle afsender er PensionPartner, for teksten er bragt i samarbejde med virksomheden, og virksomhedens egen produktdirektør er den eneste kilde. Emnet er pension for helt nye på arbejdsmarkedet. Modtagerne er unge i deres første job : det kan man se på du-tiltalen, det enkle sprog og på at grundbegreber forklares. Situationen er et erhvervsmedie, hvor læseren i forvejen tænker på løn og karriere, og hvor en annonce derfor rammer godt. Genren er en advertorial med rådgivende, venlig tone. Formålet i midten af pentagrammet er salg og tilslutning: teksten skal få dig til at booke den gratis formuecheck og samle dine ordninger hos netop dem.",
      feedback: "Den vigtigste skelnen her er mellem MEDIE og AFSENDER: Handels Nyt bringer teksten, men PensionPartner er afsenderen. Bemærk også, at 'gratis' og 'personlig oversigt' er argumenter i et salgsforløb, ikke neutrale oplysninger. Der er mange rigtige måder at beskrive modtageren på, men den skal kunne dokumenteres i sproget.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "g3-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "observationer",
            label: "Dine observationer",
            help: "(husk citater fra teksten)",
            placeholder: "Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ...",
            rows: 6,
          },
        ],
      },
      points: [
        "Nævner mindst tre træk med citat.",
        "Peger på pronominerne (du, dine, vi) og den direkte tiltale.",
        "Bruger fagbegreberne: konnotation, semantisk felt, imperativ/opfordring, stilleje.",
        "Forklarer virkningen: tryghed, overskuelighed og hastværk (lige nu).",
      ],
      modelAnswer: "Det mest iøjnefaldende træk er pronominerne: 'du', 'dine', 'sine' og 'vi' gør teksten personlig og placerer læseren midt i den. Dernæst ordvalgets konnotationer: 'gode vaner', 'overskueligt', 'gratis' og 'personlig' er alle positivt ladede, mens den negative ladning er lagt på problemet ('ti år for sent'). Det semantiske felt er økonomi og orden (ordninger, beløb, formuecheck, oversigt), og stillejet er neutralt til let uformelt : korte sætninger, ingen fagtermer uden forklaring. Endelig er der tidspresset i adverbialet 'Lige nu', som skaber en mild hastværksfølelse, og tallet 'tyve minutter', der gør handlingen overkommelig. Sætningerne er hovedsagelig parataktiske og korte, hvilket gør teksten let at skimme.",
      feedback: "Her er mange rigtige svar, men i en reklame bør du altid undersøge to ting: pronominerne (hvem taler til hvem?) og ordenes ladning. Læg også mærke til metaforen i 'ét stykke papir, mange unge først griber' : pensionen bliver noget håndgribeligt, man kan gribe eller miste. Tag ét citat med for hvert træk, og sig hvad det GØR.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "g3-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "pensionsordningen",
            split: "pension-s-ordning-en",
            splitAccepts: ["pension-s-ordn-ing-en", "pensions-ordning-en"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-en",
            },
            explain: "pension + ordning er rodmorfemerne, -s- er et bindebogstav, og -en er fleksiven (bestemt ental).",
          },
          {
            word: "faglighed",
            split: "fag-lig-hed",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Suffikset (afledningsendelsen)",
              placeholder: "Skriv morfemet her",
              answer: "-hed",
              accepts: ["hed"],
            },
            explain: "fag (rodmorfem) + -lig (suffiks, der giver adjektivet 'faglig') + -hed (suffiks, der gør adjektivet til et substantiv). Ingen bøjningsendelse.",
          },
          {
            word: "medlemmerne",
            split: "med-lem-mer-ne",
            splitAccepts: ["medlem-mer-ne", "med-lem-merne", "medlem-merne"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-erne",
              accepts: ["-ne", "ne", "erne"],
            },
            explain: "med + lem er rodmorfemerne (medlem), og -erne er fleksiven (bestemt flertal).",
          },
          {
            word: "overskueligt",
            split: "over-skue-lig-t",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Suffikset (afledningsendelsen)",
              placeholder: "Skriv morfemet her",
              answer: "-lig",
              accepts: ["lig"],
            },
            explain: "over- (præfiks) + skue (rodmorfem) + -lig (suffiks, der laver adjektivet) + -t (fleksiv, intetkøn).",
          },
        ],
      },
      points: [
        "Deler 'pensionsordningen': pension + s (bindebogstav) + ordning + -en (fleksiv).",
        "Deler 'faglighed': fag (rodmorfem) + -lig (suffiks) + -hed (suffiks).",
        "Bruger navnene rodmorfem, suffiks, fleksiv og bindebogstav.",
        "Forklarer, at -lig og -hed ændrer ordklasse, mens -en kun er bøjning.",
      ],
      modelAnswer: "'pensionsordningen' = pension + s + ordning + -en: to rodmorfemer, et bindebogstav og en fleksiv (bestemt ental). 'faglighed' = fag + -lig + -hed: rodmorfemet fag er et substantiv, -lig gør det til adjektivet faglig, og -hed gør adjektivet til et nyt substantiv. Ordet har altså to afledninger og ingen bøjning. Forskellen er vigtig: afledninger (suffikser) laver nye ord, bøjninger (fleksiver) bøjer det ord, du har.",
      feedback: "Den typiske fejl er at kalde -s- i sammensatte ord for en genitiv (ejeform). Det er det ikke: det er et bindebogstav, præcis som -e- i stol-e-ben. Den anden typiske fejl er at stoppe ved én afledning : ord som faglighed, ensomhed og tryghed har to lag, og det er netop lagene, der viser, at du kan metoden.",
      examTip: ADVICE.morfologi,
    },
    {
      id: "g3-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "De tre gode vaner er at sætte et lille beløb til side hver måned.",
        chunks: ["De tre gode vaner", "er", "at sætte et lille beløb til side hver måned"],
        correctMap: ["subjekt", "verbal", "subjpred"],
        explain: "Rigtigt: 'De tre gode vaner' = subjekt, 'er' = verballed (kopulumverbet), og 'at sætte et lille beløb til side hver måned' = subjektsprædikat (det fortæller, hvad subjektet ER). Leddet efter 'er' er altså IKKE et objekt : 'være'-sætninger har prædikat, ikke objekt.",
      },
      points: [
        "Verballed: er (kopulaverbum).",
        "Subjekt: De tre gode vaner.",
        "Subjektsprædikat: at sætte et lille beløb til side hver måned.",
        "Nævner reglen: kopulaverbum giver subjektsprædikat, ikke direkte objekt.",
      ],
      modelAnswer: "Verballeddet er 'er', som er et kopulaverbum (være, blive, hedde, synes). Subjektet er 'De tre gode vaner'. Leddet efter verbet, 'at sætte et lille beløb til side hver måned', er et subjektsprædikat: det siger, hvad subjektet ER, og der er lighedstegn mellem de to led. Prøven er, at man kan bytte om: 'At sætte et lille beløb til side hver måned er de tre gode vaner.' Fordi verbet er kopulativt, kan der ikke være et direkte objekt i sætningen.",
      feedback: "Reglen, der afgør opgaven: subjektsprædikat og direkte objekt kan ikke optræde i samme sætning. Spørg derfor altid først, om verbet er kopulativt (er, bliver, hedder, synes, virker) eller et handlingsverbum. Bemærk også, at et helt led kan bestå af en infinitivkonstruktion med 'at' : det gør leddet langt, men det er stadig ét led.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "g3-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "Hos PensionPartner samler medlemmerne sine ordninger med tre klik i appen.",
            verb: "samler",
            correct: "praesens",
            rewriteTo: "praeteritum",
            rewriteAnswer: "Hos PensionPartner samlede medlemmerne sine ordninger med tre klik i appen.",
            rewriteKeys: ["samlede"],
            explain: "'samler' er præsens (nutid) : reklamer bruger nutid, fordi tilbuddet skal gælde HER OG NU. I præteritum: 'samlede'.",
          },
          {
            id: "t2",
            sentence: "Det tager tyve minutter.",
            verb: "tager",
            correct: "praesens",
            rewriteTo: "futurum",
            rewriteAnswer: "Det vil tage tyve minutter.",
            rewriteKeys: ["vil", "tage"],
            explain: "'tager' er præsens. Dansk har ingen egen fremtidsbøjning: futurum dannes med 'vil' eller 'skal' + infinitiv : 'vil tage'.",
          },
        ],
      },
      points: [
        "Bestemmer tiden som præsens (nutid).",
        "Præteritum: samlede. Perfektum: har samlet. Futurum: vil samle.",
        "Nævner, at hjælpeverbet bøjes i de sammensatte tider.",
        "Siger hvad præsens gør i en reklame: tilbuddet gælder nu, handlingen virker let.",
      ],
      modelAnswer: "'samler' står i præsens (nutid). Omskrevet: præteritum 'samlede medlemmerne sine ordninger', perfektum 'har medlemmerne samlet sine ordninger', pluskvamperfektum 'havde medlemmerne samlet ...' og futurum 'vil medlemmerne samle ...'. Præsens er ikke tilfældig: annonceforløb bruger nutid, fordi den gør tilbuddet aktuelt og handlingen let at forestille sig. Samme greb ligger i 'Det tager tyve minutter' og 'Lige nu kan du booke'.",
      feedback: "Til eksamen tæller det ekstra, hvis du kan koble tiden til tekstens formål. I en reklame skaber præsens nærhed og hastværk, mens et nyhedsreferat typisk veksler mellem præteritum (det skete) og perfektum (det gælder stadig). Husk også, at det er hjælpeverbet, der bøjes i perfektum og pluskvamperfektum.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "g3-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Vi gør det overskueligt at se, hvad du har, og hvad du mangler.",
        parts: [
          { text: "Vi gør det overskueligt at se,", type: "hoved" },
          { text: "hvad du har,", type: "led" },
          { text: "og hvad du mangler.", type: "led" },
        ],
        indleder: "hvad",
        funktion: "objekt",
        explain: "'Vi gør det overskueligt at se' er hovedsætningen (ikke efter verballeddet: 'Vi gør det IKKE ...'). De to hv-ledsætninger er sideordnede og fungerer som objekt for infinitiven 'at se' : hvad skal man se?",
      },
      points: [
        "Finder en hovedsætning, fx 'Lige nu kan du booke en gratis formuecheck-samtale'.",
        "Finder en ledsætning, fx 'hvad du har' eller 'hvad du mangler'.",
        "Bruger ikke-reglen korrekt på begge.",
        "Siger, at hv-ledsætningen er objekt for 'at se'.",
      ],
      modelAnswer: "Hovedsætning: 'Lige nu kan du booke en gratis formuecheck-samtale hos PensionPartner på hjemmesiden.' Ikke-testen: 'Lige nu kan du IKKE booke ...' : 'ikke' står efter det bøjede verbum, og sætningen kan stå alene. Ledsætning: 'hvad du har' (3. afsnit). Ikke-testen: 'hvad du IKKE har' : 'ikke' står mellem subjekt og verballed. Den indledes af hv-ordet 'hvad' og er objekt for infinitiven 'at se'. Bemærk, at der står to sideordnede ledsætninger efter hinanden: 'hvad du har, og hvad du mangler'.",
      feedback: "To ting løfter svaret: brug ikke-testen HØJT, og slut med ledfunktionen. Og læg mærke til, at ledsætninger kan være sideordnede indbyrdes ('hvad du har, OG hvad du mangler') : de er stadig ledsætninger, selvom de bindes sammen af 'og'.",
      examTip: ADVICE.hovedled,
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
    ]
  },
  tasks: [
    {
      id: "g4-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "opinionsartikel",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa i opinionsgenrerne.",
        "Bestemmer genren som læserbrev (opinionsartikel).",
        "Begrunder med afsenderen: en privat borger, forælder, der skriver i eget navn.",
        "Peger på jeg-formen, holdningen, det personlige eksempel og opfordringen til sidst.",
      ],
      modelAnswer: "Teksten er sagprosa og hører til opinionsgenrerne: det er et læserbrev i Aarhus Stifts Avis. Genretrækkene er tydelige: afsenderen er en privatperson (Mette Dahl, forælder i Risskov, ikke journalist), hun skriver i jeg-form ('Jeg forstår godt tanken'), hun bruger et personligt eksempel som argument (moderens slik i kantinen), hun anerkender modpartens ret ('Sundhedsstyrelsen har ret i ...') og hun slutter med en direkte opfordring til skolebestyrelsen. Formålet er at overbevise og påvirke en konkret beslutning.",
      feedback: "Læserbrev og kronik forveksles let, og det er helt fair at nævne begge : forskellen ligger i afsenderen og i længden. Et læserbrev er kort og skrevet af en almindelig læser om en aktuel, ofte lokal sag; en kronik er længere og typisk skrevet af en fagperson. Her peger 'forælder i Risskov' og den lokale sag på læserbrevet. Husk at pege på jeg-formen og opfordringen som belæg.",
      examTip: ADVICE.genre,
    },
    {
      id: "g4-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "afsender",
            label: "Afsender",
            help: "(Hvem taler/skriver, og med hvilken baggrund?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "emne",
            label: "Emne (indhold)",
            help: "(Hvad handler kommunikationen om?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "modtager",
            label: "Modtager",
            help: "(Hvem er målgruppen?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "situation",
            label: "Situation (omstændigheder)",
            help: "(Hvor, hvornår og hvorfor?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "genresprog",
            label: "Genre/Sprog",
            help: "(Hvilken form vælges, og hvordan lyder sproget?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "formaal",
            label: "Formål (midten af pentagrammet)",
            help: "(Hvad vil afsenderen opnå: informere, overbevise, sælge?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
        ],
      },
      points: [
        "Afsender: Mette Dahl, forælder : en privat, men involveret afsender (etos som mor).",
        "Emne: forbuddet mod slik og sodavand i skolekiosken.",
        "Modtager: skolebestyrelsen som primær modtager, avisens lokale læsere som medlyttere.",
        "Situation: beslutningen blev vedtaget i denne uge, og næste møde er anledningen.",
        "Formål: at få bestyrelsen til at genoptage sagen og inddrage eleverne.",
      ],
      modelAnswer: "Afsenderen er Mette Dahl, forælder i Risskov. Hun har ingen faglig autoritet, men en stærk etos som mor og tidligere elev, og den bruger hun bevidst. Emnet er forbuddet mod slik og sodavand i skolekiosken. Modtagerne er dobbelte: skolebestyrelsen tiltales direkte ('Jeg opfordrer skolebestyrelsen'), men teksten står i avisen, så de lokale læsere er medlyttere, der kan skabe opbakning. Situationen er helt aktuel: beslutningen blev vedtaget i denne uge, og der er et møde på vej, hvilket gør indlægget rettidigt. Genren er et læserbrev med personlig, men saglig tone. Formålet er at få sagen genoptaget og en anden løsning i stedet for et totalforbud.",
      feedback: "I opinionstekster er det næsten altid værd at skelne mellem den TILTALTE modtager (bestyrelsen) og de reelle læsere (avisens publikum): at skrive til en beslutningstager gennem en avis er i sig selv et retorisk valg, fordi det skaber vidner. Der er mange rigtige svar i denne opgave, men dokumentér med citater : særligt hvor afsenderen bygger sin etos op.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "g4-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "observationer",
            label: "Dine observationer",
            help: "(husk citater fra teksten)",
            placeholder: "Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ...",
            rows: 6,
          },
        ],
      },
      points: [
        "Nævner mindst tre træk med citat.",
        "Peger på jeg-formen og de personlige pronominer.",
        "Bruger fagbegreberne: konnotation, semantisk felt, konkret/abstrakt, antitese/modstilling.",
        "Forklarer virkningen: nærhed, troværdighed og den skarpe slutning.",
      ],
      modelAnswer: "Det bærende træk er de personlige pronominer: 'jeg', 'min mor', 'hendes venner' skaber nærhed og bygger afsenderens etos. Dernæst kontrasten mellem to semantiske felter: et sundhedsfelt (sundere mad, sodavand, Sundhedsstyrelsen) og et fællesskabsfelt (taler sammen, ritualer, tillid). Ordene i fællesskabsfeltet er abstrakte og positivt ladede, mens 'totalforbud' er et negativt ladet ord, der er valgt frem for det neutrale 'forbud'. Slutningen bruger en modstilling (antitese) med parallel opbygning: 'Et forbud er nemt at vedtage ; tillid hos eleverne er svær at genoprette' : to sætninger med samme form, men modsat indhold, hvilket gør pointen let at huske. Sætningerne er en blanding af paratakse og hypotakse, og de hypotaktiske 'men jeg forstår ikke, at ...'-konstruktioner er dem, der bærer argumentationen.",
      feedback: "Denne opgave er individuel : det, der er værd at kommentere, afhænger helt af teksten, og der findes mange rigtige svar. Et sikkert greb i en opinionstekst er at kigge på ordenes ladning (forbud vs. totalforbud) og på slutningens opbygning, for dér lægger afsendere næsten altid deres skarpeste virkemiddel.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "g4-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "skolebestyrelsen",
            split: "skole-be-styr-else-n",
            splitAccepts: ["skole-bestyrelse-n", "skole-be-styrelse-n"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-n",
              accepts: ["n", "-en"],
            },
            explain: "skole (rodmorfem) + be- (præfiks) + styr (rodmorfem) + -else (suffiks, der laver substantivet 'bestyrelse') + -n (fleksiv, bestemt form).",
          },
          {
            word: "genoprette",
            split: "gen-op-rette",
            splitAccepts: ["gen-oprette"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Præfikset (forstavelsen)",
              placeholder: "Skriv morfemet her",
              answer: "gen-",
              accepts: ["gen"],
            },
            explain: "gen- er præfikset og betyder 'igen'. 'oprette' er selve verbet (partiklen op + rodmorfemet rette).",
          },
          {
            word: "totalforbud",
            split: "total-for-bud",
            splitAccepts: ["total-forbud"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Præfikset (forstavelsen)",
              placeholder: "Skriv morfemet her",
              answer: "for-",
              accepts: ["for"],
            },
            explain: "total + bud er rodmorfemerne, og for- er et præfiks i 'forbud'. Ordet er sammensat og har ingen bøjningsendelse.",
          },
          {
            word: "ritualer",
            split: "ritual-er",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-er",
            },
            explain: "ritual er rodmorfemet, og -er er fleksiven (ubestemt flertal).",
          },
        ],
      },
      points: [
        "Deler 'skolebestyrelsen': skole + be- + styr + -else + -n.",
        "Deler 'genoprette': gen- (præfiks) + oprette (rodmorfem-del med partiklen op).",
        "Bruger navnene rodmorfem, præfiks, suffiks og fleksiv.",
        "Forklarer, at -else laver substantiv, og at -n er bestemt form.",
      ],
      modelAnswer: "'skolebestyrelsen' = skole + be- + styr + -else + -n: skole og styr er rodmorfemer, be- er et præfiks, -else er et suffiks, der gør verbet 'bestyre' til substantivet 'bestyrelse', og -n er fleksiven for bestemt form. 'genoprette' = gen- + op + rette: gen- er et præfiks med betydningen 'igen', og 'oprette' er selve verbet (partiklen op + rodmorfemet rette). Et ord kan altså godt have både præfiks, suffiks og fleksiv på én gang, og rækkefølgen er fast: præfiks, rod, suffiks, fleksiv.",
      feedback: "Test hver del ved at spørge, om den betyder noget: kan du fjerne den og få et nyt, meningsfuldt ord? 'bestyrelse' minus -else giver 'bestyre' : altså er -else et morfem. Den typiske fejl er at dele efter lyd i stedet for betydning ('skolebe + styrelsen'). Del altid i dele, der BETYDER noget.",
      examTip: ADVICE.morfologi,
    },
    {
      id: "g4-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "Hendes venner taler den dag i dag om frikatterne i frikvarteret.",
        chunks: ["Hendes venner", "taler", "den dag i dag", "om frikatterne i frikvarteret"],
        correctMap: ["subjekt", "verbal", "adverbial", "adverbial"],
        explain: "Rigtigt: 'Hendes venner' = subjekt, 'taler' = verballed, 'den dag i dag' = adverbial (tid), 'om frikatterne i frikvarteret' = adverbial (præpositions-led). Fælden var at kalde 'om frikatterne' for et objekt : men tale-verbet kræver 'om', og det led er en valgfri tilføjelse (adverbial), ikke et obligatorisk objekt.",
      },
      points: [
        "Verballed: taler.",
        "Subjekt: Hendes venner.",
        "Adverbial: den dag i dag (tid).",
        "Adverbial: om frikatterne i frikvarteret (indhold/emne for talen).",
        "Nævner, at der ikke er noget objekt: 'tale om noget' bruger en præpositionsgruppe.",
      ],
      modelAnswer: "Verballeddet er 'taler', og subjektet er 'Hendes venner' (hvem taler?). 'den dag i dag' er et adverbial, der svarer på hvornår, og 'om frikatterne i frikvarteret' er også et adverbial : det knytter sig til verbet med præpositionen 'om' og fortæller, hvad de taler om. Der er intet direkte objekt, for verbet 'tale' tager ikke objekt, men en præpositionsgruppe. Læg mærke til, at 'i frikvarteret' hører med inde i den samme gruppe, fordi det beskriver frikatterne.",
      feedback: "Mange vil kalde 'om frikatterne' for et objekt, fordi det føles som det, sætningen handler om. Testen er præpositionen: står der en præposition foran, er leddet et adverbial (eller en del af et andet led), ikke et direkte objekt. Prøv også at flytte leddene rundt : et adverbial kan typisk flyttes, et objekt kan ikke.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "g4-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "I denne uge vedtog skolebestyrelsen at forbyde slik og sodavand i skolekiosken.",
            verb: "vedtog",
            correct: "praeteritum",
            rewriteTo: "perfektum",
            rewriteAnswer: "I denne uge har skolebestyrelsen vedtaget at forbyde slik og sodavand i skolekiosken.",
            rewriteKeys: ["har", "vedtaget"],
            explain: "'vedtog' er præteritum (datid) : et stærkt verbum, der bøjes med vokalskifte i stedet for -ede. Perfektum: 'har vedtaget'.",
          },
          {
            id: "t2",
            sentence: "Da jeg gik i skole, købte min mor også slik i kantinen.",
            verb: "købte",
            correct: "praeteritum",
            rewriteTo: "pluskvamperfektum",
            rewriteAnswer: "Da jeg gik i skole, havde min mor også købt slik i kantinen.",
            rewriteKeys: ["havde", "købt"],
            explain: "'købte' er præteritum. Pluskvamperfektum (førdatid) dannes med 'havde' + participium : 'havde købt'. Bemærk den omvendte ledstilling, fordi ledsætningen ligger på forpladsen.",
          },
        ],
      },
      points: [
        "Bestemmer tiden som præteritum (datid).",
        "Præsens: vedtager. Perfektum: har vedtaget. Pluskvamperfektum: havde vedtaget.",
        "Nævner, at 'vedtog' er et stærkt verbum (vokalskifte i stedet for -ede).",
        "Siger hvad tidsskiftet gør: datid til referatet, præsens til holdningen.",
      ],
      modelAnswer: "'vedtog' står i præteritum (datid) og er et stærkt verbum: det bøjes med vokalskifte (vedtager, vedtog, har vedtaget) i stedet for med -ede. Omskrevet: præsens 'I denne uge vedtager skolebestyrelsen ...', perfektum 'I denne uge har skolebestyrelsen vedtaget ...', pluskvamperfektum 'havde skolebestyrelsen vedtaget ...' og futurum 'vil skolebestyrelsen vedtage ...'. Teksten skifter selv tid undervejs: beslutningen og barndommen står i datid, mens argumenterne og opfordringen står i præsens ('Løsningen er dog ikke ...', 'Jeg opfordrer ...'), fordi de gælder nu.",
      feedback: "Det hæver svaret, hvis du både kan bestemme tiden OG forklare tidsskiftene i teksten: fortællingen om moderen står i datid, argumentationen i præsens. Husk også, at en infinitiv ('at forbyde') aldrig er verballeddet : verballeddet er det bøjede verbum.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "g4-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Da jeg gik i skole, købte min mor også slik i kantinen.",
        parts: [
          { text: "Da jeg gik i skole,", type: "led" },
          { text: "købte min mor også slik i kantinen.", type: "hoved" },
        ],
        indleder: "da",
        funktion: "adverbial",
        explain: "'Da jeg gik i skole' er ledsætningen ('ikke' mellem subjekt og verballed: 'da jeg IKKE gik'), den indledes af konjunktionen 'da' og er adverbial (tid). Fordi ledsætningen ligger først, får hovedsætningen omvendt ledstilling: 'købte min mor'.",
      },
      points: [
        "Finder en hovedsætning, fx 'Jeg opfordrer skolebestyrelsen til at genoptage sagen'.",
        "Finder en ledsætning, fx 'Da jeg gik i skole' eller 'der gør en skoledag til mere ...'.",
        "Bruger ikke-reglen korrekt på begge.",
        "Siger ledfunktionen: 'Da jeg gik i skole' er adverbial (tid).",
      ],
      modelAnswer: "Hovedsætning: 'Jeg opfordrer skolebestyrelsen til at genoptage sagen på næste møde.' Ikke-testen: 'Jeg opfordrer IKKE skolebestyrelsen ...' : 'ikke' står efter verballeddet, og sætningen kan stå alene. Ledsætning: 'Da jeg gik i skole' (2. afsnit). Ikke-testen: 'Da jeg IKKE gik i skole' : 'ikke' står mellem subjekt og verballed. Den indledes af den hypotaktiske konjunktion 'da' og er et adverbial (tid) i hovedsætningen 'købte min mor også slik i kantinen'. Læg mærke til, at hovedsætningen får omvendt ledstilling (købte min mor), netop fordi ledsætningen fylder forpladsen.",
      feedback: "Her er en ekstra pointe, som giver point: når en ledsætning står FØRST, overtager den forpladsen i hovedsætningen, og derfor kommer verbet før subjektet ('Da jeg gik i skole, KØBTE MIN MOR ...'). Kan du nævne det, viser du, at du forstår sammenhængen mellem ledsætning og ordstilling.",
      examTip: ADVICE.hovedled,
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
    ]
  },
  tasks: [
    {
      id: "g5-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "opinionsartikel",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa i opinionsgenrerne.",
        "Bestemmer genren som leder (en opinionsartikel i et blad).",
        "Begrunder med afsenderen: elevredaktøren, der taler på bladets og elevernes vegne.",
        "Peger på det afsluttende krav, imperativerne og det retoriske spørgsmål i overskriften.",
      ],
      modelAnswer: "Teksten er sagprosa og hører til opinionsgenrerne: det er en leder i skolebladet Elevbladet. En leder kendes på, at redaktionen selv tager stilling til en aktuel sag, og at afsenderen taler på et fællesskabs vegne : her 'os' og 'vi' om eleverne. Genretrækkene er det retoriske spørgsmål i overskriften ('snyd eller redning?'), den afvejende opbygning (kritikken først, modsvaret bagefter), imperativerne til sidst ('Forbyd ikke værktøjet. Lær os i stedet at bruge det.') og et konkret forslag som afslutning. Formålet er at overbevise skolens lærere og ledelse.",
      feedback: "En leder er en opinionsgenre, selvom den står i et blad sammen med nyheder : det er en klassisk fælde at kalde den en 'informerende artikel', fordi den ligner en artikel. Kig efter, om afsenderen tager stilling og taler på redaktionens vegne. Nævn også gerne, at teksten ikke har en neutral balance: kritikken får ét afsnit, modsvaret to.",
      examTip: ADVICE.genre,
    },
    {
      id: "g5-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "afsender",
            label: "Afsender",
            help: "(Hvem taler/skriver, og med hvilken baggrund?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "emne",
            label: "Emne (indhold)",
            help: "(Hvad handler kommunikationen om?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "modtager",
            label: "Modtager",
            help: "(Hvem er målgruppen?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "situation",
            label: "Situation (omstændigheder)",
            help: "(Hvor, hvornår og hvorfor?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "genresprog",
            label: "Genre/Sprog",
            help: "(Hvilken form vælges, og hvordan lyder sproget?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "formaal",
            label: "Formål (midten af pentagrammet)",
            help: "(Hvad vil afsenderen opnå: informere, overbevise, sælge?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
        ],
      },
      points: [
        "Afsender: elevredaktør Albert Nyborg, der taler på elevernes vegne (etos som insider).",
        "Emne: elevernes brug af AI til lektier : snyd eller hjælp?",
        "Modtager: lærere og ledelse primært, medelever sekundært.",
        "Situation: nyt skoleår, aktuel debat om AI i undervisningen, skolebladet som talerør.",
        "Formål: at overbevise om, at skolen skal lære eleverne at bruge AI frem for at forbyde det.",
      ],
      modelAnswer: "Afsenderen er elevredaktør Albert Nyborg, som skriver i skolebladet og taler på elevernes vegne : hans etos er, at han selv ser, hvad der sker om aftenen ved køkkenbordet. Emnet er elevernes brug af AI til lektier. Modtagerne er dobbelte: lærerne og ledelsen tiltales indirekte gennem imperativerne ('Bed os fx om at aflevere AI-udkastet'), mens medeleverne er medlæsere, der skal føle sig repræsenteret. Situationen er et nyt skoleår i september, hvor reglerne er til diskussion, og mediet er skolens eget blad, hvor eleverne har taleret. Sproget er talesprogsnært og inkluderende ('mit årgang', 'os'). Formålet er at flytte skolen fra forbud til oplæring.",
      feedback: "Læg mærke til, at 'vi/os' her ikke kun er stil, men strategi: afsenderen gør sig til talsperson for en gruppe og bliver dermed sværere at afvise. Der er mange rigtige måder at beskrive situationen på : det vigtige er, at du kan dokumentere hvert hjørne i pentagrammet med et citat, og at du slutter med formålet som konklusion.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "g5-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "observationer",
            label: "Dine observationer",
            help: "(husk citater fra teksten)",
            placeholder: "Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ...",
            rows: 6,
          },
        ],
      },
      points: [
        "Nævner mindst tre træk med citat.",
        "Peger på pronominerne (vi/os/du) og imperativerne til sidst.",
        "Bruger fagbegreberne: konnotation, semantisk felt, konkret/abstrakt, konnektor, antitese.",
        "Forklarer virkningen: fællesskab, nærhed og en balanceret men styret argumentation.",
      ],
      modelAnswer: "Teksten er bygget på en modstilling (antitese), der løber hele vejen: 'Lærerne kalder det genvej ; eleverne kalder det læring', 'snyd eller redning', 'Kritikken har et point ... Til gengæld hjælper AI'en'. Konnektoren 'Til gengæld' er derfor et centralt træk: den vender teksten og markerer, hvilken side afsenderen står på. Pronominerne gør resten af arbejdet: 'mit årgang', 'os', 'vi' skaber et fællesskab, mens 'du' i 'Når du sidder fast' trækker læseren ind i situationen. Ordvalget veksler mellem abstrakte ord (læring, snyd, karakterer) og meget konkrete billeder ('hjemme ved køkkenbordet klokken 22'), og det konkrete er tekstens stærkeste virkemiddel, fordi det gør argumentet sanseligt. Til sidst skifter sætningstypen til imperativ ('Forbyd ikke', 'Lær os'), hvilket gør slutningen til et krav i stedet for en betragtning.",
      feedback: "Opgaven er individuel, og der er mange rigtige svar : vælg de træk, du kan dokumentere. I denne tekst er de tre stærkeste: modstillingerne, det konkrete billede med køkkenbordet klokken 22 og skiftet til imperativ i slutningen. Sig altid, hvad trækket GØR, ikke kun hvad det heder.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "g5-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "lektiehjælp",
            split: "lektie-hjælp",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Rodmorfemet",
              placeholder: "Skriv morfemet her",
              answer: "hjælp",
              accepts: ["lektie"],
            },
            explain: "To rodmorfemer sat sammen: lektie + hjælp. Ingen afledning og ingen bøjningsendelse.",
          },
          {
            word: "skriftlige",
            split: "skrift-lig-e",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Suffikset (afledningsendelsen)",
              placeholder: "Skriv morfemet her",
              answer: "-lig",
              accepts: ["lig"],
            },
            explain: "skrift (rodmorfem) + -lig (suffiks, der laver adjektivet 'skriftlig') + -e (fleksiv).",
          },
          {
            word: "køkkenbordet",
            split: "køkken-bord-et",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-et",
              accepts: ["et", "-t"],
            },
            explain: "køkken + bord er to rodmorfemer, der begge kan stå alene, og -et er fleksiven (bestemt ental).",
          },
          {
            word: "karakterer",
            split: "karakter-er",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-er",
            },
            explain: "karakter er rodmorfemet, og -er er fleksiven (ubestemt flertal).",
          },
        ],
      },
      points: [
        "Deler 'skriftlige': skrift (rodmorfem) + -lig (suffiks) + -e (fleksiv).",
        "Deler 'køkkenbordet': køkken + bord (to rodmorfemer) + -et (fleksiv).",
        "Bruger navnene rodmorfem, suffiks og fleksiv.",
        "Forklarer forskellen på sammensætning (to rødder) og afledning (rod + suffiks).",
      ],
      modelAnswer: "'skriftlige' = skrift + -lig + -e: rodmorfemet skrift er et substantiv, suffikset -lig gør det til et adjektiv, og fleksiven -e bøjer adjektivet (flertal/bestemt form). 'køkkenbordet' = køkken + bord + -et: to rodmorfemer, der begge kan stå alene, plus fleksiven -et for bestemt form ental. Forskellen er vigtig: det første ord er AFLEDT (nyt ord af en rod plus et suffiks), det andet er SAMMENSAT (to rødder sat sammen).",
      feedback: "Til eksamen kan du hurtigt afgøre, om et ord er sammensat eller afledt: kan begge dele stå alene som selvstændige ord, er det en sammensætning (køkken + bord). Kan den sidste del ikke stå alene, er det en afledning (-lig, -hed, -else, -ning). Og husk: bøjningsendelsen kommer altid til sidst.",
      examTip: ADVICE.morfologi,
    },
    {
      id: "g5-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "Eleven bruger værktøjet hver aften.",
        chunks: ["Eleven", "bruger", "værktøjet", "hver aften"],
        correctMap: ["subjekt", "verbal", "objekt", "adverbial"],
        explain: "Rigtigt: Eleven = subjekt, bruger = verballed, værktøjet = direkte objekt, hver aften = adverbial (tid). Flytte-testen viser det: 'Hver aften bruger eleven værktøjet' virker (adverbialer kan flyttes) ; 'værktøjet bruger eleven hver aften' knækker objektets binding til verbet.",
      },
      points: [
        "Verballed: bruger.",
        "Subjekt: Eleven.",
        "Direkte objekt: værktøjet.",
        "Adverbial: hver aften (tid).",
        "Nævner metoden: spørg hvem/hvad + verbet, og hvem/hvad + verbet + subjektet.",
      ],
      modelAnswer: "Verballeddet er 'bruger'. Subjektet er 'Eleven' (hvem bruger?). Det direkte objekt er 'værktøjet' (hvad bruger eleven?), og 'hver aften' er et adverbial, der svarer på hvornår. Der er intet indirekte objekt, for der er ingen modtager i sætningen, og verbet er ikke kopulativt, så der er heller intet subjektsprædikat.",
      feedback: "Sætningen er kort, og derfor er det de rigtige NAVNE, der giver point: subjekt, verballed, direkte objekt, adverbial (de latinske betegnelser er de primære). En god vane er at sige spørgsmålene højt undervejs : 'hvem bruger? eleven. hvad bruger eleven? værktøjet. hvornår? hver aften.' Så kan du ikke bytte leddene om.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "g5-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "Eleven bruger værktøjet hver aften.",
            verb: "bruger",
            correct: "praesens",
            rewriteTo: "perfektum",
            rewriteAnswer: "Eleven har brugt værktøjet hver aften.",
            rewriteKeys: ["har", "brugt"],
            explain: "'bruger' er præsens (nutid) : sammen med 'hver aften' bliver det en generel præsens om noget, der gentager sig. Perfektum: 'har brugt'.",
          },
          {
            id: "t2",
            sentence: "Lærerne kalder det genvej.",
            verb: "kalder",
            correct: "praesens",
            rewriteTo: "praeteritum",
            rewriteAnswer: "Lærerne kaldte det genvej.",
            rewriteKeys: ["kaldte"],
            explain: "'kalder' er præsens. Præteritum er den simple datid i ét ord: 'kaldte'.",
          },
        ],
      },
      points: [
        "Bestemmer tiden som præsens (nutid).",
        "Præteritum: brugte. Perfektum: har brugt. Futurum: vil bruge.",
        "Nævner den generelle præsens: handlingen gentages (hver aften).",
        "Siger hvad tiden gør: præsens gør påstanden almen og nærværende.",
      ],
      modelAnswer: "'bruger' står i præsens (nutid), og sammen med 'hver aften' bliver det en generel præsens: noget, der gentager sig og gælder i almindelighed. Omskrevet: præteritum 'Eleven brugte værktøjet hver aften', perfektum 'Eleven har brugt værktøjet hver aften', pluskvamperfektum 'Eleven havde brugt værktøjet hver aften' og futurum 'Eleven vil bruge værktøjet hver aften'. Valget af præsens er retorisk: det gør afsenderens påstand til en tilstand, der gælder nu, og dermed til noget, læseren skal forholde sig til i dag.",
      feedback: "Bemærk, hvordan hele teksten bruger præsens (sidder, kalder, hjælper, bruger) : det skaber nærvær og gør debatten aktuel. Kan du sige det til eksamen, viser du, at tempus ikke kun er grammatik, men også et virkemiddel. Og husk at bøje hjælpeverbet i de sammensatte tider.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "g5-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Når du sidder fast, behøver du ikke vente til i morgen med at få et skub i den rigtige retning.",
        parts: [
          { text: "Når du sidder fast,", type: "led" },
          { text: "behøver du ikke vente til i morgen med at få et skub i den rigtige retning.", type: "hoved" },
        ],
        indleder: "når",
        funktion: "adverbial",
        explain: "'Når du sidder fast' er ledsætningen : 'ikke' ville stå mellem subjekt og verballed ('når du IKKE sidder fast'). Den indledes af konjunktionen 'når' og er adverbial (tid) i hovedsætningen.",
      },
      points: [
        "Finder en hovedsætning, fx 'Måske har begge ret' eller 'Eleven bruger værktøjet hver aften'.",
        "Finder en ledsætning, fx 'Når du sidder fast' eller 'hvordan en stil nu skal bygges op'.",
        "Bruger ikke-reglen korrekt på begge.",
        "Siger ledfunktionen: 'Når du sidder fast' er adverbial (tid).",
      ],
      modelAnswer: "Hovedsætning: 'Måske har begge ret.' Ikke-testen: 'Måske har begge IKKE ret' : 'ikke' står efter verballeddet, og sætningen kan stå alene. Ledsætning: 'Når du sidder fast' (3. afsnit). Ikke-testen: 'Når du IKKE sidder fast' : 'ikke' står mellem subjekt og verballed. Den indledes af konjunktionen 'når' og er adverbial (tid) i hovedsætningen 'behøver du ikke vente til i morgen'. Et andet godt eksempel er 'hvordan en stil nu skal bygges op' (1. afsnit), som er en nominal ledsætning i objektsposition efter 'spørger en chatbot'.",
      feedback: "Den ekstra pointe, der løfter svaret: når ledsætningen står forrest, fylder den forpladsen i hovedsætningen, og derfor kommer verbet før subjektet ('Når du sidder fast, BEHØVER DU ...'). Nævn ledfunktionen hver gang : det er den, de fleste glemmer.",
      examTip: ADVICE.hovedled,
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
    ]
  },
  tasks: [
    {
      id: "g6-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "informerende-artikel",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa.",
        "Bestemmer genren som informerende medlemsnyt med et tilslutningsformål (hybrid).",
        "Begrunder med afsenderen: foreningens kommunikationsansvarlige, der skriver til medlemmerne.",
        "Peger på både informationen (tre krav, datoer, praktisk huskeregel) og opfordringen til sidst.",
      ],
      modelAnswer: "Teksten er sagprosa: et medlemsnyt (nyhedsbrev) fra Butiksansattes Fagforening. Den er informerende i sin form : den oplyser om, hvad der forhandles, hvornår mødet er, og hvad man skal huske : men den har også et tydeligt tilslutningsformål, for den slutter med at bede læseren melde sig ind i netværket og følge foreningen. Derfor er den bedst beskrevet som en hybrid: intern organisationskommunikation, hvor informationen bruges til at skabe sammenhold. Afsenderen er navngiven (kommunikationsansvarlig Kenan Yildiz), og 'vi' er foreningen selv.",
      feedback: "Det er helt legitimt at kalde teksten informerende, men du skal have BEGGE dele med: den oplyser og den samler. Kig på sidste afsnit: 'Meld dig ind i netværket ... og følg os' er en opfordring, ikke en oplysning. Netop de hybride tekster er dem, hvor genrebestemmelsen bliver rigtig god, hvis du kan argumentere for to lag.",
      examTip: ADVICE.genre,
    },
    {
      id: "g6-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "afsender",
            label: "Afsender",
            help: "(Hvem taler/skriver, og med hvilken baggrund?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "emne",
            label: "Emne (indhold)",
            help: "(Hvad handler kommunikationen om?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "modtager",
            label: "Modtager",
            help: "(Hvem er målgruppen?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "situation",
            label: "Situation (omstændigheder)",
            help: "(Hvor, hvornår og hvorfor?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "genresprog",
            label: "Genre/Sprog",
            help: "(Hvilken form vælges, og hvordan lyder sproget?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
          {
            id: "formaal",
            label: "Formål (midten af pentagrammet)",
            help: "(Hvad vil afsenderen opnå: informere, overbevise, sælge?)",
            placeholder: "Skriv kort her...",
            rows: 2,
          },
        ],
      },
      points: [
        "Afsender: fagforeningen ved sin kommunikationsansvarlige : en organisation, der taler som vi.",
        "Emne: den kommende overenskomstforhandling og medlemmernes rettigheder.",
        "Modtager: foreningens egne medlemmer, butiksansatte : intern kommunikation.",
        "Situation: før forhandlingen i august, hvor opbakning er vigtig.",
        "Formål: at informere OG at samle medlemmerne (tilslutning, indmeldelse, opdateret kort).",
      ],
      modelAnswer: "Afsenderen er Butiksansattes Fagforening, repræsenteret af kommunikationsansvarlig Kenan Yildiz : og 'vi' i teksten er foreningen selv, hvilket er vigtigt for forståelsen. Emnet er den kommende overenskomst og de tre krav, foreningen går efter. Modtagerne er foreningens egne medlemmer, butiksansatte, og teksten regner med et fælles udgangspunkt (dit område, din timeløn, dit medlemskort). Situationen er tiden LIGE FØR forhandlingen i august, hvor sammenhold har værdi ved bordet. Genren er medlemsnyt, og sproget er konkret og henvendt. Formålet er dobbelt: at oplyse om forhandlingen og samtidig samle medlemmerne bag den : derfor slutningen om fællesskabet og indmeldelsen.",
      feedback: "Intern kommunikation er en situationstype, der er værd at kunne: afsender og modtager er på samme hold, og derfor er tiltalen inkluderende og forudsætningerne fælles. Vær præcis med, hvem 'vi' dækker : her glider det mellem foreningen og medlemmerne, og det er et bevidst retorisk træk, ikke en fejl.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "g6-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: {
        kind: "fields",
        fields: [
          {
            id: "observationer",
            label: "Dine observationer",
            help: "(husk citater fra teksten)",
            placeholder: "Fx: Teksten bruger mange adjektiver som ... Det har negative konnotationer ... Semantisk felt om ...",
            rows: 6,
          },
        ],
      },
      points: [
        "Nævner mindst tre træk med citat.",
        "Peger på pronominerne (vi/os/du/din) og hvad de gør ved fællesskabet.",
        "Bruger fagbegreberne: semantisk felt, konnotation, konkret/abstrakt, kontrast, tal som virkemiddel.",
        "Forklarer virkningen: styrke i fællesskabet, konkrete gevinster, let hastværk (inden ... træder i kraft).",
      ],
      modelAnswer: "Det stærkeste træk er pronominerne: 'vi' og 'os' (foreningen og medlemmerne som ét hold) sat over for 'arbejdsgiverne' (den fraværende modpart) og 'du/din' (den enkelte). Kombinationen giver både kollektiv styrke og personlig gevinst. Dernæst kontrasten i 4. afsnit: 'En enkelt, der klager alene, kan blive overset ; men 11.000 organiserede butiksansatte bliver ikke overset' : en modstilling, hvor tallet fungerer som dokumentation og styrkedemonstration. Det semantiske felt er arbejdsmarked og rettigheder (overenskomst, timeløn, tillæg, fritvalgskonto, a-kasse), og teksten oversætter bevidst det abstrakte (en overenskomst) til det konkrete (timeløn, fri, sygdom). Endelig er titlens negation ('er ikke bare papir') og billedet 'en tyk bunke papir' et greb, der først nedgør emnet, som læseren måske selv gør, og derefter vender det.",
      feedback: "Opgaven er individuel : vælg de træk, du kan dokumentere. I organisationstekster er pronominerne næsten altid den bedste indgang: kortlæg dem (hvem er vi? hvem er de? hvem er du?), for det afslører hele den retoriske opstilling. Husk at forklare virkningen, ikke kun sætte navn på trækket.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "g6-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "forhandlingsudvalget",
            split: "for-handl-ing-s-udvalg-et",
            splitAccepts: ["for-handling-s-udvalg-et", "forhandling-s-udvalg-et", "forhandlings-udvalg-et"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-et",
              accepts: ["et", "-t"],
            },
            explain: "for- (præfiks) + handl (rodmorfem) + -ing (suffiks) + -s- (bindebogstav) + udvalg (rodmorfem) + -et (fleksiv).",
          },
          {
            word: "fællesskabet",
            split: "fælles-skab-et",
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Suffikset (afledningsendelsen)",
              placeholder: "Skriv morfemet her",
              answer: "-skab",
              accepts: ["skab"],
            },
            explain: "fælles (rodmorfem) + -skab (suffiks, der laver substantivet) + -et (fleksiv, bestemt ental).",
          },
          {
            word: "fritvalgskonto",
            split: "frit-valg-s-konto",
            splitAccepts: ["fritvalg-s-konto"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bindebogstavet",
              placeholder: "Skriv morfemet her",
              answer: "-s-",
              accepts: ["s", "-s"],
            },
            explain: "frit + valg + konto er rodmorfemerne, og -s- er bindebogstavet mellem 'fritvalg' og 'konto'.",
          },
          {
            word: "organiserede",
            split: "organis-er-ede",
            splitAccepts: ["organiser-ede", "organisere-de"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: {
              label: "Bøjningsendelsen (fleksiv)",
              placeholder: "Skriv morfemet her",
              answer: "-ede",
              accepts: ["ede", "-de"],
            },
            explain: "organis (rodmorfemet fra låneordet) + -er- (den verbumsdannende endelse i 'organisere') + -ede (fleksiv).",
          },
        ],
      },
      points: [
        "Deler 'forhandlingsudvalget': for- + handl + -ing + s + udvalg + -et.",
        "Deler 'fællesskabet': fælles + -skab + -et.",
        "Bruger navnene rodmorfem, præfiks, suffiks, fleksiv og bindebogstav.",
        "Forklarer, at -ing og -skab er afledninger, mens -et er bøjning.",
      ],
      modelAnswer: "'forhandlingsudvalget' = for- + handl + -ing + s + udvalg + -et: præfikset for-, rodmorfemet handl(e), suffikset -ing (som gør verbet til substantivet handling), bindebogstavet -s-, rodmorfemet udvalg og fleksiven -et (bestemt form). 'fællesskabet' = fælles + -skab + -et: rodmorfemet fælles (adjektiv), suffikset -skab, der laver et substantiv, og fleksiven -et. Begge ord viser det samme mønster: afledning først, bøjning til sidst.",
      feedback: "Suffikser, du skal kunne genkende i AP: -ing/-ning, -else, -hed, -skab, -lig, -isk, -er. De laver nye ord og ofte nye ordklasser. Bøjningsendelser (fleksiver): -e, -er, -en, -et, -ene, -ede, -t. De bøjer kun. Kan du holde de to lister adskilt, er morfologiopgaven den letteste af de syv at score højt på.",
      examTip: ADVICE.morfologi,
    },
    {
      id: "g6-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "Vi sender medlemmerne det nye forhandlingskatalog bagefter.",
        chunks: ["Vi", "sender", "medlemmerne", "det nye forhandlingskatalog", "bagefter"],
        correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
        explain: "Rigtigt: Vi = subjekt, sender = verballed, medlemmerne = indirekte objekt (til hvem?), det nye forhandlingskatalog = direkte objekt (hvad?), bagefter = adverbial. Husk : ditransitive verber som 'sende' har TO objekter ; det uden præposition er det indirekte objekt (det led, der svarer på 'til hvem?').",
      },
      points: [
        "Verballed: sender.",
        "Subjekt: Vi.",
        "Indirekte objekt: medlemmerne (til hvem?).",
        "Direkte objekt: det nye forhandlingskatalog.",
        "Adverbial: bagefter (tid).",
      ],
      modelAnswer: "Verballeddet er 'sender', og subjektet er 'Vi' (hvem sender?). Det direkte objekt er 'det nye forhandlingskatalog' (hvad sender vi?), og det indirekte objekt er 'medlemmerne' (til hvem?). 'bagefter' er et adverbial (tid). Sætningen er et skoleeksempel på, at det indirekte objekt står FØRST af de to objekter, og at det kun kan være der, fordi der også er et direkte objekt.",
      feedback: "Rækkefølgen i dansk er fast: indirekte objekt før direkte objekt ('sender MEDLEMMERNE KATALOGET'). Prøven er omskrivningen med præposition: 'sender kataloget TIL medlemmerne' : det, der kan få 'til' foran, er det indirekte objekt. Det er en sikker test, og den er værd at vise censor.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "g6-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "To gange om året forhandler vi en ny overenskomst på dit område.",
            verb: "forhandler",
            correct: "praesens",
            rewriteTo: "praeteritum",
            rewriteAnswer: "To gange om året forhandlede vi en ny overenskomst på dit område.",
            rewriteKeys: ["forhandlede"],
            explain: "'forhandler' er præsens (nutid) : sammen med 'to gange om året' bliver det en generel præsens om en fast rutine. Præteritum: 'forhandlede'.",
          },
          {
            id: "t2",
            sentence: "Forhandlingsudvalget møder arbejdsgiverne i august.",
            verb: "møder",
            correct: "praesens",
            rewriteTo: "futurum",
            rewriteAnswer: "Forhandlingsudvalget vil møde arbejdsgiverne i august.",
            rewriteKeys: ["vil", "møde"],
            explain: "'møder' er præsens, men betydningen er fremtidig : dansk kan bruge præsens om fremtiden, når et tidsadverbial ('i august') gør det tydeligt. Futurum: 'vil møde'.",
          },
        ],
      },
      points: [
        "Bestemmer tiden som præsens (nutid).",
        "Præteritum: forhandlede. Perfektum: har forhandlet. Futurum: vil forhandle.",
        "Nævner den generelle præsens (noget, der sker to gange om året).",
        "Siger hvad tiden gør: præsens gør arbejdet til en fast, pålidelig rutine.",
      ],
      modelAnswer: "'forhandler' står i præsens (nutid), og adverbialet 'To gange om året' gør det til en generel præsens: en tilbagevendende handling. Omskrevet: præteritum 'forhandlede vi en ny overenskomst', perfektum 'har vi forhandlet en ny overenskomst', pluskvamperfektum 'havde vi forhandlet ...' og futurum 'vil vi forhandle ...'. Valget af præsens er retorisk klogt: det fremstiller foreningens arbejde som en fast rutine, man kan regne med. Læg også mærke til, at teksten bruger præsens om fremtiden i 'Forhandlingsudvalget møder arbejdsgiverne i august'.",
      feedback: "Den pointe, der giver ekstra point her: dansk har ikke en egen fremtidsbøjning. Vi bruger 'vil/skal + infinitiv' ELLER præsens sammen med et tidsadverbial ('møder ... i august'). Kan du forklare det, viser du forståelse ud over det, opgaven spørger om.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "g6-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Husk at opdatere dit medlemskort, inden overenskomsten træder i kraft.",
        parts: [
          { text: "Husk at opdatere dit medlemskort,", type: "hoved" },
          { text: "inden overenskomsten træder i kraft.", type: "led" },
        ],
        indleder: "inden",
        funktion: "adverbial",
        explain: "'Husk at opdatere dit medlemskort' er hovedsætningen (en imperativ, som kan stå alene). 'inden overenskomsten træder i kraft' er ledsætningen : 'ikke' står mellem subjekt og verballed, den indledes af 'inden' og svarer på hvornår : altså adverbial (tid).",
      },
      points: [
        "Finder en hovedsætning, fx 'Vores styrke er fællesskabet'.",
        "Finder en ledsætning, fx 'inden overenskomsten træder i kraft' eller 'der afgør ...'.",
        "Bruger ikke-reglen korrekt på begge.",
        "Siger ledfunktionen: inden-sætningen er adverbial (tid), der-sætningen er attribut.",
      ],
      modelAnswer: "Hovedsætning: 'Vores styrke er fællesskabet.' Ikke-testen: 'Vores styrke er IKKE fællesskabet' : 'ikke' står efter verballeddet, og sætningen kan stå alene. Ledsætning: 'inden overenskomsten træder i kraft' (3. afsnit). Ikke-testen: 'inden overenskomsten IKKE træder i kraft' : 'ikke' står mellem subjekt og verballed. Den indledes af konjunktionen 'inden' og er adverbial (tid). Et andet eksempel er relativsætningen 'der afgør, hvad din timeløn er' (1. afsnit), som beskriver 'den bunke' og altså er attribut : og inde i den ligger endnu en ledsætning ('hvad din timeløn er') som objekt for 'afgør'.",
      feedback: "Vis gerne, at ledsætninger kan ligge inde i hinanden : det er den slags hypotakse, censor gerne spørger ind til. Og slut altid med ledfunktionen (adverbial, objekt, subjekt, attribut): det er den halve opgave.",
      examTip: ADVICE.hovedled,
    },
  ],
};

// Sæt 7. Politisk tale : genren står på skolens liste, men manglede i puljen.
const SAT_7_POLITISK_TALE: ExamSatsT = {
  id: "hhx-sats-07",
  title: "Eksamenssæt 7 · Tal for de unge, ikke om dem",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
  article: {
    title: "Tal for de unge, ikke om dem",
    byline: "Tale ved et ungdomspolitisk møde i Nørreby (fiktiv by) ; af byrådskandidat Miriam Kold ; 4. februar 2026",
    paragraphs: [
      "Kære forsamling. Jeg er vokset op tre gader herfra, og jeg tog den samme bus som jer. Derfor ved jeg, hvad der sker, når den bus ikke kommer: man kommer for sent til skole, man dropper fritidsjobbet, og til sidst flytter man.",
      "Sidste år lukkede kommunen tre busruter. Tre ruter, som unge brugte hver eneste morgen. Man kaldte det en tilpasning. Jeg kalder det et fravalg af en hel generation.",
      "Er det uretfærdigt at bede om en bus, der kører, når man skal i skole? Jeg synes det ikke. Kommunen giver de unge et ungdomskort hvert år, og det er godt. Men et kort til en bus, der ikke kører, er bare et stykke plastik.",
      "Hvis vi vil have unge til at blive i byen, skal vi gøre det nemt at komme frem. Gode busforbindelser koster penge, ja. Men tomme klasselokaler og lukkede butikker koster mere.",
      "Derfor lover jeg jer tre ting: de tre ruter tilbage, et ungdomskort der også gælder om aftenen, og et ungeråd med rigtig indflydelse. Vi bygger et fællesskab, der holder. Tak fordi I lyttede.",
    ]
  },
  tasks: [
    {
      id: "g7-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "politisk-tale",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa med et tilslutningsformål.",
        "Bestemmer genren som politisk tale.",
        "Begrunder med den direkte tiltale til en forsamling ('Kære forsamling', 'jer').",
        "Peger på appelformerne: etos (jeg tog den samme bus), patos (man flytter) og logos (tre ruter).",
      ],
      modelAnswer: "Teksten er en politisk tale: den er holdt mundtligt for en forsamling, den indledes med en tiltale ('Kære forsamling') og afsluttes med en tak. Afsenderen er en byrådskandidat, altså en, der vil vinde tilslutning. Talen bruger alle tre appelformer: etos, når hun fortæller, at hun selv tog bussen ; patos, når hun beskriver, at unge flytter ; og logos, når hun nævner de tre lukkede ruter. Til sidst kommer tre konkrete løfter, som er et typisk taletræk.",
      feedback: "Talen ligner et debatindlæg, og det er ikke helt forkert set: begge vil overbevise. Forskellen er den mundtlige situation. Kig efter tiltalen, gentagelserne og de tre løfter til sidst : en tale er bygget til at blive HØRT én gang, så den gentager sine pointer.",
      examTip: ADVICE.genre,
    },
    {
      id: "g7-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: { kind: "fields", fields: PENTAGRAM_FIELDS },
      points: [
        "Afsender: byrådskandidat Miriam Kold : hun vil vælges og bygger etos som lokal.",
        "Emne: de nedlagte busruter og de unges muligheder i byen.",
        "Modtager: de unge til mødet, men også vælgerne bag dem.",
        "Situation: valgkamp og et ungdomspolitisk møde i februar.",
        "Formål: at vinde tilslutning og stemmer.",
      ],
      modelAnswer: "Afsenderen er byrådskandidat Miriam Kold, som taler til et ungdomspolitisk møde. Emnet er de tre lukkede busruter og de unges hverdag. Modtagerne er de unge i salen, men gennem dem også forældre og vælgere. Situationen er valgkamp: hun skal bruge stemmer, og derfor er talen både personlig og konkret. Sproget er talesprogsnært med korte sætninger og gentagelser. I midten af pentagrammet står formålet: at vinde tilslutning ved at vise, at hun kender problemet indefra.",
      feedback: "Husk, at en tale har en dobbelt modtagerkreds: dem i salen og dem, der hører om den bagefter. Og vær præcis med afsenderens interesse : hun er ikke en neutral iagttager, hun er kandidat.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "g7-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: { kind: "fields", fields: SAERTRAEK_FIELDS },
      points: [
        "Nævner mindst tre træk med citat fra talen.",
        "Peger på gentagelsen ('Tre ruter'), det retoriske spørgsmål og de tre løfter.",
        "Bruger fagbegreberne: appelformer, konnotation, paratakse, retorisk spørgsmål.",
        "Forklarer virkningen: nærhed, genkendelse og en tydelig modstander.",
      ],
      modelAnswer: "Talen er bygget på gentagelser: 'Sidste år lukkede kommunen tre busruter. Tre ruter, som unge brugte hver eneste morgen.' Gentagelsen gør tallet til et billede. Hun bruger et retorisk spørgsmål ('Er det uretfærdigt at bede om en bus...?') og svarer selv, hvilket er et klassisk taletræk. Ordvalget er konkret og hverdagsnært (bus, skole, fritidsjob), og konnotationerne styrer vurderingen: kommunen 'kaldte det en tilpasning', mens hun kalder det 'et fravalg af en hel generation'. Sætningerne er korte og parataktiske, så de er lette at følge, når man hører dem én gang.",
      feedback: "I en tale er rytmen et selvstændigt virkemiddel: treleddede opremsninger, gentagne ord og korte sætninger. Tag altid et citat med, og sig, hvad trækket gør ved tilhøreren.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "g7-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "uretfærdigt",
            split: "u-ret-færdig-t",
            splitAccepts: ["u-retfærdig-t"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Præfikset (forstavelsen)", placeholder: "Skriv morfemet her", answer: "u-", accepts: ["u"] },
            explain: "u- (præfiks, der nægter) + ret + færdig (rodmorfemer i 'retfærdig') + -t (fleksiv, intetkøn).",
          },
          {
            word: "ungdomskort",
            split: "ung-dom-s-kort",
            splitAccepts: ["ungdom-s-kort"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Bindebogstavet", placeholder: "Fx -e-", answer: "-s-", accepts: ["s", "-s"] },
            explain: "ung + dom (suffikset -dom laver substantivet 'ungdom') + -s- (bindebogstav) + kort (rodmorfem).",
          },
          {
            word: "busforbindelser",
            split: "bus-for-bind-else-r",
            splitAccepts: ["bus-forbindelse-r", "bus-for-bindelse-r"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Bøjningsendelsen (fleksiv)", placeholder: "Skriv morfemet her", answer: "-r", accepts: ["r", "-er"] },
            explain: "bus + for- (præfiks) + bind (rodmorfem) + -else (suffiks, der laver substantivet) + -r (fleksiv, flertal).",
          },
          {
            word: "fællesskab",
            split: "fælles-skab",
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Suffikset (afledningsendelsen)", placeholder: "Fx -hed", answer: "-skab", accepts: ["skab"] },
            explain: "fælles (rodmorfem, adjektiv) + -skab (suffiks, der laver et substantiv). Samme mønster som venskab og selskab.",
          },
        ],
      },
      points: [
        "Deler ordene med bindestreger og sætter navn på hver del.",
        "Kender forskel på afledning (-dom, -else, -skab) og bøjning (-t, -r).",
        "Genkender bindebogstavet -s- i ungdomskort.",
        "Kan sige, hvad delen GØR: -skab laver et substantiv af et adjektiv.",
      ],
      modelAnswer: "'uretfærdigt' = u- + ret + færdig + -t: præfikset nægter, og -t er bøjning i intetkøn. 'ungdomskort' = ung + dom + s + kort: to sammensatte dele bundet af bindebogstavet -s-. 'busforbindelser' = bus + for + bind + else + r: både sammensat og afledt, med -r som flertalsendelse. 'fællesskab' = fælles + -skab, hvor suffikset laver substantivet.",
      feedback: "Ord i en tale er ofte lange, sammensatte ord : del dem først i de dele, der kan stå alene, og tag derefter for- og endelser. Husk, at -s- mellem to dele er et bindebogstav, ikke en ejeform.",
      examTip: ADVICE.morfologi,
    },
    {
      id: "g7-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "Kommunen giver de unge et ungdomskort hvert år.",
        chunks: ["Kommunen", "giver", "de unge", "et ungdomskort", "hvert år"],
        correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
        explain: "Kommunen = subjekt (hvem giver?), giver = verballed, 'de unge' = indirekte objekt (til hvem?), 'et ungdomskort' = direkte objekt (hvad gives?), 'hvert år' = adverbial (tid).",
      },
      points: [
        "Verballed: giver.",
        "Subjekt: Kommunen.",
        "Indirekte objekt: de unge (til hvem?).",
        "Direkte objekt: et ungdomskort.",
        "Adverbial: hvert år (tid).",
      ],
      modelAnswer: "Verballeddet er 'giver'. Subjektet er 'Kommunen'. Sætningen har to objekter: 'de unge' er indirekte objekt (til hvem gives kortet?), og 'et ungdomskort' er direkte objekt (hvad gives?). 'hvert år' er adverbial og svarer på hvornår. Prøven på det indirekte objekt er omskrivningen: kommunen giver et ungdomskort TIL de unge.",
      feedback: "Rækkefølgen i dansk er fast: indirekte objekt før direkte objekt. Bliver du i tvivl, så sæt 'til' foran det ene led : kan det lade sig gøre, er det det indirekte objekt.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "g7-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "Sidste år lukkede kommunen tre busruter.",
            verb: "lukkede",
            correct: "praeteritum",
            rewriteTo: "perfektum",
            rewriteAnswer: "Sidste år har kommunen lukket tre busruter.",
            rewriteKeys: ["har", "lukket"],
            explain: "'lukkede' er præteritum (datid): ét ord bøjet med -ede. Perfektum dannes med 'har' + participium: 'har lukket'.",
          },
          {
            id: "t2",
            sentence: "Vi bygger et fællesskab, der holder.",
            verb: "bygger",
            correct: "praesens",
            rewriteTo: "futurum",
            rewriteAnswer: "Vi vil bygge et fællesskab, der holder.",
            rewriteKeys: ["vil", "bygge"],
            explain: "'bygger' er præsens (nutid). Futurum dannes med 'vil' eller 'skal' + infinitiv: 'vil bygge'. Bemærk, at præsens i en tale gør løftet nærværende : det er allerede i gang.",
          },
        ],
      },
      points: [
        "Bestemmer tiderne: præteritum og præsens.",
        "Omskriver til perfektum ('har lukket') og futurum ('vil bygge').",
        "Nævner, at hjælpeverbet bærer bøjningen i de sammensatte tider.",
        "Kan sige, hvad tiden gør i talen: datid om svigtet, præsens om løsningen.",
      ],
      modelAnswer: "'lukkede' står i præteritum og fortæller om noget afsluttet: kommunens beslutning. 'bygger' står i præsens og gør hendes eget projekt nærværende. Talen bruger altså tiderne retorisk: fortiden hører til modstanderen, nutiden og fremtiden til hende selv.",
      feedback: "Kobl gerne tempus til retorikken, når du er til eksamen: det viser, at du kan bruge grammatikken i en analyse og ikke kun genkende former.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "g7-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Hvis vi vil have unge til at blive i byen, skal vi gøre det nemt at komme frem.",
        parts: [
          { text: "Hvis vi vil have unge til at blive i byen,", type: "led" },
          { text: "skal vi gøre det nemt at komme frem.", type: "hoved" },
        ],
        indleder: "hvis",
        funktion: "adverbial",
        explain: "'Hvis vi vil have unge til at blive i byen' er ledsætningen: ikke-testen giver 'hvis vi IKKE vil have', altså 'ikke' mellem subjekt og verballed. Den indledes af konjunktionen 'hvis' og er adverbial (betingelse). Fordi den står først, får hovedsætningen omvendt ledstilling: 'skal vi'.",
      },
      points: [
        "Markerer betingelsessætningen som ledsætning og resten som hovedsætning.",
        "Bruger ikke-reglen på begge dele.",
        "Finder indlederen 'hvis'.",
        "Siger, at ledsætningen er adverbial (betingelse).",
      ],
      modelAnswer: "Hovedsætning: 'skal vi gøre det nemt at komme frem' : 'skal vi ikke gøre' viser, at 'ikke' står efter det bøjede verbum. Ledsætning: 'Hvis vi vil have unge til at blive i byen' : 'hvis vi ikke vil have' viser, at 'ikke' står mellem subjekt og verballed. Indlederen er 'hvis', og ledsætningen er adverbial, fordi den angiver en betingelse for hovedsætningen.",
      feedback: "Betingelsessætninger med 'hvis' er en favorit i taler, fordi de sætter et krav op og lover en gevinst. Husk ledfunktionen : den halve opgave ligger der.",
      examTip: ADVICE.hovedled,
    },
  ],
};

// Sæt 8. Ejendomsannonce : den sidste af de fem genrer fra skolens liste.
const SAT_8_EJENDOMSANNONCE: ExamSatsT = {
  id: "hhx-sats-08",
  title: "Eksamenssæt 8 · Charmerende byhus med overkommelig have",
  schoolLabel: "Risskov · HHX",
  minutes: 40,
  intro: SAT_INTRO,
  article: {
    title: "Charmerende byhus med overkommelig have",
    byline: "Boligannonce hos Nørreby Bolig (fiktiv mægler) ; udarbejdet af ejendomsmægler Jonas Friis ; maj 2026",
    paragraphs: [
      "Tæt på skole, bus og indkøb ligger dette charmerende byhus fra 1936. Boligen er autentisk og venter på nye ejere med lyst til at sætte deres eget præg.",
      "Stueetagen byder på et hyggeligt køkken og en stue med originale detaljer. Huset giver familien masser af plads i hverdagen, og fra spisepladsen er der udgang til terrassen.",
      "Førstesalen rummer to værelser og et badeværelse. Ejeren har renoveret badeværelset i 2024, mens resten af huset har et mindre renoveringsbehov.",
      "Haven er overkommelig og vender mod syd. Her er der plads til et bord, et bed og en cykel eller to.",
      "Vi viser boligen frem på søndag mellem 11 og 13. Kom forbi, hvis du vil se et utraditionelt hjem med sjæl.",
    ]
  },
  tasks: [
    {
      id: "g8-op1",
      no: 1,
      label: "Genre",
      category: "genrer",
      prompt: "Genretræk: Hvilken genre er teksten?",
      hint: METHOD.genre,
      part: {
        kind: "genre",
        correct: "ejendomsannonce",
        justify: {
          id: "begrundelse",
          label: "Hvordan kan du se det?",
          help: "(brug mindst én ting fra teksten)",
          placeholder: "Fx: Teksten vil overbevise os om..., fordi den bruger...",
          rows: 3,
        },
      },
      points: [
        "Placerer teksten som sagprosa med et salgsformål.",
        "Bestemmer genren som ejendomsannonce.",
        "Begrunder med bylinen: skrevet af en ejendomsmægler.",
        "Peger på de forskønnende ord, der dækker over svagheder.",
      ],
      modelAnswer: "Teksten er en ejendomsannonce: afsenderen er en ejendomsmægler, opbygningen følger boligen etage for etage, og den slutter med et fremvisningstidspunkt. Genren kendes især på ordvalget: 'autentisk' og 'originale detaljer' betyder, at der ikke er renoveret, 'overkommelig have' betyder lille, og 'et mindre renoveringsbehov' er en forskønnende omskrivning. Formålet er at sælge.",
      feedback: "Annoncen kan ligne en informerende tekst, fordi den oplyser om kvadratmetre og etager. Forskellen er, at hvert ord er valgt for at sælge. Kig efter eufemismerne: de er genrens tydeligste kendetegn.",
      examTip: ADVICE.genre,
    },
    {
      id: "g8-op2",
      no: 2,
      label: "Kommunikationssituation",
      category: "kommunikation",
      prompt: "Kommunikationssituationen (Ciceros pentagram)",
      hint: METHOD.kommunikation,
      openEnded: true,
      part: { kind: "fields", fields: PENTAGRAM_FIELDS },
      points: [
        "Afsender: ejendomsmægleren på sælgerens vegne : ikke en neutral beskriver.",
        "Emne: et byhus fra 1936 til salg.",
        "Modtager: boligsøgende, her især en familie med børn.",
        "Situation: boligmarkedet, fremvisning på søndag.",
        "Formål: at sælge huset ved at få folk til fremvisningen.",
      ],
      modelAnswer: "Afsenderen er ejendomsmægler Jonas Friis, som skriver på sælgerens vegne og derfor har en økonomisk interesse i teksten. Emnet er et byhus fra 1936. Modtagerne er boligsøgende, og især børnefamilier: teksten nævner skole, plads i hverdagen og to værelser. Situationen er en forestående fremvisning på søndag, så teksten skal virke NU. Genren er annoncen, og sproget er positivt ladet hele vejen igennem. Formålet er at sælge : første skridt er at få læseren til fremvisningen.",
      feedback: "Vær præcis med afsenderen: mægleren skriver, men sælgeren betaler. Det forklarer, hvorfor intet i teksten er neutralt beskrevet.",
      examTip: ADVICE.kommunikation,
    },
    {
      id: "g8-op3",
      no: 3,
      label: "Sproglige særtræk",
      category: "semantik",
      prompt: "Sproglige særtræk",
      hint: METHOD.saertraek,
      openEnded: true,
      part: { kind: "fields", fields: SAERTRAEK_FIELDS },
      points: [
        "Nævner mindst tre træk med citat.",
        "Peger på eufemismerne: autentisk, overkommelig, mindre renoveringsbehov.",
        "Bruger fagbegreberne: konnotation, eufemisme, semantisk felt, adjektiver.",
        "Forklarer virkningen: svagheder bliver til charme.",
      ],
      modelAnswer: "Annoncen er fuld af adjektiver med positiv ladning: 'charmerende', 'hyggeligt', 'originale'. De vigtigste træk er eufemismerne, altså de forskønnende omskrivninger: 'autentisk' og 'originale detaljer' dækker over, at huset ikke er renoveret, 'overkommelig have' betyder en lille have, og 'et mindre renoveringsbehov' gør et arbejde til en detalje. Det semantiske felt er hjem og hygge (køkken, terrasse, sjæl), mens ord om pris og stand er næsten fraværende. Sætningerne er korte og parataktiske, så teksten kan skimmes.",
      feedback: "I en annonce er det mest interessante tit det, der IKKE står. Kig efter, hvad de positive ord dækker over, og sig, hvad et neutralt ord ville have været.",
      examTip: ADVICE.saertraek,
    },
    {
      id: "g8-op4",
      no: 4,
      label: "Morfologi",
      category: "morfologi",
      prompt: "Morfologisk analyse",
      hint: METHOD.morfologi,
      part: {
        kind: "morphology",
        words: [
          {
            word: "overkommelig",
            split: "over-komme-lig",
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Suffikset (afledningsendelsen)", placeholder: "Fx -hed", answer: "-lig", accepts: ["lig"] },
            explain: "over- (præfiks) + komme (rodmorfem) + -lig (suffiks, der laver adjektivet).",
          },
          {
            word: "badeværelset",
            split: "bade-værelse-t",
            splitAccepts: ["bad-e-værelse-t", "bade-værels-et"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Bøjningsendelsen (fleksiv)", placeholder: "Skriv morfemet her", answer: "-t", accepts: ["t", "-et", "et"] },
            explain: "bade + værelse er rodmorfemerne, og -t er fleksiven (bestemt form ental i intetkøn).",
          },
          {
            word: "renoveringsbehov",
            split: "renover-ing-s-behov",
            splitAccepts: ["renovering-s-behov"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Bindebogstavet", placeholder: "Fx -e-", answer: "-s-", accepts: ["s", "-s"] },
            explain: "renover (rodmorfem) + -ing (suffiks, der laver substantivet) + -s- (bindebogstav) + behov (rodmorfem).",
          },
          {
            word: "utraditionelt",
            split: "u-tradition-el-t",
            splitAccepts: ["u-traditionel-t"],
            splitPlaceholder: "Fx stol-e-ben",
            ask: { label: "Præfikset (forstavelsen)", placeholder: "Skriv morfemet her", answer: "u-", accepts: ["u"] },
            explain: "u- (præfiks, der nægter) + tradition (rodmorfem) + -el (suffiks, der laver adjektivet) + -t (fleksiv).",
          },
        ],
      },
      points: [
        "Deler ordene med bindestreger og navngiver delene.",
        "Kender de fire slags morfemer og bindebogstavet.",
        "Ser, at -ing og -lig er afledninger, mens -t er bøjning.",
        "Kan forklare, hvad hver del gør ved ordet.",
      ],
      modelAnswer: "'overkommelig' = over + komme + -lig, hvor suffikset laver adjektivet. 'badeværelset' = bade + værelse + -t: sammensat plus bøjning. 'renoveringsbehov' = renover + -ing + s + behov: afledning, bindebogstav og sammensætning i ét ord. 'utraditionelt' = u- + tradition + -el + -t: præfiks, rod, afledning og bøjning.",
      feedback: "Annoncesprog er fyldt med lange sammensatte ord : de er gode morfologi-opgaver, fordi de indeholder flere lag. Del først i de dele, der kan stå alene.",
      examTip: ADVICE.morfologi,
    },
    {
      id: "g8-op5",
      no: 5,
      label: "Syntaktisk analyse",
      category: "saetningsled",
      prompt: "Syntaktisk analyse (sætningsanalyse)",
      hint: METHOD.syntaks,
      part: {
        kind: "analysis",
        sentence: "Huset giver familien masser af plads i hverdagen.",
        chunks: ["Huset", "giver", "familien", "masser af plads", "i hverdagen"],
        correctMap: ["subjekt", "verbal", "dativ", "objekt", "adverbial"],
        explain: "Huset = subjekt, giver = verballed, familien = indirekte objekt (til hvem?), 'masser af plads' = direkte objekt (hvad gives?), 'i hverdagen' = adverbial (tid). Præpositionsgruppen 'af plads' hører med til 'masser' og er ikke et selvstændigt led.",
      },
      points: [
        "Verballed: giver.",
        "Subjekt: Huset.",
        "Indirekte objekt: familien.",
        "Direkte objekt: masser af plads (hele gruppen).",
        "Adverbial: i hverdagen.",
      ],
      modelAnswer: "Verballeddet er 'giver', subjektet er 'Huset'. 'familien' er indirekte objekt (til hvem gives pladsen?), og 'masser af plads' er direkte objekt : præpositionsgruppen 'af plads' beskriver 'masser' og hører derfor med i samme led. 'i hverdagen' er adverbial.",
      feedback: "Den typiske fejl er at skille 'masser' og 'af plads' ad. Test det ved at flytte leddet: de flytter sammen, altså er det ét led.",
      examTip: ADVICE.syntaks,
    },
    {
      id: "g8-op6",
      no: 6,
      label: "Verballedets tid",
      category: "tempus",
      prompt: "Verballedets tid",
      hint: METHOD.verbaltid,
      part: {
        kind: "tense",
        items: [
          {
            id: "t1",
            sentence: "Ejeren har renoveret badeværelset i 2024.",
            verb: "har renoveret",
            correct: "perfektum",
            rewriteTo: "praeteritum",
            rewriteAnswer: "Ejeren renoverede badeværelset i 2024.",
            rewriteKeys: ["renoverede"],
            explain: "'har renoveret' er perfektum (førnutid): hjælpeverbet i præsens + participium. I præteritum bliver det ét ord: 'renoverede'. Annoncen vælger perfektum, fordi den gør renoveringen til noget, der stadig gælder.",
          },
          {
            id: "t2",
            sentence: "Vi viser boligen frem på søndag mellem 11 og 13.",
            verb: "viser",
            correct: "praesens",
            rewriteTo: "perfektum",
            rewriteAnswer: "Vi har vist boligen frem på søndag mellem 11 og 13.",
            rewriteKeys: ["har", "vist"],
            explain: "'viser' er præsens, selvom handlingen ligger i fremtiden : tidsadverbialet 'på søndag' gør fremtiden tydelig. Perfektum ville hedde 'har vist'.",
          },
        ],
      },
      points: [
        "Bestemmer tiderne: perfektum og præsens.",
        "Omskriver korrekt til præteritum og perfektum.",
        "Nævner, at dansk kan bruge præsens om fremtiden med et tidsadverbial.",
        "Kan forklare, hvorfor annoncen vælger perfektum om renoveringen.",
      ],
      modelAnswer: "'har renoveret' er perfektum, fordi hjælpeverbet står i præsens og hovedverbet i participium ; i præteritum hedder det 'renoverede'. 'viser' er præsens, men betydningen er fremtidig på grund af 'på søndag'. Valget er ikke tilfældigt: perfektum får renoveringen til at gælde nu, og præsens gør fremvisningen nærværende.",
      feedback: "Husk forskellen på præteritum og perfektum: præteritum lukker handlingen inde i fortiden, mens perfektum trækker den frem til nu. Det er præcis derfor, annoncer elsker perfektum.",
      examTip: ADVICE.verbaltid,
    },
    {
      id: "g8-op7",
      no: 7,
      label: "Hoved- og ledsætninger",
      category: "syntaks",
      prompt: "Hoved- og ledsætninger",
      hint: METHOD.hovedled,
      part: {
        kind: "clause",
        sentence: "Kom forbi, hvis du vil se et utraditionelt hjem med sjæl.",
        parts: [
          { text: "Kom forbi,", type: "hoved" },
          { text: "hvis du vil se et utraditionelt hjem med sjæl.", type: "led" },
        ],
        indleder: "hvis",
        funktion: "adverbial",
        explain: "'Kom forbi' er hovedsætningen : en imperativ, der kan stå alene. 'hvis du vil se et utraditionelt hjem med sjæl' er ledsætningen: 'hvis du IKKE vil se' viser, at 'ikke' står mellem subjekt og verballed. Indlederen er 'hvis', og ledsætningen er adverbial (betingelse).",
      },
      points: [
        "Markerer imperativen som hovedsætning.",
        "Markerer hvis-sætningen som ledsætning.",
        "Bruger ikke-reglen på begge dele.",
        "Siger, at ledsætningen er adverbial (betingelse).",
      ],
      modelAnswer: "Hovedsætning: 'Kom forbi' : en bydeform, der kan stå alene. Ledsætning: 'hvis du vil se et utraditionelt hjem med sjæl' : ikke-testen giver 'hvis du IKKE vil se', altså 'ikke' mellem subjekt og verballed. Den indledes af 'hvis' og fungerer som adverbial, fordi den angiver betingelsen for at komme forbi.",
      feedback: "Imperativer har ikke noget synligt subjekt, men de er stadig hovedsætninger. Test dem med 'ikke': 'Kom ikke forbi' : 'ikke' står efter verbet.",
      examTip: ADVICE.hovedled,
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
  SAT_7_POLITISK_TALE,
  SAT_8_EJENDOMSANNONCE,
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
