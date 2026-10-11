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
function scribbleBubble(x,y,s=1,seed=1){const r=rng(seed);let d='M-56 0';for(let i=0;i<8;i++)d+=` q7 ${(r()*36-18).toFixed(0)} 14 ${(r()*10-5).toFixed(0)}`;
 return G(`translate(${x},${y}) scale(${s})`,`<path d="M-30 50 L-56 86 L4 58 Z" fill="#fff" ${sw(6)}/><ellipse cx="0" cy="0" rx="90" ry="62" fill="#fff" ${sw(6)}/><path d="M-26 56 L-4 56" stroke="#fff" stroke-width="10"/><path d="${d}" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`)}
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


// 職場の背景（かべ・ブラインドの窓・観葉植物・床）
function office(o={}){const {wallC='#EAF0F4',floorC='#B9C3CB'}=o;let s=R(0,0,1080,1920,wallC)+R(0,1000,1080,20,'#D5DEE5');
 s+=R(600,600,300,280,'#CFE6F5',sw(7));for(let i=1;i<7;i++)s+=`<path d="M600 ${600+i*40} H900" stroke="#9FB6C7" stroke-width="6"/>`;s+=R(600,600,300,280,'none',sw(7));
 s+=R(150,1260,90,120,'#C98B5A',sw(5))+`<path d="M195 1260 Q150 1160 120 1150 Q170 1170 195 1230 Q190 1120 210 1100 Q215 1180 200 1240 Q240 1160 280 1160 Q230 1190 205 1262 Z" fill="#5DAA5A" ${sw(5)}/>`;
 return s+floor(1740,floorC,'#97A3AD')}


// カード（四角＋線、文字なし）。中心が原点
function card(s=1,r=0){return `<g transform="rotate(${r}) scale(${s})">${R(-70,-44,140,88,'#4F86C6',`rx="12" ${sw(5)}`)}${R(-52,-20,34,26,'#F2C94C',`rx="5" ${sw(3)}`)}<path d="M-52 22 H10 M20 22 H50" stroke="#DCE8F5" stroke-width="7" stroke-linecap="round"/></g>`}
// カード読み取り機（画面と押しボタン）。ok=0〜1 で画面にチェックの形
function cardReader(x,y,s=1,ok=0){let k='';for(let i=0;i<3;i++)for(let j=0;j<3;j++)k+=R(-38+j*28,10+i*24,20,16,'#C9D2D9',`rx="4" ${sw(3)}`);
 return G(`translate(${x},${y}) scale(${s})`,R(-56,-80,112,170,'#3B4252',`rx="16" ${sw(6)}`)+R(-42,-66,84,62,ok>0?'#BFE8C7':'#CFE6F5',`rx="6" ${sw(4)}`)+(ok>0?`<path d="M-22 -36 L-6 -20 L24 -52" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="${ok}"/>`:'')+k)}
function register(x,y){return R(x,y-120,190,120,'#9AA6B2',`rx="12" ${sw(6)}`)+R(x+20,y-104,150,40,'#CFE6F5',sw(4))+R(x+40,y-150,110,34,'#7D8893',sw(5))}


