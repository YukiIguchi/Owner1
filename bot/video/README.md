# 朝の動画（ハプニング → オチ）

指示書は [GAG_SPEC.md](GAG_SPEC.md)。52本すべて作成済みで、`out/videos/dayNN_morning.mp4` にあります（日曜日は動画なし）。
各週の見本（1・2.5・4・5.5・9 秒のコマ）は `out/weekN_overview.png`。

## 作り方

```sh
cd bot
NODE_PATH=$(npm root -g) python3 video/build_gag.py 08        # 1本（08日）
NODE_PATH=$(npm root -g) python3 video/build_gag.py 08 09 10  # 何本でも
```

必要なもの：Node.js と `playwright`（Chromium）、Python 3（numpy）、ffmpeg。
声は VOICEVOX エンジン（`VOICEVOX_URL`、既定 `http://127.0.0.1:50021`）を使います。
動いていないときは Open JTalk の仮の声になり、画面の下に「仮の声」と出ます。

確認用：
```sh
PREVIEW="0.5,1.5,2.5,3.5" node video/gag_d08.cjs /tmp/g08   # その秒のコマだけ書き出す
python3 video/sheet.py /tmp/g08 /tmp/s08.png 4              # 1枚に並べる
python3 video/weeksheet.py /tmp/w2.png 08 09 10 11 12 13     # できた mp4 から週の一覧
```

## ファイル

| ファイル | 中身 |
|---|---|
| `gag_dNN.cjs` | 各日のハプニング（約5.4〜6秒、文字なし） |
| `lib.cjs` | ゴリラの腕・手、人、`seq`/`lerp`/`cl`、`svgWrap`、`renderGag` |
| `gorilla_wild.js` | ゴリラの胴体と頭（表情・服）と、うしろ姿（46日） |
| `props.cjs` | 背景と小道具（濃いふちどり、文字なし） |
| `phrases.json` | フレーズ（ふりがな・ローマ字・英訳。`say` は読み方の指定） |
| `frames.cjs` | オチ：フレーズのカードと話すゴリラ。うさぎ＝ふつうの速さ、かめ＝ゆっくり |
| `assemble.py` | 声（ふつう → ゆっくり）、口の動き、mp4 にまとめる。全体は 12〜15 秒 |
| `build_gag.py` | 1日分をまとめて作る |
| `fonts/` | Zen Maru Gothic（SIL Open Font License） |

## 声のクレジット

声は VOICEVOX の「青山龍星（ノーマル）」です（`VOICEVOX_SPEAKER=13`）。
投稿するときは、説明文に「VOICEVOX:青山龍星」と書いてください。

## 指示書との違い

- 元の `gorilla_wild.js` が見つからなかったため、ゴリラの胴体と頭を新しく描きました。
  絵柄をそろえるため、1〜6日も新しいゴリラで作り直しています。
- `lib.cjs` の使い方はそのままで、次の指定を足しています：
  ゴリラ `face` / `look` / `blown` / `wear` / `wet` / `flush` / `nodY` / `mid`（体と腕のあいだに描く物）、腕の `color` / `rim`、手の形 `two` / `pinch`、
  人 `hand2` / `hk` / `cross` / `headRot` / `headDY` / `talk` / `coat` / `steth` / `glasses` / `headphones` / `cap` / `front`、`wristAt()`。
