// Finder svarmuligheder, der røber facit. Kør fra repo-roden:
//   node --experimental-strip-types scripts/option-leak-check.mts
//
// Baggrund: elever i testrunden skrev, at svaret kunne ses på forhånd :
// "i nogle af opgaverne var det ord som var svaret markeret med stort" og
// parenteserne forklarer, hvorfor de forkerte muligheder er forkerte.
// Scriptet leder efter de mønstre, man kan snyde sig til svaret med.
import { ALMEN_TASKS } from "../src/data/questions.ts";
import { HHX_TASKS } from "../src/data/hhxQuestions.ts";
import { LATIN_TASKS } from "../src/data/latinQuestions.ts";
import type { Task } from "../src/types.ts";

const banks: [string, Task[]][] = [["almen", ALMEN_TASKS], ["hhx", HHX_TASKS], ["latin", LATIN_TASKS]];
// --json giver maskinlæsbar liste (bruges af oprydnings-scriptet).
const asJson = process.argv.includes("--json");
const json: unknown[] = [];
const seen = new Set<string>();
let problems = 0;

const hasParen = (o: string) => /\(/.test(o);
const startsUpper = (o: string) => /^[A-ZÆØÅ]/.test(o.trim());
const words = (o: string) => o.trim().split(/\s+/).length;

for (const [bank, tasks] of banks) {
  for (const t of tasks) {
    if (t.type !== "choice") continue;
    if (seen.has(t.id)) continue; // HHX genbruger den fælles grammatik
    seen.add(t.id);
    const opts = t.options;
    const correct = t.correctIndex;
    const withParen = opts.map((o, i) => (hasParen(o) ? i : -1)).filter((i) => i >= 0);

    // 1) Kun det rigtige svar har en forklarende parentes : eller kun de forkerte har.
    if (withParen.length > 0 && withParen.length < opts.length) {
      const onlyCorrect = withParen.length === 1 && withParen[0] === correct;
      const onlyWrong = !withParen.includes(correct);
      if (onlyCorrect || onlyWrong) {
        problems++;
        if (asJson) json.push({ bank, id: t.id, kind: onlyCorrect ? "paren-correct" : "paren-wrong", correct, options: opts, explanation: t.explanation });
        else {
          console.log(`${bank} ${t.id} [parentes-tell${onlyCorrect ? ": kun facit" : ": kun distraktorer"}]`);
          opts.forEach((o, i) => console.log(`   ${i === correct ? "✔" : " "} ${o}`));
        }
      }
    }

    // 2) Kun det rigtige svar starter med stort bogstav (eller er det eneste med småt).
    const upper = opts.map((o, i) => (startsUpper(o) ? i : -1)).filter((i) => i >= 0);
    if ((upper.length === 1 && upper[0] === correct) || (upper.length === opts.length - 1 && !upper.includes(correct))) {
      problems++;
      if (asJson) json.push({ bank, id: t.id, kind: "case", correct, options: opts, explanation: t.explanation });
      else {
        console.log(`${bank} ${t.id} [store bogstaver skiller facit ud]`);
        opts.forEach((o, i) => console.log(`   ${i === correct ? "✔" : " "} ${o}`));
      }
    }

    // 3) Facit er markant længere end alle distraktorer (gammelt mønster, tjek igen).
    const lens = opts.map(words);
    const maxOther = Math.max(...lens.filter((_, i) => i !== correct));
    if (lens[correct] >= 6 && lens[correct] >= maxOther * 2) {
      problems++;
      if (asJson) json.push({ bank, id: t.id, kind: "length", correct, options: opts, explanation: t.explanation });
      else {
        console.log(`${bank} ${t.id} [facit er dobbelt så langt som alle andre]`);
        opts.forEach((o, i) => console.log(`   ${i === correct ? "✔" : " "} ${o}`));
      }
    }
  }
}

if (asJson) console.log(JSON.stringify(json, null, 1));
else console.log(problems === 0 ? "INGEN AFSLØRENDE SVARMULIGHEDER" : `${problems} opgaver at rette`);
