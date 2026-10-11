// 1日（月）今日も よろしく おねがいします。— ていねいなおじぎの風で、書類と帽子が飛ぶ
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const PAPERS=[[-170,560],[-110,640],[-50,600],[10,680],[60,560]];
function scene(t,G=true){
 const bow=seq(t,1.0,1.8)*(1-seq(t,2.6,3.4));          // おじぎ 0→1→0
 const wind=cl((t-1.5)/0.4)*(1-cl((t-2.9)/0.6));       // 風の線
 const fly=Math.max(0,t-1.7);                           // 書類が飛んでからの時間
 let s=P.wall('#F3E9D8')+P.windowFrame(560,640,320,260,{sun:true})+P.floor(1730);
 // 帽子：おじぎの風で上へ → ゆっくり頭にもどる
 const up=seq(t,1.8,2.8),back=seq(t,3.9,4.9);
 const hat={dx:lerp(0,-70,up)*(1-back),dy:lerp(0,-230,up)*(1-back),r:lerp(0,-35,up)*(1-back)};
 const face=t<1.9?'smile':t<3.9?'shock':'happy';
 s+=person(820,1470,1.25,{face,hat,blown:cl((t-1.8)/0.3)*(1-cl((t-3.0)/0.6)),shirt:'#5B7FB0',shirtLine:'#2F4A70',hand:[-60,120]});
 s+=P.desk(590,1660,420)+P.paperStack(680,1660,t<1.7?7:2);
 // 書類
 PAPERS.forEach(([vx,vy],i)=>{if(fly<=0)return;const x=680+vx*fly,yy=1600-vy*fly+180*fly*fly,y=Math.min(yy,1800-i*6),landed=yy>=1800-i*6;
  s+=P.paper(x,y,landed?70+i*8:Math.sin(fly*3+i)*35,0.9)});
 s+=P.windLines(520,1560,wind*1.2,150,3,1);
 if(G){const look=t>3.3&&t<4.4?[0.8,0.2]:[0,0];
  s+=gorilla(290,1560,{rot:38*bow,dy:70*bow,blink:bow>0.4||((t%2.7)>2.6),face:t>3.2&&t<4.4?'worried':t>=4.4?'happy':'normal',look});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F3E9D8',scene(t)),svgWrap('#F3E9D8',scene(DUR-0.1,false))).then(()=>console.log('ok'));
