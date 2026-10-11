// 24日（水）ここが 痛いです。— 場面1：家で小さないすの脚に足の指をぶつけ、片足でとびはねる → 0.3秒のフェード → 場面2：診察室。医者が心配そうに見る。包帯を巻いた足の指を指さす
// （けがの回：からかわない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
function home(t,G){let s=P.wall('#F5E6D3')+P.windowFrame(620,640,280,240,{sun:true})+P.floor(1700,'#C9A77C','#A8865C');
 s+=P.R(140,1060,240,320,'#E8D8BE',P.sw(5))+`<circle cx="260" cy="1220" r="70" fill="#F2C94C" stroke="#2B2D33" stroke-width="5"/>`;
 const walk=seq(t,0,0.9),hit=t>0.9;
 const hop=hit&&t<2.5?Math.abs(Math.sin((t-0.95)*7))*70:0;
 if(G){s+=gorilla(lerp(160,290,walk),1560-hop,{face:t<0.9?'normal':'worried',blink:t>0.95&&t<1.4,look:[.5,.6]});
  // 足：前にふみ出して、いすの脚にぶつかる → 持ち上げる
  const fx=lerp(200,370,walk),lift=hit?seq(t,0.95,1.2)*30:0;
  s+=P.gFoot(fx,1880-hop-lift*3,1.3,{lift});}
 s+=P.chair(720,1920,1.25);
 if(G)s+=P.bump(615,1820,cl((t-0.9)/0.5));
 return s}
function clinic(t,G){let s=P.wall('#E3F1EC')+P.R(0,1180,1080,40,'#C7E0D6')+P.floor(1740,'#BFD3CB','#9DB8AD')+P.crossSign(820,820,1.1);
 s+=person(820,1470,1.2,{face:'worried',coat:true,steth:true,shirt:'#F4F6F8',shirtLine:'#9AA6B2',hair:'short',look:[-.6,.8],hand:[-70,150]});
 s+=P.stool(660,1810,1.2);
 if(G){const pt=seq(t,3.1,3.7);
  s+=P.gFoot(500,1790,1.3,{bandage:true});
  s+=gorilla(270,1560,{face:'worried',look:[.6,.8],right:pt>0.02?Object.assign(L.wristAt(270,1560,lerp(520,640,pt),lerp(1700,1560,pt)),{kind:'point',fixDeg:lerp(20,60,pt)}):null});}
 else s+=P.gFoot(500,1790,1.3,{bandage:true});
 return s}
function scene(t,G=true){const f=cl((t-2.35)/0.3);
 if(f<=0)return home(t,G);if(f>=1)return clinic(t,G);
 return home(t,G)+`<g opacity="${f}">${clinic(t,G)}</g>`}
L.renderGag(OUT,DUR,t=>svgWrap('#F5E6D3',scene(t)),svgWrap('#E3F1EC',scene(DUR-0.1,false))).then(()=>console.log('ok'));
