// 4日（木）地震です。机の 下に 入って ください。— 机の下にもぐろうとするが体が大きすぎる → 机を持ち上げて頭を守る
// （防災の回：同僚は正しく机の下に入る。画面のゆれは 5px 以下）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=6.0;
const GX=380;
function scene(t,G=true){
 const q=t<4.2?Math.min(1,t/0.6):Math.max(0,1-(t-4.2)/0.8);   // ゆれの強さ
 const sx=Math.sin(t*19)*5*q,sy=Math.cos(t*23)*3*q;
 let s=P.wall('#EDE6DA')+P.floor(1740,'#BFA684','#9E8664');
 s+=P.lamp(560,470,180,Math.sin(t*4.2)*16*q)+P.frame(700,820,180,140,Math.sin(t*3.6+1)*7*q,'');
 // 同僚：自分の机の下にすばやく入り、脚をつかむ
 const duck=seq(t,0.4,1.2);
 s+=person(860,lerp(1450,1720,duck),lerp(1.1,0.9,duck),{face:t>4.8?'smile':'neutral',shirt:'#6C8F5E',shirtLine:'#3D5A33',hair:'short',hand:duck>0.5?[-110,-40]:[-70,150]});
 s+=P.table(690,1550,320,200);
 // ゴリラの机
 const crouch=seq(t,1.2,2.0)*(1-seq(t,2.4,2.9));
 const lift=seq(t,2.6,3.6);
 const dx=GX-210,dy=lerp(1610,1180,lift);
 if(G){const gy=1560+120*crouch;let right=null,left=null;
  const U=lerp(150,190,lift),F=lerp(140,180,lift);
  if(lift>0.02){right={tx:dx+420-30,ty:dy+110,kind:'grip',reach:60,U,F};left={tx:dx+30,ty:dy+110,kind:'grip',reach:60,U,F}}
  const face=t<2.4?(crouch>0.5?'worried':'shock'):(t<4.6?'normal':'happy');
  s+=gorilla(GX,gy,{right,left,face,look:t<1.2?[0,-.6]:[0,0],blink:(t%2.8)>2.7});
  s+=P.table(dx,dy,420,140);}
 else s+=P.table(dx,1610,420,140);
 return `<g transform="translate(${sx},${sy})">${s}</g>`}
L.renderGag(OUT,DUR,t=>svgWrap('#EDE6DA',scene(t)),svgWrap('#EDE6DA',scene(DUR-0.1,false))).then(()=>console.log('ok'));
