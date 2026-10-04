/* ───────── RANKING LIST ─────────
   Two columns: highest 10 (clickable -> selects the country and feeds the
   ribbon chart) and lowest 10 (display only — these countries aren't part
   of the COUNTRIES/ORDERS dataset the ribbon chart traces). */
const rowsTop = document.getElementById("rowsTop");
COUNTRIES.slice(0, 10).forEach((d, i) => {
  const el = document.createElement("div"); el.className = "row clickable"; el.dataset.i = i;
  el.innerHTML = `<span class="rk">${d.rank}</span>${flagSVG(d.code)}<span class="nm">${d.c}</span><span class="sc">${d.score.toFixed(3)}</span>`;
  el.onclick = () => { if (selected === i) { go("ribbon"); return; } select(i); };
  el.ondblclick = () => { select(i); go("ribbon"); };
  rowsTop.appendChild(el);
});

const rowsBottom = document.getElementById("rowsBottom");
LOWEST10.forEach(d => {
  const el = document.createElement("div"); el.className = "row";
  el.innerHTML = `<span class="rk">${d.rank}</span>${flagSVG(d.code)}<span class="nm">${d.c}</span><span class="sc">${d.score.toFixed(3)}</span>`;
  rowsBottom.appendChild(el);
});
