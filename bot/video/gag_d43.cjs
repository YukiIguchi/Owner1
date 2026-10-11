// 43日（月）すみません、ちょっと いいですか。— ヘッドホンで集中している同僚（回るいす）の肩を、指1本でそっとたたく → 力が強すぎて、いすがくるくる回る → 止まった同僚が目を回しながらも、笑ってヘッドホンを外す
// （回転は残像と線で見せる。点滅のような速い切りかえはしない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const PX=800,PY=1450,PS=1.1;
function scene(t,G=true){
 let s=P.office({wallC:'#EEF0F5'});
 s+=P.desk(600,1640,480,'#C89B6D')+P.monitor(960,1640,0.9);
 const tap=seq(t,0.3,1.2),hit=t>1.3;
 const spinK=seq(t,1.35,1.6)*(1-seq(t,3.0,3.6));   // 回る強さ
 const done=t>3.6;
 const off=seq(t,4.2,4.8);
 s+=P.swivelChair(PX,1640,1.0);
 const face=t<1.3?'neutral':done?'dizzy':'shock';
 const who=(sx,op)=>`<g opacity="${op}" transform="translate(${PX},0) scale(${sx},1) translate(${-PX},0)">${person(PX,PY,PS,{face:done&&off>0.6?'happy':face,headphones:off<0.5,shirt:'#6C8F5E',shirtLine:'#3D5A33',hair:'short',look:t<1.3?[1,.4]:[0,0],
   hand:off>0?[lerp(-70,-84,off),lerp(150,-150,off)]:[-70,150],hand2:off>0?[lerp(62,84,off),lerp(150,-150,off)]:null})}</g>`;
 if(spinK>0.02){const th=t*Math.PI*2*(1.2+2.4*spinK);   // ゆっくり見える速さ
  s+=who(Math.cos(th)*0.6+0.4*Math.sign(Math.cos(th)),0.45)+who(1,0.55*spinK)+P.spinLines(PX,PY+20,spinK)}
 else s+=who(1,1);
 if(off>0.5)s+=`<g transform="translate(${PX},${PY-(110+lerp(0,90,off))*PS}) scale(${PS})"><path d="M-70 40 Q-74 -50 0 -50 Q74 -50 70 40" stroke="#2E3440" stroke-width="12" fill="none"/>${P.R(-86,14,26,50,'#4C86F5',`rx="10" ${P.sw(5)}`)}${P.R(60,14,26,50,'#4C86F5',`rx="10" ${P.sw(5)}`)}</g>`;
 if(G){const right=t>0.2&&t<1.6?{tx:lerp(560,PX-62*PS-6,tap)+(t>1.1&&t<1.3?6:0),ty:lerp(1700,PY+20,tap),kind:'point',reach:120}:null;
  s+=gorilla(290,1560,{right,face:t<1.3?'normal':t<3.6?'shock':'happy',look:t<3.6?[.9,-.2]:[.8,0],blink:(t%2.8)>2.7&&t>3.6});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EEF0F5',scene(t)),svgWrap('#EEF0F5',scene(DUR-0.1,false))).then(()=>console.log('ok'));
