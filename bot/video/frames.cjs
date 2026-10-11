// オチの場面のコマを作る：ハプニングの最後の場面（ゴリラなし）を背景に、フレーズのカードと、話すゴリラを描く
//   node video/frames.cjs /tmp/gNN   （/tmp/gNN に bg.svg と ochi.json があること。o0000.png… を書き出す）
// ochi.json: {ja, romaji, en, frames, env:[口の開き], speed:[0=ふつう/1=ゆっくり], tempVoice}
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L=require('./lib.cjs');const {gorilla,svgWrap}=L;
const DIR=process.argv[2];const O=JSON.parse(fs.readFileSync(path.join(DIR,'ochi.json'),'utf8'));
const FONT='file://'+path.join(__dirname,'fonts','ZenMaruGothic-Bold.ttf');

// {漢字|よみ} → <ruby>。空白で文節に分け、文節の中では改行しない
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const rubyHtml=ja=>ja.trim().split(/\s+/).map(w=>`<span class="w">${esc(w).replace(/\{([^|}]+)\|([^}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>')}</span>`).join('');

// 速さの印：うさぎ（ふつう）とかめ（ゆっくり）
const HARE=`<svg viewBox="0 0 120 90" width="96" height="72"><g fill="#fff" stroke="#2B2D33" stroke-width="6" stroke-linejoin="round"><path d="M70 30 Q66 4 76 2 Q86 6 82 30 Z"/><path d="M84 32 Q88 6 98 6 Q106 12 94 36 Z"/><ellipse cx="52" cy="60" rx="34" ry="22"/><circle cx="88" cy="44" r="18"/><circle cx="18" cy="56" r="8"/></g><circle cx="94" cy="42" r="3.5" fill="#2B2D33"/></svg>`;
const TURTLE=`<svg viewBox="0 0 120 90" width="96" height="72"><g stroke="#2B2D33" stroke-width="6" stroke-linejoin="round"><path d="M18 66 L14 80 M40 70 L38 82 M70 70 L72 82 M90 64 L96 78" stroke-linecap="round"/><ellipse cx="102" cy="56" rx="14" ry="11" fill="#fff"/><path d="M14 64 Q20 18 56 18 Q92 18 98 64 Z" fill="#fff"/><path d="M36 64 L46 34 L66 34 L76 64 M46 34 L56 20 M66 34 L56 20" fill="none" stroke-width="4"/></g><circle cx="106" cy="53" r="3.5" fill="#2B2D33"/></svg>`;

const html=`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Card;src:url("${FONT}")}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#fff}
#bg,#g{position:absolute;left:0;top:0;width:1080px;height:1920px}
#card{position:absolute;left:54px;top:150px;width:972px;box-sizing:border-box;padding:34px 44px 30px;background:#fff;border:8px solid #2B2D33;border-radius:44px;font-family:Card;color:#1E1F24;box-shadow:0 14px 0 rgba(43,45,51,.18)}
#ja{font-size:96px;line-height:1.5;text-align:center}
#ja .w{display:inline-block;white-space:nowrap;margin:0 .14em}
rt{font-size:.4em;color:#3A3D46;letter-spacing:.04em}
#ro{font-size:42px;color:#3A3D46;text-align:center;margin-top:10px;line-height:1.3}
#en{font-size:46px;color:#174A7C;text-align:center;margin-top:16px;line-height:1.3;padding-top:18px;border-top:5px dashed #C9CDD6}
#sp{display:flex;justify-content:center;gap:54px;margin-top:22px}
#sp div{display:flex;flex-direction:column;align-items:center;opacity:.28;transform:scale(.8)}
#sp div.on{opacity:1;transform:scale(1)}
#sp div i{display:block;width:96px;height:10px;border-radius:5px;margin-top:6px;background:transparent}
#sp div.on i{background:#2B2D33}
#tmp{position:absolute;left:50%;transform:translateX(-50%);bottom:34px;font-family:Card;font-size:36px;color:#fff;background:rgba(30,31,36,.82);padding:8px 26px;border-radius:28px}
</style></head><body>
<div id="bg">${fs.readFileSync(path.join(DIR,'bg.svg'),'utf8')}</div><div id="g"></div>
<div id="card"><div id="ja">${rubyHtml(O.ja)}</div><div id="ro">${esc(O.romaji)}</div><div id="en">${esc(O.en)}</div>
<div id="sp"><div id="s0">${HARE}<i></i></div><div id="s1">${TURTLE}<i></i></div></div></div>
${O.tempVoice?'<div id="tmp">仮の声</div>':''}
</body></html>`;

(async()=>{const hp=path.join(DIR,'ochi.html');fs.writeFileSync(hp,html);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto('file://'+hp);await p.evaluate(()=>document.fonts.ready);
 // 長いフレーズは文字を小さくして、カードが高くなりすぎないようにする
 await p.evaluate(()=>{const c=document.getElementById('card'),j=document.getElementById('ja');let f=96;while(c.offsetHeight>780&&f>60){f-=4;j.style.fontSize=f+'px'}});
 for(const f of fs.readdirSync(DIR))if(/^o\d{4}\.png$/.test(f))fs.unlinkSync(path.join(DIR,f));
 for(let i=0;i<O.frames;i++){const t=i/30,m=O.env[i]||0,blink=(t%3.1)>2.98;
  // ゴリラは先生役：右手のひらでカードを示しながら話す
  const lift=Math.sin(t*1.6)*6;
  const g=svgWrap('none',gorilla(290,1560,{m,blink,face:m>0.02?'normal':'happy',nod:Math.sin(t*2.2)*2,right:{tx:700,ty:1420+lift,kind:'open',reach:110}}));
  await p.evaluate(([g,s])=>{document.getElementById('g').innerHTML=g;document.getElementById('s0').className=s?'':'on';document.getElementById('s1').className=s?'on':''},[g,O.speed[i]||0]);
  await p.screenshot({path:path.join(DIR,`o${String(i).padStart(4,'0')}.png`)})}
 await b.close();console.log('ochi frames',O.frames)})();