// かばんから出てくる物（中心が原点）
const things={
 umbrella:(s=1)=>`<g transform="scale(${s})"><path d="M-110 0 L80 -10 L96 0 L80 10 Z" fill="#5B7FB0" ${sw(5)}/><path d="M-110 0 q-24 0 -24 22" fill="none" ${sw(10)}/><path d="M-40 -6 L-36 6 M10 -8 L14 8" stroke="#3E5F8A" stroke-width="5"/></g>`,
 book:(s=1)=>`<g transform="scale(${s})">${R(-60,-22,120,44,'#C9746A',`rx="6" ${sw(5)}`)}${R(-60,-22,16,44,'#9E4F46',sw(4))}<path d="M-38 -8 H50 M-38 8 H50" stroke="#F4D6D0" stroke-width="5"/></g>`,
 teddy:(s=1)=>`<g transform="scale(${s})"><circle cx="-34" cy="-40" r="16" fill="#C9935F" ${sw(5)}/><circle cx="34" cy="-40" r="16" fill="#C9935F" ${sw(5)}/><ellipse cx="0" cy="20" rx="44" ry="34" fill="#C9935F" ${sw(5)}/><circle cx="0" cy="-20" r="36" fill="#C9935F" ${sw(5)}/><ellipse cx="0" cy="-10" rx="14" ry="10" fill="#EBC9A0"/><circle cx="-12" cy="-26" r="4" fill="${K}"/><circle cx="12" cy="-26" r="4" fill="${K}"/></g>`,
 bento:(s=1)=>`<g transform="scale(${s})">${R(-62,-28,124,56,'#E46B5B',`rx="10" ${sw(5)}`)}<path d="M-62 -6 H62" ${sw(4)}/><path d="M-10 -40 Q0 -54 10 -40" fill="none" stroke="#F2C94C" stroke-width="10"/><path d="M-70 -30 Q0 -64 70 -30" fill="none" stroke="#F2C94C" stroke-width="10" stroke-linecap="round"/></g>`,
 bottle:(s=1)=>`<g transform="scale(${s}) rotate(90)">${R(-22,-50,44,100,'#9CC9E3',`rx="14" ${sw(5)}`)}${R(-14,-66,28,20,'#3B4252',`rx="5" ${sw(4)}`)}</g>`,
 scarf:(s=1)=>`<g transform="scale(${s})"><path d="M-80 -16 Q0 -30 80 -16 L80 16 Q0 4 -80 16 Z" fill="#F2C94C" ${sw(5)}/><path d="M-40 -22 V12 M0 -24 V10 M40 -22 V12" stroke="#E08A2E" stroke-width="6"/></g>`,
};
// 在留カード（顔写真のわく＋線、文字なし）
function idCard(s=1){return `<g transform="scale(${s})">${R(-80,-50,160,100,'#F4F6F8',`rx="10" ${sw(5)}`)}${R(-66,-36,50,64,'#CFE6F5',sw(4))}<circle cx="-41" cy="-12" r="12" fill="#C9A27E"/><path d="M-60 26 Q-41 6 -22 26" fill="#C9A27E"/><path d="M-4 -24 H62 M-4 -6 H62 M-4 12 H44" stroke="#9AA6B2" stroke-width="6" stroke-linecap="round"/></g>`}
function toteBag(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-40 -40 Q-40 -80 0 -80 Q40 -80 40 -40" fill="none" ${sw(8)}/><path d="M-62 -40 H62 L54 60 H-54 Z" fill="#7FB3A3" ${sw(6)}/>`)}
// はんこ（手の向きの座標：x の正の向きが押す面）
const stamp=()=>`${R(10,-16,90,32,'#A97C52',`rx="10" ${sw(5)}`)}${R(96,-40,40,80,'#C9A27E',`rx="8" ${sw(5)}`)}${R(130,-44,14,88,'#E46B5B',`rx="4" ${sw(4)}`)}`;


// 学校（時計のついた校舎＋校庭＋鉄棒）。(x,y)=校庭の左下
function school(x,y,s=1){let w='';for(let r=0;r<2;r++)for(let c=0;c<6;c++)if(c!==2&&c!==3||r===0)w+=R(30+c*70,-370+r*100,48,64,'#9CC9E3',sw(4));
 return G(`translate(${x},${y}) scale(${s})`,R(0,-430,460,300,'#F1E6CF',sw())+R(170,-540,120,140,'#F1E6CF',sw())+`<path d="M160 -540 L230 -600 L300 -540 Z" fill="#C4553E" ${sw()}/>`
  +clock(230,-480,44,8,0)+w+R(196,-230,68,100,'#8A6A4A',sw(5))+R(-20,-130,500,130,'#E2CDA4',sw(5))
  +`<path d="M40 -10 V-90 M150 -10 V-90" ${sw(10)}/><path d="M40 -76 H150" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M40 -76 H150" stroke="#C9D2D9" stroke-width="4" stroke-linecap="round"/>`
  +`<path d="M300 -10 V-60 M340 -10 V-60 M380 -10 V-60 M420 -10 V-60 M290 -50 H440" stroke="#9AA3A8" stroke-width="6"/>`)}


function beachBall(x,y,s=1,r=0){return G(`translate(${x},${y}) rotate(${r}) scale(${s})`,`<circle r="60" fill="#FFFFFF" ${sw(6)}/><path d="M0 -60 Q-40 0 0 60 Q-80 40 -60 0 Q-70 -40 0 -60 Z" fill="#E46B5B"/><path d="M0 -60 Q40 0 0 60 Q80 40 60 0 Q70 -40 0 -60 Z" fill="#4F86C6"/><path d="M-58 -16 Q0 -30 58 -16 Q0 0 -58 -16 Z" fill="#F2C94C"/><circle r="60" fill="none" ${sw(6)}/><circle r="10" fill="#FFFFFF" ${sw(4)}/>`)}
function sunIcon(s=1){return `<g transform="scale(${s})"><circle r="16" fill="#FFD45C" ${sw(4)}/>${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return `<path d="M${Math.cos(a)*22} ${Math.sin(a)*22} L${Math.cos(a)*32} ${Math.sin(a)*32}" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`}).join('')}</g>`}
// 書類の塔（(x,y)=下の中心、a=かたむき度）
function paperTower(x,y,n=24,a=0,w=120){let s='';for(let i=0;i<n;i++)s+=R(-w/2+((i*37)%11-5),-(i+1)*26,w,24,i%3?'#FFFFFF':'#F2F2EC',`rx="3" ${sw(4)}`);return G(`translate(${x},${y}) rotate(${a})`,s)}


// 電車（横から、止まっている）
function train(x,y,w=900,c='#E9EEF2',line='#3FA66B'){let s=R(x,y-300,w,280,c,`rx="30" ${sw()}`)+R(x,y-150,w,26,line);
 for(let i=0;i<Math.floor(w/170);i++){const wx=x+40+i*170;s+=(i%2?R(wx,y-250,80,180,'#C9D2D9',sw(5))+`<path d="M${wx+40} ${y-250} V${y-70}" ${sw(4)}/>`:R(wx,y-250,110,80,'#9CC9E3',`rx="10" ${sw(5)}`))}
 return s+R(x,y-300,w,280,'none',`rx="30" ${sw()}`)+R(x+20,y-20,w-40,20,'#5B6B7A',sw(4))}
// 止まっている絵の札（電車の絵＋手のひら）
function stopSign(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-60 -150 V-80 M60 -150 V-80" ${sw(6)}/>`+R(-170,-80,340,150,'#2E3440',`rx="16" ${sw(6)}`)
 +R(-150,-56,120,80,'#E9EEF2',`rx="14" ${sw(4)}`)+R(-138,-44,40,26,'#9CC9E3',sw(3))+R(-90,-44,40,26,'#9CC9E3',sw(3))+`<circle cx="-120" cy="30" r="9" fill="#E9EEF2" ${sw(3)}/><circle cx="-60" cy="30" r="9" fill="#E9EEF2" ${sw(3)}/>`
 +`<g transform="translate(90,0)"><circle r="54" fill="#E46B5B" ${sw(5)}/>${[-18,-6,6,18].map((fx,i)=>R(fx-5,-38+(i%3?-4:2),10,30,'#FFFFFF',`rx="5"`)).join('')}${R(-20,-14,40,40,'#FFFFFF','rx="12"')}<path d="M-20 4 l-12 -12" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>`)}
