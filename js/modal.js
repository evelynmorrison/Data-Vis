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
  ["tw",2,150,53,60],["blue",61,150,48,57],["twlit",116,153,51,74],["tw",171,152,52,58]],
  Bhutan:[["g:2x1",50,6,30,53,"arch","lit"],["g:2x2",88,0,39,61,"arch"],["tc",133,3,33,56,"arch"],["g:2x2",26,78,46,76,"arch"],["blue",80,87,35,67,"arch"],["g:3x2",123,74,50,79,"arch"],["g:2x1",179,93,22,63,"arch"],
    ["g:2x3",47,169,40,65,"arch"],["g:2x2",95,181,32,56,"arch","lit"],["blue",133,170,42,66,"arch"],["g:2x1",26,254,29,71,"arch"],["g:2x2",60,251,48,79,"arch"],["g:3x2",114,252,37,73,"arch"],["tc",161,257,33,68,"arch","lit"]] };
// Finland: the shared layout with three windows pre-lit in yellow (one per upper row, spread left to right)
WINS.Finland=CELLS.map((c,i)=>[1,6,10].includes(i)?[...c,null,"lit"]:c);
// optional 6th field "arch": arched top with a small point (clip-path), as in Bhutan's windows
// optional 7th field "lit": window shows warm yellow before anything is clicked (like Taiwan's "twlit")
function archClip(w,h){
  const a=Math.min(w*.32,h*.3), p=Math.min(4,a*.25), pts=[];
  for(let i=0;i<=24;i++){ const u=-1+i/12, x=(u+1)*w/2, y=a*(1-Math.sqrt(1-u*u))+p*Math.min(1,Math.abs(u)/.22); // round shoulders, small peak at the centre
    pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`); }
  return `polygon(${pts.join(",")},${w}px ${h}px,0px ${h}px)`;
}
const M="#3346c2";
// window pane pattern t over a w×h window; k scales bar thickness, col is the bar colour
function mull(t,w,h,k=1,col=M){
  const R=(x,y,ww,hh)=>`<rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="${col}"/>`; let o="";
  if(t.startsWith("g:")){const [c,r]=t.slice(2).split("x").map(Number), b=3*k;
    for(let i=1;i<c;i++) o+=R(w*i/c-b/2,0,b,h); for(let j=1;j<r;j++) o+=R(0,h*j/r-b/2,w,b);}
  else if(t==="bars"){const rail=3*k, b=2.6*k; o+=R(0,6*k,w,rail); const n=6; for(let i=1;i<n;i++) o+=R(w*i/n-b/2,6*k+rail,b,h-6*k-rail);}
  else if(t==="T"){o+=R(0,h*.62,w,3.4*k); o+=R(w*.34-1.5*k,0,3*k,h*.62);}
  else if(t==="tw"||t==="twlit"){ // Taiwan: framed window, six panes, a thin rail near the top with small diamonds
    o+=`<rect x="1.5" y="1.5" width="${w-3}" height="${h-3}" fill="none" stroke="${col}" stroke-width="${3*k}"/>`;
    const n=6, ry=h*.28, b=1*k, d=1.5*k; o+=R(3,ry-b/2,w-6,b);
    for(let i=1;i<n;i++){const x=w*i/n; o+=R(x-b/2,3,b,h-6); o+=`<rect x="${x-d}" y="${ry-d}" width="${2*d}" height="${2*d}" transform="rotate(45 ${x} ${ry})" fill="${col}"/>`;} }
  else if(t==="tc"){const b=3*k; o+=R(0,h*.62-b/2,w,b); o+=R(w/2-b/2,0,b,h*.62);} // centred vertical above a crossbar
  else if(t==="v2"){const b=2*k; o+=R(w*.33-b/2,0,b,h); o+=R(w*.66-b/2,0,b,h); o+=R(0,h*.5-b/2,w,b);}
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${o}</svg>`;
}
let modalOpen=false, pickedWin=null;
// short intros — not currently shown in the modal; kept in case a description returns (populations are rounded estimates — verify before publishing)
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
const fmtPop=n=>n>=1e9?`${(n/1e9).toFixed(2)} billion`:n>=1e6?`${n>=1e7?Math.round(n/1e6):(n/1e6).toFixed(1)} million`:Math.round(n/1e3).toLocaleString("en")+",000";
function fillGlance(i){
  // anything a country lacks (outline, population, region, a ranking) is left out and the layout closes up
  const d=COUNTRIES[i], geo=COUNTRY_GEO[d.iso]||{};
  document.getElementById("gEye").textContent=`${d.c} at a glance`;
  const facts=[geo.pop&&["Population",fmtPop(geo.pop)], geo.region&&["Region",geo.region]].filter(Boolean);
  document.getElementById("gGeo").innerHTML=
    (geo.d?`<svg viewBox="0 0 140 100" aria-hidden="true"><path d="${geo.d}"/></svg>`:"")+
    (facts.length?`<div class="g-facts">${facts.map(([k,v])=>`<div class="g-fact"><div class="k">${k}</div><div class="v">${v}</div></div>`).join("")}</div>`:"");
  const stats=[
    d.rank!=null  && [`#${d.rank}<small>of ${SOURCES[0].total}</small>`, "World happiness rank"],
    d.score!=null && [`${d.score.toFixed(3)}<small>/ 10</small>`,        "Life evaluation score"],
    d.wb!=null    && [`#${d.wb}<small>of ${SOURCES[1].total}</small>`,   "Overall wellbeing rank"],
  ].filter(Boolean);
  const story=document.getElementById("gStory"); story.scrollTop=0;
  story.innerHTML=(STORIES[d.c]||[]).map(p=>`<p>${p}</p>`).join("");
  const fade=()=>story.classList.toggle("more",story.scrollTop+story.clientHeight<story.scrollHeight-4);
  story.onscroll=fade; requestAnimationFrame(fade);
  document.getElementById("gStats").innerHTML=stats.map(([v,l])=>`<div class="g-stat"><div class="g-big">${v}</div><div class="g-lab">${l}</div></div>`).join("");
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
  document.getElementById("dctx").innerHTML=d.rank==null?"Not ranked in the World Happiness Report 2026":`#${d.rank} of ${TOTAL} countries · World Happiness Report 2026<br>Life evaluation ${d.score.toFixed(2)} / 10 (2023–2025 average)`;
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
function hideInfo(){ document.getElementById("ctitle").style.opacity=0; document.getElementById("card").style.opacity=0; }
function showInfo(i){
  const d=COUNTRIES[i];
  document.getElementById("ctitle").style.opacity=0;
  document.getElementById("card").style.opacity=0;
}
function openModal(){
  if(selected===null) return toast("Select a country first");
  const d=COUNTRIES[selected]; modalOpen=true; pickedWin=null;
  document.getElementById("mname").textContent=d.c.toUpperCase();
  const mh=document.getElementById("mhint"); mh.textContent="Select a window to explore different measures";
  fillGlance(selected);
  document.getElementById("det").classList.remove("on");
  document.getElementById("mempty").style.opacity=0;
  const g=document.getElementById("wgrid"); g.innerHTML="";
  (WINS[d.c]||CELLS).forEach(([tp,x,y,w,h,shape,lit],k)=>{
    // solid blue = unknown data: drawn as a plain, non-interactive block with nothing behind it
    const b=document.createElement(tp==="blue"?"div":"button");b.className="cw"+(tp==="blue"?" blue":"")+(tp==="twlit"||lit==="lit"?" lit":"");
    Object.assign(b.style,{left:x+"px",top:y+"px",width:w+"px",height:h+"px"}); if(shape==="arch") b.style.clipPath=archClip(w,h);
    if(tp==="blue"){ b.setAttribute("aria-hidden","true"); g.appendChild(b); return; }
    b.innerHTML=mull(tp,w,h);
    b.title=`Window ${k+1}`;
    b.onclick=()=>{g.querySelectorAll(".cw").forEach(e=>{e.classList.remove("sel","open");e.style.backgroundImage="";});
      b.classList.add("open"); b.style.backgroundImage=`url(${READER})`; pickedWin=k;
      document.getElementById("glance").classList.add("off");
      showDim(k,d);};
    g.appendChild(b);});
  // the ribbon screen scrolls, so open the modal centred on the current view and freeze scrolling
  const z=parseFloat(stage.style.zoom)||1, m=document.getElementById("modal");
  Object.assign(m.style,{top:(scrollY/z+Math.max(0,(innerHeight/z-677)/2))+"px",bottom:"auto",height:"677px"});
  m._y=scrollY; document.documentElement.style.overflow="hidden";
  document.getElementById("scrimM").classList.add("on"); m.classList.add("on");
  document.querySelector("#ribbon .pager").style.opacity=0;
}
function closeModal(){ modalOpen=false; const m=document.getElementById("modal"); document.documentElement.style.overflow=""; scrollTo(0,m._y||0); // unlocking can jump to top
  document.getElementById("scrimM").classList.remove("on"); document.getElementById("modal").classList.remove("on"); document.querySelector("#ribbon .pager").style.opacity=1;
  // back to hover-exploring: drop the selection so other ribbons respond again
  selected=null; csearch.value=""; document.querySelectorAll(".row").forEach(r=>r.classList.remove("sel")); apply(); }
// clicking the country name returns from a window's detail view to the landing ("at a glance") panel
function backToGlance(){
  if(!modalOpen) return; pickedWin=null;
  document.querySelectorAll("#wgrid .cw").forEach(e=>{e.classList.remove("sel","open");e.style.backgroundImage="";});
  document.getElementById("det").classList.remove("on");
  document.getElementById("glance").classList.remove("off");
}
const mnameEl=document.getElementById("mname");
mnameEl.onclick=backToGlance; mnameEl.setAttribute("role","button"); mnameEl.tabIndex=0; mnameEl.title="Back to overview";
mnameEl.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); backToGlance(); } };
document.getElementById("mclose").onclick=closeModal; document.getElementById("scrimM").onclick=closeModal;
