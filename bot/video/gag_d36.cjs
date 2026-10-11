// 36日（月）はじめまして。〇〇から 来ました。— 入り口のドアを通ろうとするが、肩が広すぎてつかえる → 体を横にして少しずつ入る → 入れた瞬間、同僚たちが拍手 → ていねいにおじぎ
// （倫理：出身地は見せない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const DL=170,DR=450,DT=1120;      // 入り口（左右と上）
function scene(t,G=true){
 // ろうか（入り口の向こう）
 let s=P.R(0,0,1080,1920,'#DCE6EE')+P.R(0,1500,1080,420,'#C2CDD6');
 // ゴリラ：入り口の向こう（かべにかくれる）→ 横向きで少しずつ → 中へ
 const squeeze=seq(t,2.0,3.3),inside=t>=3.4;
 const push=t<2.0?Math.max(0,Math.sin(t*Math.PI*2.2))*16:0;
 let gor='';
 if(G&&!inside){const sx=lerp(1,0.5,squeeze);
  gor=`<clipPath id="door"><rect x="${DL}" y="${DT}" width="${DR-DL}" height="900"/></clipPath><g clip-path="url(#door)"><g transform="translate(310,0) scale(${sx},1) translate(-310,0)">${gorilla(310,1600-push+lerp(0,-20,squeeze),{face:squeeze>0?'calm':'worried',s:0.95,look:[0,0]})}</g></g>`}
 s+=gor;
 // こちらの部屋のかべ（入り口のまわり）
 s+=`<path d="M0 0 H1080 V1920 H${DR} V${DT} H${DL} V1920 H0 Z" fill="#F1E9DA"/>`+P.R(DL-20,DT-20,DR-DL+40,1920-DT+20,'none',`stroke="#8A6A4A" stroke-width="20"`)+P.R(0,1740,DL-20,180,'#C9B79C')+P.R(DR+20,1740,1080-DR,180,'#C9B79C');
 s+=P.R(560,700,300,220,'#CFE6F5',P.sw(7))+`<path d="M710 700 V920" stroke="#F7F3EA" stroke-width="10"/>`;
 // 同僚2人：拍手
 const clap=t>3.5&&t<5.0;const cl2=clap?Math.abs(Math.sin((t-3.5)*Math.PI*3.2)):0;
 [[700,'#5B7FB0','short'],[880,'#C9746A','long']].forEach(([x,c,h],i)=>{
  s+=person(x,1500,1.0,{face:t<3.4?'neutral':'happy',shirt:c,shirtLine:'#333',hair:h,look:[-1,0],
   hand:clap?[-30-cl2*30,40]:[-70,150],hand2:clap?[20+cl2*30,40]:null,hk:clap?'open':null,hk2:clap?'open':null})});
 if(G&&inside){const pop=seq(t,3.4,3.7),bow=seq(t,4.6,5.1)*(1-seq(t,5.5,5.8));
  s+=gorilla(330,1560-Math.sin(pop*Math.PI)*30,{rot:34*bow,dy:66*bow,face:bow>0.3?'sleep':'happy',look:[.6,0]});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F1E9DA',scene(t)),svgWrap('#F1E9DA',scene(DUR-0.1,false))).then(()=>console.log('ok'));
