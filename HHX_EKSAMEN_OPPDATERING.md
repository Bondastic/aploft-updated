# HHX Eksamensprøve + latinske terminologi - overlevering

**Dato:** 19. september 2026 · **Branch:** `arena/01a0b9d5-aploft-updated` (test-repo) · **Næste trin:** port denne ændring 1:1 til det rigtige repository.

Denne fil beskriver ALT, hvad der er ændret, så ændringen kan overføres uden at læse hele koden først. Indeholder også indholdsreglerne (skabelonen), som skal overholdes når der tilføjes nye eksamenssæt.

---

## 1. Hvad er nyt i appen

### A. Eksamensprøve (kun HHX) - nyt "rigtig eksamen"-flow under fanen Prøve

Flow (krævet af Oliver, genimplementeret med forbedret besvarelses-UX):

1. **Prøve-fanen** (HHX) viser nu øverst et stort **Eksamensprøve**-kort ("40 min · rigtige-format").
2. Klik → **infoside** med tekst om eksamen og dens forløb (6 trin, "det bliver du eksamineret i", form-noter) → knap "Start prøven".
3. **Selve eksamen:** øverst den (fiktive) artikel/tekst eleven skal læse; nedenunder alle spørgsmål; **ur i højre side** (desktop) hh. sticky topbar (mobil) som matcher **forberedelsen på 40 min**.
4. Under artiklen: **læseværktøjer** - tuschfarver (4 stk.) til ord og hele sætninger, **led-markering** med de 7 analysetegn (samme symboler som de øvrige analyseopgaver) og **ordklasse-mærkning** af enkelte ord. Markeringerne er kun læseværktøj og bedømmes ikke.
5. Hvert spørgsmål har et **"? "-knap** øverst, som forklarer hvad opgaven kræver (skabelon-teksten er lagt ind som `hint`). **Aldrig svaret** (se indholdsregler).
6. **Alle svar afgives som blokke/klik** - eleven behøver IKKE at skrive i noget format:
   - *choice*: klik på svarmulighed (A-D-blokke),
   - *multi*: klik alle de muligheder der passer,
   - *wordclass*: klik et ord → vælg ordklasse i pulje,
   - *analysis*: sætningen er klippet i led-klodser → klik klods → vælg led-symbol (præcis mødet fra eksisterende analyseopgaver, jf. regel om genbrug).
   Dertil et **valgfrit notatfelt** pr. spørgsmål (kun til AI-prompten; tæller ikke i den automatiske bedømmelse).
7. "Indsend" når man er færdig. **Går tiden, ringer en klokke** (WebAudio, ingen lydfil) og en dialog beder om at aflevere med det samme.
8. **Resultatsiden:** først disclaimer-teksten om formålet med prøven, **derunder karakteren** (estimat på 7-trinsskalaen, samme tærskler som "Din udvikling"), så **"Vil du gemme din prøve? Kopier din besvarelse til tekst her! Husk at indsætte det i et dokument."** med kopiér-knap, så **aflevering til AI-bedømmelse** (censor-prompt inkl. artikel + alle spørgsmål + elevens svar lægges i udklipsholderen og ChatGPT åbnes), og til sidst **gennemgang af hvert spørgsmål** (rigtigt/forkert + forklaring + "til selve eksamen"-advice).

### B. Eksamensform-præcisering (øverst under "Prøve", HØJ prioritet)

* Et klæbrigt banner "Sådan foregår din eksamen" ligger øverst for alle brugere (både STX og HHX). Det åbner arket **"Eksamensformer"**, som viser at de to skoler har hver sin form:
  * **Risskov, Handelsskolen (HHX):** fuld beskrivelse (prøveform, 40 min forberedelse, indhold, terminologi, bedømmelse + skærpet note: "tjek altid hos læreren").
  * **Egå Gymnasium (STX):** **placeholder** - siden findes, men teksten er bevidst kort ("kommer snart"); STX-elever kan se sammenligningen.
* Senere plan (ikke lavet endnu): valg af specifik skole i profilen med skræddersyede instrukser. Datastrukturen (`SchoolExamFormat` pr. skole) er gjort klar til det.
* Eksamenssættet (selve simuleringen) vises **kun på HHX-siden** - STX har anden eksamensform, og prøverne er forskellige.

### C. Terminologi: latinske betegnelser er nu PRIMÆRE overalt (Anne, AP-koordinator STX)

