// 33日（金）仕事が 終わりました。— 上司（コーヒーカップ）がひと口 → ゴリラが残像が見える速さで箱を片付ける（半透明で3つ）→ 箱がきれいに積まれている。カップからはまだ湯気。上司が目を丸くする
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.4;
// 箱：ちらかった位置 → きれいに積んだ位置
const BOX=[];{const r=P.rng(4);for(let i=0;i<12;i++){const c=i%3,row=Math.floor(i/3);BOX.push({x0:180+r()*620,y0:1640+r()*200,a0:r()*60-30,x1:470+c*104,y1:1640-(row+1)*82})}}
function scene(t,G=true){
 let s=P.wall('#E4DCCB')+P.R(0,560,1080,30,'#B9AC92')+P.floor(1700,'#B5A68C','#958670');
 s+=P.R(450,1650,330,24,'#A97C52',P.sw(5));
 // 上司：コーヒーをひと口 → 目を丸くする
 const sip=t<1.0,shock=t>3.0;
 const hand=sip?[-30,-30]:[-70,60];
 s+=person(880,1460,1.15,{face:shock?'shock':sip?'calm':'smile',cap:'#E2A23A',shirt:'#5D7FA6',shirtLine:'#33506F',hair:'short',hand,front:sip});
 const cx=880+hand[0]*1.15,cy=1460+hand[1]*1.15;
 s+=P.cup(cx-6,cy+10,0.75)+P.steam(cx-6,cy-30,t,1,80);
 // 箱
 BOX.forEach((b,i)=>{const k=seq(t,1.0+i*0.15,1.25+i*0.15);s+=`<g transform="translate(${lerp(b.x0,b.x1,k)},${lerp(b.y0,b.y1,k)}) rotate(${lerp(b.a0,0,k)})">${P.box(-50,-38,100,78)}</g>`});
 if(G){const fast=t>1.0&&t<3.0;
  if(fast){// 残像：同じゴリラを半透明で3つずらして描く
   const x=420+Math.sin(t*7)*170,dir=Math.cos(t*7)>=0?1:-1;
   [[-2,0.2],[-1,0.45],[0,1]].forEach(([k,op])=>{const gx=x+k*dir*140;s+=`<g opacity="${op}">${gorilla(gx,1560,{face:'happy',right:{tx:gx+330,ty:1560,kind:'open'},left:{tx:gx-100,ty:1500,kind:'open'}})}</g>`});
   }
  else s+=gorilla(t<1?290:300,1560,{face:t<1?'normal':'happy',right:t>3.2?{tx:620,ty:1420,kind:'thumb',fixDeg:-10,reach:40}:null,look:[.8,0]});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E4DCCB',scene(t)),svgWrap('#E4DCCB',scene(DUR-0.1,false))).then(()=>console.log('ok'));
