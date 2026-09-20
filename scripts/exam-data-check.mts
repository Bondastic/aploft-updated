import { HHX_EXAM_SATS, EXAM_WORD_CLASS_TAGS } from "../src/data/hhx/examSats.ts";
import { SYMBOLS } from "../src/data/symbols.ts";

let fails = 0;
const bad = (msg: string) => { fails++; console.log("FAIL:", msg); };
const ok = (msg: string) => console.log("ok:", msg);

for (const sats of HHX_EXAM_SATS) {
  const artText = sats.article.paragraphs.join(" ");
  ok(`${sats.title}: ${sats.questions.length} spørgsmål, ${sats.minutes} min, ${sats.article.paragraphs.length} afsnit, ${artText.split(/\s+/).length} ord`);
  for (const q of sats.questions) {
    if (!q.hint || !q.feedback || !q.examTip) bad(`${q.id} mangler hint/feedback/examTip`);
    // hints and prompts must not contain the correct option text (answer leakage)
    const leaky = (t: string) => t.normalize("NFKC").toLowerCase().replace(/[^a-zæøå0-9 ]/g, "");
    if (q.kind === "choice") {
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) bad(`${q.id} correctIndex uden for range`);
      const corr = leaky(q.options[q.correctIndex] ?? "");
      const corrFirstWords = corr.split(/\s+/).slice(0, 5).join(" ");
      if (corrFirstWords.length > 12 && (leaky(q.prompt).includes(corrFirstWords) || leaky(q.hint).includes(corrFirstWords)))
        bad(`${q.id}: hint/prompt afslorer korrekt svarmulighed`);
    }
    if (q.kind === "multi") {
      for (const i of q.correctIndexes) if (i < 0 || i >= q.options.length) bad(`${q.id} korrekt index uden for range`);
      if (q.correctIndexes.length === 0 || q.correctIndexes.length >= q.options.length) bad(`${q.id} multi: forkert antal korrekte`);
    }
    if (q.kind === "analysis") {

      if (q.chunks.length !== q.correctMap.length) bad(`${q.id} chunks/correctMap ikke ens`);
      for (const sym of q.correctMap) if (!SYMBOLS.some((s) => s.symbol === sym)) bad(`${q.id} ugyldigt symbol ${sym}`);
      const rebuilt = q.chunks.join(" ");
      if (!artText.includes(q.sentence)) bad(`${q.id} sætning findes ikke i artiklen`);
      if (rebuilt + "." !== q.sentence && rebuilt !== q.sentence) bad(`${q.id} chunks matcher ikke sætningen: '${rebuilt}' vs '${q.sentence}'`);
    }
    if (q.kind === "wordclass") {
      for (const w of q.words) {
        const bare = w.word.replace(/[.,;:!?]/g, "");
        if (!artText.includes(bare)) bad(`${q.id} ord "${w.word}" findes ikke i artiklen`);
        if (!EXAM_WORD_CLASS_TAGS.some((t) => t.id === w.correct)) bad(`${q.id} ugyldig ordklasse ${w.correct}`);
      }
    }
  }
}
// Terminology check: latin-primary short names everywhere in SYMBOLS
for (const s of SYMBOLS) {
  if (/^(Grundled|Udsagnsled|Genstandsled|Hensynsled|Biled)$/.test(s.short)) bad(`symbols short '${s.short}' er ikke latinsk primaert`);
}
console.log(fails === 0 ? "ALL CHECKS PASSED" : `${fails} FEJL`);

// Kør: node --experimental-strip-types scripts/exam-data-check.mts  (fra repo-roden)
