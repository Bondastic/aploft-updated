// Kopiér-til-AI for PRØVE-GENERATOREN (Quiz-sætningen på Prøve-siden).
// Bygger et rent stykke tekst med opgave + elevens svar, så eleven kan
// sætte det ind i en AI efter eget valg og få feedback på de skriftlige
// svar (appens egne blok-svar kan en AI ikke læse). Indeholder bevidst IKKE
// facit: AI'en skal vurdere ud fra opgaven, ikke sammenligne med vores svar.

import type { SavedAnswer, Task } from "../types";
import { getSymbolDef } from "../data/symbols";

export type QuizOutcome = { ok: boolean; answer?: SavedAnswer } | null;

function describeAnswer(task: Task, answer: SavedAnswer | undefined): string {
  if (!answer) return "(ikke besvaret)";
  switch (task.type) {
    case "choice": {
      if (answer.kind === "choice" && answer.selected !== null) {
        const opt = task.options[answer.selected];
        return opt ? `${opt} (mulighed ${String.fromCharCode(65 + answer.selected)})` : "(tomt svar)";
      }
      return "(ikke besvaret)";
    }
    case "click-word": {
      if (answer.kind === "click-word") {
        const picked = answer.selected.map((i) => task.tokens[i]).filter(Boolean);
        return picked.length > 0 ? picked.join(", ") : "(ingen ord valgt)";
      }
      return "(ikke besvaret)";
    }
    case "analysis": {
      if (answer.kind === "analysis") {
        const syms = answer.symbols ?? task.chunks.map((_, i) => answer.assignments[i] ?? null);
        const parts = task.chunks.map((c, i) => {
          const sym = syms[i];
          return `${c} = ${sym ? getSymbolDef(sym).short : "(ikke valgt)"}`;
        });
        return parts.join(" ; ");
      }
      return "(ikke besvaret)";
    }
    case "build-sentence": {
      if (answer.kind === "build-sentence") return answer.words.join(" ");
      return "(ikke besvaret)";
    }
    case "write": {
      if (answer.kind === "write") return answer.value.trim() || "(tomt svar)";
      return "(ikke besvaret)";
    }
    case "table-fill": {
      if (answer.kind === "table-fill") {
        return task.rows
          .map((r, i) => `${r.label} = ${answer.assignments[i] ?? "(tom)"}`)
          .filter((line, i) => task.blankIndexes.includes(i))
          .join(" ; ");
      }
      return "(ikke besvaret)";
    }
    default:
      return "(opgaven kræver ikke svar)";
  }
}

function promptOf(task: Task): string {
  switch (task.type) {
    case "choice":
      return task.prompt;
    case "click-word":
      return `${task.instruction} | Sætning: "${task.sentence}"`;
    case "analysis":
      return `${task.instruction} | Sætning: "${task.sentence}"`;
    case "build-sentence":
      return `${task.instruction} | Ord at stille op: ${task.words.join(" ")}`;
    case "write":
      return `${task.instruction} ${task.prompt}`;
    case "table-fill":
      return `${task.instruction} | Tabel: ${task.tableTitle} (${task.rows.map((r) => r.label).join(", ")})`;
    default:
      return "Undervisningstrin (ingen besvarelse)";
  }
}

/** Clipboard-hjælper med execCommand-fallback (samme robusthed som på eksamenssættet). */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/** Sæt tekst klar til udklipsholderen: opgaver + elevens egne svar. */
export function buildQuizCopyText(title: string, tasks: Task[], results: QuizOutcome[]): string {
  const lines: string[] = [];
  lines.push(`${title} (AP Klar, HHX/STX-træning)`);
  lines.push("");
  tasks.forEach((task, i) => {
    if (task.type === "teach" || task.type === "info") return;
    const outcome = results[i];
    lines.push(`SPØRGSMÅL ${i + 1}: ${promptOf(task)}`);
    lines.push(`  MIT SVAR: ${describeAnswer(task, outcome?.answer)}`);
    lines.push("");
  });
  return lines.join("\n");
}

/** Prompt-tekst til AI-feedback (samme indhold + en kort instruks). */
export function buildQuizAiPrompt(title: string, tasks: Task[], results: QuizOutcome[]): string {
  return [
    "Jeg træner Almen Sprogforståelse (AP) på " + (title.includes("HHX") ? "HHX" : "STX") + " og har lige svaret på en genereret prøve.",
    "Ret venligst mine svar herunder ét ad gangen: sig hvad der er rigtigt, hvad der er forkert, og forklar kort hvorfor. Brug de latinske betegnelser for led (subjekt, verballed, direkte/indirekte objekt, adverbial, subjektsprædikat) som primære og de danske i parentes.",
    "Slut af med 3 konkrete ting, jeg skal gøre bedre næste gang. Jeg har svaret i blokke (klik og valg), så bedøm indholdet, ikke formatet.",
    "",
    buildQuizCopyText(title, tasks, results),
  ].join("\n");
}
