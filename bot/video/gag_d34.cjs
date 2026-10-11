// 34日（土）となりに 引っ越して きました。よろしく おねがいします。— ドアをノック → 力が強すぎて、ドアがゆっくり内側にたおれる → 中の人がびっくり、ゴリラがあわててドアを立て直す → おみやげを差し出し、中の人が笑顔で受け取る
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const DX=540,DB=1720,DW=240,DH=520;   // ドア（左下の x、下の y、幅、高さ）
function scene(t,G=true){
 let s=P.skyBg('#CFE6F4','#EEF7FB')+P.R(420,860,700,1100,'#E9D7B8',P.sw())+`<path d="M400 880 L760 700 L1120 880 Z" fill="#6C8FB8" stroke="#2B2D33" stroke-width="6"/>`+P.ground(1720,'#C9CED1','#A9B0B5');
 s+=P.R(DX-14,DB-DH-14,DW+28,DH+14,'#8A6A4A',P.sw(6))+P.R(DX,DB-DH,DW,DH,'#5A4A3C');
 // 中の人（ドアが開くと見える）
 const fall=seq(t,1.6,2.5)*(1-seq(t,3.2,3.9));
 const recv=seq(t,4.3,4.9);
 const pface=t<2.4?'neutral':t<4.2?'shock':'happy';
 const out=seq(t,3.9,4.3);   // ドアを立て直したあと、中の人が外に出てくる
 const who=person(lerp(DX+DW/2+20,DX+DW/2+120,out),lerp(1450,1470,out),lerp(1.05,1.12,out),{face:pface,shirt:'#C9746A',shirtLine:'#7A3D35',hair:'long',hand:recv>0?[lerp(-70,-130,recv),lerp(150,40,recv)]:[-70,150],sweat:t>2.4&&t<4.0?0.8:0});
 if(out<0.02)s+=who;
 // ドア：内側へたおれる（下を軸に、たてが縮む）→ 立て直す
 const h=DH*Math.cos(fall*Math.PI*0.47);
 s+=P.R(DX,DB-h,DW,h,'#B98A5E',P.sw(5))+(fall<0.3?`<circle cx="${DX+DW-34}" cy="${DB-h/2}" r="11" fill="#E8C35A" ${P.sw(4)}/>`:'');
 s+=P.R(DX-14,DB-DH-14,14,DH+14,'#8A6A4A',P.sw(5));
 if(out>=0.02)s+=who;
 if(G){let right=null,left=null;
  // ノック（2回）
  if(t<1.7){const kn=t>0.5?Math.max(0,Math.sin((t-0.5)*Math.PI*3.4)):0;right={tx:DX+40-kn*30,ty:1380,kind:'grip',reach:60}}
  else if(t>2.9&&t<3.95){right={tx:DX+DW/2,ty:DB-h-10,kind:'grip',reach:50,U:175,F:165}}
  else if(t>=4.0){const give=seq(t,4.0,4.5);right={tx:lerp(500,DX+30,give),ty:lerp(1700,1540,give),kind:'grip',reach:60,item:recv<0.5?`<g transform="translate(90,-10)">${P.gift(0.9)}</g>`:''}}
  const giftL=t<4.0?`<g transform="translate(330,1700)">${P.gift(1)}</g>`:'';
  if(t<4.0)left={tx:330,ty:1700,kind:'open',reach:40,U:170,F:160};
  s+=gorilla(300,1560,{right,left,mid:giftL,face:t<1.6?'happy':t<4.0?'shock':'happy',look:[.8,-.2]});}
 if(recv>=0.5||!G){const ph=[DX+DW/2+120+(-130)*1.12,1470+40*1.12];s+=`<g transform="translate(${ph[0]-10},${ph[1]-30})">${P.gift(0.9)}</g>`}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#CFE6F4',scene(t)),svgWrap('#CFE6F4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