* Hele appen bruger nu **subjekt · verballed · direkte objekt · indirekte objekt** som hovedbetegnelser for sætningsled. De danske navne (grundled, udsagnsled, genstandsled, hensynsled, biled) står kun i **parentes som hjælp** på undervisnings-siderne (Symboler, Lynkursus, teach-trin, symbol-legenden).
* Retskrivning af symbol-forklaringer: `subjpred` hedder "Subjektsprædikat (omsagnsled til subjektet)", `objpred` "Objektsprædikat (omsagnsled til det direkte objekt)". Adverbial/biled og genitiv-kasus-beskrivelser er tilpasset.
* Gælder ALLE sider (STX og HHX) og fremtidige eksamenssæt: **lær eleverne det de kan eksamineres i**.

---

## 2. Fil-ÆNDRINGER (port-liste)

### Nye filer
| Fil | Indhold |
|---|---|
| `src/data/hhx/examSats.ts` | Selve eksamenssættet: artikel ("Da kassen blev en skærm"), 10 spørgsmål (skabelon-skema), `EXAM_WORD_CLASS_TAGS`, intro/forløb-tekst. Indholdsreglerne står øverst i filen. |
| `src/data/hhx/examFormats.ts` | Skole-form-data: `EXAM_FORMATS` (hhx = fyldt ud, stx = placeholder) + fælles intro-tekst. |
| `src/components/exam/ExamArticlePane.tsx` | Artiklen med tusch/led/ordklasse-værktøjer (klik-første-til-sidste-ord; "hele sætningen"-tilstand; viskelæder). |
| `src/components/exam/ExamFormatSheet.tsx` | "Eksamensformer"-arket der viser begge skoler (med "din form" og "kommer snart"-badges). |
| `src/screens/ExamSats.tsx` | Eksamensskærmen: intro → running (tekst + spørgsmål + ur) → resultat (disclaimer, karakter, kopiér-knap, AI-aflevering, spørgsmålsgennemgang). Indeholder blok-widgetterne, WebAudio-klokken og prompt-/kopi-byggerne. |
| `HHX_EKSAMEN_OPPDATERING.md` | Denne fil. |

### Ændrede filer (alt er additivt; ingen gammel funktionalitet er forkortet)
| Fil | Hvad |
|---|---|
| `src/screens/Exam.tsx` | + state `satsOpen`/`formatOpen`; eksamensprøve-kort (kun `isHhx`) og eksamensform-banner (begge) øverst i setup;-renderer `ExamSatsPage` og `ExamFormatSheet`; HHX-noten henviser til eksamensprøven. |
| `src/types.ts` | Nye typer tilføjet til SLUTNINGEN: `ExamWordClassTag`, `Exam*QuestionT`, `ExamArticleT`, `ExamSatsT` (+ kommentar om indholdsregler). Gamle typer urørt. |
| `src/data/symbols.ts` | Latinske primærnavne (se 1C). |
| `src/data/categories.ts` | Sætningsled-beskrivelser (STX+HHX) omskrevet til latinsk primær. |
| `src/data/teaching.ts` | Sætningsled-teach-forløbet + kasus-tabeller: latinsk primær, dansk i parentes. |
| `src/data/almen/saetningsled.ts`, `almen/syntaks.ts`, `almen/kasus.ts`, `almen/ordklasser.ts`, `almen/tempus.ts`, `almen/morfologi.ts`, `almen/sprog.ts`, `hhx/*.ts`, `latin/grammatik.ts`, `latin/oversaettelse.ts`, `latin/sumesse.ts` | Systematisk term-bytte i opgavetekster/forklaringer (grundled→subjekt osv.). Læringsmæssige formuleringer ("spørg: hvem/hvad + verballed?") fulgte med. |
| `src/data/paths.ts` | Lektionsnavne: "Sætningsled: Subjekt & verballed", "… Direkte objekt & indirekte objekt". |
| `src/screens/Symbols.tsx` | Intro + "Sådan bruger du symbolerne" + maskot-line: latinsk primær, parentetik forklaret. |
| `src/screens/Lynkursus.tsx` | STX- og HHX-lektionen "De 7 sætningsled"/"Sætningsled & syntaktisk analyse" + kasus-tabeller: latinsk primær (dansk i parentes som hjælp). |

Ingen ændringer i: `progress.ts`, `examGenerator.ts`, `TaskRenderer.tsx`, bundnavigation, STX-indhold udover terminologi. Gamle prøver (generatoren) virker som før.

