// 背景と小道具（文字は使わない。形には濃いふちどり）
// 座標は 1080×1920 の基準。画面に見えるのはおよそ x=130〜950、y=470〜1920。
const K='#2B2D33';            // ふちどりの色
const sw=(w=6)=>`stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const R=(x,y,w,h,f,o='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${o}/>`;
const G=(tr,s)=>`<g transform="${tr}">${s}</g>`;
const rng=seed=>{let s=seed>>>0||1;return()=>((s=Math.imul(s^s>>>15,1|s)+0x6D2B79F5|0,((s^s>>>7)>>>0)%10000)/10000)};

// ---- 部屋・外 ----
const wall=(c='#F3E9D8')=>R(0,0,1080,1920,c);
const floor=(y=1720,c='#C9A77C',line='#A8865C')=>R(0,y,1080,1920-y,c)+`<path d="M0 ${y} H1080" stroke="${line}" stroke-width="8"/>`;
const skyBg=(top='#BFE3F5',bot='#E9F6FB')=>`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>${R(0,0,1080,1920,'url(#sky)')}`;
function windowFrame(x,y,w,h,o={}){const {sky='#BFE3F5',sun=false,night=false,open=0}=o;
 return R(x,y,w,h,night?'#22305A':sky,sw(8))+(sun?`<circle cx="${x+w*.72}" cy="${y+h*.3}" r="${Math.min(w,h)*.14}" fill="#FFD45C" ${sw(5)}/>`:'')
  +`<path d="M${x+w/2} ${y} V${y+h} M${x} ${y+h/2} H${x+w}" stroke="#F7F3EA" stroke-width="14"/>`+R(x,y,w,h,'none',sw(8))+R(x-14,y+h,w+28,18,'#E9E1D2',sw(5))}
function tree(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-18 0 L-14 -170 L14 -170 L18 0 Z" fill="#8A5A3B" ${sw()}/><circle cx="-50" cy="-210" r="70" fill="#5DAA5A" ${sw()}/><circle cx="50" cy="-220" r="72" fill="#5DAA5A" ${sw()}/><circle cx="0" cy="-280" r="80" fill="#6DBB66" ${sw()}/>`)}
function building(x,y,w,h,c='#D9D2C5',win='#9CC9E3'){let s=R(x,y-h,w,h,c,sw());const cols=Math.max(1,Math.floor(w/70)),rows=Math.max(1,Math.floor(h/90));
 for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)s+=R(x+16+i*(w-24)/cols,y-h+20+j*(h-30)/rows,(w-24)/cols-18,(h-30)/rows-26,win,sw(4));return s}
function house(x,y,s=1,o={}){const {wall:wc='#F2D9B8',roof='#C4553E',door='#8A5A3B'}=o;
 return G(`translate(${x},${y}) scale(${s})`,`<path d="M-130 -150 L0 -260 L130 -150 Z" fill="${roof}" ${sw()}/>`+R(-110,-150,220,150,wc,sw())+R(-30,-90,60,90,door,sw(5))+`<circle cx="18" cy="-44" r="5" fill="${K}"/>`+R(-92,-126,52,44,'#9CC9E3',sw(5))+R(40,-126,52,44,'#9CC9E3',sw(5)))}
const ground=(y=1700,c='#BFC6C9',edge='#9AA3A8')=>R(0,y,1080,1920-y,c)+`<path d="M0 ${y} H1080" stroke="${edge}" stroke-width="10"/>`;

