// 30日（火）これは いくらですか。— つやつやのぶどうを1粒つまんで持ち上げる → 店員がコインを1枚ずつ積み上げると、天井まで届く → ゴリラが目を丸くして、うしろにのけぞる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const CX=700,CB=1630,CH=16;
function scene(t,G=true){
 let s=P.wall('#F6EEDC')+P.R(0,0,1080,560,'#D9C9A8')+P.R(0,540,1080,30,'#A9835A',P.sw(5));
 s+=P.shelf(160,940,280,500,2)+P.grapeBunch(250,1100,0.9)+`<g transform="translate(360,1100)">${P.food.apple(1)}</g><g transform="translate(250,1300)">${P.food.orange(1)}</g><g transform="translate(350,1300)">${P.food.apple(1)}</g>`;
 // 店員
 const stack=t<1.5?0:t<2.3?Math.floor((t-1.5)/0.2)+1:Math.min(68,5+Math.floor(Math.pow((t-2.3)/1.2,1.6)*63));
 const top=CB-stack*CH;
 const handY=Math.max(-40,(top-1470)/1.2-10);
 s+=person(880,1470,1.2,{face:'smile',apron:true,shirt:'#6C8F5E',shirtLine:'#3D5A33',hair:'short',hand:t>1.4&&t<2.4?[(CX-880)/1.2+40,(top-1470)/1.2-14]:[-70,150]});
 s+=P.counter(470,1640,620,'#E7D3B0','#B88D5C')+P.grapeBunch(560,1620,0.8);
 s+=P.coinStack(CX,CB,stack);
 if(G){const pick=seq(t,0.3,1.2),shock=t>3.5;
  // 1粒のぶどう：指でつまむ（手の向きの座標）
  const gr=`<g>${P.grape(118,6,30)}</g>`;
  const right=t<0.3?null:{tx:lerp(560,470,pick),ty:lerp(1600,1380,pick),kind:'pinch',item:gr,reach:110,fixDeg:-30};
  const lean=seq(t,3.5,4.1);
  s+=gorilla(300-40*lean,1560+20*lean,{rot:-14*lean,right,face:shock?'shock':pick>0.9?'happy':'normal',look:shock?[.6,-1]:[.6,-.4]});
  if(!shock&&pick>0.6)s+=P.sparkle(530,1310,14*Math.min(1,(pick-0.6)*3))+P.sparkle(470,1290,9*Math.min(1,(pick-0.6)*3));}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F6EEDC',scene(t)),svgWrap('#F6EEDC',scene(DUR-0.1,false))).then(()=>console.log('ok'));
