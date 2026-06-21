# 剧情与 AI 行为系统

> 本文档补充 GAME_DESIGN.md，聚焦三个核心问题：
> 1. 开场序幕怎么演
> 2. 过场剧情怎么触发
> 3. 徒弟不再"绕圈"——每个人有独立 AI

---

## 一、序幕：大唐送行

游戏不是直接进战斗。开场是 3-4 张 CG + 文字叙事，建立"一个人出发"的孤独感。

### 画面序列

| # | 画面 | 文字 | 时长 |
|---|------|------|------|
| 1 | 长安皇宫大殿，唐王李世民端坐龙椅，文武百官列两侧，唐僧持通关文牒跪拜 | 「贞观十三年，唐王选大德高僧，往西天取大乘真经。」 | 4s |
| 2 | 长安城门外，唐王与唐僧御弟结拜，递交紫金钵盂，百官远送 | 「御弟哥哥，日久年深，山遥路远，要保重。朕与你结为兄弟，送你金钵一只，白马一匹。」 | 5s |
| 3 | 黄昏官道，唐僧骑白马独行，长安城墙渐远，夕阳如血 | 「宁恋本乡一捻土，莫爱他乡万两金。可这一去，不知何年何月才能回来。」 | 5s |
| 4 | 夜色荒野，唐僧下马步行，远处隐约有狼嚎，手中锡杖微光 | 「十万八千里，九九八十一难。一个人，也要走。」 | 4s → 淡入游戏 |

### 交互设计
- 点击/按任意键推进下一张
- 右上角「跳过 ▶」按钮，首次游玩不可跳过
- 文字逐字显示（打字机效果），点击可跳过动画直接显示完整文字
- 最后一张 CG 淡出后直接进入第一关（无加载屏）

---

## 二、独行阶段（第 1-8 难）

唐僧在遇到悟空之前，**没有任何攻击手段**。这是刻意的设计——让玩家体验"肉体凡胎"的无助感，才会在收到第一个徒弟时产生强烈的满足感。

### 玩法核心

| 机制 | 说明 |
|------|------|
| 移动 | WASD 走位，速度偏慢（120，比正常少 20%） |
| 念经光环 | 被动光环，范围 80px，敌人进入后减速 30%，每秒受 1 点微量伤害 |
| 锡杖闪光 | 紧急技能（30s CD），短暂致盲周围敌人 1.5s，不造成伤害 |
| 存活目标 | 不需要杀敌，只需存活到倒计时结束（2-3 分钟/关） |
| 经验获取 | 敌人在光环中死亡或被致盲后逃跑出界也掉经验珠 |

### 升级选项（独行期专属）

| 选项 | 效果 |
|------|------|
| 佛光普照 | 光环范围 +15 |
| 健步如飞 | 移速 +20 |
| 金光护体 | 受伤减免 15% |
| 般若心经 | 光环伤害 +1/s |

### 难度曲线

独行阶段的敌人数量和攻击欲望都低于正常关卡。核心目的是**叙事**而非高难度挑战。但仍然要有紧张感——唐僧差点死掉，才能衬托出悟空出场的震撼。

---

## 三、收徒剧情触发

每个徒弟的加入都是一个**不可跳过的故事事件**，通过 Boss 战 + CG 过场实现。

### 3.1 收悟空（第 9 难通关后）

**触发条件：** 击败第 9 难 Boss「石中巨魔」

**Boss 战特殊机制：**
- 唐僧无法伤害石巨人，只能走位躲避
- 石巨人攻击同时破坏五行山封印（场地中有 5 块封印石柱）
- 唐僧需要引导石巨人攻击封印石柱（走到石柱旁引诱攻击）
- 5 块石柱全部破坏 → 封印崩解 → 悟空破山而出
- 悟空登场后一棒秒杀石巨人（演出效果）

**CG 序列：**

| # | 画面 | 文字 |
|---|------|------|
| 1 | 五行山崩裂，金光冲天，悟空从碎石中跃出 | 「轰——！五百年了！俺老孙终于出来了！」 |
| 2 | 悟空单膝跪地，唐僧面前 | 「师父在上，受弟子一拜。从今往后，老孙跟你去西天！」 |
| 3 | 观音祥云现身，抛下金箍 | 悟空戴上金箍，疼得满地打滚 → 站起来挠头傻笑 |

