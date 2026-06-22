# 西天取经 (Westward Survivors)

西游记 × 吸血鬼幸存者，AI 驱动的独立游戏项目。

## 技术栈

- Python 3（图片生成、sprite 切图）
- GPT Image 2 API（图片生成）
- Phaser 4 + TypeScript（游戏引擎）
- Parcel 2 + parcel-reporter-static-files-copy（打包构建）
- GitHub Actions（CI/CD → GitHub Pages）

## 本地开发

```bash
npm install            # 安装依赖
npm run dev            # 启动开发服务器（Parcel，http://localhost:1234）
npm run build          # 生产构建（输出到 dist/）
```

## 环境变量

图片生成脚本需要以下环境变量：

```bash
export OPENAI_API_KEY="your-api-key"
export IMAGE_API_BASE="your-api-base-url"
```

**绝对不要把实际值提交到代码或 git 历史中。**

## 架构概览

```
GameScene（纯协调层，不含业务逻辑）
  ├── Player（唐僧）
  ├── DiscipleManager → WukongAI / BajieAI / WujingAI + CloneSystem + UltimateSystem + WujingAbilities
  ├── EnemySpawner → Enemy 群（渐进增强：HP/伤害/速度随时间持续提升）
  ├── BossSystem → Boss（6个Boss分布在5个区域）
  ├── BossLootSystem（击杀Boss掉落随机永久宝物）
  ├── CombatSystem（投射物/VFX/伤害/血条）
  ├── ExperienceSystem（经验珠 → 升级）
  ├── RecruitmentSystem（收徒 POI）
  ├── ChestSystem → ItemBar（宝箱 → 物品栏）
  ├── TangsengSkills（紧箍咒/大慈悲）
  ├── DragonTrail（龙息尾迹）
  ├── EvolutionSystem（技能进化配方）
  ├── TerrainSystem（5种地形区域渲染）
  ├── ObstacleSystem（70个可碰撞障碍物，按区域分布）
  ├── BiomeEffects（区域环境粒子+色调叠层）
  ├── SpatialGrid（200px网格空间分区，光环/范围查询优化）
  ├── SaveSystem（localStorage存档：记录/统计/音量）
  ├── FogOfWar / DecorationSystem / LandmarkSystem
  └── UI: HUD / LevelUpPanel / SkillBar / MiniMap / ItemBar / RelicBar / VirtualJoystick / PauseMenu / GameOverPanel / VictoryPanel
```

### 核心设计模式

- **回调解耦**：系统间通过构造函数传入回调通信，不直接互相引用。例如 `ChestSystem(onPickup) → ItemBar(onUse) → GameScene.applyEffect`
- **UpgradeState 中心化**：所有升级数值集中在 `UpgradeState` 对象，GameScene 每帧 sync 给各系统
- **GameScene 是协调层**：只负责 new 系统 + 每帧调 update + 转发事件，业务逻辑在各系统内部
- **事件驱动**：`enemy-killed`、`boss-spawned`、`boss-killed`、`enemy-shoot`、`enemy-explode`、`xp-collected`、`ultimate-activated`、`headband-activated`、`mercy-released`、`evolution-triggered`、`wave-changed`、`enemy-damaged` 通过 Phaser events 解耦
- **程序化纹理**：BootScene 中用 Canvas 绘制简易纹理（grass_tile、chest_closed、chest_open 等），不依赖外部图片
- **地形区域**：TerrainSystem 管理 5 种区域（草原/山林/水泽/沙漠/火域），Graphics 叠层渲染 + 区域专属装饰
- **Boss 宝物**：BossLootSystem 击杀 Boss 生成随机永久宝物（2-3 条属性），RelicBar 右侧展示
- **敌人渐进增强**：EnemySpawner 按时间线性增长 HP/伤害（+4%/分钟）、移速、刷怪上限
- **程序化音效**：SoundManager 用 Web Audio API 生成所有音效（25种），无外部音频文件。五声音阶 BGM，M 键静音

