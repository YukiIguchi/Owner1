// 8日（月）大丈夫です。— バナナの皮ですべって1回転 → 見事に着地 → 親指を立てる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
function scene(t,G=true){
 let s=P.skyBg('#BFE3F5','#EAF6FB')+P.building(420,1700,260,640,'#E3D9C8')+P.building(700,1700,300,520,'#D3DCE3','#B7D6EA')+P.ground(1700,'#D5D8DA','#B3B9BD');
 s+=P.R(0,1700,1080,26,'#B3B9BD')+P.tree(200,1720,1.25);
 // 通りがかりの人：かけよる → ほっとする
 const run=seq(t,2.2,3.0),ok=t>3.6;
 const px=lerp(1120,820,run),bob=run>0&&run<1?-Math.abs(Math.sin(t*16))*14:0;
 s+=person(px,1490+bob,1.2,{face:ok?'happy':'shock',sweat:!ok&&t>2.2?0.9:0,shirt:'#4F7A66',shirtLine:'#2D4A3D',hair:'short',hand:run<1?[-100,70]:[-70,150]});
 // バナナの皮：ふんだ瞬間にすべって右へ
 const slip=seq(t,1.0,1.6);
 const peel=[lerp(350,640,slip),1850-Math.sin(Math.PI*slip)*60];
 if(G){
  const walk=seq(t,0,1.0);const gx=lerp(40,330,walk);
  const wb=t<1.0?-Math.abs(Math.sin(t*Math.PI*4))*18:0;
  const flip=seq(t,1.05,2.2);
  const dy=wb-330*Math.sin(Math.PI*flip)+(t>2.2&&t<2.5?Math.sin((t-2.2)/0.3*Math.PI)*16:0);
  const spread=Math.sin(Math.PI*flip);
  let right=null,left=null;
  if(flip>0.05&&flip<0.95){right={tx:gx+420,ty:1560-150,kind:'open'};left={tx:gx-420,ty:1560-150,kind:'open'}}
  if(t>3.2)right={tx:gx+300,ty:lerp(1560,1380,seq(t,3.2,3.8)),kind:'thumb',fixDeg:-10,reach:40};
  const face=flip>0&&flip<1?'shock':t>3.2?'happy':'normal';
  s+=gorilla(gx,1560,{dy,rot:360*flip,right,left,face,blink:(t%2.6)>2.5&&t>2.3});
 }
 s+=P.bananaPeel(peel[0],peel[1],1.2);
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#BFE3F5',scene(t)),svgWrap('#BFE3F5',scene(DUR-0.1,false))).then(()=>console.log('ok'));
