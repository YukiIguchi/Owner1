// ゴリラの胴体と頭（腕は lib.cjs の arm() が描く）
// wild(m, blink, size, o) → <svg> 文字列。座標はゴリラの体の中心(0,0)が基準。
// 表示は lib.cjs が x=-260 y=-270 width=520 height=520 で置く（viewBox と同じ大きさ）。
//   m      : 口の開き 0〜1
//   blink  : true で目を閉じる
//   o.headDX / o.headRot / o.headDY : 頭だけ横・下に動かす・かたむける（首ふり・うなずき）
//   o.face : 'normal' / 'happy'（にっこり）/ 'shock'（目を丸く）/ 'worried'（こまり顔）/ 'calm'（おだやか）/ 'sleep'（ねむる）/ 'dizzy'
//   o.look : [dx,dy] 黒目の向き（-1〜1）
//   o.blown: 0〜1 頭の毛が風で後ろ（画面の左）になびく
//   o.wear : 'pajama' / 'apron' / 'tie' / 'vest' 服
//   o.wet  : 0〜1 顔がぬれている（しずく）
//   o.flush: 0〜1 ほおが赤い（熱）
const FUR='#2B2D33',FUR2='#3A3D46',FURD='#1C1D22',SKIN='#77717C',SKIN2='#938C97',SKINL='#4B4650',LINE='#1A1B1F';

// 毛のふちのギザギザ（中心(cx,cy)、半径rx,ry、角度a0〜a1 度）
function furArc(cx,cy,rx,ry,a0,a1,n,amp){let d='';for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*Math.PI/180,r=i%2?1:1+amp;d+=(i?'L':'M')+(cx+Math.cos(a)*rx*r).toFixed(1)+' '+(cy+Math.sin(a)*ry*r).toFixed(1)+' '}return d}

function torso(wear){
 // 胴体：肩幅が広く、下に向かって丸い（画面の下にはみ出る）
 const body=`<path d="M-120 -30 Q-215 -10 -238 90 Q-262 230 -232 360 Q-180 470 0 478 Q180 470 232 360 Q262 230 238 90 Q215 -10 120 -30 Z" fill="${FUR}"/>`
;
 // 胸（少し明るい色の大きな胸板）
 let chest=`<path d="M-128 70 Q-70 40 -6 74 Q-10 150 -60 176 Q-118 186 -150 150 Q-160 100 -128 70 Z" fill="${FUR2}"/>`
  +`<path d="M128 70 Q70 40 6 74 Q10 150 60 176 Q118 186 150 150 Q160 100 128 70 Z" fill="${FUR2}"/>`
  +`<path d="M-120 196 Q0 240 120 196 Q110 300 0 318 Q-110 300 -120 196 Z" fill="${FUR2}" opacity=".7"/>`;
 if(wear==='pajama'){
  const st=[-150,-90,-30,30,90,150].map(x=>`<path d="M${x} 0 L${x*1.06} 480" stroke="#7FA7D6" stroke-width="22" opacity=".9"/>`).join('');
  chest=`<path d="M-200 30 Q-230 120 -228 360 Q-180 466 0 474 Q180 466 228 360 Q230 120 200 30 Q120 -6 60 4 L0 70 L-60 4 Q-120 -6 -200 30 Z" fill="#CFE0F5" stroke="#3E5F8A" stroke-width="6"/>`
   +`<clipPath id="pj"><path d="M-200 30 Q-230 120 -228 360 Q-180 466 0 474 Q180 466 228 360 Q230 120 200 30 Q120 -6 60 4 L0 70 L-60 4 Q-120 -6 -200 30 Z"/></clipPath><g clip-path="url(#pj)">${st}</g>`
   +`<path d="M-60 4 L0 70 L60 4" fill="none" stroke="#3E5F8A" stroke-width="10" stroke-linejoin="round"/>`
   +[150,230,310,390].map(y=>`<circle cx="0" cy="${y}" r="9" fill="#fff" stroke="#3E5F8A" stroke-width="4"/>`).join('');
 }
 if(wear==='apron')chest+=`<path d="M-120 120 L120 120 L130 480 L-130 480 Z" fill="#F4F1EA" stroke="#B9AE98" stroke-width="6"/><path d="M-120 120 L-150 0 M120 120 L150 0" stroke="#F4F1EA" stroke-width="16" stroke-linecap="round"/>`;
 if(wear==='tie')chest+=`<path d="M-42 6 L0 40 L42 6" fill="#F6F4EF" stroke="#C9C3B6" stroke-width="5"/><path d="M0 40 L-18 64 L-12 220 L0 244 L12 220 L18 64 Z" fill="#3E6FB0" stroke="#1F3D66" stroke-width="5"/>`;
 if(wear==='vest')chest+=`<path d="M-200 40 Q-226 200 -224 470 L-70 470 L-40 60 Z M200 40 Q226 200 224 470 L70 470 L40 60 Z" fill="#E8A33A" stroke="#8A5A12" stroke-width="6"/><path d="M-214 260 L-56 260 M214 260 L56 260" stroke="#F4F1EA" stroke-width="18"/>`;
 return body+chest;
}

