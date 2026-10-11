// 54日（金）これで いいですか。— 倉庫。ゴリラが箱を完ぺきなピラミッドに積む → 上司が首をかしげる。てっぺんの1個だけが少し斜め → ゴリラが指1本で、てっぺんをまっすぐに直す → 上司が親指を立てる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
const BW=96,BH=78,CX=690,BASE=1720;
// ピラミッド：下から4・3・2・1
const SPOTS=[];[4,3,2,1].forEach((n,r)=>{for(let i=0;i<n;i++)SPOTS.push([CX+(i-(n-1)/2)*BW,BASE-(r+1)*BH])});
function scene(t,G=true){
 let s=P.wall('#E4DCCB')+P.R(0,560,1080,30,'#B9AC92')+P.floor(1720,'#B5A68C','#958670');
 s+=P.shelf(130,900,260,420,2);
 const fix=seq(t,3.1,3.6);
 let hand=null;
 SPOTS.forEach(([x,y],i)=>{const t0=G?0.15+i*0.17:-1,k=G?seq(t,t0,t0+0.25):1;if(k<=0)return;
  const top=i===SPOTS.length-1;const a=top?lerp(13,0,fix):0,dx=top?lerp(16,0,fix):0;
  const bx=lerp(430,x,k)+dx,by=lerp(1880,y,k);
  if(k<1&&G)hand=[bx+BW/2,by+BH/2];
  s+=`<g transform="rotate(${a} ${bx+BW/2} ${by+BH})">${P.box(bx-BW/2,by,BW-4,BH-4,['#D9A866','#CF9B58','#E0B275'][i%3])}</g>`});
 // 上司：首をかしげる → 親指を立てる
 const tilt=t>2.0&&t<3.6,ok=t>4.0;
 s+=person(905,1460,1.1,{face:tilt?'worried':ok?'happy':'neutral',cap:'#E2A23A',shirt:'#5D7FA6',shirtLine:'#33506F',hair:'short',headRot:tilt?lerp(0,16,seq(t,2.0,2.4)):0,look:[-.8,-.3],
   hand:ok?[lerp(-70,-110,seq(t,4.0,4.3)),lerp(150,20,seq(t,4.0,4.3))]:[-70,150],thumb:ok});
 if(G){let right=null;
  if(hand)right={tx:hand[0],ty:hand[1],kind:'grip',reach:60};
  else if(t>2.9&&t<3.8){const [x,y]=SPOTS[SPOTS.length-1];right={tx:x+lerp(70,40,fix),ty:y+BH/2-10,kind:'point',reach:120}}
  s+=gorilla(290,1560,{right,face:t<2.0?'happy':t<3.6?'normal':'happy',look:t>2.0&&t<2.9?[.8,0]:[.7,-.3],blink:(t%2.6)>2.5&&t>4});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E4DCCB',scene(t)),svgWrap('#E4DCCB',scene(DUR-0.1,false))).then(()=>console.log('ok'));
