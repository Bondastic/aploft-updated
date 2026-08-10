# AI-overlevering: AP Klar (aploft-updated)

**Formål:** Denne guide giver en anden AI alt, hvad den skal vide for at fortsætte
udviklingen af AP Klar uden at lave de samme fejl. Den afløser den tidligere
overlevering (som beskrev en arbejdskopi, der ikke længere findes).

**Dato:** 10. august 2026 · **Branch:** arena/019fecdf-aploft-updated · **Remote:** github.com/Bondastic/aploft-updated

---

## 1. Vigtigste først: hvad skete der i denne session?

Den tidligere session havde lavet "runde 4-6" (responsiv topbar, spotlight-guide,
oversættelsesark-fix, em-dash-oprydning) i en arbejdskopi, der **aldrig blev pushet**.
Commit 186e848 findes IKKE i git (hverken lokalt eller på remote). Denne session har
**rekonstrueret runde 4-6** fra overleveringsbeskrivelsen oven i dbf2106 (main) og
derudover udført todo-punkterne (ikoner, PWA-manifest, zip, gitignore).

### Ændringer i denne session (alt er committet + pushet)

| Område | Detaljer |
|---|---|
| **TopBar** | Én lav række på alle skærme: logo + STX/HHX-badge (altid synlig) til venstre, streak/XP/mørk til højre. På telefoner skjules "dages streak"/"XP"-teksterne og badge-ikonet, så det hele passer i én række. |
| **FlameIcon** | Skræddersyet flamme (spids top, talje, bred bug med hvid "glødende" kerne) i stedet for det gamle rudimentære ikon. |
| **TranslationSheet** | Vises kun ved latinske kategorier (oversaettelse, grammatik, sumesse, ordforraad) eller `task.showSheet`, og kun indtil opgaven er besvaret. Logikken ligger i TaskRenderer (`showSheet`), så arket opfører sig ens i Øv dig og prøver. Knappen er en diskret knap i opgavens flow. Ingen flydende knap mere. |
| **GuidedTour** (ny) | Spotlight-rundvisning: Profil → Hjem → Øv dig → Prøve → Symboler → Lynkursus → Udvikling → Hjem. Mørklægger alt undtagen målet (box-shadow-hul), låser scroll, mørk "Rundvisning med Lingua"-topbar med trin-/sideindikator, Escape/"Spring over"/X afslutter. Mål findes via `data-tour`-attributter (BottomNav-faner, Home-hero `hjem-kort`, Lynkursus-/Udvikling-overskrifter). |
| **progress** | Nyt felt `guideDone` (default false; eksisterende brugere migreres til true). `finishGuide()` i lib/progress.ts. Nye brugere lander på Profil med turen; kan ikke genåbnes bagefter (kun via "Nulstil alle data"). |
| **Em dashes** | `grep -rn "—" src/` giver 0 (også i kommentarer og metadata). |
| **layout.tsx** | Dark-mode-init via `next/script` `strategy="beforeInteractive"` (ikke raw `<script>`). Metadata uden em dashes. |
| **Ikoner/PWA** | `public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `og-image.png` (1200×630), `manifest.webmanifest` oprettet; `favicon.png` erstattet (1,3 MB → 5 KB). Regenereres med `node scripts/gen-icons.mjs` (kræver `npm i --no-save sharp`). |
| **Zip** | `public/aploft-updated.zip` genskabt (103 filer, ~8,4 MB) med samme ekskluderingsliste som før + sig selv. **Tilføjet til .gitignore**, så den aldrig deployes/committes. |
| **Home** | Ekstra STX/HHX-chip på hero-kortet fjernet (mærket findes kun i TopBar). |

### Genskab zip-filen (hvis den slettes)

```bash
cd /home/user/aploft-updated
rm -f public/aploft-updated.zip
zip -rq public/aploft-updated.zip . \
  -x "./.git/*" -x "./node_modules/*" -x "./.next/*" -x "./.vercel/*" \
  -x "./.env*" -x "*.log" -x "*.tsbuildinfo" -x "./.eslintcache" \
  -x "./public/celebrate.png" -x "./public/chaos.png" -x "./public/encourage.png" \
  -x "./public/explain.png" -x "./public/surprise.png" -x "./public/thinking.png" \
  -x "./public/thumbsup.png" -x "./public/welcome.png" -x "./public/worksheet.png" \
  -x "./public/latin/worksheet.png" -x "./public/aploft-updated.zip"