function bench(x,y,w){return R(x,y-90,w,24,'#B98A5E',sw(5))+R(x,y-50,w,24,'#B98A5E',sw(5))+R(x+20,y-30,20,60,'#6B5A4A',sw(4))+R(x+w-40,y-30,20,60,'#6B5A4A',sw(4))}


// トイレの絵（世界共通の男女の形）。中心が原点
function toiletPicto(s=1,c='#2B2D33'){return `<g transform="scale(${s})"><circle cx="-34" cy="-40" r="12" fill="${c}"/><path d="M-50 -24 H-18 V12 H-24 V42 H-44 V12 H-50 Z" fill="${c}"/><path d="M0 -50 V50" stroke="${c}" stroke-width="4"/><circle cx="34" cy="-40" r="12" fill="${c}"/><path d="M34 -26 L56 18 H44 V42 H24 V18 H12 Z" fill="${c}"/></g>`}
// 案内の札（トイレの絵＋矢印）。a=矢印の向き（度、0=右）
function guideSign(x,y,a,s=1){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-80 -110 V-60 M80 -110 V-60" ${sw(6)}/>`+R(-140,-60,280,120,'#2F6DB5',`rx="14" ${sw(6)}`)+R(-128,-48,120,96,'#FFFFFF',`rx="10"`)
 +`<g transform="translate(-68,0)">${toiletPicto(0.85)}</g><g transform="translate(70,0) rotate(${a})"><path d="M-36 0 H22 M6 -20 L30 0 L6 20" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>`)}


// ゴリラの足（画面の下から出る脚と足）。(x,y)=かかと。bandage=親指に包帯
function gFoot(x,y,s=1,o={}){const {bandage=false,lift=0}=o;const F='#2B2D33',SK='#5B5660';
 return G(`translate(${x},${y}) scale(${s}) rotate(${-lift})`,`<path d="M-60 400 Q-70 120 -40 10 L50 0 Q60 120 70 400 Z" fill="${F}"/>`
  +`<path d="M-50 -10 Q-60 -40 -20 -50 L120 -60 Q170 -58 170 -20 Q168 10 130 14 L-40 20 Q-62 14 -50 -10 Z" fill="${SK}" ${sw(5)}/>`
  +[0,1,2,3].map(i=>`<ellipse cx="${116-i*30}" cy="${-56+i*2}" rx="15" ry="13" fill="${SK}" ${sw(4)}/>`).join('')
  +`<ellipse cx="160" cy="-34" rx="${bandage?30:22}" ry="${bandage?26:20}" fill="${bandage?'#FFFFFF':SK}" ${sw(5)}/>`
  +(bandage?`<path d="M140 -48 L176 -20 M146 -16 L180 -42 M134 -34 H186" stroke="#C9D2D9" stroke-width="5"/>`:''))}
