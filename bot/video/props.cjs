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
function steam(x,y,t,k=1,h=90){let s='';for(let i=0;i<3;i++){const ph=(t*.8+i/3)%1;s+=`<path d="M${x+(i-1)*22} ${y-ph*h} q-12 -20 0 -40 q12 -20 0 -40" fill="none" stroke="#B9C2CC" stroke-width="7" stroke-linecap="round" opacity="${k*Math.sin(ph*Math.PI)}"/>`}return s}
function hatShape(x,y,r=0,s=1){return G(`translate(${x},${y}) rotate(${r}) scale(${s})`,`<ellipse cx="0" cy="0" rx="78" ry="16" fill="#2F4F7A"/><path d="M-48 0 Q-48 -56 0 -56 Q48 -56 48 0 Z" fill="#3F6699"/>`)}
function phone(x,y,s=1,r=0){return G(`translate(${x},${y}) rotate(${r}) scale(${s})`,R(-26,-48,52,96,'#3B4252',`rx="10" ${sw(5)}`)+R(-18,-36,36,62,'#9CC9E3',`rx="4"`)+`<circle cx="0" cy="36" r="5" fill="#9CC9E3"/>`)}
function garbageBag(x,y,s=1,c='#F4F4F4'){return G(`translate(${x},${y}) scale(${s})`,`<path d="M-60 60 Q-80 -10 -40 -50 L-14 -60 L-24 -84 Q0 -96 24 -84 L14 -60 L40 -50 Q80 -10 60 60 Q0 76 -60 60 Z" fill="${c}" ${sw(6)}/><path d="M-30 -20 Q-10 10 -24 40 M24 -28 Q36 6 20 44" stroke="#C9CDD2" stroke-width="5" fill="none"/>`)}
module.exports={K,sw,R,G,rng,wall,floor,skyBg,windowFrame,tree,building,house,ground,desk,counter,shelf,door,paper,paperStack,banana,bananaBunch,bananaPeel,box,clock,calendar7,fireIcon,soundWaves,windLines,bubble,scribbleBubble,cup,steam,hatShape,phone,garbageBag};
