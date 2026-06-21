# 西行幸存者 (Westward Survivors)

> 西游记 × 吸血鬼幸存者 —— 九九八十一难，一路向西

---

## 一、游戏概述

唐僧奉旨西行取经，途经九九八十一难。玩家操控唐僧在无尽妖魔的围攻中存活，沿途收服孙悟空、猪八戒、沙悟净三位徒弟以及白龙马。徒弟作为「环绕武器」自动攻击，唐僧本体以走位、念经（被动光环）为核心，越往西走妖魔越强，直到踏入雷音寺。

**核心卖点：**
- 唐僧不能直接攻击 —— 只能靠徒弟和法器
- 徒弟 = 武器系统，每个徒弟有独立升级树
- 八十一难 = 81关，每关有独立boss和剧情
- 收徒是永久性剧情事件，不是随机掉落

---

## 二、核心玩法

### 2.1 基础循环

```
进入关卡（难）→ 存活倒计时（3-8分钟）→ 击杀小怪获取经验
→ 升级选择强化 → Boss出现 → 击败Boss → 剧情过场 → 进入下一难
```

### 2.2 唐僧机制

| 属性 | 说明 |
|------|------|
| 生命 | 血量高但无攻击，被碰即掉血 |
| 念经 | 被动光环，范围内小怪减速/受持续伤害（金光经文） |
| 慈悲心 | 积攒慈悲值可触发「大慈大悲」全屏净化 |
| 紧箍咒 | 主动技能，短暂强化孙悟空攻击力（有冷却） |
| 走位速度 | 基础较慢，白龙马加入后大幅提升 |

### 2.3 徒弟武器系统

徒弟围绕唐僧旋转/跟随，自动攻击进入范围的妖怪：

| 徒弟 | 定位 | 攻击方式 | 环绕行为 |
|------|------|----------|----------|
| 孙悟空 | 主力输出 | 金箍棒横扫（近战弧形）、分身打击 | 最近距离环绕，冲向最近敌人 |
| 猪八戒 | 群体控制 | 九齿钉耙砸地（AoE圈）、嘴拱（击退） | 中距离环绕，优先攻击密集群 |
| 沙悟净 | 持续伤害 | 降妖宝杖投掷（穿透直线）、流沙陷阱 | 远距离环绕，攻击唐僧背后方向 |
| 白龙马 | 被动增益 | 不直接攻击 | 唐僧骑乘，+移速/+经验获取范围 |

### 2.4 升级系统

每次升级从3个选项中选1个：

**徒弟强化（类似武器升级）：**
- 孙悟空：棒扫范围↑ / 分身数量↑ / 七十二变（随机变身增益）/ 火眼金睛（揭示隐身敌人）
- 猪八戒：AoE范围↑ / 击退力↑ / 天蓬元帅觉醒（短暂飞天攻击）/ 食量（击杀回血）
- 沙悟净：穿透数↑ / 攻速↑ / 流沙河领域（减速区域）/ 经卷守护（保护唐僧的屏障）
- 白龙马：移速↑ / 经验范围↑ / 龙息（被动火焰尾迹）/ 化龙（短暂变身攻击）

**法器系统（类似被动道具）：**
- 金钵盂：经验吸取范围+
- 锦斓袈裟：受伤减免
- 九环锡杖：念经光环范围+
- 通关文牒：关卡奖励+
- 人参果：每30秒回血
- 紫金红葫芦：吸收远处敌人到身边（高风险高收益）
- 芭蕉扇：周期性全屏击退
- 照妖镜：揭示隐身敌人+伤害加成

---

## 三、角色设计 & 图片生成提示词

### 图片资源目录结构

```
assets/
├── sprites/          # 游戏内角色sprite（1:1）
│   ├── heroes/       # 主角团
│   └── enemies/      # 敌人
├── portraits/        # 角色立绘/头像（3:4）
├── bosses/           # Boss立绘（16:9）
└── cutscenes/        # 过场剧情CG（16:9）
```

### 3.1 唐僧（玄奘）

**角色设定：**
肉体凡胎，不会武功，但佛法精深。金光护体是唯一的自保手段。面容慈悲坚毅，穿金边袈裟，手持九环锡杖。游戏中是唯一可控角色，核心玩法是走位和管理徒弟。

**形象提示词：** `1:1 | 1024×1024` → `assets/sprites/heroes/tangseng_sprite.png`

