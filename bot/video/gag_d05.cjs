// 5日（金）遅れて すみません。— 窓の外からロープで飛びこんでくる → ていねいにおじぎ
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=6.0;
const AX=330,AY=300;      // ロープの支点（画面の上の外）
const WX=110,WY=760,WW=300,WH=360;
function scene(t,G=true){
 let s=P.wall('#E9E4F0')+P.floor(1740,'#A9A3B8','#8C86A0');
 s+=P.clock(780,900,92,9,5);
 // 上司：時計を見ている → びっくり → にっこりうなずく
 const face=t<2.1?'neutral':t<4.4?'shock':'happy';
 s+=person(830,1490,1.2,{face,glasses:true,shirt:'#7A6A9C',shirtLine:'#4A3D66',hair:'short',hairColor:'#6B6B6B',look:t<1.9?[-.3,-1]:[-1,0],headRot:t>4.6&&t<5.6?Math.sin((t-4.6)*6)*6:0,hand:[-90,90]});
 s+=P.table(600,1600,440,160,'#B8A27E')+P.cup(720,1600,0.9);
 // 飛びこみ：窓の外（小さい）→ 手前へ（大きい）
 const k=seq(t,0.5,2.0),land=t>=2.0;
 const gs=lerp(0.42,1,k),gx=lerp(270,290,k),gy=lerp(1020,1560,k)-120*Math.sin(Math.PI*k);
 const bounce=land?Math.max(0,Math.sin((t-2.0)*9))*20*Math.max(0,1-(t-2.0)/0.5):0;
 const hand=[gx+(175+30)*gs,gy-(150)*gs];          // ロープをにぎる右手
 const bow=seq(t,3.2,3.9)*(1-seq(t,4.6,5.2));
 const rope=(ex,ey)=>`<path d="M${AX} ${AY} L${ex} ${ey}" stroke="#8A6A3B" stroke-width="16" stroke-linecap="round"/><path d="M${AX} ${AY} L${ex} ${ey}" stroke="#C9A46A" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 10"/>`;
 const gor=()=>{const right=land?(t<2.6?{tx:490,ty:1440,kind:'grip',reach:60}:null):{tx:hand[0]/gs-gx/gs+gx,ty:hand[1]/gs-gy/gs+gy,kind:'grip',reach:50};
  const f=t<2.0?'happy':t<3.2?'shock':bow>0.3?'sleep':t>5.0?'calm':'worried';
  return gorilla(land?290:gx,land?1560+bounce:gy,{s:gs,right,rot:land?36*bow:0,dy:70*bow,face:f,look:[.8,0]})};
 const outside=k<0.3;
 s+=P.R(WX,WY,WW,WH,'#BFE3F5');
 if(G&&outside)s+=`<clipPath id="wc"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}"/></clipPath><g clip-path="url(#wc)">${rope(hand[0],hand[1]+40*gs)}${gor()}</g>`;
 s+=P.windowFrame(WX,WY,WW,WH,{sky:'none'});
 if(G&&!outside){s+=rope(land?AX+170:hand[0],land?1520:hand[1]+40*gs)+gor()}
 if(!G)s+=rope(AX+170,1520);
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E9E4F0',scene(t)),svgWrap('#E9E4F0',scene(DUR-0.1,false))).then(()=>console.log('ok'));
