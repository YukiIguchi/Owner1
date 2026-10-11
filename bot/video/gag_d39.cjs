// 39日（木）暑い 日は 水を たくさん 飲んで ください。— 強い日ざし。ゴリラの体が少しずつやわらかくとけるように下にたれていく → 水のボトルをごくごく飲む → 元の形にもどり、親指を立てる
// （体調の回：笑いにしすぎない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
function scene(t,G=true){
 let s=P.skyBg('#F9D9A8','#FCEFD6')+P.bigSun(790,700,95)+P.building(80,1700,240,420,'#E8D2B4','#F3E2C6')+P.tree(820,1720,1.1)+P.ground(1700,'#D9C7A8','#BBA886');
 s+=P.heatLines(t,1700);
 if(G){const melt=seq(t,0.2,2.0)*(1-seq(t,3.3,3.9));
  const drink=t>2.0&&t<3.5;
  const left_=drink?seq(t,2.2,3.3):0;
  let right=null;
  if(t>1.8&&t<3.6){const k=seq(t,1.8,2.2);right=Object.assign(L.wristAt(290,1560,lerp(520,420,k),lerp(1700,1540,k)),{kind:'grip',item:`<g transform="translate(-30,0)">${P.waterBottle(1-left_)}</g>`,fixDeg:lerp(-60,-160,k)})}
  else if(t>=3.9)right={tx:600,ty:lerp(1560,1400,seq(t,3.9,4.3)),kind:'thumb',fixDeg:-10,reach:40};
  const g=gorilla(290,1560,{right,face:melt>0.3?'worried':t>3.9?'happy':'calm',wet:melt*0.8,flush:melt*0.6,blink:melt>0.6,m:drink?0.35+0.2*Math.abs(Math.sin(t*10)):0,nodY:drink?Math.abs(Math.sin(t*10))*6:0});
  // とける：下を軸に横に広がり、たてに縮む。少しゆらゆら
  const sx=1+0.22*melt,sy=1-0.3*melt,sk=Math.sin(t*3)*4*melt;
  const bounce=t>3.9&&t<4.4?Math.sin((t-3.9)/0.5*Math.PI)*0.04:0;
  s+=`<g transform="translate(290,1920) skewX(${sk}) scale(${sx-bounce},${sy+bounce}) translate(-290,-1920)">${g}</g>`;}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F9D9A8',scene(t)),svgWrap('#F9D9A8',scene(DUR-0.1,false))).then(()=>console.log('ok'));
