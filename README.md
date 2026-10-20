# 水懒 Git 官网

静态官网，部署于 GitHub Pages。产品**不开源**；安装包只走 Releases。

- 站点：https://shaoasher.github.io/ottergit-site/
- 下载：https://github.com/ShaoAsher/ottergit-site/releases/latest/download/OtterGit-macos-arm64.dmg

## 发布安装包

在 `OtterGitApp` 工程内：

```bash
./tool/release_github.sh              # 编译 + 公证 + 上传
./tool/release_github.sh --skip-build # 已有 dist 产物时跳过编译
```

## 本地预览

```bash
python3 -m http.server 8765
```

## 作者

- GitHub：`ShaoAsher`（显示名 Asher_Shao）
- Git 作者：`Asher_Shao <11034191@qq.com>`
