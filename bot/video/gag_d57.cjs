// 57日（月）きのうは ありがとう ございました。— 場面1（きのうの回想。セピア色＋角の丸いわく）：雨の中、同僚がゴリラにかさを貸す → 場面2（今日、ふつうの色）：かさと、巨大なバナナの房を一緒に返す。同僚が笑う
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
function yesterday(t){let s=P.skyBg('#9FB0C2','#C9D3DC')+P.building(80,1500,420,700,'#D9D2C5','#B9C9D6')+P.ground(1500,'#9AA0A3','#7E8588');
 const give=seq(t,0.4,1.1),open=seq(t,1.2,1.6);
 s+=person(790,1470,1.15,{face:'smile',shirt:'#6C8F5E',shirtLine:'#3D5A33',hair:'short',hand:give<1?[lerp(-70,-180,give),lerp(40,60,give)]:[-70,150],hand2:[40,0]});
 s+=P.umbrellaOpen(790+40*1.15,1470,1.15,'#E46B5B');
 if(give<1)s+=`<g transform="translate(${790+lerp(-70,-180,give)*1.15},${1470+lerp(40,60,give)*1.15}) rotate(${lerp(10,-30,give)})">${P.umbrellaClosed(1.3)}</g>`;
 let right=null;if(give>=1){right={tx:520,ty:1500,kind:'grip',reach:40,fixDeg:-90}}
 s+=gorilla(290,1560,{right,face:give<1?'worried':'happy',wet:give<1?0.8:0.4,look:[.8,-.2]});
 if(give>=1)s+=open<1?`<g transform="translate(520,1480)">${P.umbrellaClosed(1.3)}</g>`:P.umbrellaOpen(520,1500,1.1,'#5B7FB0');
 return s+P.rain(t,1)}
function today(t,G){let s=P.office({wallC:'#F6F1E6'})+P.desk(560,1720,460,'#C89B6D');
 const give=seq(t,2.6,3.4),laugh=t>3.6;
 s+=person(840,1470,1.15,{face:laugh?'happy':'smile',shirt:'#6C8F5E',shirtLine:'#3D5A33',hair:'short',hand:give>0.6?[-160,60]:[-70,150],hand2:give>0.6?[-40,80]:null});
 if(G){const right=Object.assign(L.wristAt(290,1560,lerp(500,610,give),lerp(1640,1560,give)),{kind:'grip',fixDeg:-80,item:`<g transform="translate(110,30) rotate(80)">${P.umbrellaClosed(1.4)}</g>`});
  s+=gorilla(290,1560,{right,face:'happy',look:[.8,0]});
  s+=P.bananaBunch(lerp(470,620,give),lerp(1760,1690,give),lerp(2.2,2.4,give),7);}
 else s+=`<g transform="translate(800,1712) rotate(-90)">${P.bananaBunch(0,0,1.9,7)}</g>`+`<g transform="translate(860,1700) rotate(-75)">${P.umbrellaClosed(1.4)}</g>`;
 return s}
function scene(t,G=true){const f=cl((t-1.85)/0.3);
 const y=`<g filter="url(#sepia)">${yesterday(Math.min(t,2.15))}</g>`+P.memoryFrame(1);
 if(f<=0)return `<defs>${P.sepiaDef}</defs>`+y;
 if(f>=1)return today(t,G);
 return `<defs>${P.sepiaDef}</defs>`+y+`<g opacity="${f}">${today(t,G)}</g>`}
L.renderGag(OUT,DUR,t=>svgWrap('#F6F1E6',scene(t)),svgWrap('#F6F1E6',scene(DUR-0.1,false))).then(()=>console.log('ok'));
