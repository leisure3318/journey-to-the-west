# 🐒 西天取经 — Westward Survivors

> 西游记 × 吸血鬼幸存者，一款用 AI 驱动开发的独立游戏

![cover](assets/series/cover.png)

## 🎮 在线试玩

**[👉 点击开始游戏](https://leisure3318.github.io/journey-to-the-west/)**

## 关于

「西天取经」是一款以《西游记》为主题的吸血鬼幸存者类游戏。操控唐僧，收服悟空、八戒、沙僧、白龙马四位徒弟，一路西行降妖伏魔。

本项目是「零基础用AI做游戏」公众号系列的实战产物，从游戏设计、图片生成到代码实现全程由 AI 辅助完成。

## 技术栈

| 技术 | 用途 |
|------|------|
| **Phaser 4 + TypeScript** | 游戏引擎 + 类型安全 |
| **Parcel 2** | 打包构建 |
| **Web Audio API** | 程序化音效（25种音效 + BGM，零外部音频文件） |
| **GPT Image 2** | 游戏图片资产生成（119张） |
| **Claude** | 全部代码编写 + 架构设计 |
| **GitHub Actions** | 自动部署到 GitHub Pages |

## 游戏特色

- 🐵 **师徒四人 + 白龙马**：各有独立 AI 状态机，自主战斗
- ⚔️ **23种升级 + 5个进化配方**：齐天大圣、万猴朝宗、食神、金身罗汉、通天神目
- 🐉 **4个大招**：齐天大圣 / 天蓬元帅 / 卷帘大将 / 龙太子化龙，平时蓄力 Boss 战自动释放
- 🎯 **唐僧主动技能**：紧箍咒（强化悟空）+ 大慈悲（全屏净化）
- 🏇 **白龙马剧情**：开局凡马 → 鹰愁涧收徒 → 白龙马化身 + 龙息尾迹
- 📦 **宝箱系统**：15种法器物品，3级掉落品质
- 🎵 **全程序化音效**：Web Audio API 生成 25 种音效 + 五声音阶 BGM
- 🗺️ **迷雾探索**：大地图 + 小地图 + 收徒 POI + 宝箱标记
- 👹 **3种 Boss**：黄风大王 / 白骨精 / 红孩儿，多阶段 AI

## 操作方式

| 按键 | 功能 |
|------|------|
| WASD / 方向键 | 移动 |
| 鼠标点击 | 移动到目标位置 |
| 1-9 | 使用物品栏对应物品 |
| M | 静音切换 |
| ESC | 暂停 / 恢复 |

## 本地开发

```bash
git clone https://github.com/leisure3318/journey-to-the-west.git
cd journey-to-the-west
npm install
npm run dev        # http://localhost:1234
```

构建：
```bash
npm run build      # 输出到 dist/
```

## 项目结构

```
src/
├── config/         # 游戏配置（5个文件）
├── entities/       # 游戏实体：唐僧/徒弟/Boss/敌人
├── systems/        # 游戏系统（15个）：AI/战斗/音效/宝箱/大招...
├── ui/             # UI组件（8个）：HUD/技能栏/物品栏/小地图...
├── scenes/         # 场景：启动/菜单/CG/游戏
└── main.ts         # 入口

assets/             # 游戏资产（119张图片，15MB）
scripts/            # 图片生成 + 切图 + 压缩脚本
docs/               # 设计文档（游戏/技能/妖怪/宝箱/剧情）
```

## 图片生成

所有游戏图片由 GPT Image 2 生成，包括：
- 5 个英雄 sprite sheet（128×128 帧，4方向×5动作）
- 30 种小怪 + 28 个 Boss
- 20 张技能特效 + 19 张技能图标 + 15 张法器图标
- 4 张序幕 CG + 山水画主菜单背景

生成脚本需要配置环境变量：
```bash
export OPENAI_API_KEY="your-api-key"
export IMAGE_API_BASE="your-api-base-url"
```

## 公众号系列

本项目配套「零基础用AI做游戏」系列文章，记录从零开始的完整开发过程。

## License

MIT