```
Top-down 2D game character sprite sheet, Tang Monk (Xuanzang) from Journey to the West.
Strict top-down perspective, camera directly above. Young Buddhist monk with kind but
determined eyes, clean-shaven head with 9 ordination scars. Wearing a magnificent
golden-bordered crimson kasaya robe over simple white inner garments. Holding a nine-ringed
pewter staff in right hand, golden alms bowl tucked at waist. A subtle golden Buddha-light
halo glows behind him. Chibi/cute stylized proportions (large head, small body) suitable
for a top-down action game like Vampire Survivors. 4-directional idle + walk animation
poses with exaggerated leg movement for clear walk cycles. White background, pixel art
influenced but smooth vector style, vibrant colors, clean outlines.
```

**头像/立绘提示词：** `3:4 | 768×1024` → `assets/portraits/tangseng_portrait.png`

```
Portrait illustration of Tang Monk (Xuanzang), young Buddhist monk with serene compassionate
expression, shaved head with 9 ordination dot scars, wearing ornate golden-red kasaya robe,
nine-ringed monk staff resting on shoulder, golden Buddhist halo behind head, ink wash
painting meets modern game art style, dramatic lighting, rich warm tones, Journey to the
West fantasy theme, semi-realistic anime style, upper body shot, detailed fabric textures.
```

---

### 3.2 孙悟空（齐天大圣）

**角色设定：**
五行山下压了500年，被唐僧救出后拜其为师。桀骜不驯但忠心耿耿。金箍棒可大可小，火眼金睛能识破一切伪装。游戏中是第一个获得的徒弟，也是主力输出。

**形象提示词：** `1:1 | 1024×1024` → `assets/sprites/heroes/wukong_sprite.png`

```
STYLE ANCHOR: Match exact layout and art style of Tang Monk sprite sheet — 4 rows
(Up/Right/Down/Left) × 5 columns (1 idle + 4 walk frames), soft cel-shaded chibi style
with warm color palette, labeled directions and frame numbers.

Top-down 2D game character sprite sheet, Sun Wukong (Monkey King) from Journey to the West.
Anthropomorphic monkey warrior with golden fur, fierce golden eyes with fire pupils,
wearing golden chain mail armor with tiger-skin skirt, golden phoenix-feather cap (紫金冠)
on head, red face paint marks. Wielding the Ruyi Jingu Bang (golden iron staff with red
tips). Chibi/cute stylized proportions, energetic and mischievous expression. Surrounded
by faint golden cloud wisps. White background, pixel art influenced but smooth vector
style, vibrant colors, clean outlines.
```

**头像/立绘提示词：** `3:4 | 768×1024` → `assets/portraits/wukong_portrait.png`

```
Portrait illustration of Sun Wukong the Monkey King, fierce golden-furred monkey face with
burning golden fire-eyes (火眼金睛), wearing ornate golden phoenix-feather cap, golden chain
mail visible at collar, holding the massive Ruyi Jingu Bang staff, mischievous confident
smirk, swirling cloud energy around him, ink wash meets modern game art style, dynamic
action pose, Journey to the West fantasy theme, semi-realistic style with Eastern
mythological flair, dramatic red and gold color palette.
```

---

### 3.3 猪八戒（天蓬元帅）

**角色设定：**
前天蓬元帅，因调戏嫦娥被贬下凡投了猪胎。好吃懒做但关键时刻靠得住。九齿钉耙是天庭神兵，砸地时能造成大范围震荡。游戏中是AoE群控担当。

**形象提示词：** `1:1 | 1024×1024` → `assets/sprites/heroes/bajie_sprite.png`

```
STYLE ANCHOR: Match exact layout and art style of Tang Monk sprite sheet — 4 rows
(Up/Right/Down/Left) × 5 columns (1 idle + 4 walk frames), soft cel-shaded chibi style
with warm color palette, labeled directions and frame numbers.

Top-down 2D game character sprite sheet, Zhu Bajie (Pigsy) from Journey to the West.
Anthropomorphic pig man with round pink face, large floppy ears, prominent snout, small
beady eyes with a lazy but lovable expression. Rotund body wearing dark blue-black monk
robes loosely tied, belly slightly exposed. Wielding the Nine-Tooth Iron Rake (九齿钉耙),
a massive crescent-shaped rake weapon with 9 prongs. Chibi/cute stylized proportions,
comedic chunky build. White background, pixel art influenced but smooth vector style,
vibrant colors, clean outlines.
```

**头像/立绘提示词：** `3:4 | 768×1024` → `assets/portraits/bajie_portrait.png`

