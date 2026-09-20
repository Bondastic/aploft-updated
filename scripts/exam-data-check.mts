// Datatjek for HHX-eksamenssættene. Kør fra repo-roden:
//   node --experimental-strip-types scripts/exam-data-check.mts
//
// Tjekker, at de seks sæt følger skolens eksamensark: syv opgaver i fast
// rækkefølge, den rigtige svarform pr. opgave, at alt hvad der citeres faktisk
// STÅR i teksten, at morfem-opdelingerne giver ordet igen, at omskrivningerne
// indeholder de verbumsformer, de rettes på, og at hverken opgavetekster,
// hints eller pladsholdere afslører facit.
import { EXAM_CLAUSE_FUNCTIONS, EXAM_GENRES, EXAM_TENSES, HHX_EXAM_SATS } from "../src/data/hhx/examSats.ts";
import { SYMBOLS } from "../src/data/symbols.ts";

let fails = 0;
const bad = (msg: string) => { fails++; console.log("FAIL:", msg); };
const ok = (msg: string) => console.log("ok:", msg);

// Skolens eksamensark: rækkefølgen og svarformen ligger fast.
const TASK_ORDER = ["Genre", "Kommunikationssituation", "Sproglige særtræk", "Morfologi", "Syntaktisk analyse", "Verballedets tid", "Hoved- og ledsætninger"];
const PART_ORDER = ["genre", "fields", "fields", "morphology", "analysis", "tense", "clause"];

