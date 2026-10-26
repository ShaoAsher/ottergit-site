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

不要再建 `site-assets` 之类媒体 Release（会抢占 `/releases/latest`）。宣传片（99s，横屏 1080p，豆包旁白 + 卡点配乐）放在本仓 `assets/ottergit-promo.mp4`，工程在 `../ottergit-promo-long/`。

## 本地预览

```bash
python3 -m http.server 8765
```

## 作者

- GitHub：`ShaoAsher`（Asher_Shao）
- Git：`Asher_Shao <11034191@qq.com>`
