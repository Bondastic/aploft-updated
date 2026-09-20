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
