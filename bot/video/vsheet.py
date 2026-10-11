# 確認用：できた mp4 から、指定の秒のコマを取り出して1枚に並べる
#   python3 video/vsheet.py out/videos/day01_morning.mp4 out.png 5.0 9.0 ...
import sys,subprocess,os,tempfile
from PIL import Image,ImageDraw
mp4,out=sys.argv[1],sys.argv[2];ts=sys.argv[3:] or ['5','9']
W,H=360,640;sh=Image.new('RGB',(len(ts)*(W+6)+6,H+12),'#888')
with tempfile.TemporaryDirectory() as d:
    for i,t in enumerate(ts):
        p=os.path.join(d,f'{i}.png');subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',t,'-i',mp4,'-frames:v','1',p],check=True)
        im=Image.open(p).convert('RGB').resize((W,H),Image.LANCZOS);x=6+i*(W+6);sh.paste(im,(x,6))
        dr=ImageDraw.Draw(sh);dr.rectangle([x,6,x+44,26],fill='#000');dr.text((x+4,10),t,fill='#fff')
sh.save(out)
