// 60日（木）予約を したいです。— 店の前の長い行列。最後尾にゴリラ。行列は画面の外まで続く → 0.3秒のフェード：家でゴリラが電話をかける → 次の日：ゴリラが行列の横を通り、店員に案内されてすぐに店へ。行列の人たちはふつうの顔（怒らせない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const QC=[['#C9746A','long'],['#5B7FB0','short'],['#6C8F5E','bun'],['#E8A33A','short'],['#7A6A9C','long'],['#4F86C6','short'],['#C98B5A','bun']];
function street(t,next){let s=P.skyBg('#CFE6F4','#EEF7FB')+P.R(0,820,1080,700,'#EADBC4',P.sw(6))+P.ground(1520,'#C9CED1','#A9B0B5');
 // 店（右の外へ続く）：しまの屋根とフォークとナイフの絵
 s+=P.awning(560,880,600,8)+P.R(700,1060,260,180,'#FFFFFF',`rx="16" ${P.sw(5)}`)+`<g transform="translate(830,1150) scale(1.6)">${P.forkKnife(1)}</g>`;
 s+=P.R(140,1020,280,240,'#CFE6F5',P.sw(6));
 // 行列（右の画面の外から、左のほうへ）
 QC.forEach(([c,h],i)=>{const x=1060-i*92;s+=person(x,1440,0.7,{face:next?'smile':'neutral',shirt:c,shirtLine:'#333',hair:h,look:next?[-1,0]:[1,0],hand:[-50,130]})});
 return s}
function home(t,G){let s=P.wall('#F2E3EC')+P.floor(1760,'#C9A9B9','#A989A0')+P.R(140,1000,300,300,'#CFE6F5',P.sw(6));
 s+=P.calendar7(450,900,420,{marks:{4:P.forkKnife(0.9)},today:3});
 s+=P.R(560,1520,480,240,'#7FA7D6',`rx="40" ${P.sw(6)}`);
 if(G){const left={tx:lerp(100,170,seq(t,2.0,2.3)),ty:lerp(1800,1500,seq(t,2.0,2.3)),kind:'grip',item:`<g transform="translate(40,0) rotate(90)">${P.phone(0,0,1.0)}</g>`,fixDeg:-80,reach:30};
  s+=gorilla(300,1560,{left,face:'happy',m:t>2.3?Math.abs(Math.sin(t*9))*0.4:0,look:[.6,-.4]})}
 return s}
function scene(t,G=true){
 const f1=cl((t-1.85)/0.3),f2=cl((t-2.85)/0.3);
 const day1=()=>{let s=street(t,false);if(G)s+=gorilla(270,1560,{face:'worried',look:[1,-.2],wet:0.5,blink:(t%2.4)>2.3});return s};
 const day2=()=>{let s=street(t,true);
  const go=seq(t,3.3,5.0);
  s+=person(lerp(900,880,go),1460,1.1,{face:'happy',apron:true,shirt:'#E46B5B',shirtLine:'#8E2E25',hair:'short',hand:[lerp(-70,-150,seq(t,3.1,3.4)),lerp(150,60,seq(t,3.1,3.4))],hk:'open'});
  if(G)s+=gorilla(lerp(270,600,go),1560-Math.abs(Math.sin(t*7))*12*(go>0&&go<1?1:0),{face:'happy',look:[1,-.2]});
  return s};
 if(t<1.85)return day1();
 if(f1<1)return day1()+`<g opacity="${f1}">${home(t,G)}</g>`;
 if(t<2.85)return home(t,G);
 if(f2<1)return home(t,G)+`<g opacity="${f2}">${day2()}</g>`;
 return day2()}
L.renderGag(OUT,DUR,t=>svgWrap('#CFE6F4',scene(t)),svgWrap('#CFE6F4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
