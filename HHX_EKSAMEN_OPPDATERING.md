# HHX Eksamensprøve + latinske terminologi - overlevering (runde 1 + 2)

Dette dokument beskriver alle ændringer, der skal portes til det virkelige
repository (dette er en testkopi). Indhold er 100 % selvdigtet : der er ingen
ophavsretlige tekster eller citatgrundlag fra virkelige aviser nogen steder.

Kernekravene fra Anne/lærer (gælder begge runder) :
- "Eksamensprøve" under fanen Prøve (kun HHX) : artikel -> spørgsmål, fast ur
  (40 min), klokke + tvungen aflevering når tiden går, blok-baserede svar
  (intet skriveformat krævet), per-spørgsmåls "?"-hint der KUN forklarer
  metoden (aldrig facit), artikel-annotationer (tusch/led/ordklasse), resultat
  med disclaimer først, karakter, gemme-panel, AI-aflevering, gennemgang.
- Gemme-panellets tekst (bogstaveligt krav) : "Vil du gemme din prøve? Kopier
  din besvarelse til tekst her! Husk at indsætte det i et dokument".
- Latinske betegnelser er PRIMÆRE (subjekt, verballed, direkte/indirekte
  objekt, adverbial, subjektsprædikat, objektsprædikat) med dansk i parentes,
  og uden tekstlige symbolbeskrivelser : rigtige gliffer/ikoner i stedet.
- AP findes kun på STX/HHX ; aldrig HTX-specifikt. STX = rød, HHX = blå
  (EDU_THEMES). "Risskov HTX" i input behandles som HHX.
- Al analyse/genre-brug genbruger eksisterende elementer (syntaks-komponenten
  og de 7 led-symboler bruges i eksamenssættets analyseopgaver).

## 1. Hvad er nyt i appen (runde 1)

### A. Eksamensprøve (kun HHX) : "rigtig eksamen"-flow under fanen Prøve
- Data : `src/data/hhx/examSats.ts` (typen `ExamSatsT` i `src/types.ts`).
- Skærm : `src/screens/ExamSats.tsx` - intro -> prøve (ur, artikel-pane,
  blok-svar) -> aflevering -> karakter -> gemme-panel -> Copilot-panel ->
  gennemgang pr. spørgsmål med feedback + examTip.
- Artikel-pane med annotationer : `src/components/exam/ExamArticlePane.tsx`
  (tusch-farver, led- og ordklasse-mærkater på ord; skitseblok, ikke facit).
- Bedømmelse : 7-trinsskala som spejler "Din udvikling" (pct -> 12/10/7/4/
  02/00/-3) ; choice = eksakt, multi = mængde-lighed, wordclass/analysis =
  alt-eller-intet.

### B. Eksamensform-præcisering
- `src/data/hhx/examFormats.ts` + `src/components/exam/ExamFormatSheet.tsx` :
  "Sådan foregår din eksamen"-banner øverst under Prøve, åbner sheet med
  forløb, indhold og bedømmelse. (I runde 2 blev dette skole-bevidst, se 6B.)