**解锁：** 悟空加入队伍，独行阶段结束。从此唐僧有了第一个攻击手段。

### 3.2 收白龙马（第 12 难通关后）

**触发：** 白龙太子吞了唐僧的凡马 → 与悟空水战 → 观音点化变马

**CG：** 白龙腾空，白光一闪变为白马，温顺跪伏在唐僧面前。悟空嘀咕："这马比原来那匹帅多了。"

**解锁：** 白龙马加入，唐僧移速 +30%，经验吸取范围 +50%

### 3.3 收八戒（第 18 难通关后）

**触发：** 悟空变身高翠兰戏耍八戒 → 八戒原形毕露 → 降服入队

**CG：** 八戒耙子一扔跪地求饶，然后背起行李边走边抱怨。唐僧微笑摇头。

**解锁：** 八戒加入，获得 360° 范围攻击

### 3.4 收沙僧（第 21 难通关后）

**触发：** 流沙河三战沙悟净 → 木吒传观音法旨 → 沙僧投降

**CG：** 沙悟净从河底浮出，取下骷髅项链："这九个骷髅，是之前九世取经人的头骨。" 他将骷髅排成法船，渡众人过河。

**解锁：** 沙僧加入，获得远程投射攻击。**至此全阵容集结。**

---

## 四、过场剧情系统（技术设计）

### 4.1 CG 过场格式

一个过场由若干"页"组成，每页 = 一张图 + 一段文字。

```typescript
interface CutscenePage {
  image: string;        // 图片资源路径
  text: string;         // 叙事文字
  speaker?: string;     // 说话人（可选，显示为名字标签）
  duration?: number;    // 自动翻页时间（ms），不设则等点击
}

interface Cutscene {
  id: string;
  pages: CutscenePage[];
  skippable: boolean;   // 是否可跳过
  onComplete?: string;  // 完成后触发的事件
}
```

### 4.2 CG 显示层

- 全屏黑色背景 + 居中图片（16:9，800×450 或等比缩放）
- 图片下方半透明黑色文字区域（底部 1/4 屏幕）
- 文字区左侧显示说话人名字标签（彩色）
- 文字逐字显示，速度 50ms/字
- 点击跳过当前文字动画 / 翻到下一页
- 页间切换：0.3s 交叉淡入淡出

### 4.3 触发时机

| 触发点 | 事件 |
|--------|------|
| 游戏开始 | 播放序幕 CG |
| Boss 击败后 | 播放对应剧情 CG |
| 收徒事件 | 播放收徒 CG → 解锁角色 |
| 章节转换 | 播放章节过渡 CG |
| 特殊剧情（白骨精逐悟空等） | 播放剧情 CG → 修改队伍 |

---

## 五、徒弟 AI 行为重设计

**核心改变：徒弟不再是"绕着唐僧转的武器"，而是有自主意识的战斗伙伴。**

### 5.1 悟空 —— 主动出击型

悟空应该像一个急性子的战士：发现敌人就冲上去打，打完再飞回来。

**状态机：**

```
                 发现敌人
    [跟随] ─────────────→ [出击]
      ↑                      │
      │   击杀/超出牵引距离   │ 接近敌人
      │ ←──────────────── [战斗]
      │                      │
      │   师父血量低          │
      └──────────────────────┘
              [护驾] → 回到师父身边优先防御
```

| 状态 | 行为 | 参数 |
|------|------|------|
| 跟随 | 在唐僧身边闲逛（不是环绕！随机偏移） | idleRadius: 60 |
| 出击 | 高速冲向最近的敌人 | engageSpeed: 250, detectRadius: 300 |
| 战斗 | 对周围敌人使用金箍棒横扫（扇形） | attackRange: 110, arcDeg: 120 |
| 回归 | 杀完或离唐僧太远，飞回来 | leashRadius: 280, returnSpeed: 300 |
| 护驾 | 唐僧 HP < 30% 时强制回到身边，攻击靠近唐僧的敌人 | guardRadius: 100 |

**视觉表现：**
- 出击时拖一条金色残影轨迹
- 回归时脚踩筋斗云（半透明云朵跟随）
- 战斗时金箍棒会拉长（视觉拉伸 sprite）

### 5.2 八戒 —— 防御型贴身护卫

八戒好吃懒做，不会主动出击，但敌人靠近师父时会猛然爆发。

