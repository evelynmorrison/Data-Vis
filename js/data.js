/* ───────── DATA ─────────
   life: WHR 2026 rank & score (verified).  prev: WHR 2025 rank.
   overall / pos / neg: PLACEHOLDER ranks within these 20 — replace with
   Blanchflower & Bryson (2024) wellbeing, positive-affect and negative-affect ranks. */
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
const COLS = ["World Happiness (Gallup)","Pos + Negative / overall","Positive Affect","Negative Affect"];
// placeholder orders (index into COUNTRIES), deterministic
const ORDERS = [
  COUNTRIES.map((_,i)=>i),
  [11,3,1,15,4,0,13,9,2,6,7,20,16,12,5,10,18,8,14,19,17],
  [3,11,20,15,1,7,12,13,4,9,0,10,6,2,16,5,18,14,8,19,17],
  [1,4,0,9,2,6,18,5,10,13,8,20,12,16,14,19,17,11,3,7,15],
];
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
