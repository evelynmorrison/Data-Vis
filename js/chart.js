/* ───────── RIBBON CHART ─────────
   Every row fits in the window below the pinned column titles. With nothing hovered, each country is a
   thin line (width/brightness = how much its rankings disagree). The hovered/selected country is redrawn
   on top as a full ribbon with boxes, names and ranks. */
// #chartFocus is a second svg laid over #chart that holds only the highlighted ribbon. Keeping it separate means
// highlighting never redraws the 165 lines: the lines svg is dimmed as a whole (a cheap, GPU-composited opacity
// change) and the ribbon layer fades on its own.
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("chart"), fsvg=document.getElementById("chartFocus"), head=document.getElementById("chartHead");
const TOP=8, HEAD_H=66, RIBBON_H=17; // RIBBON_H: hovered ribbon thickness
// column geometry, set by layout(): VW = drawing width, X = left edge of each column's box, W = box width.
// The desktop chart is drawn 1440 wide (the stage scales it); on a phone (html.mob) it is drawn at the screen's own
// width, with narrower boxes that show only the rank (the country's name sits in the bar at the bottom of the screen).
let VW=1440, X=[40,347.5,655,962.5,1270], W=130;
const isMob=()=>document.documentElement.classList.contains("mob");
function layout(){
  if(!isMob()){ VW=1440; X=[40,347.5,655,962.5,1270]; W=130; return; }
  VW=Math.round(stage.clientWidth); W=Math.round(Math.min(90,Math.max(34,VW*.1)));
  const L0=30, R0=10, step=(VW-L0-R0-W)/4; X=[0,1,2,3,4].map(j=>L0+j*step); // L0: room for the 1/50/100/150 axis labels
}
const ROWS=Math.max(...ORDERS.map(o=>o.length));
let L={gap:24}; // row spacing, recomputed from the window height in render()
const yc=p=>TOP+(p+.5)*L.gap; // centre line of row p
const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e};
function bez(p0,p3,t){const m=(p0.x+p3.x)/2,u=1-t;
  return{x:u*u*u*p0.x+3*u*u*t*m+3*u*t*t*m+t*t*t*p3.x, y:u*u*u*p0.y+3*u*u*t*p0.y+3*u*t*t*p3.y+t*t*t*p3.y,
         dx:3*u*u*(m-p0.x)+6*u*t*0+3*t*t*(p3.x-m), dy:6*u*t*(p3.y-p0.y)}}
// ribbon of thickness H along the curve from t0 to t1, swelling slightly mid-way.
// With a twist point tc, the width pinches to an edge around tc and flips — the ribbon turns over.
let seed=7; const rnd=()=> (seed=(seed*16807)%2147483647)/2147483647;
function band(p0,p3,H,tc=null,t0=0,t1=1,N=48){
  const top=[],bot=[];
  for(let k=0;k<=N;k++){
    const t=t0+(t1-t0)*k/N,b=bez(p0,p3,t),Ln=Math.hypot(b.dx,b.dy)||1,nx=-b.dy/Ln,ny=b.dx/Ln;
    let f=1+.3*Math.sin(Math.PI*t);
    if(tc!==null){const u=Math.max(0,Math.min(1,(t-(tc-.2))/.4)),c=Math.cos(Math.PI*u); f=Math.sign(c||1)*Math.max(Math.abs(c),.14)*(1+.3*Math.sin(Math.PI*t)*Math.abs(c));}
    const h=H/2*f; top.push(`${(b.x+nx*h).toFixed(1)},${(b.y+ny*h).toFixed(1)}`); bot.push(`${(b.x-nx*h).toFixed(1)},${(b.y-ny*h).toFixed(1)}`);
  }
  return "M"+top.join("L")+"L"+bot.reverse().join("L")+"Z";
}

// per-country geometry that doesn't depend on the layout: row in each column and the segments between them
const GEO=COUNTRIES.map((_,ci)=>{
  const pos=ORDERS.map(o=>o.indexOf(ci)), cols=pos.map((p,j)=>j).filter(j=>pos[j]>=0); // ribbon jumps unranked columns
  const segs=[]; for(let k=1;k<cols.length;k++) segs.push({a:cols[k-1],b:cols[k],tc:.4+.2*rnd()}); // tc: where a twist would turn
  return {pos,cols,segs};
});

// disagreement: spread between a country's best and worst position across the columns it's ranked in,
// each position taken as a share of that column's list so 134-, 147- and 164-country columns compare fairly.
// Scaled 0..1 against the most-disagreeing country; drives line width and brightness.
const DIS=(()=>{
  const raw=GEO.map(({pos,cols})=>{ if(cols.length<2) return 0; const s=cols.map(j=>pos[j]/(ORDERS[j].length-1)); return Math.max(...s)-Math.min(...s); });
  const top=Math.max(...raw); return raw.map(v=>v/top);
})();

