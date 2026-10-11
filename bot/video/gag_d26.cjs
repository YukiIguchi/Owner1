// 26日（金）手を 洗って ください。— 泥のついた手でパンにさわろうとする → 同僚が手のひらで止め、流し台を指す → 手を洗うと泡がどんどんふくらみ、部屋じゅう泡でいっぱい → 泡の中からゴリラがにっこり
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const MUD='#7A5230';
function scene(t,G=true){
 let s=P.wall('#F6EBDA')+P.R(0,980,1080,26,'#E2CFAF')+P.floor(1740,'#D2C0A2','#B2A082');
 s+=P.shelf(700,960,300,420,2);
 // 台：左に流し台、右にパン
 s+=P.counter(380,1600,720,'#E7D3B0','#B88D5C')+P.sink(400,1600,270);
 s+=`<g transform="translate(780,1560)">${P.food.bread(1)}</g><g transform="translate(900,1570)">${P.food.bread(0.85)}</g>`;
 const stop=t>1.5,foamK=seq(t,2.9,4.8);
 // 同僚：手のひらで止める → 流し台を指す
 s+=person(880,1450,1.15,{face:foamK>0.5?'happy':stop?'worried':'smile',apron:true,shirt:'#E8A33A',shirtLine:'#8A5A12',hair:'short',cap:'#FFFFFF',
   hand:stop?[lerp(-70,-190,seq(t,1.5,1.9)),lerp(150,10,seq(t,1.5,1.9))]:[-70,150],hk:stop?'open':null,
   hand2:t>2.0?[lerp(60,-60,seq(t,2.0,2.4)),lerp(150,120,seq(t,2.0,2.4))]:null,hk2:t>2.0?'point':null});
 if(G){let right;const wash=t>2.6;
  const clean=foamK>0.3;const col=clean?'#3A3D45':MUD;
  if(t<1.6)right={tx:lerp(520,760,seq(t,0.2,1.3)),ty:lerp(1700,1540,seq(t,0.2,1.3)),kind:'open',reach:80,color:MUD};
  else if(!wash)right={tx:lerp(760,560,seq(t,1.6,2.2)),ty:lerp(1540,1500,seq(t,1.6,2.2)),kind:'open',reach:80,color:MUD,fixDeg:-80};
  else right={tx:540+Math.sin(t*12)*30,ty:1620,kind:'open',reach:60,color:col};
  const left=wash?{tx:440+Math.cos(t*12)*30,ty:1630,kind:'open',reach:60,color:col,U:170,F:160}:null;
  s+=gorilla(290,1560,{right,left,face:t<1.5?'normal':t<2.6?'worried':'happy',look:t<1.5?[.8,.2]:t<2.6?[.4,.8]:[0,0]});}
 if(foamK>0)s+=P.foam(520,1560,foamK,G?[[290,1450,150],[880,1370,95]]:[[880,1370,95]]);
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F6EBDA',scene(t)),svgWrap('#F6EBDA',scene(DUR-0.1,false))).then(()=>console.log('ok'));