function chair(x,y,s=1,c='#C89B6D'){return G(`translate(${x},${y}) scale(${s})`,R(-60,-260,20,260,c,sw(5))+R(-60,-130,140,22,c,sw(5))+R(60,-108,20,108,c,sw(5))+R(-46,-108,20,108,c,sw(5))+R(-60,-260,100,20,c,sw(5)))}
function stool(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,`<ellipse cx="0" cy="0" rx="120" ry="26" fill="#7FB3A3" ${sw(5)}/>`+R(-90,0,18,200,'#9AA6B2',sw(4))+R(72,0,18,200,'#9AA6B2',sw(4)))}
function bump(x,y,k){if(k<=0||k>=1)return '';let d='';for(let i=0;i<8;i++){const a=i*Math.PI/4,r1=14,r2=36+18*Math.sin(k*Math.PI);d+=`M${x+Math.cos(a)*r1} ${y+Math.sin(a)*r1} L${x+Math.cos(a)*r2} ${y+Math.sin(a)*r2} `}return `<path d="${d}" stroke="#E08A2E" stroke-width="9" stroke-linecap="round" opacity="${Math.sin(k*Math.PI)}"/>`}


// 大きな電話のボタン（0〜9）。pressed={'1':k,...} 押しこみ 0〜1。disp=画面の数字
const KEYS=['1','2','3','4','5','6','7','8','9','*','0','#'];
function keypad(x,y,o={}){const {pressed={},disp='',bw=96,bh=78}=o;let s=R(x-30,y-140,bw*3+60,bh*4+190,'#E9EEF2',`rx="30" ${sw(6)}`)+R(x,y-110,bw*3,80,'#CFE6F5',`rx="12" ${sw(5)}`)
 +`<text x="${x+bw*1.5}" y="${y-48}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="56" fill="${K}" letter-spacing="10">${disp}</text>`;
 KEYS.forEach((k,i)=>{const c=i%3,r=Math.floor(i/3),p=pressed[k]||0,bx=x+c*bw,by=y+r*bh;
  s+=R(bx+6,by+10,bw-12,bh-12,'#9AA6B2',`rx="14"`)+R(bx+6,by+4+p*6,bw-12,bh-12,p>0.5?'#C9D2D9':'#FFFFFF',`rx="14" ${sw(5)}`)
   +`<text x="${bx+bw/2}" y="${by+bh/2+16+p*6}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="44" fill="${K}">${k}</text>`});
 return s}
const keyPos=(x,y,k,bw=96,bh=78)=>{const i=KEYS.indexOf(k);return [x+(i%3)*bw+bw/2,y+Math.floor(i/3)*bh+bh/2]};
function toaster(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,R(-80,-110,160,110,'#C9D2D9',`rx="26" ${sw(6)}`)+R(-56,-122,40,18,'#3B4252',`rx="6"`)+R(16,-122,40,18,'#3B4252',`rx="6"`)+R(84,-70,18,30,'#3B4252',`rx="5" ${sw(4)}`))}
function smoke(x,y,t,k=1){let s='';for(let i=0;i<4;i++){const ph=(t*0.5+i/4)%1;s+=`<circle cx="${x+Math.sin(ph*6+i)*24}" cy="${y-ph*260}" r="${20+ph*46}" fill="#9AA3AD" opacity="${k*0.75*Math.sin(ph*Math.PI)}"/>`}return s}
// 消防車（文字なし）。右向き
function fireTruck(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,R(0,-150,330,120,'#D9483B',`rx="12" ${sw()}`)+`<path d="M330 -30 V-130 Q330 -150 350 -150 H400 Q430 -150 440 -100 L450 -60 V-30 Z" fill="#D9483B" ${sw()}/>`+R(350,-136,60,46,'#CFE6F5',sw(4))
 +`<path d="M20 -170 L300 -190 M20 -150 L300 -170" ${sw(6)}/>`+[60,100,140,180,220,260].map(px=>`<path d="M${px} -${158+(px/280)*20} V-${150+(px/280)*20}" ${sw(4)}/>`).join('')+R(-6,-36,460,20,'#8C96A0',sw(4))+[70,250,380].map(cx=>`<circle cx="${cx}" cy="0" r="30" fill="#3B4252" ${sw(5)}/>`).join(''))}


