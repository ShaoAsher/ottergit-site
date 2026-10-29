# 水獭 Git 官网

静态官网（GitHub Pages）。**不开源**；Releases 里只有安装包（DMG/ZIP），没有源码。

- 官网：**https://shaoasher.github.io/ottergit-site/**
- 下载：https://github.com/ShaoAsher/ottergit-site/releases/latest/download/OtterGit-macos-arm64.dmg

## 发布安装包

在 `OtterGitApp`：

```bash
./tool/release_github.sh              # 编译 + 公证 + 上传 DMG/ZIP
./tool/release_github.sh --skip-build # 已有 dist 产物时
```

不要再建 `site-assets` 之类媒体 Release（会抢占 `/releases/latest`）。

## 宣传片与截图

宣传片（75s，横屏 1080p30，豆包「儒雅逸辰」旁白 + 配乐，−16 LUFS）放在本仓 `assets/ottergit-promo.mp4`，字幕 `assets/ottergit-promo.zh.vtt`，封面 `assets/film-poster.jpg`，分享图 `assets/og.jpg`。工程在 `../ottergit-film/`（HyperFrames），文案底稿在 `../ottergit-film/copy/`。

`assets/shots/*.webp` 是 App 截图模式实拍（2400×1452），原图在 `../ottergit-film/capture/raw/`，由 `tool/export_shots.py` 导出。

改片子后在 `../ottergit-film` 里：

```bash
npx --yes hyperframes@0.8.180 render --quality high --fps 30 -o renders/ottergit-promo.mp4
cp renders/ottergit-promo.mp4 renders/ottergit-promo.zh.vtt ../ottergit-site/assets/
```

改了旁白要依次跑 `tool/ark_tts.py` → `tool/plan.py` → `tool/make_bgm.py` → `tool/mix_vo.py` → `tool/check_vo.py` → `tool/make_vtt.py`，再渲染。

## 本地预览

```bash
python3 -m http.server 8765
# 手机版验收截图（在 ../ottergit-film 里跑）
node tool/shoot_site.mjs http://127.0.0.1:8765/ 390 /tmp/site-m.png 1 2
```

## 作者

- GitHub：`ShaoAsher`（Asher_Shao）
- Git：`Asher_Shao <11034191@qq.com>`
