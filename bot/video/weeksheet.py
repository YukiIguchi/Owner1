# 確認用：何日分かの mp4 から、決まった秒のコマを取り出して表にする（行＝日、列＝秒）
#   python3 video/weeksheet.py out.png 08 09 10 ...   （秒は WEEK_TIMES で変えられる。既定 1,2.5,4,5.5,9）
import sys,subprocess,os,tempfile
from PIL import Image,ImageDraw,ImageFont
out=sys.argv[1];days=sys.argv[2:]
ts=os.environ.get('WEEK_TIMES','1,2.5,4,5.5,9').split(',')
W,H=216,384;pad=6;lab=60
sh=Image.new('RGB',(lab+len(ts)*(W+pad)+pad,len(days)*(H+pad)+pad+24),'#666')
dr=ImageDraw.Draw(sh)
try:f=ImageFont.truetype(os.path.join(os.path.dirname(__file__),'fonts','ZenMaruGothic-Bold.ttf'),22)
except Exception:f=None
for j,t in enumerate(ts):dr.text((lab+pad+j*(W+pad)+4,4),t+'s',fill='#fff',font=f)
with tempfile.TemporaryDirectory() as d:
    for i,nn in enumerate(days):
        mp4=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'out','videos',f'day{nn}_morning.mp4')
        y=24+pad+i*(H+pad);dr.text((8,y+H//2-12),nn,fill='#fff',font=f)
        for j,t in enumerate(ts):
            p=os.path.join(d,f'{i}_{j}.png')
            subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',t,'-i',mp4,'-frames:v','1',p],check=True)
            sh.paste(Image.open(p).convert('RGB').resize((W,H),Image.LANCZOS),(lab+pad+j*(W+pad),y))
sh.save(out)
