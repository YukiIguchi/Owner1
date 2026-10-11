// 51日（火）お弁当を 温めますか。— コンビニのレジ。店員が電子レンジを指して、首をかしげる → ゴリラがうなずく → 電子レンジが回る → 出てきたお弁当が、太陽のようにやさしく光る（光の線を広げる。点滅しない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const MX=500,MY=1440;   // 電子レンジ（左下の x、下の y）
function scene(t,G=true){
 let s=P.wall('#F4F6F0')+P.R(0,600,1080,50,'#3FA66B')+P.R(0,650,1080,24,'#E46B5B')+P.floor(1760,'#C9CFC4','#A9AFA4');
 s+=P.shelf(120,900,320,460,3)+P.shelf(700,900,330,300,2);
 const ask=t<1.5,spin=t>2.0&&t<3.5,out=seq(t,3.5,4.0);
 // 店員：電子レンジを指して首をかしげる → 温める → 取り出して見せる
 s+=P.counter(440,1640,660,'#E7DCC4','#B8AB93');
 s+=P.R(MX-10,MY,320,200,'#D6D0C2',P.sw(5));
 s+=P.microwave(MX,MY,{k:spin?(t-2.0)*240:0,on:spin?1:0,open:out,inner:P.bento(0.7)});
 const hold=out>0.05;
 const bx=lerp(MX+115,660,out),by=lerp(MY-80,1430,out);
 s+=person(860,1450,1.1,{face:hold?'happy':'smile',shirt:'#5B9A8B',shirtLine:'#2F5E52',hair:'short',cap:'#3FA66B',headRot:ask?lerp(0,14,seq(t,0.4,0.9)):0,
   hand:ask?[lerp(-70,-180,seq(t,0.2,0.7)),lerp(150,0,seq(t,0.2,0.7))]:hold?[(bx-860)/1.1+40,(by-1450)/1.1+30]:[-70,150],hk:ask&&t>0.6?'point':null});
 if(hold){s+=P.glow(bx,by,seq(t,3.8,5.0))+`<g transform="translate(${bx},${by})">${P.bento(1.0)}</g>`}
 if(G){const nod=t>1.5&&t<2.1?Math.abs(Math.sin((t-1.5)*Math.PI*3.3))*24:0;
  s+=gorilla(290,1560,{nodY:nod,face:hold?'happy':'normal',look:t<2.0?[.9,-.2]:[.9,-.4],blink:nod>10});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F4F6F0',scene(t)),svgWrap('#F4F6F0',scene(DUR-0.1,false))).then(()=>console.log('ok'));