// 流し台（台に組みこんだ流し＋じゃ口）。(x,y)=台の左上
function sink(x,y,w=280){return R(x,y,w,30,'#C9D2D9',sw(5))+`<path d="M${x+40} ${y+4} H${x+w-40} L${x+w-60} ${y+70} H${x+60} Z" fill="#9AA6B2" ${sw(5)}/>`
 +`<path d="M${x+w/2} ${y} V${y-90} Q${x+w/2} ${y-120} ${x+w/2+40} ${y-120} H${x+w/2+70} V${y-96}" fill="none" stroke="${K}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x+w/2} ${y} V${y-90} Q${x+w/2} ${y-120} ${x+w/2+40} ${y-120} H${x+w/2+70} V${y-96}" fill="none" stroke="#C9D2D9" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`}
// 泡（たくさんの丸）。k=0〜1 で広がる。avoid=[[x,y,r],...] は顔のまわりを空ける
function foam(cx,cy,k,avoid=[],seed=3){const r=rng(seed);let s='';const RR=1400*k;const B=[];
 for(let i=0;i<620;i++){const a=r()*Math.PI*2,d=Math.sqrt(r())*1400,x=cx+Math.cos(a)*d*0.85,y=cy+Math.sin(a)*d*1.15,rad=40+r()*48;B.push([d,x,y,rad])}
 B.sort((p,q)=>q[0]-p[0]);
 for(const [d,x,y,rad] of B){if(d>RR)continue;if(avoid.some(([ax,ay,ar])=>Math.hypot(x-ax,y-ay)<ar+rad*0.5))continue;if(y>2050||y<380)continue;
  const g=Math.min(1,(RR-d)/120);
  s+=`<circle cx="${x}" cy="${y}" r="${rad*g}" fill="#FFFFFF" stroke="#9FC4DC" stroke-width="5"/><circle cx="${x-rad*.3*g}" cy="${y-rad*.3*g}" r="${rad*.18*g}" fill="#DCEFFA"/>`}return s}


// 夜空（月と星。点滅しない）
function nightSky(){let s=`<defs><linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B2547"/><stop offset="1" stop-color="#34407A"/></linearGradient></defs>`+R(0,0,1080,1920,'url(#nsky)');
 const r=rng(5);for(let i=0;i<26;i++){const x=r()*1080,y=480+r()*700,k=6+r()*8;s+=`<path d="M${x} ${y-k} L${x+k*.3} ${y-k*.3} L${x+k} ${y} L${x+k*.3} ${y+k*.3} L${x} ${y+k} L${x-k*.3} ${y+k*.3} L${x-k} ${y} L${x-k*.3} ${y-k*.3} Z" fill="#FFF3B0"/>`}
 return s+`<circle cx="760" cy="640" r="70" fill="#FFF3B0"/><circle cx="790" cy="620" r="62" fill="#2A3563"/>`}
// オウム（右向き=1 / 左向き=-1）。open=くちばしの開き 0〜1
function parrot(x,y,s=1,open=0,dir=-1){const o=open*0.6;return G(`translate(${x},${y}) scale(${s*dir*-1},${s})`,
 `<path d="M10 60 L40 170 L70 150 Z" fill="#3E8E4E" ${sw(5)}/><ellipse cx="0" cy="40" rx="56" ry="78" fill="#4CAF62" ${sw(5)}/><path d="M-20 10 Q-60 60 -30 110 Q0 80 -20 10 Z" fill="#3E8E4E"/>`
 +`<circle cx="-10" cy="-50" r="50" fill="#E9573F" ${sw(5)}/><path d="M-30 -96 Q-20 -130 0 -120 Q-4 -104 -14 -98" fill="#E9573F" ${sw(4)}/>`
 +`<circle cx="-24" cy="-60" r="11" fill="#FFFFFF" ${sw(4)}/><circle cx="-26" cy="-60" r="5" fill="${K}"/>`
 +`<g transform="translate(-52,-40)"><path d="M0 -14 Q-40 -16 -46 ${10} Q-30 ${-2+o*10} 0 ${-2}" fill="#F2C94C" ${sw(4)} transform="rotate(${-o*25})"/><path d="M0 4 Q-30 ${8} -34 ${22} Q-14 ${22} 0 14" fill="#E0B23A" ${sw(4)} transform="rotate(${o*30})"/></g>`
 +`<path d="M-40 160 H40" stroke="#8A5A3B" stroke-width="14" stroke-linecap="round"/>`)}
