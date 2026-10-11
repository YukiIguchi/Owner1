// 52日（水）アレルギーが あります。— 店員がたまごのサンドイッチを出す → ゴリラが両腕で大きな×を作り、たまごの絵を指す → 店員がうなずいて、バナナのサンドイッチに取りかえる
// （病気の回：かゆがる・苦しむしぐさは描かない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const SX=600,SY=1610;
function scene(t,G=true){
 let s=P.wall('#F3ECE0')+P.R(0,900,1080,26,'#C98B5A')+P.floor(1760,'#C9B79C','#A99A80');
 s+=P.R(640,640,300,200,'#FFFFFF',P.sw(5))+`<g transform="translate(720,760)">${P.eggIcon(1.2)}</g><g transform="translate(850,760)">${P.bananaIcon(1.6)}</g>`;
 s+=P.R(330,1640,760,30,'#B98A5E',P.sw(5))+P.R(360,1670,700,250,'#A97C52',P.sw(5));
 const serve=seq(t,0.2,1.2),swap=seq(t,3.4,4.0),back=seq(t,4.0,4.6);
 const nod=t>3.0&&t<3.6?Math.abs(Math.sin((t-3.0)*Math.PI*3.3))*14:0;
 // 店員
 const hx=t<1.3?lerp(-70,-200,serve):t<3.4?-70:t<4.6?lerp(-200,-200,swap):lerp(-200,-70,seq(t,4.6,5.0));
 const hy=t<1.3?lerp(150,140,serve):t<3.4?150:140;
 s+=person(860,1450,1.15,{face:'smile',apron:true,shirt:'#7FA7D6',shirtLine:'#3E5F8A',hair:'long',headDY:nod,hand:[hx,hy]});
 // サンドイッチ：たまご → バナナ
 if(t<3.4)s+=P.sandwich(lerp(860,SX,serve),SY,0.9,'egg');
 else if(t<4.0)s+=P.sandwich(lerp(SX,980,swap),SY,0.9,'egg');
 if(t>=3.7)s+=P.sandwich(lerp(980,SX,seq(t,3.8,4.5)),SY,0.9,'banana');
 if(G){let right=null,left=null;
  const x=t>1.4&&t<2.4;
  if(x){const k=seq(t,1.4,1.7);right={tx:lerp(560,140,k),ty:lerp(1760,1590,k),kind:'grip',reach:20,U:150,F:230,fixDeg:-135,rim:true};left={tx:lerp(60,440,k),ty:lerp(1760,1590,k),kind:'grip',reach:20,U:150,F:230,fixDeg:-45,rim:true}}
  else if(t>=2.4&&t<3.2)right={tx:lerp(500,SX+70,seq(t,2.4,2.8)),ty:lerp(1700,SY-170,seq(t,2.4,2.8)),kind:'point',reach:110};
  s+=gorilla(290,1560,{right,left,nod:x&&t>1.7?Math.sin((t-1.7)*Math.PI*4)*10:0,face:x?'normal':t>4.4?'happy':'calm',look:t>2.4&&t<3.2?[.8,-.2]:[.6,0],blink:(t%2.8)>2.7});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F3ECE0',scene(t)),svgWrap('#F3ECE0',scene(DUR-0.1,false))).then(()=>console.log('ok'));
