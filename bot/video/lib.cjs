// ハプニング動画の共通部品（ゴリラ・腕・人・描画）
const {chromium}=require('playwright');const {wild}=require('./gorilla_wild.js');const fs=require('fs');const path=require('path');
const FPS=30;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));const lerp=(a,b,k)=>a+(b-a)*k;
const seq=(t,a,b)=>ease(cl((t-a)/(b-a)));   // a〜b秒で 0→1
const FUR='#2B2D33',HANDC='#3A3D45',LINE='#26282D';

// 毛のある腕の部品（根もとw1→先w2）
function seg(x1,y1,w1,x2,y2,w2){const an=Math.atan2(y2-y1,x2-x1),nx=Math.cos(an+Math.PI/2),ny=Math.sin(an+Math.PI/2);let top='',bot='';
 for(let i=0;i<=9;i++){const k=i/9,x=x1+(x2-x1)*k,y=y1+(y2-y1)*k,w=w1+(w2-w1)*k,f=(i%2?1:0)*11;top+=`L${x+nx*(w+f)} ${y+ny*(w+f)} `;bot=`L${x-nx*(w+f*.6)} ${y-ny*(w+f*.6)} `+bot}
 return `<path d="M${x1+nx*w1} ${y1+ny*w1} ${top}${bot}Z" fill="${FUR}"/><circle cx="${x1}" cy="${y1}" r="${w1}" fill="${FUR}"/><circle cx="${x2}" cy="${y2}" r="${w2}" fill="${FUR}"/>`}
function shoulder(sx,sy){let p='';for(let i=0;i<=16;i++){const t=Math.PI*1.05+Math.PI*0.9*i/16,r=i%2?82:96;p+=(i?'L':'M')+(sx+Math.cos(t)*r)+' '+(sy+Math.sin(t)*r*0.85)}
 return `<ellipse cx="${sx}" cy="${sy}" rx="82" ry="70" fill="${FUR}"/><path d="${p}" fill="${FUR}"/>`}
