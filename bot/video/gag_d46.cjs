// 46日（木）自転車は 左を 走ります。— 道路（左側通行）。左を指す矢印の標識。体に比べてとても小さな自転車で、ゴリラが道の左側を正しく走る（うしろから見た図）→ 車が安全に右側を通りすぎる → 小さなベルをそっと鳴らす
// （倫理：ゴリラは正しく走る。左右がはっきりわかるように、うしろから見る）
const L=require('./lib.cjs');const {seq,lerp,cl,svgWrap}=L;const P=require('./props.cjs');const {wildBack}=require('./gorilla_wild.js');const OUT=process.argv[2];const DUR=5.8;
const HZ=1060,VX=540;      // 地平線と消失点
const roadX=(u,y)=>{const k=(y-HZ)/(1920-HZ);return lerp(VX,u,k)};   // 手前の x=u の点が、高さ y でどこにくるか
function scene(t,G=true){
 let s=P.skyBg('#C6E4F3','#EEF7FB')+P.R(0,HZ,1080,860,'#9FCB8C');
 s+=P.building(60,HZ,200,260,'#E3D9C8')+P.building(820,HZ,220,200,'#D3DCE3','#B7D6EA');
 // 道路（手前で x=-100〜1180）
 s+=`<path d="M${VX-30} ${HZ} L${VX+30} ${HZ} L1180 1920 L-100 1920 Z" fill="#8C9399" stroke="#2B2D33" stroke-width="6"/>`;
 for(let i=0;i<8;i++){const y1=HZ+40+i*110,y2=y1+60;s+=`<path d="M${roadX(540,y1)} ${y1} L${roadX(540,y2)} ${y2}" stroke="#FFFFFF" stroke-width="${4+i*2}"/>`}
 s+=`<path d="M${roadX(40,HZ)} ${HZ} L40 1920 M${roadX(1040,HZ)} ${HZ} L1040 1920" stroke="#FFFFFF" stroke-width="10"/>`;
 s+=P.keepLeftSign(200,1140,1.0);
 // 車：右側を、うしろから追いこして遠くへ
 const car=seq(t,2.9,4.6);
 if(car>0&&car<1){const y=lerp(2060,1180,car),sc=lerp(1.5,0.35,car);s+=P.carBack(roadX(800,y),y,sc,'#4F86C6')}
 if(G){// ゴリラ：道の左側を走って、少しずつ遠くへ
  const go=seq(t,0,5.8)*0.4;const y=lerp(1900,1600,go),sc=lerp(0.62,0.46,go);const x=roadX(280,y);
  const wob=Math.sin(t*6)*2;
  s+=P.tinyBikeBack(x,y,sc*1.2);
  s+=`<g transform="translate(${x},${y-640*sc}) rotate(${wob}) scale(${sc})">${wildBack({pedal:Math.sin(t*8)})}</g>`;
  if(t>4.6)s+=P.bell(x+250*sc,y-660*sc,sc*2.6)+P.soundWaves(x+300*sc,y-700*sc,1,cl((t-4.6)/0.5),2,22,26,0.9);}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#C6E4F3',scene(t)),svgWrap('#C6E4F3',scene(DUR-0.1,false))).then(()=>console.log('ok'));
