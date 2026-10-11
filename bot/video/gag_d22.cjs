// 22日（月）ゆっくり 話して ください。— 同僚の早口の吹き出しが次々に積もり、ゴリラが吹き出しの山に埋もれていく → 山から頭と片手だけが出て、手のひらを下にして上下にゆっくり（「ゆっくり」の合図）
// （15日は「風」、22日は「埋もれる」）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
// 積もる吹き出し：[x, y(積もった位置), 角度, 大きさ]
const PILE=[];{const r=P.rng(7);for(let i=0;i<22;i++){const row=Math.floor(i/5);PILE.push([150+((i%5)*95)+(row%2?45:0)+r()*20,1880-row*95-r()*20,r()*40-20,0.85+r()*0.25])}}
function scene(t,G=true){
 let s=P.office({wallC:'#F1ECF6'});
 const fast=t<3.0,calm=t>3.6;
 s+=person(840,1470,1.2,{face:calm?'calm':t>3.0?'shock':'smile',talk:fast?Math.abs(Math.sin(t*26)):0,shirt:'#4F86C6',shirtLine:'#2C5A8F',hair:'short',hand:[-70,150],look:t>3.0?[-1,0]:[-1,0]});
 if(G){const pop=seq(t,3.0,3.5);
  // ゴリラは山の中：頭と右手だけが山の上に出る
  const sink=seq(t,0.4,2.9);
  const gy=1560+lerp(0,90,sink)-lerp(0,60,pop);
  const pat=calm?Math.sin((t-3.6)*Math.PI*1.4)*40:0;     // 手のひらを下にして、上下にゆっくり
  const right=pop>0.05?{tx:lerp(480,600,pop),ty:lerp(1700,1330,pop)+pat,kind:'open',fixDeg:lerp(-90,10,pop),reach:60,U:170,F:160}:null;
  s+=gorilla(290,gy,{right,face:t<0.4?'normal':t<3.0?'worried':'calm',blink:t>0.6&&t<3.0,look:[.6,0]});}
 // 吹き出し：口から飛んで、ゴリラのまわりに積もる
 const n=G?22:22;
 for(let i=0;i<n;i++){const t0=0.15+i*0.12,k=G?cl((t-t0)/0.5):1;if(k<=0)continue;const [x2,y2,r,sc]=PILE[i];
  const x=lerp(800,x2,k),y=lerp(1400,y2,k)-Math.sin(Math.PI*k)*120;
  // 山から頭が出るところは、吹き出しを少しよける
  const dodge=G?seq(t,3.0,3.5):1;const nearHead=Math.abs(x2-290)<190&&y2<1770;
  s+=P.scribbleBubble(x+(nearHead?(x2<290?-130:130)*dodge:0),y+(nearHead?90*dodge:0),sc,i+11).replace('<g transform="','<g transform="rotate('+r*k+' '+x+' '+y+') ')}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F1ECF6',scene(t)),svgWrap('#F1ECF6',scene(DUR-0.1,false))).then(()=>console.log('ok'));