// 手（手首の位置・向き）。kind: point=人さし指 / grip=にぎる / open=手のひら / thumb=親指を立てる。item: 手に持つ物のSVG（手の向きの座標）
function hand(wx,wy,deg,kind='point',item='',HC=HANDC){
 const palm=`<path d="M-10 -34 Q40 -42 58 -18 Q66 0 58 20 Q40 40 -10 34 Z" fill="${HC}" stroke="${LINE}" stroke-width="3"/>`;
 const thumbS=`<path d="M18 30 Q40 50 56 38" stroke="${LINE}" stroke-width="4" fill="${HC}"/>`;
 const knuck=`<path d="M30 -10 h18 M30 6 h18" stroke="${LINE}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
 let f='';
 if(kind==='point')f=`<path d="M50 -16 Q100 -22 118 -12 Q126 -4 118 4 Q100 10 52 6 Z" fill="${HC}" stroke="${LINE}" stroke-width="3"/><path d="M104 -12 Q116 -10 118 -4 Q116 2 104 2 Z" fill="#6E6670"/>`;
 if(kind==='open')f=[-24,-8,8,24].map(o=>`<path d="M50 ${o-7} Q95 ${o-8} 104 ${o} Q95 ${o+8} 50 ${o+7} Z" fill="${HC}" stroke="${LINE}" stroke-width="3"/>`).join('');
 if(kind==='thumb')f=`<path d="M10 -30 Q4 -90 22 -96 Q40 -92 36 -30 Z" fill="${HC}" stroke="${LINE}" stroke-width="3"/>`;
 if(kind==='two')f=[-22,2].map(o=>`<path d="M48 ${o-8} Q96 ${o-30} 112 ${o-30} Q120 ${o-24} 112 ${o-16} Q96 ${o-12} 50 ${o+8} Z" fill="${HC}" stroke="${LINE}" stroke-width="3" transform="rotate(${o<0?-14:10} 50 ${o})"/>`).join('');
 if(kind==='pinch')f=`<path d="M50 -18 Q92 -30 106 -22 Q112 -14 104 -10 Q90 -10 52 -2 Z" fill="${HC}" stroke="${LINE}" stroke-width="3"/><path d="M40 22 Q90 22 104 12 Q112 18 104 26 Q86 38 40 36 Z" fill="${HC}" stroke="${LINE}" stroke-width="3"/>`;
 return `<g transform="translate(${wx},${wy}) rotate(${deg})">${item&&kind==='grip'?item:''}${palm}${f}${kind==='thumb'||kind==='pinch'?'':thumbS}${knuck}${item&&kind!=='grip'?item:''}</g>`}
// 腕：肩(sx,sy)から目標(tx,ty)へ。reach: 指先と目標の距離。bend: ひじを曲げる向き(1=下 -1=上)
function arm(sx,sy,tx,ty,o={}){const {kind='point',item='',reach=125,U=150,F=140,bend=1,fixDeg=null,color=HANDC}=o;
 const a0=Math.atan2(ty-sy,tx-sx);const wx0=tx-Math.cos(a0)*reach,wy0=ty-Math.sin(a0)*reach;
 const d=Math.max(20,Math.min(Math.hypot(wx0-sx,wy0-sy),U+F-2));const aw=Math.atan2(wy0-sy,wx0-sx);const wx=sx+Math.cos(aw)*d,wy=sy+Math.sin(aw)*d;
 const al=Math.acos(cl((U*U+d*d-F*F)/(2*U*d),-1,1));const e1=[sx+Math.cos(aw+al)*U,sy+Math.sin(aw+al)*U],e2=[sx+Math.cos(aw-al)*U,sy+Math.sin(aw-al)*U];
 const [ex,ey]=(e1[1]>e2[1])===(bend>0)?e1:e2;const deg=fixDeg??Math.atan2(ty-wy,tx-wx)*180/Math.PI;
 return `${shoulder(sx,sy)}${seg(sx,sy,58,ex,ey,42)}${seg(ex,ey,40,wx,wy,30)}${hand(wx,wy,deg,kind,item,color)}`}
// ゴリラ（上半身）。(x,y)=体の中心。o.right / o.left = {tx,ty,kind,item,...} で腕を動かす。なければ下におろす
function down(sx,sy,dir){const an=dir>0?Math.PI*0.47:Math.PI*0.53,x2=sx+Math.cos(an)*230,y2=sy+Math.sin(an)*230;return shoulder(sx,sy)+seg(sx,sy,62,x2,y2,50)}
function gorilla(x,y,o={}){const {m=0,blink=false,nod=0,headRot=0,rot=0,dy=0,s=1,right=null,left=null}=o;
 const body=wild(m,blink,2,{noRightArm:true,noLeftArm:true,headDX:nod*1.4,headRot:headRot+nod*.5,headDY:o.nodY||0,face:o.face,look:o.look,blown:o.blown,wear:o.wear,wet:o.wet,flush:o.flush}).replace('<svg ','<svg x="-260" y="-270" width="520" height="520" ');
 const R=right?arm(175,140,right.tx-x,right.ty-y-dy,right):down(175,140,1);const L=left?arm(-175,140,left.tx-x,left.ty-y-dy,left):down(-175,140,-1);
 // o.mid：体と腕のあいだに描く物（画面の座標で）。両腕でかかえる物などに使う
 const mid=o.mid?`<g transform="scale(${1/s}) rotate(${-rot}) translate(${-x},${-(y+dy)})">${o.mid}</g>`:'';
 return `<g transform="translate(${x},${y+dy}) rotate(${rot}) scale(${s})">${body}${mid}${R}${L}</g>`}
// 人（特定の国や人種に見えないシンプルな形）。face: smile/neutral/shock/happy/worried/dizzy/calm。hand: [x,y]（人の座標系）
// 追加の指定：hand2（画面の右側の腕）、hk/hk2=手の形 'fist'/'thumb'/'open'/'point'、cross（腕組み）、headRot/headDX/headDY（首をかしげる・ふる・うなずく）、
//   hairColor、glasses、headphones、cap（ぼうしの色）、coat（白衣）、steth（聴診器）、blink、look=[dx,dy]、talk=口の開き 0〜1、front（左の腕を顔の前に描く）
function person(x,y,s,o={}){const {shirt='#4F7A66',shirtLine='#2D4A3D',apron=false,hair='short',hat=null,face='smile',shock=1,hand:hd=null,thumb=false,blown=0,sweat=0,skin='#E2B892',skinLine='#7A5638',
  hand2=null,thumb2=false,hk=null,hk2=null,cross=false,headRot=0,headDX=0,hairColor=null,glasses=false,headphones=false,cap=null,coat=false,steth=false,blink=false,look=[0,0],talk=0,front=false,headDY=0}=o;
 const HC=hairColor||{short:'#3B2A22',long:'#4A3324',bun:'#2E2420'}[hair]||'#3B2A22';
 const hairP={short:`<path d="M-66 -72 Q-74 -146 0 -142 Q74 -146 66 -72 Q58 -100 30 -106 Q0 -96 -34 -108 Q-58 -102 -66 -72 Z" fill="${HC}"/>`,
  long:`<path d="M-66 -70 Q-70 -150 0 -140 Q70 -150 66 -70 L70 0 Q50 -20 48 -80 Q0 -112 -48 -80 Q-50 -20 -70 0 Z" fill="${HC}"/>`,
  bun:`<circle cx="0" cy="-148" r="26" fill="${HC}"/><path d="M-64 -84 Q0 -150 64 -84 Q40 -114 0 -112 Q-40 -114 -64 -84 Z" fill="${HC}"/>`,
  none:''}[hair];
 const blownP=blown?`<path d="M-50 -122 q40 -26 96 -18 M-20 -132 q46 -20 104 -6 M10 -134 q40 -10 90 6" stroke="${HC}" stroke-width="13" fill="none" stroke-linecap="round" opacity="${blown}"/>`:'';
 const lx=look[0]*6,ly=look[1]*5;
 const brow=face==='shock'?`<path d="M-36 -104 q14 -10 28 -2 M8 -106 q14 -8 28 2" stroke="${HC}" stroke-width="6" fill="none" stroke-linecap="round"/>`
  :face==='worried'?`<path d="M-36 -92 q14 -4 28 -12 M8 -104 q14 8 28 12" stroke="${HC}" stroke-width="6" fill="none" stroke-linecap="round"/>`
  :`<path d="M-36 -96 q14 -6 28 0 M8 -96 q14 -6 28 0" stroke="${HC}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
 const closed=`<path d="M-30 -78 q8 5 16 0 M14 -78 q8 5 16 0" stroke="#111" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 const eyes=blink&&face!=='shock'?closed:face==='shock'?`<circle cx="-22" cy="-78" r="13" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="22" cy="-78" r="13" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="${-22+lx}" cy="${-78+ly}" r="5" fill="#111"/><circle cx="${22+lx}" cy="${-78+ly}" r="5" fill="#111"/>`
  :face==='happy'?`<path d="M-30 -76 q8 -10 16 0 M14 -76 q8 -10 16 0" stroke="#111" stroke-width="6" fill="none" stroke-linecap="round"/>`
  :face==='neutral'||face==='worried'?`<circle cx="${-22+lx}" cy="${-78+ly}" r="6" fill="#111"/><circle cx="${22+lx}" cy="${-78+ly}" r="6" fill="#111"/>`
  :face==='dizzy'?`<path d="M-22 -78 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6 M22 -78 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>`
  :face==='calm'?closed
  :`<path d="M-30 -80 q8 -8 16 0 M14 -80 q8 -8 16 0" stroke="#111" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 const mouth=talk>0.05&&face!=='shock'?`<ellipse cx="0" cy="-38" rx="${12+talk*6}" ry="${4+talk*12}" fill="#5A1F1F"/>`
  :face==='shock'?`<ellipse cx="0" cy="-32" rx="17" ry="${8+shock*16}" fill="#5A1F1F"/>`:face==='neutral'?`<path d="M-14 -40 h28" stroke="#5A1F1F" stroke-width="6" stroke-linecap="round"/>`
  :face==='worried'?`<path d="M-14 -36 q14 -9 28 0" stroke="#5A1F1F" stroke-width="6" fill="none" stroke-linecap="round"/>`
  :face==='happy'?`<path d="M-24 -46 q24 28 48 0 Z" fill="#5A1F1F"/>`:`<path d="M-20 -42 q20 16 40 0" stroke="#5A1F1F" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 const cheeks=face==='shock'||face==='worried'?'':`<ellipse cx="-38" cy="-58" rx="10" ry="6" fill="#E89C86" opacity=".6"/><ellipse cx="38" cy="-58" rx="10" ry="6" fill="#E89C86" opacity=".6"/>`;
 const sweatP=sweat?`<path d="M70 -120 q12 22 0 30 q-12 -8 0 -30 Z M88 -84 q9 16 0 22 q-9 -6 0 -22 Z" fill="#7CC4F2" stroke="#2B6C99" stroke-width="3" opacity="${sweat}"/><path d="M-80 -135 l-14 -22 M-60 -150 l-6 -24 M60 -150 l6 -24 M80 -135 l14 -22" stroke="#111" stroke-width="6" stroke-linecap="round" opacity="${sweat}"/>`:'';
 // 手の形：fist=にぎる / thumb=親指 / open=手のひら（指を上に）/ point=人さし指（肩から手の向きにのばす）
 const PH=(hx,hy,k,sx)=>{const a=Math.atan2(hy-10,hx-sx);
  if(k==='thumb')return `<circle cx="${hx}" cy="${hy}" r="20" fill="${skin}" stroke="${skinLine}" stroke-width="4"/><rect x="${hx-7}" y="${hy-48}" width="14" height="34" rx="7" fill="${skin}" stroke="${skinLine}" stroke-width="4"/>`;
  if(k==='open')return `<g transform="translate(${hx},${hy})">${[-15,-5,5,15].map((fx,i)=>`<rect x="${fx-5}" y="${-44+(i%3?-4:2)}" width="10" height="30" rx="5" fill="${skin}" stroke="${skinLine}" stroke-width="3.5"/>`).join('')}<path d="M${sx<0?-22:22} -2 l${sx<0?-14:14} -16" stroke="${skinLine}" stroke-width="12" stroke-linecap="round"/><path d="M${sx<0?-22:22} -2 l${sx<0?-14:14} -16" stroke="${skin}" stroke-width="6" stroke-linecap="round"/><rect x="-22" y="-22" width="44" height="40" rx="16" fill="${skin}" stroke="${skinLine}" stroke-width="4"/></g>`;
  if(k==='point'){const fx=hx+Math.cos(a)*38,fy=hy+Math.sin(a)*38;return `<path d="M${hx} ${hy} L${fx} ${fy}" stroke="${skinLine}" stroke-width="16" stroke-linecap="round"/><path d="M${hx} ${hy} L${fx} ${fy}" stroke="${skin}" stroke-width="9" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="18" fill="${skin}" stroke="${skinLine}" stroke-width="4"/>`}
  return `<circle cx="${hx}" cy="${hy}" r="18" fill="${skin}" stroke="${skinLine}" stroke-width="4"/>`};
 const hx=hd?hd[0]:-70,hy=hd?hd[1]:150;
 const armL=`<path d="M-62 10 Q${(hx-62)/2-30} ${(hy+10)/2+20} ${hx} ${hy}" stroke="${shirt}" stroke-width="34" fill="none" stroke-linecap="round"/>${PH(hx,hy,hk||(thumb?'thumb':'fist'),-62)}`;
 const armR=hand2?`<path d="M62 10 Q${(hand2[0]+62)/2+30} ${(hand2[1]+10)/2+20} ${hand2[0]} ${hand2[1]}" stroke="${shirt}" stroke-width="34" fill="none" stroke-linecap="round"/>${PH(hand2[0],hand2[1],hk2||(thumb2?'thumb':'fist'),62)}`:'';
 const armsX=`<path d="M62 14 Q78 96 -34 100" stroke="${shirtLine}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M62 14 Q78 96 -34 100" stroke="${shirt}" stroke-width="32" fill="none" stroke-linecap="round"/><path d="M-62 14 Q-78 80 34 76" stroke="${shirtLine}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M-62 14 Q-78 80 34 76" stroke="${shirt}" stroke-width="32" fill="none" stroke-linecap="round"/><circle cx="-36" cy="100" r="16" fill="${skin}" stroke="${skinLine}" stroke-width="4"/><circle cx="38" cy="76" r="16" fill="${skin}" stroke="${skinLine}" stroke-width="4"/>`;
 const hatP=hat?`<g transform="translate(${hat.dx||0},${hat.dy||0}) rotate(${hat.r||0} 0 -130)"><ellipse cx="0" cy="-122" rx="78" ry="16" fill="#2F4F7A"/><path d="M-48 -122 Q-48 -178 0 -178 Q48 -178 48 -122 Z" fill="#3F6699"/></g>`:'';
 const capP=cap?`<path d="M-62 -100 Q-64 -150 0 -152 Q64 -150 62 -100 Z" fill="${cap}" stroke="#222" stroke-width="4"/><path d="M-70 -100 Q0 -116 70 -100 Q0 -86 -70 -100 Z" fill="${cap}" stroke="#222" stroke-width="4"/>`:'';
 const glassesP=glasses?`<circle cx="-22" cy="-78" r="17" fill="none" stroke="#333" stroke-width="5"/><circle cx="22" cy="-78" r="17" fill="none" stroke="#333" stroke-width="5"/><path d="M-5 -80 h10" stroke="#333" stroke-width="5"/>`:'';
 const phonesP=headphones?`<path d="M-70 -70 Q-74 -158 0 -158 Q74 -158 70 -70" stroke="#2E3440" stroke-width="12" fill="none"/><rect x="-86" y="-96" width="26" height="50" rx="10" fill="#4C6EF5" stroke="#1D2B6B" stroke-width="5"/><rect x="60" y="-96" width="26" height="50" rx="10" fill="#4C6EF5" stroke="#1D2B6B" stroke-width="5"/>`:'';
 const coatP=coat?`<path d="M-30 -10 L0 60 L30 -10" fill="#BFD8EE" stroke="#8AA4BC" stroke-width="4"/><path d="M-30 -10 L-8 110 M30 -10 L8 110" stroke="#C9CFD6" stroke-width="6" fill="none"/><rect x="34" y="70" width="26" height="30" rx="4" fill="none" stroke="#C9CFD6" stroke-width="4"/>`:'';
 const stethP=steth?`<path d="M-34 -6 Q-46 60 -14 92 Q6 108 18 82 M34 -6 Q44 40 26 64" stroke="#3B4252" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="18" cy="84" r="12" fill="#AEB7C2" stroke="#3B4252" stroke-width="5"/>`:'';
 return `<g transform="translate(${x},${y}) scale(${s})">
 <rect x="-72" y="-10" width="144" height="200" rx="32" fill="${shirt}" stroke="${shirtLine}" stroke-width="5"/>${coat?coatP:`<path d="M-30 -10 L0 22 L30 -10" fill="#F6F2EA" stroke="${shirtLine}" stroke-width="4"/>`}${stethP}
 ${apron?`<rect x="-55" y="30" width="110" height="152" rx="12" fill="#F6F2EA"/><path d="M-55 40 L-40 -8 M55 40 L40 -8" stroke="#F6F2EA" stroke-width="10"/><rect x="-28" y="80" width="56" height="34" rx="6" fill="none" stroke="#C9BFAE" stroke-width="4"/>`:''}
 ${cross?armsX:front?armR:armL+armR}
 <g transform="translate(${headDX},${headDY}) rotate(${headRot} 0 -10)">
 <circle cx="62" cy="-70" r="14" fill="${skin}" stroke="${skinLine}" stroke-width="4"/><circle cx="-62" cy="-70" r="14" fill="${skin}" stroke="${skinLine}" stroke-width="4"/>
 <circle cx="0" cy="-70" r="64" fill="${skin}" stroke="${skinLine}" stroke-width="5"/>${hairP}${blownP}
 <path d="M-2 -66 q8 12 0 18" stroke="#B98C66" stroke-width="5" fill="none" stroke-linecap="round"/>${brow}${eyes}${glassesP}${mouth}${cheeks}${sweatP}${capP}${phonesP}${hatP}</g>${front&&!cross?armL:''}</g>`}
