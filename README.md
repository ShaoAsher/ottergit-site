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

在 `OtterGitApp`：

```bash
./tool/release_github.sh              # 编译 + 公证 + 上传 DMG/ZIP
./tool/release_github.sh --skip-build # 已有 dist 产物时
```

Windows 包由 `OtterGitApp` 的 GitHub Actions（`.github/workflows/windows.yml`）构建，产物是 artifact `OtterGit-windows-x64`，CI 跑完再补传：

```bash
gh run list --repo ShaoAsher/otter-git --workflow windows-build -L 3
gh release upload v2.0.0 OtterGit-2.0.0+11-windows-x64.zip \
  --repo ShaoAsher/ottergit-site --clobber
```

不要再建 `site-assets` 之类媒体 Release（会抢占 `/releases/latest`）。

## 宣传片

宣传片（75s，横屏 1080p30）放在 `assets/ottergit-promo.mp4`，字幕 `assets/ottergit-promo.zh.vtt`，封面 `assets/film-poster.jpg`，分享图 `assets/og.jpg`。工程在 `../ottergit-film/`（HyperFrames）。

## 本地预览

```bash
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765/
```

## 作者

- GitHub：`ShaoAsher`（Asher_Shao）
- Git：`Asher_Shao <11034191@qq.com>`
