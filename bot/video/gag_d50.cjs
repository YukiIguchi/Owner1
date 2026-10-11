// 50日（月）日本語が 少し わかります。— カフェ。親指と人さし指で「少し」のすき間を見せ、砂糖を入れようとする → 力が強すぎて、砂糖の袋ごと全部入り、コーヒーが砂糖の山に → もう一度、指で「少し」のすき間を見せる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
const CUP=[650,1600];
function scene(t,G=true){
 let s=P.wall('#EADFCF')+P.R(0,980,1080,26,'#B98A5E')+P.floor(1760,'#B8A182','#987F62');
 s+=P.R(620,620,320,240,'#CFE6F5',P.sw(7))+`<path d="M780 620 V860" stroke="#F7F3EA" stroke-width="10"/>`+P.R(150,640,300,200,'#3B4252',`rx="12" ${P.sw(6)}`)+`<g transform="translate(220,740)">${P.cup(0,0,0.6)}</g><g transform="translate(330,750)">${P.croissant(0,0,0.6)}</g>`;
 // テーブル
 s+=P.R(380,1610,700,26,'#8A6A4A',P.sw(5))+P.R(700,1636,30,300,'#6B5A4A',P.sw(4));
 const drop=seq(t,1.7,2.0),hill=seq(t,2.0,2.9);
 s+=P.coffeeCup(CUP[0],CUP[1],1.0);
 // 砂糖の袋：手に持つ → 袋ごとカップへ
 const bagItem=`<g transform="translate(90,0) rotate(${80})">${P.sugarBag(0.8)}</g>`;
 if(t<0.8)s+=`<g transform="translate(860,1560)">${P.sugarBag(0.8)}</g>`;
 if(t>=1.7&&t<2.05)s+=`<g transform="translate(${CUP[0]},${lerp(1420,1560,drop)})">${P.sugarBag(lerp(0.8,0.5,drop),lerp(150,180,drop))}</g>`;
 s+=P.sugarHill(CUP[0],CUP[1]-78,lerp(0,420,hill),lerp(60,170,hill));
 if(G){let right=null;
  const pinch=(k)=>({tx:lerp(500,600,k),ty:lerp(1700,1360,k),kind:'pinch',fixDeg:-10,reach:60});
  if(t<0.9)right=pinch(seq(t,0.1,0.5));
  else if(t<1.75){const k=seq(t,0.9,1.3);right={tx:lerp(860,CUP[0],seq(t,1.2,1.6)),ty:lerp(1560,1420,seq(t,1.2,1.6))+(t<1.2?lerp(0,0,k):0),kind:'grip',item:bagItem,fixDeg:lerp(60,170,seq(t,1.4,1.7)),reach:60}}
  else if(t<2.9)right={tx:lerp(CUP[0],560,seq(t,2.0,2.4)),ty:lerp(1420,1700,seq(t,2.0,2.4)),kind:'open',reach:60};
  else right=pinch(seq(t,3.0,3.4));
  s+=gorilla(290,1560,{right,face:t<1.7?'happy':t<3.0?'shock':'worried',look:t>1.5&&t<3.0?[.9,.2]:[.5,0],blink:(t%2.6)>2.5});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EADFCF',scene(t)),svgWrap('#EADFCF',scene(DUR-0.1,false))).then(()=>console.log('ok'));
