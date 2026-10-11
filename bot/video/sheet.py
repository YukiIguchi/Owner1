# 確認用：コマを縮小して1枚に並べる
#   python3 video/sheet.py /tmp/g08 out.png [列の数]
import sys,glob,os
from PIL import Image,ImageDraw
d=sys.argv[1];out=sys.argv[2];cols=int(sys.argv[3]) if len(sys.argv)>3 else 4
fs=sorted(glob.glob(os.path.join(d,'prev_[0-9]*.png')))
if os.path.exists(os.path.join(d,'prev_bg.png')):fs.append(os.path.join(d,'prev_bg.png'))
W,H=270,480;rows=(len(fs)+cols-1)//cols
sh=Image.new('RGB',(cols*W+(cols+1)*6,rows*H+(rows+1)*6),'#888')
times=os.environ.get('PREVIEW','').split(',')
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize((W,H),Image.LANCZOS)
    x=6+(i%cols)*(W+6);y=6+(i//cols)*(H+6);sh.paste(im,(x,y))
    dr=ImageDraw.Draw(sh);lab='bg' if 'bg' in f else (times[i] if i<len(times) else str(i))
    dr.rectangle([x,y,x+46,y+20],fill='#000');dr.text((x+4,y+4),lab,fill='#fff')
sh.save(out)
