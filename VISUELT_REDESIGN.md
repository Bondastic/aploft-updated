# Visuelt redesign: før/efter

Dette dokument viser det nye designsystem og konkrete før/eksempler på de to
referenceskærme, **Welcome.tsx** og **Home.tsx**. Resten af appen følger samme
system. Alt er kun visuelt: funktion, routing og logik er uændret.

---

## 1. Designsystemet (src/app/globals.css)

To bærende accentfarver med **fire faste nuancer hver** — brugt konsekvent til
baggrund/tekst/accent i stedet for Tailwinds standardpalet:

| Token | STX (rød) | Token | HHX (blå) |
|---|---|---|---|
| `stx-soft` | `#f5e8e5` tonet flade | `hhx-soft` | `#e7eef2` tonet flade |
| `stx-mid` | `#d9a399` kant | `hhx-mid` | `#a2bacc` kant |
| `stx-base` | `#b24032` flad accent | `hhx-base` | `#2e6488` flad accent |
| `stx-deep` | `#7d251c` accent-tekst | `hhx-deep` | `#1e4258` accent-tekst |

Neutralt: varmt papir `paper #f3f1ec`, kort `card #fdfcfa`, blæk `ink #25222c`.
Status/kategorier bruger otte dæmpede arkiv-toner (slate, pine, sea, ochre,
clay, rust, plum, mulberry) i stedet for slikfarver.

**Komponentklasser:** `.btn`, `.btn-primary`, `.btn-outline`, `.btn-danger`,
`.card`, `.modal`, `.popover`, `.chip`, `.field`, `.eyebrow`, `.page-title`,
`.section-title`.

**Bevidst blandede hjørneradier:** knapper 6px (`rounded-md`) · kort 8px
(`rounded-lg`) · chips 4px (`rounded-sm`) · heroer 0px (`rounded-none`/kant-
bjælke) · kun rigtige cirkler og bjælker er runde. **Skygge kun** til modaler
og popovers (`.modal`, `.popover`) — aldrig som dekoration under knapper.

**Typografi:** Display-fonten (Baloo 2) er strammet ind til sidetitler
(`.page-title`), artiklens overskrift i eksamenssættet og de STORE tal
(karakter, ur). Resten er Nunito. Nye faste niveauer: `.eyebrow`
(spettet versal-label), `.page-title`, `.section-title`.

Nattetilstand er nu ét sted: samme tokens omdefineres under `.dark`.

---

## 2. Welcome.tsx — før/efter

### Før: maskot + taleboble, glødende kort, gradient-pille, spring-flueben

```tsx
<Mascot pose={step === 1 ? "welcome" : "explain"} size="lg" speech={...} />

<p className="font-display text-3xl font-extrabold text-ink">Velkommen til AP Klar</p>

<motion.button
  animate={{ scale: education === "stx" ? 1.02 : 1, ... }}
  whileHover={{ scale: 1.015 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 28 }}
  className={cn(
    "... rounded-3xl border-2 ...",
    education === "stx"
      ? "border-red-500 bg-red-50 shadow-xl shadow-red-500/25 ring-4 ring-red-300/60"
      : "border-ink/10 bg-white shadow-sm hover:border-red-300 hover:shadow-md"
  )}>
  <span className="... rounded-2xl bg-red-500 text-white"> <StxIcon /> </span>
  ...
  {/* checkmark med spring-animation */}
  <motion.span transition={{ type: "spring", stiffness: 500, damping: 22 }}><CheckIcon /></motion.span>
</motion.button>

<button className="... rounded-full bg-gradient-to-r ... shadow-lg
  from-red-500 to-rose-600 shadow-red-500/40">Fortsæt med STX</button>
```

### Efter: redaktionel titelside, tone-i-tone-valg, flade knapper

```tsx
{/* Masthead: venstre-stillet med trin-tæller til højre, accent-bjælke */}
<div className="flex items-baseline justify-between gap-4 border-t-[3px] border-ink pt-4">
  <div>
    <p className="eyebrow">Velkommen</p>
    <h1 className="page-title mt-1">AP Klar</h1>
  </div>
  <p className="eyebrow shrink-0 tabular-nums">Trin 0{step} / 03</p>
</div>

<button
  onClick={() => chooseEdu(id)}
  className={cn(
    "... rounded-lg border bg-card p-5 ...",           // 8px kort, ingen skygge
    selected
      ? "border-stx-mid border-l-4 border-l-stx-base bg-stx-soft"  // tone-i-tone-nøglelinje
      : "border-ink/12 hover:border-ink/30"
  )}>
  <span className="... text-stx-base"><StxIcon /></span>  // ikon uden farvet boks
  ...
  {/* kvadratisk markering, statisk flueben */}
  <span className="h-5 w-5 rounded-sm border border-stx-base bg-stx-base text-white">
    {selected && <CheckIcon />}
  </span>
</button>

<button className="btn w-full py-3 bg-stx-base text-white">Fortsæt med STX</button>
```