### 游戏画面布局（800×600）

```
┌──────────────────────────────────────────────┐
│ [HP条 y=12]  [计时器 y=8 居中]  [击杀数 右上] │
│ [波次 y=32]                    [小地图 右上角]│
│                                              │
│ [技能栏                                      │
│  左侧纵排]        游 戏 区 域                 │
│                                              │
│                              [冷却条 右下角]  │
│         [物品栏 y=530 底部居中，最多9格]       │
│         [经验条 y=560 底部居中]                │
│         [等级文字 y=574]                      │
└──────────────────────────────────────────────┘
```

UI depth 层级：游戏对象 100+, HUD 900, ItemBar 920, MiniMap 960

## 目录结构

```
src/
├── config/
│   ├── GameConfig.ts            # 核心常量(WORLD/PLAYER/XP) + 统一re-export
│   ├── HeroConfig.ts            # 英雄属性 + AI参数(悟空/八戒/沙僧/白龙马)
│   ├── EnemyConfig.ts           # 敌人类型表 + 刷怪阶段配置
│   ├── MapConfig.ts             # POI配置 + Boss类型表 + 地图生成
│   └── UpgradeConfig.ts         # 19个升级+4个单人升级 + 技能-英雄映射 + UpgradeState
├── entities/
│   ├── Player.ts                # 唐僧：移动、HP、护盾、骑马、受伤飘字
│   ├── Disciple.ts              # 徒弟：三种攻击(arc/area/projectile) + tryAttackTarget
│   ├── Boss.ts                  # Boss：多阶段AI(chase/charge/spin/rest)、防重复死亡
│   └── Enemy.ts                 # 敌人：追踪/远程/爆炸三种行为、击退
├── systems/
│   ├── DiscipleManager.ts       # 徒弟协调层：调度AI+子系统
│   ├── WukongAI.ts              # 悟空状态机：follow/engage/combat/return/guard
│   ├── BajieAI.ts               # 八戒状态机：follow/engage/combat/return/rest
│   ├── WujingAI.ts              # 沙僧状态机：follow/approach/combat/return
│   ├── CloneSystem.ts           # 悟空分身：生成/环绕/攻击
│   ├── UltimateSystem.ts        # 大招系统：齐天大圣/天蓬元帅/卷帘大将
│   ├── WujingAbilities.ts       # 沙僧被动：流沙陷阱/水幕天华/宝杖回旋
│   ├── TangsengSkills.ts        # 唐僧主动：紧箍咒(强化悟空)+大慈悲(全屏净化)
│   ├── DragonTrail.ts           # 白龙马龙息：移动时留火焰尾迹造成持续伤害
│   ├── ChestSystem.ts           # 宝箱：8-12个/局，3tier掉落(55%/30%/15%)，15种物品
│   ├── SoundManager.ts          # 程序化音效（Web Audio API，25种音效+BGM，M键静音）
│   ├── EvolutionSystem.ts       # 技能进化：5个配方检测+合成
│   ├── BossSystem.ts            # Boss生成/碰撞/击败流程
│   ├── CombatSystem.ts          # 投射物/攻击VFX/伤害飘字(含暴击)/敌人血条
│   ├── EnemySpawner.ts          # 刷怪（4阶段密度递增，6种敌人按阶段解锁）
│   ├── ExperienceSystem.ts      # 经验珠吸附(发光脉冲动画) + 升级触发
│   ├── RecruitmentSystem.ts     # 收徒系统（POI触发）
│   ├── TerrainSystem.ts          # 地形区域渲染（5种区域+地面细节）
│   ├── BossLootSystem.ts        # Boss宝物掉落（随机永久属性）
│   ├── ObstacleSystem.ts        # 环境障碍物（70个StaticGroup，按区域分布）
│   ├── BiomeEffects.ts          # 区域环境粒子效果+色调叠层
│   ├── SpatialGrid.ts           # 200px网格空间分区（光环/范围查询优化）
│   ├── SaveSystem.ts            # localStorage存档（记录/统计/音量）
│   ├── FogOfWar.ts              # 战争迷雾
│   ├── LandmarkSystem.ts        # 地标显示
│   └── DecorationSystem.ts      # 地图装饰物（按区域分配，350个）
├── ui/
│   ├── HUD.ts                   # HP条/XP条/计时器/击杀数/波次/冷却条
│   ├── LevelUpPanel.ts          # 升级3选1卡牌（显示角色归属标签）
│   ├── SkillBar.ts              # 左侧技能栏（文字按人物分组）
│   ├── ItemBar.ts               # 底部物品栏（数字键使用，支持堆叠×N）
│   ├── BossHpBar.ts             # Boss血条
│   ├── MiniMap.ts               # 右上角小地图（区域颜色+迷雾+POI+宝箱+玩家位置）
│   ├── RelicBar.ts              # 右侧宝物栏（Boss掉落宝物图标+tooltip）
│   ├── VirtualJoystick.ts       # 移动端虚拟摇杆（触摸设备自动启用）
│   ├── VictoryPanel.ts          # 通关画面
│   ├── PauseMenu.ts             # ESC暂停/恢复
│   └── GameOverPanel.ts         # 游戏结束画面（统计+重开）
├── scenes/
│   ├── BootScene.ts             # 资源加载 + 动画注册 + 程序化纹理（含宝箱）
│   ├── MenuScene.ts             # 主菜单（山水画背景+师徒行走）
│   ├── CutsceneScene.ts         # 序幕CG（贞观十三年...）
│   └── GameScene.ts             # 纯系统协调层（~266行）
└── main.ts                      # Phaser 启动入口 + 全局错误捕获

assets/
├── sprites/heroes/sliced_v3/    # 英雄切图输出（128×128帧）
├── sprites/enemies/common/      # 30 种普通小怪（已压缩至192px）
├── sprites/enemies/bosses/      # 28 个 Boss（已压缩至384px）
├── portraits/                   # 角色肖像（原始尺寸，未加载）
├── skills/vfx/                  # 20 张技能特效（已压缩至256px）
├── skills/icons/                # 19 张技能图标（已压缩至128px）
├── skills/items/                # 15 张法器图标（已压缩至128px）
├── pois/                        # 10 张POI场景图（GPT Image 2，已压缩至960px）
├── cutscenes/                   # 4 张序幕CG（已压缩至960px）
├── menu_bg.png                  # 首页山水画（已压缩至960px）
└── series/                      # 公众号系列封面图

scripts/
├── slice_sprites_v3.py          # sprite sheet 自动切图
├── generate_image.py            # 单张图片生成
├── generate_all_skills.py       # 批量生成技能图片（52张）
├── generate_all_enemies.py      # 批量生成敌人图片（58张）
├── generate_riding_sprite.py    # 生成骑马唐僧sprite
├── generate_remaining_cg.py     # 生成剩余CG
└── optimize_assets.sh           # 图片批量压缩（270MB→15MB）

docs/
├── GAME_DESIGN.md               # 游戏设计文档（81关、角色、Boss）
├── SKILL_SYSTEM.md              # 技能系统（20技能+进化+15法器）
├── ENEMY_DESIGN.md              # 妖怪设计（30小怪+28Boss+数值公式）
├── CHEST_SYSTEM.md              # 宝箱系统设计（15物品+掉落+UI）
└── STORY_SYSTEM.md              # 剧情系统设计
```