**行为模式：**
- 平时跟在唐僧身后（偏移量 Y+50, X±20 随机晃），走路慢吞吞
- 敌人进入 120px 范围 → 挥钉耙 360° 横扫 + 击退
- 有 20% 概率攻击后打哈欠（延长冷却 50%），体现懒惰性格
- 唐僧加速移动时，八戒会掉队然后急跑追上（lerp 跟随，系数较低）

### 5.3 沙僧 —— 远程支援型

沙僧沉默寡言，站在后方默默输出。

**行为模式：**
- 始终保持在唐僧身后方向（根据唐僧 facing 计算后方位置），距离 100px
- 检测到 250px 内的敌人 → 投掷降妖宝杖（穿透型直线投射物）
- 投射物可穿透 3 个敌人，伤害逐次递减 20%
- 没有敌人时安静跟随，动画为挑着扁担走路

### 5.4 白龙马 —— 被动坐骑

- 唐僧"骑在"白龙马上（视觉上白龙马在唐僧下方半身位）
- 白龙马加入后唐僧移速提升，sprite 切换为骑马版本
- 被动效果：经验吸取范围扩大、移速加成
- 未来进化：化龙形态（主动技能，短暂变龙喷水攻击）

---

## 六、过场 CG 图片提示词

所有 CG 图片统一风格：16:9（1920×1080），水墨画风 + 现代游戏渲染，暖色调。

### CG-01：长安朝堂送行

```
assets/cutscenes/prologue_01_court.png | 1792×1024

Cinematic game cutscene illustration, ancient Tang Dynasty imperial court hall.
Emperor Taizong of Tang sits on a golden dragon throne at the center, wearing 
imperial yellow dragon robes and a black mianguan crown. Young Buddhist monk 
Xuanzang (Tang Monk) kneels before the throne, holding a golden travel permit 
scroll. Rows of court officials in colorful silk robes stand on both sides.
Grand red pillars, golden ceiling with dragon carvings, incense smoke drifting.
Warm golden light streaming through the hall. Chinese ink wash painting meets
modern game concept art style. Cinematic composition, dramatic warm lighting,
rich red and gold palette. 16:9 widescreen format.
```

### CG-02：城门送别

```
assets/cutscenes/prologue_02_farewell.png | 1792×1024

Cinematic game cutscene, outside the grand gate of Chang'an city. Emperor
Taizong personally hands a purple-gold alms bowl to monk Xuanzang, both
standing face to face with hands clasped. A pure white horse waits nearby
with travel supplies. Behind them, hundreds of officials and soldiers line
the ancient city wall. Cherry blossoms or willow catkins float in the warm
spring air. The massive city gate towers behind them. Emotional farewell
atmosphere, golden afternoon sunlight. Chinese ink wash meets modern game
art, warm nostalgic tones, cinematic 16:9 widescreen composition.
```

### CG-03：夕阳独行

```
assets/cutscenes/prologue_03_alone.png | 1792×1024

Cinematic game cutscene, lone Buddhist monk Xuanzang riding a white horse
on an ancient dirt road stretching into the distance. Behind him, the
silhouette of Chang'an city walls grows small on the horizon. Dramatic
sunset sky with deep orange, red and purple clouds. Long shadows stretch
across the dusty road. Sparse dead trees along the roadside. A single
monk against the vast wilderness — emphasizing solitude and determination.
Chinese ink wash painting meets modern cinematic game art. Melancholic
yet hopeful atmosphere. 16:9 widescreen, rule of thirds composition with
the monk in the lower left third.
```

### CG-04：荒野夜行

```
assets/cutscenes/prologue_04_night.png | 1792×1024

Cinematic game cutscene, moonlit wilderness at night. Monk Xuanzang walks
alone on foot leading his white horse by the reins, holding his nine-ringed
pewter staff that emits a faint golden Buddhist glow in the darkness. Dense
forest on both sides with glowing eyes peering from the shadows — wolves
and unknown creatures watching. A thin crescent moon hangs in the starry sky.
Mist creeps along the ground. The monk's expression is fearful but resolute.
The staff's gentle golden light creates a small safe circle around him.
Chinese ink wash meets dark fantasy game art. Moody blue-black palette with
warm golden light contrast. Atmospheric and slightly ominous. 16:9 widescreen.
```

### CG-05：悟空破山而出

