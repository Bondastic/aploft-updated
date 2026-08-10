import type { Task } from "../types";
import { ALMEN_TASKS } from "./questions";
import { KOMMUNIKATION_TASKS } from "./hhx/kommunikation";
import { SPROGHANDLINGER_TASKS } from "./hhx/sproghandlinger";
import { SEMANTIK_TASKS } from "./hhx/semantik";
import { PRAGMATIK_TASKS } from "./hhx/pragmatik";
import { GENRER_TASKS } from "./hhx/genrer";
import { SPROGHISTORIE_TASKS } from "./hhx/sproghistorie";
import { LAERINGSSTRATEGIER_TASKS } from "./hhx/laeringsstrategier";

// HHX SPROGFORSTÅELSE: samlet spørgsmålsbank.
//
// Opbygning:
// 1) Fælles grammatik (genbrugt fra STX-siden): ordklasser, sætningsled,
//    morfologi, tempus og syntaks svarer til læreplanens krav om "grammatisk
//    terminologi og analysefærdighed" og er stort set identiske på HHX.
// 2) HHX-specifikke emner (skrevet fra bunden): kommunikation, sproghandlinger,
//    semantik, pragmatik, genrer & medier, sproghistorie og læringsstrategier.
//
// Opgaver i den fælles grammatik, der handler om LATIN (tempus: latinske tider;
// sætningsled: latinske kasus-parallelle) er filtreret fra, fordi latin er
// STX-stof og ikke indgår i HHX-pensum. Kasus-kategorien og hele latindelen
// indgår slet ikke på HHX.
const HHX_DENYLIST = new Set([
  "tempus-22",
  "tempus-23",
  "tempus-24",
  "tempus-25",
  "saetled-46",
  "saetled-47",
  "saetled-48",
]);

// De kategorier fra STX-siden, der genbruges på HHX (fælles grammatik).
const SHARED_CATEGORIES = new Set(["ordklasser", "saetningsled", "morfologi", "tempus", "syntaks"]);

const SHARED_HHX_TASKS: Task[] = ALMEN_TASKS.filter(
  (t) => SHARED_CATEGORIES.has(t.category) && !HHX_DENYLIST.has(t.id)
);

export const HHX_TASKS: Task[] = [
  ...SHARED_HHX_TASKS,
  ...KOMMUNIKATION_TASKS,
  ...SPROGHANDLINGER_TASKS,
  ...SEMANTIK_TASKS,
  ...PRAGMATIK_TASKS,
  ...GENRER_TASKS,
  ...SPROGHISTORIE_TASKS,
  ...LAERINGSSTRATEGIER_TASKS,
];
