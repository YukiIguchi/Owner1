# 1日分の朝の動画を作る
#   NODE_PATH=$(npm root -g) python3 video/build_gag.py NN   → out/videos/dayNN_morning.mp4
#   作業用のコマは /tmp/gNN（GAG_TMP で変えられる）
import json, os, subprocess, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import assemble

VIDEO = os.path.dirname(os.path.abspath(__file__))
BOT = os.path.dirname(VIDEO)


def build(nn):
    nn = f'{int(nn):02d}'
    work = os.environ.get('GAG_TMP', f'/tmp/g{nn}')
    os.makedirs(work, exist_ok=True)
    for f in glob.glob(os.path.join(work, '[go][0-9][0-9][0-9][0-9].png')):
        os.remove(f)
    env = dict(os.environ)
    env.pop('PREVIEW', None)
    # 1. ハプニングのコマ
    subprocess.run(['node', os.path.join(VIDEO, f'gag_d{nn}.cjs'), work], check=True, env=env)
    gag_frames = len(glob.glob(os.path.join(work, 'g[0-9][0-9][0-9][0-9].png')))
    # 2. 声とオチの時間割
    phrase = json.load(open(os.path.join(VIDEO, 'phrases.json'), encoding='utf-8'))[nn]
    ochi, wav = assemble.make_voice(phrase, work)
    json.dump(ochi, open(os.path.join(work, 'ochi.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    # 3. オチのコマ
    subprocess.run(['node', os.path.join(VIDEO, 'frames.cjs'), work], check=True, env=env)
    # 4. つないで mp4
    out = os.path.join(BOT, 'out', 'videos', f'day{nn}_morning.mp4')
    assemble.mux(work, gag_frames / assemble.FPS, wav, out)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out],
                               capture_output=True, text=True).stdout.strip() or 0)
    print(f'{out}  {dur:.1f}秒  声={"仮の声(Open JTalk)" if ochi["tempVoice"] else "VOICEVOX"}')


if __name__ == '__main__':
    for a in sys.argv[1:]:
        build(a)
