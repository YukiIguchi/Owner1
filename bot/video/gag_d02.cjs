// 2日（火）これを ください。— 1本を指す → 店員が1本わたそうとする → 首をふる → トラックいっぱいのバナナを指す
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
function load(){let s='';for(let r=0;r<4;r++)for(let i=0;i<6-r;i++)s+=P.bananaBunch(14+i*42+r*21,-4-r*30,0.4);return s}
function scene(t,G=true){
 let s=P.skyBg('#BFE3F5','#EAF6FB')+P.building(80,1280,300,520,'#E6DCCB')+P.ground(1280,'#C9CED1','#A9B0B5');
 s+=P.truck(390,1290,1.25,{load:load(),w:440});
 // 店員：1本を手に取り、差し出す
 const give=seq(t,1.3,2.1),shock=t>4.2;
 const hand=[lerp(-70,-150,give),lerp(150,30,give)];
 s+=person(840,1490,1.2,{face:shock?'shock':'smile',apron:true,shirt:'#E8A33A',shirtLine:'#8A5A12',hair:'short',hand,sweat:shock?seq(t,4.2,4.8):0});
 const [bx,by]=[840+hand[0]*1.2,1490+hand[1]*1.2];
 s+=P.counter(560,1650,560);
 // 台の上：お皿に1本（店員が持ち上げる）、横にもバナナの房
 s+=P.bananaBunch(960,1650,0.6)+P.plate(700,1650,1);
 s+=give<0.05?P.banana(700,1630,0,0.9):P.banana(bx,by-10,-20,0.9);
 if(G){const shake=t>2.3&&t<3.3?Math.sin((t-2.3)*Math.PI*4)*18*Math.sin((t-2.3)*Math.PI):0;
  let right=null;
  if(t<2.2)right={tx:700,ty:1610,kind:'point',reach:110};                 // 1本を指す
  else if(t>3.3)right={tx:lerp(700,600,seq(t,3.3,4.0)),ty:lerp(1610,1110,seq(t,3.3,4.0)),kind:'point'};  // トラックを指す
  s+=gorilla(290,1560,{nod:shake,right,face:t>3.5?'happy':'normal',look:t<2.2?[.6,.5]:t>3.4?[.7,-.6]:[0,0],blink:(t%2.9)>2.8});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#BFE3F5',scene(t)),svgWrap('#BFE3F5',scene(DUR-0.1,false))).then(()=>console.log('ok'));
