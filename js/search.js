/* ───────── COUNTRY SEARCH (ribbon screen) ─────────
   Picking a country from the list highlights its ribbon and scrolls to it.
   Clearing the box clears the selection. */
const searchBox = document.getElementById("csearch");
document.getElementById("clist").innerHTML =
  COUNTRIES.map(d => d.c).sort((a, b) => a.localeCompare(b)).map(c => `<option value="${c}">`).join("");

function findCountry(q) {
  q = q.trim().toLowerCase(); if (!q) return -1;
  const exact = COUNTRIES.findIndex(d => d.c.toLowerCase() === q);
  return exact >= 0 ? exact : COUNTRIES.findIndex(d => d.c.toLowerCase().startsWith(q));
}

function searchGo(fromEnter) {
  if (!searchBox.value.trim()) { selected = null; apply(); return; }
  const ci = findCountry(searchBox.value);
  if (ci < 0) { if (fromEnter) toast("No country matches “" + searchBox.value.trim() + "”"); return; }
  searchBox.value = COUNTRIES[ci].c;
  select(ci);
  if (mode === "fit") { scrollTo({ top: chartTop(), behavior: "smooth" }); return; } // whole chart in view
  // detailed: scroll so the country's topmost box sits about a third of the way down the window
  const top = Math.min(...[...boxG[ci].querySelectorAll("rect")].map(r => r.getBoundingClientRect().top));
  scrollTo({ top: scrollY + top - innerHeight / 3, behavior: "smooth" });
}

// "change" fires when an option is picked from the list or the box loses focus
searchBox.addEventListener("change", () => searchGo(false));
searchBox.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); searchGo(true); } });
searchBox.addEventListener("search", () => { if (!searchBox.value) searchGo(false); }); // the ✕ clear button
