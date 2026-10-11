// 13日（土）ごみは 朝 8時までに 出します。— 時計は7時59分。家から全力で走り、遠くから袋を投げて収集車にぴたりと入る → 8時ちょうど
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
// 手に持つごみ袋（手の向き fixDeg=70 のとき、まっすぐ下にたれる）
const heldBag=`<g transform="translate(70,0) rotate(-70)">${P.garbageBag(0,80,0.7)}</g>`;
function scene(t,G=true){
 let s=P.skyBg('#C9E6F4','#EEF7FB')+P.ground(1500,'#C9CED1','#A9B0B5')+P.R(0,1500,1080,24,'#9AA3A8');
 // 家の玄関（左）
 s+=P.R(60,760,330,740,'#F2D9B8',P.sw())+`<path d="M30 780 L225 600 L420 780 Z" fill="#C4553E" stroke="#2B2D33" stroke-width="6"/>`;
 const doorOpen=cl(t/0.4);
 s+=P.door(150,1500,150,300,{open:doorOpen*0.9});
 // 大きな時計：7:59 → 8:00
 const m=59+seq(t,3.4,3.9);
 s+=P.clock(560,880,150,7,m%60===0?60:m);
 // 収集車：発車しかける → 袋が入ったら止まる
 const go=seq(t,1.0,3.5);const tx=lerp(560,620,go);
 s+=P.garbageTruck(tx,1500,0.68);
 // 作業員（車のうしろ）：親指を立てる
 const thumb=t>4.0;
 s+=person(tx-85,1500-190*0.62,0.62,{face:thumb?'happy':'neutral',cap:'#3FA66B',shirt:'#E8A33A',shirtLine:'#8A5A12',hair:'short',hand:thumb?[-80,-20]:[-60,140],thumb});
 // 投げた袋：放物線で車の投入口へ
 const fly=seq(t,2.9,3.6),hop=[tx-28,1500-110*0.68];
 if(G&&t>2.9&&t<3.62){const bx=lerp(560,hop[0],fly),by=lerp(1240,hop[1],fly)-360*Math.sin(Math.PI*fly);s+=P.garbageBag(bx,by,0.55)}
 if(t>=3.62||!G)s+=P.garbageBag(hop[0]+6,hop[1]-14,0.42);
 if(G){const run=seq(t,0.6,2.5);const gx=lerp(200,380,run);
  const bob=t>0.6&&t<2.6?-Math.abs(Math.sin(t*11))*22:0;
  let right;
  if(t<2.4)right={tx:gx+250,ty:1700,kind:'grip',item:heldBag,reach:40,fixDeg:70};
  else if(t<2.9)right={tx:lerp(gx+250,gx+150,seq(t,2.4,2.8)),ty:lerp(1700,1220,seq(t,2.4,2.8)),kind:'grip',item:heldBag,reach:40,fixDeg:lerp(70,-80,seq(t,2.4,2.8))};
  else right={tx:lerp(gx+150,gx+420,seq(t,2.9,3.2)),ty:lerp(1220,1350,seq(t,2.9,3.2)),kind:'open',reach:60};
  s+=gorilla(gx,1560+bob,{right,face:t<2.5?'worried':t<3.6?'normal':'happy',look:t>2.8&&t<3.8?[.9,-.3]:[.8,-.5],blink:false});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#C9E6F4',scene(t)),svgWrap('#C9E6F4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
