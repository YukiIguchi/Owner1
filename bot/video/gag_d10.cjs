// 10日（水）熱が あります。— 体温計の目盛りがぐんぐん上がり、頭から湯気 → 医者がやさしくおでこに手を当てる
// （病気の回：からかわない。やさしい笑い）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
function scene(t,G=true){
 let s=P.wall('#E3F1EC')+P.R(0,1180,1080,40,'#C7E0D6')+P.floor(1740,'#BFD3CB','#9DB8AD');
 s+=P.crossSign(800,860,1.1)+P.R(140,700,250,330,'#FFFFFF',P.sw(6))+P.R(150,710,230,140,'#D7ECF5')+P.R(150,860,230,160,'#D7ECF5');
 // 医者：うなずいて待つ → 目盛りを見て目を丸く → 近づいて、やさしくおでこに手を当てる
 const near=seq(t,3.0,3.8);
 const face=t<2.6?'smile':t<3.2?'shock':'worried';
 const nod=t<1.2?Math.sin(t*7)*5:0;
 const nx=G?near:0;
 const doc=person(lerp(830,720,nx),1480,1.2,{face,coat:true,steth:true,shirt:'#F4F6F8',shirtLine:'#9AA6B2',hair:'short',headRot:nod,look:t>2.2&&t<3.2?[-1,.2]:[-.6,0],
   hand:nx>0.05?[lerp(-70,-290,nx),lerp(150,-50,nx)]:[-70,150],hk:nx>0.6?'open':null});
 if(nx<0.02)s+=doc;
 if(G){const rise=seq(t,1.0,2.5);
  const steamK=cl((t-1.4)/1.2);
  s+=gorilla(290,1560,{face:'calm',flush:rise,blink:false,look:[.6,0]});
  s+=P.thermometer(318,1558,300,-8,0.12+0.86*rise);
  s+=`<g opacity="${steamK}">${P.steam(250,1290,t*0.6,1,150,{c:'#8C99A6',w:10})}${P.steam(335,1280,t*0.6+0.4,1,150,{c:'#8C99A6',w:10})}</g>`;
  if(nx>=0.02)s+=doc;}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E3F1EC',scene(t)),svgWrap('#E3F1EC',scene(DUR-0.1,false))).then(()=>console.log('ok'));
