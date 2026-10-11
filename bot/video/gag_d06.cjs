// 6日（土）燃える ごみは 火曜日です。— ゴリラは案内役。指し棒で7つの四角をたどり、3つ目（火の絵）で止まる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const CX=215,CY=990,CW=700,C=CW/7;
const sq=i=>[CX+C*(i+.5),CY+C*.55];
function scene(t,G=true){
 let s=P.skyBg('#CBE6F4','#EEF7FB')+P.R(0,820,1080,1100,'#E6DED0')+P.ground(1700,'#C9CED1','#A9B0B5');
 const pop=seq(t,2.4,3.2);
 s+=P.R(CX-40,CY-90,CW+80,C*1.1+150,'#8A6A4A',P.sw())+P.calendar7(CX,CY,CW,{marks:{2:P.fireIcon(0.9+0.5*pop)},today:pop>0.05?2:-1,todayK:pop});
 s+=P.trashStation(560,1700,330,140);
 // となりの人：小さなごみ袋を持って、どの日か迷っている → わかってにっこり
 const ok=t>4.3;
 s+=person(830,1500,1.15,{face:ok?'happy':'worried',look:[-.6,-1],shirt:'#C9746A',shirtLine:'#7A3D35',hair:'long',hand:[-110,120],headRot:ok&&t<5.4?Math.sin((t-4.3)*6)*7:0});
 s+=P.garbageBag(830-110*1.15,1500+150*1.15,0.6);
 // ゴリラの大きなごみ袋（紙とバナナの皮）
 s+=P.garbageBag(560,1830,1.25,'#F7F7F2')+P.bananaPeel(545,1790,0.5);
 if(G){// 指し棒：1つ目 → 2つ目 → 3つ目
  const step=t<0.6?0:t<1.2?seq(t,0.6,1.0)*0:t<1.8?seq(t,1.2,1.6):1+seq(t,1.8,2.2);
  const tgt=t<0.6?sq(0):(t<1.2?sq(0):t<1.8?[lerp(sq(0)[0],sq(1)[0],step),sq(0)[1]]:[lerp(sq(1)[0],sq(2)[0],step-1),sq(0)[1]]);
  const tap=Math.max(0,Math.sin(t*Math.PI*1.67))*10*(t<2.4?1:0);
  const right={tx:tgt[0],ty:tgt[1]+tap,kind:'grip',item:P.pointer(330),reach:330};
  s+=gorilla(290,1560,{right,face:t>3.4?'happy':'normal',look:t<3.4?[.4,-1]:[.8,0],nod:t>3.4&&t<4.4?Math.sin((t-3.4)*8)*6:0,blink:(t%3)>2.9});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#CBE6F4',scene(t)),svgWrap('#CBE6F4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
