// 59日（水）それは どういう 意味ですか。— 上司が身ぶりで説明する → ゴリラの頭の上の「？」がどんどん増えて、部屋をうめつくす → 上司が「？」の山を見て、笑って頭をかく
const L=require('./lib.cjs');const {seq,lerp,cl,gorilla,person,svgWrap}=L;const P=require('./props.cjs');const OUT=process.argv[2];const DUR=5.6;
const QC=['#4F86C6','#E46B5B','#3FA66B','#F2A93B','#7A4FA8'];
// 「？」の位置：はじめは頭の上、だんだん部屋じゅうへ
const QS=[];{const r=P.rng(21);for(let i=0;i<46;i++){const k=i/46;let x=k<0.1?260+r()*80:150+r()*800,y=k<0.1?1180-r()*60:lerp(1200,520,r())+(k>0.6?r()*560:0);
  // 顔のまわりはあける（ゴリラの頭・上司の頭）
  if(Math.hypot(x-290,y-1450)<230)y=1180-r()*80;if(Math.hypot(x-860,y-1390)<170)y=1180-r()*120;
  QS.push({x,y,s:0.9+r()*0.8,a:r()*50-25,c:QC[i%5],t0:2.0+Math.pow(k,0.8)*2.3})}}
function scene(t,G=true){
 let s=P.office({wallC:'#EEF0F5'});
 const explain=t<2.1,laugh=t>4.5;
 s+=person(860,1470,1.15,{face:laugh?'happy':'smile',talk:explain?Math.abs(Math.sin(t*10)):0,glasses:true,shirt:'#7A6A9C',shirtLine:'#4A3D66',hair:'short',hairColor:'#6B6B6B',
   hand:laugh?[-20,-120]:explain?[-120+Math.sin(t*4)*40,30-Math.abs(Math.sin(t*4))*80]:[-70,150],hk:explain?'open':null,front:laugh,headRot:laugh?Math.sin(t*12)*3:0});
 if(explain)s+=`<g opacity="${cl(t/0.3)*(1-cl((t-1.8)/0.3))}">${P.bubble(560,800,360,220,P.tangle(740,910,1.1),[790,1330])}</g>`;
 if(G){s+=gorilla(290,1560,{face:t<2.0?'normal':t<4.5?'worried':'happy',look:t<2.0?[.8,-.4]:[0,-1],blink:(t%2.7)>2.6});
  QS.forEach(q=>{const k=seq(t,q.t0,q.t0+0.35);if(k<=0)return;s+=P.qmark(q.x,q.y,q.s*k,q.a,q.c)})}
 else QS.forEach(q=>s+=P.qmark(q.x,q.y,q.s,q.a,q.c));
 return s}
L.renderGag(OUT,DUR,t=>svgWrap('#EEF0F5',scene(t)),svgWrap('#EEF0F5',scene(DUR-0.1,false))).then(()=>console.log('ok'));
