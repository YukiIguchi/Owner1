// 55日（土）大家さんに 連絡します。— 部屋。天井に電球。電球が消える（部屋が少し暗くなる）→ 自分で直そうとして手を伸ばすと、天井の板ごと外れてしまう → 板を持ったまま、電話をかける
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const CEIL=1150,PX=430,PW=240;   // 天井の高さ、外れる板
function scene(t,G=true){
 let s=P.wall('#F1E6D4')+P.floor(1760,'#C9A77C','#A8865C');
 s+=P.windowFrame(640,1240,260,220,{sky:'#9FB8D6'})+P.R(150,1300,150,200,'#E8D8BE',P.sw(5));
 const off=seq(t,0.6,1.1);
 const pull=seq(t,1.8,2.4);
 // 天井の板（1枚が外れる）
 let ceil=P.R(0,0,1080,CEIL,'#E2D6C2');for(let i=0;i<5;i++)ceil+=P.R(i*240-30,CEIL-110,240,110,'#EDE3D2',P.sw(5));
 ceil+=`<path d="M0 ${CEIL} H1080" stroke="#2B2D33" stroke-width="8"/>`;
 if(pull>0)ceil+=P.R(PX,CEIL-110,PW,110,'#3A3026',P.sw(5));
 s+=ceil;
 // 電球
 const bulbY=CEIL+lerp(0,0,pull);
 const bulb=(x,y)=>`<path d="M${x} ${y} V${y+60}" stroke="#2B2D33" stroke-width="6"/>${P.R(x-18,y+56,36,26,'#9AA6B2',P.sw(4))}<circle cx="${x}" cy="${y+108}" r="34" fill="${off<0.5?'#FFE58A':'#F4F1EA'}" ${P.sw(5)}/>`;
 const panel=(x,y,a=0)=>`<g transform="rotate(${a} ${x+PW/2} ${y+55})">${P.R(x,y,PW,110,'#EDE3D2',P.sw(5))}</g>`+bulb(x+PW/2,y+110);
 if(pull<=0)s+=bulb(PX+PW/2,CEIL);
 // 暗くなる（点滅しない。ゆっくり一度だけ）
 const dark=`<rect width="1080" height="1920" fill="#1B2547" opacity="${0.28*off}"/>`;
 if(G){let right=null,left=null,pan='';
  if(t>1.2&&t<1.9)right={tx:PX+PW/2+20,ty:lerp(1700,CEIL+130,seq(t,1.2,1.7)),kind:'open',fixDeg:-90,reach:40,U:175,F:165};
  else if(t>=1.9){const down=seq(t,2.3,2.9);const px=lerp(PX,PX+60,down),py=lerp(CEIL-110,1220,down)+lerp(0,pull*20,1-down);
   right={tx:px+PW/2,ty:py+120,kind:'grip',fixDeg:-90,reach:40,U:175,F:165};pan=panel(px,py,lerp(0,-8,down))}
  if(t>3.1)left={tx:lerp(100,170,seq(t,3.1,3.6)),ty:lerp(1800,1500,seq(t,3.1,3.6)),kind:'grip',item:`<g transform="translate(40,0) rotate(${90})">${P.phone(0,0,1.0)}</g>`,fixDeg:-80,reach:30};
  s+=gorilla(300,1560,{right,left,face:t<1.2?'normal':t<2.3?'calm':t<3.1?'shock':'calm',look:t<2.4?[.4,-1]:[.6,-.2],m:t>3.8?Math.abs(Math.sin(t*9))*0.4:0});
  s+=pan;}
 else s+=panel(PX+60,1220,-8);
 return s+dark}
L.renderGag(OUT,DUR,t=>svgWrap('#F1E6D4',scene(t)),svgWrap('#F1E6D4',scene(DUR-0.1,false))).then(()=>console.log('ok'));