// 全体を少し大きくして、主役を画面の下に大きく見せる
const Z=s=>`<g transform="translate(540,1920) scale(1.32) translate(-540,-1920)">${s}</g>`;
const svgWrap=(bg,inner)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${bg}"/>${Z(inner)}</svg>`;
// コマを書き出す。frame(t) は svg 文字列。bgSvg は話す場面の背景（ゴリラなし）
// 確認用：環境変数 PREVIEW="0,1.2,2.5" のときは、その時刻のコマだけを OUT/prev_XX.png に書き出す
async function renderGag(OUT,DUR,frame,bgSvg){fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});await p.setContent('<html><body style="margin:0"><div id="s"></div></body></html>');
 const shot=async(t,file)=>{await p.evaluate(h=>document.getElementById('s').innerHTML=h,frame(t));await p.screenshot({path:file})};
 if(process.env.PREVIEW){for(const f of fs.readdirSync(OUT))if(/^prev_/.test(f))fs.unlinkSync(path.join(OUT,f));const ts=process.env.PREVIEW.split(',').map(Number);for(let i=0;i<ts.length;i++)await shot(ts[i],path.join(OUT,`prev_${String(i).padStart(2,'0')}.png`));
  await p.evaluate(h=>document.getElementById('s').innerHTML=h,bgSvg);await p.screenshot({path:path.join(OUT,'prev_bg.png')});await b.close();return}
 for(let i=0;i<Math.round(DUR*FPS);i++)await shot(i/FPS,path.join(OUT,`g${String(i).padStart(4,'0')}.png`));
 fs.writeFileSync(path.join(OUT,'bg.svg'),bgSvg.replace('</svg>','<rect width="1080" height="1920" fill="#fff" fill-opacity=".72"/></svg>'));await b.close()}
// 手首を (wx,wy) に置きたいときの腕の目標。side=1 右腕 / -1 左腕。gx,gy=ゴリラの位置
function wristAt(gx,gy,wx,wy,side=1,reach=50,s=1){const sx=gx+175*side*s,sy=gy+140*s;const d=Math.hypot(wx-sx,wy-sy)||1;return {tx:wx+(wx-sx)/d*reach,ty:wy+(wy-sy)/d*reach,reach}}
module.exports={wristAt,FPS,ease,cl,lerp,seq,seg,arm,hand,gorilla,person,Z,svgWrap,renderGag,wild};
