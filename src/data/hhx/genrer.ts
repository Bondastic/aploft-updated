import { mc, ck, wr } from "../builders";
import type { Task } from "../../types";

// GENRER & MEDIER (HHX-pensum: "genrebevidst formidling", "genre- og
// mediebevidst formidling"). En genre er en teksttype med genkendelige træk,
// formål og struktur ; og mediebevidsthed handler om at tilpasse budskabet
// til kanalen.
const c = "genrer" as const;

export const GENRER_TASKS: Task[] = [
 mc(
 "genrer-1",
 c,
 "Hvad er en genre?",
 ["En teksttype med genkendelige træk, formål og struktur, fx en reklame", "Et ords bøjning, fx i nutid og datid, som ændrer formen", "En bestemt farve eller et layout i et design, fx en logo", "Et synonym for et medie, som fx Instagram eller en avis"],
 0,
 "Genrer er genkendelige mønstre for tekster: en reklame vil overtale, en pressemeddelelse vil informere medierne, en forretningsmail vil kommunikere klart og professionelt."
 ),
 mc(
 "genrer-2",
 c,
 "Hvad betyder 'genrebevidst formidling'?",
 ["At man vælger og former sin tekst, så den passer til genren og modtageren", "At man kun skriver i én genre hele livet", "At man altid efterligner andre tekster helt nøjagtigt, uden at ændre noget", "At man undgår genrer og bare skriver frit"],
 0,
 "Genrebevidst formidling er at kende genrens spilleregler ; og bevidst bruge eller bryde dem for at nå sit formål."
 ),
 mc(
 "genrer-3",
 c,
 "Hvilke træk kendetegner en professionel forretningsmail?",
 ["En klar emnelinje, en formel hilsen og et tydeligt formål", "Ingen emnelinje, kun små bogstaver og en masse emojis i teksten", "Kun ét ord i hele mailen, så den er hurtig", "At den altid er på engelsk, uanset modtageren"],
 0,
 "Forretningsmailen er en genre med faste konventioner: emnelinje, anstand, klart formål, høflig afslutning. At mestre den er en kernekompetence i erhvervslivet."
 ),
 mc(
 "genrer-4",
 c,
 "Hvad er reklamens vigtigste formål?",
 ["At overtale modtageren til at købe eller handle", "At informere neutralt og objektivt om et produkt", "At dokumentere regnskaber", "At underholde uden budskab"],
 0,
 "Reklamen er en overtalende genre: den bruger positive konnotationer, opfordringer og billeder til at skabe lyst hos modtageren."
 ),
 mc(
 "genrer-5",
 c,
 "Hvad er formålet med en pressemeddelelse?",
 ["At informere journalister og medier om en nyhed, så de vil skrive om den", "At sælge et produkt direkte til forbrugeren gennem en annonce", "At dokumentere interne møder og beslutninger for medarbejderne", "At sende til alle kunder som reklame for virksomhedens produkter"],
 0,
 "Pressemeddelelsen henvender sig til medierne: den er skrevet som en nyhed med en positiv vinkel, så journalister nemt kan bringe den."
 ),
 mc(
 "genrer-6",
 c,
 "Hvilken genre er typisk bygget op om overskrift, brødtekst og en tydelig 'call to action'?",
 ["En annonce eller reklame", "Et referat af et møde (overskrift, punktliste)", "En kvittering for et køb (dato, beløb)", "En ordbog over fagord (opslagsværk)"],
 0,
 "Annoncer og reklamer er bygget op om at fange opmærksomhed (overskrift), overbevise (brødtekst) og få modtageren til at handle (call to action)."
 ),
 mc(
 "genrer-7",
 c,
 "En jobannonce og en ansøgning er to forskellige genrer. Hvad er den vigtigste forskel?",
 ["Jobannoncen kommer fra arbejdsgiveren; ansøgningen fra kandidaten, der skal overbevise", "De er ens, for begge beskriver jobbet og kravene til den rigtige kandidat", "Ansøgningen skrives altid på engelsk, mens annoncen skrives på dansk", "Jobannoncer er altid mundtlige, mens ansøgninger altid er skriftlige"],
 0,
 "Afsender og formål er forskellige: arbejdsgiveren søger (annonce), kandidaten tilbyder sig selv (ansøgning). Genren afgør indhold, struktur og tone."
 ),
 mc(
 "genrer-8",
 c,
 "Hvad betyder 'mediebevidst formidling'?",
 ["At man tilpasser budskabet til det medie, det udgives i", "At man kun bruger ét enkelt medie til hele sin kommunikation", "At man skriver præcis det samme, uanset hvilket medie budskabet skal ud i", "At man undgår digitale medier og kun bruger papir"],
 0,
 "Mediet sætter rammerne: Instagram kræver korte, billedbårne budskaber; en hjemmeside kan rumme lange, strukturerede tekster; en mail har sine egne konventioner."
 ),
 mc(
 "genrer-9",
 c,
 "Hvilket sprog kendetegner en årsrapport?",
 ["Et formelt, fagligt sprog med økonomiske fagudtryk", "Slang og mange forkortelser, så den er nem og hurtig at læse", "Kun billeder og grafik, uden tekst", "Poetiske metaforer og billedsprog i hvert eneste afsnit"],
 0,
 "Årsrapporten er en professionel, dokumenterende genre rettet mod investorer og interessenter: formel tone, præcise tal og fagterminologi."
 ),
 mc(
 "genrer-10",
 c,
 "En virksomhed skriver et opslag til Instagram om et nyt produkt. Hvad bør præge opslaget?",
 ["Kort tekst, stærkt billede og en tydelig opfordring til at handle", "En lang juridisk redegørelse for produktets egenskaber og vilkår", "En formel henvendelse til aktionærerne om selskabets resultater", "Et referat af et møde om produktets udvikling og lancering"],
 0,
 "SoMe-opslag er korte, visuelle og handlingsorienterede. Genren og mediet hænger sammen: Instagram er ikke stedet for en årsrapport."
 ),
 mc(
 "genrer-11",
 c,
 "Hvilken genre er følgende begyndelse: 'Vi er glade for at kunne meddele, at vi har indgået et nyt samarbejde med ...'?",
 ["En pressemeddelelse", "En ansøgning (man søger et job)", "En kvittering (man har købt noget)", "Et referat (fra et møde)"],
 0,
 "Frasen 'Vi er glade for at kunne meddele' er en klassisk pressemeddelelses-åbning: en positiv nyhed formuleret, så medierne kan bruge den."
 ),
 mc(
 "genrer-12",
 c,
 "Hvorfor er det vigtigt at kende genrernes konventioner i HHX AP?",
 ["Fordi man skal kunne analysere og producere tekster, der passer til formålet", "Fordi man skal lære alle genrer udenad til eksamen, inklusive deres regler", "Fordi det kun handler om reklamer og markedsføring, ikke andet", "Fordi genrer aldrig ændrer sig, så de er lette at lære en gang for alle"],
 0,
 "Læreplanen kræver 'genre- og mediebevidst formidling' både receptivt (analyse) og produktivt (egen tekstproduktion)."
 ),
 ck(
 "genrer-13",
 c,
 "Klik på det ord, der tydeligst afslører, at denne tekst er en REKLAME.",
 "Køb to og få én gratis i hele denne uge",
 [0],
 "'Køb' er en direkte opfordring (imperativ) ; reklamens kendetegn. Også 'gratis' er et typisk reklameord."
 ),
 wr(
 "genrer-14",
 c,
 "Hvilken genre er følgende tekst: 'Vi søger en engageret sælger til vores team i København. Ansøgningsfrist: 1. september.'?",
 "Skriv genren:",
 "jobannonce",
 "Det er en jobannonce: en arbejdsgiver søger en kandidat og angiver ansøgningsfrist.",
 ["en jobannonce", "annonce", "stillingsannonce"]
 ),
 mc(
 "genrer-15",
 c,
 "En virksomhed skal informere kunder om en ændring af åbningstider. Hvilken genre er mest hensigtsmæssig?",
 ["En kort, venlig besked på hjemmesiden og i butikken", "En lang juridisk kontrakt med alle vilkår og betingelser", "En intern mail til ledelsen om ændringen af åbningstiderne", "Et hemmeligt referat, som kun de ansatte kan se"],
 0,
 "Man vælger genren efter modtager og formål: kunderne skal have en klar, tilgængelig besked ; ikke en kontrakt."
 ),
 mc(
 "genrer-16",
 c,
 "Hvad er forskellen på en teksts genre og dens medie?",
 ["Genren er teksttypen; mediet er kanalen, den udgives i", "De er det samme, bare to ord for den samme ting", "Mediet er teksttypen, og genren er kanalen, den udgives i", "Genrer findes kun i bøger, medier kun på nettet"],
 0,
 "En reklame (genre) kan optræde i mange medier: avis, tv, Instagram eller udendørsplakat. Genre og medie påvirker hinanden, men er to forskellige begreber."
 ),

  mc("genrer-17", c, "Hvad er formålet med et referat fra et møde?", ["At dokumentere beslutninger og aftaler, så alle kan se dem", "At underholde læserne med historier", "At sælge et produkt til mødedeltagerne", "At erstatte selve mødet"], 0, "Referatets genreformål er dokumentation: Beslutninger, ansvar og deadlines bliver skrevet ned, så der ikke opstår tvivl."),
  mc("genrer-18", c, "Hvilken genre er 'Kære kunde ... Med venlig hilsen'?", ["En forretningsmail eller et forretningsbrev", "En reklame", "Et referat", "En årsrapport"], 0, "Den faste struktur med hilsen, emne og afslutning er kendetegnende for forretningsmailen som genre."),
  mc("genrer-19", c, "Hvad kendetegner et godt nyhedsbrev til kunder?", ["Kort, personligt sprog, relevante nyheder og en tydelig opfordring", "Lange juridiske afsnit om vilkår", "Kun tal og tabeller uden tekst", "Slang og uformelle forkortelser"], 0, "Nyhedsbrevet skal kunne skimmes: Korte afsnit, relevans for modtageren og en klar opfordring til handling."),
  mc("genrer-20", c, "Hvad er forskellen på reklame og PR?", ["Reklame er betalt indhold; PR er omtale, man ikke betaler for", "Reklame er mundtlig, PR er skriftlig", "Reklame er altid kort, PR altid lang", "Der er ingen forskel"], 0, "Reklamer køber man plads til; PR handler om at få gratis omtale, fx gennem pressemeddelelser og pressekontakt."),
  mc("genrer-21", c, "Hvilken genre bruger man til at klage over en vare?", ["Et klagebrev eller en klagemail med saglige oplysninger", "En reklame for varen", "Et referat fra et møde", "En pressemeddelelse"], 0, "En klage er en saglig genre: Man beskriver problemet, henviser til købet og skriver, hvad man forventer (refusion, ny vare osv.)."),
  mc("genrer-22", c, "Hvad er formålet med ledelsesberetningen i en årsrapport?", ["At forklare virksomhedens resultater og udvikling i ord", "At sælge produkter til læserne", "At referere fra personalemøder", "At underholde aktionærerne"], 0, "Ledelsesberetningen sætter ord på tallene: Den forklarer resultater, strategi og forventninger til fremtiden."),
  mc("genrer-23", c, "Hvorfor er SoMe-opslag typisk korte?", ["Fordi mediet og modtagernes opmærksomhed kræver korte, hurtige budskaber", "Fordi lange opslag er forbudt", "Fordi man kun må skrive fem ord", "Det er de ikke, de er altid lange"], 0, "Mediebevidst formidling: På sociale medier scroller man hurtigt, så budskabet skal fange opmærksomheden på få sekunder."),
  mc("genrer-24", c, "Hvad er forskellen på en hjemmesidetekst og en trykt brochure?", ["Hjemmesiden kan opdateres og linke videre; brochuren er fast og afgrænset", "Brochuren er altid på engelsk", "Hjemmesiden har aldrig tekst", "Der er ingen forskel"], 0, "Mediet sætter rammerne: En hjemmeside kan være dynamisk med links og søgning, en brochure er et fast, afgrænset produkt."),
];