---

## 3. Indholdsskabelonen (nye sæt - VIGTIGE REGLER)

Et eksamenssæt matcher skolens skabelon: **1 tekst + 10 spørgsmål** på tværs af
*Indhold → Kommunikation (afsender/modtager/formål) → Genre → Semantik → Ordklasser → Syntaks (led + ledsætning) → Argumentation → Pragmatik*. Hvert spørgsmål:

```ts
{
  id, label, category?,           // kategori = statistik-tag (valgfrit)
  kind: "choice" | "multi" | "wordclass" | "analysis",
  prompt,                          // stammer fra opgaveformuleringen - aldrig svaret
  hint,                            // "?"-knappen: KUN "hvad skal jeg gøre"-metode
  feedback,                        // efter aflevering: hvad var rigtigt/forkert + hvorfor
  examTip,                         // efter aflevering: "til selve eksamen gør du ..."
  // + per kind: options/correctIndex | options/correctIndexes | words/correct | sentence/chunks/correctMap
}
```

**Indholdsregler (håndhævet i checkscript, se 4):**
1. Ingen `prompt`/`hint`/artikel-citat-eksempler må indeholde svaret. (Den gamle version havde "eksempelbesvarelser" der bogstaveligt talt VAR svaret - det er fjernet; kun metode, aldrig facit.)
2. `analysis.sentence` skal optræde **ordret** i artiklen; `chunks.join(" ")` skal matche sætningen; alle `wordclass`-ord skal kunne findes i artiklen.
3. Led-symboler er de 7 officielle (`LedSymbol`), og tekster bruger latinske betegnelser primært.
4. Vælg kun distraktorer som en 2.-gangs-læser kunne blive i tvivl om, men hvor facit kan belægges 100 % i teksten.
5. Flere sæt: smid dem ind i `HHX_EXAM_SATS`-listen i `examSats.ts` - skærmen tager `[0]`; en sæt-vælger kan tilføjes senere uden UI-omskrivning.

---

## 4. Verifikation (kørt - skal køres igen efter port)

```bash
npm run typecheck            # grønt
npm run lint                 # ingen NYE fejl (7 gamle, præ-eksisterende, i AploftApp/GuidedTour/DarkModeToggle/Lynkursus-citat)
npm run build                # grønt
node --experimental-strip-types scripts/exam-data-check.mts   # data-check: antal, lækkage, chunk-match
```

`scripts/exam-data-check.mts` itererer `HHX_EXAM_SATS`, fejler ved (a) manglende hint/feedback/examTip, (b) `correctIndex` uden for range, (c) analyse-sætning ikke i artiklen, (d) chunks matcher ikke sætningen, (e) ordklasse-ord ikke i artiklen, (f) korrekt svarmulighed hvis den optræder i prompt/hint, (g) `SYMBOLS[].short` er dansk primær.

Manuelt flow at røgateste i browseren: Profilen skal være **HHX** (Profil → Indstillinger → Skift uddannelse). Prøve-fanen → banner + eksamensprøve-kort → start → markér i artiklen (prøv tusch, led, ordklasse) → besvar et par spørgsmål → Indsend → kopiér-knap (sætter korrekt tekst i udklipsholder) → "Aflevér til AI" (kopierer censor-prompt) → gennemgang. Sæt uret til et minut eller afprøv "Tiden er gået"-dialogen. STX-siden: banner med "under udarbejdelse", IKKE noget eksamensprøve-kort, terminologi-rettelser synlige i Sætningsled-forløbet.

## 5. Kendte afgrænsninger / næste skridt

1. **STX-formen er placeholder** (bevidst) - indhent den præcise beskrivelse fra Egå Gymnasium og udfyld `EXAM_FORMATS.stx`.
2. **Skolevalg** ("vælg din specifikke skole") er ikke implementeret - datastrukturen ligger klar (`SchoolExamFormat.id/school`).
3. Eksamenssættet ligger i `src/data/hhx/` og deles IKKE med STX (det må det heller ikke).
4. AI-bedømmelse er som alt andet i appen et ChatGPT-link; ingen serverkald. Karakteren på resultatsiden er appens eget estimat ud fra blok-svarene.
5. Skole-navnet er skrevet som "Risskov, Handelsskolen (HHX)" (Olivers "HTX" læst som HHX; jf. appens udgangspunkt: AP findes kun på STX/HHX). Ret teksten i `examFormats.ts` hvis skolens officielle navn er et andet.