function face(m,blink,o){
 const f=o.face||'normal',look=o.look||[0,0],lx=look[0]*7,ly=look[1]*6;
 // 頭の形（上に少しとがった頭頂部）
 let h=`<path d="M-128 -84 Q-146 -190 -66 -238 Q0 -276 66 -238 Q146 -190 128 -84 Q132 4 60 34 Q0 50 -60 34 Q-132 4 -128 -84 Z" fill="${FUR}"/>`
  +`<path d="${furArc(0,-112,136,128,196,344,20,.07)}Z" fill="${FUR}"/>`;
 // 風でなびく毛（画面の左＝うしろへ）
 if(o.blown){const b=o.blown;h+=`<g opacity="${Math.min(1,b*1.4)}" fill="${FUR}">`+[[-40,-250],[10,-262],[60,-246],[100,-214]].map(([x,y],i)=>`<path d="M${x+20} ${y+16} Q${x-40*b} ${y-18-i*4} ${x-120*b-30} ${y-6+i*10} Q${x-60*b} ${y+10} ${x-10} ${y+30} Z"/>`).join('')+`</g>`}
 // 耳
 h+=`<circle cx="-128" cy="-92" r="24" fill="${SKIN}" stroke="${SKINL}" stroke-width="5"/><circle cx="128" cy="-92" r="24" fill="${SKIN}" stroke="${SKINL}" stroke-width="5"/>`;
 // 顔（はだ）
 h+=`<path d="M-100 -132 Q-104 -170 -52 -164 Q0 -150 52 -164 Q104 -170 100 -132 Q112 -64 86 -30 Q76 30 0 34 Q-76 30 -86 -30 Q-112 -64 -100 -132 Z" fill="${SKIN}" stroke="${SKINL}" stroke-width="5"/>`;
 // 口のまわり（明るい）
 h+=`<ellipse cx="0" cy="-12" rx="74" ry="44" fill="${SKIN2}"/>`;
 // まゆ（太い骨の出っぱり）
 const browY=f==='shock'?-150:f==='worried'?-138:-136;
 const browR=f==='worried'?`M-84 ${browY+10} Q-50 ${browY-6} -14 ${browY-14} M84 ${browY+10} Q50 ${browY-6} 14 ${browY-14}`:`M-86 ${browY} Q-48 ${browY-18} -10 ${browY-2} M86 ${browY} Q48 ${browY-18} 10 ${browY-2}`;
 h+=`<path d="${browR}" stroke="${LINE}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
 // 目
 const E=(x)=>{
  if(blink||f==='sleep')return `<path d="M${x-18} -104 Q${x} -94 ${x+18} -104" stroke="${LINE}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if(f==='happy')return `<path d="M${x-18} -100 Q${x} -122 ${x+18} -100" stroke="${LINE}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  if(f==='calm')return `<path d="M${x-18} -104 Q${x} -112 ${x+18} -104" stroke="${LINE}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="${x+lx}" cy="${-100+ly}" rx="7" ry="5" fill="${LINE}"/>`;
  if(f==='dizzy')return `<path d="M${x} -104 m-14 0 a14 14 0 1 1 14 14 a9 9 0 1 1 -9 -9" stroke="${LINE}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const r=f==='shock'?24:18,ir=f==='shock'?9:11;
  return `<ellipse cx="${x}" cy="-104" rx="${r}" ry="${r+2}" fill="#fff" stroke="${LINE}" stroke-width="5"/><circle cx="${x+lx}" cy="${-102+ly}" r="${ir}" fill="#3A2418"/><circle cx="${x+lx}" cy="${-102+ly}" r="${ir*.55}" fill="#111"/><circle cx="${x+lx+4}" cy="${-107+ly}" r="4" fill="#fff"/>`};
 h+=E(-44)+E(44);
 // 鼻
 h+=`<path d="M-30 -64 Q0 -84 30 -64 Q36 -44 20 -40 Q0 -46 -20 -40 Q-36 -44 -30 -64 Z" fill="${SKINL}"/><ellipse cx="-14" cy="-52" rx="9" ry="7" fill="${LINE}"/><ellipse cx="14" cy="-52" rx="9" ry="7" fill="${LINE}"/>`;
 // ほお
 if(o.flush)h+=`<ellipse cx="-70" cy="-40" rx="20" ry="12" fill="#E2706A" opacity="${.75*o.flush}"/><ellipse cx="70" cy="-40" rx="20" ry="12" fill="#E2706A" opacity="${.75*o.flush}"/>`;
 // 口
 const mm=Math.max(0,Math.min(1,m));
 if(mm>0.04){const H=8+mm*44,W=36+mm*6;
  h+=`<path d="M${-W} -8 Q0 ${-2} ${W} -8 Q${W*.8} ${-8+H} 0 ${-6+H} Q${-W*.8} ${-8+H} ${-W} -8 Z" fill="#4A1C22" stroke="${LINE}" stroke-width="5" stroke-linejoin="round"/>`
   +(mm>.3?`<ellipse cx="0" cy="${-8+H*.78}" rx="${W*.5}" ry="${H*.22}" fill="#C8606A"/>`:'')
   +`<path d="M${-W*.7} -6 L${W*.7} -6" stroke="#F1EDE6" stroke-width="${3+mm*4}" stroke-linecap="round"/>`;
 }else if(f==='happy'||f==='calm'){h+=`<path d="M-40 -10 Q0 20 40 -10" stroke="${LINE}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
 else if(f==='shock'){h+=`<ellipse cx="0" cy="2" rx="16" ry="20" fill="#4A1C22" stroke="${LINE}" stroke-width="5"/>`}
 else if(f==='worried'){h+=`<path d="M-30 4 Q0 -8 30 4" stroke="${LINE}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
 else{h+=`<path d="M-34 -4 Q0 10 34 -4" stroke="${LINE}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
 // ぬれた顔のしずく
 if(o.wet){const w=o.wet;h+=`<g opacity="${w}" fill="#8FD0F5" stroke="#2C6E99" stroke-width="3">`+[[-90,-150],[-60,-60],[70,-120],[96,-40],[20,-170],[-20,10]].map(([x,y])=>`<path d="M${x} ${y} q9 16 0 22 q-9 -6 0 -22 Z"/>`).join('')+`</g>`}
 return h;
}

function wild(m=0,blink=false,size=2,o={}){
 const hx=o.headDX||0,hr=o.headRot||0,hy=o.headDY||0;
 return `<svg viewBox="-260 -270 520 520" overflow="visible" xmlns="http://www.w3.org/2000/svg">${torso(o.wear)}<g transform="translate(${hx},${hy}) rotate(${hr} 0 30)">${face(m,blink,o)}</g></svg>`;
}
module.exports={wild,FUR,FUR2,SKIN};