// x where lines cross column j: the outer columns reach the outer edges of the column titles
// (first title is left-aligned, last right-aligned); inner columns sit under their centred titles
const lineX=j=>j===0?X[0]:j===X.length-1?X[j]+W:X[j]+W/2;

// nothing hovered: one smooth line per country through its rank in each column (level at each column),
// wider and brighter the more its rankings disagree
function drawLine(ci,g){
  const {pos,cols}=GEO[ci], pts=cols.map(j=>[lineX(j),yc(pos[j])]), t=DIS[ci]**2; // squared: only the strongest disagreements stand out
  let d=`M${pts[0][0]},${pts[0][1].toFixed(1)}`;
  for(let k=1;k<pts.length;k++){ const [x0,y0]=pts[k-1],[x1,y1]=pts[k],m=(x0+x1)/2; d+=`C${m},${y0.toFixed(1)} ${m},${y1.toFixed(1)} ${x1},${y1.toFixed(1)}`; }
  mk("path",{class:"ln",d,"stroke-width":(.5+3*t).toFixed(2),"stroke-opacity":(.1+.75*t).toFixed(2)},g);
}
// starry backdrop: seeded so the sky stays the same on every render; a few warm stars, a few soft glows, some twinkle
function drawStars(ht){
  let q=11; const r=()=> (q=(q*16807)%2147483647)/2147483647;
  const g=mk("g",{id:"stars","pointer-events":"none"}), n=Math.round(ht/900*160*VW/1440);
  for(let i=0;i<n;i++){
    const x=(r()*VW).toFixed(1), y=(r()*ht).toFixed(1), k=r(), warm=r()<.14, tw=r()<.35;
    const rad=k<.72?.7+r()*.5:k<.94?1.2+r()*.6:2+r()*.8;
    const c=mk("circle",{cx:x,cy:y,r:rad.toFixed(2),fill:warm?"#f5d58a":"#eef0ff","fill-opacity":(.4+r()*.5).toFixed(2)},g);
    if(rad>1.9) mk("circle",{cx:x,cy:y,r:(rad*3.5).toFixed(1),fill:"url(#starGlow)"},g);
    if(tw){ c.classList.add("tw"); c.style.animationDelay=(-r()*6).toFixed(2)+"s"; c.style.animationDuration=(3+r()*4).toFixed(2)+"s"; }
  }
}
function drawGrid(){
  const g=mk("g",{id:"grid"}), y0=yc(0), y1=yc(ROWS-1);
  X.forEach((_,j)=>mk("line",{class:"gcol",x1:lineX(j),x2:lineX(j),y1:y0,y2:y1},g));
  [1,50,100,150].filter(r=>r<=ROWS).forEach(r=>{
    mk("line",{class:"grow",x1:X[0],x2:X[X.length-1]+W,y1:yc(r-1),y2:yc(r-1)},g);
    mk("text",{class:"gaxis",x:X[0]-8,y:yc(r-1)+3.5,"text-anchor":"end"},g).textContent=r;
  });
}

