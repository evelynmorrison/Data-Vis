/* ───────── NAV ───────── */
const stage=document.getElementById("stage");
function fit(){const s=Math.min(innerWidth/1440,innerHeight/900);stage.style.transform=`translate(-50%,-50%) scale(${s})`}
addEventListener("resize",fit);fit();
let selected=null;
function go(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("on",s.id===id)); if(id==="ribbon") drawChart();}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));

const toast=m=>{const t=document.getElementById("toast");t.textContent=m;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),2200)};
