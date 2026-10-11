// 48日（土）回覧板です。— となりの人が回覧板（板にはさんだ紙、文字なし）を渡す → ゴリラが読む（目を動かす）→ フリスビーのように投げ、次の家の郵便受けにぴたりと入る → となりの人が拍手
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const MB=[640,1300];   // 郵便受けの口
function scene(t,G=true){
 let s=P.skyBg('#CDE7F5','#EEF7FB')+P.R(0,1320,1080,600,'#C9CED1');
 s+=P.house(200,1330,1.0,{roof:'#6C8FB8'})+P.house(640,1330,1.0,{roof:'#C4553E'})+P.house(1020,1330,1.0,{roof:'#6C8F5E'});
 s+=P.mailbox(MB[0]+90,1420,0.75);
 // となりの人（右）：渡す → 拍手
 const give=seq(t,0.2,1.0),clap=t>4.4;const cl2=clap?Math.abs(Math.sin((t-4.4)*Math.PI*3.2)):0;
 s+=person(880,1470,1.15,{face:t>3.8?'happy':'smile',shirt:'#E8A33A',shirtLine:'#8A5A12',hair:'bun',
   hand:clap?[-30-cl2*30,40]:t<1.3?[lerp(-70,-170,give),lerp(150,40,give)]:[-70,150],hand2:clap?[20+cl2*30,40]:null,hk:clap?'open':null,hk2:clap?'open':null});
 const boardItem=`<g transform="translate(80,-10) rotate(80)">${P.clipboard(0.9)}</g>`;
 if(t<1.2)s+=`<g transform="translate(${880-170*1.15*give+(1-give)*-80},${1470+40*1.15})">${P.clipboard(0.9)}</g>`;
 // 投げた回覧板：回りながら郵便受けへ
 const fl=seq(t,3.0,4.0);
 if(G&&t>=3.0&&t<4.05){const x=lerp(560,MB[0]+90,fl),y=lerp(1360,MB[1]-120*0.75,fl)-260*Math.sin(Math.PI*fl);s+=`<g transform="translate(${x},${y}) scale(${lerp(1,0.4,fl)},${lerp(0.5,0.25,fl)}) rotate(${fl*720})">${P.clipboard(0.9)}</g>`}
 if(G){let right=null;
  if(t>1.0&&t<2.6)right={tx:lerp(620,520,seq(t,1.0,1.4)),ty:lerp(1530,1500,seq(t,1.0,1.4)),kind:'grip',item:boardItem,fixDeg:-80,reach:60};
  else if(t>=2.6&&t<3.0)right={tx:lerp(520,300,seq(t,2.6,2.95)),ty:lerp(1500,1420,seq(t,2.6,2.95)),kind:'grip',item:boardItem,fixDeg:-80,reach:60};
  else if(t>=3.0&&t<3.6)right={tx:lerp(300,700,seq(t,3.0,3.3)),ty:lerp(1420,1380,seq(t,3.0,3.3)),kind:'open',reach:60};
  const read=t>1.4&&t<2.6;
  s+=gorilla(290,1560,{right,face:t>4.0?'happy':'normal',look:read?[Math.sin((t-1.4)*7)*0.8,0.7]:t>3.0&&t<4.1?[.7,-.6]:[.8,0],blink:false});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#CDE7F5',scene(t)),svgWrap('#CDE7F5',scene(DUR-0.1,false))).then(()=>console.log('ok'));