// ---- 家具 ----
function desk(x,y,w,c='#C89B6D'){return R(x,y,w,26,c,sw())+R(x+20,y+26,24,1920-y,'#A97C52',sw(5))+R(x+w-44,y+26,24,1920-y,'#A97C52',sw(5))}
function counter(x,y,w,c='#E2C9A6',top='#B98A5E'){return R(x,y+24,w,1920-y,c,sw())+R(x-10,y,w+20,30,top,sw())}
function shelf(x,y,w,h,n=3,c='#B98A5E'){let s=R(x,y,w,h,'#E8D8BE',sw());for(let i=1;i<=n;i++)s+=R(x,y+h*i/(n+1)-8,w,16,c,sw(4));return s+R(x,y,14,h,c,sw(4))+R(x+w-14,y,14,h,c,sw(4))}
function door(x,y,w,h,o={}){const {c='#B98A5E',open=0}=o;return R(x-10,y-h-10,w+20,h+10,'#8A6A4A',sw())+(open?R(x,y-h,w,h,'#3A3026'):'')+R(x+(open?w*(1-Math.cos(open*1.4)):0),y-h,w*(open?Math.cos(open*1.4):1),h,c,sw())+(open<.6?`<circle cx="${x+w*(open?Math.cos(open*1.4):1)-24}" cy="${y-h/2}" r="10" fill="#E8C35A" ${sw(4)}/>`:'')}