// draw one country's full ribbon into gRib and its boxes + labels into gBox (the hovered/selected country).
// The ribbon is ONE unbroken shape through every column it is ranked in (flat across each box, an S-curve between),
// so it reads as a single continuous strip. Colour flows along its length: light where the country rises or holds
// vs the previous column, blue where it falls, blending through each curve.
function ribbonPath(ci,H){
  const {pos,cols}=GEO[ci], pts=[];
  cols.forEach((j,k)=>{
    const y=yc(pos[j]);
    if(k>0){ const a=cols[k-1], p0={x:X[a]+W,y:yc(pos[a])}, p3={x:X[j],y};
      for(let s=1;s<40;s++){ const b=bez(p0,p3,s/40); pts.push({x:b.x,y:b.y,dx:b.dx,dy:b.dy,sw:Math.sin(Math.PI*s/40)}); } }
    for(let s=0;s<=10;s++) pts.push({x:X[j]+W*s/10,y,dx:1,dy:0,sw:0});
  });
  const top=[],bot=[];
  pts.forEach(p=>{ const Ln=Math.hypot(p.dx,p.dy)||1, nx=-p.dy/Ln, ny=p.dx/Ln, h=H/2*(1+.18*p.sw); // slight swell mid-curve
    top.push(`${(p.x+nx*h).toFixed(1)},${(p.y+ny*h).toFixed(1)}`); bot.push(`${(p.x-nx*h).toFixed(1)},${(p.y-ny*h).toFixed(1)}`); });
  return "M"+top.join("L")+"L"+bot.reverse().join("L")+"Z";
}
function ribbonGradient(ci,faces){
  const {cols}=GEO[ci], x0=X[cols[0]], x1=X[cols[cols.length-1]]+W, id="rg"+ci;
  svg.querySelector("#"+id)?.remove();
  const g=mk("linearGradient",{id,gradientUnits:"userSpaceOnUse",x1:x0,y1:0,x2:x1,y2:0},svg.querySelector("defs"));
  const f=x=>((x-x0)/(x1-x0)).toFixed(4);
  cols.forEach(j=>{ const c=faces[j]?"#e6e8fb":"#3f4fe0"; mk("stop",{offset:f(X[j]),"stop-color":c},g); mk("stop",{offset:f(X[j]+W),"stop-color":c},g); });
  return `url(#${id})`;
}
function drawCountry(ci,gRib,gBox,H){
  const d=COUNTRIES[ci], {pos,cols,segs}=GEO[ci], m=isMob();
  const faces={[cols[0]]:true}; for(const {a,b} of segs) faces[b]=pos[b]<=pos[a];
  const path=ribbonPath(ci,H);
  mk("path",{class:"ribbon-body",d:path,"data-fill":ribbonGradient(ci,faces)},gRib);
  mk("path",{class:"ribbon-grain",d:path,filter:"url(#ribGrain)","data-fill":"#ffffff"},gRib);
  cols.forEach(j=>{
    const c=yc(pos[j]);
    mk("rect",{x:X[j],y:c-H/2,width:W,height:H,"data-f":faces[j]?1:0,"data-fill":"transparent"},gBox); // hit area + label colour key
    mk("text",{class:"lbl",x:X[j]+W/2,y:c+3.6,"text-anchor":"middle"},gBox).textContent=m?"":d.c; // phone boxes: rank only
    mk("text",{class:"lbl rn",x:m?X[j]+W/2:X[j]+8,y:c+3.6,"text-anchor":m?"middle":"start","font-weight":700,opacity:0},gBox).textContent=d[SOURCES[j].key];
  });
}

let drawn=false, drawnMob=false, lastW=0, lastH=0, lineG={}, focus=null, hovered=null;
function drawChart(){
  if(drawn&&drawnMob===isMob()){ apply(); return; } // (re)drawn when the layout switched between phone and desktop
  if(drawn){ render(); return; } drawn=true;
  mk("defs",{}).innerHTML=`<linearGradient id="dimF" x1="0" x2="1"><stop offset="0" stop-color="#8e93c4"/><stop offset=".5" stop-color="#5d6298"/><stop offset="1" stop-color="#8e93c4"/></linearGradient>
  <linearGradient id="dimB" x1="0" x2="1"><stop offset="0" stop-color="#3a3f7c"/><stop offset="1" stop-color="#5a62b8"/></linearGradient>
  <linearGradient id="hiF" x1="0" x2="1"><stop offset="0" stop-color="#e3e5fa"/><stop offset=".5" stop-color="#aab4f0"/><stop offset="1" stop-color="#e3e5fa"/></linearGradient>
  <linearGradient id="hiB" x1="0" x2="1"><stop offset="0" stop-color="#3444dc"/><stop offset="1" stop-color="#6f87e6"/></linearGradient>
  <radialGradient id="starGlow"><stop offset="0" stop-color="#dfe4ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe4ff" stop-opacity="0"/></radialGradient>
  <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <filter id="ribGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -1.25" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>`;
  render();
}
// column titles: first group left-aligned, last right-aligned, others centred over their columns
function drawHead(){
  const m=isMob(); head.innerHTML=""; head.setAttribute("width",VW); head.setAttribute("viewBox",`0 0 ${VW} ${HEAD_H}`);
  HEAD.forEach((h,gi)=>{
    const a=h.cols[0], b=h.cols[h.cols.length-1];
    const [x,anchor]=gi===0?[X[a],"start"]:gi===HEAD.length-1?[X[b]+W,"end"]:[(X[a]+X[b]+W)/2,"middle"];
    const g=mk("g",{class:"hhit"},head);
    mk("text",{class:"colh",x,y:17,"text-anchor":anchor},g).textContent=m&&h.short||h.title;
    mk("text",{class:"colnote",x,y:32,"text-anchor":anchor},g).textContent=m&&h.shortNote||h.note;
    headTip(g,h.info,h.cols.length>1?"each":nRanked(a),anchor);
    if(h.subs){
      mk("line",{class:"colrule",x1:X[a],x2:X[b]+W,y1:41,y2:41},head);
      h.subs.forEach((s,k)=>{
        const sg=mk("g",{class:"hhit"},head);
        mk("text",{class:"colsub",x:X[h.cols[k]]+W/2,y:58,"text-anchor":"middle"},sg).textContent=m&&s.short||s.label;
        headTip(sg,s.info,nRanked(h.cols[k]),"middle");
      });
    }
  });
}

