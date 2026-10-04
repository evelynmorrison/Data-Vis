/* ───────── SELECTION · card · windows ───────── */
function select(i){
  selected=i;
  document.querySelectorAll(".row").forEach(r=>r.classList.toggle("sel",+r.dataset.i===i));
  if(drawn) apply();
}
const READER="assets/img/reader.png"; // texture shown behind an opened window
// window layout inside the 226×296 grid — traced from the Figma frame: [type, x, y, w, h]
//  g:c×r = panes, bars = vertical bars under a top rail, T = sash + upper divider, v2 = narrow two-bar, blue = solid
const CELLS=[["g:2x2",0,0,53,63],["bars",63,14,66,45],["blue",138,6,47,53],["g:2x2",194,0,32,61],
  ["g:3x2",0,88,85,48],["blue",95,79,61,61],["g:2x2",165,90,61,48],
  ["blue",0,157,78,53],["v2",84,161,15,57],["blue",105,159,30,61],["g:2x3",140,152,43,68],["bars",189,161,35,53],
  ["blue",0,236,66,46],["T",75,233,48,57],["g:2x2",132,239,49,50],["blue",189,232,37,60]];
const WINS={ Taiwan:[["tw",2,2,53,57],["twlit",58,7,52,58],["tw",113,1,52,59],["blue",169,10,46,55],
  ["blue",5,81,46,55],["tw",58,79,48,57],["tw",114,80,55,57],["twlit",175,80,52,57],
  ["tw",2,150,53,60],["blue",61,150,48,57],["twlit",116,153,51,74],["tw",171,152,52,58]] };
