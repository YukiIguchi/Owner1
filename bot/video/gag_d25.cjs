// 25日（木）119に 電話します。— トースターから煙と小さな火 → ゴリラが気づく → 大きな電話のボタンを 1 → 1 → 9 とゆっくり押す → 遠くに消防車、ゴリラがうなずく
// （防災の回：笑いにしない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const KX=440,KY=1280,BW=86,BH=72;
const PRESS=[['1',1.7],['1',2.5],['9',3.3]];      // 押すボタンと時刻
function scene(t,G=true){
 let s=P.wall('#F2F0EA');for(let i=0;i<9;i++)for(let j=0;j<6;j++)s+=P.R(i*120,1000+j*120,120,120,'none',`stroke="#E2DED4" stroke-width="4"`);
 // 窓：遠くに消防車
 s+=P.R(120,620,360,260,'#CFE6F5',P.sw(8));
 const ft=seq(t,3.9,5.2);if(ft>0)s+=`<clipPath id="win"><rect x="120" y="620" width="360" height="260"/></clipPath><g clip-path="url(#win)">${P.fireTruck(lerp(-120,180,ft),850,0.42)}</g>`;
 s+=P.R(120,620,360,260,'none',P.sw(8))+`<path d="M300 620 V880" stroke="#F7F3EA" stroke-width="12"/>`+P.R(106,880,388,18,'#E9E1D2',P.sw(5));
 s+=P.counter(420,1600,700,'#D8CBB3','#A99F8E');
 // トースター：煙と小さな火
 s+=P.smoke(860,1430,t,cl(t/0.8))+P.toaster(860,1600,1.05);
 if(t>0.5)s+=`<g transform="translate(845,1468) scale(${0.6+0.25*seq(t,0.5,1.2)})">${P.fireIcon(1)}</g>`;
 // 電話のボタン
 const pressed={};let disp='';
 PRESS.forEach(([k,ts],i)=>{const p=t<ts?0:t<ts+0.3?Math.sin((t-ts)/0.3*Math.PI/2):Math.max(0,1-(t-ts-0.3)/0.3);pressed[k]=Math.max(pressed[k]||0,p);if(t>=ts+0.15)disp+=k});
 s+=P.keypad(KX,KY,{pressed,disp,bw:BW,bh:BH});
 if(G){let tgt=null;
  if(t>1.2){// 押すボタンへ指を動かす
   let k=PRESS.findIndex(([_,ts])=>t<ts+0.45);if(k<0)k=2;
   const [bx,by]=P.keyPos(KX,KY,PRESS[k][0],BW,BH);const ts=PRESS[k][1];const prev=k>0?P.keyPos(KX,KY,PRESS[k-1][0],BW,BH):[600,1700];
   const mv=seq(t,ts-0.5,ts-0.1),push=t>=ts&&t<ts+0.45?Math.sin(Math.min(1,(t-ts)/0.3)*Math.PI/2)*(1-cl((t-ts-0.3)/0.15)):0;
   const fx=lerp(prev[0],bx,mv),fy=lerp(prev[1],by,mv);
   tgt=t<4.0?{tx:fx+8,ty:fy+12-(1-push)*10,kind:'point',reach:95,U:185,F:175,fixDeg:-55}:null}
  s+=gorilla(300,1560,{right:tgt,face:t<0.8?'normal':t<1.2?'shock':'calm',look:t<1.2?[1,0]:t<3.9?[.6,-.3]:[-.6,-.8],nodY:t>4.6&&t<5.4?Math.abs(Math.sin((t-4.6)*Math.PI*2.5))*22:0});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#F2F0EA',scene(t)),svgWrap('#F2F0EA',scene(DUR-0.1,false))).then(()=>console.log('ok'));
