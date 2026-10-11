// 32日（木）大雨の とき、川に 近づかないで ください。— かさを持った人が川を見に行こうとする → ゴリラが首を横にふり、両手でそっと持ち上げる → 家の中に入れる。うしろで川の水位が上がっていく
// （防災の回：笑いにしない。水は「上がる」ことだけを見せる。人が流される場面は描かない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
function scene(t,G=true){
 let s=P.skyBg('#8E9DB0','#B9C4D0');
 // 奥の川：岸の石がきと目盛りの線。水位が少しずつ上がる
 const lvl=lerp(1230,1120,seq(t,0.3,5.6));
 s+=P.R(0,1000,1080,320,'#8C8F86',P.sw(5));for(let i=0;i<4;i++)s+=`<path d="M0 ${1040+i*60} H1080" stroke="#6E7168" stroke-width="5"/>`;
 s+=P.R(0,lvl,1080,1320-lvl,'#5D86A8')+`<path d="M0 ${lvl} q60 -10 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" fill="none" stroke="#3E6788" stroke-width="6"/>`;
 s+=P.R(0,1300,1080,40,'#7D8076',P.sw(5))+P.ground(1340,'#9AA0A3','#7E8588');
 // 家（右）：ドアが開いている
 s+=P.R(660,1060,420,540,'#E9D7B8',P.sw())+`<path d="M640 1070 L870 900 L1100 1070 Z" fill="#7A6A9C" stroke="#2B2D33" stroke-width="6"/>`;
 const inside=seq(t,4.2,4.6),close=seq(t,4.8,5.3);
 s+=P.R(720,1240,170,330,'#3A3026',P.sw(5));
 // かさの人：川のほうへ歩く → 持ち上げられる → 家の中へ
 const go=seq(t,0.1,1.5),lift=seq(t,2.3,3.0),carry=seq(t,3.0,4.2);
 let px=lerp(600,560,go),py=lerp(1620,1520,go),ps=lerp(0.95,0.85,go);
 if(lift>0){py=lerp(py,1640,lift);px=lerp(px,600,lift)}
 if(carry>0){px=lerp(600,805,carry);py=lerp(1640,1560,carry);ps=lerp(0.85,0.75,carry)}
 const pFace=t<1.6?'neutral':t<2.3?'shock':t<4.2?'worried':'smile';
 const who=person(px,py-150*ps,ps,{face:pFace,shirt:'#6C8F5E',shirtLine:'#3D5A33',hair:'short',hand:[-40,40],look:t<1.6?[0,-1]:[-.8,0]})+P.umbrellaOpen(px-40*ps,py-110*ps,ps*0.9,'#E46B5B');
 const shown=inside<1;
 // ドア（閉まる）
 const doorW=170*close;
 if(G){const shake=t>1.5&&t<2.3?Math.sin((t-1.5)*Math.PI*5)*16*Math.sin((t-1.5)/0.8*Math.PI):0;
  let right=null,left=null;
  if(lift>0&&inside<1){right={tx:px+80*ps,ty:py-40,kind:'grip',reach:40,U:175,F:165};left={tx:px-80*ps,ty:py-30,kind:'grip',reach:40,U:175,F:165}}
  const gx=lerp(300,380,carry);
  const ppl=shown?(inside>0?`<g opacity="${1-inside}">${who}</g>`:who):'';
  s+=gorilla(gx,1580,{nod:shake,right,left,mid:lift>0?ppl:'',face:t<1.5?'normal':t<4.4?'calm':'happy',look:t<2.3?[.8,-.4]:[.8,0]});
  if(lift<=0)s+=ppl;}
 s+=P.R(720,1240,doorW,330,'#B98A5E',P.sw(5));
 s+=P.rain(t,1);
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#8E9DB0',scene(t)),svgWrap('#8E9DB0',scene(DUR-0.1,false))).then(()=>console.log('ok'));
