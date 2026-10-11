// 40日（金）質問しても いいですか。— 研修の部屋。手をあげる → 腕が伸びすぎて、天井をつきぬける（天井に穴）→ 講師が上を見上げて目を丸くし、そのあと笑って「どうぞ」の手
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
const CEIL=600;   // 天井の下の線
function scene(t,G=true){
 let s=P.wall('#EEF1E8')+P.floor(1760,'#BFC6B4','#9EA594');
 // ホワイトボード（文字なし：線とグラフ）
 s+=P.R(560,820,420,300,'#FFFFFF',P.sw(7))+`<path d="M600 1060 L680 990 L760 1020 L850 920 L940 950" fill="none" stroke="#4F86C6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M600 880 H760 M600 910 H720" stroke="#9AA6B2" stroke-width="7" stroke-linecap="round"/>`;
 // 講師：見上げて目を丸く → 笑って「どうぞ」
 const look=t>2.2&&t<3.3,ok=t>=3.3;
 s+=person(850,1470,1.15,{face:look?'shock':ok?'happy':'smile',shirt:'#5D7FA6',shirtLine:'#33506F',hair:'short',glasses:true,look:look?[-.4,-1]:[-1,0],headRot:look?-8:0,
   hand:ok?[lerp(-70,-170,seq(t,3.3,3.7)),lerp(150,70,seq(t,3.3,3.7))]:[-70,150],hk:ok?'open':null});
 const hole=t>1.95;
 if(G){const raise=seq(t,0.3,1.0),grow=seq(t,1.3,2.0)*(1-seq(t,4.2,4.8));
  const U=lerp(150,560,grow),F=lerp(140,520,grow);
  const right={tx:lerp(560,500,raise),ty:lerp(1700,lerp(1160,200,grow),raise),kind:'open',fixDeg:-88,reach:60,U,F};
  s+=gorilla(290,1560,{right,face:grow>0.5&&t<3.3?'shock':'happy',look:grow>0.3?[.4,-1]:[.6,-.3],blink:(t%2.9)>2.8});}
 // 天井（腕の先をかくす）と穴
 s+=P.R(0,0,1080,CEIL,'#DCD6C8')+`<path d="M0 ${CEIL} H1080" stroke="#2B2D33" stroke-width="8"/>`;for(let i=0;i<5;i++)s+=`<path d="M${i*240} ${CEIL-110} V${CEIL}" stroke="#C9C2B2" stroke-width="5"/>`;
 if(hole){s+=`<path d="M430 ${CEIL} L440 ${CEIL-30} L470 ${CEIL-10} L500 ${CEIL-40} L530 ${CEIL-12} L560 ${CEIL-34} L580 ${CEIL} Z" fill="#3A3026" stroke="#2B2D33" stroke-width="5"/>`;
  const d=cl((t-1.95)/0.9);if(d<1)[[450,0],[520,1],[565,2]].forEach(([x,i])=>{s+=`<rect x="${x}" y="${CEIL+d*300+i*20}" width="26" height="18" fill="#DCD6C8" stroke="#2B2D33" stroke-width="4" transform="rotate(${d*120+i*40} ${x+13} ${CEIL+d*300+i*20+9})" opacity="${1-d}"/>`})}
 if(G&&t>1.95&&seq(t,1.3,2.0)*(1-seq(t,4.2,4.8))>0.6){/* 腕は天井の上にかくれる */}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EEF1E8',scene(t)),svgWrap('#EEF1E8',scene(DUR-0.1,false))).then(()=>console.log('ok'));
