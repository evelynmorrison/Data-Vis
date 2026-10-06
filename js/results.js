/* ───────── RESULTS ─────────
   Tallies every vote (fetchTally) into a ranked list of all measures. Each row shows the share of voters who
   chose that measure as 20 windows in the measure's own pattern — one lit window per 5% of voters. */
const RESULT_WINDOWS = 20;
let resultsReq = 0;
async function showResults() {
  const req = ++resultsReq, eye = document.getElementById("rEye");
  if (!document.getElementById("rlist").children.length) eye.textContent = "Results · loading…";
  const { n, counts } = await fetchTally();
  if (req !== resultsReq) return; // a newer request superseded this one
  const mine = new Set(loadVote()?.choices || []);
  renderMatches();
  const rows = VOTE_OPTIONS.map(o => ({ o, pct: n ? Math.round(counts[o.id] / n * 100) : 0, c: counts[o.id] }))
    .sort((a, b) => b.c - a.c || a.o.label.localeCompare(b.o.label));
  document.getElementById("rEye").textContent = `Results · ${n.toLocaleString("en")} ${n === 1 ? "vote" : "votes"} so far`;
  document.getElementById("rlist").innerHTML = rows.map(({ o, pct }, i) => {
    const on = Math.round(pct / 100 * RESULT_WINDOWS), win = o.pane === "plain" ? "" : mull(o.pane, 26, 28, .5, "#11132b"); // thin, background-coloured bars for contrast
    const bar = Array.from({ length: RESULT_WINDOWS }, (_, k) => `<span class="cw${k < on ? " sel" : ""}">${win}</span>`).join("");
    return `<li class="rrow"><span class="rnum">${String(i + 1).padStart(2, "0")}</span>
      <div class="rname">${o.label}${mine.has(o.id) ? '<span class="ryou">You</span>' : ""}</div>
      <div class="rbar" role="img" aria-label="${pct}% of voters">${bar}<span class="rpct">${pct}%</span></div></li>`;
  }).join("");
}
