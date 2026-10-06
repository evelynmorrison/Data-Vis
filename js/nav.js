/* ───────── NAV ───────── */
const stage=document.getElementById("stage");
// fixed 1440x900 screens scale to fit the window; the ribbon screen (html.tall) scales to the
// window's width only and scrolls as a normal page. zoom (not transform) so its height drives the scroll.
// On a phone-width window the vote and results screens get a real mobile layout (html.mob, see app.css)
// instead of the whole 1440px desktop page shrunk to fit.
const MOBILE_SCREENS=["vote","results"];
function fit(){
  const h=document.documentElement, on=document.querySelector(".screen.on")?.id;
  // clientWidth, not innerWidth: phones widen innerWidth to fit a too-wide page
  const mob=h.clientWidth<760 && MOBILE_SCREENS.includes(on); h.classList.toggle("mob",mob);
  if(mob){ stage.style.transform="none"; stage.style.zoom=""; return; }
  if(h.classList.contains("tall")){ stage.style.transform="none"; stage.style.zoom=document.documentElement.clientWidth/1440; return; }
  const s=Math.min(innerWidth/1440,innerHeight/900); stage.style.zoom=""; stage.style.transform=`translate(-50%,-50%) scale(${s})`;
}
addEventListener("resize",fit);fit();
let selected=null, lastData="ranking"; // lastData: the data screen "View Data" returns to
const TALL=["ribbon","vote","results"]; // screens that scroll as a long page
// every screen has its own address (#rankings, #chart, #vote, #results; the intro is the bare URL), so a screen
// can be linked to directly and the browser's back/forward buttons move between screens.
// /vote/ (vote/index.html) is a short link that redirects to #vote.
const ROUTES={intro:"",ranking:"rankings",ribbon:"chart",vote:"vote",results:"results"};
const screenFor=hash=>Object.keys(ROUTES).find(id=>ROUTES[id]&&ROUTES[id]===hash.replace(/^#/,""))||"intro";
function go(id,fromHistory){
  if(!fromHistory && screenFor(location.hash)!==id) history.pushState(null,"",ROUTES[id]?"#"+ROUTES[id]:location.pathname+location.search);
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("on",s.id===id));
  document.documentElement.classList.toggle("tall",TALL.includes(id)); fit(); scrollTo(0,0);
  if(id==="ranking"||id==="ribbon") lastData=id;
  if(id==="ribbon") drawChart();
  if(id==="results") showResults();
  if(id==="vote") resetVote(); // every visit starts a fresh entry
}
addEventListener("popstate",()=>{ if(typeof modalOpen!=="undefined"&&modalOpen) closeModal(); go(screenFor(location.hash),true); });
// open the screen in the address once every script has loaded (chart, vote and results code come after this file)
document.addEventListener("DOMContentLoaded",()=>{ const id=screenFor(location.hash); if(id!=="intro") go(id,true); });
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
// top-right View Data / Vote toggle
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>go(b.dataset.tab==="vote"?"vote":lastData));
document.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>go(b.dataset.goto));

const toast=m=>{const t=document.getElementById("toast");t.textContent=m;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),2200)};
