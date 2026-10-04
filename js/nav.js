/* ───────── NAV ───────── */
const stage=document.getElementById("stage");
// fixed 1440x900 screens scale to fit the window; the ribbon screen (html.tall) scales to the
// window's width only and scrolls as a normal page. zoom (not transform) so its height drives the scroll.
function fit(){
  if(document.documentElement.classList.contains("tall")){ stage.style.transform="none"; stage.style.zoom=document.documentElement.clientWidth/1440; return; }
  const s=Math.min(innerWidth/1440,innerHeight/900); stage.style.zoom=""; stage.style.transform=`translate(-50%,-50%) scale(${s})`;
}
addEventListener("resize",fit);fit();
let selected=null, lastData="ranking"; // lastData: the data screen "View Data" returns to
const TALL=["ribbon","vote","results"]; // screens that scroll as a long page
function go(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("on",s.id===id));
  document.documentElement.classList.toggle("tall",TALL.includes(id)); fit(); scrollTo(0,0);
  if(id==="ranking"||id==="ribbon") lastData=id;
  if(id==="ribbon") drawChart();
  if(id==="results") showResults();
  if(id==="vote") resetVote(); // every visit starts a fresh entry
}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
// top-right View Data / Vote toggle
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>go(b.dataset.tab==="vote"?"vote":lastData));
document.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>go(b.dataset.goto));

const toast=m=>{const t=document.getElementById("toast");t.textContent=m;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),2200)};
