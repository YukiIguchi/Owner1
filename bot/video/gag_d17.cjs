// 17日（水）在留カードを 見せて ください。— ゴリラは窓口の係。来た人がかばんをさがすと、物が次々に出て台に高く積み上がる → 最後にカード → 大きなはんこで机と物の山がぴょんとはねる
// （倫理：ゴリラは係。来た人をからかわない。来た人も笑っている）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const T=P.things;
// 出てくる物：[種類, 出る時刻, 山の中の位置(y), 大きさ, 角度]
const ITEMS=[['umbrella',0.3,1626,1.25,-4],['book',0.75,1566,1.35,3],['teddy',1.2,1462,1.3,0],['bento',1.65,1362,1.3,-3],['scarf',2.1,1306,1.3,4],['bottle',2.5,1240,1.25,0]];
const PX=690;
function scene(t,G=true){
 let s=P.wall('#E8EEF2')+P.R(0,700,1080,40,'#C7D3DC')+P.floor(1740,'#AEB9C2','#909CA6');
 s+=P.R(120,820,200,150,'#FFFFFF',P.sw(5))+P.R(140,840,160,20,'#9CC9E3')+P.R(140,875,160,10,'#C9D2D9')+P.R(140,900,120,10,'#C9D2D9');
 const jump=t>4.4?Math.max(0,Math.sin((t-4.4)/0.45*Math.PI))*(t<4.85?1:0):0;
 const jy=-40*jump;
 // 来た人（右）：かばんをさがす → カードを見せる → いっしょに笑う
 const showC=seq(t,3.0,3.6);
 s+=person(860,1460,1.2,{face:t<3.0?'smile':'happy',look:t<3.0?[-.6,.8]:[-.8,0],shirt:'#B59ACF',shirtLine:'#5E4A7A',hair:'long',hand:[lerp(-100,-75,showC),lerp(110,-150,showC)]});
 s+=P.toteBag(860-100*1.2,1460+120*1.2,1);
 if(G)s+=gorilla(280,1490,{face:t<4.2?'happy':'calm',look:[.7,-.3],blink:(t%3)>2.9&&t<4.2,right:t>3.8?(()=>{const k=seq(t,3.8,4.3);const press=t<4.35?seq(t,3.8,4.3):1-seq(t,4.6,5.0);return Object.assign(L.wristAt(280,1490,505,lerp(1330,1500,press)),{kind:'grip',item:P.stamp(),fixDeg:90})})():null});
 s+=`<g transform="translate(0,${jy})">`+P.counter(420,1660,700,'#D9D2C5','#9C8A6E');
 // 物の山
 ITEMS.forEach(([k,t0,y,sc,r],i)=>{const f=seq(t,t0,t0+0.45);if(f<=0)return;const bagX=740,bagY=1580;
  const x=lerp(bagX,PX,f),yy=lerp(bagY,y,f)-Math.sin(Math.PI*f)*160;
  s+=`<g transform="translate(${x},${yy}) rotate(${r*f})">${T[k](sc)}</g>`});
 s+=P.R(440,1650,140,10,'#FFFFFF',P.sw(3))+'</g>';
 // カード
 if(showC>0)s+=`<g transform="translate(${lerp(760,770,showC)},${lerp(1580,1230,showC)})">${P.idCard(1.15)}</g>`;
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E8EEF2',scene(t)),svgWrap('#E8EEF2',scene(DUR-0.1,false))).then(()=>console.log('ok'));
