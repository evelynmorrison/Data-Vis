/* ───────── RIBBON CHART ─────────
   Two layouts (toggle above the chart):
     fit   every row fits in the window below the pinned column titles: thin ribbons, no labels.
           The hovered/selected country is redrawn on top at full size with names and ranks.
     full  24px rows with names on every box; the page scrolls through them. */
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("chart"), head=document.getElementById("chartHead");
const X=[40,347.5,655,962.5,1270], W=130, TOP=8, HEAD_H=66, FULL={gap:24, h:17};
const ROWS=Math.max(...ORDERS.map(o=>o.length));
let mode="fit", L=FULL;
const yc=p=>TOP+(p+.5)*L.gap; // centre line of row p
const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e};
function bez(p0,p3,t){const m=(p0.x+p3.x)/2,u=1-t;
  return{x:u*u*u*p0.x+3*u*u*t*m+3*u*t*t*m+t*t*t*p3.x, y:u*u*u*p0.y+3*u*u*t*p0.y+3*u*t*t*p3.y+t*t*t*p3.y,
         dx:3*u*u*(m-p0.x)+6*u*t*0+3*t*t*(p3.x-m), dy:6*u*t*(p3.y-p0.y)}}
function band(p0,p3,H,N=48){ // ribbon of thickness H along the curve, swelling slightly mid-way
  const top=[],bot=[];
  for(let k=0;k<=N;k++){
    const t=k/N,b=bez(p0,p3,t),Ln=Math.hypot(b.dx,b.dy)||1,nx=-b.dy/Ln,ny=b.dx/Ln;
    const h=H/2*(1+.3*Math.sin(Math.PI*t)); top.push(`${(b.x+nx*h).toFixed(1)},${(b.y+ny*h).toFixed(1)}`); bot.push(`${(b.x-nx*h).toFixed(1)},${(b.y-ny*h).toFixed(1)}`);
  }
  return "M"+top.join("L")+"L"+bot.reverse().join("L")+"Z";
}

// per-country geometry that doesn't depend on the layout: row in each column and the segments between them
const GEO=COUNTRIES.map((_,ci)=>{
  const pos=ORDERS.map(o=>o.indexOf(ci)), cols=pos.map((p,j)=>j).filter(j=>pos[j]>=0); // ribbon jumps unranked columns
  const segs=[]; for(let k=1;k<cols.length;k++) segs.push({a:cols[k-1],b:cols[k]});
  return {pos,cols,segs};
});

// draw one country's ribbons into gRib and boxes (+labels) into gBox
function drawCountry(ci,gRib,gBox,H,labels){
  const d=COUNTRIES[ci], {pos,cols,segs}=GEO[ci];
  // light (data-f=1) where the country rises or holds vs the previous column it's ranked in, dark where it falls;
  // the segment and the box it lands in share the colour. The first column has no previous, so it's light.
  const faces={[cols[0]]:true};
  for(const {a,b} of segs){
    const rise=pos[b]<=pos[a];
    mk("path",{d:band({x:X[a]+W,y:yc(pos[a])},{x:X[b],y:yc(pos[b])},H),"data-f":rise?1:0},gRib);
    faces[b]=rise;
  }
  cols.forEach(j=>{
    const c=yc(pos[j]);
    mk("rect",{x:X[j],y:c-H/2,width:W,height:H,"data-f":faces[j]?1:0},gBox);
    if(!labels) return;
    mk("text",{class:"lbl",x:X[j]+W/2,y:c+3.6,"text-anchor":"middle"},gBox).textContent=d.c;
    mk("text",{class:"lbl rn",x:X[j]+8,y:c+3.6,"font-weight":700,opacity:0},gBox).textContent=d[SOURCES[j].key];
  });
}

let drawn=false, ribG={}, boxG={}, focus=null, hovered=null;
function drawChart(){
  if(drawn){ apply(); return; } drawn=true;
  mk("defs",{}).innerHTML=`<linearGradient id="dimF" x1="0" x2="1"><stop offset="0" stop-color="#8e93c4"/><stop offset=".5" stop-color="#5d6298"/><stop offset="1" stop-color="#8e93c4"/></linearGradient>
  <linearGradient id="dimB" x1="0" x2="1"><stop offset="0" stop-color="#3a3f7c"/><stop offset="1" stop-color="#5a62b8"/></linearGradient>
  <linearGradient id="hiF" x1="0" x2="1"><stop offset="0" stop-color="#e3e5fa"/><stop offset=".5" stop-color="#aab4f0"/><stop offset="1" stop-color="#e3e5fa"/></linearGradient>
  <linearGradient id="hiB" x1="0" x2="1"><stop offset="0" stop-color="#3444dc"/><stop offset="1" stop-color="#6f87e6"/></linearGradient>
  <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>`;
  // column titles: first group left-aligned, last right-aligned, others centred over their columns
  HEAD.forEach((h,gi)=>{
    const a=h.cols[0], b=h.cols[h.cols.length-1];
    const [x,anchor]=gi===0?[X[a],"start"]:gi===HEAD.length-1?[X[b]+W,"end"]:[(X[a]+X[b]+W)/2,"middle"];
    mk("text",{class:"colh",x,y:17,"text-anchor":anchor},head).textContent=h.title;
    mk("text",{class:"colnote",x,y:32,"text-anchor":anchor},head).textContent=h.note;
    if(h.subs){
      mk("line",{class:"colrule",x1:X[a],x2:X[b]+W,y1:41,y2:41},head);
      h.subs.forEach((t,k)=>mk("text",{class:"colsub",x:X[h.cols[k]]+W/2,y:58,"text-anchor":"middle"},head).textContent=t);
    }
  });
  render();
}

