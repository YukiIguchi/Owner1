// 23日（火）トイレは どこですか。— もじもじ足ぶみ。案内の札の矢印が次々に別の方向を指して、ぐるぐる回る → 店員にたずねる → 店員がにこにこして、すぐ横のドア（トイレの絵）を指す
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
function scene(t,G=true){
 let s=P.wall('#F3EEE4')+P.R(0,520,1080,24,'#D9CFBE')+P.floor(1740,'#D8CDB8','#B8AD98');
 s+=P.shelf(720,1060,300,640,4);
 // すぐ横のトイレのドア
 s+=P.R(470,1120,200,460,'#9CC9E3',P.sw(6))+`<circle cx="640" cy="1360" r="10" fill="#2B2D33"/>`+P.R(500,1180,140,110,'#FFFFFF',`rx="12" ${P.sw(5)}`)+`<g transform="translate(570,1235)">${P.toiletPicto(0.9)}</g>`;
 // 案内の札：矢印が次々に向きを変え、ぐるぐる回る
 const spin=t<2.6?t*260+Math.floor(t*1.6)*90:2.6*260+Math.floor(2.6*1.6)*90;
 s+=P.guideSign(330,700,spin,1.05)+P.guideSign(760,760,-spin*0.8+120,1.05);
 // 店員：にこにこして、すぐ横のドアを指す
 const point=seq(t,3.3,3.9);
 s+=person(870,1470,1.15,{face:'smile',apron:true,shirt:'#5B9A8B',shirtLine:'#2F5E52',hair:'long',hand:point>0.02?[lerp(-70,-230,point),lerp(150,-50,point)]:[-70,150],hk:point>0.5?'point':null});
 if(G){const fidget=t<2.6;
  const right=t>2.6&&t<3.5?{tx:lerp(500,640,seq(t,2.6,3.0)),ty:lerp(1700,1420,seq(t,2.6,3.0)),kind:'open',fixDeg:-40,reach:60}:null;
  const ang=spin*Math.PI/180;
  s+=gorilla(290,1560+(fidget?-Math.abs(Math.sin(t*10))*16:0),{rot:fidget?Math.sin(t*10)*4:0,right,
   face:t<3.9?'worried':'happy',look:fidget?[Math.cos(ang),-.8]:t<3.9?[.9,0]:[.8,-.2],blink:false});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F3EEE4',scene(t)),svgWrap('#F3EEE4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