// ---- 小物 ----
function paper(x,y,r=0,s=1){return G(`translate(${x},${y}) rotate(${r}) scale(${s})`,R(-40,-52,80,104,'#FFFFFF',sw(4))+`<path d="M-24 -30 H24 M-24 -12 H24 M-24 6 H14 M-24 24 H20" stroke="#9AA3AD" stroke-width="5" stroke-linecap="round"/>`)}
function paperStack(x,y,n=6){let s='';for(let i=0;i<n;i++)s+=R(x-60,y-i*9-9,120,10,i%2?'#F5F5F2':'#FFFFFF',sw(3));return s}
function banana(x,y,r=0,s=1){return G(`translate(${x},${y}) rotate(${r}) scale(${s})`,`<path d="M-60 -10 Q0 40 60 -14 Q64 -24 56 -24 Q0 16 -52 -22 Z" fill="#FFD94A" ${sw(5)}/><path d="M56 -24 l10 -8" ${sw(8)}/><circle cx="-56" cy="-16" r="4" fill="${K}"/>`)}
function bananaBunch(x,y,s=1,n=5){let b='';for(let i=0;i<n;i++)b+=G(`rotate(${-40+i*80/(n-1)} 0 0)`,`<path d="M0 0 Q-24 -70 -6 -130 Q8 -136 10 -126 Q-6 -70 18 0 Z" fill="#FFD94A" ${sw(5)}/>`);return G(`translate(${x},${y}) scale(${s})`,b+`<rect x="-12" y="-6" width="24" height="26" rx="6" fill="#6E8B3D" ${sw(5)}/>`)}
function bananaPeel(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-8 -6 Q-70 -10 -96 24 Q-60 14 -10 10 Z" fill="#FFD94A" ${sw(5)}/><path d="M8 -6 Q70 -10 96 24 Q60 14 10 10 Z" fill="#FFD94A" ${sw(5)}/><path d="M-6 -10 Q-10 -60 0 -70 Q10 -60 6 -10 Z" fill="#FFE27A" ${sw(5)}/><ellipse cx="0" cy="4" rx="22" ry="14" fill="#FFE9A0" ${sw(5)}/><path d="M0 -70 l-4 -16" ${sw(8)}/>`)}
function box(x,y,w=120,h=100,c='#D9A866'){return R(x,y,w,h,c,sw(5))+`<path d="M${x+w/2-14} ${y} V${y+h*.35} M${x+w/2+14} ${y} V${y+h*.35}" stroke="#B8854A" stroke-width="6"/>`}
// 時計：数字の代わりに12本の目盛り。h=時（0〜12、小数可）、m=分
function clock(x,y,r,h,m){let t='';for(let i=0;i<12;i++){const a=i*Math.PI/6,l=i%3?r*.12:r*.22;t+=`<path d="M${x+Math.sin(a)*(r*.86)} ${y-Math.cos(a)*(r*.86)} L${x+Math.sin(a)*(r*.86-l)} ${y-Math.cos(a)*(r*.86-l)}" stroke="${K}" stroke-width="${i%3?6:10}" stroke-linecap="round"/>`}
 const ha=((h%12)+m/60)*Math.PI/6,ma=m*Math.PI/30;
 return `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" ${sw(10)}/>${t}<path d="M${x} ${y} L${x+Math.sin(ha)*r*.48} ${y-Math.cos(ha)*r*.48}" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M${x} ${y} L${x+Math.sin(ma)*r*.74} ${y-Math.cos(ma)*r*.74}" stroke="#2F6DB5" stroke-width="10" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="12" fill="${K}"/>`}
// 1週間のカレンダー：7つの四角。marks={i:svg}（四角の中心が原点）、today=i（太いわく）
function calendar7(x,y,w,o={}){const {marks={},today=-1,todayK=1,ring=null}=o;const c=w/7,h=c*1.1;let s=R(x-12,y-c*.55,w+24,h+c*.55+12,'#FFFFFF',sw(6))+R(x-12,y-c*.55,w+24,c*.4,'#E46B5B',sw(6))
 +[x+c*1.2,x+w-c*1.2].map(rx=>`<rect x="${rx-6}" y="${y-c*.75}" width="12" height="${c*.4}" rx="6" fill="${K}"/>`).join('');
 for(let i=0;i<7;i++){s+=R(x+i*c+5,y+5,c-10,h-10,i===0?'#FBE3DF':i===6?'#E0ECFA':'#F6F6F2',sw(4));if(marks[i])s+=G(`translate(${x+i*c+c/2},${y+h/2})`,marks[i])}
 if(today>=0){const tx=x+today*c;s+=R(tx-2,y-2,c+4,h+4,'none',`stroke="${K}" stroke-width="${10*todayK}" stroke-linejoin="round"`)}
 return s}
function fireIcon(s=1){return `<g transform="scale(${s})"><path d="M0 34 Q-30 30 -28 2 Q-26 -20 -6 -40 Q-8 -18 6 -12 Q4 -30 16 -38 Q30 -10 28 8 Q26 32 0 34 Z" fill="#F07A2E" ${sw(5)}/><path d="M0 30 Q-14 26 -12 10 Q-8 -2 2 -8 Q4 6 12 10 Q14 26 0 30 Z" fill="#FFD45C"/></g>`}
// 音の波線（点滅しない）。dir=1 右へ、-1 左へ。k=0〜1 の広がり
function soundWaves(x,y,dir=1,k=1,n=3,r0=30,gap=34,sc=1){let s='';for(let i=0;i<n;i++){const r=(r0+gap*i)*sc,op=Math.max(0,Math.min(1,k*n-i));s+=`<path d="M${x+dir*r*Math.cos(.7)} ${y-r*Math.sin(.7)} A${r} ${r} 0 0 ${dir>0?1:0} ${x+dir*r*Math.cos(.7)} ${y+r*Math.sin(.7)}" fill="none" stroke="${K}" stroke-width="${9*sc}" stroke-linecap="round" opacity="${op}"/>`}return s}
// 風の線
function windLines(x,y,k=1,len=180,n=3,dir=1){let s='';for(let i=0;i<n;i++){const yy=y+(i-1)*70,xx=x+dir*k*80+dir*i*20;s+=`<path d="M${xx} ${yy} q${dir*len*.5} -26 ${dir*len} 0 q${dir*30} 16 ${dir*10} 36" fill="none" stroke="#8FB3CC" stroke-width="12" stroke-linecap="round" opacity="${Math.max(0,Math.min(1,k*1.5))}"/>`}return s}
// 吹き出し（絵だけ）。tail=[x,y] しっぽの先
function bubble(x,y,w,h,inner='',tail=null){const t=tail?`<path d="M${x+w*.3} ${y+h-4} L${tail[0]} ${tail[1]} L${x+w*.5} ${y+h-4} Z" fill="#fff" ${sw(6)}/>`:'';
 return t+R(x,y,w,h,'#FFFFFF',`rx="${Math.min(w,h)*.3}" ${sw(6)}`)+(tail?`<path d="M${x+w*.3+6} ${y+h-3} L${x+w*.5-6} ${y+h-3}" stroke="#fff" stroke-width="10"/>`:'')+inner}
// ぐしゃぐしゃの線の吹き出し（早口）
function scribbleBubble(x,y,s=1,seed=1){const r=rng(seed);let d='M-40 0';for(let i=0;i<10;i++)d+=` q${(r()*40-20).toFixed(0)} ${(r()*-40-10).toFixed(0)} ${(14+r()*10).toFixed(0)} ${(r()*30-6).toFixed(0)}`;
 return G(`translate(${x},${y}) scale(${s})`,`<ellipse cx="0" cy="0" rx="90" ry="62" fill="#fff" ${sw(6)}/><path d="M-30 50 L-56 86 L4 58 Z" fill="#fff" ${sw(6)}/><ellipse cx="0" cy="0" rx="86" ry="58" fill="#fff"/><path d="${d}" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round" transform="translate(-30,10)"/>`)}
function cup(x,y,s=1,c='#FFFFFF'){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-34 -50 L34 -50 L28 20 Q0 30 -28 20 Z" fill="${c}" ${sw(5)}/><path d="M34 -36 Q58 -30 50 -6 Q44 6 30 4" fill="none" ${sw(6)}/><ellipse cx="0" cy="-50" rx="34" ry="9" fill="#6B4226" ${sw(4)}/>`)}
function steam(x,y,t,k=1,h=90,o={}){let s='';for(let i=0;i<3;i++){const ph=(t*.8+i/3)%1;s+=`<path d="M${x+(i-1)*22} ${y-ph*h} q-12 -20 0 -40 q12 -20 0 -40" fill="none" stroke="${o.c||'#B9C2CC'}" stroke-width="${o.w||7}" stroke-linecap="round" opacity="${k*Math.sin(ph*Math.PI)}"/>`}return s}
function hatShape(x,y,r=0,s=1){return G(`translate(${x},${y}) rotate(${r}) scale(${s})`,`<ellipse cx="0" cy="0" rx="78" ry="16" fill="#2F4F7A"/><path d="M-48 0 Q-48 -56 0 -56 Q48 -56 48 0 Z" fill="#3F6699"/>`)}
function phone(x,y,s=1,r=0){return G(`translate(${x},${y}) rotate(${r}) scale(${s})`,R(-26,-48,52,96,'#3B4252',`rx="10" ${sw(5)}`)+R(-18,-36,36,62,'#9CC9E3',`rx="4"`)+`<circle cx="0" cy="36" r="5" fill="#9CC9E3"/>`)}
function garbageBag(x,y,s=1,c='#F4F4F4'){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-60 60 Q-80 -10 -40 -50 L-14 -60 L-24 -84 Q0 -96 24 -84 L14 -60 L40 -50 Q80 -10 60 60 Q0 76 -60 60 Z" fill="${c}" ${sw(6)}/><path d="M-30 -20 Q-10 10 -24 40 M24 -28 Q36 6 20 44" stroke="#C9CDD2" stroke-width="5" fill="none"/>`)}

// トラック（横から。運転席は右）。load=荷台の中身のSVG（荷台の左下が原点、幅 w*0.62）
function truck(x,y,s=1,o={}){const {c='#E9EEF2',cab='#4F86C6',load='',w=420}=o;const bw=w*.62;
 return G(`translate(${x},${y}) scale(${s})`,`<g transform="translate(14,-70)">${load}</g>`+R(0,-70,bw,60,c,sw())+`<path d="M${bw+10} -10 V-130 Q${bw+10} -150 ${bw+30} -150 H${w-60} Q${w-30} -150 ${w-14} -100 L${w} -60 V-10 Z" fill="${cab}" ${sw()}/>`
  +`<path d="M${bw+40} -136 H${w-64} Q${w-44} -136 ${w-34} -100 H${bw+40} Z" fill="#CFE6F5" ${sw(5)}/>`+R(-6,-16,w+12,22,'#9AA3A8',sw(5))
  +[60,bw-30,w-70].map(cx=>`<circle cx="${cx}" cy="8" r="34" fill="#3B4252" ${sw(5)}/><circle cx="${cx}" cy="8" r="13" fill="#C9CDD2"/>`).join(''))}
// 屋台の屋根（しま模様）
function awning(x,y,w,n=6,c1='#E46B5B',c2='#FFFFFF'){let s='';const sw2=w/n;for(let i=0;i<n;i++)s+=`<path d="M${x+i*sw2} ${y} H${x+(i+1)*sw2} V${y+70} Q${x+(i+.5)*sw2} ${y+110} ${x+i*sw2} ${y+70} Z" fill="${i%2?c2:c1}" ${sw(5)}/>`;return R(x-10,y-24,w+20,28,'#8A5A3B',sw(5))+s}
function plate(x,y,s=1){return `<ellipse cx="${x}" cy="${y}" rx="${70*s}" ry="${16*s}" fill="#FFFFFF" ${sw(5)}/>`}


// 書類の板（立てた用紙。文字のかわりに四角とけい線）。lines=書いた線（0〜1 の進み具合）
function formBoard(x,y,w=200,h=250,k=0,thick=6){const L=420;
 return R(x,y,w,h,'#FFFFFF',sw(6))+R(x+20,y+24,w-40,30,'none',`stroke="#B9C2CC" stroke-width="4"`)+R(x+20,y+80,w-40,30,'none',`stroke="#B9C2CC" stroke-width="4"`)+R(x+20,y+136,w-40,30,'none',`stroke="#B9C2CC" stroke-width="4"`)
  +(k>0?`<path d="M${x+26} ${y+40} q14 -20 26 0 t26 0 t26 0 t26 0 t26 0 M${x+26} ${y+96} q14 -20 26 0 t26 0 t26 0 t26 0 t26 0 M${x+26} ${y+152} q14 -20 26 0 t26 0 t26 0" fill="none" stroke="${K}" stroke-width="${thick}" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L*(1-k)}"/>`:'')
  +R(x+w/2-40,y+h,80,14,'#8A6A4A',sw(4))}
// ペン（手の向きの座標：x の正の向きが先）
const pen=(len=150,c='#2F6DB5')=>`<path d="M10 -13 H${10+len-28} L${10+len} 0 L${10+len-28} 13 H10 Z" fill="${c}" ${sw(5)}/><path d="M${10+len-28} -13 L${10+len} 0 L${10+len-28} 13 Z" fill="#F2D3A0" ${sw(5)}/><path d="M${10+len-9} -4 L${10+len} 0 L${10+len-9} 4 Z" fill="${K}"/>`;
// 丸太のえんぴつ
const logPencil=()=>`<rect x="-150" y="-34" width="${150+80}" height="68" rx="10" fill="#9B6A3C" ${sw(6)}/><ellipse cx="-150" cy="0" rx="14" ry="34" fill="#E2C08F" ${sw(5)}/><path d="M-138 -10 a10 10 0 1 0 0.1 0" fill="none" stroke="#B88A55" stroke-width="4"/><path d="M-100 -34 q10 34 0 68 M-30 -34 q-8 34 0 68" fill="none" stroke="#7A4E28" stroke-width="5"/><path d="M80 -34 L130 0 L80 34 Z" fill="#F2D3A0" ${sw(6)}/><path d="M112 -12 L130 0 L112 12 Z" fill="${K}"/>`;
function penHolder(x,y,n){let s='';for(let i=0;i<n;i++)s+=`<g transform="translate(${x-16+i*16},${y-40}) rotate(${-8+i*8})"><path d="M0 0 V-70" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M0 0 V-70" stroke="#2F6DB5" stroke-width="9" stroke-linecap="round"/></g>`;return s+`<path d="M${x-34} ${y-50} L${x+34} ${y-50} L${x+28} ${y} L${x-28} ${y} Z" fill="#9CC9E3" ${sw(5)}/>`}


// つり下げの電灯（ゆれる角度 a 度）
function lamp(x,y0,len,a=0){return G(`rotate(${a} ${x} ${y0})`,`<path d="M${x} ${y0} V${y0+len}" stroke="${K}" stroke-width="6"/><path d="M${x-70} ${y0+len+60} Q${x-60} ${y0+len} ${x} ${y0+len} Q${x+60} ${y0+len} ${x+70} ${y0+len+60} Z" fill="#F2C94C" ${sw()}/><ellipse cx="${x}" cy="${y0+len+62}" rx="30" ry="12" fill="#FFF3C4" ${sw(4)}/>`)}
function frame(x,y,w,h,a=0,inner=''){return G(`rotate(${a} ${x+w/2} ${y-20})`,`<path d="M${x+w/2} ${y-30} L${x+20} ${y} M${x+w/2} ${y-30} L${x+w-20} ${y}" stroke="${K}" stroke-width="4"/><circle cx="${x+w/2}" cy="${y-30}" r="6" fill="${K}"/>`+R(x,y,w,h,'#C89B6D',sw())+R(x+14,y+14,w-28,h-28,'#BFE3F5',sw(4))+inner)}
// 机（上の板と4本の脚）。(x,y)=板の左上
function table(x,y,w,h=200,c='#C89B6D'){return R(x+18,y+20,22,h,'#A97C52',sw(5))+R(x+w-40,y+20,22,h,'#A97C52',sw(5))+R(x,y,w,28,c,sw())}


// 指し棒（手の向きの座標：x の正の向きが先）
const pointer=(len=320)=>`<path d="M20 0 L${len} 0" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M20 0 L${len} 0" stroke="#C9A46A" stroke-width="9" stroke-linecap="round"/><circle cx="${len}" cy="0" r="11" fill="#E46B5B" ${sw(4)}/>`;
// ごみ置き場（ネットをかけた箱）
function trashStation(x,y,w=300,h=150){let s=R(x,y-h,w,h,'#9DB7A5',sw());for(let i=1;i<6;i++)s+=`<path d="M${x+i*w/6} ${y-h} V${y}" stroke="#6E8B79" stroke-width="5"/>`;for(let j=1;j<3;j++)s+=`<path d="M${x} ${y-h+j*h/3} H${x+w}" stroke="#6E8B79" stroke-width="5"/>`;return s+R(x-8,y-h-14,w+16,18,'#5E7A68',sw(5))}


// 食べ物いろいろ（中心が原点）
const food={
 apple:(s=1)=>`<g transform="scale(${s})"><circle r="34" fill="#E2483D" ${sw(5)}/><path d="M0 -32 q4 -16 12 -20" ${sw(6)} fill="none"/><path d="M4 -36 q20 -14 28 2 q-16 8 -28 -2Z" fill="#6DBB66" ${sw(4)}/></g>`,
 orange:(s=1)=>`<g transform="scale(${s})"><circle r="34" fill="#F59A2E" ${sw(5)}/><circle cx="-10" cy="-10" r="5" fill="#FFC27A"/></g>`,
 bread:(s=1)=>`<g transform="scale(${s})"><path d="M-70 20 Q-80 -30 -40 -36 Q0 -50 40 -36 Q80 -30 70 20 Z" fill="#D9A15A" ${sw(5)}/><path d="M-36 -24 l12 26 M-6 -30 l12 28 M24 -26 l12 26" stroke="#A8742F" stroke-width="6" stroke-linecap="round"/></g>`,
 carrot:(s=1)=>`<g transform="scale(${s})"><path d="M-14 -40 L14 -40 L2 50 Z" fill="#F08A2E" ${sw(5)}/><path d="M0 -40 l-14 -26 M0 -40 l2 -30 M0 -40 l16 -24" stroke="#4E9A47" stroke-width="8" stroke-linecap="round"/></g>`,
 cabbage:(s=1)=>`<g transform="scale(${s})"><circle r="52" fill="#9ED37D" ${sw(5)}/><path d="M-30 -30 Q0 10 -10 48 M30 -30 Q0 10 10 48" stroke="#6FA853" stroke-width="6" fill="none"/></g>`,
 melon:(s=1)=>`<g transform="scale(${s})"><ellipse rx="66" ry="54" fill="#5DAA5A" ${sw(5)}/><path d="M-40 -40 Q-60 0 -40 40 M0 -54 V54 M40 -40 Q60 0 40 40" stroke="#2F6B32" stroke-width="7" fill="none"/></g>`,
 pine:(s=1)=>`<g transform="scale(${s})"><ellipse cy="16" rx="36" ry="48" fill="#E9B43A" ${sw(5)}/><path d="M-26 -10 L26 40 M26 -10 L-26 40" stroke="#B9852A" stroke-width="5"/><path d="M0 -30 l-24 -40 M0 -30 l0 -50 M0 -30 l24 -40" stroke="#4E9A47" stroke-width="12" stroke-linecap="round"/></g>`,
 milk:(s=1)=>`<g transform="scale(${s})"><path d="M-26 -40 L0 -64 L26 -40 V50 H-26 Z" fill="#F4F6F8" ${sw(5)}/><path d="M-26 -10 H26 V20 H-26 Z" fill="#7FB3E0"/></g>`,
 banana:(s=1)=>bananaBunch(0,30,0.5*s),
};
// 小さなレジ袋
function tinyBag(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-30 -20 Q-34 -50 -14 -50 Q-10 -30 -12 -20 M30 -20 Q34 -50 14 -50 Q10 -30 12 -20" fill="none" ${sw(5)}/><path d="M-34 -20 H34 L28 40 Q0 48 -28 40 Z" fill="#FFFFFF" ${sw(5)}/>`)}


// 体温計（口の位置から右上へのびる）。k=目盛りの進み（0〜1）。太い線と目盛り（数字なし）
function thermometer(x,y,len,ang,k){const ticks=Array.from({length:9},(_,i)=>{const d=50+i*(len-80)/8,big=i===4;return `<path d="M${d} -18 V${big?-40:-30}" stroke="${K}" stroke-width="${big?8:5}" stroke-linecap="round"/>`}).join('');
 return G(`translate(${x},${y}) rotate(${ang})`,R(0,-18,len,36,'#FFFFFF',`rx="18" ${sw(6)}`)+ticks+`<path d="M22 0 H${22+(len-50)*k}" stroke="${K}" stroke-width="16" stroke-linecap="round"/><circle cx="16" cy="0" r="22" fill="#5B6B7A" ${sw(5)}/>`)}
function crossSign(x,y,s=1,c='#3FA66B'){return G(`translate(${x},${y}) scale(${s})`,R(-60,-60,120,120,'#FFFFFF',`rx="18" ${sw(6)}`)+`<path d="M-14 -40 H14 V-14 H40 V14 H14 V40 H-14 V14 H-40 V-14 H-14 Z" fill="${c}" ${sw(4)}/>`)}


// サイレン（柱とスピーカー。音の波線は広がるだけで点滅しない）
function siren(x,y,k,h=420){return R(x-10,y,20,h,'#8C96A0',sw(5))+`<path d="M${x} ${y+40} L${x+40} ${y+10} L${x+40} ${y+90} Z" fill="#E9EEF2" ${sw(5)}/><path d="M${x+40} ${y+10} L${x+110} ${y-30} L${x+110} ${y+130} L${x+40} ${y+90} Z" fill="#F2C94C" ${sw(5)}/>`+soundWaves(x+120,y+50,1,k,4,30,40,1)}
// ねこ
function cat(x,y,s=1,c='#F0A04B'){return G(`translate(${x},${y}) scale(${s})`,`<path d="M40 20 Q90 10 80 -40" fill="none" stroke="${K}" stroke-width="20" stroke-linecap="round"/><path d="M40 20 Q90 10 80 -40" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/><ellipse cx="0" cy="20" rx="56" ry="38" fill="${c}" ${sw(5)}/><path d="M-62 -50 L-58 -86 L-36 -62 M-14 -62 L4 -86 L8 -50" fill="${c}" ${sw(5)}/><circle cx="-28" cy="-34" r="38" fill="${c}" ${sw(5)}/><path d="M-42 -40 q5 -5 10 0 M-22 -40 q5 -5 10 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-30 -24 l-4 4 M-30 -24 l4 4" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`)}
// つえ
function cane(x,y,len=150){return `<path d="M${x} ${y} V${y+len}" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${y} V${y+len}" stroke="#A97C52" stroke-width="6" stroke-linecap="round"/><path d="M${x} ${y} q0 -24 -22 -24" fill="none" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${y} q0 -24 -22 -24" fill="none" stroke="#A97C52" stroke-width="6" stroke-linecap="round"/>`}


// 絵の矢印（説明の吹き出しの中で使う。注目させる印としては使わない）
function arrowR(x,y,w=70){return `<path d="M${x} ${y} H${x+w-18} M${x+w-30} ${y-16} L${x+w} ${y} L${x+w-30} ${y+16}" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`}
function shelfIcon(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,R(-40,-46,80,92,'#E8D8BE',sw(5))+`<path d="M-40 -14 H40 M-40 18 H40" ${sw(5)}/>`+R(-26,-40,24,24,'#D9A866',sw(3)))}
function boxPile(x,y,cols,rows,bw=90,bh=74){let s='';for(let r=0;r<rows;r++)for(let c=0;c<cols-(r%2&&cols>1?0:0);c++)s+=box(x+c*bw+(r%2?bw*.12:0),y-(r+1)*bh,bw-6,bh-4,['#D9A866','#CF9B58','#E0B275'][(r+c)%3]);return s}


// ごみ収集車（横から。右が前、左のうしろに投入口）。文字なし
function garbageTruck(x,y,s=1,o={}){const {c='#E9EEF2',stripe='#3FA66B'}=o;
 return G(`translate(${x},${y}) scale(${s})`,R(0,-200,300,170,c,`rx="16" ${sw()}`)+R(0,-120,300,26,stripe)+R(0,-200,300,170,'none',`rx="16" ${sw()}`)
  +`<path d="M0 -190 Q-60 -150 -60 -60 L-60 -30 L0 -30 Z" fill="#C9D2D9" ${sw()}/><path d="M-50 -140 Q-46 -100 -46 -60 L-8 -60 L-8 -150 Z" fill="#3B4252" ${sw(4)}/>`
  +`<path d="M300 -30 V-150 Q300 -170 320 -170 H380 Q410 -170 420 -120 L430 -80 V-30 Z" fill="${stripe}" ${sw()}/><path d="M330 -156 H376 Q394 -156 402 -116 H330 Z" fill="#CFE6F5" ${sw(4)}/>`
  +R(-66,-36,500,24,'#8C96A0',sw(5))+[50,240,370].map(cx=>`<circle cx="${cx}" cy="0" r="36" fill="#3B4252" ${sw(5)}/><circle cx="${cx}" cy="0" r="14" fill="#C9CDD2"/>`).join(''))}

module.exports={garbageTruck,arrowR,shelfIcon,boxPile,siren,cat,cane,thermometer,crossSign,food,tinyBag,pointer,trashStation,lamp,frame,table,formBoard,pen,logPencil,penHolder,truck,awning,plate,K,sw,R,G,rng,wall,floor,skyBg,windowFrame,tree,building,house,ground,desk,counter,shelf,door,paper,paperStack,banana,bananaBunch,bananaPeel,box,clock,calendar7,fireIcon,soundWaves,windLines,bubble,scribbleBubble,cup,steam,hatShape,phone,garbageBag};
