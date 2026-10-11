// 12日（金）わかりました。— 上司が身ぶりで説明（箱 → 矢印 → 棚の絵）→ 大きくうなずく → 箱の山を一度に全部持ち上げて棚にのせる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
function scene(t,G=true){
 let s=P.wall('#E4DCCB')+P.R(0,560,1080,30,'#B9AC92')+P.floor(1740,'#B5A68C','#958670');
 s+=P.shelf(420,980,380,760,3,'#9C7A55');
 // 上司：説明する → 目を丸くする
 const talk=t<2.0?Math.abs(Math.sin(t*9)):0,shock=t>4.5;
 s+=person(845,1470,1.15,{face:shock?'shock':'smile',talk,cap:'#E2A23A',shirt:'#5D7FA6',shirtLine:'#33506F',hair:'short',
   hand:t<2.0?[-120+Math.sin(t*3)*30,40-Math.abs(Math.sin(t*3))*60]:[-70,150],hk:t<2.0?'open':null});
 // 説明の吹き出し（箱 → 矢印 → 棚）
 const bk=cl((t-0.3)/0.4)*(1-cl((t-2.3)/0.4));
 if(bk>0)s+=`<g opacity="${bk}">${P.bubble(470,760,400,190,P.box(500,812,92,80)+P.arrowR(612,852,80)+P.shelfIcon(780,855,1.05),[780,1300])}</g>`;
 // 箱の山：持ち上げて棚の2段目へ
 const lift=seq(t,3.0,4.1),gx=lerp(290,360,seq(t,2.7,3.0))-lerp(0,70,seq(t,4.4,4.9));
 const px=lerp(400,470,lift),py=lerp(1920,1555,lift);
 const pile=P.boxPile(px,py,3,4,104,82);
 if(G){const nodY=t>2.0&&t<2.7?Math.sin((t-2.0)/0.7*Math.PI*2)*-1<0?Math.abs(Math.sin((t-2.0)/0.7*Math.PI*2))*30:0:0;
  const hold=t>2.8&&t<4.4;let right=null,left=null;
  if(hold){right={tx:px+300,ty:py-90,kind:'open',reach:70,U:190,F:180};left={tx:px+60,ty:py-30,kind:'open',reach:60,U:190,F:180}}
  s+=gorilla(gx,1560,{nodY,right,left,mid:hold?pile:'',face:t>2.0&&t<2.7?'calm':t>4.2?'happy':'normal',look:t<2.0?[.8,-.4]:[.6,0],blink:(t%2.9)>2.8});
  if(!hold)s+=pile;}
 else s+=pile;
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E4DCCB',scene(t)),svgWrap('#E4DCCB',scene(DUR-0.1,false))).then(()=>console.log('ok'));
