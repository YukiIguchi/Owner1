// 45日（水）きのうから 熱が あります。— かべのカレンダーの「今日」の印が、1つ前の四角から今の四角へ移る（1日たった）→ ベッドで寝ているゴリラのおでこの氷が、一瞬でとけて水になる → 体温計を見て、ゆっくりうなずく
// （病気の回：やさしい笑い）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
// 熱の印（たての体温計：目盛りが高い）
const thermIcon=`<g><rect x="-9" y="-34" width="18" height="56" rx="9" fill="#fff" stroke="#2B2D33" stroke-width="4"/><path d="M0 20 V-26" stroke="#2B2D33" stroke-width="7" stroke-linecap="round"/><circle cx="0" cy="26" r="12" fill="#5B6B7A" stroke="#2B2D33" stroke-width="4"/></g>`;
function scene(t,G=true){
 let s=P.wall('#E9E2F2')+P.floor(1780,'#B9A9C9','#9A8AAA');
 // カレンダー：「今日」の印が3つ目 → 4つ目へ（2つの四角に熱の印）
 const mv=seq(t,0.3,1.3);
 const CX=200,CW=680,C=CW/7;
 s+=P.calendar7(CX,820,CW,{marks:{2:thermIcon,3:mv>0.5?thermIcon:''}});
 s+=P.R(CX+lerp(2,3,mv)*C-4,816,C+8,C*1.1+8,'none',`stroke="#2B2D33" stroke-width="12" stroke-linejoin="round"`);
 // ベッド
 s+=P.R(120,1450,240,170,'#FFFFFF',`rx="40" ${P.sw(6)}`);
 const sit=seq(t,3.6,4.3);
 const melt=t>2.2;
 if(G){const rot=lerp(-80,0,sit);const gx=lerp(430,330,sit),gy=lerp(1560,1600,sit);
  let right=null;
  if(t>4.2){right=Object.assign(L.wristAt(gx,gy,520,1500),{kind:'grip',item:`<g transform="translate(20,-10) rotate(${-(-30)}) translate(-30,0)">${P.thermometer(0,0,260,-60,0.92)}</g>`,fixDeg:-30})}
  s+=gorilla(gx,gy,{rot,right,face:t<3.6?'sleep':'calm',flush:0.8,blink:false,wet:melt&&t<3.6?0.6:0,nodY:t>4.7&&t<5.6?Math.abs(Math.sin((t-4.7)*Math.PI*1.2))*20:0});
  // 氷のふくろ（おでこ）→ 一瞬で水に
  if(t<3.6){const fh=[gx-170*Math.sin(-rot*Math.PI/180)*-1, gy-170*Math.cos(rot*Math.PI/180)];
   const fx=gx+170*Math.sin(rot*Math.PI/180),fy=gy-170*Math.cos(rot*Math.PI/180);
   if(!melt)s+=P.iceBag(fx,fy,1.1,rot);
   else s+=P.waterDrops(fx,fy,cl((t-2.2)/0.8))+P.steam(fx+10,fy-40,t,1-cl((t-2.4)/1.2),90,{c:'#8C99A6',w:8});}}
 // ふとん
 const bl=G?lerp(1600,1700,sit):1700;const bx=G?lerp(470,300,sit):300;
 s+=`<path d="M${bx} ${bl} Q${bx+60} ${bl-70} 640 ${bl-50} Q860 ${bl-60} 1080 ${bl-20} V1920 H${bx-40} Z" fill="#7FA7D6" stroke="#2B2D33" stroke-width="6"/><path d="M300 ${bl+60} Q600 ${bl+10} 1000 ${bl+40}" fill="none" stroke="#5E86B8" stroke-width="8"/>`;
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E9E2F2',scene(t)),svgWrap('#E9E2F2',scene(DUR-0.1,false))).then(()=>console.log('ok'));