const norm = (t: string) =>
  t.normalize("NFKC").toLowerCase().replace(/['’‘"“”]/g, "").replace(/\s+/g, " ").trim();
const trimQuote = (t: string) => t.replace(/(\.\.\.|…)/gu, " ").replace(/^[.,;:!?\s]+|[.,;:!?\s]+$/gu, "").trim();
const bare = (t: string) => norm(t).replace(/[.,;:!?]/g, "");

function quotedFragments(text: string): string[] {
  const out: string[] = [];
  for (const q of text.match(/'([^']{4,})'/g) ?? []) {
    for (const part of q.slice(1, -1).split(/\.\.\.|…/u)) {
      const frag = norm(trimQuote(part));
      if (frag.length > 3) out.push(frag);
    }
  }
  return out;
}

const taskIds = new Set<string>();

for (const sats of HHX_EXAM_SATS) {
  const artText = norm([sats.article.title, sats.article.byline, ...sats.article.paragraphs].join(" "));
  const artBare = artText.replace(/[.,;:!?]/g, "");
  const words = sats.article.paragraphs.join(" ").split(/\s+/).length;
  ok(`${sats.title}: ${sats.tasks.length} opgaver, ${sats.minutes} min, ${sats.article.paragraphs.length} afsnit, ${words} ord`);

  if (sats.tasks.length !== 7) bad(`${sats.id}: ${sats.tasks.length} opgaver, der skal være 7 (skolens ark)`);
  sats.tasks.forEach((t, i) => {
    if (t.no !== i + 1) bad(`${t.id}: opgavenummer ${t.no} står på plads ${i + 1}`);
    if (t.label !== TASK_ORDER[i]) bad(`${t.id}: emnet "${t.label}" står hvor "${TASK_ORDER[i]}" skulle stå`);
    if (t.part.kind !== PART_ORDER[i]) bad(`${t.id}: svarformen "${t.part.kind}" passer ikke til opgave ${i + 1} (skal være "${PART_ORDER[i]}")`);
  });

  let points = 0;

  for (const t of sats.tasks) {
    if (taskIds.has(t.id)) bad(`dublet opgave-id ${t.id}`);
    taskIds.add(t.id);
    if (!t.hint || !t.feedback || !t.examTip) bad(`${t.id} mangler hint/feedback/examTip`);
    if (!t.modelAnswer || t.modelAnswer.length < 80) bad(`${t.id} mangler et rigtigt modelsvar`);
    if (t.points.length < 3) bad(`${t.id}: kun ${t.points.length} punkter i checklisten (mindst 3)`);

    const modelStart = norm(t.modelAnswer).split(" ").slice(0, 6).join(" ");
    if (modelStart.length > 20 && norm(t.hint).includes(modelStart)) bad(`${t.id}: hintet afslører modelsvaret`);

    for (const frag of quotedFragments(t.prompt)) {
      if (!artText.includes(frag)) bad(`${t.id}: citatet "${frag}" findes ikke i teksten`);
    }

    const p = t.part;

    if (p.kind === "genre") {
      if (!EXAM_GENRES.some((g) => g.id === p.correct)) bad(`${t.id}: ukendt genre ${p.correct}`);
      if (!p.justify.label || !p.justify.placeholder) bad(`${t.id}: begrundelsesfeltet mangler label/pladsholder`);
      points += 1;
    }

    if (p.kind === "fields") {
      if (p.fields.length === 0) bad(`${t.id}: ingen skrivefelter`);
      for (const f of p.fields) if (!f.label || !f.placeholder) bad(`${t.id}: feltet ${f.id} mangler label/pladsholder`);
      if (!t.openEnded) bad(`${t.id}: rene skriveopgaver skal være mærket openEnded (mange rigtige svar)`);
    }

    if (p.kind === "morphology") {
      if (p.words.length !== 4) bad(`${t.id}: ${p.words.length} ord i morfologien, der skal være 4`);
      for (const w of p.words) {
        if (!artBare.includes(bare(w.word))) bad(`${t.id}: ordet "${w.word}" findes ikke i teksten`);
        for (const variant of [w.split, ...(w.splitAccepts ?? [])]) {
          const joined = norm(variant).replace(/-/g, "");
          if (joined !== norm(w.word)) bad(`${t.id}: opdelingen "${variant}" giver "${joined}", ikke "${w.word}"`);
        }
        if (!w.split.includes("-")) bad(`${t.id}: "${w.word}" er ikke delt med bindestreger`);
        if (!w.ask.answer) bad(`${t.id}: "${w.word}" mangler facit til ${w.ask.label}`);
        // Pladsholderen er et eksempel, ikke facit.
        if (norm(w.splitPlaceholder.replace(/^fx\s*/i, "").replace(/\.\.\.$/, "")) === norm(w.split))
          bad(`${t.id}: pladsholderen afslører opdelingen af "${w.word}"`);
        if (norm(w.ask.placeholder.replace(/^fx\s*/i, "")) === norm(w.ask.answer))
          bad(`${t.id}: pladsholderen afslører ${w.ask.label} for "${w.word}"`);
        points += 2;
      }
    }

    if (p.kind === "analysis") {
      if (p.chunks.length !== p.correctMap.length) bad(`${t.id}: chunks/correctMap ikke ens`);
      for (const sym of p.correctMap) if (!SYMBOLS.some((s) => s.symbol === sym)) bad(`${t.id}: ugyldigt symbol ${sym}`);
      const rebuilt = p.chunks.join(" ");
      if (rebuilt + "." !== p.sentence && rebuilt !== p.sentence) bad(`${t.id}: klumperne giver ikke sætningen: '${rebuilt}'`);
      if (!artBare.includes(bare(trimQuote(p.sentence)))) bad(`${t.id}: sætningen findes ikke i teksten`);
      points += p.chunks.length;
    }

    if (p.kind === "tense") {
      if (p.items.length !== 2) bad(`${t.id}: ${p.items.length} sætninger i verbaltiden, der skal være 2`);
      for (const it of p.items) {
        if (!artBare.includes(bare(trimQuote(it.sentence)))) bad(`${t.id}/${it.id}: sætningen findes ikke i teksten`);
        if (!bare(it.sentence).includes(bare(it.verb))) bad(`${t.id}/${it.id}: verbet "${it.verb}" står ikke i sætningen`);
        if (!EXAM_TENSES.some((x) => x.id === it.correct)) bad(`${t.id}/${it.id}: ukendt tid ${it.correct}`);
        if (!EXAM_TENSES.some((x) => x.id === it.rewriteTo)) bad(`${t.id}/${it.id}: ukendt omskrivningstid ${it.rewriteTo}`);
        if (it.correct === it.rewriteTo) bad(`${t.id}/${it.id}: omskrivningen er til den tid, sætningen allerede står i`);
        if (it.rewriteKeys.length === 0) bad(`${t.id}/${it.id}: ingen nøgleord til omskrivningen`);
        for (const k of it.rewriteKeys) {
          if (!` ${bare(it.rewriteAnswer)} `.includes(` ${bare(k)} `)) bad(`${t.id}/${it.id}: nøgleordet "${k}" står ikke i facit-sætningen`);
        }
        // Mindst ét nøgleord skal være NYT, ellers kan en uændret sætning
        // tælle som en rigtig omskrivning.
        if (it.rewriteKeys.every((k) => ` ${bare(it.sentence)} `.includes(` ${bare(k)} `)))
          bad(`${t.id}/${it.id}: ingen af nøgleordene ændrer sig i omskrivningen`);
        points += 2;
      }
    }

    if (p.kind === "clause") {
      const rebuilt = p.parts.map((x) => x.text).join(" ");
      if (rebuilt !== p.sentence) bad(`${t.id}: delene giver ikke sætningen: '${rebuilt}'`);
      if (!artBare.includes(bare(trimQuote(p.sentence)))) bad(`${t.id}: sætningen findes ikke i teksten`);
      if (!p.parts.some((x) => x.type === "led")) bad(`${t.id}: ingen ledsætning at spørge til`);
      if (!p.parts.some((x) => x.type === "hoved")) bad(`${t.id}: ingen hovedsætning`);
      if (!bare(p.sentence).includes(bare(p.indleder))) bad(`${t.id}: indlederen "${p.indleder}" står ikke i sætningen`);
      if (!EXAM_CLAUSE_FUNCTIONS.some((f) => f.id === p.funktion)) bad(`${t.id}: ukendt ledfunktion ${p.funktion}`);
      points += p.parts.length + 2;
    }
  }

  // Grammatikdelen (opgave 4-7) skal veje tungt: læreren har meldt, at det er
  // dér, eleverne har sværest ved stoffet.
  const grammar = sats.tasks.filter((t) => t.no >= 4).length;
  if (grammar !== 4) bad(`${sats.id}: grammatikdelen mangler opgaver`);
  if (points < 15) bad(`${sats.id}: kun ${points} point at rette på (for lidt til en karakter)`);
  ok(`${sats.id}: ${points} point kan rettes automatisk (opgave 1 + 4-7)`);
}

// Terminologi-tjek: latinske kortnavne i led-symbolerne.
for (const s of SYMBOLS) {
  if (/^(Grundled|Udsagnsled|Genstandsled|Hensynsled|Biled)$/.test(s.short)) bad(`symbols short '${s.short}' er ikke latinsk primaert`);
}

console.log(fails === 0 ? "ALL CHECKS PASSED" : `${fails} FEJL`);
if (fails > 0) process.exitCode = 1;
