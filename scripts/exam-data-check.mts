// Datatjek for HHX-eksamenssættene. Kør fra repo-roden:
//   node --experimental-strip-types scripts/exam-data-check.mts
//
// Tjekker, at de seks sæt følger skolens eksamensark (syv opgaver i fast
// rækkefølge), at alle delspørgsmål er gyldige, at ord og sætninger, der
// citeres, faktisk STÅR i teksten, og at hverken opgavetekster eller hints
// afslører facit.
import { HHX_EXAM_SATS, EXAM_WORD_CLASS_TAGS } from "../src/data/hhx/examSats.ts";
import { SYMBOLS } from "../src/data/symbols.ts";

let fails = 0;
const bad = (msg: string) => { fails++; console.log("FAIL:", msg); };
const ok = (msg: string) => console.log("ok:", msg);

// Skolens eksamensark: rækkefølgen af de syv opgaver ligger fast.
const TASK_ORDER = ["Genre", "Kommunikationssituation", "Sproglige særtræk", "Morfologi", "Syntaktisk analyse", "Verballedets tid", "Hoved- og ledsætninger"];

/** Til sammenligning med teksten: ens anførselstegn, ingen dobbelt-mellemrum. */
const norm = (t: string) =>
  t.normalize("NFKC").toLowerCase().replace(/['’‘"“”]/g, "").replace(/\s+/g, " ").trim();
/** Et citat kan slutte med tegnsætning eller udeladelsesprikker. */
const trimQuote = (t: string) => t.replace(/(\.\.\.|…)/gu, " ").replace(/^[.,;:!?\s]+|[.,;:!?\s]+$/gu, "").trim();

/**
 * Citater i opgavetekster springer ofte noget over ("Lige nu kan du ... Det
 * tager tyve minutter"). Hvert stykke skal findes i teksten for sig.
 */
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
const checkIds = new Set<string>();

for (const sats of HHX_EXAM_SATS) {
  const artText = norm([sats.article.title, sats.article.byline, ...sats.article.paragraphs].join(" "));
  const rawWords = sats.article.paragraphs.join(" ").split(/\s+/).length;
  ok(`${sats.title}: ${sats.tasks.length} opgaver, ${sats.minutes} min, ${sats.article.paragraphs.length} afsnit, ${rawWords} ord`);

  if (sats.tasks.length !== 7) bad(`${sats.id}: ${sats.tasks.length} opgaver, der skal være 7 (skolens ark)`);
  sats.tasks.forEach((t, i) => {
    if (t.no !== i + 1) bad(`${t.id}: opgavenummer ${t.no} står på plads ${i + 1}`);
    if (t.label !== TASK_ORDER[i]) bad(`${t.id}: emnet "${t.label}" står hvor "${TASK_ORDER[i]}" skulle stå`);
  });

  for (const t of sats.tasks) {
    if (taskIds.has(t.id)) bad(`dublet opgave-id ${t.id}`);
    taskIds.add(t.id);
    if (!t.hint || !t.feedback || !t.examTip) bad(`${t.id} mangler hint/feedback/examTip`);
    if (!t.modelAnswer || t.modelAnswer.length < 80) bad(`${t.id} mangler et rigtigt modelsvar`);
    if (!t.placeholder) bad(`${t.id} mangler placeholder i fritekst-feltet`);
    if (t.points.length < 3) bad(`${t.id}: kun ${t.points.length} punkter i checklisten (mindst 3)`);
    if (t.checks.length === 0) bad(`${t.id} har ingen delspørgsmål, så den kan ikke give karakter`);

    // Hintet må forklare metoden, men ALDRIG afsløre modelsvaret.
    const modelStart = norm(t.modelAnswer).split(" ").slice(0, 6).join(" ");
    if (modelStart.length > 20 && norm(t.hint).includes(modelStart)) bad(`${t.id}: hintet afslører modelsvaret`);

    // Citater i opgaveteksten skal stå i teksten (fanger slåfejl i ord/sætninger).
    for (const frag of quotedFragments(t.prompt)) {
      if (!artText.includes(frag)) bad(`${t.id}: citatet "${frag}" findes ikke i teksten`);
    }

    for (const c of t.checks) {
      if (checkIds.has(c.id)) bad(`dublet delspørgsmåls-id ${c.id}`);
      checkIds.add(c.id);
      if (!c.prompt || !c.feedback) bad(`${c.id} mangler prompt/feedback`);

      for (const frag of quotedFragments(c.prompt)) {
        if (!artText.includes(frag)) bad(`${c.id}: citatet "${frag}" findes ikke i teksten`);
      }

      if (c.kind === "choice") {
        if (c.correctIndex < 0 || c.correctIndex >= c.options.length) bad(`${c.id} correctIndex uden for range`);
        if (c.options.length < 3) bad(`${c.id}: for få svarmuligheder`);
        const corr = norm(c.options[c.correctIndex] ?? "");
        const corrFirstWords = corr.split(" ").slice(0, 5).join(" ");
        if (corrFirstWords.length > 12 && (norm(c.prompt).includes(corrFirstWords) || norm(t.hint).includes(corrFirstWords)))
          bad(`${c.id}: prompt/hint afslorer korrekt svarmulighed`);
      }

      if (c.kind === "multi") {
        for (const i of c.correctIndexes) if (i < 0 || i >= c.options.length) bad(`${c.id} korrekt index uden for range`);
        if (c.correctIndexes.length === 0 || c.correctIndexes.length >= c.options.length) bad(`${c.id} multi: forkert antal korrekte`);
        // Er alle muligheder ENKELTE ord, er det en "klik på ordene"-opgave:
        // så skal ordene findes i teksten.
        if (c.options.every((o) => /^[\wÆØÅæøå-]+$/u.test(o))) {
          for (const o of c.options) if (!artText.includes(norm(o))) bad(`${c.id}: ordet "${o}" findes ikke i teksten`);
        }
      }

      if (c.kind === "analysis") {
        if (c.chunks.length !== c.correctMap.length) bad(`${c.id} chunks/correctMap ikke ens`);
        for (const sym of c.correctMap) if (!SYMBOLS.some((s) => s.symbol === sym)) bad(`${c.id} ugyldigt symbol ${sym}`);
        const rebuilt = c.chunks.join(" ");
        if (!artText.includes(norm(trimQuote(c.sentence)))) bad(`${c.id} sætning findes ikke i teksten`);
        if (rebuilt + "." !== c.sentence && rebuilt !== c.sentence) bad(`${c.id} chunks matcher ikke sætningen: '${rebuilt}' vs '${c.sentence}'`);
      }

      if (c.kind === "wordclass") {
        for (const w of c.words) {
          const bare = w.word.replace(/[.,;:!?]/g, "");
          if (!artText.includes(norm(bare))) bad(`${c.id} ord "${w.word}" findes ikke i teksten`);
          if (!EXAM_WORD_CLASS_TAGS.some((tag) => tag.id === w.correct)) bad(`${c.id} ugyldig ordklasse ${w.correct}`);
        }
      }
    }
  }

  // Grammatikdelen (opgave 4-7) skal vægte tungt: læreren har meldt, at det er
  // dér eleverne har sværest ved stoffet.
  const grammar = sats.tasks.filter((t) => t.no >= 4).reduce((n, t) => n + t.checks.length, 0);
  const total = sats.tasks.reduce((n, t) => n + t.checks.length, 0);
  if (grammar < 6) bad(`${sats.id}: kun ${grammar} delspørgsmål i opgave 4-7 (mindst 6)`);
  ok(`${sats.id}: ${total} delspørgsmål i alt, heraf ${grammar} i grammatikdelen (opgave 4-7)`);
}

// Terminologi-tjek: latinske kortnavne i led-symbolerne.
for (const s of SYMBOLS) {
  if (/^(Grundled|Udsagnsled|Genstandsled|Hensynsled|Biled)$/.test(s.short)) bad(`symbols short '${s.short}' er ikke latinsk primaert`);
}

console.log(fails === 0 ? "ALL CHECKS PASSED" : `${fails} FEJL`);
if (fails > 0) process.exitCode = 1;
