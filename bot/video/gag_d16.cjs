// 16日（火）カードで 払えますか。— バナナの房で払おうとする → 店員がにこにこ首をふる → カードを出す → 店員がほっとして読み取り機を出す
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
function scene(t,G=true){
 let s=P.wall('#FBEFD9')+P.R(0,880,1080,50,'#3FA66B')+P.floor(1740,'#D8CBB3','#B8AB93');
 s+=P.shelf(130,1000,280,520,3)+P.shelf(700,1000,300,420,3);
 const no=t>1.5&&t<2.6,ok=t>3.2;
 const reader=seq(t,3.2,3.8);
 const ch=[lerp(-70,-130,reader),lerp(150,40,reader)];
 s+=person(850,1450,1.2,{face:ok?'happy':'smile',apron:true,shirt:'#7FA7D6',shirtLine:'#3E5F8A',hair:'bun',hand:ch,
   headDX:no?Math.sin((t-1.5)*Math.PI*4)*14:0,headRot:no?Math.sin((t-1.5)*Math.PI*4)*5:0});
 s+=P.counter(470,1640,620,'#E7D3B0','#B88D5C')+P.register(800,1640);
 if(reader>0.02)s+=P.cardReader(850+ch[0]*1.2,1450+ch[1]*1.2-40,1,seq(t,4.5,4.8));
 // バナナの房：手で台に置き、店員のほうへ押し出す
 const put=seq(t,0.2,1.2),back=seq(t,2.6,3.0);
 const bx=lerp(560,640,put),by=1640;
 if(G){let right;
  if(t<1.3)right={tx:bx+40,ty:by-60,kind:'open',reach:70};
  else if(t<2.6)right={tx:lerp(bx+40,500,seq(t,1.3,1.8)),ty:lerp(by-60,1700,seq(t,1.3,1.8)),kind:'open',reach:70};
  else if(t<4.2)right={tx:lerp(560,640,seq(t,2.6,3.2)),ty:lerp(1700,1380,seq(t,2.6,3.2)),kind:'grip',item:`<g transform="translate(70,-30) rotate(-20)">${P.card(1.15)}</g>`,reach:80};
  else right={tx:lerp(640,640,seq(t,4.2,4.6)),ty:lerp(1380,1560,seq(t,4.2,4.6)),kind:'grip',item:`<g transform="translate(70,-30) rotate(-20)">${P.card(1.15)}</g>`,reach:80};
  s+=gorilla(290,1560,{right,face:no?'worried':ok?'happy':'normal',look:[.8,0],blink:(t%2.7)>2.6});
  if(t<2.8)s+=`<g opacity="${1-back}">${P.bananaBunch(bx,by,0.75)}</g>`;}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#FBEFD9',scene(t)),svgWrap('#FBEFD9',scene(DUR-0.1,false))).then(()=>console.log('ok'));