```
Portrait illustration of Zhu Bajie (Pigsy/Marshal Tianpeng), anthropomorphic pig warrior
with a round jovial face, large droopy ears, wide snout, small squinting eyes with
surprisingly cunning gleam. Wearing loosely draped dark indigo monk robes revealing a hint
of his former celestial marshal armor underneath. Holding the gleaming Nine-Tooth Iron Rake
over shoulder. Background hints of his former heavenly marshal glory with faded celestial
clouds. Ink wash meets modern game art style, warm earthy tones with celestial blue accents,
Journey to the West fantasy theme, semi-realistic with comedic charm.
```

---

### 3.4 沙悟净（卷帘大将）

**角色设定：**
前卷帘大将，因打碎琉璃盏被贬流沙河为妖。沉默寡言，任劳任怨，是队伍的后勤和防线。降妖宝杖可投掷穿透。游戏中负责远程穿透和防守。

**形象提示词：** `1:1 | 1024×1024` → `assets/sprites/heroes/wujing_sprite.png`

```
STYLE ANCHOR: Match exact layout and art style of Tang Monk sprite sheet — 4 rows
(Up/Right/Down/Left) × 5 columns (1 idle + 4 walk frames), soft cel-shaded chibi style
with warm color palette, labeled directions and frame numbers.

Top-down 2D game character sprite sheet, Sha Wujing (Sandy) from Journey to the West.
Tall stoic blue-skinned monk with a bald head adorned with a skull necklace (9 skulls),
short red beard, deep-set serious eyes. Wearing simple brown monk robes with rope belt,
carrying a large crescent-moon spade staff (降妖宝杖/月牙铲). Muscular build suggesting
hidden strength. Chibi/cute stylized proportions but maintaining his tall serious demeanor.
White background, pixel art influenced but smooth vector style, muted cool blue tones,
clean outlines.
```

**头像/立绘提示词：** `3:4 | 768×1024` → `assets/portraits/wujing_portrait.png`

```
Portrait illustration of Sha Wujing (Sandy/Curtain-Raising General), imposing blue-skinned
warrior monk with solemn expression, bald head, short crimson beard, wearing a necklace of
9 bleached skulls. Simple earth-toned monk robes over a powerful frame. Holding the
crescent-moon monk's spade weapon vertically. Background of swirling sand and river mist
suggesting his origin in the Flowing Sand River. Ink wash meets modern game art style,
cool blue and earth tones, Journey to the West fantasy theme, dignified and melancholic
atmosphere.
```

---

### 3.5 白龙马（三太子敖烈）

**角色设定：**
西海龙王三太子，因纵火烧了殿上明珠被判死罪，后被观音点化变为白马驮唐僧西行。平时是白马形态，关键时刻可短暂化龙。游戏中是被动增益单位。

**形象提示词：** `1:1 | 1024×1024` → `assets/sprites/heroes/bailongma_sprite.png`

```
STYLE ANCHOR: Match exact layout and art style of Tang Monk sprite sheet — 4 rows
(Up/Right/Down/Left) × 5 columns (1 idle + 4 walk frames), soft cel-shaded chibi style
with warm color palette, labeled directions and frame numbers.

Top-down 2D game character sprite sheet, White Dragon Horse from Journey to the West.
A majestic pure white horse with subtle iridescent dragon scales visible on legs and mane,
glowing ethereal blue-white mane and tail that flows like water, gentle intelligent eyes
with vertical dragon pupils. Wearing simple travel saddle with Buddhist scripture scrolls
strapped to sides. Faint dragon aura shimmer. Chibi/cute stylized proportions, elegant and
mystical. White background, pixel art influenced but smooth vector style, luminous white
and pale blue palette, clean outlines.
```

**化龙形态提示词：** `1:1 | 1024×1024` → `assets/sprites/heroes/bailongma_dragon_sprite.png`

```
STYLE ANCHOR: Match exact art style of Tang Monk sprite sheet — soft cel-shaded chibi
style with warm color palette, clean outlines, white background. Single sprite with
4-directional views (Up/Right/Down/Left) in one row.

Top-down 2D game character sprite, White Dragon Prince (Ao Lie) true form from Journey
to the West. A sleek Eastern dragon with pure white scales, flowing silvery-blue whiskers
and mane, serpentine body coiling in a protective circle, crystalline blue dragon eyes,
pearl held in one claw. Radiating holy water energy, frost and mist trailing from body.
Chibi/cute stylized proportions suitable for game sprite. Attack pose breathing ice-water
beam. White background, pixel art influenced but smooth vector style, ethereal white-blue
palette with silver highlights, clean outlines.
```

