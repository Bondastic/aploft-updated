// Statusoversigt: hvor mangler der feedback pr. svarmulighed, og hvor mangler
// der læsesider? Kør: npx tsx scripts/status-check.mts
import { ALMEN_TASKS } from "../src/data/questions.ts";
import { HHX_TASKS } from "../src/data/hhxQuestions.ts";
import { LATIN_TASKS } from "../src/data/latinQuestions.ts";
import { HHX_EMNE_INTRO, STX_EMNE_INTRO } from "../src/data/hhx/emneIntro.ts";
import { HHX_CATEGORIES, ALMEN_CATEGORIES } from "../src/data/categories.ts";
import type { Task } from "../src/types.ts";

const seen = new Set<string>();
const rows: Record<string, { mc: number; medWhy: number; andre: number }> = {};
for (const [bank, tasks] of [["almen", ALMEN_TASKS], ["hhx", HHX_TASKS], ["latin", LATIN_TASKS]] as [string, Task[]][]) {
  for (const t of tasks) {
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    const key = `${bank}/${t.category}`;
    rows[key] ??= { mc: 0, medWhy: 0, andre: 0 };
    if (t.type === "choice") {
      rows[key].mc++;
      if (t.whyWrong && t.whyWrong.some((w) => w.trim().length > 0)) rows[key].medWhy++;
    } else rows[key].andre++;
  }
}
let mc = 0, why = 0;
console.log("kategori".padEnd(26), "MC".padStart(4), "m/begrundelse".padStart(14), "andre".padStart(6));
for (const [k, v] of Object.entries(rows).sort()) {
  mc += v.mc; why += v.medWhy;
  console.log(k.padEnd(26), String(v.mc).padStart(4), String(v.medWhy).padStart(14), String(v.andre).padStart(6));
}
console.log(`\nI ALT: ${mc} multiple choice, ${why} med begrundelse pr. svarmulighed (${Math.round((why / mc) * 100)}%)`);
const hhxCats = HHX_CATEGORIES.map((c) => c.id);
console.log("\nLæsesider (HHX):");
for (const c of hhxCats) console.log(" ", (c as string).padEnd(20), c in HHX_EMNE_INTRO ? "✔" : "mangler");
console.log("\nLæsesider (STX, almen-delen):");
for (const c of ALMEN_CATEGORIES.map((x) => x.id)) {
  console.log(" ", (c as string).padEnd(20), c in STX_EMNE_INTRO ? "✔" : "mangler");
}
