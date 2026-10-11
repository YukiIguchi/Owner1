// 58日（火）この 薬は ありますか。— 薬局。スマホの画面（薬の箱の写真の絵）を見せる → 薬剤師がはしごで高い棚を探し、見つける → 箱を差し出し、ゴリラがおじぎ
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const COLS=['#E46B5B','#3FA66B','#F2A93B','#7A4FA8','#5B7FB0'];
function shelves(t){let s=P.R(590,700,430,1040,'#E8D8BE',P.sw(6));for(let r=0;r<5;r++){const y=700+r*200;s+=P.R(590,y+186,430,14,'#B98A5E',P.sw(4));
  for(let c=0;c<4;c++){const top=r===0&&c===2;if(top&&t>3.4)continue;const col=top?'#4F86C6':COLS[(r*3+c)%5];s+=`<g transform="translate(${650+c*100},${y+150})">${P.medBox(0.85,col)}</g>`}}
 return s}
function scene(t,G=true){
 let s=P.wall('#EAF4F1')+P.R(0,600,1080,30,'#3FA66B')+P.floor(1740,'#C2D4CE','#A2B4AE')+P.crossSign(360,820,0.9);
 s+=shelves(t)+P.ladder(690,1740,900,110,0);
 // 薬剤師：はしごを上る → 探す → 見つける → 下りて、差し出す
 const up=seq(t,1.5,2.4),down=seq(t,3.5,4.1),give=seq(t,4.1,4.6);
 const px=lerp(lerp(850,745,up),lerp(745,700,down),down>0?1:0),py=lerp(lerp(1460,1000,up),1460,down);
 const look=t>2.4&&t<3.3?[Math.sin((t-2.4)*8),-.2]:[-1,0];
 const hasBox=t>3.4;
 const hand=give>0?[lerp(-70,-170,give),lerp(150,40,give)]:hasBox&&down<1?[-60,-20]:[-70,150];
 s+=person(px,py,1.05,{face:t>3.3?'happy':'neutral',coat:true,shirt:'#F4F6F8',shirtLine:'#9AA6B2',hair:'long',look,hand,hand2:t>2.5&&t<3.4?[40,-140]:null});
 if(hasBox)s+=`<g transform="translate(${px+hand[0]*1.05},${py+hand[1]*1.05-20})">${P.medBox(0.85,'#4F86C6')}</g>`;
 if(G){const show=t<4.2;const bow=seq(t,4.7,5.2)*(1-seq(t,5.6,5.8));
  const right=show?{tx:lerp(500,570,seq(t,0.1,0.6)),ty:lerp(1700,1400,seq(t,0.1,0.6)),kind:'grip',fixDeg:-90,reach:40,item:`<g transform="translate(150,0) rotate(90)">${P.phonePhoto(1.05)}</g>`}:null;
  s+=gorilla(290,1560,{right,rot:30*bow,dy:60*bow,face:bow>0.3?'sleep':t>4.2?'happy':'normal',look:[.8,-.4]});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EAF4F1',scene(t)),svgWrap('#EAF4F1',scene(DUR-0.1,false))).then(()=>console.log('ok'));