---

## 四、剧情章节设计（八十一难）

游戏分为 **9大章** × **每章9难** = **81难**。每章对应西行路上一个大区域，章末有剧情高潮和大Boss。

---

### 第一章：长安出发·五行山（第1-9难）

**主题：** 唐僧独行 → 收服孙悟空
**环境：** 唐朝官道、荒野、山林、五行山

#### 剧情线

唐僧从长安出发，孤身一人踏上取经路。初期只有念经光环和走位，极度考验操作。沿途遇到普通山贼和低级妖精。到达五行山时，感受到强大的封印气息。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 1 | 长安送别 | 强盗、野狼 | 教学关，学会走位和念经 |
| 2 | 官道遇匪 | 山贼群、马匪头目 | 唐僧差点被抢，展示脆弱性 |
| 3 | 荒野夜行 | 野狼群、狼妖 | 夜间关，视野受限 |
| 4 | 古寺避难 | 树妖、蜘蛛小妖 | 发现破败寺庙暂歇，寺内有妖 |
| 5 | 乱葬岗 | 僵尸、游魂 | 迷路误入墓地 |
| 6 | 山神庙 | 野猪精、黑熊崽 | 山神指路前往五行山 |
| 7 | 五行山脚 | 石妖、土精 | 感受到强大气息 |
| 8 | 五行封印 | 小猴妖群（悟空旧部） | 猴群围攻试探唐僧 |
| **9** | **📖 悟空出世** | **BOSS：石中巨魔（封印余孽）** | **唐僧揭封印，悟空破山而出，师徒结拜** |

**Boss设计 —— 石中巨魔：**
- 五行山封印泄漏的魔气凝聚而成的石巨人
- 阶段1：唐僧独自念经削弱石巨人护甲
- 阶段2：封印裂开，悟空半自由状态辅助攻击
- 阶段3：悟空完全解放，金箍棒横扫清场

**🎬 过场动画：** 唐僧揭下封印符文，五行山崩裂，悟空从碎石中一跃而出，单膝跪地："师父，俺老孙来也！" 观音远处云端现身，抛下金箍。悟空戴上金箍，正式成为大徒弟。

**解锁：孙悟空（环绕武器）**

---

### 第二章：鹰愁涧·高老庄（第10-18难）

**主题：** 收白龙马 → 收猪八戒
**环境：** 深山溪涧、水域、田园村庄

#### 剧情线

师徒二人（唐僧+悟空）西行，在鹰愁涧遭遇龙太子吞了唐僧的马。悟空大怒要打，观音出面点化白龙变为坐骑。继续前行到高老庄，猪八戒在此作祟。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 10 | 深山迷雾 | 蛇妖、蜈蚣精 | 雾气关，视野受限+毒伤害 |
| 11 | 鹰愁涧前 | 水鬼、鱼妖 | 水域地形，减速区 |
| **12** | **📖 龙马入队** | **BOSS：白龙太子（敖烈）** | **悟空与龙太子激战，观音点化** |
| 13 | 骑马赶路 | 野妖群、流寇 | 速度教学关，体验白龙马加速 |
| 14 | 观音禅院 | 黑风山小妖探子 | 袈裟被盗伏笔 |
| 15 | 黑风山 | 熊妖、狼妖群 | 黑雾环境 |
| **16** | **⚔️ 黑熊怪** | **BOSS：黑风大王** | **偷袈裟的黑熊精，观音用金箍收服** |
| 17 | 高老庄 | 猪妖小弟、庄稼精 | 田园风关卡，猪八戒骚扰百姓 |
| **18** | **📖 八戒拜师** | **BOSS：猪八戒（天蓬元帅残影）** | **悟空化身高小姐戏耍八戒，降服后入队** |

**Boss设计 —— 白龙太子：**
- 水中龙形态，喷水柱制造地形障碍
- 会翻涌河水制造波浪推人
- 悟空跳入水中与之缠斗，玩家控制唐僧在岸上躲避水妖
- 观音出现后龙太子化马，战斗结束

**Boss设计 —— 猪八戒：**
- 钉耙横扫大范围
- 肚子拍击制造冲击波
- 会变身（化身村姑迷惑，出现假目标）
- 血量降至30%变回天蓬元帅残影，短暂爆发后投降

**🎬 过场动画：** 猪八戒被打回原形，耙子一扔跪下："大师兄饶命！我愿皈依佛门！"唐僧慈悲点头，八戒乐呵呵加入队伍，开始抱怨行李太重。

