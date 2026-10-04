/* ───────── RIBBON CHART ───────── */
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("chart");
const X=[40,480,900,1290], W=110, H=17, TOP=140, GAP=24;
const cy=i=>TOP+i*GAP;
const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e};
function bez(p0,p3,t){const m=(p0.x+p3.x)/2,u=1-t;
  return{x:u*u*u*p0.x+3*u*u*t*m+3*u*t*t*m+t*t*t*p3.x, y:u*u*u*p0.y+3*u*u*t*p0.y+3*u*t*t*p3.y+t*t*t*p3.y,
         dx:3*u*u*(m-p0.x)+6*u*t*0+3*t*t*(p3.x-m), dy:6*u*t*(p3.y-p0.y)}}
let seed=7; const rnd=()=> (seed=(seed*16807)%2147483647)/2147483647;
function band(p0,p3,twist,tc,t0,t1,N=48){
  const top=[],bot=[];
  for(let k=0;k<=N;k++){
    const t=t0+(t1-t0)*k/N,b=bez(p0,p3,t),L=Math.hypot(b.dx,b.dy)||1,nx=-b.dy/L,ny=b.dx/L;
    let f=1+.3*Math.sin(Math.PI*t);
    if(twist){const u=Math.max(0,Math.min(1,(t-(tc-.2))/.4)),c=Math.cos(Math.PI*u); f=Math.sign(c||1)*Math.max(Math.abs(c),.14)*(1+.3*Math.sin(Math.PI*t)*Math.abs(c));}
    const h=H/2*f; top.push(`${(b.x+nx*h).toFixed(1)},${(b.y+ny*h).toFixed(1)}`); bot.push(`${(b.x-nx*h).toFixed(1)},${(b.y-ny*h).toFixed(1)}`);
  }
  return "M"+top.join("L")+"L"+bot.reverse().join("L")+"Z";
}
let drawn=false, ribG={}, labelEls={};
function drawChart(){
  if(drawn){ apply(); return; } drawn=true;
  const defs=mk("defs",{});
  defs.innerHTML=`<linearGradient id="dimF" x1="0" x2="1"><stop offset="0" stop-color="#8e93c4"/><stop offset=".5" stop-color="#5d6298"/><stop offset="1" stop-color="#8e93c4"/></linearGradient>
  <linearGradient id="dimB" x1="0" x2="1"><stop offset="0" stop-color="#3a3f7c"/><stop offset="1" stop-color="#5a62b8"/></linearGradient>
  <linearGradient id="hiF" x1="0" x2="1"><stop offset="0" stop-color="#e3e5fa"/><stop offset=".5" stop-color="#aab4f0"/><stop offset="1" stop-color="#e3e5fa"/></linearGradient>
  <linearGradient id="hiB" x1="0" x2="1"><stop offset="0" stop-color="#3444dc"/><stop offset="1" stop-color="#6f87e6"/></linearGradient>
  <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>`;
  
  COLS.forEach((t,j)=>mk("text",{class:"colh",x:X[j]+(j===3?W:0),y:TOP-14,"text-anchor":j===0?"start":j===3?"end":"middle",dx:j===1||j===2?W/2:0}).textContent=t);
  const layer=mk("g",{id:"ribs"});
  COUNTRIES.forEach((d,ci)=>{
    const g=mk("g",{class:"rib",filter:"url(#sh)"},layer); ribG[ci]=g;
    const pos=ORDERS.map(o=>o.indexOf(ci)); let face=true; const faces=[true];
    for(let j=1;j<4;j++){
      const p0={x:X[j-1]+W,y:cy(pos[j-1])+H/2},p3={x:X[j],y:cy(pos[j])+H/2},tw=Math.abs(pos[j]-pos[j-1])>=3,tc=.36+.28*rnd();
      if(tw){ mk("path",{d:band(p0,p3,true,tc,0,tc),"data-f":face?1:0},g); mk("path",{d:band(p0,p3,true,tc,tc,1),"data-f":face?0:1},g); face=!face; }
      else mk("path",{d:band(p0,p3,false,tc,0,1),"data-f":face?1:0},g);
      faces.push(face);
    }
    labelEls[ci]=[];
    pos.forEach((p,j)=>{
      const rc=mk("rect",{x:X[j],y:cy(p),width:W,height:H,"data-f":faces[j]?1:0},g);
      const tx=mk("text",{class:"lbl",x:X[j]+W/2,y:cy(p)+H/2+3.6,"text-anchor":"middle"},g); tx.textContent=d.c;
      labelEls[ci].push(tx);
      const rn=mk("text",{class:"lbl rn",x:X[j]+8,y:cy(p)+H/2+3.6,"font-weight":700,opacity:0},g); rn.textContent=j===0?d.rank:p+1;
    });
    g.onmouseenter=()=>{ if(selected===null) preview(ci) };
    g.onmouseleave=()=>{ if(selected===null) apply() };
    g.dataset.ci=ci;
  });
  apply();
}
function paint(ci,state){ // state: hi | dim | idle
  const g=ribG[ci]; if(!g) return;
  g.style.opacity=state==="dim"?.32:state==="hi"?1:.55;
  g.querySelectorAll("path,rect").forEach(e=>{const f=e.dataset.f==="1";
    e.setAttribute("fill",state==="hi"?(f?"url(#hiF)":"url(#hiB)"):(f?"url(#dimF)":"url(#dimB)"));});
  g.querySelectorAll("text.rn").forEach(t=>{const f=t.previousSibling.previousSibling.dataset.f==="1";t.setAttribute("opacity",state==="hi"?1:0);t.setAttribute("fill",f?"#1a1f6e":"#eef0f8")});
  g.querySelectorAll("text:not(.rn)").forEach(t=>{const f=t.previousSibling.dataset.f==="1";t.setAttribute("fill",state==="hi"?(f?"#1a1f6e":"#eef0f8"):"#d6d8ee");t.setAttribute("font-weight",state==="hi"?600:400)});
  if(state==="hi" && selected===ci && !g.nextSibling) {} else if(state==="hi" && selected===ci) g.parentNode.appendChild(g);
}
function preview(ci){COUNTRIES.forEach((_,i)=>paint(i,i===ci?"hi":"dim"))}
function apply(){
  if(selected===null){COUNTRIES.forEach((_,i)=>paint(i,"idle")); hideInfo(); return;}
  preview(selected); showInfo(selected);
}