const M="#3346c2";
function mull(t,w,h){
  const R=(x,y,ww,hh)=>`<rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="${M}"/>`; let o="";
  if(t.startsWith("g:")){const [c,r]=t.slice(2).split("x").map(Number);
    for(let i=1;i<c;i++) o+=R(w*i/c-1.5,0,3,h); for(let j=1;j<r;j++) o+=R(0,h*j/r-1.5,w,3);}
  else if(t==="bars"){o+=R(0,6,w,3); const n=6; for(let i=1;i<n;i++) o+=R(w*i/n-1.3,9,2.6,h-9);}
  else if(t==="T"){o+=R(0,h*.62,w,3.4); o+=R(w*.34-1.5,0,3,h*.62);}
  else if(t==="tw"||t==="twlit"){ o+=`<rect x="1.5" y="1.5" width="${w-3}" height="${h-3}" fill="none" stroke="${M}" stroke-width="3"/>`;
    const n=7, ry=h*.3; o+=R(3,ry-1,w-6,2);
    for(let i=1;i<n;i++){const x=w*i/n; o+=R(x-1,3,2,h-6); o+=`<rect x="${x-2.2}" y="${ry-2.2}" width="4.4" height="4.4" transform="rotate(45 ${x} ${ry})" fill="${M}"/>`;} }
  else if(t==="v2"){o+=R(w*.33-1,0,2,h); o+=R(w*.66-1,0,2,h); o+=R(0,h*.5-1,w,2);}
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${o}</svg>`;
}
let modalOpen=false, pickedWin=null;
// short intros (populations are rounded estimates — verify before publishing)
const BLURB={
 "Finland":"a Nordic country of around 5.7 million people, known for its forests, lakes, and sauna culture",
 "Iceland":"a North Atlantic island of around 390,000 people, shaped by volcanoes, glaciers, and geothermal pools",
 "Denmark":"a Nordic country of around 6 million people, known for cycling cities, design, and hygge",
 "Costa Rica":"a Central American country of around 5 million people, known for rainforests and the motto “pura vida”",
 "Sweden":"a Nordic country of around 10.5 million people, known for archipelagos, fika, and long summer light",
 "Norway":"a Nordic country of around 5.5 million people, known for fjords, mountains, and outdoor life",
 "Netherlands":"a low-lying country of around 18 million people, known for canals, bicycles, and reclaimed land",
 "Israel":"a Middle Eastern country of around 10 million people, with a young population and Mediterranean coast",
 "Luxembourg":"a small European country of around 670,000 people, known for finance and a multilingual society",
 "Switzerland":"an Alpine country of around 9 million people, known for mountains, lakes, and direct democracy",
 "New Zealand":"a Pacific island country of around 5 million people, known for its landscapes and Māori culture",
 "Mexico":"a North American country of around 130 million people, known for its food, music, and close family ties",
 "Ireland":"an island country of around 5 million people, known for green landscapes, music, and pubs",
 "Belgium":"a Western European country of around 12 million people, known for its cities, chocolate, and comics",
 "Australia":"a continent-country of around 27 million people, known for beaches, outback, and outdoor life",
 "Kosovo":"a young Balkan country of around 1.6 million people, with one of Europe’s youngest populations",
 "Germany":"a Central European country of around 84 million people, known for engineering, forests, and festivals",
 "Slovenia":"a small European country of around 2 million people, known for Alpine lakes and green cities",
 "Austria":"an Alpine country of around 9 million people, known for mountains, music, and coffee houses",
 "Taiwan":"an island in East Asia, known for its mountainous landscapes, vibrant cities, and night markets",
 "Czechia":"a Central European country of around 11 million people, known for historic towns and beer culture"};
function fillGlance(i){
  const d=COUNTRIES[i], ch=d.prev==null?0:d.prev-d.rank;
  document.getElementById("gEye").textContent=`${d.c} at a glance`;
  document.getElementById("gDesc").textContent=`${d.c} is ${BLURB[d.c]}.`;
  const third = d.c==="Taiwan"
    ? `<div class="g-big">#1</div><div class="g-lab">Happiness rank in East Asia</div><div class="g-sub">2026 report</div>`
    : d.c==="Finland"
    ? `<div class="g-big">9 years</div><div class="g-lab">Consecutive years at #1</div><div class="g-sub">2018–2026</div>`
    : `<div class="g-big">${ch>0?"▲ "+ch:ch<0?"▼ "+(-ch):"–"}</div><div class="g-lab">Change from 2025</div><div class="g-sub">was #${d.prev} in 2025</div>`;
  document.getElementById("gStats").innerHTML=
   `<div class="g-stat"><div class="g-big">#${d.rank}</div><div class="g-lab">World happiness rank</div><div class="g-sub">2026 report</div></div>
    <div class="g-stat"><div class="g-big">${d.score.toFixed(3)}<small>/ 10</small></div><div class="g-lab">Life evaluation score</div><div class="g-sub">2023–2025 average</div></div>
    <div class="g-stat">${third}</div>`;
  document.getElementById("glance").classList.remove("off");
}
const DIMS=["Loneliness","Rest & leisure","Work–life balance","Trust","Social ties","Housing","Mental health","Nature","Income security","Health","Safety","Community","Freedom","Generosity","Daily emotions","Hope"];
const FI_MH={yrs:[2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
  tot:[56,61,63,66,69,71,70,70,69,69,68,69,72,78,81,85,89,93,97], ssri:[38,41,42,43,44,45,44,43,42,41,40,40,41,43,44,46,48,50,52]};
function barChart(){
  const {yrs,tot,ssri}=FI_MH, W=258,H=176,X0=22,Y1=160,Hh=140,bw=10.6,gp=2.6,sc=v=>v/100*Hh;
  let o=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;margin-top:8px">`;
  [0,20,40,60,80,100].forEach(v=>{o+=`<line x1="${X0-2}" x2="${W}" y1="${Y1-sc(v)}" y2="${Y1-sc(v)}" stroke="rgba(238,240,248,.08)"/><text x="${X0-6}" y="${Y1-sc(v)+3}" text-anchor="end" font-size="7.5" fill="#959ac8" font-family="Inter">${v}</text>`});
  yrs.forEach((y,i)=>{const x=X0+i*(bw+gp);let b=Y1;
    [[4,"#2b3aa8"],[ssri[i],"#4f66d6"],[tot[i]-ssri[i]-4,"#c9d1f6"]].forEach(([v,c])=>{o+=`<rect x="${x}" y="${b-sc(v)}" width="${bw}" height="${sc(v)}" fill="${c}"><title>${y}: ${tot[i]} DDD</title></rect>`;b-=sc(v)});
    if(i%3===0) o+=`<text x="${x+bw/2}" y="${Y1+11}" text-anchor="middle" font-size="7.5" fill="#959ac8" font-family="Inter">${y}</text>`;});
  return o+"</svg>";
}
function showDim(k,d){
  const dim=DIMS[k], det=document.getElementById("det");
  document.getElementById("dtag").textContent=dim;
  document.getElementById("dctx").innerHTML=`#${d.rank} of ${TOTAL} countries · World Happiness Report 2026<br>Life evaluation ${d.score.toFixed(2)} / 10 (2023–2025 average)`;
  const body=document.getElementById("dbody");
  if(d.c==="Finland" && dim==="Mental health"){
    document.getElementById("dhead").textContent="9.8% of the population uses antidepressants";
    body.innerHTML=`<div class="dcard" style="left:54px;width:287px"><h4>Antidepressant consumption, 2006–2024</h4><div class="sub">DDD per 1,000 inhabitants per day</div>${barChart()}
      <div class="lg"><span><i style="background:#c9d1f6"></i>Other</span><span><i style="background:#4f66d6"></i>SSRIs</span><span><i style="background:#2b3aa8"></i>Non-selective</span></div>
      <div class="src">Approx. values traced from Fig. 7.22 — replace with source data</div></div>
      <div class="dcard" style="left:358px;width:229px"><h4>By wellbeing services county, 2024</h4><div class="sub">Whole country 96.35 DDD / 1,000 / day</div>
      <div class="mapslot">Choropleth map slot<br>Fig. 7.24 · 4 classes</div></div>`;
  } else {
    document.getElementById("dhead").textContent=`${dim} in ${d.c}`;
    body.innerHTML=`<div class="dsoon">Data for this dimension is coming soon.</div>`;
  }
  det.classList.add("on");
}
function hideInfo(){ document.getElementById("hint").style.opacity=1; document.getElementById("ctitle").style.opacity=0; document.getElementById("card").style.opacity=0; }
function showInfo(i){
  const d=COUNTRIES[i];
  document.getElementById("hint").style.opacity=1;
  document.getElementById("ctitle").style.opacity=0;
  document.getElementById("card").style.opacity=0;
}
function openModal(){
  if(selected===null) return toast("Select a country first");
  const d=COUNTRIES[selected]; modalOpen=true; pickedWin=null;
  document.getElementById("mname").textContent=d.c.toUpperCase();
  const mh=document.getElementById("mhint"); mh.textContent="Select a window to explore a different dimension.";
  fillGlance(selected);
  document.getElementById("det").classList.remove("on");
  document.getElementById("mempty").style.opacity=0;
  const g=document.getElementById("wgrid"); g.innerHTML="";
  (WINS[d.c]||CELLS).forEach(([tp,x,y,w,h],k)=>{const b=document.createElement("button");b.className="cw"+(tp==="blue"?" blue":"")+(tp==="twlit"?" lit":"");
    Object.assign(b.style,{left:x+"px",top:y+"px",width:w+"px",height:h+"px"}); if(tp!=="blue") b.innerHTML=mull(tp,w,h);
    b.title=`Window ${k+1}`;
    b.onclick=()=>{g.querySelectorAll(".cw").forEach(e=>{e.classList.remove("sel","open");e.style.backgroundImage="";});
      b.classList.add("open"); b.style.backgroundImage=`url(${READER})`; pickedWin=k;
      document.getElementById("glance").classList.add("off");
      showDim(k,d);};
    g.appendChild(b);});
  document.getElementById("scrimM").classList.add("on"); document.getElementById("modal").classList.add("on");
  document.querySelector("#ribbon .pager").style.opacity=0;
}
function closeModal(){ modalOpen=false; document.getElementById("scrimM").classList.remove("on"); document.getElementById("modal").classList.remove("on"); document.querySelector("#ribbon .pager").style.opacity=1; }
document.getElementById("mclose").onclick=closeModal; document.getElementById("gBack").onclick=closeModal; document.getElementById("scrimM").onclick=closeModal;
// generous hit area: anywhere inside a column's row band counts as that country
function nearest(e){
  const r=svg.getBoundingClientRect(), sx=1440/r.width, x=(e.clientX-r.left)*sx, y=(e.clientY-r.top)*sx;
  const row=Math.floor((y-TOP+ (GAP-H)/2)/GAP); if(row<0||row>=COUNTRIES.length) return null;
  let j=0,best=1e9; X.forEach((cx,k)=>{const d=Math.abs(x-(cx+W/2)); if(d<best){best=d;j=k;}});
  if(best>W/2+60) return null; return ORDERS[j][row] ?? null; // shorter columns have empty rows
}
svg.addEventListener("pointermove",e=>{ if(selected!==null||modalOpen) return; if(e.target.closest(".rib")) return; const ci=nearest(e); if(ci!==null) preview(ci); });
svg.style.cursor="pointer";
document.getElementById("chart").addEventListener("pointerup",e=>{
  const g=e.target.closest(".rib");
  let ci=g?+g.dataset.ci:nearest(e);
  if(ci===null) return;
  select(ci); openModal();
});
document.getElementById("chart").addEventListener("click",e=>{ if(e.target.tagName==="rect" && !e.target.closest(".rib")){selected=null;document.querySelectorAll(".row").forEach(r=>r.classList.remove("sel"));apply();}});
