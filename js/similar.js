/* ───────── WHO VOTES LIKE YOU ─────────
   ILLUSTRATIVE. There aren't yet enough votes per country to compare a person with each country's voters,
   so the five "most similar countries" are generated: seeded by the person's six choices + their country (the
   same vote always gets the same result), drawn from a pool of open, commonly surveyed countries, and weighted
   toward the voter's own region and toward regions their picks plausibly line up with. The voter's own
   country is never listed. Replace matchCountries() with a real comparison once each country has enough votes. */
const MATCH_CLUSTERS = {
  nordic:   ["Finland", "Sweden", "Norway", "Denmark", "Iceland"],
  west:     ["Netherlands", "Belgium", "Germany", "France", "Switzerland", "Austria", "Luxembourg"],
  anglo:    ["United States", "Canada", "United Kingdom", "Ireland", "Australia", "New Zealand"],
  south:    ["Spain", "Portugal", "Italy", "Greece", "Malta"],
  east:     ["Poland", "Czechia", "Slovenia", "Estonia", "Lithuania", "Croatia", "Romania"],
  latam:    ["Mexico", "Costa Rica", "Brazil", "Argentina", "Chile", "Colombia", "Uruguay"],
  eastasia: ["Japan", "South Korea", "Taiwan", "Singapore", "Hong Kong"],
  seasia:   ["Philippines", "Thailand", "Vietnam", "Malaysia", "Indonesia", "India"],
  mena:     ["Israel", "Türkiye", "Morocco", "United Arab Emirates", "Jordan"],
  africa:   ["South Africa", "Kenya", "Ghana", "Nigeria", "Botswana"],
};
// regions that tend to sit close together in survey data, so a voter's matches lean their way
const CLUSTER_NEAR = {
  nordic: ["west", "anglo"], west: ["nordic", "anglo", "south"], anglo: ["west", "nordic"], south: ["latam", "west"],
  east: ["west", "south"], latam: ["south", "seasia"], eastasia: ["seasia", "anglo"], seasia: ["eastasia", "latam"],
  mena: ["south", "east"], africa: ["latam", "seasia"],
};
// a few choices nudge toward regions that plausibly share that priority
const CHOICE_LEAN = {
  "trust-in-neighbors-and-strangers": ["nordic"], "trust-in-government": ["nordic", "west"], "access-to-nature-and-green-space": ["nordic", "anglo"],
  "time-for-rest-and-personal-enjoyment": ["south", "latam"], "time-spent-with-family": ["latam", "seasia", "mena"], "working-hours": ["eastasia", "west"],
  "how-often-you-laugh-or-smile": ["latam", "seasia"], "quality-of-close-relationships": ["latam", "south"], "financial-security-against-emergencies": ["anglo", "east"],
  "housing-affordability-and-quality": ["anglo", "west"], "gdp-per-person": ["eastasia", "anglo"], "employment-rate": ["east", "africa"],
  "access-to-mental-health-care": ["anglo", "nordic"], "rates-of-depression-and-anxiety": ["eastasia", "anglo"], "deaths-by-suicide": ["eastasia", "east"],
  "air-and-water-quality": ["eastasia", "seasia"], "ecological-footprint-per-person": ["nordic", "west"], "hours-of-sunlight-per-year": ["south", "latam"],
  "personal-safety-from-violence": ["latam", "africa"], "freedom-from-discrimination": ["anglo", "west"], "access-to-healthcare": ["anglo", "africa"],
};
const COUNTRY_ALIASES = { "Turkey": "Türkiye", "Czech Republic": "Czechia", "Korea": "South Korea", "UK": "United Kingdom" };

function seededRandom(text) {
  let h = 2166136261; for (const ch of text) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  let s = h >>> 0 || 1; return () => (s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0, s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0, (s >>> 0) / 4294967296);
}
// returns [{country, pct}] x5, most similar first
function matchCountries(vote) {
  const home = COUNTRY_ALIASES[vote.country] || vote.country;
  const homeCluster = Object.keys(MATCH_CLUSTERS).find(k => MATCH_CLUSTERS[k].includes(home));
  const rnd = seededRandom([...vote.choices].sort().join("|") + "#" + home);
  const w = Object.fromEntries(Object.keys(MATCH_CLUSTERS).map(k => [k, 1]));
  if (homeCluster) { w[homeCluster] += 3; CLUSTER_NEAR[homeCluster].forEach(k => w[k] += 1.5); }
  vote.choices.forEach(id => (CHOICE_LEAN[id] || []).forEach(k => w[k] += 1));
  const pool = Object.entries(MATCH_CLUSTERS).flatMap(([k, cs]) => cs.filter(c => c !== home).map(c => ({ c, score: w[k] * (0.35 + rnd()) })));
  pool.sort((a, b) => b.score - a.score);
  let pct = 78 + Math.floor(rnd() * 15); // top match 78–92%
  return pool.slice(0, 5).map((m, i) => { if (i) pct -= 2 + Math.floor(rnd() * 6); return { country: m.c, pct }; });
}

function renderMatches() {
  const box = document.getElementById("rmatch"), vote = loadVote();
  if (!vote || !vote.country || !vote.choices?.length) {
    box.innerHTML = `<h3>Who votes like you</h3><p class="sub">Light your six windows and choose your country to see which countries’ voters made the most similar choices.</p><button class="go" data-goto="vote">Vote</button>`;
    box.querySelector(".go").onclick = () => go("vote"); return;
  }
  const rows = matchCountries(vote);
  box.innerHTML = `<h3>Who votes like you</h3><p class="sub">Countries whose respondents made choices most similar to yours</p>
    <ol>${rows.map((r, i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="c">${r.country}</span><span class="p">${r.pct}%</span><span class="bar"><i style="width:${r.pct}%"></i></span></li>`).join("")}</ol>
    <p class="note">Illustrative · estimated until enough votes come in from each country</p>`;
}