const nightcap=(x,y,s=1,r=0)=>G(`translate(${x},${y}) rotate(${r}) scale(${s})`,`<path d="M-120 20 Q-40 -150 120 -60 Q60 -10 120 20 Z" fill="#7FA7D6" ${sw(6)}/><path d="M-130 20 Q0 -10 130 20 Q0 50 -130 20 Z" fill="#FFFFFF" ${sw(6)}/><circle cx="130" cy="-62" r="26" fill="#FFFFFF" ${sw(5)}/>`);


// 温水洗浄便座の操作パネル（ボタンは絵の記号だけ）。pressed=押しているボタンの番号
function washletPanel(x,y,pressed=-1,s=1){const icons=[
 `<rect x="-14" y="-14" width="28" height="28" rx="4" fill="#E46B5B"/>`,
 `<path d="M0 -18 Q14 0 0 14 Q-14 0 0 -18 Z" fill="#4F86C6"/><path d="M-14 16 Q0 24 14 16" fill="none" stroke="#4F86C6" stroke-width="4"/>`,
 `<path d="M-14 12 L-6 -12 M0 12 L0 -16 M14 12 L6 -12" stroke="#4F86C6" stroke-width="5" stroke-linecap="round"/>`,
 `<path d="M-16 -8 q8 -8 16 0 t16 0 M-16 6 q8 -8 16 0 t16 0" fill="none" stroke="#5B6B7A" stroke-width="5" stroke-linecap="round"/>`,
 `<path d="M-12 0 H12 M0 -12 V12" stroke="#2B2D33" stroke-width="6" stroke-linecap="round"/>`,
 `<path d="M-12 0 H12" stroke="#2B2D33" stroke-width="6" stroke-linecap="round"/>`,
 `<path d="M-6 10 V-14 L12 -18 V6" fill="none" stroke="#2B2D33" stroke-width="5"/><circle cx="-10" cy="10" r="6" fill="#2B2D33"/><circle cx="8" cy="6" r="6" fill="#2B2D33"/>`,
 `<path d="M-8 -12 A16 16 0 1 0 8 -12" fill="none" stroke="#2B2D33" stroke-width="5" stroke-linecap="round"/><path d="M0 -18 V0" stroke="#2B2D33" stroke-width="5" stroke-linecap="round"/>`];
 let b='';icons.forEach((ic,i)=>{const bx=-60+(i%2)*120,by=-150+Math.floor(i/2)*86,p=i===pressed?6:0;b+=R(bx-46,by-34+p,92,68,i===pressed?'#DCE8F5':'#FFFFFF',`rx="14" ${sw(5)}`)+`<g transform="translate(${bx},${by+p})">${ic}</g>`});
 return G(`translate(${x},${y}) scale(${s})`,R(-130,-210,260,400,'#F4F6F8',`rx="30" ${sw(6)}`)+b)}
// 水の線（下から顔へ）
function waterJet(x1,y1,x2,y2,k=1){const mx=(x1+x2)/2+80,my=Math.min(y1,y2)-120;return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="#2C6E99" stroke-width="30" stroke-linecap="round" opacity="${k}"/><path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="#8FD0F5" stroke-width="18" stroke-linecap="round" opacity="${k}"/>`}
function splash(x,y,k){if(k<=0)return '';let s='';for(let i=0;i<9;i++){const a=-Math.PI*(0.1+0.8*i/8),d=30+70*k;s+=`<path d="M${x+Math.cos(a)*d} ${y+Math.sin(a)*d} q8 14 0 20 q-8 -6 0 -20 Z" fill="#8FD0F5" stroke="#2C6E99" stroke-width="3" opacity="${1-k*0.5}"/>`}return s}


function grape(x,y,r=26){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#7A4FA8" ${sw(5)}/><ellipse cx="${x-r*.35}" cy="${y-r*.4}" rx="${r*.3}" ry="${r*.2}" fill="#D8C4F0"/><path d="M${x} ${y-r} q4 -14 12 -18" fill="none" stroke="#5E7A3B" stroke-width="6" stroke-linecap="round"/>`}
function grapeBunch(x,y,s=1){let g='';[[0,0],[-30,-4],[30,-4],[-15,24],[15,24],[0,48],[-44,-30],[0,-30],[44,-30]].forEach(([dx,dy])=>g+=grape(dx,-dy,22));return G(`translate(${x},${y}) scale(${s})`,g)}
function sparkle(x,y,k=10){return `<path d="M${x} ${y-k} L${x+k*.25} ${y-k*.25} L${x+k} ${y} L${x+k*.25} ${y+k*.25} L${x} ${y+k} L${x-k*.25} ${y+k*.25} L${x-k} ${y} L${x-k*.25} ${y-k*.25} Z" fill="#FFF3B0" stroke="${K}" stroke-width="3"/>`}
// コインの山（(x,y)=いちばん下、n枚）
function coinStack(x,y,n,w=110,h=16){let s='';for(let i=0;i<n;i++){const yy=y-i*h;s+=`<path d="M${x-w/2} ${yy-h} V${yy} A${w/2} ${h*0.6} 0 0 0 ${x+w/2} ${yy} V${yy-h}" fill="#D9A83A" stroke="${K}" stroke-width="4"/>`}
 if(n>0)s+=`<ellipse cx="${x}" cy="${y-n*h}" rx="${w/2}" ry="${h*0.6}" fill="#F2C94C" stroke="${K}" stroke-width="4"/><ellipse cx="${x}" cy="${y-n*h}" rx="${w/4}" ry="${h*0.3}" fill="none" stroke="#B88A2A" stroke-width="3"/>`;return s}


