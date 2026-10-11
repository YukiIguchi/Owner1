// 47日（金）あした 病院に 行くので、休みます。— かべのカレンダー（7つの四角）の「明日」の四角を指す。その四角に病院の十字の印 → 大きなくしゃみ。風で机の書類が飛ぶ → 上司がうなずき、手で「どうぞ」
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const CX=240,CY=1110,CW=630,C=CW/7;
const cross=`<g transform="scale(0.42)">${P.crossSign(0,0,1,'#3FA66B')}</g>`;
const PAPERS=[[60,520],[150,600],[230,560],[300,640]];
function scene(t,G=true){
 let s=P.office({wallC:'#EEF2EA'});
 s+=P.calendar7(CX,CY,CW,{marks:{3:cross},today:2});
 const sneeze=t>2.0,fly=Math.max(0,t-2.15);
 // 上司
 const ok=t>3.2;
 s+=person(870,1470,1.15,{face:t<2.1?'smile':t<3.2?'shock':'happy',glasses:true,shirt:'#7A6A9C',shirtLine:'#4A3D66',hair:'short',hairColor:'#6B6B6B',
   blown:t>2.1&&t<3.0?1:0,headDY:ok&&t<4.4?Math.abs(Math.sin((t-3.2)*Math.PI*1.6))*14:0,hand:ok?[lerp(-70,-180,seq(t,3.4,3.8)),lerp(150,70,seq(t,3.4,3.8))]:[-70,150],hk:ok?'open':null});
 s+=P.desk(480,1660,420,'#C89B6D')+P.paperStack(640,1660,sneeze?2:6);
 PAPERS.forEach(([vx,vy],i)=>{if(fly<=0)return;const x=640+vx*fly,yy=1600-vy*fly+200*fly*fly;const y=Math.min(yy,1820-i*8);s+=P.paper(x,y,yy>=1820-i*8?80:Math.sin(fly*3+i)*40,0.85)});
 if(G){let right=null;
  if(t<1.9)right={tx:lerp(700,CX+C*3.5,seq(t,0.3,1.0)),ty:lerp(1500,CY+C*0.6,seq(t,0.3,1.0))+(t>1.0?Math.max(0,Math.sin((t-1.0)*Math.PI*2.2))*10:0),kind:'grip',item:P.pointer(330),reach:330};
  const pre=t>1.7&&t<2.05,ach=t>=2.05&&t<2.5;
  s+=gorilla(290,1560,{right,face:pre?'worried':ach?'sleep':t>3.2?'calm':'normal',m:ach?1:pre?0.25:0,nodY:ach?26:pre?-8:0,blink:pre,look:t<2.0?[.8,-1]:[.8,0]});
  if(t>2.05&&t<3.0)s+=P.windLines(470,1500,cl((t-2.05)/0.3)*(1-cl((t-2.6)/0.4)),190,3,1);}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EEF2EA',scene(t)),svgWrap('#EEF2EA',scene(DUR-0.1,false))).then(()=>console.log('ok'));