## 关键文件

| 文件 | 用途 |
|------|------|
| src/config/GameConfig.ts | 核心常量(WORLD 6400×4800, PLAYER, XP) + 统一 re-export 入口 |
| src/config/HeroConfig.ts | 英雄数值 + AI 参数 |
| src/config/UpgradeConfig.ts | 19个升级+4个单人升级 + UpgradeState 接口 + defaultUpgradeState() |
| src/scenes/GameScene.ts | 核心游戏场景（纯协调层，~266行） |
| src/scenes/BootScene.ts | 资源加载 + 动画注册 + 程序化纹理生成 |
| src/systems/DiscipleManager.ts | 徒弟管理协调层（~244行） |
| src/systems/ChestSystem.ts | 宝箱系统 + CHEST_ITEMS 掉落表（15物品） |
| src/ui/ItemBar.ts | 底部物品栏（堆叠、数字键、点击使用） |

## 已实现功能

- [x] 核心循环：移动/杀怪/经验/升级3选1
- [x] 师徒四人+白龙马，各有独立AI状态机
- [x] 5种敌人行为（chase/ranged/explosive/summoner/trapper）
- [x] 6个Boss（黑熊精/黄风大王/白骨精/蜘蛛精/金角大王/红孩儿）
- [x] 大招系统（Boss战每20秒触发）
- [x] 暴击系统（橙色伤害数字+尺寸区分暴击+全员暴击）
- [x] 护盾系统（沙僧卷帘守护）
- [x] 分身系统（悟空分身术）
- [x] 沙僧被动技能（流沙陷阱/水幕天华/宝杖回旋）
- [x] Boss战唐僧骑马（白龙马隐藏，移速+60）
- [x] 收徒系统（POI触发）
- [x] 迷雾/小地图/地标
- [x] 序幕CG + 主菜单
- [x] 全局错误捕获（DOM红色横条）
- [x] 图片压缩（270MB→15MB）
- [x] GitHub Pages 自动部署
- [x] 技能进化系统（5个配方：齐天大圣/万猴朝宗/食神/金身罗汉/通天神目）
- [x] 加载进度条（48MB资源）
- [x] 唐僧主动技能 — 紧箍咒（强化悟空）+ 大慈悲（全屏净化）+ 倒计时UI
- [x] 白龙马龙息尾迹（移动时留火焰伤害区域）
- [x] 宝箱系统（15-25个/局，15种物品，3tier掉落，小地图橙色标记）
- [x] 物品栏（底部9格，数字键/点击使用，同类堆叠×N）
- [x] 程序化音效系统（25种音效 + 五声音阶BGM，Web Audio API，M键静音）
- [x] 大招特效升级（屏幕闪光/粒子爆发/冲击波/碎片/旋涡）
- [x] 大招平时积累、见Boss自动释放
- [x] 大地图 6400×4800 + 5 种地形区域（草原/山林/水泽/沙漠/火域）
- [x] 6 个 Boss 分布在不同区域（黑熊精/黄风大王/白骨精/蜘蛛精/金角大王/红孩儿）
- [x] Boss 宝物系统（击杀掉落随机永久加成宝物 + 右侧宝物栏）
- [x] 敌人渐进增强（HP/伤害/速度随时间持续提升）
- [x] POI 场景图片圆形融合（Canvas 径向渐隐，边缘自然过渡）
- [x] 设置面板（暂停菜单内音量滑块 + 静音按钮）
- [x] 环境障碍物（70 个可碰撞物按区域分布，玩家/敌人均碰撞）
- [x] 伤害飘字对象池（40 个 Text 循环复用，减少 GC）
- [x] 移动端虚拟摇杆（左下角触摸摇杆，触摸设备自动启用）
- [x] 区域环境效果（火域飘火/沙漠风沙/沼泽雾气/森林落叶+色调叠层）
- [x] 存档系统（localStorage：最佳记录/Boss 进度/音量持久化）
- [x] 空间分区碰撞（SpatialGrid 200px 网格，光环查询 O(nearby) 替代 O(all)）

