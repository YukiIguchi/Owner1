// 53日（木）けがを しました。救急車を 呼んで ください。— 倉庫。はしごの上の同僚が足をすべらせ、ゴリラが受け止める → 同僚が足首をおさえる（大げさにしない）→ ゴリラが電話で1・1・9を押す。遠くに救急車（文字なし、十字の印）
// （けがの回：笑いにしない。受け止めて助けたことが伝わるように）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const LX=640;   // はしご
const DIAL=[['1',3.0],['11',3.4],['119',3.8]];
function scene(t,G=true){
 let s=P.wall('#E4DCCB')+P.R(0,560,1080,30,'#B9AC92')+P.floor(1760,'#B5A68C','#958670');
 // 大きなシャッターの出入り口（外が見える）→ 救急車
 s+=P.R(150,880,380,500,'#CFE6F5',P.sw(8))+P.R(150,1250,380,130,'#B9C0C4');
 const amb=seq(t,4.0,5.4);if(amb>0)s+=`<clipPath id="gate"><rect x="150" y="880" width="380" height="500"/></clipPath><g clip-path="url(#gate)">${P.ambulance(lerp(-200,200,amb),1330,0.55)}</g>`;
 s+=P.R(150,880,380,500,'none',P.sw(8))+P.R(140,860,400,26,'#8C96A0',P.sw(5));
 s+=P.shelf(780,1000,280,740,3)+P.box(800,1150,90,70)+P.box(900,1350,90,70);
 // はしご（少しゆれる）
 const wob=t<0.7?Math.sin(t*14)*3*cl(t/0.3):0;
 s+=P.ladder(LX,1760,720,110,wob);
 // 同僚：はしごの上 → すべる → 受け止められる → 床にすわって足首をおさえる
 const fall=seq(t,0.6,1.15),down=seq(t,1.7,2.4);
 const who={face:'worried',shirt:'#5B7FB0',shirtLine:'#2F4A70',hair:'short',cap:'#E2A23A'};
 let mid='',front='';
 if(t<0.6)front=person(LX+55,1140,0.9,Object.assign({},who,{face:'neutral',hand:[-30,-60],hand2:[40,-70]}));
 else if(down<1){const x=lerp(LX+55,470,fall),y=lerp(1140,1470,fall),r=lerp(0,-70,fall);
  const p=`<g transform="rotate(${r} ${x} ${y})">${person(x,y,0.9,Object.assign({},who,{face:'shock'}))}</g>`;
  if(down<=0)mid=p;else{const x2=lerp(470,660,down),y2=lerp(1470,1640,down),r2=lerp(-70,0,down);mid=`<g transform="rotate(${r2} ${x2} ${y2})">${person(x2,y2,0.9,Object.assign({},who,{face:'shock'}))}</g>`}}
 const sitting=down>=1||!G;
 if(sitting)front=P.legs(700,1820,0.9)+person(680,1640,0.9,Object.assign({},who,{hand2:[220,190],hk2:'open',look:[1,.8]}));
 if(G){let right=null,left=null;
  if(t>0.5&&down<1){const k=seq(t,0.5,0.9);right={tx:lerp(560,600,k),ty:lerp(1800,1500,k),kind:'open',reach:60,U:170,F:160};left={tx:lerp(100,360,k),ty:lerp(1800,1650,k),kind:'open',reach:60,U:170,F:160};
   if(down>0){right={tx:lerp(600,720,down),ty:lerp(1500,1620,down),kind:'open',reach:60,U:170,F:160};left={tx:lerp(360,560,down),ty:lerp(1650,1700,down),kind:'open',reach:60,U:170,F:160}}}
  let disp='';DIAL.forEach(([d,ts])=>{if(t>=ts)disp=d});
  if(t>2.6)right=Object.assign(L.wristAt(290,1560,520,1640),{kind:'grip',item:`<g transform="translate(70,-40) rotate(90)">${P.bigPhone(0,0,1.25,disp)}</g>`,fixDeg:-90});
  s+=gorilla(290,1560,{right,left,mid,face:t<0.6?'normal':t<1.6?'shock':'calm',look:t<1.2?[.8,-.8]:t<2.6?[.8,.4]:[.5,-.2],nodY:t>4.9&&t<5.6?Math.abs(Math.sin((t-4.9)*Math.PI*2.8))*18:0});}
 s+=front;
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E4DCCB',scene(t)),svgWrap('#E4DCCB',scene(DUR-0.1,false))).then(()=>console.log('ok'));
