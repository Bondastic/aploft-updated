// Hjælpefunktioner til at bygge opgaver med minimal kedelplade.
// Brug disse i stedet for at skrive de fulde objekter i hånden — det gør det
// nemt at tilføje mange nye spørgsmål (én linje pr. spørgsmål).
import type {
  AnalysisTaskT,
  BuildSentenceTaskT,
  CategoryId,
  ChoiceTaskT,
  ClickWordTaskT,
  InfoTaskT,
  LedSymbol,
  Task,
  TableFillTaskT,
  WriteTaskT,
} from "../types";

/** Multiple choice-opgave. */
export function mc(
  id: string,
  category: CategoryId,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  showSheet?: boolean
): ChoiceTaskT {
  return { id, category, type: "choice", prompt, options, correctIndex, explanation, showSheet };
}

/** Klik-på-ord-opgave. `sentence` splittes på mellemrum til tokens. */
export function ck(
  id: string,
  category: CategoryId,
  instruction: string,
  sentence: string,
  correctIndexes: number[],
  explanation: string
): ClickWordTaskT {
  return {
    id,
    category,
    type: "click-word",
    instruction,
    sentence,
    tokens: sentence.split(" "),
    correctIndexes,
    explanation,
  };
}

/** Sætningsanalyse-opgave med de 7 symboler. */
export function an(
  id: string,
  category: CategoryId,
  instruction: string,
  sentence: string,
  chunks: string[],
  correctMap: LedSymbol[],
  explanation: string
): AnalysisTaskT {
  return { id, category, type: "analysis", instruction, sentence, chunks, correctMap, explanation };
}

/** Byg-sætningen-opgave (ordene skal sættes i rigtig rækkefølge).
 *  Sæt `wordOrderFree` til true for latinske sætninger, hvor enhver
 *  rækkefølge af de rigtige ord er grammatisk korrekt (fri ordstilling) —
 *  eleven får da en forklarende note, hvis rækkefølgen afviger fra den
 *  mest almindelige, men svaret tælles stadig som rigtigt. */
export function bs(
  id: string,
  category: CategoryId,
  instruction: string,
  correctOrder: string[],
  explanation: string,
  wordOrderFree?: boolean
): BuildSentenceTaskT {
  return { id, category, type: "build-sentence", instruction, words: correctOrder, correctOrder, explanation, wordOrderFree };
}

/** Skriveopgave: eleven taster selv svaret ind. */
export function wr(
  id: string,
  category: CategoryId,
  instruction: string,
  prompt: string,
  answer: string,
  explanation: string,
  altAnswers?: string[],
  showSheet?: boolean
): WriteTaskT {
  return { id, category, type: "write", instruction, prompt, answer, altAnswers, explanation, showSheet };
}

/** Normaliserer et skrevet svar til sammenligning: små bogstaver, trimmet,
 *  uden afsluttende punktum/komma/udråbstegn, enkelte mellemrum. */
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isWriteAnswerCorrect(task: WriteTaskT, given: string): boolean {
  const norm = normalizeAnswer(given);
  if (norm.length === 0) return false;
  const candidates = [task.answer, ...(task.altAnswers ?? [])].map(normalizeAnswer);
  return candidates.includes(norm);
}

/** Info-/skema-trin: viser en bøjningstabel roligt, uden at "teste" endnu. */
export function info(
  id: string,
  category: CategoryId,
  title: string,
  intro: string,
  rows: { label: string; value: string }[],
  continueLabel?: string
): InfoTaskT {
  return {
    id,
    category,
    type: "info",
    title,
    intro,
    rows,
    continueLabel,
    explanation: "",
  };
}

/** Tabel-udfyldning: en bøjningstabel, hvor nogle felter mangler og skal
 *  udfyldes fra en ordbank (fx sum/es/est-tabellen med "es" og "estis" tomme). */
export function tf(
  id: string,
  category: CategoryId,
  instruction: string,
  tableTitle: string,
  rows: { label: string; value: string }[],
  blankIndexes: number[],
  explanation: string,
  extraDistractors?: string[]
): TableFillTaskT {
  return { id, category, type: "table-fill", instruction, tableTitle, rows, blankIndexes, explanation, extraDistractors };
}

/** Sørger for at alle id'er i en opgavepulje er unikke (bruges i dev/test). */
export function assertUniqueIds(tasks: Task[]): void {
  const seen = new Set<string>();
  for (const t of tasks) {
    if (seen.has(t.id)) {
      throw new Error(`Dobbelt opgave-id fundet: ${t.id}`);
    }
    seen.add(t.id);
  }
}
