/* ───────── VOTE ─────────
   "How would you quantify happiness?" — light exactly six windows, one per measure.
   Every time the screen opens it resets: all windows off, options reshuffled (so earlier positions aren't
   favoured). Each Done adds a new entry via recordVote() — sent to the shared Supabase database and kept in this
   browser. loadVote() returns this browser's latest entry; fetchTally() returns the totals for the results page. */
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

/* Storage. Votes go to a Supabase table (setup: supabase/setup.sql) so everyone's choices are pooled.
   The publishable key is meant to be public: the database only lets visitors add votes and read totals.
   Every entry is also kept in this browser — for the "You" badges, and as a queue: an entry that couldn't be
   sent (offline, database down) is marked pending and retried on the next visit. */
const SUPABASE = { url: "https://nauocnqiortfxhojogem.supabase.co", key: "sb_publishable_VDqQimeyx77qnOWmiOOdMw_u-qZcxOC" };
const sbHeaders = extra => ({ apikey: SUPABASE.key, ...extra });

// entries submitted in this browser
function localVotes() {
  try {
    const all = JSON.parse(localStorage.getItem(VOTES_KEY));
    if (Array.isArray(all)) return all;
    const old = JSON.parse(localStorage.getItem(OLD_VOTE_KEY)); // single vote saved by the earlier version
    return old ? [old] : [];
  } catch { return []; }
}
function saveLocal(all) { try { localStorage.setItem(VOTES_KEY, JSON.stringify(all)); return true; } catch { return false; } }
function loadVote() { const all = localVotes(); return all[all.length - 1] || null; } // this visitor's latest entry

async function sendVote(rec) {
  try {
    const r = await fetch(`${SUPABASE.url}/rest/v1/votes`, { method: "POST",
      headers: sbHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ choices: rec.choices, shown: rec.shown, write_in: rec.writeIn || null }) });
    return r.ok;
  } catch { return false; }
}
// save in this browser, then send to the shared database; resolves true if it reached the database
async function recordVote(rec) {
  const all = [...localVotes(), { ...rec, pending: true }]; saveLocal(all);
  const sent = await sendVote(rec);
  if (sent) { all[all.length - 1].pending = false; saveLocal(all); }
  return sent;
}
// retry any entries from earlier visits that never reached the database
async function flushPending() {
  const all = localVotes(); let changed = false;
  for (const v of all) if (v.pending && await sendVote(v)) { v.pending = false; changed = true; }
  if (changed) saveLocal(all);
}
flushPending();

// totals for the results page: { n: number of votes, counts: {optionId: votes}, shared: reached the database? }
async function fetchTally() {
  const counts = Object.fromEntries(VOTE_OPTIONS.map(o => [o.id, 0])), add = v => v.choices.forEach(id => { if (id in counts) counts[id]++; });
  let n = 0, shared = false;
  try {
    const [t, c] = await Promise.all([
      fetch(`${SUPABASE.url}/rest/v1/vote_tally?select=id,n`, { headers: sbHeaders() }),
      fetch(`${SUPABASE.url}/rest/v1/votes?select=id`, { headers: sbHeaders({ Prefer: "count=exact", Range: "0-0" }) }),
    ]);
    if (!t.ok || !c.ok) throw new Error("tally");
    (await t.json()).forEach(r => { if (r.id in counts) counts[r.id] += r.n; });
    n = +(c.headers.get("content-range") || "/0").split("/")[1] || 0; shared = true;
  } catch { const mine = localVotes(); mine.forEach(add); n = mine.length; } // offline: this browser's entries only
  return { n, counts, shared };
}

const byId = Object.fromEntries(VOTE_OPTIONS.map(o => [o.id, o]));
const voteGrid = document.getElementById("vgrid"), voteCount = document.getElementById("vcount"), voteDone = document.getElementById("vdone");
const voteWrite = document.getElementById("vwrite"); // optional write-in: a proposed metric, saved with the vote
let voteOrder = [], lit = new Set();

// fresh entry: everything off, new random order (called by go("vote"))
function resetVote() {
  voteOrder = VOTE_OPTIONS.map(o => o.id);
  for (let i = voteOrder.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [voteOrder[i], voteOrder[j]] = [voteOrder[j], voteOrder[i]]; } // Fisher–Yates
  lit = new Set(); voteWrite.value = "";
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
voteDone.addEventListener("click", async () => {
  if (lit.size !== VOTE_PICK || voteDone.dataset.busy) return;
  const writeIn = voteWrite.value.trim();
  voteDone.dataset.busy = 1; voteDone.disabled = true; voteDone.textContent = "Saving…";
  const sent = await recordVote({ v: 1, choices: voteOrder.filter(id => lit.has(id)), shown: voteOrder, ...(writeIn && { writeIn }), at: new Date().toISOString() });
  delete voteDone.dataset.busy; voteDone.textContent = "Done";
  if (!sent) toast("Saved on this device — it will be added to the shared results when you're back online");
  go("results");
});
resetVote();
