/* ───────── DATA ─────────
   life: WHR 2026 rank & score (verified).  prev: WHR 2025 rank.
   Per-source ranks for the ribbon chart live in RANKS below. */
const COUNTRIES = [
  {c:"Finland",     code:"fi", score:7.764, prev:1},
  {c:"Iceland",     code:"is", score:7.540, prev:3},
  {c:"Denmark",     code:"dk", score:7.539, prev:2},
  {c:"Costa Rica",  code:"cr", score:7.439, prev:6},
  {c:"Sweden",      code:"se", score:7.255, prev:4},
  {c:"Norway",      code:"no", score:7.242, prev:7},
  {c:"Netherlands", code:"nl", score:7.223, prev:5},
  {c:"Israel",      code:"il", score:7.187, prev:8},
  {c:"Luxembourg",  code:"lu", score:7.063, prev:9},
  {c:"Switzerland", code:"ch", score:7.018, prev:13},
  {c:"New Zealand", code:"nz", score:6.995, prev:12},
  {c:"Mexico",      code:"mx", score:6.972, prev:10},
  {c:"Ireland",     code:"ie", score:6.928, prev:15},
  {c:"Belgium",     code:"be", score:6.926, prev:14},
  {c:"Australia",   code:"au", score:6.916, prev:11},
  {c:"Kosovo",      code:"xk", score:6.910, prev:29},
  {c:"Germany",     code:"de", score:6.882, prev:22},
  {c:"Slovenia",    code:"si", score:6.868, prev:19},
  {c:"Austria",     code:"at", score:6.845, prev:17},
  {c:"Czechia",     code:"cz", score:6.821, prev:20},
  {c:"Taiwan",      code:"tw", score:6.714, prev:null, rank:26, extra:true},
];
COUNTRIES.forEach((d,i)=>{ if(!d.rank) d.rank=i+1; });
/* Ribbon-chart columns. Each country's rank in each source; null = not ranked
   in that source (the ribbon skips that column).
     whr      2world_happiness_all_measures.xlsx · Rankings · rank on 3-year average, 2025
     wb/pos/neg  1wellbeing_rankings_countries.xlsx · Overall ranks · countries only (of 164),
              derived final overall / positive affect / negative affect
     hpi      3Happy-Planet-Index-2006-2025-public-data-set.xlsx · 1. All countries · HPI rank, 2025
   Name variants matched by hand: Czechia = "Czech Republic" (wellbeing, HPI),
   Taiwan = "Taiwan Province of China" (WHR). Israel and Kosovo are listed in HPI
   without a 2025 rank; Taiwan is not in HPI. */
const SOURCES = [
  {key:"whr", label:"World Happiness Report (Gallup Analytics)", total:147},
  {key:"wb",  label:"Wellbeing (overall)",                       total:164},
  {key:"pos", label:"Wellbeing (positive affect)",               total:164},
  {key:"neg", label:"Wellbeing (negative affect)",               total:164},
  {key:"hpi", label:"Happy Planet Index",                        total:134},
];
const RANKS = {
  "Finland":     {whr:1, wb:15, pos:47, neg:23, hpi:50},
  "Iceland":     {whr:2, wb:4, pos:34, neg:27, hpi:89},
  "Denmark":     {whr:3, wb:12, pos:23, neg:35, hpi:63},
  "Costa Rica":  {whr:4, wb:31, pos:7, neg:87, hpi:1},
  "Sweden":      {whr:5, wb:9, pos:43, neg:22, hpi:36},
  "Norway":      {whr:6, wb:5, pos:27, neg:21, hpi:20},
  "Netherlands": {whr:7, wb:3, pos:10, neg:28, hpi:69},
  "Israel":      {whr:8, wb:106, pos:111, neg:129, hpi:null},
  "Luxembourg":  {whr:9, wb:24, pos:48, neg:25, hpi:129},
  "Switzerland": {whr:10, wb:7, pos:40, neg:20, hpi:6},
  "New Zealand": {whr:11, wb:14, pos:38, neg:24, hpi:43},
  "Mexico":      {whr:12, wb:32, pos:33, neg:68, hpi:9},
  "Ireland":     {whr:13, wb:10, pos:22, neg:26, hpi:67},
  "Belgium":     {whr:14, wb:41, pos:45, neg:55, hpi:46},
  "Australia":   {whr:15, wb:23, pos:44, neg:29, hpi:103},
  "Kosovo":      {whr:16, wb:53, pos:96, neg:11, hpi:null},
  "Germany":     {whr:17, wb:20, pos:53, neg:12, hpi:16},
  "Slovenia":    {whr:18, wb:74, pos:108, neg:77, hpi:60},
  "Austria":     {whr:19, wb:2, pos:46, neg:6, hpi:56},
  "Czechia":     {whr:20, wb:72, pos:97, neg:64, hpi:62},
  "Taiwan":      {whr:26, wb:1, pos:8, neg:1, hpi:null},
};
const COLS = SOURCES.map(s=>s.label);
// per column: indices into COUNTRIES, best rank first, unranked countries left out
const ORDERS = SOURCES.map(s=>COUNTRIES.map((_,i)=>i)
  .filter(i=>RANKS[COUNTRIES[i].c][s.key]!=null)
  .sort((a,b)=>RANKS[COUNTRIES[a].c][s.key]-RANKS[COUNTRIES[b].c][s.key]));
const TOTAL = 147;

/* lowest-ranking 10 of 147 · World Happiness Report 2026, life evaluation
   average (3-year, 2023–2025) · source: 2world_happiness_all_measures.xlsx,
   "Data" + "Rankings" tabs */
const LOWEST10 = [
  {c:"Tanzania",      code:"tz", score:3.902, rank:138},
  {c:"Egypt",         code:"eg", score:3.862, rank:139},
  {c:"DR Congo",      code:"cd", score:3.761, rank:140},
  {c:"Lebanon",       code:"lb", score:3.723, rank:141},
  {c:"Yemen",         code:"ye", score:3.532, rank:142},
  {c:"Botswana",      code:"bw", score:3.464, rank:143},
  {c:"Zimbabwe",      code:"zw", score:3.346, rank:144},
  {c:"Malawi",        code:"mw", score:3.284, rank:145},
  {c:"Sierra Leone",  code:"sl", score:3.251, rank:146},
  {c:"Afghanistan",   code:"af", score:1.446, rank:147},
];