// hover popup for a column title: what the index measures + how many countries it ranks.
// A transparent rect over the title block gives a steady hover target (text alone has gaps).
const tip=document.getElementById("htip"), ribbonEl=document.getElementById("ribbon");
function headTip(g,info,n,anchor){
  const bb=g.getBBox(); g.insertBefore(mk("rect",{x:bb.x-6,y:bb.y-3,width:bb.width+12,height:bb.height+6,fill:"transparent"},g),g.firstChild);
  const count=n==="each"?`<b>${nRanked(1)}</b> countries ranked in each column`:`<b>${n}</b> countries ranked`;
  g.addEventListener("mouseenter",()=>{
    tip.innerHTML=`<p>${info}</p><p class="n">${count}</p>`;
    const z=parseFloat(stage.style.zoom)||1, r=g.getBoundingClientRect(), s=ribbonEl.getBoundingClientRect(), w=tip.offsetWidth;
    const anchorX=anchor==="start"?r.left:anchor==="end"?r.right:(r.left+r.right)/2;
    let left=(anchorX-s.left)/z-(anchor==="start"?0:anchor==="end"?w:w/2);
    tip.style.left=Math.max(16,Math.min(VW-16-w,left))+"px"; tip.style.top=((r.bottom-s.top)/z+8)+"px";
    tip.classList.add("on");
  });
  g.addEventListener("mouseleave",()=>tip.classList.remove("on"));
}

// (re)build the chart; rows share the window height left under the pinned titles
function render(){
  layout(); drawHead();
  const z=parseFloat(stage.style.zoom)||1, bar=isMob()?84:0; // phones: keep the last rows clear of the country bar
  L={gap:Math.max(2,(innerHeight/z-HEAD_H-2*TOP-bar)/ROWS)};
  drawnMob=isMob(); lastW=VW; lastH=innerHeight;
  svg.querySelectorAll("#stars,#grid,#lines").forEach(e=>e.remove()); fsvg.innerHTML="";
  const ht=TOP*2+ROWS*L.gap;
  for(const s of [svg,fsvg]){ s.setAttribute("width",VW); s.setAttribute("height",ht); s.setAttribute("viewBox",`0 0 ${VW} ${ht}`); }
  drawStars(ht); drawGrid();
  const lines=mk("g",{id:"lines"});
  // most-disagreeing countries drawn last so their brighter lines sit on top
  COUNTRIES.map((_,ci)=>ci).sort((a,b)=>DIS[a]-DIS[b]).forEach(ci=>{ lineG[ci]=mk("g",{class:"rib","data-ci":ci},lines); drawLine(ci,lineG[ci]); });
  focus=mk("g",{id:"focus",class:"rib",filter:"url(#sh)"},fsvg); // full ribbon of the hovered/selected country
  hovered=null; apply();
}