// 雨（ななめの線。少しずつ下へ動く。点滅しない）
function rain(t,k=1){const r=rng(9);let s='';for(let i=0;i<70;i++){const x=r()*1200-60,y0=r()*1920,y=(y0+t*900)%1920;s+=`<path d="M${x} ${y} l-18 46" stroke="#5B7FB0" stroke-width="6" stroke-linecap="round" opacity="${0.55*k}"/>`}return s}
// 開いたかさ（手の向きの座標ではなく、画面の座標。(x,y)=持ち手の下）
function umbrellaOpen(x,y,s=1,c='#E46B5B'){return G(`translate(${x},${y}) scale(${s})`,`<path d="M0 0 V-170" ${sw(8)}/><path d="M0 0 q0 20 -18 20" fill="none" ${sw(8)}/><path d="M-120 -150 Q0 -260 120 -150 Q90 -168 60 -150 Q30 -168 0 -150 Q-30 -168 -60 -150 Q-90 -168 -120 -150 Z" fill="${c}" ${sw(6)}/>`)}


// おみやげの箱（リボン）。中心が原点
function gift(s=1){return `<g transform="scale(${s})">${R(-60,-44,120,88,'#E9EEF2',`rx="8" ${sw(5)}`)}${R(-12,-44,24,88,'#E46B5B')}${R(-60,-10,120,20,'#E46B5B')}<path d="M0 -44 q-30 -30 -40 -4 q20 6 40 4 q30 -30 40 -4 q-20 6 -40 4" fill="#E46B5B" ${sw(4)}/>${R(-60,-44,120,88,'none',`rx="8" ${sw(5)}`)}</g>`}


// カメラ（形だけ。フラッシュは光らせない）。中心が原点
function camera(s=1){return `<g transform="scale(${s})">${R(-60,-38,120,80,'#3B4252',`rx="12" ${sw(5)}`)}${R(-40,-52,36,18,'#3B4252',`rx="4" ${sw(4)}`)}<circle cx="6" cy="2" r="26" fill="#9CC9E3" ${sw(5)}/><circle cx="6" cy="2" r="12" fill="#2B2D33"/></g>`}
function croissant(x,y,s=1){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-60 10 Q-40 -40 0 -40 Q40 -40 60 10 Q30 -6 0 -4 Q-30 -6 -60 10 Z" fill="#E0A85A" ${sw(5)}/><path d="M-30 -30 l8 22 M0 -38 v30 M30 -30 l-8 22" stroke="#B87A32" stroke-width="5"/>`)}


// ぐるぐるの線（こまっている）
function swirl(x,y,a=0,s=1){let d='';for(let i=0;i<=40;i++){const th=i*0.45,r=4+i*1.3;d+=(i?'L':'M')+(Math.cos(th)*r).toFixed(1)+' '+(Math.sin(th)*r*0.7).toFixed(1)+' '}return G(`translate(${x},${y}) rotate(${a}) scale(${s})`,`<path d="${d}" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`)}
// タブレット（画面に中身 inner を描く。中心が原点）
function tablet(s=1,inner=''){return `<g transform="scale(${s})">${R(-130,-90,260,180,'#2E3440',`rx="18" ${sw(6)}`)}${R(-112,-74,224,148,'#DCEFFA',`rx="8"`)}<clipPath id="tab"><rect x="-112" y="-74" width="224" height="148" rx="8"/></clipPath><g clip-path="url(#tab)">${inner}</g><circle cx="118" cy="0" r="5" fill="#9AA6B2"/></g>`}


// 強い日ざしの太陽（光の線は動かない）
function bigSun(x,y,r=90){let s='';for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=`<path d="M${x+Math.cos(a)*(r+18)} ${y+Math.sin(a)*(r+18)} L${x+Math.cos(a)*(r+58)} ${y+Math.sin(a)*(r+58)}" stroke="#F2A93B" stroke-width="14" stroke-linecap="round"/>`}return s+`<circle cx="${x}" cy="${y}" r="${r}" fill="#FFD45C" ${sw(6)}/>`}
// ゆらゆらした熱の線
function heatLines(t,y0=1700){let s='';for(let i=0;i<6;i++){const x=120+i*170,ph=t*2+i;let d=`M${x} ${y0}`;for(let k=1;k<=6;k++)d+=` Q${x+(k%2?18:-18)} ${y0-k*40+20} ${x} ${y0-k*40}`;s+=`<path d="${d}" fill="none" stroke="#E89A5A" stroke-width="6" stroke-linecap="round" opacity="${0.35+0.25*Math.sin(ph)}" transform="translate(0,${-((t*30+i*20)%40)})"/>`}return s}
// 水のボトル（手の向きの座標。x の正の向きが口）。k=残りの水 0〜1
function waterBottle(k=1){return `${R(10,-30,150,60,'#E6F4FB',`rx="22" ${sw(5)}`)}${R(14+136*(1-k),-26,136*k,52,'#7CC4F2',`rx="18"`)}${R(160,-18,26,36,'#3FA66B',`rx="6" ${sw(4)}`)}${R(10,-30,150,60,'none',`rx="22" ${sw(5)}`)}`}