**解锁：白龙马（被动增益）+ 猪八戒（环绕武器）**

---

### 第三章：流沙河·黄风岭（第19-27难）

**主题：** 收沙悟净 → 全队集结
**环境：** 大漠、流沙河、黄风阵

#### 剧情线

三人行至流沙河，沙悟净在此为妖，九个骷髅项链正是之前九世取经人的头骨。降服沙悟净后四人齐聚。黄风岭上黄风怪的三昧神风是第一个真正的团灭危机。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 19 | 大漠孤烟 | 沙蝎、毒蛇 | 沙漠地形，热浪持续掉血 |
| 20 | 流沙河畔 | 沙魂、溺鬼 | 流沙减速地形 |
| **21** | **📖 悟净入队** | **BOSS：沙悟净（卷帘大将残影）** | **三打流沙河，悟净被降服拜师** |
| 22 | 四人远行 | 混合妖群 | 全阵容教学关 |
| 23 | 万寿山 | 树精、花妖 | 人参果园，镇元子伏笔 |
| **24** | **⚔️ 镇元仙** | **BOSS：镇元大仙** | **悟空推倒人参果树，镇元子袖里乾坤** |
| 25 | 黄风岭前 | 虎妖先锋、风精 | 狂风环境，移动方向被干扰 |
| 26 | 黄风洞 | 鼠妖、黄风小妖 | 洞穴关 |
| **27** | **⚔️ 黄风怪** | **BOSS：黄风大王** | **三昧神风吹瞎悟空眼，灵吉菩萨定风丹解围** |

**Boss设计 —— 沙悟净：**
- 从流沙中反复出没，穿透攻击
- 召唤沙流把唐僧拖向河中
- 骷髅项链发射追踪弹
- 木叉（木吒）出现助阵后沙僧投降

**Boss设计 —— 黄风怪：**
- 三昧神风：全屏持续风力推送+伤害（核心机制）
- 风眼区域是唯一安全点，但会移动
- 阶段2风向随机改变
- 需要利用地形和徒弟技能抵抗风力

**🎬 过场动画：** 沙悟净从河中浮起，摘下骷髅项链："这些是之前九世取经人的遗骨...我等了太久了。"他将骷髅排成法船渡众人过河，正式入队。

**解锁：沙悟净（环绕武器）—— 至此全阵容集结**

---

### 第四章：白骨国·宝象国（第28-36难）

**主题：** 信任危机 —— 三打白骨精 → 悟空被逐
**环境：** 荒山、诡异村庄、宝象国宫殿

#### 剧情线

这是游戏最重要的剧情转折。白骨精三次变化欺骗唐僧，悟空三次识破击杀，唐僧怒而念紧箍咒逐走悟空。**悟空离队后，玩家失去主力输出**，只剩八戒和沙僧，难度骤升。直到黄袍怪事件证明了悟空的清白。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 28 | 荒山小路 | 骨妖、亡灵 | 诡异气氛，白骨精伏笔 |
| 29 | 一打白骨 | 村姑变的小妖群 | 白骨精第一变——少女，悟空打死 |
| 30 | 二打白骨 | 老妇变的妖群 | 白骨精第二变——老妇，唐僧念咒惩罚悟空 |
| **31** | **📖 三打白骨精** | **BOSS：白骨精（三相合一）** | **悟空打死第三变老翁，唐僧逐走悟空** |
| 32 | 失去悟空 | 普通妖群（但少了主力输出） | **悟空离队！** 难度突然上升 |
| 33 | 艰难前行 | 强化妖群 | 只有八戒+沙僧，体验输出断崖 |
| 34 | 宝象国 | 黄袍怪小妖 | 百花羞公主求救 |
| **35** | **⚔️ 黄袍怪** | **BOSS：黄袍怪（奎木狼）** | **唐僧被变成老虎，八戒去花果山请悟空** |
| **36** | **📖 悟空回归** | **BOSS：黄袍怪（二战）** | **悟空归来秒杀！师徒和好** |

**Boss设计 —— 白骨精（三相合一）：**
- 三阶段Boss，每阶段一个形态（少女→老妇→老翁）
- 少女相：魅惑弹幕，让八戒/沙僧短暂失控
- 老妇相：召唤亡灵墙
- 老翁相：三相合体为骷髅女妖，全力攻击
- **剧情锁定结局：** 无论打得多好，唐僧都会逐走悟空

**🎬 过场动画：** 唐僧含泪念紧箍咒，悟空抱头在地上翻滚。"猴头！你杀生成性，我与你师徒缘尽！" 悟空跪别："师父保重..."化作金光飞回花果山。屏幕变暗，"第四章：失去" 字样浮现。

