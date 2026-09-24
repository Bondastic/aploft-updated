// ---------------------------------------------------------------------------
// "Sådan tjekker du det selv" : den metode, eleven kan bruge NÆSTE gang.
//
// Elevernes tilbagemelding fra testrunden var, at feedbacken skal give en reel
// begrundelse. whyWrong forklarer, hvorfor netop DET svar er forkert : det her
// er det andet halve skridt: hvilket håndgreb man bruger for selv at nå frem
// til det rigtige svar. Det vises i feedbacken, når et svar er forkert.
//
// Teksterne er skrevet ud fra AP-undervisningens eget materiale (analysepilen,
// ikke-reglen, morfemtyperne, hjælpeverbet som tempusmarkør og pentagrammet).
// ---------------------------------------------------------------------------

import type { CategoryId } from "../types";

export const CATEGORY_METODE: Partial<Record<CategoryId, string>> = {
  saetningsled:
    "Gå analysepilen igennem i fast rækkefølge: find verballeddet først (hvad sker der?), så subjektet (hvem/hvad + verballed?), så objekterne (verballed + subjekt + hvad?) og til sidst adverbialerne. Husk at et led godt kan fylde flere ord.",
  ordklasser:
    "Prøv at bøje ordet i stedet for at tænke på, hvad det betyder. Kan du sætte en/et foran og lave flertal, er det et substantiv. Kan du sætte at foran og bøje det i tid, er det et verbum. Kan du gradbøje det, er det et adjektiv.",
  morfologi:
    "Find rodmorfemet først : den del, der bærer grundbetydningen. Spørg så om resten: laver delen et NYT ord (afledning: præfiks eller suffiks), eller kun en ny FORM af det samme ord (bøjning: fleksiv)?",
  tempus:
    "Se på hjælpeverbet, hvis der er et. Står det i nutid (har, er), er det førnutid. Står det i datid (havde, var), er det førdatid. Er der intet hjælpeverbum, kigger du på hovedverbets egen form: nutid eller datid.",
  syntaks:
    "Brug ikke-reglen. Sæt ikke ind i sætningen: lander det EFTER det bøjede verbum, er det en hovedsætning. Lander det FØR verbet, er det en ledsætning. Testen virker, også når mavefornemmelsen er i tvivl.",
  kasus:
    "Se på endelsen, ikke på ordets plads i sætningen. Sammenlign endelsen med bøjningsmønstret, og tjek derefter, at funktionen giver mening: er der allerede et direkte objekt, er den tvivlsomme form typisk dativ og ikke genitiv.",
  sprog:
    "Hold de tre niveauer adskilt: fonem er den mindste LYD, morfem er den mindste DEL MED BETYDNING, og grafem er det skrevne TEGN. Ved sprogfamilier spørger du, om ligheden skyldes fælles ophav eller lån.",
  kommunikation:
    "Gå pentagrammet igennem punkt for punkt: afsender, modtager, emne, omstændigheder og sprog. Peg på et konkret sted i teksten for hvert punkt : det er belægget, der giver point, ikke påstanden.",
  genrer:
    "Bestem genren ud fra TRÆKKENE, ikke ud fra emnet. Spørg: træder afsenderen frem som person? Er der kilder? Er der en holdning? Er der noget, der skal sælges? Skriv altid de træk, du bygger din bestemmelse på.",
  sproghandlinger:
    "Spørg, hvad afsenderen vil OPNÅ, ikke hvordan sætningen ser ud. Vil de have dig til at tro noget (assertiv), gøre noget (direktiv), stole på dem (kommissiv) eller forstå en følelse (ekspressiv)? Et høfligt spørgsmål fra en chef er stadig en direktiv.",
  semantik:
    "Skil grundbetydningen fra ladningen. Denotationen er det, der står i ordbogen. Konnotationen er det, ordet vækker hos en hel sproggruppe. Tæl derefter, om teksten mest bruger neutrale eller ladede ord.",
  pragmatik:
    "Læs afsender, modtager og situation, FØR du læser ordene. Den samme sætning betyder noget andet fra en kollega end fra en chef. Kig efter forbehold og høflighedsstrategier: de afslører, at budskabet er ubehageligt.",
  sproghistorie:
    "Spørg i tre trin: kan ordet spores tilbage til urnordisk (arveord)? Er det lånt og tilpasset dansk, så det føles dansk (låneord)? Eller er stavemåde og udtale stadig fremmed (fremmedord)?",
  laeringsstrategier:
    "Spørg, om metoden kræver, at du henter svaret frem fra hukommelsen. Gør den det, virker den. Gør den ikke (fx at genlæse noter), føles den bare nem, fordi teksten er ved at blive velkendt.",
};
