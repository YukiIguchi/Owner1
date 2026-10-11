// 18日（木）避難所は 学校です。— 人々がどこへ行けばいいか迷う → ゴリラが校舎（時計・校庭・鉄棒）を指さす → 人々が一列に並んで校舎へ向かう
// （防災の回：笑いにしない）
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
// 道：手前(560,1760) → 校門(700,1420)
const PATH=k=>[lerp(800,750,k),lerp(1830,1440,k)];
const PEOPLE=[[600,1760,'#C9746A','long',[-1,0]],[760,1660,'#5B7FB0','short',[1,0]],[900,1780,'#6C8F5E','bun',[-1,-.3]],[640,1600,'#E8A33A','short',[.6,-.4]]];
function scene(t,G=true){
 let s=P.skyBg('#C9E3F2','#EEF7FB')+P.R(0,1300,1080,700,'#D6D0C2');
 s+=P.school(520,1430,1);
 s+=`<path d="M680 1920 L715 1430 L790 1430 L940 1920 Z" fill="#C2BBAA"/>`;
 // 人々：迷ってきょろきょろ → 指さしで校舎を見る → 一列で校舎へ（遠くへ行くほど小さく）
 const lineK=seq(t,3.0,3.5);
 PEOPLE.map((p,i)=>{const [x0,y0,c,h,lk]=p;const walk=cl((t-3.4-i*0.35)/2.4);const [px,py]=PATH(0.62-i*0.2+walk*0.34);
  const x=lerp(x0,px,lineK),y=lerp(y0,py,lineK);const sc=lerp(0.78,0.4,(1830-y)/390);
  const lost=t<1.6;const look=lost?[Math.sin(t*3+i*2),-.2]:[.6,-.8];
  return {y,svg:person(x,y-150*sc,sc,{face:lost?'worried':'neutral',shirt:c,shirtLine:'#333',hair:h,look,headRot:lost?Math.sin(t*3+i*2)*10:0,hand:[-40,130]})}})
  .sort((a,b)=>a.y-b.y).forEach(p=>s+=p.svg);
 if(G){const right=t>1.5&&t<3.4?{tx:lerp(500,700,seq(t,1.5,2.1)),ty:lerp(1700,1060,seq(t,1.5,2.1)),kind:'point'}:t>=3.4?{tx:640,ty:1640,kind:'open',fixDeg:-20,reach:80}:null;
  s+=gorilla(250,1560,{right,face:'calm',look:t>1.5?[.8,-.8]:[0,0]});}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#C9E3F2',scene(t)),svgWrap('#C9E3F2',scene(DUR-0.1,false))).then(()=>console.log('ok'));