### C. Terminologi-sweep (Anne)
- Hele opgavebanken (data/almen/*, data/latin/*, teaching, hhx-data) er
  gennemgået : latinsk betegnelse først, dansk i parentes. "Cirkel med trekant
  i midten"-tekster er slettet til fordel for glifferne (×, ○, △, □, 〰, ⊗)
  eller "eget symbol", hvor ikonet allerede vises.

## 2. Verifikation (runde 1)
- typecheck/lint/build + datatjek : grønt. Data-tjekket ligger i repoet som
  `scripts/exam-data-check.mts` og køres fra roden :
  `node --experimental-strip-types scripts/exam-data-check.mts`.

---

# RUNDE 2 : Opfølgende feedback (Copilot, skoler, 6 sæt, vagter)

Denne sektion dækker den anden feedback-runde. Alt fra runde 1 gælder stadig, medmindre andet er nævnt her.

## 6A. ChatGPT er væk : alt AI-kalder Microsoft Copilot
- `src/components/AskAi.tsx`: "Spørg AI" dyber-link er `https://copilot.microsoft.com/?q=<tekst>`; alle tekster siger Copilot.
- Eksamenssættets AI-aflevering (ExamSats) åbner `https://copilot.microsoft.com/` efter kopiering af censor-prompten.
- Ingen andre AI-afsendere/reklamer for andre tjenester end "en AI efter eget valg" i kopiér-tekster (krav 5 beder netop om, at man må bruge VALGFRI AI til det rene kopiér-arbejde; knapper/links peger kun på Copilot).

## 6B. Skole-modellen : "vis KUN din skoles eksamensform"
- NY `src/data/schools.ts`: `SCHOOLS` (Risskov HHX -> format "risskov-hhx"; Egå Gymnasium STX -> "ega-stx"), `UNKNOWN_SCHOOL_ID = "unknown"`, `schoolsFor(education)`, `getSchool(id)`, `schoolMatchesEducation(id, education)`. Ingen persondata; kun skolevalg gemmes lokalt, påpeget i UI'et.
- `src/data/hhx/examFormats.ts` SKREVET OM: `EXAM_FORMATS` er nu keyed efter formatId (ikke `.hhx`/`.stx`). Hjelpefunktioner: `formatsForEducation(edu)`, `formatForSchoolId(id)`, konstanterne `EXAM_FORMAT_INTRO` og `EXAM_FORMAT_OTHER_NOTE`. Alle brugere af de gamle nøgler (Exam.tsx) er opdateret.
- NY `src/components/onboarding/SchoolStep.tsx` (delt): skolekort for sporet + knappen "Min skole er ikke på listen", som folder en liste af SPRETS EGENE eksamensformer ud (HHX: kun Risskov for nu; STX: kun Egå) + privatlivets note.
- `ExamFormatSheet.tsx` SKREVET OM: pr. skole : kender appen elevens skole, vises kun det skoles form; ellers sporets liste + amber note om, at former kan variere. Props: `{ education, schoolId?, onClose }`.
- `Progress` har ny felt `school: string | null` (types.ts). `progress.ts`: default `null`; loadProgress-migrering (se 6D); `setSchool()`; `needsSchoolChoice(p) = p.onboarded && !p.school`; `setEducation()` nulstiller skole, der ikke matcher sporet; `completeOnboarding(p, education, nickname, school = null)`.
- Velkomstflow (`Welcome.tsx`): 3 trin (uddannelse -> SKOLE -> navn). Skolentrinet skal besvares (knappen er låst, til en skole/"anden skole" er valgt; "anden skole" gemmes som id "unknown" = bevidst valg, ingen gate bagefter).
- NY `src/screens/SchoolGate.tsx`: fuldskærms-"vælg din skole"-screen, som AploftApp viser FØR appen renderes, når `needsSchoolChoice(progress)` (eksisterende brugere + spor-skiftere). `onDone` kalder `setSchool` og sender til home.
- `Profile.tsx`: ny "Skole"-boks under Indstillinger med nuværende valg + modal (genbruger SchoolStep) til at skifte; prop `onSetSchool` wires i AploftApp. Skifter man spor i Profile, nulstilles skolevalget automatisk, og gate-skærmen dukker op for det nye spor.

## 6C. Prøvernes indhold : 6 sæt, rotation, "alle er prøvet"-forklaring
- `src/data/hhx/examSats.ts`: 5 NYE原创-sæt ud over det gamle (i alt 6 ; alle tekster er digtede, fiktive medier/personer/tal, ingen ophavsret) : "Det grønne skifte" (nyhedsreferat), "Pension som nyansat" (advertorial), "Kiosken, kantinen og principperne" (læserbrev), "AI i skoletasken" (skolebladsleder), "Din overenskomst" (fagforenings-medlemsnyt). Hvert sæt: 9-10 spørgsmål, fulde hint/feedback/examTip, latinske led-begreber, analyse-sætning SOM STÅR i artiklen, ordklasse-ord DER ER i artiklen (verificeret af `scripts/exam-data-check.mts`, som nu kører ALLE sæt).
- Ny eksport `pickNextExamSats(usedIds, lastSatsId)`: tilfældigt UBRUGT sæt først; er alle brugt, tilfældigt sæt != sidst brugte, med `allUsed: true`-flag.
- NY `src/lib/examSatsStorage.ts`: localStorage-nøgle `aploft.examsats.used.v1` = `{ usedIds, lastId }`. Markeres NÅR PRØVEN STARTES (ikke ved aflevering). `clearExamSatsUsage()` kaldes fra Profil-reset (AploftApp).
- Intro-skærmen på Eksamensprøven viser "Sæt prøvet før : X af 6" og, når alt er brugt, en amber boks der FORKLARER hvorfor gentagelser kan forekomme (krav: "brugeren skal fortælles det"). Resultat-knappen hedder derefter "Tag en ny prøve (puljen er blandet)".

## 6D. Migration for eksisterende brugere (DOUBLET CHECKET)
Kontrakt: alle gamle payloads (skolefelt fraværende, tomt eller ugyldigt) => `school: null` => skole-gaten vises ÉN gang. Nye brugere uden for velkomstflowet (ikke-onboardede) ser aldrig gaten før efter onboarding. "unknown" tæller som valgt (ingen gate).
Verifikation: midlertidig tsx-test mod det EKSISTERENDE `src/lib/progress.ts` med stubbed localStorage (11 scenarier: gammel payload uden school, ikke-onboardet, bevaret skole, unknown, skrot-type, save/load-roundtrip, sporskift hhx->stx og retur, onboarding med/uden skole) : ALLE 11 OK. Kør selv: lav en tilsvarende test med `npx tsx` (node --experimental-strip-types kan ikke bruge eksensions-løse imports i repo-filerne), husk at stubbe `globalThis.localStorage` (modulen bruger det bare global, ikke window.localStorage).

## 6E. "Er du sikker"-vagter + glattere overgange
- Start: bade Eksamensprøven (sats) og prøve-generatoren har bekræftelses-dialog før start ("Er du sikker på, at du vil starte prøven?" med uret-langde/spørgsmåls-antal og advarsel om, at afbrydet session ikke gemmes). Spring-fjeder-animation på modalen.
- Afgang undervejs: `AploftApp` holder `sessionActive` (Practice melder via ny prop `onSessionChange` når view === "session"; Exam melder for quiz-phase OG vidererapporterer ExamSats' session via `onSessionChange`). Mens aktiv: al navigation via BottomNav/Home-genveje/Profile går gennem `requestNavigate()`, som åbner bekræftelses-modal ("din fremgang i netop den opgave gemmes ikke") før sideskift.
- Practice's "Afbryd"-knap får egen bekræftelses-modal (progress i sessionen mistes; enkelte rigtige/forkerte svar er Already talt i statistik).
- Aflevering af sats-Prøve: ny "Lingua retter prøven"-fase (~2,6 s, rolig ticker + progressbar, reduceret motion: 0,9 s) FØR resultat-skærmen; resultatet er beregnet under overgangen. Resultatet har nu Mascot med karakter-tilpasset tale, hero med karakter, statistikbånd (rigtige/forkerte/ikke besvaret/tid brugt) ovenover kopiér- og AI-panelerne.

## 6F. Kopiér opgave + svar til en VALGFRI AI (også quiz-prøver)
- NY `src/lib/examCopy.ts`: `buildQuizCopyText()`/`buildQuizAiPrompt()` for prøve-generatorens `SavedAnswer`-former (choice, click-word, analysis med led-symboler, build-sentence, write, table-fill) + `copyTextToClipboard()` med execCommand-fallback.
- `Exam.tsx`'s resultat-fase har nyt panel: "Vil du have feedback på dine ordrette svar?" med kopiér-knap (opgaver + SVARENE, aldrig facit). Bekræftelses-dialogen deles via `startConfirmModal`-konstanten (bruges fra både setup og "Prøv igen").
- Sats-prøvens kopiér-panel (runde 1) er beholdt ordret.

## 6G. Symbol-tekster fjernet (Anne)
- Alle "cirkel med trekant i midten"-agtige beskrivelser i data er erstattet af selde gliffer (×, ○, △, □, 〰, ⊗) eller "eget symbol" hvor SVG-ikonet allerede vises (saetningsled-learnere, teaching-tekster). Grep efter "cirkel med" i src/data giver nul forekomster uden for kode-kommentare.

## 6H. Verifikation af runde 2 (kør efter port)
- `npm run typecheck` : ren.
- `npm run lint` : 7 fejl = UPSTREAM-baseline (GuidedTour 131/167, DarkModeToggle 18, AploftApp 56/69, Lynkursus 444 x2) + 1 warning (TaskRenderer exhaustive-deps). IKKE noget nyt fra disse ændringer.
- `npm run build` : grøn.
- `node --experimental-strip-types scripts/exam-data-check.mts` : "ALL CHECKS PASSED" for alle 6 sæt.
- Migrationstest (6D) : 11/11 OK.

---

# RUNDE 3 : Eksamensprøven følger nu skolens RIGTIGE eksamensark (7 opgaver)

Denne runde retter den fejl, at eksamensprøven var blevet til 10 multiple
choice-spørgsmål. Den rigtige form på Risskov er:

> Du trækker en ukendt tekst med **7 opgaver**. Du har **40 minutter** i et
> forberedelseslokale (tilsynsførende, egne noter, bøger og ordbog/ordnet.dk,
> notepapir med ind, ingen computer medmindre aftalt). Derefter **12-15
> minutters mundtlig eksamen** hos læreren + en censor (en anden sproglærer),
> uddybende spørgsmål, ca. 5 minutters votering, og karakteren kommer på
> eksamensbeviset og tæller i gennemsnittet. Eksamen ligger i uge 45.
>
> De 7 opgaver: 1) genretræk, 2) kommunikationssituation (Ciceros pentagram),
> 3) sproglige særtræk, 4) morfologisk analyse, 5) sætningsanalyse,
> 6) verbaltider, 7) hoved- og ledsætninger.

AP-lærerens melding er fulgt: **opgave 2 og 3 har mange rigtige svar** og er
individuelle fra tekst til tekst, så de rettes aldrig automatisk (de er mærket
`openEnded`), mens **opgave 4-7** (morfologi, syntaks, verballeddets tid,
hoved-/ledsætninger og de latinske begreber) vægtes tungest i de opgaver,
appen retter : mindst 6 af delspørgsmålene pr. sæt ligger i opgave 4-7, og
datatjekket håndhæver det.

## 9A. Hver opgave har to dele (fritekst + delspørgsmål)

Kravet var både at kunne forberede sig som til den rigtige eksamen OG at få en
karakter i appen. Derfor:

1. **Fritekst-felt** pr. opgave ("Din besvarelse (den du skal kunne sige
   mundtligt)") med opgavespecifik pladsholder. Den kan appen ikke rette, men
   den kommer med i kopiér-teksten og i AI-prompten.
2. **Delspørgsmål (`checks`)** under hver opgave: valg, multiple-valg,
   ordklasse-taps og led-symboler (præcis de samme widgets som før).
   **Karakteren bygger KUN på dem.**

`?`-knappen ved hver opgave forklarer metoden trin for trin (fra skolens
skabelon: genretrin, pentagrammet, lagene i sproglige særtræk, morfem-typerne,
analysepilen, tiderne, ikke-reglen) og afslører aldrig facit.

## 9B. Filer der er ændret

| Fil | Ændring |
|---|---|
| `src/types.ts` | `ExamQuestionT` er erstattet af `ExamTaskT` (no 1-7, label, prompt, hint, placeholder, points[], modelAnswer, feedback, examTip, openEnded, checks[]) + `ExamCheckT` (choice/multi/wordclass/analysis med id, prompt, feedback). `ExamSatsT.questions` → `ExamSatsT.tasks`. |
| `src/data/hhx/examSats.ts` | Skrevet om: de 6 tekster er BEHOLDT ordret, men hver har nu 7 opgaver i skolens rækkefølge. Fælles `METHOD`/`ADVICE`-konstanter (metode-hints + råd til den mundtlige eksamen) og fælles `SAT_INTRO`. De gamle spørgsmål er genbrugt som delspørgsmål under den rigtige opgave, og der er skrevet nye til morfologi, verbaltider, subjektsprædikat/objektsprædikat og hoved-/ledsætninger. 15-17 delspørgsmål pr. sæt. |
| `src/screens/ExamSats.tsx` | Bygget om til opgavekort med fritekst + delspørgsmål. Delpoint (ordklasse- og led-opgaver koster ikke hele opgaven ved én fejl), mildere karakterskala (12 ≥ 85 %, 10 ≥ 72, 7 ≥ 56, 4 ≥ 40, 02 ≥ 28, 00 ≥ 14), resultatside med rammesætning → vejledende karakter → statistikbånd → gemme-panel → AI-panel → gennemgang med elevens eget svar, checkliste ("Ret dig selv"), modelsvar, rettede delspørgsmål og eksamensråd. Adgangsvagt indbygget. |
| `src/data/hhx/examFormats.ts` | Risskov-beskrivelsen er skrevet om til den rigtige form (mundtlig eksamen med 40 min forberedelse, 7 opgaver, hjælpemidler, censor, votering, uge 45) + lærerens vægtning af opgave 2-3 vs. 4-7. |
| `src/data/schools.ts` | NY prøve-opdeling: `SchoolExamId`, `HHX_EXAM_SATS_ID`, `SCHOOL_EXAM_LABELS`, `SchoolDef.exams[]`, `examsForSchool()`, `schoolCanTakeExam()`, `canTakeExamSats(schoolId, education)`, `schoolsWithExam()`. Risskov har `["hhx-ap-eksamensproeve"]`, Egå har `[]`. |
| `src/screens/Exam.tsx` | Eksamensprøve-kortet vises kun ved `canTakeExamSats(...)`. Ellers et forklarende kort ("skolebestemt"), der siger hvilke skoler der har prøven, og hvad man kan bruge i stedet. Teksten om "delprøve 1" er rettet, da formen ikke er sådan. |
| `src/components/onboarding/SchoolStep.tsx` | Hvert skolekort viser, om skolens eksamensprøve findes i appen ; "anden skole" får en amber-note om, at eksamensprøven ikke kan tages der. |
| `src/components/exam/ExamFormatSheet.tsx` | Viser "Prøver for <skole>" under formen. |
| `scripts/exam-data-check.mts` | Skrevet om: 7 opgaver i fast rækkefølge, unikke id'er, modelsvar/checkliste til stede, hint afslører ikke modelsvaret, citater i opgave- og delspørgsmålstekster SKAL stå i teksten (også når citatet springer noget over med ...), ord i "klik på ordene"-opgaver skal findes i teksten, og mindst 6 delspørgsmål i opgave 4-7. |

## 9C. Skolerne er delt op efter, hvilke prøver de kan tage

`SchoolDef.exams` er den nye kilde til sandhed. Reglen er, at en
eksamenssimulering kun må vises for elever på den skole, hvis eksamensark den
er bygget efter : eksamensformen er forskellig fra skole til skole, og en
forkert simulering er værre end ingen.

- **Risskov (HHX)**: har `hhx-ap-eksamensproeve` → kortet "Eksamensprøve" vises.
- **Egå Gymnasium (STX)**: ingen prøver endnu → kun prøvegeneratoren.
- **"Anden skole" / intet skolevalg**: ingen adgang, med forklaring i UI'et.

Adgangen tjekkes to steder: i `Exam.tsx` (kortet vises ikke) og i
`ExamSats.tsx` (defensiv vagt, hvis skærmen alligevel åbnes). Ny skole med
samme form? Tilføj `HHX_EXAM_SATS_ID` i dens `exams` : intet andet skal røres.

## 9D. Karakteren : mild, men fagligt sigende

- Karakteren kommer KUN fra delspørgsmålene, og det står tydeligt tre steder
  (intro, resultatets rammetekst og under selve karakteren).
- Ordklasse-, multi- og led-opgaver giver **delpoint**, så én forkert
  ordklasse ikke koster hele opgaven.
- Skalaen er mildere end prøvegeneratorens (se 9B), men 12 skal stadig
  fortjenes.
- Resultatsiden siger eksplicit, at den mundtlige del ikke kan bedømmes, og at
  fritekst-svarene skal til AI'en for at få feedback.
- AI-prompten beskriver hele eksamensformen (7 opgaver, mundtlig eksamen) og
  beder om en mild, men præcis vurdering + gennemgang opgave for opgave, og
  den fortæller AI'en, at opgave 2 og 3 har mange rigtige svar.

## 9E. Verifikation (kørt i denne session)

- `npm run typecheck` : ren.
- `npm run lint` : 7 fejl + 1 warning = **uændret upstream-baseline**
  (GuidedTour 131/167, DarkModeToggle 18, AploftApp 56/69, Lynkursus 444 x2,
  TaskRenderer exhaustive-deps). Intet nyt fra denne runde.
- `npm run build` : grøn.
- `node --experimental-strip-types scripts/exam-data-check.mts` :
  **ALL CHECKS PASSED** (6 sæt, 7 opgaver hver, 15-17 delspørgsmål pr. sæt,
  heraf 8 i grammatikdelen).
- Kørt i browser (Playwright mod `next start`): HHX + Risskov kan starte
  prøven, alle 7 opgaver har fritekst-felt + delspørgsmål, uret tæller,
  aflevering giver rettefase, karakter, gemme-tekst, AI-panel og gennemgang.
  Med skolen sat til "anden skole" vises det forklarende kort i stedet for
  eksamensprøven. Ingen konsolfejl (ud over proxyens certifikat-advarsler for
  eksterne fonte).


---

# RUNDE 4 : Opgaverne har nu hver sin svarform (skolens eget ark)

Runde 3 gav alle syv opgaver det samme format (ét stort skrivefelt + løse
multiple choice-delspørgsmål). Det er rettet: **hver opgave har nu sin egen
svarform**, og sproget og begreberne følger skolens ark ordret.

| Opgave | Svarform i appen |
|---|---|
| 1 · Genretræk: Hvilken genre er teksten? | Liste med de fem genrer (politisk tale, ejendomsannonce, opinionsartikel, informerende artikel, reklame) : **kun genrenavnet, ingen "fordi ..."-forklaring i valgmulighederne** : plus feltet "Hvordan kan du se det? (brug mindst én ting fra teksten)". |
| 2 · Kommunikationssituationen (Ciceros pentagram) | Seks små felter: Afsender, Emne (indhold), Modtager, Situation (omstændigheder), Genre/Sprog og Formål (midten af pentagrammet), hver med hjælpetekst og "Skriv kort her...". |
| 3 · Sproglige særtræk | Ét felt: "Dine observationer (husk citater fra teksten)". |
| 4 · Morfologisk analyse | Fire ord fra teksten. Pr. ord: "Del ordet i morfemer (brug bindestreger)" + ét felt mere, hvor eleven trækker ÉT bestemt morfem ud (bøjningsendelsen, rodmorfemet, præfikset, suffikset eller bindebogstavet : det skifter fra ord til ord). |
| 5 · Syntaktisk analyse (sætningsanalyse) | Som før: sætningens klumper med de syv led-symboler. |
| 6 · Verballedets tid | To sætninger. Pr. sætning: "Hvilken tid står X i?" med knapperne Nutid / Datid / Førnutid / Førdatid / Fremtid + "Omskriv hele sætningen til <tid>". |
| 7 · Hoved- og ledsætninger | Én sætning delt i sine dele, som markeres hovedsætning/ledsætning, + "Hvilken indleder har ledsætningen?" + "Hvilken funktion har ledsætningen i hovedsætningen?" (Subjekt, Objekt, Adverbial, Subjektsprædikat, Attribut). |

## 10A. Datamodellen

`src/types.ts`: `ExamTaskT.checks` er erstattet af `ExamTaskT.part`, som er én af
`ExamGenrePartT`, `ExamFieldsPartT`, `ExamMorphologyPartT`, `ExamAnalysisPartT`,
`ExamTensePartT` og `ExamClausePartT`. Nye id-typer: `ExamGenreId`,
`ExamTenseId`, `ExamClauseFnId`. De faste lister ligger i
`src/data/hhx/examSats.ts` som `EXAM_GENRES`, `EXAM_TENSES` og
`EXAM_CLAUSE_FUNCTIONS` (+ `genreLabel`, `tenseLabel`, `tenseLatin`,
`clauseFnLabel`).

## 10B. Hvad der giver karakter

Karakteren kommer fra det, der kan rettes entydigt: genren, de otte morfem-svar
(fire ord x to felter), led-symbolerne, de to tidsvalg + to omskrivninger,
markeringen af hoved-/ledsætning, indlederen og ledfunktionen. Det er 21-23
point pr. sæt, og de ligger næsten alle i opgave 4-7, præcis som AP-læreren
anbefalede. Opgave 2 og 3 rettes aldrig (mange rigtige svar) : de er mærket
`openEnded` og sendes til AI-feedback sammen med resten.

Rettelsen er mild med vilje: store og små bogstaver, mellemrum, tankestreger og
tegnsætning er ligegyldige. Morfem-opdelinger accepterer flere gyldige
varianter (`splitAccepts`), enkeltmorfemer accepteres med og uden bindestreg, og
omskrivninger godkendes, når de rigtige verbumsformer er med (`rewriteKeys`).

## 10C. Datatjek (scripts/exam-data-check.mts)

Tjekker nu også, at svarformen passer til opgavenummeret, at alle fire
morfem-opdelinger giver ordet igen, når bindestregerne fjernes, at ordene og
sætningerne står i teksten, at omskrivningens nøgleord findes i facit OG ændrer
sig i forhold til den oprindelige sætning, at sætningsdelene i opgave 7 samlet
giver sætningen, at indlederen står i sætningen, og at **pladsholderne ikke
afslører facit** (den fangede tre steder, hvor "Fx -en" var selve svaret).
Resultat: ALL CHECKS PASSED for alle seks sæt.

## 10D. Verifikation

`npm run typecheck` ren · `npm run lint` uændret baseline (7 fejl + 1 warning) ·
`npm run build` grøn · datatjek grønt · kørt i browser mod `next start`: alle
syv opgavekort renderer med den rigtige svarform, aflevering giver karakter og
gennemgang med facit pr. delsvar, og ingen konsolfejl.


---

# RUNDE 5 : Elevernes og AP-lærerens tilbagemeldinger fra testrunden

Første rigtige brugerrunde på HHX Risskov (spørgeskema + AP-lærerens
gennemgang). Ændringerne deler sig i to: dem, der gælder BEGGE spor (UI og
kvalitet), og dem, der er INDHOLD fra skolens eget AP-materiale og derfor kun
ligger på HHX-siden.

## 11A. Gælder begge spor

| Ønske | Løsning |
|---|---|
| "Giv en beskrivelse hvis man svarer forkert" | Feedback-panelet viser nu elevens eget svar, hvorfor netop den svarmulighed er forkert (nyt `whyWrong`-felt pr. svarmulighed i `ChoiceTaskT`), hvad det rigtige svar var, og forklaringen. Klik-på-ord viser manglende og forkert klikkede ord ; sætningsanalyse viser valgt og korrekt symbol pr. led ; skrive- og tabelopgaver viser facit ved siden af elevens svar. |
| "Når man trykker på logoet, kommer man tilbage til hjem" | Logoet i `TopBar` er nu en knap, der navigerer til forsiden (gennem app-skallens navigations-vagt, så en igangværende prøve stadig advarer). |
| "Eleverne satte spørgsmålstegn ved AI-funktionen" | `AskAi`-knappen er fjernet helt fra alle opgaver, og komponenten er slettet. Hvor AI stadig kan bruges (kopiér-til-AI efter en prøve), står nu lærerens OBS om, at AI svarer misvisende om grammatik, især morfologi. |
| "Svaret var markeret med stort" / parenteser røbede facit | 50 opgaver havde forklarende parenteser eller store bogstaver, der pegede på det rigtige svar. Teksten er flyttet over i den nye feedback, så informationen ikke går tabt. `scripts/option-leak-check.mts` finder mønstrene igen (parentes-tell, store bogstaver, facit dobbelt så langt). |
| Faglige fejl | `saetled-17`: 'legede' er ikke et kopulaverbum, så 'glade' kunne ikke være subjektsprædikat : sætningen er lavet om. `saetled-49`: 'ansvarlig for fejlen' er ét objektsprædikat, ikke prædikat + adverbial. `saetled-29`: verberne opgives nu i infinitiv (være, blive, hedde, synes). Alle morfologi-opgaver har fået klarere forklaringer. |

## 11B. Kun HHX (indhold fra skolens AP-materiale)

**Læseside før opgaverne.** Åbner en HHX-elev et emne under Øv dig, møder hun
nu en kort informationsside, før opgaverne starter (og kan altid åbne den igen
fra emnets forside). Siden har et diagram, "det skal du kunne bagefter",
begreberne med de latinske betegnelser først, den typiske fælde og lærerens
OBS, hvor den er relevant.

- `src/data/hhx/emneIntro.ts` : indholdet pr. emne. `getEmneIntro(category, education)` returnerer null for STX.
- `src/components/teaching/EmneIntro.tsx` : selve siden.
- `src/components/teaching/Diagrams.tsx` : syv diagrammer tegnet som inline-SVG (analysepilen, morfem-modellen, tiderne, ikke-reglen, ordklasse-oversigten, Ciceros pentagram og genrelisten). De bruger `currentColor`, så de virker i både lys og mørk tilstand.
- `src/lib/emneIntroStorage.ts` : husker (lokalt), hvilke læsesider eleven har set, så den kun popper op første gang.

Diagrammerne følger AP-dokumentets egne modeller: analysepilens rækkefølge
(V → S → DO → IO → A → SP/OP), de fem morfemtyper, de fem tider, ikke-reglen og
pentagrammet med formålet i midten.

## 11C. Verifikation

`npm run typecheck` ren · `npm run lint` uændret baseline (7 fejl + 1 warning) ·
`npm run build` grøn · `scripts/exam-data-check.mts` ALL CHECKS PASSED ·
`scripts/option-leak-check.mts` kørt før og efter (83 → 33 fund, resten er
legitime parenteser i hele sætninger) · kørt i browser: feedback ved forkert
svar, læsesiderne for sætningsled, morfologi, tempus og kommunikation, og logoet
som genvej til forsiden. Ingen konsolfejl.


---

# RUNDE 6 : To nye prøve-sæt, neutral pladsholder og læsesider til STX

## 12A. Nyt i denne runde

- **Sæt 7 "Tal for de unge, ikke om dem"** (politisk tale) og **sæt 8
  "Charmerende byhus med overkommelig have"** (ejendomsannonce) er skrevet, så
  alle fem genrer fra skolens liste nu findes i puljen (informerende artikel,
  opinionsartikel, reklame, politisk tale og ejendomsannonce). Begge har de syv
  opgaver, 22 point der kan rettes automatisk, og teksterne er digtede fra
  bunden. Rotationen tæller nu 8 sæt.
- **Pladsholderen i opgave 7** ("Fx at, fordi, når, hvis, som eller der")
  indeholdt facit for flere sæt. Den er skiftet til "Skriv indlederen her".
- **De sidste afslørende svarmuligheder** er ryddet op: kommunikation-6,
  sproghandlinger-3 og semantik-13 havde forklaringer i parentes, der pegede
  direkte på facit. Teksten er flyttet over i feedbacken.
- **Læsesider til STX**: `STX_EMNE_INTRO` i `src/data/hhx/emneIntro.ts` dækker
  ordklasser, sætningsled, morfologi, tempus, syntaks og kasus. Diagrammerne og
  begrebslisterne genbruges (grammatikken er den samme), mens mål og
  indledninger er skrevet til STX-pensum med latindelen. Nyt kasus-diagram i
  `Diagrams.tsx`. `getEmneIntro()` vælger nu kort efter spor.

## 12C. Runde 7: begrundelser og de sidste læsesider

- **whyWrong i syntaks, kasus og tempus**: alle 130 multiple choice i de tre
  banker har nu en begrundelse pr. forkert svarmulighed. Dækningen på tværs af
  hele appen er dermed 191 af 577 (33 %). Begrundelserne siger, hvad det valgte
  svar faktisk ER (fx "det er ledsætningsordstilling, hvor 'ikke' står foran
  verbet"), så eleven kan se forskellen i stedet for bare at få facit.
- **Læsesider til de sidste HHX-emner**: sproghandlinger, semantik, pragmatik,
  sproghistorie og læringsstrategier. Alle 12 HHX-emner har nu en læseside.
  Indholdet følger skolens eget materiale (AP.pdf): de seks sproghandlingstyper,
  denotation over for konnotation, pragmatikkens vej fra ytring over kontekst
  til sproghandling, og arveord/låneord/fremmedord med tallene 17 % tysk og
  3 % fransk.
- **Nye diagrammer** i `Diagrams.tsx`: `sproghandlinger`, `denotation`,
  `pragmatik`, `laaneord`, `sprogtraeet` og `gentagelse` (spaced repetition).
- **`sprog` er ikke et HHX-emne.** `HHX_CATEGORIES` har 12 emner, og `sprog`
  (Sprog & Kommunikation) er kun med på STX. Læsesiden om sprogfamilier og
  sprogtræet ligger derfor i `STX_EMNE_INTRO`, hvor den kan nås. `status-check`
  læste før emnelisten fra en håndskrevet liste med `sprog` i og viste derfor et
  hul, der ikke fandtes : scriptet henter nu listen fra `HHX_CATEGORIES` og
  viser også STX-siderne.

## 12D. Runde 8: tydelighed, mobil og flow

Fire punkter fra Victors tilbagemelding.

**1. Meget mere tydelig forklaring.**
- `EmneIntroT` har to nye felter: `explain` (2-3 afsnit, der forklarer HVAD
  emnet er og hvorfor det giver mening) og `walkthrough` (et gennemregnet
  eksempel med 5 trin og et færdigt svar). Alle 12 HHX-emner plus STX-emnerne
  kasus og sprog har fået begge dele, skrevet ud fra skolens eget materiale.
  Læsesiden viser nu: Kort fortalt → diagram → Det skal du kunne →
  Begreberne → Sådan gør du trin for trin → fælde → OBS.
- Feedbacken ved forkert svar har fået et fjerde felt: "Sådan tjekker du det
  selv" fra `src/data/metode.ts`. whyWrong siger, hvorfor DET svar er forkert.
  Metoden siger, hvilket håndgreb man bruger næste gang (ikke-reglen,
  analysepilen, hjælpeverbet som tempusmarkør osv.). Panelet er dermed:
  Du svarede → Det rigtige svar → Sådan hænger det sammen → Sådan tjekker du
  det selv.

**2. Mobil-scroll i diagrammerne.** Diagrammerne blev presset ned i ~350 px og
blev ulæselige. De ligger nu i en vandret scroll-boks med `min-w-[440px]` på
små skærme og en lille hjælpetekst ("Træk til siden"). CSS-klassen
`.diagram-scroll` sætter `touch-action: pan-x pan-y`, så fingeren stadig kan
scrolle LODRET ned gennem siden, selv når den ligger på diagrammet.

**3. Man landede i bunden af den nye side.** Browseren beholdt scroll-positionen
fra den forrige skærm : trykkede man på et emne langt nede i listen, landede
man 839 px nede på læsesiden. Der er nu `window.scrollTo(0, 0)` ved skift af
view i `Practice.tsx` og ved skift af side i `AploftApp.tsx`.

**4. Mellemskærm før emnet.** Ny komponent `EmneLoader.tsx`: Lingua, emnets
navn og beskrivelse, en procesbar der fyldes på ca. 1,1 sekund, antal forløb og
opgaver, og to knapper ("Ja, jeg er klar" / "Nej, vælg et andet emne").
`openCategory()` viser den først, og `enterCategory()` går videre til selve
emnet. Ved reduceMotion står baren fuld med det samme.

Derudover rettet: manglende mellemrum i "Lås forløb op?"-dialogen.

## 12B. Sådan bruges værktøjerne

```bash
npx tsx scripts/status-check.mts        # dækning af feedback + læsesider
npx tsx scripts/option-leak-check.mts   # svarmuligheder der røber facit
node --experimental-strip-types scripts/exam-data-check.mts   # eksamenssættene
```
