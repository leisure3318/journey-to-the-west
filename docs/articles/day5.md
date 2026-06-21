---
title: "小白用Claude、GPT Image 2做一款游戏:《西天取经》[AI Coding 实战第五天]"
summary: "第五天：程序化音效系统、宝箱法器、白龙马剧情重做、大招特效升级——44个文件18000行，全程AI写代码。"
author: "leisure"
date: "2026-06-21"
---

# 小白用Claude、GPT Image 2做一款游戏:《西天取经》\[AI Coding 实战第五天]

前四天的进度：

* [第一天：从零开始，一天搞出100多张图](https://mp.weixin.qq.com/s/JsK1kH8ZldzvwnIEKJ0img)
* [第二天：一天写出完整的吸血鬼幸存者核心玩法](https://mp.weixin.qq.com/s/ioHKVoApHQ5Sw0XPwmy_yQ)
* [第三天：Boss战、序幕CG、收徒系统全部上线](https://mp.weixin.qq.com/s/u7oEc-UwhQqhKut3jG1MQw)
* [第四天：AI状态机、技能进化、暴击系统、代码重构](https://mp.weixin.qq.com/s/L0tWptd4UbL9IBervWoc2A)

---

第四天结束的时候，游戏已经有了挺完整的战斗体验——徒弟有独立AI、技能能进化、Boss战有大招。但还缺两样东西：**声音**和**收集感**。

一个完全静音的游戏，体验总是差一截。技能满级之后也没什么额外的惊喜。另外白龙马从开局就在，和原著设定完全对不上。

第五天要解决这三个问题。

## 今天完成了什么

先放结果清单：

| 系统 | 内容 |
|------|------|
| 程序化音效 | 25种音效 + BGM，零外部音频文件 |
| 宝箱系统 | 每局8-12个宝箱，15种法器物品 |
| 物品栏 | 底部9格，数字键/点击使用 |
| 龙息尾迹 | 白龙马移动时留火焰伤害区域 |
| 大招特效升级 | 屏幕闪光/粒子爆发/冲击波/碎片 |
| 大招机制改版 | 平时蓄力，见Boss自动释放 |
| 白龙马剧情重做 | 凡马→鹰愁涧收徒→白龙马化身 |
| 化龙大招 | 龙太子化龙：冲锋+龙息爆炸 |
| 独立大招冷却 | 4人各自升级冷却，不再同时放大招 |

## 一、程序化音效——零文件25种音效

这是今天最意外的一个系统。通常做游戏音效需要找素材或者买音效包，但我让Claude直接用 Web Audio API 从零生成所有声音。

用 Web Audio API 从零生成所有声音——振荡器(oscillator)合成音效，噪声缓冲区做爆炸声，五声音阶(C-D-E-G-A)随机生成BGM旋律。没有任何外部音频文件。

### 核心实现

`SoundManager.ts`，348行，零外部依赖：

```typescript
export class SoundManager {
  private ctx: AudioContext;
  private master: GainNode;
  private muted = false;

  constructor() {
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.15;  // 主音量15%，不吵
    this.master.connect(this.ctx.destination);
  }
}
```

25种音效分为6类：

| 类型 | 音效 |
|------|------|
| 战斗 | 敌人受击/死亡、玩家受伤、爆炸、护盾 |
| 技能 | 升级、选技能、进化、紧箍咒、大慈悲、大招 |
| 事件 | 收徒、骑马、宝箱开启、物品使用、波次变化 |
| 状态 | 回血、低血量警告、死亡保护、游戏结束、通关 |
| UI | 菜单点击、暂停/恢复 |
| 剧情 | 打字机、翻页 |

BGM用五声音阶随机选音符，游戏中节奏轻快，菜单界面空灵慢速：

```typescript
startBgm() {
  const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00]; // C D E G A
  // 每0.4秒随机一个音符，用正弦波+短增益包络
}
```

防音效轰炸的冷却机制：

```typescript
private canPlay(id: string, cooldownMs: number): boolean {
  const now = Date.now();
  if (now - (this.lastPlayed.get(id) ?? 0) < cooldownMs) return false;
  this.lastPlayed.set(id, now);
  return true;
}
```

M键静音切换，带视觉提示。整个音效系统没有一个外部音频文件，全部代码生成。

## 二、宝箱系统——15种法器的收集乐趣

### 设计

每局随机生成8-12个宝箱，散布在地图各处（避开收徒POI 300像素），靠近后自动开启。

3级掉落品质：

| 品质 | 概率 | 物品示例 |
|------|------|---------|
| 普通(绿) | 55% | 人参果(+30HP)、避水珠(+20护盾)、定风丹(+15%移速) |
| 稀有(蓝) | 30% | 紫金葫芦(全屏25%伤害)、芭蕉扇(推开+伤害)、锦斓袈裟(10秒无敌) |
| 传说(橙) | 15% | 九环锡杖(+50%全队伤害30秒)、月光宝盒(时间倒流恢复50%HP) |

15种物品全部有独立效果，捡到后放进底部物品栏，按数字键1-9或点击使用。

### 物品栏实现

`ItemBar.ts`，146行。关键设计：固定9格始终可见，用过的格子变空而不是消失。

```typescript
const MAX_SLOTS = 9;

// 固定9个slot，def为null表示空格
for (let i = 0; i < MAX_SLOTS; i++) {
  this.slots.push({ def: null, count: 0 });
}

// 使用物品：count归零后def设null，不splice不shift
slot.count--;
if (slot.count <= 0) {
  slot.def = null;
  slot.count = 0;
}
```

同类物品自动堆叠，显示 ×N。空格深色背景+灰色边框，有物品的格子用品质颜色描边。

小地图上未开启的宝箱显示为橙色方块（仅揭雾区域可见），引导玩家探索。

## 三、白龙马龙息尾迹

### 实现

`DragonTrail.ts`，102行。白龙马（收徒后）移动时在路径上留下火焰区域，对经过的敌人造成持续伤害。

```typescript
export class DragonTrail {
  private trails: Trail[] = [];
  private lastPos = { x: 0, y: 0 };
  private spawnDist = 40;  // 每移动40像素生成一段

  update(x: number, y: number, enemies: Enemy[], level: number) {
    const dx = x - this.lastPos.x, dy = y - this.lastPos.y;
    if (Math.sqrt(dx*dx + dy*dy) >= this.spawnDist) {
      this.spawnTrail(x, y, level);
      this.lastPos = { x, y };
    }
    // 对范围内敌人造成DPS
  }
}
```

火焰区域有橙色→红色渐变的视觉效果，持续3秒后消失。5级可升级，每级增加伤害和持续时间。

**关键限制**：龙息尾迹只在收徒白龙马之后才启用：

```typescript
if (this.discipleMgr.has("bailongma")) {
  this.dragonTrail.update(horse.x, horse.y, enemies, state.trailLevel);
}
```

## 四、大招特效全面升级

之前的大招就是一张VFX图片缩放一下，太寒碜了。升级后每个大招都有多层特效：

**通用Banner（所有大招触发时）**：
- 屏幕白色闪光（0.15秒）
- 黑色横条从中间展开
- 10个粒子向外爆散
- "大招发动"副标题

**齐天大圣**：6次分身打击，每次火花四溅，最后金色扩散光环 + 全屏冲击环 + 屏幕震荡

**天蓬元帅**：绿色聚气球→急速收缩→向前冲刺→落地砸出3层冲击环 + 8个碎石碎片上抛

**卷帘大将**：蓝色旋涡底圈持续旋转 + 水泡上浮 + 周期震动

**龙太子化龙（新增）**：白光冲锋轨迹→目标点龙息爆炸 + 6次灼烧tick

### 充能机制改版

改动前：只有Boss出现后才开始计时20秒。
改动后：平时就在充能，Boss出现时释放已经充满的大招。

```typescript
update(delta: number, boss: Boss | null, disciples: Map<string, Sprite>) {
  // 始终充能
  for (const [key, cd] of this.cooldowns) {
    this.cooldowns.set(key, cd - delta);
  }
  // 只在Boss存活时释放
  if (!boss?.active) return;
  for (const [key, cd] of this.cooldowns) {
    if (cd <= 0) this.fire(key, boss, disciples);
  }
}
```

### 独立冷却升级

之前4个大招共享同一个20秒冷却，导致每次都同时释放。现在改为每人独立计时，并且可以单独升级冷却时间：

```typescript
{ id: "wukong_ult", name: "大圣蓄力", desc: "齐天大圣冷却-3秒", 
  maxLevel: 3, apply: (s) => { s.wukongUltCd = Math.max(8000, s.wukongUltCd - 3000); } },
```

4个新升级选项（大圣蓄力/天蓬蓄力/卷帘蓄力/化龙蓄力），每级减3秒，最多减9秒（20→11秒），下限8秒。这样升级后4个人的大招交错释放，体验好很多。

## 五、白龙马剧情重做——尊重原著

之前的实现里白龙马从开局就在队伍里，但原著中白龙马是西海龙王三太子，在鹰愁涧吞了唐僧的凡马后被观音收服，化作白马供唐僧骑乘。游戏设定得和原著对上。

1. **开局是凡马**：棕色色调（`setTint(0xc89060)`），存储为"horse"

2. **新增鹰愁涧POI**：在五指山和高老庄之间

```typescript
{ id: "yingchoujian", name: "鹰愁涧", type: "recruit", 
  terrain: "river", radius: 120, 
  recruitKey: "bailongma", recruitName: "白龙马",
  message: "西海龙王三太子化为白马！小白龙加入取经队伍！" }
```

3. **收徒时化龙VFX**：红光 → 震动 → 蓝白色闪光 + 12个龙鳞粒子散落

```typescript
showDragonTransform(horse: Sprite) {
  horse.setTint(0xff3333);  // 先变红
  this.scene.tweens.add({ /* 震动 */ });
  this.scene.time.delayedCall(600, () => {
    horse.clearTint();  // 恢复原色
    // 蓝白闪光 + 12个龙鳞粒子
    for (let i = 0; i < 12; i++) {
      const scale = this.scene.add.circle(horse.x, horse.y, 4, 0x88ccff);
      // 向外散射
    }
  });
}
```

4. **龙息尾迹条件触发**：只有收徒白龙马后才启用
5. **化龙大招**：收徒后注册到大招系统，和其他三个大招一样平时蓄力

收徒顺序改为：悟空（五指山）→ 白龙马（鹰愁涧）→ 八戒（高老庄）→ 沙僧（流沙河），符合原著。

## 六、项目当前状态

### 代码统计

| 指标 | 数值 |
|------|------|
| TypeScript文件 | 44个 |
| 总代码行数 | ~18,000行 |
| config层 | 5个文件 |
| entities层 | 4个文件（唐僧/徒弟/Boss/敌人） |
| systems层 | 15个文件（AI/战斗/音效/宝箱/大招...） |
| ui层 | 8个文件 |
| scenes层 | 4个文件 |
| 图片资产 | 119张（15MB） |
| 外部音频文件 | 0个 |

### 目录结构

```
src/
├── config/         # 游戏配置
│   ├── GameConfig.ts        # 核心常量 + 统一re-export
│   ├── HeroConfig.ts        # 英雄属性 + AI参数
│   ├── EnemyConfig.ts       # 敌人类型 + 刷怪阶段
│   ├── MapConfig.ts         # POI + Boss + 地图生成
│   └── UpgradeConfig.ts     # 23个升级 + 技能映射
├── entities/       # 游戏实体
│   ├── Player.ts            # 唐僧
│   ├── Disciple.ts          # 徒弟
│   ├── Boss.ts              # Boss
│   └── Enemy.ts             # 敌人
├── systems/        # 游戏系统（15个）
│   ├── DiscipleManager.ts   # 徒弟协调层
│   ├── WukongAI.ts          # 悟空状态机
│   ├── BajieAI.ts           # 八戒状态机
│   ├── WujingAI.ts          # 沙僧状态机
│   ├── CloneSystem.ts       # 悟空分身
│   ├── UltimateSystem.ts    # 4个大招（392行）
│   ├── WujingAbilities.ts   # 沙僧被动
│   ├── TangsengSkills.ts    # 唐僧主动技能
│   ├── DragonTrail.ts       # 龙息尾迹（NEW）
│   ├── ChestSystem.ts       # 宝箱系统（NEW）
│   ├── SoundManager.ts      # 程序化音效（NEW）
│   ├── EvolutionSystem.ts   # 技能进化
│   ├── BossSystem.ts        # Boss管理
│   ├── CombatSystem.ts      # 战斗/伤害
│   ├── EnemySpawner.ts      # 刷怪
│   ├── ExperienceSystem.ts  # 经验
│   ├── RecruitmentSystem.ts # 收徒
│   ├── FogOfWar.ts          # 迷雾
│   ├── LandmarkSystem.ts    # 地标
│   └── DecorationSystem.ts  # 装饰物
├── ui/             # UI组件（8个）
│   ├── HUD.ts               # 血条/经验/计时器
│   ├── LevelUpPanel.ts      # 升级3选1
│   ├── SkillBar.ts          # 左侧技能栏
│   ├── ItemBar.ts           # 底部物品栏（NEW）
│   ├── MiniMap.ts           # 小地图
│   ├── BossHpBar.ts         # Boss血条
│   ├── PauseMenu.ts         # 暂停菜单
│   ├── VictoryPanel.ts      # 通关
│   └── GameOverPanel.ts     # 游戏结束
├── scenes/         # 场景
│   ├── BootScene.ts         # 资源加载
│   ├── MenuScene.ts         # 主菜单
│   ├── CutsceneScene.ts     # 序幕CG
│   └── GameScene.ts         # 游戏主场景（纯协调层）
└── main.ts         # 入口
```

### 已实现功能完整列表

- [x] 核心循环：移动/杀怪/经验/升级3选1
- [x] 师徒四人+白龙马，各有独立AI状态机
- [x] 3种敌人行为（chase/ranged/explosive）
- [x] 3个Boss（黄风大王/白骨精/红孩儿）
- [x] 23种升级选项 + 5个技能进化配方
- [x] 4个大招（齐天大圣/天蓬元帅/卷帘大将/龙太子化龙）
- [x] 唐僧主动技能（紧箍咒+大慈悲）
- [x] 白龙马龙息尾迹 + 化龙大招
- [x] 白龙马剧情（凡马→鹰愁涧收徒→白龙马化身）
- [x] 暴击系统（全员暴击，橙色伤害数字）
- [x] 护盾 + 分身 + 沙僧被动
- [x] 宝箱系统（15种法器物品）+ 物品栏
- [x] 程序化音效（25种+BGM，零外部文件）
- [x] 收徒系统（4个POI）
- [x] 迷雾/小地图/地标
- [x] 序幕CG + 主菜单 + 加载进度条
- [x] GitHub Pages自动部署

### 还没做的

- [ ] 更多敌人行为（召唤型、环境型、精英标识）
- [ ] 章节关卡制（81难分章节）
- [ ] 设置面板（音量调节）
- [ ] Boss专属sprite接入（28个Boss图已有）
- [ ] 关卡背景主题（官道/山林/沙漠/水域）

## 七、在线试玩 & 源码

游戏已部署到 GitHub Pages，可以直接浏览器打开玩：

**在线试玩**：https://leisure3318.github.io/journey-to-the-west/

**源码**：https://github.com/leisure3318/journey-to-the-west

全部代码由 Claude 编写，图片由 GPT Image 2 生成，音效由 Web Audio API 程序化合成。

从第一天到第五天，一个人 + 两个AI，做出了一个有44个源文件、18000行代码、119张图片、25种音效的完整游戏。

这个系列会持续更新，感兴趣的朋友可以关注。
