import type { Task } from "../types";
import { ORDKLASSER_TASKS } from "./almen/ordklasser";
import { SAETNINGSLED_TASKS } from "./almen/saetningsled";
import { MORFOLOGI_TASKS } from "./almen/morfologi";
import { TEMPUS_TASKS } from "./almen/tempus";
import { KASUS_TASKS } from "./almen/kasus";
import { SYNTAKS_TASKS } from "./almen/syntaks";
import { SPROG_TASKS } from "./almen/sprog";

// ALMEN SPROGFORSTÅELSE: samlet spørgsmålsbank.
//
// Sådan tilføjer du flere spørgsmål:
// 1. Åbn den relevante fil i src/data/almen/ (fx ordklasser.ts).
// 2. Brug hjælpefunktionerne fra src/data/builders.ts (mc, ck, an, bs, wr) —
//    hver funktion returnerer et helt opgaveobjekt på én linje.
// 3. Husk et unikt id (fx "ordklasser-56") og en kort, præcis forklaring.
// 4. Opgaven dukker automatisk op i øvelser, prøver og den ultimative test.
export const ALMEN_TASKS: Task[] = [
  ...ORDKLASSER_TASKS,
  ...SAETNINGSLED_TASKS,
  ...MORFOLOGI_TASKS,
  ...TEMPUS_TASKS,
  ...KASUS_TASKS,
  ...SYNTAKS_TASKS,
  ...SPROG_TASKS,
];
