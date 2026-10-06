/* ───────── LANDING STARS ─────────
   The same starry sky as the ribbon chart, behind the intro text. Each star slowly grows and shrinks
   (and brightens/dims) on its own rhythm, so the field feels alive without anything moving across it. */
(function(){
  const host=document.getElementById("intro"); if(!host) return;
  const NS="http://www.w3.org/2000/svg", W=1440, H=900;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("class","istars"); svg.setAttribute("viewBox",`0 0 ${W} ${H}`); svg.setAttribute("preserveAspectRatio","xMidYMid slice"); svg.setAttribute("aria-hidden","true");
  svg.innerHTML=`<defs><radialGradient id="istarGlow"><stop offset="0" stop-color="#dfe4ff" stop-opacity=".4"/><stop offset="1" stop-color="#dfe4ff" stop-opacity="0"/></radialGradient></defs>`;
  let q=23; const r=()=> (q=(q*16807)%2147483647)/2147483647;   // seeded: the same sky every visit
  for(let i=0;i<170;i++){
    const x=r()*W, y=r()*H, k=r(), warm=r()<.14;
    const rad=k<.72?.7+r()*.5:k<.94?1.2+r()*.6:2+r()*.9;
    const g=document.createElementNS(NS,"g"); g.setAttribute("class","istar");
    g.style.animationDuration=(3.5+r()*5).toFixed(2)+"s"; g.style.animationDelay=(-r()*8).toFixed(2)+"s";
    if(rad>1.9){ const halo=document.createElementNS(NS,"circle"); halo.setAttribute("cx",x.toFixed(1)); halo.setAttribute("cy",y.toFixed(1)); halo.setAttribute("r",(rad*3.6).toFixed(1)); halo.setAttribute("fill","url(#istarGlow)"); g.appendChild(halo); }
    const c=document.createElementNS(NS,"circle"); c.setAttribute("cx",x.toFixed(1)); c.setAttribute("cy",y.toFixed(1)); c.setAttribute("r",rad.toFixed(2));
    c.setAttribute("fill",warm?"#f5d58a":"#eef0ff"); c.setAttribute("fill-opacity",(.4+r()*.5).toFixed(2)); g.appendChild(c);
    svg.appendChild(g);
  }
  host.insertBefore(svg,host.firstChild);
})();
