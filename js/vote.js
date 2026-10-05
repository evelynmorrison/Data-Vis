/* ───────── VOTE ─────────
   "How would you quantify happiness?" — light exactly six windows, one per measure.
   Every time the screen opens it resets: all windows off, options reshuffled (so earlier positions aren't
   favoured). Each Done adds a new entry via recordVote(); loadVote() returns the latest entry, fetchVotes()
   every entry for the results page. */
const VOTE_PICK = 6, VOTES_KEY = "untold.votes.v1", OLD_VOTE_KEY = "untold.vote.v1";
const VOTE_LABELS = [
  "How often you laugh or smile", "How often you feel sad", "How often you feel angry", "How often you feel worried",
  "Physical pain", "Life satisfaction", "Sense of meaning and purpose", "Optimism about the future",
  "Feeling your life is under your control", "Rates of depression and anxiety", "Deaths by suicide",
  "Access to mental health care", "Reported loneliness", "Quality of close relationships",
  "Trust in neighbors and strangers", "Time spent with family", "Time for rest and personal enjoyment",
  "Working hours", "Unpaid care work", "Commute length", "Access to healthcare",
  "Financial security against emergencies", "Housing affordability and quality", "Education access",
  "Care accessible in old age", "Personal safety from violence", "Freedom from discrimination",
  "Cultural participation and traditions", "Trust in government",
  "Access to nature and green space", "Air and water quality", "Ecological footprint per person",
  "GDP per person", "Life expectancy", "Employment rate", "Hours of sunlight per year",
];
// each option gets its own window: 10 pane patterns × 10 shapes, paired so no two options match
const PANES = ["g:2x2", "g:3x2", "g:2x3", "bars", "T", "v2", "g:2x1", "g:1x2", "g:3x1", "plain"];
const SHAPES = [[48, 56], [76, 44], [60, 42], [30, 52], [44, 72], [56, 56], [64, 48], [36, 64], [80, 40], [52, 60]];
const VOTE_OPTIONS = VOTE_LABELS.map((label, i) => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  label, pane: PANES[i % 10], size: SHAPES[(i * 3 + Math.floor(i / 10)) % 10],
}));

// Storage: entries live only in this browser, as a list (each Done appends one).
// To pool votes across visitors, swap a shared backend into recordVote() and fetchVotes() — nothing else changes.
// entries submitted in this browser
function localVotes() {
  try {
    const all = JSON.parse(localStorage.getItem(VOTES_KEY));
    if (Array.isArray(all)) return all;
    const old = JSON.parse(localStorage.getItem(OLD_VOTE_KEY)); // single vote saved by the earlier version
    return old ? [old] : [];
  } catch { return []; }
}
function recordVote(rec) { try { localStorage.setItem(VOTES_KEY, JSON.stringify([...localVotes(), rec])); return true; } catch { return false; } }
function loadVote() { const all = localVotes(); return all[all.length - 1] || null; } // this visitor's latest entry
// every vote the results page counts: demo seed votes (js/seed-votes.js, if present) + this browser's entries
function fetchVotes() { return [...(typeof SEED_VOTES !== "undefined" ? SEED_VOTES : []), ...localVotes()]; }

const byId = Object.fromEntries(VOTE_OPTIONS.map(o => [o.id, o]));
const voteGrid = document.getElementById("vgrid"), voteCount = document.getElementById("vcount"), voteDone = document.getElementById("vdone");
let voteOrder = [], lit = new Set();

// fresh entry: everything off, new random order (called by go("vote"))
function resetVote() {
  voteOrder = VOTE_OPTIONS.map(o => o.id);
  for (let i = voteOrder.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [voteOrder[i], voteOrder[j]] = [voteOrder[j], voteOrder[i]]; } // Fisher–Yates
  lit = new Set();
  voteGrid.innerHTML = voteOrder.map(id => {
    const o = byId[id], [w, h] = o.size;
    return `<button class="vopt" data-id="${id}" aria-pressed="false"><span class="vicon"><span class="cw" style="width:${w}px;height:${h}px">${o.pane === "plain" ? "" : mull(o.pane, w, h)}</span></span><span class="vlab">${o.label}</span></button>`;
  }).join("");
  updateVote();
}
function updateVote() {
  voteGrid.querySelectorAll(".vopt").forEach(b => { const on = lit.has(b.dataset.id); b.setAttribute("aria-pressed", on); b.firstChild.firstChild.classList.toggle("sel", on); });
  const n = lit.size;
  voteDone.disabled = n !== VOTE_PICK;
  voteCount.textContent = n === VOTE_PICK ? "6 of 6 lit — ready" : `${n} of ${VOTE_PICK} lit`;
}
voteGrid.addEventListener("click", e => {
  const b = e.target.closest(".vopt"); if (!b) return;
  const id = b.dataset.id;
  if (lit.has(id)) lit.delete(id);
  else if (lit.size >= VOTE_PICK) { toast("Six windows lit — turn one off to choose another"); return; }
  else lit.add(id);
  updateVote();
});
voteDone.addEventListener("click", () => {
  if (lit.size !== VOTE_PICK) return;
  const ok = recordVote({ v: 1, choices: voteOrder.filter(id => lit.has(id)), shown: voteOrder, at: new Date().toISOString() });
  if (!ok) { toast("Couldn't save your choices in this browser"); return; }
  go("results");
});
resetVote();
