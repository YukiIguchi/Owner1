# 声を作り、オチの場面の時間割（口の動き・速さの印）を決め、ハプニングとオチをつないで mp4 にする
# 声：VOICEVOX（VOICEVOX_URL、既定 http://127.0.0.1:50021）が動いていればそれを使う。
#     なければ Open JTalk の仮の声（画面の下に「仮の声」と出る）。
import json, os, re, subprocess, urllib.request, urllib.parse, wave
import numpy as np

FPS = 30
SR = 48000
VV_URL = os.environ.get('VOICEVOX_URL', 'http://127.0.0.1:50021')
VV_SPEAKER = int(os.environ.get('VOICEVOX_SPEAKER', '13'))  # 13 = 青山龍星（ノーマル）
SLOW = 0.72        # ゆっくりの速さ
XFADE = 0.4        # ハプニング → オチ のつなぎ（秒）
LEAD, GAP, TAIL = 0.7, 1.0, 1.5   # オチ：話し始めるまで / ふつう と ゆっくり の間 / 終わりの余白
OJT_DIC = '/var/lib/mecab/dic/open-jtalk/naist-jdic'
OJT_VOICE = '/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice'


def plain(ja):
    """{漢字|よみ} を外し、空白を取った文（声に読ませる文）"""
    return re.sub(r'\{([^|}]+)\|[^}]+\}', r'\1', ja).replace(' ', '')


def voicevox_ok():
    try:
        urllib.request.urlopen(VV_URL + '/version', timeout=2).read()
        return True
    except Exception:
        return False


def tts_voicevox(text, speed, out):
    q = urllib.request.urlopen(urllib.request.Request(
        VV_URL + '/audio_query?' + urllib.parse.urlencode({'text': text, 'speaker': VV_SPEAKER}), method='POST')).read()
    q = json.loads(q)
    q.update(speedScale=speed, outputSamplingRate=SR, outputStereo=False, prePhonemeLength=0.05, postPhonemeLength=0.08)
    w = urllib.request.urlopen(urllib.request.Request(
        VV_URL + '/synthesis?' + urllib.parse.urlencode({'speaker': VV_SPEAKER}), data=json.dumps(q).encode(),
        headers={'Content-Type': 'application/json'}, method='POST')).read()
    open(out, 'wb').write(w)


def tts_openjtalk(text, speed, out):
    raw = out + '.raw.wav'
    subprocess.run(['open_jtalk', '-x', OJT_DIC, '-m', OJT_VOICE, '-r', str(speed), '-ow', raw],
                   input=text.encode('utf-8'), check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-ar', str(SR), '-ac', '1', out], check=True)
    os.remove(raw)


def read_wav(p):
    with wave.open(p) as w:
        sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
        a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    if ch > 1:
        a = a.reshape(-1, ch).mean(axis=1)
    if sr != SR:
        a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a)
    # 前後の無音を切る
    nz = np.where(np.abs(a) > 0.01)[0]
    if len(nz):
        a = a[max(0, nz[0] - 480):nz[-1] + 960]
    return a


def mouth(a):
    """1コマごとの口の開き 0〜1（音の大きさから）"""
    hop = SR // FPS
    n = int(np.ceil(len(a) / hop))
    r = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2)) if len(a[i * hop:(i + 1) * hop]) else 0 for i in range(n)])
    ref = np.percentile(r[r > 0.005], 90) if np.any(r > 0.005) else 1
    m = np.clip(r / ref, 0, 1)
    m[r < 0.012] = 0
    sm = m.copy()  # 少しなめらかに
    for i in range(1, n):
        sm[i] = max(m[i], sm[i - 1] * 0.55)
    return sm


def make_voice(phrase, work):
    """ふつう・ゆっくり の2つの声と、オチの時間割を作る。戻り値：(ochi dict, 音声 wav のパス)"""
    text = phrase.get('say') or plain(phrase['ja'])
    use_vv = voicevox_ok()
    a = []
    for name, speed in (('normal', 1.0), ('slow', SLOW)):
        p = os.path.join(work, f'voice_{name}.wav')
        if use_vv:
            tts_voicevox(text, speed, p)
        else:
            tts_openjtalk(text, speed, p)
        a.append(read_wav(p))
    sil = lambda s: np.zeros(int(round(s * SR)), dtype=np.float32)
    track = np.concatenate([sil(LEAD), a[0], sil(GAP), a[1], sil(TAIL)])
    frames = int(np.ceil(len(track) / SR * FPS))
    env = np.zeros(frames)
    speed = np.zeros(frames, dtype=int)
    f0 = int(LEAD * FPS)
    m0 = mouth(a[0])
    env[f0:f0 + len(m0)] = m0[:max(0, frames - f0)]
    f1 = int(round((LEAD + len(a[0]) / SR + GAP) * FPS))
    m1 = mouth(a[1])
    env[f1:f1 + len(m1)] = m1[:max(0, frames - f1)]
    speed[int(round((LEAD + len(a[0]) / SR + GAP * 0.5) * FPS)):] = 1
    out = os.path.join(work, 'ochi.wav')
    with wave.open(out, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())
    ochi = dict(ja=phrase['ja'], romaji=phrase['romaji'], en=phrase['en'], frames=frames,
                env=[round(float(x), 3) for x in env], speed=[int(x) for x in speed], tempVoice=not use_vv)
    return ochi, out


def mux(work, gag_dur, ochi_wav, out_mp4):
    """ハプニング（g####.png）とオチ（o####.png）をつなぎ、声をのせる"""
    os.makedirs(os.path.dirname(out_mp4), exist_ok=True)
    off = gag_dur - XFADE
    n_ochi = len([f for f in os.listdir(work) if re.match(r'o\d{4}\.png$', f)])
    total = gag_dur + n_ochi / FPS - XFADE
    # 音：ハプニングの間は無音、そのあとにオチの声。長さを動画と同じにそろえる
    with wave.open(ochi_wav) as w:
        v = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    full = np.zeros(int(round(total * SR)), dtype=np.int16)
    i0 = int(round(off * SR))
    full[i0:i0 + len(v)] = v[:max(0, len(full) - i0)]
    aud = os.path.join(work, 'full.wav')
    with wave.open(aud, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(full.tobytes())
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error',
        '-framerate', str(FPS), '-i', os.path.join(work, 'g%04d.png'),
        '-framerate', str(FPS), '-i', os.path.join(work, 'o%04d.png'),
        '-i', aud,
        '-filter_complex',
        f'[0:v][1:v]xfade=transition=fade:duration={XFADE}:offset={off:.3f},format=yuv420p[v];'
        f'[2:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample={SR}[a]',
        '-map', '[v]', '-map', '[a]', '-t', f'{total:.3f}',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-r', str(FPS),
        '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out_mp4], check=True)
