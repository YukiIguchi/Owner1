// 44日（火）ここで 食べます。— 店員が料理を持ち帰りの袋に入れようとする → ゴリラがテーブルを指す → 店員が皿にのせて出す → ゴリラがひと口で全部食べる。店員があぜん
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const MEAL=(s=1)=>`<g transform="translate(-40,0)">${P.burger(s)}</g><g transform="translate(60,-6)">${P.fries(s*0.9)}</g>`;
function scene(t,G=true){
 let s=P.wall('#FBEBD6')+P.R(0,900,1080,30,'#D9483B')+P.floor(1760,'#C9B79C','#A99A80');
 s+=P.R(140,620,260,200,'#FFFFFF',P.sw(5))+`<g transform="translate(220,730)">${P.burger(0.8)}</g><g transform="translate(320,725)">${P.fries(0.7)}</g>`;
 const toBag=t<1.6,serve=seq(t,2.5,3.4),eat=seq(t,3.6,4.0);
 // 店員：袋に入れようとする → 皿にのせて出す → あぜん
 const back=seq(t,3.5,3.9);
 const ph=toBag?[-60,40]:[lerp(lerp(-60,-150,serve),-70,back),lerp(lerp(40,150,serve),150,back)];
 s+=person(830,1440,1.15,{face:t>4.0?'shock':'smile',shirt:'#D9483B',shirtLine:'#8E2E25',hair:'short',cap:'#FFFFFF',hand:ph,sweat:t>4.1?0.8:0});
 
 // テーブル
 s+=P.R(330,1640,760,30,'#B98A5E',P.sw(5))+P.R(360,1670,700,250,'#A97C52',P.sw(5));
 const hx=830+ph[0]*1.15,hy=1440+ph[1]*1.15;
 if(t<2.5)s+=P.paperBag(770,1570,0.9);
 const plate=serve>0;
 if(!plate)s+=`<g transform="translate(${hx-10},${hy-40})">${MEAL(0.85)}</g>`;
 if(plate){const px=lerp(830-60*1.15,650,serve),py=lerp(1440+40*1.15,1630,serve);s+=P.plate(px,py,1.6);
  if(eat<1&&G){const mx=lerp(px,330,eat),my=lerp(py-40,1550,eat),sc=lerp(1,0.2,eat);s+=`<g transform="translate(${mx},${my}) scale(${sc})">${MEAL(1)}</g>`}}
 if(G){let right=null;
  if(t>1.5&&t<2.6)right={tx:lerp(520,600,seq(t,1.5,1.9)),ty:lerp(1700,1640,seq(t,1.5,1.9)),kind:'point',reach:110};
  const m=t>3.5&&t<4.0?seq(t,3.5,3.7):t>=4.0&&t<4.8?Math.abs(Math.sin((t-4.0)*10))*0.35:0;
  s+=gorilla(290,1560,{right,m,face:t>4.0?'happy':'normal',look:t<1.5?[.9,0]:[.7,.5]});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#FBEBD6',scene(t)),svgWrap('#FBEBD6',scene(DUR-0.1,false))).then(()=>console.log('ok'));
