// 15日（月）もう一度 おねがいします。— 同僚がものすごい早口：ぐしゃぐしゃの吹き出しが次々に飛び、風でゴリラの頭の毛がなびく → 手のひらで「ちょっと待って」→ 同僚がはっとして口に手を当てる
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
const MOUTH=[812,1420],FACE=[330,1440];
function scene(t,G=true){
 let s=P.office();
 const fast=t<2.6,stop=t>3.4;
 s+=person(820,1470,1.2,{face:stop?'shock':'smile',talk:fast?Math.abs(Math.sin(t*26)):0,shirt:'#C9746A',shirtLine:'#7A3D35',hair:'long',
   hand:stop?[lerp(-70,-8,seq(t,3.4,3.8)),lerp(150,-34,seq(t,3.4,3.8))]:[-70,150],hk:stop?'open':null,front:stop,sweat:stop?seq(t,3.6,4.2)*0.8:0});
 // 吹き出し：口から次々に飛び出して、ゴリラの顔へ
 if(G)for(let i=0;i<9;i++){const t0=0.15+i*0.26,k=(t-t0)/0.9;if(k<0||k>1)continue;
  const x=lerp(MOUTH[0]-80,FACE[0]+120,k),y=lerp(MOUTH[1]-120,FACE[1]-40+((i%3)-1)*90,k)-Math.sin(Math.PI*k)*80;
  s+=`<g opacity="${k<0.85?1:1-(k-0.85)/0.15}">${P.scribbleBubble(x,y,lerp(0.6,1.05,k),i+3)}</g>`}
 const wind=fast?cl(t/0.4):1-cl((t-2.6)/0.6);
 if(G){const right=t>2.6?{tx:lerp(480,640,seq(t,2.6,3.1)),ty:lerp(1700,1380,seq(t,2.6,3.1)),kind:'open',fixDeg:-80,reach:60}:null;
  s+=gorilla(290,1560,{blown:wind,face:fast?'worried':stop?'calm':'normal',blink:fast,right,dy:0});
  if(wind>0.05)s+=P.windLines(600,1290,wind,140,2,-1);}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EAF0F4',scene(t)),svgWrap('#EAF0F4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
