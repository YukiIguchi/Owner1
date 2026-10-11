// 3日（水）住所を 書いて ください。— 力が強すぎてペンが3本折れる → 丸太のえんぴつで書く
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=6.0;
const SNAP=[1.3,2.2,3.1];          // ペンが折れる時刻
function piece(x,y,tt,dir){const k=cl(tt/0.8);return `<g transform="translate(${x+dir*120*k},${y-160*k+260*k*k}) rotate(${dir*300*k})" opacity="${1-cl((tt-0.6)/0.3)}"><path d="M-50 0 H50" stroke="#2B2D33" stroke-width="30" stroke-linecap="round"/><path d="M-50 0 H50" stroke="#2F6DB5" stroke-width="20" stroke-linecap="round"/></g>`}
function scene(t,G=true){
 let s=P.wall('#E7EEF3')+R(0,0,1080,980,'#D6E2EA')+P.windowFrame(170,640,260,220,{})+P.floor(1740,'#B8C4CC','#98A6B0');
 const nSnap=SNAP.filter(x=>t>=x).length;
 const face=nSnap===0?'smile':nSnap===1?'neutral':t<4.6?'shock':'happy';
 s+=person(855,1470,1.2,{face,shirt:'#5B7FB0',shirtLine:'#2F4A70',hair:'long',hand:[-60,140],sweat:nSnap>=2&&t<4.6?0.9:0});
 s+=P.counter(500,1640,600,'#DCE3E8','#9FB0BC');
 const logK=seq(t,3.4,4.1),writeK=seq(t,4.2,5.4);
 s+=P.formBoard(540,1370,210,250,writeK,14);
 s+=P.penHolder(800,1640,Math.max(0,2-nSnap+ (t<SNAP[0]?0:0)));
 // 折れたペン
 SNAP.forEach(ts=>{if(t>=ts&&t<ts+0.95){s+=piece(610,1440,t-ts,-1)+piece(680,1440,t-ts,1)}});
 if(G){let right;
  const wig=Math.sin(t*14)*16;   // 書く手の動き
  if(t<3.2){const inPen=!SNAP.some(ts=>t>=ts&&t<ts+0.35);   // 折れた直後は手が空
   right={tx:650+wig*0.6,ty:1460+Math.abs(wig)*0.5,kind:'grip',item:inPen?P.pen():'',reach:150}}
  else if(t<4.1)right={tx:lerp(600,660,logK),ty:lerp(1700,1470,logK),kind:'grip',item:P.logPencil(),reach:120};
  else right={tx:635+(writeK<1?Math.sin(t*9)*40:0),ty:1470+(writeK<1?Math.sin(t*5)*30:0),kind:'grip',item:P.logPencil(),reach:130};
  const shock=SNAP.some(ts=>t>=ts&&t<ts+0.6);
  s+=gorilla(290,1560,{right,face:shock?'shock':t>4.2?'happy':'normal',look:[.7,-.1],blink:(t%2.6)>2.5});}
 return s}
const R=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
L.renderGag(OUT,DUR,t=>svgWrap('#E7EEF3',scene(t)),svgWrap('#E7EEF3',scene(DUR-0.1,false))).then(()=>console.log('ok'));