**机制变化：悟空离队（第32-35难），第36难回归时获得「怒火归来」增益——首3分钟攻击力翻倍**

---

### 第五章：平顶山·火云洞（第37-45难）

**主题：** 法宝之战 → 红孩儿
**环境：** 山洞、火焰地形、莲花洞

#### 剧情线

金角大王银角大王持太上老君法宝为难取经团队。悟空斗智斗勇，用计收服。随后遭遇红孩儿，三昧真火差点要了悟空的命。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 37 | 平顶山前 | 巡山小妖 | "大王叫我来巡山" |
| 38 | 精细鬼伶俐虫 | 特殊小妖（携带假法宝） | 搞笑关，悟空化身骗取法宝 |
| 39 | 莲花洞 | 洞内妖兵、火精 | 洞穴地形 |
| **40** | **⚔️ 金银角大王** | **BOSS：金角大王+银角大王（双Boss）** | **紫金红葫芦+羊脂玉净瓶法宝战** |
| 41 | 劫后余生 | 散妖群 | 过渡关 |
| 42 | 号山前 | 火精、烟妖 | 温度逐渐升高的环境 |
| 43 | 火云洞 | 火焰小妖、火鸦 | 地面持续火焰伤害 |
| **44** | **⚔️ 红孩儿** | **BOSS：红孩儿（圣婴大王）** | **三昧真火！悟空几乎阵亡** |
| 45 | 观音救场 | 火焰余烬敌人 | 观音净瓶水灭火，红孩儿被收为善财童子 |

**Boss设计 —— 金银角大王（双Boss）：**
- 金角持紫金红葫芦：点名吸入（倒计时内必须回应否则被吸走一个徒弟）
- 银角持羊脂玉净瓶：地面陷阱区域
- 还有幌金绳（束缚技能）和芭蕉扇（推风）
- 需要打破法宝才能伤害本体

**Boss设计 —— 红孩儿：**
- 小孩形态但极其凶猛
- 三昧真火：地面大面积持续火焰（不同于普通火，水浇不灭）
- 火尖枪突刺+旋风火
- 阶段2变成火焰巨婴
- 观音出场强制结束战斗（剧情杀）

---

### 第六章：通天河·女儿国（第46-54难）

**主题：** 水难 → 情劫
**环境：** 冰河、水下宫殿、女儿国

#### 剧情线

通天河的鲤鱼精设计用冰封河面诱唐僧踏入陷阱。女儿国是全游戏唯一没有战斗的关卡——但有最难的选择。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 46 | 车迟国 | 三个假道士的小妖 | 虎力、鹿力、羊力大仙伏笔 |
| **47** | **⚔️ 车迟三仙** | **BOSS：虎力+鹿力+羊力（三阶段）** | **比云梯显圣、猜物、下油锅** |
| 48 | 通天河岸 | 水族小妖、冰精 | 冰面地形，会裂开 |
| 49 | 冰封陷阱 | 寒冰鱼妖群 | 唐僧被骗踏冰入水 |
| **50** | **⚔️ 灵感大王** | **BOSS：灵感大王（鲤鱼精）** | **水下Boss战，移动受限** |
| 51 | 西梁国界 | 蝎子精小妖 | 毒系环境 |
| **52** | **⚔️ 蝎子精** | **BOSS：琵琶精（蝎子精）** | **倒马毒让悟空八戒都吃亏** |
| 53 | 女儿国 | **无敌人** | **纯剧情关：女王倾心唐僧** |
| **54** | **📖 情关** | **BOSS：情丝大阵（心魔）** | **唐僧心魔战，抵抗诱惑** |

**Boss设计 —— 情丝大阵（心魔）：**
- 唐僧独自面对的内心之战
- 幻象女王不断靠近，靠近就掉"佛心值"
- 需要控制唐僧远离幻象同时念经维持佛心
- 幻境中出现前世记忆碎片（金蝉子）
- 佛心值归零则失败
- 不使用任何攻击，纯走位+念经

**🎬 过场动画：** 女王含泪送别："御弟哥哥...若有来生..."唐僧双手合十："陛下，来世若有缘。"转身西行不回头。画面远去，女王独立城头。

---

### 第七章：火焰山·狮驼岭（第55-63难）

**主题：** 最难的两场战役
**环境：** 火焰山赤地、狮驼岭阴森巨城

#### 剧情线