Trinovergangen er bevaret (kommunikerer skift), men er kort og diskret
(`opacity/y, 0.2s`). Ingen spring på flueben, badges eller knapper.

---

## 3. Home.tsx — før/efter

### Før: gradient-hero med maskot, pille-chips og kort-gitter med ikonbokse

```tsx
<div className={cn("overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg lg:p-8",
  isHhx ? "from-blue-500 to-indigo-600 shadow-blue-500/30" : "from-purple to-purple-dark shadow-purple/30")}>
  <p className="font-display text-xl font-extrabold lg:text-3xl">{greeting}</p>
  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-semibold">🔥 streak</span>
  ...
  <Mascot pose="welcome" size="lg" speech={null} />
</div>

<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
  <button className="... rounded-2xl border ... bg-white p-4 ... shadow-sm hover:-translate-y-0.5 hover:shadow-md ...">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple">...</span>
    <span className="font-bold text-ink">Øv dig</span>
  </button>
  ... {/* samme kort-opskrift 5 gange */}
</div>
```

### Efter: typografisk hero med accent-bjælke, nummereret indeks, fodnote

```tsx
{/* Hero: kun typografi + én accent-bjælke i STX-rød eller HHX-blå */}
<header className={cn("border-t-4 pt-5", isHhx ? "border-hhx-base" : "border-stx-base")}>
  <p className="eyebrow">{isHhx ? "HHX · Almen Sprogforståelse" : "STX · Almen Sprogforståelse"}</p>
  <h1 className="page-title mt-1.5">{greeting}</h1>
  {/* Status som tal-række med hårfine skillelinjer — ingen piller */}
  <dl className="mt-5 grid grid-cols-3 gap-px border-y border-ink/10 bg-ink/10">
    <div className="bg-paper py-3">
      <dt className="eyebrow flex items-center gap-1.5"><FlameIcon /> Streak</dt>
      <dd className="mt-1 text-xl font-extrabold tabular-nums text-ink">{progress.streakDays} dage</dd>
    </div>
    ...
  </dl>
</header>

{/* Genveje: aviser-indeks 01-05 med skillelinjer — ikke genbrugte kort */}
<nav aria-label="Genveje">
  <ol className="border-t border-ink/15">
    <li className="border-b border-ink/10">
      <button className="group flex w-full items-baseline gap-4 py-4 text-left hover:bg-ink/[0.04]">
        <span className="font-display w-8 text-sm font-extrabold tabular-nums text-ink/30">01</span>
        <span className="text-stx-base"><PracticeIcon /></span>   {/* ikon uden boks */}
        <span className="block text-[15px] font-extrabold tracking-tight text-ink">Øv dig</span>
        ...
      </button>
    </li>
  </ol>
</nav>

{/* Om-blok som fodnote med hårfint overstreg — tekst-first */}
<section className="border-t border-ink/15 pt-5 text-sm text-ink/60">...</section>
```

---

## 4. Hvad der er ændret på tværs af hele appen

| Mønster | Før | Efter |
|---|---|---|
| Knapper | `bg-gradient-to-r from-X to-Y + shadow-X/40 + rounded-full` | Flade `.btn`-klasser, `rounded-md`, tone/kant giver hierarki |
| Glød | `shadow-red-500/40`, `ring-4 ring-blue-300/60` | Fjernet; kun `.modal`/`.popover` har skygge (reel dybde) |
| Hjørner | `rounded-2xl/3xl/full` på alt | 4/6/8px i bevidst blanding; kun cirkler/bjælker runde |
| Micro-anim | `spring` på flueben, badges, `whileTap`, `active:scale-90` | Fjernet; animation kun ved trinskift og reel feedback |
| Maskot + boble | Cirkelportræt med ring + rund taleboble overalt | Gråtonet portræt i skarp ramme + kursiveret citat; helt fjernet på Welcome, Home, Symbols, Udvikling m.fl. |
| Farver | `red-500`, `blue-600`, 12 kategorifarver direkte | `stx-*`/`hhx-*`-skalaer + 8 arkiv-toner fra tokens |
| Ikonbokse | `h-10 w-10 rounded-xl bg-purple/10` om hvert ikon | Stroke-ikoner inline i tonet farve, ingen bokse |
| Display-font | `font-display` på alle overskrifter/dialoger | Kun sidetitler, artiklens overskrift og store karaktertal |
| Layout | Samme kort-opskrift på alle skærme | Variation: indeks-lister (Home, Øv dig, Lynkursus), ordbogs-opslag (Symboler), redaktionel statistik (Udvikling) |

Dark mode følger automatisk med, fordi alle farver er tokens, der omdefineres
under `.dark` i globals.css.