## 待开发功能（按优先级）

- [ ] **章节关卡制** — 81难分章节，难度递增，章节间过场
- [ ] **Boss 专属 sprite sheet** — 28 个 Boss 图已有，需切图接入动画
- [ ] **剧情回放** — 查看已解锁的剧情/CG

## 添加新系统的步骤

1. 在 `src/systems/` 或 `src/ui/` 创建文件
2. 如需数值配置，加到 `UpgradeConfig.ts` 的 `UpgradeState` 接口和 `defaultUpgradeState()`
3. 如需升级选项，加到 `UPGRADES` 数组和 `SKILL_HERO` 映射
4. 在 `GameScene.create()` 中实例化，`tick()` 中调 update
5. 如需图标/纹理且无现成图片，在 `BootScene` 中用程序化 Canvas 生成
6. 如需在小地图显示，修改 `MiniMap.update()` 接收新数据

## 切图注意事项

- 每个角色有独立的 overlap 和 fragment 参数，见 `slice_sprites_v3.py` 中的 `OVERLAP_MAP` / `FRAGMENT_MAP`
- 坏帧通过 `BAD_FRAMES` 字典自动替换，新发现的坏帧加到这里
- sprite sheet 格式：4行(上右下左) × 5列(idle+walk1-4)，每帧 128×128