火焰山不可逾越，必须借芭蕉扇。牛魔王和铁扇公主因红孩儿之事与悟空结怨。狮驼岭三大魔王是全游戏最强Boss组合——青狮、白象、大鹏，其中大鹏是如来舅舅。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 55 | 火焰山前 | 火焰元素、热浪精 | 持续高温伤害环境 |
| 56 | 翠云山 | 铁扇洞妖兵 | 借扇被拒 |
| **57** | **⚔️ 铁扇公主** | **BOSS：铁扇公主** | **芭蕉扇制造全屏风暴** |
| 58 | 积雷山 | 牛精、火精混合 | 追踪牛魔王 |
| **59** | **⚔️ 牛魔王** | **BOSS：牛魔王（多形态）** | **变身战！各种动物形态** |
| 60 | 翻越火焰山 | 火焰残余敌人 | 芭蕉扇灭火，通过 |
| 61 | 狮驼岭外 | 万妖之阵 | 47000妖兵（大量小怪潮） |
| **62** | **⚔️ 青狮白象** | **BOSS：青狮精+白象精（双Boss）** | **文殊菩萨坐骑+普贤菩萨坐骑** |
| **63** | **⚔️ 大鹏金翅** | **BOSS：大鹏金翅明王** | **全游戏最难Boss之一** |

**Boss设计 —— 牛魔王：**
- 多阶段变身Boss
- 人形：铁棍横扫
- 巨牛形态：冲锋+践踏+甩尾
- 白牛形态：全屏冲撞
- 最终哪吒+天兵围剿才结束

**Boss设计 —— 大鹏金翅明王：**
- 飞行Boss，在场地上空盘旋
- 俯冲抓取（可以抓走一个徒弟暂时消失）
- 翅膀制造剃刀风
- 一口吞下孙悟空（进入吞食阶段，在肚子里打）
- 最终如来亲临才能制服

---

### 第八章：比丘国·无底洞（第64-72难）

**主题：** 暗黑深渊
**环境：** 妖雾城市、地底洞穴、蜘蛛洞

#### 剧情线

越接近灵山，妖魔越绝望也越疯狂。比丘国国王被白鹿精蛊惑要取1111个小儿心肝，无底洞的地涌夫人是托塔天王的义女却叛出天庭。蜘蛛精的盘丝洞是视觉最惊艳的关卡。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 64 | 蜘蛛精 | 蛛网妖、丝精 | 蛛网减速地形 |
| **65** | **⚔️ 盘丝洞七妖** | **BOSS：七个蜘蛛精（群体Boss）** | **丝网+毒+分裂** |
| 66 | 黄花观 | 蜈蚣精的毒虫 | 全屏毒雾 |
| **67** | **⚔️ 百眼魔君** | **BOSS：百眼魔君（蜈蚣精）** | **千眼放金光致盲** |
| 68 | 比丘国 | 妖化士兵 | 黑暗城市关 |
| **69** | **⚔️ 白鹿精** | **BOSS：白鹿精+狐狸精** | **比丘国阴谋** |
| 70 | 陷空山 | 地洞妖兵 | 地下迷宫关 |
| 71 | 无底洞 | 深渊妖物 | 不断下坠的特殊关卡 |
| **72** | **⚔️ 地涌夫人** | **BOSS：地涌夫人（金鼻白毛老鼠精）** | **无底洞追逐战** |

**Boss设计 —— 七蜘蛛精：**
- 7个独立小Boss同时出现
- 每只有不同属性（毒/网/分裂/隐身/速度/远程/召唤）
- 击杀一只其余强化
- 最佳策略是同时削血然后快速清理

---

### 第九章：天竺·灵山（第73-81难）

**主题：** 终章 —— 最后的试炼与成佛
**环境：** 天竺国、凌云渡、雷音寺

#### 剧情线

终于接近西天。但最后的考验接踵而至——玉兔精假扮天竺公主、凌云渡脱胎换骨、到了雷音寺还有阿傩伽叶索要人事。最终一难是通天河老鼋翻船。取到真经后，五圣成真。

