// 31日（水）引っ越しの 手続きを したいです。— 家（屋根・窓・ドア）をまるごと背負って市役所の窓口に入ってくる → 係の人があぜん → 家を床に置き、ていねいにおじぎ
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.8;
const HS=1.35;          // 家の大きさ
function scene(t,G=true){
 let s=P.wall('#E8EEF2')+P.R(0,700,1080,40,'#C7D3DC')+P.floor(1760,'#AEB9C2','#909CA6');
 s+=P.R(140,820,220,150,'#FFFFFF',P.sw(5))+P.R(160,840,180,20,'#9CC9E3')+P.R(160,875,180,10,'#C9D2D9');
 s+=person(890,1460,1.15,{face:t<2.3?'smile':t<4.6?'shock':'smile',shirt:'#5B7FB0',shirtLine:'#2F4A70',hair:'bun',hand:[-70,150],sweat:t>2.4&&t<4.4?0.9:0});
 s+=P.counter(700,1640,420,'#D9D2C5','#9C8A6E');
 const walk=seq(t,0,2.2),down=seq(t,4.0,4.6),bow=seq(t,4.7,5.2);
 const gx=lerp(-160,290,walk),gy=1560-(t<2.2?Math.abs(Math.sin(t*7))*16:0);
 // 家：背中 → 右の床へ
 const side=seq(t,4.0,4.35),drop=seq(t,4.25,4.6);
 const hx=lerp(gx,610,side),hb=lerp(lerp(gy-170,gy-120,side),1800,drop);   // 家の下の中心（右へ → 下へ）
 const house=P.house(hx,hb,HS,{wall:'#F2D9B8',roof:'#C4553E'});
 if(!G){return s+P.house(610,1800,HS,{wall:'#F2D9B8',roof:'#C4553E'})}
 let right,left;
 if(down<1){right={tx:hx+120*HS,ty:hb-30,kind:'grip',reach:40,U:175,F:165};left=side<0.1?{tx:hx-120*HS,ty:hb-30,kind:'grip',reach:40,U:175,F:165}:null}
 if(hx<560)s+=house+gorilla(gx,gy,{right,left,face:walk<1?'happy':'calm',look:[.8,0]});
 else s+=gorilla(gx,gy,{right:down<1?right:null,left:down<1?left:null,rot:36*bow,dy:70*bow,face:bow>0.3?'sleep':'calm',look:[.8,0]})+house;
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#E8EEF2',scene(t)),svgWrap('#E8EEF2',scene(DUR-0.1,false))).then(()=>console.log('ok'));