// colour a full ribbon (used for the hovered/selected country): light/dark faces, labels, rank numbers
function paintGroups(gs,state){
  const bright=state!=="dim";
  for(const e of gs){
    e.style.opacity=bright?1:.32;
    e.querySelectorAll("path,rect").forEach(e=>{ if(e.dataset.fill){ e.setAttribute("fill",e.dataset.fill); return; } const f=e.dataset.f==="1";
      e.setAttribute("fill",bright?(f?"url(#hiF)":"url(#hiB)"):(f?"url(#dimF)":"url(#dimB)"));});
    e.querySelectorAll("text.rn").forEach(t=>{const f=t.previousSibling.previousSibling.dataset.f==="1";t.setAttribute("opacity",state==="hi"?1:0);t.setAttribute("fill",f?"#1a1f6e":"#eef0f8")});
    e.querySelectorAll("text:not(.rn)").forEach(t=>{const f=t.previousSibling.dataset.f==="1";t.setAttribute("fill",bright?(f?"#1a1f6e":"#eef0f8"):"#d6d8ee");t.setAttribute("font-weight",state==="hi"?600:400)});
  }
}
// state: hi (hovered/selected) | dim (everyone else while one is hovered) | idle (nothing hovered).
// Lines keep their own width/brightness; others fade while a country is hovered, which is drawn in #focus
// lines are dimmed together (class on the lines svg) while a country is highlighted; see #chart.dim in app.css
function dimLines(on){ svg.classList.toggle("dim",on); }
// the highlighted ribbon. Clearing it fades it out over the same .35s the other lines take to fade back in,
// so the chart cross-fades instead of going briefly empty.
let focusFade;
function setFocus(ci){
  if(!focus) return; clearTimeout(focusFade);
  if(ci===null){
    if(!focus.firstChild) return;
    fsvg.style.opacity=0; focusFade=setTimeout(()=>{ focus.innerHTML=""; },360); return;
  }
  focus.innerHTML=""; fsvg.style.opacity=1;
  focus.dataset.ci=ci;
  const r=mk("g",{},focus), b=mk("g",{},focus);
  drawCountry(ci,r,b,RIBBON_H); paintGroups([r,b],"hi");
}
function preview(ci){ hovered=ci; dimLines(true); setFocus(ci); }
function apply(){
  if(selected===null){ hovered=null; dimLines(false); setFocus(null); hideInfo(); updateBar(); return; }
  preview(selected); showInfo(selected); updateBar();
}
// phones: the selected country's name and five ranks in a bar at the bottom of the screen, with a button to open it
const mbar=document.getElementById("mbar"), BAR_LABELS=["WHR","Overall","Pos.","Neg.","HPI"];
function updateBar(){
  const on=isMob()&&selected!==null&&!modalOpen; mbar.classList.toggle("on",on); if(!on) return;
  const d=COUNTRIES[selected]; document.getElementById("mbName").textContent=d.c;
  document.getElementById("mbRanks").innerHTML=SOURCES.map((s,j)=>`<span><i>${BAR_LABELS[j]}</i>${d[s.key]!=null?"#"+d[s.key]:"–"}</span>`).join("");
}
document.getElementById("mbOpen").onclick=()=>openModal();
document.getElementById("mbX").onclick=()=>{ document.getElementById("csearch").value=""; select(null); };

// pointer → country: the ribbon/box under the pointer, else the row nearest the pointer
function nearest(e){
  const r=svg.getBoundingClientRect(), sx=VW/r.width, x=(e.clientX-r.left)*sx, y=(e.clientY-r.top)*sx;
  const row=Math.floor((y-TOP)/L.gap); if(row<0||row>=ROWS) return null;
  let j=0,best=1e9; X.forEach((cx,k)=>{const d=Math.abs(x-(cx+W/2)); if(d<best){best=d;j=k;}});
  if(best>W/2+60) return null; return ORDERS[j][row] ?? null; // shorter columns have empty rows
}
// the ribbon layer ignores the pointer, so keep the current country while the pointer is over its ribbon
function onFocusRibbon(e){
  const body=focus&&focus.querySelector(".ribbon-body"); if(!body||hovered===null) return false;
  const r=svg.getBoundingClientRect(), k=VW/r.width, p=new DOMPoint((e.clientX-r.left)*k,(e.clientY-r.top)*k);
  return body.isPointInFill(p)||[...focus.querySelectorAll("rect")].some(b=>b.isPointInFill(p));
}
const ciAt=e=>{ if(onFocusRibbon(e)) return hovered; const g=e.target.closest(".rib"); return g?+g.dataset.ci:nearest(e); };
svg.addEventListener("pointermove",e=>{ if(selected!==null||modalOpen) return; const ci=ciAt(e); if(ci!==null&&ci!==hovered) preview(ci); });
svg.addEventListener("pointerleave",()=>{ if(selected===null&&!modalOpen) apply(); });
svg.style.cursor="pointer";
svg.addEventListener("pointerup",e=>{ const ci=ciAt(e);
  // phones have no hover: the first tap highlights a country (and shows its bar), a second tap on it opens it
  if(isMob()){ if(ci===null) return; if(ci===selected) openModal(); else select(ci); return; }
  if(ci===null) return; select(ci); openModal(); });

// scroll target that puts the chart directly under the pinned titles
function chartTop(){ const z=parseFloat(stage.style.zoom)||1; return scrollY+svg.getBoundingClientRect().top-HEAD_H*z; }

// phones fire resize whenever the address bar slides in or out; there, redraw only for a real change
// (new width, a switch between phone and desktop layout, or a large height change such as rotating)
let resizeT; addEventListener("resize",()=>{ if(!drawn) return; clearTimeout(resizeT); resizeT=setTimeout(()=>{
  if(isMob()&&drawnMob&&Math.round(stage.clientWidth)===lastW&&Math.abs(innerHeight-lastH)<120) return;
  render(); },150); });
