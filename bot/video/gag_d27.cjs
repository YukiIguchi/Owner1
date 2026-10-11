// 27日（土）静かに して ください。— 夜。となりの家の窓辺のオウムが大きく鳴く → パジャマのゴリラが窓を開けて、人さし指を口に当てる → オウムが小さな声に → ゴリラがうなずいて窓を閉める
// （倫理：さわぐのはオウム）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const WX=40,WY=1200,WW=520;           // ゴリラの部屋の窓
function scene(t,G=true){
 let s=P.nightSky();
 // となりの家と窓辺のオウム
 s+=P.R(600,860,520,1100,'#6B5E7A',P.sw())+P.R(660,960,300,300,'#F7D774',P.sw(7))+`<path d="M810 960 V1260" stroke="#6B5E7A" stroke-width="10"/>`+P.R(646,1260,328,22,'#B9A9C9',P.sw(5));
 const loud=t<2.6,quiet=t>3.4;
 const beak=loud?Math.abs(Math.sin(t*7)):quiet?Math.abs(Math.sin(t*5))*0.35:0;
 s+=P.parrot(800,1100,1.05,beak,-1);
 if(loud)s+=P.soundWaves(690,1060,-1,cl(t/0.5),3,40,46,1.5);
 if(quiet&&t<4.6)s+=P.soundWaves(700,1060,-1,1,2,20,24,0.8);
 // ゴリラの部屋のかべと窓
 s+=P.R(0,1160,600,800,'#4A4363');
 s+=P.R(WX,WY,WW,760,'#2E2A44');
 const open=seq(t,2.0,2.5)*(1-seq(t,4.9,5.4));
 if(G){const shh=t>2.4&&t<4.6;const nodY=t>4.0&&t<4.7?Math.abs(Math.sin((t-4.0)*Math.PI*2.8))*20:0;
  const right=shh?Object.assign(L.wristAt(300,1560,330,lerp(1700,1640,seq(t,2.4,2.8))),{kind:'point',fixDeg:-95}):null;
  s+=gorilla(300,1560,{wear:'pajama',right,nodY,face:t<2.4?'worried':t<3.4?'normal':'calm',blink:t<2.0&&(t%1.2)>1.0,look:[.8,-.3]});
  s+=P.nightcap(320,1330+nodY,0.9,-8);}
 // 窓ガラス（左右に開く）
 const pane=(x)=>P.R(x,WY,WW/2,760,'#8FA9D9','opacity=".55"')+P.R(x,WY,WW/2,760,'none',P.sw(8))+`<path d="M${x+30} ${WY+60} l60 -40 M${x+30} ${WY+120} l100 -70" stroke="#E6F0FF" stroke-width="8" opacity=".6"/>`;
 s+=pane(WX-open*WW*0.45)+pane(WX+WW/2+open*WW*0.45);
 s+=P.R(WX-14,WY-14,WW+28,14,'#B9A9C9',P.sw(5));
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#1B2547',scene(t)),svgWrap('#1B2547',scene(DUR-0.1,false))).then(()=>console.log('ok'));
