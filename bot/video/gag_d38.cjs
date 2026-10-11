// 38日（水）通訳は いますか。— ゴリラは窓口の係。来た人が困った顔（頭の上にぐるぐるの線）→ ゴリラがタブレットを出すと、画面に通訳の人の顔が出て手をふる → 来た人がほっとして笑う
// （倫理：ゴリラは係）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
function scene(t,G=true){
 let s=P.wall('#E8EEF2')+P.R(0,700,1080,40,'#C7D3DC')+P.floor(1740,'#AEB9C2','#909CA6');
 s+=P.R(120,820,200,150,'#FFFFFF',P.sw(5))+P.R(140,840,160,20,'#9CC9E3')+P.R(140,875,160,10,'#C9D2D9');
 const relief=t>3.6;
 s+=person(835,1450,1.2,{face:relief?'happy':'worried',shirt:'#B59ACF',shirtLine:'#5E4A7A',hair:'short',look:t>2.4?[-1,0]:[0,-.6],hand:[-70,150]});
 if(!relief)s+=`<g opacity="${1-cl((t-3.2)/0.4)}">${P.swirl(835,1260,t*120,1.2)}</g>`;
 if(G){const up=seq(t,2.0,2.6);
  const wave=Math.sin(t*7)*14;
  const face=person(0,30,0.55,{face:'smile',shirt:'#3FA66B',shirtLine:'#2B6E45',hair:'long',hand2:[60+wave*0.3,-40-Math.abs(wave)],hk2:'open'});
  const item=`<g transform="translate(90,0) rotate(${-lerp(80,-10,up)})"><g transform="translate(40,-30)">${P.tablet(1.05,up>0.6?face:'')}</g></g>`;
  const right=t>1.8?{tx:lerp(480,560,up),ty:lerp(1680,1520,up),kind:'grip',item,fixDeg:lerp(80,-10,up),reach:60}:null;
  s+=gorilla(280,1490,{right,face:'happy',look:[.8,-.2],blink:(t%3)>2.9});}
 s+=P.counter(420,1660,700,'#D9D2C5','#9C8A6E');
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E8EEF2',scene(t)),svgWrap('#E8EEF2',scene(DUR-0.1,false))).then(()=>console.log('ok'));