```

Resultat: **103 filer, ~8,4 MB**. De ekskluderede billeder er ubrugte rod-duplikater af
public/mascot/*.png + ubrugte worksheet.png-filer. Koden refererer kun til
public/mascot/*.png, public/banner.png, public/favicon.png, public/icon-192.png,
public/icon-512.png, public/apple-touch-icon.png, public/og-image.png + manifest.webmanifest.

---

## 2. Projektets formål og features

**AP Klar** er en dansk gymnasie-app (Next.js 16 + React 19 + Tailwind 4 + framer-motion),
der træner **Almen Sprogforståelse (AP)** for **STX** (rød profil) og **HHX** (blå profil).

> **FAGLIG NØGLEVIDEN:** AP findes KUN på STX og HHX. **HTX har ikke AP.** Byg aldrig noget HTX-specifikt.

1. **Velkomstskærm** (screens/Welcome.tsx): første besøg → vælg STX/HHX → valgfrit brugernavn.
   Gemmes i progress.onboarded + progress.education. Eksisterende brugere migreres til STX.
2. **Spotlight-guide** (components/GuidedTour.tsx): nye brugere, starter på Profil, 7 trin gennem
   hele appen, kan springes over. Gemmes i progress.guideDone.
3. **STX-spor:** Almen del (7 kategorier) + Latindel (5 kategorier).
4. **HHX-spor:** fælles grammatik (uden latin/kasus-masterclass) + 7 HHX-kategorier
   (kommunikation, sproghandlinger, semantik, pragmatik, genrer & medier, sproghistorie,
   læringsstrategier), alle erhvervsrelaterede.
5. **Progressiv læring:** teach-trin først, låste lektioner (60 % for at bestå), opsamlingstest.
6. **"Spørg AI"-knap** (components/AskAi.tsx): chatgpt.com/?q=... med rammesættende dansk prompt,
   consent-dialog første gang (localStorage: aploft.askAi.consent).
7. **Oversættelsesark** (components/TranslationSheet.tsx): kun som diskret knap i TaskRenderer,
   kun ved latin-relevante kategorier, kun før besvaring. Vises i Øv dig og prøver.
8. **Prøver** (screens/Exam.tsx): spor- og længdevalg afhænger af uddannelse; "Den ultimative test"
   kun på STX.
9. **Lynkursus, Symboler, Udvikling, Profil:** uddannelsesbevidste. Profil har "Skift uddannelse"
   (XP/resultater bevares) og "Nulstil alle data".
10. **PWA:** manifest + ikoner + og-image på plads (fase 6 i PLAN.md).

---

## 3. Arkitektur

```
src/
  app/layout.tsx            # Metadata + manifest + dark-mode-init via next/script (beforeInteractive)
  app/page.tsx              # Rendre <AploftApp />
  components/
    AploftApp.tsx           # Root: progress-state, routing, velkomst/guide-gating
    TopBar.tsx              # Logo + ÉN STX/HHX-badge (flex-wrap på små skærme), streak/XP
    BottomNav.tsx           # 5 faner, data-tour-attributter
    GuidedTour.tsx          # Spotlight-rundvisning (guideDone)
    AskAi.tsx               # Spørg AI-knap + consent-dialog
    TranslationSheet.tsx    # Modal med ordforråd + bøjningsskemaer (åbnes fra TaskRenderer)
    tasks/TaskRenderer.tsx  # Alle opgavetyper + "Lingua tænker…" + showSheet-logik
  screens/
    Welcome.tsx             # Uddannelsesvalg + brugernavn
    Home.tsx                # Hero-kort (data-tour="hjem-kort"), genvejskort, ingen ekstra chip
    Practice.tsx, Exam.tsx  # Bruger TaskRenderer (arket ligger derinde)
    Lynkursus.tsx (data-tour="lynkursus"), Symbols.tsx, Profile.tsx,
    Udvikling.tsx (data-tour="udvikling")
  data/
    types.ts                # Education, Track, CategoryId, Task, Progress (inkl. guideDone)
    categories.ts, paths.ts # getCategoryPath(id, education) - cache-nøgle indeholder education
    questions.ts, latinQuestions.ts, hhxQuestions.ts, teaching.ts, hhx/*.ts
    builders.ts, symbols.ts
  lib/
    progress.ts             # localStorage (aploft.progress.v4), XP, streak, education, guideDone
    education.ts            # EDU_THEMES: STX=rød, HHX=blå (alle Tailwind-klasser her)
    examGenerator.ts
  db/                       # UBRUGT boilerplate (drizzle/postgres) - rør den ikke
scripts/
  gen-icons.mjs             # Genererer public/icon-*.png, apple-touch-icon, favicon, og-image
public/
  banner.png, favicon.png, icon-192.png, icon-512.png, apple-touch-icon.png,
  og-image.png, manifest.webmanifest, mascot/*.png, latin/worksheet.png,
  + ubrugte rod-duplikater (se ovenfor) + aploft-updated.zip (gitignored!)
```

### Vigtige mønstre

- **Uddannelse flyder ned** fra AploftApp → screens som prop education (og progress).
- **Farver:** getEducation(education) → EDU_THEMES (solidBg, accentText, accentChip, gradient, softBg).
  Aldrig hardcode rød/blå spredt rundt.
- **Opgave-IDs skal være unikke** på tværs af alle filer (grep-tjek ved ændringer).
- **getCategoryPath(id, education)** tager education, ellers deler HHX og STX cache.

---

## 4. Designregler (følg dem altid)

1. **Ingen em dashes ("—") i src/ overhovedet** (heller ikke kommentarer/metadata).
   Tjek: `grep -rn "—" src/` → skal give 0. Brug kolon, komma, punktum, "·" eller parentes.
2. **Svarmuligheder jævnbyrdige i længde.** Rigtige svar må aldrig kunne genkendes på længde.
   Nye opgaver: korte præcise rigtige svar; nogle distraktorer længere end det rigtige.
3. **Undervisning først:** ethvert nyt emne skal have teach-trin, før eleven bliver spurgt.
4. **HHX ≠ STX:** ingen latin, ingen kasus-masterclass; erhvervsrelaterede eksempler.
5. **Maskotten hedder Lingua** og giver varm feedback ("Rigtigt! 🎉" / "Næsten! Sådan hænger det sammen:").
6. **Respektér reduceMotion** (progress.settings.reduceMotion) i alle animationer.
7. **Oversættelsesark kun når relevant** og kun før besvaring.
8. **Dark-mode-init** i layout.tsx skal blive på next/script `beforeInteractive`. Aldrig raw `<script>` i head.

---

## 5. Sådan kører og verificerer du

```bash
npm ci                 # installér (node_modules er ikke i zip'en)
npm run typecheck      # tsc --noEmit → 0 fejl
npm run build          # next build → skal lykkes
npm run start -- -H 0.0.0.0 -p 3000   # produktions-server (preview)
```

**Test-flow (manuelt, ryd localStorage / inkognito):**
1. Velkomstskærm → vælg HHX → brugernavn (kan springes over) → **land på Profil med
   spotlight-guiden** → gennemgå hele turen → "Færdig" → Hjem.
2. Øv dig → HHX-kategori → teach-trin → opgave → "Spørg AI" → bekræft dialog → ChatGPT-link.
3. Prøve → HHX-prøve → ingen latin-opgaver.
4. Profil → Indstillinger → skift til STX → latindel + oversættelsesark-knap på
   oversættelses-/grammatik-/sum- og ordforråds-opgaver (forsvinder efter svar).
5. Topbar på 375 px: logo + mærke + streak/XP-tal i én lav række uden overlap
   (teksterne "dages streak"/"XP" og mærke-ikonet er skjult på små skærme).

---

## 6. Kendte problemer & faldgruber

- **GitHub:** push/PR virker fra denne session. Arbejd altid på
  `arena/019fecdf-aploft-updated` og åbn PR derfra (aldrig andre brancher).
- **Preview:** brug kun preview-panelet i chatten. next.config.ts har allowedDevOrigins
  for *.e2b.app (kun til `next dev`).
- **Dev-server-cache:** hvis `next dev` fejler med "module factory is not available"
  efter at have slettet en fil: `rm -rf .next` + genstart, eller kør
  `next build && next start`.
- **public/aploft-updated.zip** er gitignored og kun til levering. Hvis den alligevel
  committes, kan alle downloade hele kildekoden fra apklar.vercel.app/aploft-updated.zip.
- **scripts/gen-icons.mjs** kræver sharp (`npm i --no-save --package-lock=false sharp`)
  og kører `node scripts/gen-icons.mjs`. SVG-rasterisering: brug `density: 72`, ellers
  bliver størrelserne 1,33× for store (96/72).
- **src/db/** er ubrugt boilerplate (drizzle/postgres). Rør den ikke.
- **Guide og AnimatePresence:** GuidedTour navigerer selv via onNavigate (stabil
  useCallback) og måler med 80/280 ms delays. data-tour-attributter skal følge med,
  hvis man flytter/omdøber elementer (profil, hjem, ov-dig, proeve, symboler +
  lynkursus/udvikling, som sidder på sidenes rod-div, så hele siden lyser op).

---

## 7. Næste skridt (todo-liste)

1. ~~Push til GitHub~~ (gjort i denne session: commit + push + PR).
2. ~~Ikoner + PWA-manifest~~ (gjort: fase 6 i PLAN.md).
3. **Vercel:** sørg for at repoet er koblet på → deploy af main → apklar.vercel.app
   (bruger-handling).
4. **Ekstern indholdstest:** lad en HHX-elev gennemgå HHX-opgaverne (faglig kvalitet)
   og en STX-elev gennemgå latindelen. (Fase 7 i PLAN.md.)
5. **Gymnasiereform 2025/2027:** AP ændres fra 2027/28. Data er struktureret, så det er
   let at tilpasse senere.
6. Eventuelt: Capacitor-indpakning til App Store/Google Play (kræver app-ikoner i
   flere størrelser + splash; manifest/ikoner er allerede på plads).

---

## 8. Commit-historik (reference)

```
dbf2106  (main)     Runde 1-3: HHX-spor, velkomstskærm, Spørg AI, afbalancerede opgaver (#1)
<ny>     (denne)    Runde 4-6 (rekonstrueret): responsiv topbar, spotlight-guide,
                    oversættelsesark-fix, em-dash-oprydning + ikoner, PWA, zip, PLAN.md
929a71a  (original) boilerplate "fix"
```

*God fornøjelse: ingen em dashes, lige lange svarmuligheder, undervisning først!*
