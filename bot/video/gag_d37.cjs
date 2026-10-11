// 37日（火）これを 2つ ください。— 指を2本立てる → 店員がピースサインとかんちがいして、カメラで写真をとる（形だけ） → 首をふり、パンを指さしてから、もう一度指を2本 → 店員が笑ってパンを2つ渡す
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
function scene(t,G=true){
 let s=P.wall('#FBEFD9')+P.R(0,600,1080,40,'#C98B5A')+P.floor(1740,'#D8CBB3','#B8AB93');
 s+=P.shelf(620,920,400,460,2)+`<g transform="translate(720,1080)">${P.food.bread(0.9)}</g><g transform="translate(900,1080)">${P.food.bread(0.9)}</g>`+P.croissant(720,1240,1)+P.croissant(900,1240,1);
 // 店員：カメラで写真 → 笑ってパンを2つ渡す
 const cam=t>1.4&&t<2.6,give=seq(t,4.4,5.0);
 const hand=cam?[-40,-60]:give>0?[lerp(-70,-190,give),lerp(150,40,give)]:[-70,150];
 s+=person(860,1470,1.15,{face:cam?'happy':t>4.2?'happy':'smile',apron:true,shirt:'#C9746A',shirtLine:'#7A3D35',hair:'short',cap:'#FFFFFF',hand,hand2:cam?[30,-60]:null,front:cam});
 if(cam)s+=`<g transform="translate(860,1390)">${P.camera(1.1)}</g>`;
 s+=P.counter(470,1650,620,'#E7D3B0','#B88D5C');
 // 台の上のパン（2つ渡す）
 const tray=`<g transform="translate(600,1620)">${P.food.bread(0.75)}</g><g transform="translate(700,1630)">${P.croissant(0,0,0.8)}</g>`;
 s+=give<0.02?tray:`<g transform="translate(${lerp(0,860-190*1.15-600,give)},${lerp(0,-100,give)})">${tray}</g>`;
 if(G){let right=null;const shake=t>2.6&&t<3.2?Math.sin((t-2.6)*Math.PI*5)*16*Math.sin((t-2.6)/0.6*Math.PI):0;
  if(t>0.2&&t<2.6)right={tx:lerp(500,560,seq(t,0.2,0.9)),ty:lerp(1700,1320,seq(t,0.2,0.9)),kind:'two',fixDeg:-80,reach:60};
  else if(t>3.1&&t<3.8)right={tx:lerp(560,620,seq(t,3.1,3.4)),ty:lerp(1320,1600,seq(t,3.1,3.4)),kind:'point',reach:110};
  else if(t>=3.8&&t<4.6)right={tx:lerp(620,560,seq(t,3.8,4.1)),ty:lerp(1600,1320,seq(t,3.8,4.1)),kind:'two',fixDeg:-80,reach:60};
  else if(t>=4.7)right={tx:lerp(520,600,seq(t,4.7,5.0)),ty:lerp(1700,1580,seq(t,4.7,5.0)),kind:'open',fixDeg:-20,reach:60};
  s+=gorilla(290,1560,{right,nod:shake,face:cam?'worried':t>4.4?'happy':'normal',look:t>3.1&&t<3.8?[.8,.6]:[.8,0],blink:(t%2.8)>2.7});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#FBEFD9',scene(t)),svgWrap('#FBEFD9',scene(DUR-0.1,false))).then(()=>console.log('ok'));
