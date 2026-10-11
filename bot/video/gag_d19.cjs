// 19日（金）休みを とっても いいですか。— 机の上の書類の塔がゆらゆら → カレンダー（7つの四角）とビーチボールを持ち上げて見せる → 上司が塔とゴリラを見くらべてうなずく → 両手を上げて喜ぶと、塔が少しかたむく（たおれない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
// 手に持つカレンダー（手の向きにかかわらず、まっすぐ見せる）
const calItem=deg=>`<g transform="translate(60,0) rotate(${-deg})"><g transform="translate(-130,-130)">${P.calendar7(0,0,240,{marks:{5:P.sunIcon(0.75)},today:5})}</g></g>`;
const ballItem=deg=>`<g transform="translate(70,0) rotate(${-deg})">${P.beachBall(0,-40,1)}</g>`;
function scene(t,G=true){
 let s=P.office();
 const sway=t<1.6?Math.sin(t*5)*3:0, tilt=seq(t,4.6,5.1)*5+(t>5.1?Math.sin((t-5.1)*10)*1.5*Math.max(0,1-(t-5.1)*2):0);
 // 上司：塔を見る → ゴリラを見る → ゆっくりうなずく
 const nod=t>3.6&&t<4.6?Math.abs(Math.sin((t-3.6)*Math.PI*2))*14:0;
 const look=t<3.0?[0,0]:t<3.4?[-.4,-1]:[-1,0];
 s+=person(885,1470,1.15,{face:t>3.6?'happy':'neutral',glasses:true,shirt:'#7A6A9C',shirtLine:'#4A3D66',hair:'short',hairColor:'#6B6B6B',look,headDY:nod,hand:[-70,150]});
 // ゴリラの机と書類の塔
 s+=P.desk(380,1700,440,'#C89B6D');
 s+=P.paperTower(735,1700,21,sway+tilt,110);
 if(G){const show=seq(t,1.6,2.3),hurray=seq(t,4.5,4.9);
  let right=null,left=null;
  if(t>1.6){const rd=-50,ld=-130;
   right={tx:lerp(600,640,hurray),ty:lerp(lerp(1700,1340,show),1200,hurray),kind:'grip',item:calItem(rd),fixDeg:rd,reach:60,U:lerp(150,180,hurray),F:lerp(140,170,hurray)};
   left={tx:lerp(270,250,hurray),ty:lerp(lerp(1700,1340,show),1200,hurray),kind:'grip',item:ballItem(ld),fixDeg:ld,reach:60,U:lerp(150,180,hurray),F:lerp(140,170,hurray)}}
  s+=gorilla(400,1560,{right,left,face:t<1.6?'worried':t<3.6?'normal':'happy',look:t<1.6?[.8,-.8]:[.7,0],blink:(t%2.8)>2.7});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EAF0F4',scene(t)),svgWrap('#EAF0F4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
