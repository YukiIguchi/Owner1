// 20日（土）電車が 止まって います。— 全力でかけこむ → 電車は止まっていて、ホームの人がイライラ → ゴリラは落ちついてベンチでバナナを食べる → まわりの人もまねして座り、おだやかな顔に
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const peel=deg=>`<g transform="translate(60,0) rotate(${-deg})">${P.banana(10,-40,-70,1.1)}</g>`;
function scene(t,G=true){
 let s=P.wall('#DDE6EC')+P.R(0,1380,1080,600,'#C9C4B8')+P.R(0,1380,1080,30,'#F2C94C');
 s+=P.train(120,1380,980);
 s+=P.stopSign(600,640,1.1);
 // ホームの人たち：腕組み・足ぶみでイライラ → まねして座り、おだやかに
 const sit=seq(t,4.0,4.6);
 [[740,'#C9746A','long'],[900,'#5B7FB0','short']].forEach(([x,c,h],i)=>{const tap=t<4.0?Math.abs(Math.sin(t*9+i))*(i?10:0):0;
  s+=person(x,lerp(1440,1530,sit)-tap,0.95,{face:sit>0.5?'calm':'worried',cross:sit<0.5,shirt:c,shirtLine:'#333',hair:h,hand:[-60,120],look:sit<0.5?[-.5,-.3]:[0,0]})});
 if(G){const run=seq(t,0,1.3),sitG=seq(t,2.8,3.4);
  const gx=lerp(-120,300,run),bob=t<1.3?-Math.abs(Math.sin(t*12))*20:0;
  let right=null;const eat=t>3.4;
  if(t>2.4){const k=seq(t,2.4,2.9);right=eat?Object.assign(L.wristAt(gx,1560+90,430,1600+Math.sin(t*8)*8),{kind:'grip',item:`<g transform="translate(40,10)">${P.banana(0,0,0,1.1)}</g>`,fixDeg:180}):{tx:lerp(520,560,k),ty:lerp(1700,1500,k),kind:'grip',item:peel(-60),fixDeg:-60,reach:60}}
  s+=gorilla(gx,1560+bob+90*sitG,{right,m:eat?Math.abs(Math.sin(t*8))*0.5:0,face:t<1.5?'shock':t<2.4?'normal':'calm',look:t<2.4?[.8,0]:[0,0]});}
 s+=P.bench(120,1820,900);
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#DDE6EC',scene(t)),svgWrap('#DDE6EC',scene(DUR-0.1,false))).then(()=>console.log('ok'));