// シャワー（かべのじゃ口と管とシャワーヘッド）。on=水の線 0〜1
function shower(x,y,on){let s=`<path d="M${x+260} ${y+600} V${y+40} Q${x+260} ${y} ${x+220} ${y} H${x+80}" fill="none" stroke="${K}" stroke-width="22" stroke-linecap="round"/><path d="M${x+260} ${y+600} V${y+40} Q${x+260} ${y} ${x+220} ${y} H${x+80}" fill="none" stroke="#C9D2D9" stroke-width="12" stroke-linecap="round"/>`
 +`<path d="M${x+100} ${y-10} L${x-10} ${y+30} L${x+10} ${y+70} L${x+110} ${y+20} Z" fill="#C9D2D9" ${sw(5)}/>`+`<circle cx="${x+260}" cy="${y+620}" r="26" fill="#C9D2D9" ${sw(5)}/>`;
 if(on>0)for(let i=0;i<7;i++){const sx=x-4+i*16,len=300*on;s+=`<path d="M${sx} ${y+60} L${sx-30-i*6} ${y+60+len}" stroke="#7CC4F2" stroke-width="7" stroke-linecap="round" stroke-dasharray="26 18"/>`}
 return s}
// 頭の上の泡の山（(x,y)=頭のてっぺん、h=高さ）
function foamHead(x,y,h,seed=8){const r=rng(seed);let s='';const n=Math.floor(10+h/12);for(let i=0;i<n;i++){const k=r(),yy=y-k*h,w=lerpN(170,60,k),xx=x+(r()*2-1)*w,rad=26+r()*30;
 s+=`<circle cx="${xx}" cy="${yy}" r="${rad}" fill="#FFFFFF" stroke="#9FC4DC" stroke-width="5"/><circle cx="${xx-rad*.3}" cy="${yy-rad*.3}" r="${rad*.18}" fill="#DCEFFA"/>`}return s}
const lerpN=(a,b,k)=>a+(b-a)*k;

module.exports={shower,foamHead,bigSun,heatLines,waterBottle,swirl,tablet,camera,croissant,gift,rain,umbrellaOpen,grape,grapeBunch,sparkle,coinStack,washletPanel,waterJet,splash,nightSky,parrot,nightcap,sink,foam,keypad,keyPos,toaster,smoke,fireTruck,gFoot,chair,stool,bump,toiletPicto,guideSign,train,stopSign,bench,beachBall,sunIcon,paperTower,school,things,idCard,toteBag,stamp,card,cardReader,register,office,garbageTruck,arrowR,shelfIcon,boxPile,siren,cat,cane,thermometer,crossSign,food,tinyBag,pointer,trashStation,lamp,frame,table,formBoard,pen,logPencil,penHolder,truck,awning,plate,K,sw,R,G,rng,wall,floor,skyBg,windowFrame,tree,building,house,ground,desk,counter,shelf,door,paper,paperStack,banana,bananaBunch,bananaPeel,box,clock,calendar7,fireIcon,soundWaves,windLines,bubble,scribbleBubble,cup,steam,hatShape,phone,garbageBag};
