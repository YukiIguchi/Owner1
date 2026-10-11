// 11日（木）高い ところへ 逃げて ください。— サイレン → 人々が高台へ → ゴリラがお年寄りとねこをかかえて階段をかけ上がる → 全員無事
// （防災の回：笑いにしない。津波の波は描かない。正しい行動＝高いところへ急ぐ）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const B=[400,1840],T=[690,1250],TOP=1250,N=10;        // 階段の下と上、高台の高さ
const ST=k=>[lerp(B[0],T[0],k),lerp(B[1],T[1],k)];
// 手前の丘（階段の段の形）。人やゴリラの下半分はこのうしろにかくれる
function hillFront(){let d=`M300 1920 L${B[0]} ${B[1]}`;for(let i=0;i<N;i++){const [x,y]=ST(i/N),[x2,y2]=ST((i+1)/N);d+=` L${x} ${y2} L${x2} ${y2}`}
 d+=` L1080 ${TOP} L1080 1920 Z`;let st='';for(let i=0;i<N;i++){const [x,y]=ST(i/N),[x2,y2]=ST((i+1)/N);st+=`<path d="M${x} ${y2} H${x2}" stroke="#2B2D33" stroke-width="8" stroke-linecap="round"/>`}
 return `<path d="${d}" fill="#7DBB6E" stroke="#2B2D33" stroke-width="6" stroke-linejoin="round"/>`+`<path d="M${B[0]+30} 1920 L${T[0]+40} ${TOP+40} L1080 ${TOP+40}" fill="none" stroke="#6AA85C" stroke-width="40" opacity=".5"/>`+st}
const elderP=(x,y,sc,face)=>person(x,y,sc,{face,hair:'short',hairColor:'#CFCFCF',shirt:'#B59ACF',shirtLine:'#5E4A7A',hand:[-50,120]})+P.cane(x-60*sc,y+60*sc,150*sc);
function scene(t,G=true){
 let s=P.skyBg('#C6E4F3','#EEF7FB')+P.R(0,1240,560,110,'#7FB7DA')+P.R(0,1346,560,600,'#E7DCC4');
 s+=P.house(330,1350,0.55,{roof:'#6C8FB8'})+P.house(190,1370,0.45,{roof:'#C4553E'});
 s+=`<path d="M${T[0]} ${TOP} Q820 1120 1080 1130 V${TOP} Z" fill="#8FCB7E" stroke="#2B2D33" stroke-width="6"/>`;
 s+=P.siren(170,760,(t*0.7)%1,560);
 // 先に高台へ向かう人たち（下半分は丘のうしろ）
 const ppl=[[0,'#C9746A','long'],[0.25,'#5B7FB0','short'],[0.5,'#6C8F5E','bun']].map(([d,c,h],i)=>{const k=G?cl((t-0.1-d)/2.4):1;const [x,y]=k<1?ST(k):[lerp(T[0],780+i*60,cl((t-0.1-d-2.4)/0.5)),TOP];
  return person(x,y-150*0.45,0.45,{face:k<1?'neutral':'smile',shirt:c,shirtLine:'#333',hair:h,hand:[-40,130]})}).join('');
 s+=ppl;
 if(!G){s+=elderP(900,TOP-150*0.4,0.4,'smile')+P.cat(860,TOP-20,0.3)+hillFront();return s}
 // ゴリラ：お年寄りとねこをかかえ、階段をかけ上がる（遠くへ行くほど小さく）
 const pick=seq(t,1.3,1.9),up=seq(t,1.9,4.3);
 const gs=lerp(1,0.6,up);
 const foot=up>0?ST(up):[330,1920];
 const gx=up>0?lerp(330,foot[0]+40,Math.min(1,up*1.6)):330,gy=foot[1]-360*gs-(up>0&&up<1?Math.abs(Math.sin(t*12))*12:0);
 const elder0=[560,1680];
 const before=pick<0.02?elderP(elder0[0],elder0[1],0.7,'worried')+P.cat(470,1850,0.7):'';
 const ex=lerp(elder0[0],gx+150*gs,pick),ey=lerp(elder0[1],gy+30*gs,pick),es=lerp(0.7,0.6*gs,pick);
 const cx=lerp(470,gx-30*gs,pick),cy=lerp(1850,gy+190*gs,pick),cs=lerp(0.7,0.6*gs,pick);
 const mid=pick>=0.02?elderP(ex,ey,es,t>2.2?'smile':'worried')+P.cat(cx,cy,cs):'';
 const atTop=t>4.5;
 let right=pick>0.02?{tx:gx+300*gs,ty:gy+230*gs,kind:'open',reach:60}:null,left=pick>0.02?{tx:gx+80*gs,ty:gy+290*gs,kind:'open',reach:60}:null;
 if(atTop)right={tx:gx+330*gs,ty:gy-420*gs,kind:'point'};
 const sc=o=>o?Object.assign({},o,{tx:gx+(o.tx-gx)/gs,ty:gy+(o.ty-gy)/gs}):null;   // 体を小さくした分、腕の目標を合わせる
 s+=gorilla(gx,gy,{s:gs,right:sc(right),left:sc(left),mid,face:atTop?'calm':'normal',look:[.7,-.7]});
 s+=hillFront()+before;
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#C6E4F3',scene(t)),svgWrap('#C6E4F3',scene(DUR-0.1,false))).then(()=>console.log('ok'));
