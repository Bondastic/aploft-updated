import type { Task } from "../types";
import { SUMESSE_TASKS } from "./latin/sumesse";
import { ORDFORRAAD_TASKS } from "./latin/ordforraad";
import { GRAMMATIK_TASKS } from "./latin/grammatik";
import { OVERSAETTELSE_TASKS } from "./latin/oversaettelse";
import { KULTUR_TASKS } from "./latin/kultur";

// LATINDEL: samlet spørgsmålsbank til AP's latinske element.
// Se src/data/questions.ts for en forklaring af, hvordan du let tilføjer
// flere spørgsmål med hjælpefunktionerne i src/data/builders.ts.
export const LATIN_TASKS: Task[] = [
  ...SUMESSE_TASKS,
  ...ORDFORRAAD_TASKS,
  ...GRAMMATIK_TASKS,
  ...OVERSAETTELSE_TASKS,
  ...KULTUR_TASKS,
];

export { LATIN_VOCAB, findVocab, type VocabEntry } from "./latin/vocab";
