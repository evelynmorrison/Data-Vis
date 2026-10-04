/* ───────── RANKING LIST ───────── */
const rows=document.getElementById("rows");
COUNTRIES.forEach((d,i)=>{
  if(d.extra){const sep=document.createElement('div');sep.className='sep';sep.textContent='···';rows.appendChild(sep);}
  const ch=d.prev==null?0:d.prev-d.rank, cls=ch>0?"up":ch<0?"down":"same", txt=ch>0?`▲ ${ch}`:ch<0?`▼ ${-ch}`:"–";
  const el=document.createElement("div"); el.className="row"; el.dataset.i=i;
  el.innerHTML=`<span class="rk">${d.rank}</span>${flagSVG(d.code)}<span class="nm">${d.c}</span><span class="chg ${cls}" title="vs WHR 2025">${txt}</span>`;
  el.onclick=()=>{ if(selected===i){ go("ribbon"); return; } select(i); };
  el.ondblclick=()=>{select(i);go("ribbon")};
  rows.appendChild(el);
});
