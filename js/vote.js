/* ───────── VOTE ─────────
   "How would you quantify happiness?" — light exactly six windows, one per measure.
   Options are shuffled on every visit so earlier positions aren't favoured. The vote is saved by
   recordVote(); loadVote() reads it back for later pages. */
const VOTE_PICK = 6, VOTE_KEY = "untold.vote.v1";
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

function loadVote() { try { return JSON.parse(localStorage.getItem(VOTE_KEY)); } catch { return null; } }
// the one place a vote is stored — swap in a shared backend here to pool votes across visitors
function recordVote(rec) { try { localStorage.setItem(VOTE_KEY, JSON.stringify(rec)); return true; } catch { return false; } }

(() => {
  const grid = document.getElementById("vgrid"), count = document.getElementById("vcount"), done = document.getElementById("vdone");
  const order = VOTE_OPTIONS.map(o => o.id);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } // Fisher–Yates
  const byId = Object.fromEntries(VOTE_OPTIONS.map(o => [o.id, o]));
  // restore an earlier vote, ignoring any option that has since been removed from the list
  const saved = loadVote(), lit = new Set((saved?.choices || []).filter(id => byId[id]));
  let recorded = !!saved && lit.size === VOTE_PICK;

  grid.innerHTML = order.map(id => {
    const o = byId[id], [w, h] = o.size;
    return `<button class="vopt" data-id="${id}" aria-pressed="false"><span class="vicon"><span class="cw" style="width:${w}px;height:${h}px">${o.pane === "plain" ? "" : mull(o.pane, w, h)}</span></span><span class="vlab">${o.label}</span></button>`;
  }).join("");

  function update() {
    grid.querySelectorAll(".vopt").forEach(b => { const on = lit.has(b.dataset.id); b.setAttribute("aria-pressed", on); b.firstChild.firstChild.classList.toggle("sel", on); });
    const n = lit.size;
    done.disabled = n !== VOTE_PICK || recorded;
    done.textContent = recorded ? "Recorded" : "Done";
    count.textContent = recorded ? "Thanks — your choices are recorded." : n === VOTE_PICK ? "6 of 6 lit — ready" : `${n} of ${VOTE_PICK} lit`;
  }
  grid.addEventListener("click", e => {
    const b = e.target.closest(".vopt"); if (!b) return;
    const id = b.dataset.id;
    if (lit.has(id)) lit.delete(id);
    else if (lit.size >= VOTE_PICK) { toast("Six windows lit — turn one off to choose another"); return; }
    else lit.add(id);
    recorded = false; update();
  });
  done.addEventListener("click", () => {
    if (lit.size !== VOTE_PICK) return;
    const ok = recordVote({ v: 1, choices: order.filter(id => lit.has(id)), shown: order, at: new Date().toISOString() });
    if (!ok) { toast("Couldn't save your choices in this browser"); return; }
    recorded = true; update();
  });
  update();
})();