// (re)build every country for the current mode
function render(){
  if(mode==="fit"){ // rows share the window height left under the pinned titles
    const z=parseFloat(stage.style.zoom)||1, gap=Math.max(2,(innerHeight/z-HEAD_H-2*TOP)/ROWS);
    L={gap, h:Math.max(1.2,gap*.55)};
  } else L=FULL;
  svg.querySelectorAll("#ribs,#boxes,#focus").forEach(e=>e.remove());
  const ht=TOP*2+ROWS*L.gap; svg.setAttribute("height",ht); svg.setAttribute("viewBox",`0 0 1440 ${ht}`);
  // boxes sit in a layer above every ribbon, so a ribbon that jumps over a column can't hide its boxes
  const shadow=mode==="full"?{filter:"url(#sh)"}:{};
  const ribs=mk("g",{id:"ribs"}), boxes=mk("g",{id:"boxes"});
  COUNTRIES.forEach((_,ci)=>{
    ribG[ci]=mk("g",{class:"rib","data-ci":ci,...shadow},ribs);
    boxG[ci]=mk("g",{class:"rib","data-ci":ci,...shadow},boxes);
    drawCountry(ci,ribG[ci],boxG[ci],L.h,mode==="full");
  });
  focus=mk("g",{id:"focus",class:"rib",filter:"url(#sh)"}); // full-size copy of the hovered country (fit mode)
  hovered=null; apply();
}

// state: hi (hovered/selected) | dim (everyone else while one is hovered) | idle (nothing hovered)
// idle uses the same bright colours as hi; only hovering fades the others
function paintGroups(gs,state){
  const bright=state!=="dim";
  for(const e of gs){
    e.style.opacity=bright?1:.32;
    e.querySelectorAll("path,rect").forEach(e=>{const f=e.dataset.f==="1";
      e.setAttribute("fill",bright?(f?"url(#hiF)":"url(#hiB)"):(f?"url(#dimF)":"url(#dimB)"));});
    e.querySelectorAll("text.rn").forEach(t=>{const f=t.previousSibling.previousSibling.dataset.f==="1";t.setAttribute("opacity",state==="hi"?1:0);t.setAttribute("fill",f?"#1a1f6e":"#eef0f8")});
    e.querySelectorAll("text:not(.rn)").forEach(t=>{const f=t.previousSibling.dataset.f==="1";t.setAttribute("fill",bright?(f?"#1a1f6e":"#eef0f8"):"#d6d8ee");t.setAttribute("font-weight",state==="hi"?600:400)});
  }
}
function paint(ci,state){
  const g=ribG[ci], bx=boxG[ci]; if(!g) return;
  paintGroups([g,bx],state);
  if(state==="hi") for(const e of [g,bx]) if(e.nextSibling) e.parentNode.appendChild(e); // highlighted country on top
}
function setFocus(ci){
  if(!focus) return; focus.innerHTML="";
  if(ci===null||mode!=="fit") return;
  focus.dataset.ci=ci;
  const r=mk("g",{},focus), b=mk("g",{},focus);
  drawCountry(ci,r,b,FULL.h,true); paintGroups([r,b],"hi");
}
function preview(ci){ hovered=ci; COUNTRIES.forEach((_,i)=>paint(i,i===ci?"hi":"dim")); setFocus(ci); }
function apply(){
  if(selected===null){ hovered=null; COUNTRIES.forEach((_,i)=>paint(i,"idle")); setFocus(null); hideInfo(); return; }
  preview(selected); showInfo(selected);
}

// pointer → country: the ribbon/box under the pointer, else the row nearest the pointer
function nearest(e){
  const r=svg.getBoundingClientRect(), sx=1440/r.width, x=(e.clientX-r.left)*sx, y=(e.clientY-r.top)*sx;
  const row=Math.floor((y-TOP)/L.gap); if(row<0||row>=ROWS) return null;
  let j=0,best=1e9; X.forEach((cx,k)=>{const d=Math.abs(x-(cx+W/2)); if(d<best){best=d;j=k;}});
  if(best>W/2+60) return null; return ORDERS[j][row] ?? null; // shorter columns have empty rows
}
const ciAt=e=>{const g=e.target.closest(".rib"); return g?+g.dataset.ci:nearest(e);};
svg.addEventListener("pointermove",e=>{ if(selected!==null||modalOpen) return; const ci=ciAt(e); if(ci!==null&&ci!==hovered) preview(ci); });
svg.addEventListener("pointerleave",()=>{ if(selected===null&&!modalOpen) apply(); });
svg.style.cursor="pointer";
svg.addEventListener("pointerup",e=>{ const ci=ciAt(e); if(ci===null) return; select(ci); openModal(); });

// scroll target that puts the chart directly under the pinned titles
function chartTop(){ const z=parseFloat(stage.style.zoom)||1; return scrollY+svg.getBoundingClientRect().top-HEAD_H*z; }

function setMode(m){
  if(m===mode) return; mode=m;
  document.querySelectorAll(".ctoggle button").forEach(b=>b.classList.toggle("on",b.dataset.mode===m));
  if(drawn){ render(); scrollTo(0,0); }
}
document.querySelectorAll(".ctoggle button").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
let resizeT; addEventListener("resize",()=>{ if(drawn&&mode==="fit"){ clearTimeout(resizeT); resizeT=setTimeout(render,150); } });