## 图片压缩规格

| 类型 | 原始尺寸 | 压缩后 | 游戏显示尺寸 |
|------|----------|--------|-------------|
| 技能图标 | 1254px | 128px | 48px |
| 法器图标 | 1254px | 128px | 48px |
| VFX特效 | 1254px | 256px | 60-250px |
| 普通小怪 | 1254px | 192px | 50-80px |
| Boss | 1254px | 384px | 180-230px |
| 背景/CG | 1536-1672px | 960px | 800×600 |

修改 scale 值时注意：`显示尺寸 = 图片像素 × scale`

## 代码规范

- **模块化**：每个系统独立文件，不要把逻辑全塞进 Scene
- **定期重构**：超过 200 行的文件必须拆
- **单一职责**：一个类/函数只做一件事
- **不造屎山**：宁可多花 5 分钟重构，也不要堆烂代码
- **类型安全**：不要 any 满天飞
- **常量集中管理**：数值放 config 文件，不要硬编码

## 项目统计（Day 6 结束）

| 指标 | 数值 |
|------|------|
| TypeScript 文件 | 52 个 |
| 总代码行数 | ~22,000 行 |
| 图片资产 | 129 张（15MB） |
| 外部音频文件 | 0 个 |
| 版本 | v0.5 |

## 公众号系列

- 系列名：「零基础用AI做游戏」
- 统一封面图：`assets/series/cover.png`
- 每日进度记录在 `DEVLOG.md`
- 文章草稿在 `docs/articles/`

| 天数 | 标题 | 链接 |
|------|------|------|
| Day 1 | 从零开始，一天搞出100多张图 | https://mp.weixin.qq.com/s/JsK1kH8ZldzvwnIEKJ0img |
| Day 2 | 一天写出完整的吸血鬼幸存者核心玩法 | https://mp.weixin.qq.com/s/ioHKVoApHQ5Sw0XPwmy_yQ |
| Day 3 | Boss战、序幕CG、收徒系统全部上线 | https://mp.weixin.qq.com/s/u7oEc-UwhQqhKut3jG1MQw |
| Day 4 | AI状态机、技能进化、暴击系统、代码重构 | https://mp.weixin.qq.com/s/L0tWptd4UbL9IBervWoc2A |
| Day 5 | 程序化音效、宝箱法器、白龙马剧情重做 | https://mp.weixin.qq.com/s/iB__LPwymy4Ri1SCts9WbQ |
| Day 6 | 地图扩大4倍，Boss从3变6，AI一天写了8个新系统 | 草稿箱待发 |

## Day 7 开发方向（待确认）

- [ ] **章节关卡制** — 81难分章节，每章不同 Boss 组合，难度递增，章节间过场
- [ ] **Boss 专属 sprite sheet** — 28 个 Boss 图已有（assets/sprites/enemies/bosses/），需切图脚本接入动画
- [ ] **剧情回放/CG 画廊** — 查看已解锁的剧情和收徒 CG