| 难 | 名称 | 敌人 | 事件 |
|----|------|------|------|
| 73 | 灭法国 | 妖化官兵 | 杀僧之国 |
| 74 | 隐雾山 | 艾叶花皮豹子精 | 迷雾+速度型Boss |
| **75** | **⚔️ 豹子精** | **BOSS：艾叶花皮豹子精** | **高速突袭型Boss** |
| 76 | 天竺国 | 玉兔洞妖兵 | 假公主阴谋 |
| **77** | **⚔️ 玉兔精** | **BOSS：玉兔精** | **月宫之力，冰月弹幕** |
| 78 | 铜台府 | 犀牛精三兄弟 | 假佛光 |
| **79** | **⚔️ 辟寒辟暑辟尘** | **BOSS：三犀牛精** | **最后的妖魔之战** |
| 80 | 凌云渡 | **无敌人** | **唐僧踏无底船，看见自己肉身浮出水面——脱胎换骨** |
| **81** | **📖 九九归真** | **BOSS：心魔总集（一切执念）** | **最终之战** |

**Boss设计 —— 心魔总集（最终Boss）：**

唐僧在雷音寺前最后的试炼，面对取经路上所有的执念与遗憾。

- **阶段1「嗔」：** 心魔幻化为之前所有Boss的影子快速出现，每个只有一条命但攻击模式不变
- **阶段2「痴」：** 幻化为女儿国女王、母亲等至亲的幻象，靠近会削弱攻击力
- **阶段3「贪」：** 幻化为金银珠宝法宝漫天，碰到就被定身
- **最终阶段「悟」：** 所有徒弟也消失，唐僧独自一人面对黑暗。不需要攻击——只需要坚定地向西走。念经声越来越响，金光越来越盛，黑暗自行退散。

**🎬 最终动画：**

雷音寺大门敞开，如来端坐莲台。

"善哉善哉，金蝉子，你终于回来了。"

唐僧——旃檀功德佛
孙悟空——斗战胜佛
猪八戒——净坛使者
沙悟净——金身罗汉
白龙马——八部天龙

五人金光加身，佛光普照。画面拉远，西行路上的所有场景如走马灯般闪过。

**"九九八十一难，一难不少。此去经年，功德圆满。"**

---

## 五、敌人设计概览

### 常规敌人提示词模板 `1:1 | 1024×1024` → `assets/sprites/enemies/{enemy_name}_sprite.png`

```
Top-down 2D game enemy sprite, [enemy name] from Journey to the West.
Strict top-down perspective, camera directly above. [Description of appearance]. Menacing
but stylized for an action game. Chibi proportions, [color palette]. Simple idle + attack
animation frames with exaggerated movement. Dark/shadowy aura. White background, clean
vector style with pixel art influence.
```

### 敌人类型

| 类型 | 行为 | 代表 |
|------|------|------|
| 冲锋型 | 直线冲向唐僧 | 野狼、虎妖、牛精 |
| 远程型 | 保持距离发射弹幕 | 蝎子精、蜘蛛精 |
| 爆炸型 | 靠近后自爆 | 火精、炸弹妖 |
| 召唤型 | 原地召唤小妖 | 妖王先锋 |
| 精英型 | 高血量+特殊技能 | 各洞府将军 |
| 环境型 | 制造地形陷阱 | 水妖、沙妖、冰精 |

---

## 六、Meta 进度系统

### 转世系统（Roguelike 元素）

每次完整通关获得「功德」，用于永久升级：

| 升级项 | 效果 |
|--------|------|
| 金蝉子转世 | 唐僧基础属性+ |
| 如意金箍棒 | 悟空初始等级+ |
| 天蓬记忆 | 八戒初始等级+ |
| 卷帘往事 | 沙僧初始等级+ |
| 龙脉觉醒 | 白龙马初始增益+ |
| 菩提心法 | 初始法器选择+1 |
| 蟠桃储备 | 初始生命+ |

### 难度系统

- **凡人难度：** 正常
- **修士难度：** 敌人+50%
- **罗汉难度：** 敌人+100%，Boss新招式
- **佛陀难度：** 极限挑战，一碰即死

---

## 七、音乐风格参考

| 场景 | 风格 |
|------|------|
| 主菜单 | 大气编钟+梵音吟唱 |
| 普通关卡 | 中式摇滚/电子 + 笛子琵琶 |
| Boss战 | 重鼓+唢呐+电子混音 |
| 女儿国 | 柔和古筝+箫 |
| 火焰山 | 激烈鼓点+二胡 |
| 最终战 | 全员和声梵音+史诗管弦 |
| 通关 | 空灵梵音+编钟渐消 |

---

## 八、技术方案建议

| 项目 | 推荐 |
|------|------|
| 引擎 | Godot 4 / Unity 2D |
| 分辨率 | 1920×1080，像素与矢量混合风格 |
| 地图 | Tilemap + 程序化生成 |
| 存档 | 本地JSON，章节自动存档 |
| 平台 | Steam (PC) → 移动端 |
