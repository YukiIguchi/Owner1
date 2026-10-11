// 9日（火）ふくろは いりません。— 店員が小さなレジ袋を差し出す → 首をふる → 山のような品物を両腕でかかえる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
const F=P.food;
// 台の上の山：[種類, x, y, 大きさ] と、かかえたあとの位置 [x, y]
const PILE=[['melon',545,1595,.9,400,1800],['cabbage',660,1595,.9,520,1790],['bread',600,1615,1,460,1720],
 ['apple',505,1510,1,330,1700],['pine',590,1500,1,370,1690],['milk',675,1505,1,560,1690],
 ['bread',540,1430,.8,470,1640],['orange',640,1430,1,600,1630],['carrot',705,1420,1,430,1650],
 ['banana',560,1360,1,560,1570],['apple',655,1350,1,500,1580],['cabbage',605,1280,.75,600,1500],['orange',610,1215,.9,520,1490]];
function scene(t,G=true){
 let s=P.wall('#F4EEDF')+P.R(0,880,1080,60,'#E46B5B')+P.floor(1740,'#C9BFAE','#A99F8E');
 s+=P.shelf(160,1000,300,500,3)+P.shelf(760,1000,280,440,3);
 // 店員：小さな袋を両手で差し出す → 固まる
 const give=seq(t,0.2,1.2),frozen=t>3.4;
 s+=person(890,1430,1.2,{face:frozen?'shock':'smile',apron:true,shirt:'#5B9A8B',shirtLine:'#2F5E52',hair:'short',
   hand:[lerp(-70,-120,give),lerp(150,40,give)],hand2:[lerp(60,-40,give),lerp(150,50,give)],sweat:frozen?seq(t,3.4,4.0):0});
 s+=P.counter(470,1650,620,'#D8C3A0','#A9835A');
 const bagX=890+lerp(-10,-80,give)*1.2,bagY=1430+lerp(150,48,give)*1.2;
 s+=P.tinyBag(bagX,bagY+30,0.8);
 const hug=seq(t,2.0,3.3);
 const items=PILE.map(([k,x,y,sc,x2,y2])=>`<g transform="translate(${lerp(x,x2,hug)},${lerp(y,y2,hug)})">${F[k](sc)}</g>`).join('');
 if(G){const shake=t>1.3&&t<2.1?Math.sin((t-1.3)*Math.PI*5)*16*Math.sin((t-1.3)/0.8*Math.PI):0;
  let right=null,left=null;
  if(hug>0.02){right={tx:lerp(640,660,hug),ty:lerp(1350,1720,hug),kind:'open',reach:80};left={tx:lerp(330,500,hug),ty:lerp(1560,1840,hug),kind:'open',reach:60,U:170,F:160}}
  s+=gorilla(290,1560,{nod:shake,right,left,mid:hug>0.02?items:'',face:t<1.3?'normal':t<2.0?'calm':'happy',look:[.7,.2]});
  if(hug<=0.02)s+=items;}
 // オチの背景：品物はゴリラが持っていったので台の上は空
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F4EEDF',scene(t)),svgWrap('#F4EEDF',scene(DUR-0.1,false))).then(()=>console.log('ok'));
