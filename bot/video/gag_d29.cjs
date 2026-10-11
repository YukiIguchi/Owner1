// 29日（月）これは 日本語で 何ですか。— 絵の記号だけのボタンがたくさんある操作パネル → ボタンを1つ押す → 水が顔に命中 → ぬれた顔でパネルを指さす
// （下品にしない。便器は見せない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
const PX=680,PY=1440;   // パネル
function scene(t,G=true){
 let s=P.wall('#EAF2F4');for(let i=0;i<9;i++)for(let j=0;j<16;j++)s+=P.R(i*120,j*120,120,120,'none',`stroke="#D7E3E7" stroke-width="4"`);
 s+=P.R(0,940,1080,30,'#C9D9DE')+`<path d="M860 600 h120 v140 h-120 z" fill="#FFFFFF" stroke="#2B2D33" stroke-width="6"/><path d="M880 620 h80 v40 h-80 z" fill="#DCEFFA"/>`;
 const press=t>1.4&&t<2.0;
 s+=P.washletPanel(PX,PY,t>1.5&&t<4.0?2:-1,1.05);
 if(G){const jet=t>2.0&&t<2.9;const wet=seq(t,2.1,2.6);
  let right;
  const BX=PX-58,BY=PY-105;
  if(t<0.6)right=null;
  else if(t<2.1)right={tx:lerp(640,BX,seq(t,0.6,1.4)),ty:lerp(1900,BY,seq(t,0.6,1.4))+(press?8:0),kind:'point',reach:120};
  else if(t<3.0)right=null;
  else right={tx:lerp(640,BX,seq(t,3.0,3.6)),ty:lerp(1900,BY,seq(t,3.0,3.6)),kind:'point',reach:150};
  s+=gorilla(300,1560,{right,face:t<2.0?'normal':t<3.0?'shock':'worried',wet,look:t<2.0?[.9,-.2]:t<3.0?[0,.2]:[.9,0],blink:jet,nod:t>3.6&&t<4.4?0:0});
  if(jet)s+=P.waterJet(520,1960,330,1470,1)+P.splash(330,1470,cl((t-2.0)/0.4));}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EAF2F4',scene(t)),svgWrap('#EAF2F4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