```
assets/cutscenes/wukong_freed.png | 1792×1024

Cinematic game cutscene, the legendary Five Elements Mountain shattering apart
in a massive explosion of golden light and rock debris. Sun Wukong (Monkey King)
bursts out from the mountain center — a dynamic action pose mid-leap, golden
fur blazing with divine energy, eyes burning with golden fire, wearing tattered
but still gleaming golden armor. His golden staff extends in one hand. Below,
monk Xuanzang shields his eyes from the blinding light, his kasaya robe
fluttering in the shockwave. Massive boulders and ancient Buddhist seal
talismans fly outward. Divine golden energy columns shoot into the sky, parting
the clouds. Epic scale, explosive energy, liberation after 500 years of
imprisonment. Chinese mythology meets modern cinematic game art. Dynamic
composition, extreme contrast between the golden eruption and the dark
mountain. 16:9 widescreen.
```

### CG-06：师徒结拜

```
assets/cutscenes/wukong_bows.png | 1792×1024

Cinematic game cutscene, emotional moment of bonding. Sun Wukong kneels on
one knee before monk Xuanzang on the rocky remains of Five Elements Mountain.
Wukong's expression shifts from fierce warrior to sincere devotion, one fist
planted on the ground, head bowed. Xuanzang looks down with gentle compassion,
one hand reaching out to help Wukong up. In the background sky, Guanyin
(Avalokitesvara Bodhisattva) watches from a distant cloud with a serene smile,
holding a golden circlet (the headband of obedience). Soft golden sunset light
bathes the scene. Cherry blossom petals drift in the wind despite the rocky
terrain — a touch of Buddhist miracle. Warm, emotional, cinematic. Chinese
ink wash meets modern game concept art. 16:9 widescreen.
```

### CG-07：八戒投降

```
assets/cutscenes/bajie_joins.png | 1792×1024

Cinematic game cutscene, comedic and heartwarming moment at Gao Village (高老庄).
Zhu Bajie (Pigsy) has dropped his Nine-Tooth Rake on the ground and kneels with
a comically pitiful expression, hands clasped in surrender. His pig snout
scrunched up, tears streaming. Behind him, Sun Wukong stands with arms crossed
and a smug grin, still half-disguised as a village maiden with a veil falling
off. Xuanzang on his white horse looks on with a gentle forgiving smile. Village
buildings with thatched roofs in the background, lanterns glowing warmly. A table
of abandoned feast food scattered around from Bajie's earlier revelry. Comedic
but touching atmosphere. Chinese ink wash meets charming game art style. Warm
earthy tones with comedic energy. 16:9 widescreen.
```

### CG-08：沙僧渡河

```
assets/cutscenes/wujing_joins.png | 1792×1024

Cinematic game cutscene, solemn moment at the Flowing Sand River (流沙河).
Sha Wujing emerges from the dark swirling river waters, blue-skinned and
stoic, holding his crescent-moon monk spade vertically. He removes his
necklace of nine skulls and places them on the water surface — the skulls
magically arrange into a raft/boat formation, glowing with pale blue light.
On the far bank, Xuanzang, Wukong (curious), and Bajie (nervous, hiding
behind Wukong) watch. The river is dark and turbulent with sand whirlpools,
but the skull-boat creates a calm path. Mist rises from the water. Sha
Wujing's expression is a mix of relief and deep sadness — 500 years of
waiting finally ending. Somber yet hopeful atmosphere. Chinese ink wash
meets atmospheric game art. Cool blue-gray palette with hints of warm
golden light from the far shore. 16:9 widescreen.
```

---

## 七、实现优先级

### Phase 1（当前可做）
- [ ] 悟空 AI 重写：从环绕改为出击-战斗-回归状态机
- [ ] 八戒/沙僧跟随行为调整（不再强制环绕）
- [ ] 过场 CG 显示系统（CutsceneScene）
- [ ] 序幕 4 张 CG 图片生成

### Phase 2（收徒系统）
- [ ] 独行阶段专属玩法（念经光环、锡杖闪光）
- [ ] 第 1-9 难关卡设计
- [ ] 收悟空 Boss 战 + CG
- [ ] 角色动态解锁（不再一开始全员登场）

### Phase 3（完善剧情线）
- [ ] 收白龙马/八戒/沙僧的 Boss 战 + CG
- [ ] 章节选关系统
- [ ] 剧情回放功能
