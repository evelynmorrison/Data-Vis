/* ───────── FLAGS (simplified SVG) ───────── */
const r=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
const nord=(bg,cr,inn)=>r(0,0,28,20,bg)+r(8,0,inn?5:4,20,cr)+r(0,8,28,inn?5:4,cr)+(inn?r(9,0,3,20,inn)+r(0,9,28,2.5,inn):"");
const triV=(a,b,c)=>r(0,0,9.4,20,a)+r(9.3,0,9.4,20,b)+r(18.6,0,9.4,20,c);
const triH=(a,b,c)=>r(0,0,28,6.7,a)+r(0,6.6,28,6.8,b)+r(0,13.3,28,6.7,c);
const cant=s=>r(0,0,28,20,"#012169")+r(0,0,14,10,"#012169")+r(5.5,0,3,10,"#fff")+r(0,3.5,14,3,"#fff")+r(6.2,0,1.6,10,"#c8102e")+r(0,4.2,14,1.6,"#c8102e")+[[21,5],[24,9],[19,10],[21,15],[7,15]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="1.1" fill="${s}"/>`).join("");
const diag=(a,b,outer,inner)=>`<polygon points="0,0 28,0 0,20" fill="${a}"/><polygon points="28,0 28,20 0,20" fill="${b}"/><line x1="0" y1="20" x2="28" y2="0" stroke="${outer}" stroke-width="5"/><line x1="0" y1="20" x2="28" y2="0" stroke="${inner}" stroke-width="2.4"/>`;
const FLAGS={
 tw:r(0,0,28,20,"#fe0000")+r(0,0,14,10,"#000095")+`<circle cx="7" cy="5" r="2.6" fill="#fff"/>`,
 fi:nord("#fff","#003580"), dk:nord("#c8102e","#fff"), is:nord("#02529c","#fff","#dc1e35"), se:nord("#006aa7","#fecc00"),
 no:nord("#ba0c2f","#fff","#00205b"), nl:triH("#ae1c28","#fff","#21468b"), lu:triH("#ed2939","#fff","#00a1de"),
 cr:r(0,0,28,20,"#002b7f")+r(0,3.3,28,13.4,"#fff")+r(0,6.7,28,6.6,"#ce1126"),
 il:r(0,0,28,20,"#fff")+r(0,2.5,28,2.6,"#0038b8")+r(0,14.9,28,2.6,"#0038b8")+`<path d="M14 6 L17.5 12 L10.5 12Z M14 14 L10.5 8 L17.5 8Z" fill="none" stroke="#0038b8" stroke-width="1"/>`,
 ch:r(0,0,28,20,"#da291c")+r(12,4,4,12,"#fff")+r(8,8,12,4,"#fff"),
 nz:cant("#c8102e"), au:cant("#fff"), mx:triV("#006847","#fff","#ce1126")+`<circle cx="14" cy="10" r="2.6" fill="#8c6b2f"/>`,
 ie:triV("#169b62","#fff","#ff883e"), be:triV("#000","#fdda24","#ef3340"),
 xk:r(0,0,28,20,"#244aa5")+`<path d="M10 11 l3 -3 l4 1 l3 2 l-1 3 l-4 2 l-4 -1z" fill="#d0a650"/>`+[0,1,2,3,4,5].map(k=>`<circle cx="${8+k*2.4}" cy="${6-Math.abs(k-2.5)*.5}" r=".8" fill="#fff"/>`).join(""),
 de:triH("#000","#dd0000","#ffce00"), si:triH("#fff","#005da4","#ed1c24")+r(6,3.5,5,6,"#005da4"),
 at:triH("#c8102e","#fff","#c8102e"), cz:r(0,0,28,10,"#fff")+r(0,10,28,10,"#d7141a")+`<polygon points="0,0 13,10 0,20" fill="#11457e"/>`,
 /* lowest-ranking 10 */
 tz:diag("#1eb53a","#00a3dd","#fcd116","#000"),
 cd:r(0,0,28,20,"#007fff")+`<line x1="0" y1="20" x2="28" y2="0" stroke="#f7d618" stroke-width="5"/><line x1="0" y1="20" x2="28" y2="0" stroke="#ce1021" stroke-width="2.4"/><rect x="3" y="2" width="3" height="3" fill="#f7d618" transform="rotate(45 4.5 3.5)"/>`,
 eg:triH("#ce1126","#fff","#000")+`<circle cx="14" cy="10" r="2.2" fill="#c09300"/>`,
 ye:triH("#ce1126","#fff","#000"),
 lb:r(0,0,28,5,"#ee161f")+r(0,5,28,10,"#fff")+r(0,15,28,5,"#ee161f")+`<circle cx="14" cy="9.5" r="2.6" fill="#00a651"/><rect x="13" y="11.5" width="2" height="2.5" fill="#00a651"/>`,
 bw:r(0,0,28,20,"#75aadb")+r(0,7,28,1,"#fff")+r(0,8,28,4,"#000")+r(0,12,28,1,"#fff"),
 zw:[0,1,2,3,4,5,6].map(i=>r(0,i*20/7,28,20/7,["#006400","#ffd200","#d40000","#000","#d40000","#ffd200","#006400"][i])).join("")+`<polygon points="0,0 0,20 9,10" fill="#fff"/><circle cx="4" cy="10" r="2" fill="#d40000"/><rect x="3.3" y="9" width="1.4" height="2" fill="#000"/>`,
 mw:triH("#000","#ce1126","#007a4d")+`<circle cx="14" cy="3.3" r="2.3" fill="#ce1126"/>`,
 sl:triH("#1eb53a","#fff","#0072c6"),
 af:triV("#000","#ce1126","#007a36"),
};
const flagSVG=code=>`<svg class="flag" viewBox="0 0 28 20">${FLAGS[code]}</svg>`;
