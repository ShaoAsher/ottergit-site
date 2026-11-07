# 水獭 Git 官网

静态官网（GitHub Pages）。**不开源**；Releases 里只有安装包（DMG/ZIP），没有源码。

- 官网：**https://shaoasher.github.io/ottergit-site/**
- 在线试用：https://shaoasher.github.io/ottergit-site/demo/
- 下载 macOS：https://github.com/ShaoAsher/ottergit-site/releases/latest/download/OtterGit-macos-arm64.dmg
- 下载 Windows：https://github.com/ShaoAsher/ottergit-site/releases/latest/download/OtterGit-windows-x64.zip

## 目录

| 路径 | 内容 |
| --- | --- |
| `index.html` | 官网页面（样式内联） |
| `assets/site.js` | 背景环境层、小獭问候、状态章节、在线试用控制、GSAP 动效 |
| `assets/vendor/` | GSAP 3.15.1 与 ScrollTrigger（本地托管，不依赖 CDN） |
| `assets/shots/*.webp` | 界面截图（2560×1600，深色 / 浅色各一套），取自交互演示 |
| `demo/` | 交互演示，由 App 仓库的 `docs/mockup` 导出，官网用 iframe 嵌入 |

## 交互演示

演示的源码在 `OtterGitApp/docs/mockup`，改完后在 App 仓库里导出：

```bash
./tool/export_demo.sh            # 默认导出到 ../ottergit-site/demo
```

脚本会改写素材路径，只复制表情池里用到的动图和品牌图；宣传片复用本仓 `assets/` 里那份。

官网通过 `postMessage({type:'otter-demo', action, value})` 控制演示，演示把 `{type:'otter-demo-state', page, theme, tone, ai}` 回传给官网。参数：`?embed` 隐藏控制台并按 iframe 缩放，`&theme=day` 浅色，`&page=files` 起始页，`&nosplash` 跳过启动动画。

## 截图

`assets/shots/` 用无头 Chrome 打开 `demo/index.html?embed&nosplash`（视口 1282×802，DPR 2），按页面截取 `#win` 窗口区域：`home`、`files`、`history`、`conflict`、`ai` 各深浅两张，再转 WebP（质量 84）。数据全部是演示数据。

## 发布安装包

安装包都从 `OtterGitApp` 的 `release` 分支发出（git-flow 发布分支）：

```bash
git checkout release                  # 已 git flow release finish 并 push
./tool/release_github.sh              # 编译 + 公证 + 上传 macOS DMG/ZIP
./tool/release_github.sh --skip-build # 已有 dist 产物时
```

push `release` 后 `OtterGitApp` 的 GitHub Actions（`.github/workflows/windows.yml`）构建 Windows 包。配了 secret `SITE_RELEASE_TOKEN` 会自动以固定名 `OtterGit-windows-x64.zip`（官网下载链接用这个名字）传到同一个 Release；没配时从 artifact `OtterGit-windows-x64` 取出 zip，改名后补传：

```bash
gh run list --repo ShaoAsher/otter-git --workflow windows-build -L 3
gh release upload v2.0.3 OtterGit-windows-x64.zip \
  --repo ShaoAsher/ottergit-site --clobber
```

不要再建 `site-assets` 之类媒体 Release（会抢占 `/releases/latest`）。

## 宣传片

宣传片（151s，横屏 1080p30）放在 `assets/ottergit-promo.mp4`，字幕 `assets/ottergit-promo.zh.vtt`，封面 `assets/film-poster.jpg`，分享图 `assets/og.jpg`。工程在 App 仓库的 `OtterGitApp/promo/`（HyperFrames，剧本见 `promo/copy/剧本.md`）：

```bash
cd ../OtterGitApp/promo
npm run build && npm run render      # 成片 renders/ottergit-promo.mp4
ffmpeg -i renders/ottergit-promo.mp4 -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart ../../ottergit-site/assets/ottergit-promo.mp4
cp renders/ottergit-promo.zh.vtt ../../ottergit-site/assets/
```

无旁白、无字幕的二创底板：`npm run build:bed && npm run render:bed`。

## 本地预览

```bash
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765/
```

## 作者

- GitHub：`ShaoAsher`（Asher_Shao）
- Git：`Asher_Shao <11034191@qq.com>`
