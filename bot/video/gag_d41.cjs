// 41日（土）水が 出ません。— シャンプー中、頭に泡 → シャワーの水が止まる（水の線が消える）→ 泡がどんどんふくらんで、頭が泡の山に → 泡の山のまま電話をかける
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
function scene(t,G=true){
 let s=P.wall('#E3EEF2');for(let i=0;i<9;i++)for(let j=0;j<16;j++)s+=P.R(i*120,j*120,120,120,'none',`stroke="#CFDDE3" stroke-width="4"`);
 const on=1-seq(t,1.5,2.0);
 s+=P.shower(300,860,on);
 s+=P.R(640,1000,300,90,'#FFFFFF',`rx="12" ${P.sw(5)}`)+`<g transform="translate(700,990)">${P.R(-20,-50,40,60,'#F2C94C','rx="10"')}</g>`;
 if(G){const scrub=t<1.6;const grow=seq(t,2.4,4.0);
  let right,left=null;
  if(scrub){right={tx:390+Math.sin(t*12)*26,ty:1250,kind:'open',fixDeg:-150,reach:40,U:200,F:190}}
  else if(t>4.0){right=Object.assign(L.wristAt(290,1560,430,1520),{kind:'grip',item:`<g transform="translate(40,0) rotate(${90})">${P.phone(0,0,1.15)}</g>`,fixDeg:-120})}
  s+=gorilla(290,1560,{right,left,face:t<1.6?'calm':t<2.6?'normal':t<4.0?'worried':'normal',look:t>1.6&&t<2.6?[.4,-1]:[.4,0],m:t>4.4?Math.abs(Math.sin(t*9))*0.4:0});
  s+=P.foamHead(290,1330,lerp(120,700,grow));}
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E3EEF2',scene(t)),svgWrap('#E3EEF2',scene(DUR-0.1,false))).then(()=>console.log('ok'));
