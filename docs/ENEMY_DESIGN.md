# 妖怪与Boss设计文档 (Enemy & Boss Design)

> 九九八十一难，妖魔鬼怪各有千秋

---

## 一、精灵规范

### 1.1 通用小怪

| 项目 | 规格 |
|------|------|
| 源图尺寸 | 1024×1024（单张动作姿势，面朝右） |
| 游戏内尺寸 | 64×64 ~ 96×96（按类型缩放） |
| 动画方式 | 程序化：上下浮动、左右翻转、受击闪白、死亡缩小淡出 |
| 存放目录 | `assets/sprites/enemies/common/{name}.png` |
| 风格要求 | 与英雄 sprite 一致的 chibi Q版风格，干净轮廓，透明背景 |

### 1.2 Boss

| 项目 | 规格 |
|------|------|
| 源图尺寸 | 1024×1024（单张全身动作姿势） |
| 游戏内尺寸 | 192×192 ~ 320×320（Boss 体型是小怪的 2-4 倍） |
| 动画方式 | 程序化 + 关键帧：idle 浮动、攻击时缩放脉冲、阶段切换闪光 |
| 存放目录 | `assets/sprites/enemies/bosses/{name}.png` |
| 风格要求 | 同上，但细节更丰富，气场更强 |

### 1.3 风格锚点（所有敌人共用）

```
ENEMY STYLE ANCHOR: Chibi/cute-but-menacing top-down 2D game enemy sprite,
matching the art style of the hero characters — soft cel-shaded, warm color
palette with darker tones for enemies, clean outlines, large head small body
proportions. Single character centered on transparent background (PNG).
Right-facing action pose. White background, pixel art influenced but smooth
vector style.
```

---

## 二、敌人行为原型

### 2.1 六大原型

| 原型 | 代号 | 移动模式 | 攻击方式 | 典型血量(Ch1) | 典型伤害(Ch1) |
|------|------|----------|----------|---------------|---------------|
| 冲锋型 | CHARGE | 直线追踪唐僧 | 碰撞伤害 | 15 | 5 |
| 远程型 | RANGED | 保持距离，走位 | 弹幕射击 | 10 | 8(弹) |
| 爆炸型 | EXPLODE | 加速冲向唐僧 | 死亡自爆(AOE) | 8 | 15(爆) |
| 召唤型 | SUMMON | 原地/缓慢移动 | 周期召唤小怪 | 30 | 0(自身) |
| 精英型 | ELITE | 追踪+走位 | 多种攻击组合 | 80 | 12 |
| 环境型 | TERRAIN | 随机游走 | 放置地面陷阱 | 20 | 3/秒(陷阱) |

### 2.2 数值成长公式

```
章节倍率 = 1.0 + (chapter - 1) × 0.35

HP = base_hp × 章节倍率
DMG = base_dmg × 章节倍率
SPEED = base_speed × (1.0 + (chapter - 1) × 0.05)
```

| 章节 | HP倍率 | DMG倍率 | 速度倍率 |
|------|--------|---------|----------|
| 1 | 1.00 | 1.00 | 1.00 |
| 2 | 1.35 | 1.35 | 1.05 |
| 3 | 1.70 | 1.70 | 1.10 |
| 4 | 2.05 | 2.05 | 1.15 |
| 5 | 2.40 | 2.40 | 1.20 |
| 6 | 2.75 | 2.75 | 1.25 |
| 7 | 3.10 | 3.10 | 1.30 |
| 8 | 3.45 | 3.45 | 1.35 |
| 9 | 3.80 | 3.80 | 1.40 |

### 2.3 刷怪节奏（每关 3-8 分钟）

| 时间段 | 刷怪密度 | 精英概率 | 说明 |
|--------|----------|----------|------|
| 0:00-1:00 | 低 | 0% | 热身，学习走位 |
| 1:00-3:00 | 中 | 5% | 逐渐加压 |
| 3:00-5:00 | 高 | 15% | 主要挑战期 |
| 5:00-7:00 | 极高 | 25% | 生存压力拉满 |
| 7:00+ | 爆发 | 30% | Boss前最后冲刺 |
| Boss出现 | 停止刷怪 | - | 专注Boss战 |

---

## 三、通用小怪图鉴

### 3.1 冲锋型 CHARGE

#### ① 山贼 Bandit
- **章节：** 1
- **描述：** 手持弯刀的蒙面山贼，最弱的冲锋型敌人
- **行为：** 直线冲向唐僧，碰撞后短暂后退再冲
- **基础属性：** HP 12 / DMG 4 / SPD 1.0
- **文件：** `assets/sprites/enemies/common/bandit.png`

#### ② 野狼 Wolf
- **章节：** 1, 2
- **描述：** 灰色饿狼，成群出现
- **行为：** 群体追踪，3只以上时获得10%速度加成
- **基础属性：** HP 10 / DMG 5 / SPD 1.3
- **文件：** `assets/sprites/enemies/common/wolf.png`

#### ③ 狼妖 Wolf Demon
- **章节：** 1, 2
- **描述：** 直立行走的狼头人身妖怪，野狼的强化版
- **行为：** 同野狼但会短距离冲刺
- **基础属性：** HP 25 / DMG 8 / SPD 1.2
- **文件：** `assets/sprites/enemies/common/wolf_demon.png`

#### ④ 虎妖 Tiger Demon
- **章节：** 2, 7
- **描述：** 穿破旧铠甲的虎头人身妖怪
- **行为：** 冲刺攻击，命中后2秒冷却
- **基础属性：** HP 35 / DMG 12 / SPD 1.1
- **文件：** `assets/sprites/enemies/common/tiger_demon.png`

#### ⑤ 牛精 Bull Spirit
- **章节：** 7
- **描述：** 红眼蛮牛妖，体型偏大
- **行为：** 直线冲锋不转弯，撞到墙才掉头
- **基础属性：** HP 50 / DMG 15 / SPD 1.5(冲锋) 0.6(转向)
- **文件：** `assets/sprites/enemies/common/bull_spirit.png`

#### ⑥ 猪妖小弟 Pig Imp
- **章节：** 2
- **描述：** 矮胖小猪妖，拿着木棒
- **行为：** 慢速追踪，成群时互相鼓舞（短暂加速）
- **基础属性：** HP 20 / DMG 6 / SPD 0.8
- **文件：** `assets/sprites/enemies/common/pig_imp.png`

#### ⑦ 小猴妖 Monkey Imp
- **章节：** 1
- **描述：** 花果山小毛猴，戴着树叶帽
- **行为：** 高速乱跑，不规则路径冲撞
- **基础属性：** HP 8 / DMG 3 / SPD 1.6
- **文件：** `assets/sprites/enemies/common/monkey_imp.png`

#### ⑧ 妖化士兵 Corrupted Soldier
- **章节：** 8, 9
- **描述：** 被妖气侵蚀的人类士兵，紫色眼睛
- **行为：** 列阵冲锋，2-3个一排推进
- **基础属性：** HP 30 / DMG 10 / SPD 1.0
- **文件：** `assets/sprites/enemies/common/corrupted_soldier.png`

---

### 3.2 远程型 RANGED

#### ⑨ 蛇妖 Snake Demon
- **章节：** 2, 3
- **描述：** 绿鳞蛇身人面妖，吐毒雾
- **行为：** 保持距离，射出毒弹（减速效果）
- **基础属性：** HP 12 / DMG 6(毒弹) / SPD 0.9 / 射程 200
- **文件：** `assets/sprites/enemies/common/snake_demon.png`

#### ⑩ 蝎子小妖 Scorpion Imp
- **章节：** 3, 6
- **描述：** 沙漠蝎妖，尾钩发射毒针
- **行为：** 远程射击 + 被近身时尾刺反击
- **基础属性：** HP 15 / DMG 8(毒针) / SPD 0.7 / 射程 180
- **文件：** `assets/sprites/enemies/common/scorpion_imp.png`

#### ⑪ 弓箭妖兵 Demon Archer
- **章节：** 7, 8
- **描述：** 手持骨弓的妖兵
- **行为：** 站定射击，被近身后快速后撤
- **基础属性：** HP 18 / DMG 10(箭) / SPD 0.8 / 射程 250
- **文件：** `assets/sprites/enemies/common/demon_archer.png`

#### ⑫ 蜈蚣精 Centipede Spirit
- **章节：** 2, 8
- **描述：** 多足蜈蚣妖，口吐毒雾
- **行为：** 环形移动，周期性喷射扇形毒雾
- **基础属性：** HP 20 / DMG 5(毒雾/秒) / SPD 1.0 / 射程 150
- **文件：** `assets/sprites/enemies/common/centipede_spirit.png`

---

### 3.3 爆炸型 EXPLODE

#### ⑬ 火精 Fire Spirit
- **章节：** 5, 7
- **描述：** 燃烧的小火球妖怪，表情狰狞
- **行为：** 加速冲向唐僧，碰撞或3秒后爆炸，留下火焰地面
- **基础属性：** HP 8 / DMG 18(爆炸) / SPD 1.4
- **火焰地面：** 持续3秒，每秒3伤害
- **文件：** `assets/sprites/enemies/common/fire_spirit.png`

#### ⑭ 游魂 Ghost
- **章节：** 1, 4
- **描述：** 半透明绿色鬼魂，痛苦表情
- **行为：** 穿透地形缓慢飘向唐僧，接触后爆裂
- **基础属性：** HP 6 / DMG 12(爆裂) / SPD 0.6
- **特殊：** 无视碰撞体积，穿墙
- **文件：** `assets/sprites/enemies/common/ghost.png`

#### ⑮ 火鸦 Fire Crow
- **章节：** 5
- **描述：** 浑身着火的黑色乌鸦
- **行为：** 俯冲式移动（快速飞来→悬停→俯冲爆炸）
- **基础属性：** HP 10 / DMG 15(俯冲) / SPD 2.0(俯冲) 0.5(悬停)
- **文件：** `assets/sprites/enemies/common/fire_crow.png`

---

### 3.4 召唤型 SUMMON

#### ⑯ 妖王先锋 Demon Vanguard
- **章节：** 4, 5, 6, 7, 8
- **描述：** 手持旗帜的小妖将领，穿杂色铠甲
- **行为：** 原地驻守，每5秒召唤2只冲锋小怪
- **基础属性：** HP 40 / DMG 0 / SPD 0.3
- **召唤上限：** 同时存在6只
- **文件：** `assets/sprites/enemies/common/demon_vanguard.png`

#### ⑰ 树妖 Tree Demon
- **章节：** 1, 3
- **描述：** 扭曲的老树成精，树干有人脸
- **行为：** 不移动，根系陷阱 + 每8秒释放3个花妖（小冲锋怪）
- **基础属性：** HP 60 / DMG 4(根系/秒) / SPD 0
- **文件：** `assets/sprites/enemies/common/tree_demon.png`

---

### 3.5 精英型 ELITE

#### ⑱ 熊妖 Bear Demon
- **章节：** 2
- **描述：** 黑色大熊妖，戴骨项链
- **行为：** 慢速追踪 → 距离内蓄力猛扑（大伤害圈）→ 冷却3秒
- **基础属性：** HP 80 / DMG 15(猛扑AOE) / SPD 0.7
- **文件：** `assets/sprites/enemies/common/bear_demon.png`

#### ⑲ 骨将 Bone General
- **章节：** 4
- **描述：** 穿残破铠甲的骷髅武将
- **行为：** 挥刀冲锋 + 死亡后碎骨爆射（360°弹幕）
- **基础属性：** HP 60 / DMG 12(刀) + 8×6(碎骨) / SPD 1.0
- **文件：** `assets/sprites/enemies/common/bone_general.png`

#### ⑳ 烟妖 Smoke Demon
- **章节：** 5
- **描述：** 灰黑色烟雾凝聚的人形
- **行为：** 交替实体/虚体状态，虚体免疫伤害但不攻击
- **基础属性：** HP 50 / DMG 10 / SPD 1.1
- **文件：** `assets/sprites/enemies/common/smoke_demon.png`

---

### 3.6 环境型 TERRAIN

#### ㉑ 水鬼 Water Ghost
- **章节：** 2, 6
- **描述：** 绿脸水鬼，湿漉漉的长发
- **行为：** 在地面制造水洼（减速50%），水洼持续5秒
- **基础属性：** HP 15 / DMG 2(接触) / SPD 1.0
- **文件：** `assets/sprites/enemies/common/water_ghost.png`

#### ㉒ 沙魂 Sand Spirit
- **章节：** 3
- **描述：** 沙子凝聚的人形，不断流沙
- **行为：** 制造流沙陷阱（减速+持续伤害），在沙地上移速翻倍
- **基础属性：** HP 20 / DMG 3/秒(流沙) / SPD 0.8(普通) 1.6(沙地)
- **文件：** `assets/sprites/enemies/common/sand_spirit.png`

#### ㉓ 冰精 Ice Spirit
- **章节：** 6
- **描述：** 冰蓝色半透明晶体人形
- **行为：** 制造冰面（滑行不受控），死亡时冻结范围内目标1秒
- **基础属性：** HP 18 / DMG 4(接触) / SPD 0.9
- **文件：** `assets/sprites/enemies/common/ice_spirit.png`

#### ㉔ 蛛网妖 Web Spinner
- **章节：** 1, 8
- **描述：** 紫色大蜘蛛，口吐丝线
- **行为：** 在地面布网（踩到定身1.5秒），自身远程喷丝
- **基础属性：** HP 22 / DMG 6(喷丝) / SPD 0.6 / 射程 160
- **文件：** `assets/sprites/enemies/common/web_spinner.png`

#### ㉕ 风精 Wind Spirit
- **章节：** 3
- **描述：** 旋转的绿色气旋，内有模糊面容
- **行为：** 环形巡逻，经过时推开唐僧（强制位移）
- **基础属性：** HP 25 / DMG 6(接触) / SPD 1.2
- **推力半径：** 100px
- **文件：** `assets/sprites/enemies/common/wind_spirit.png`

---

### 3.7 特殊小怪（章节限定）

#### ㉖ 僵尸 Zombie
- **章节：** 1
- **描述：** 破衣烂衫的僵硬尸体，面色苍白发绿
- **行为：** 极慢追踪，死亡后2秒复活一次（需二次击杀）
- **基础属性：** HP 20 / DMG 8 / SPD 0.4
- **文件：** `assets/sprites/enemies/common/zombie.png`

#### ㉗ 石妖 Stone Imp
- **章节：** 1
- **描述：** 圆滚滚的石头小妖，一只大眼
- **行为：** 滚动冲撞，碰墙反弹
- **基础属性：** HP 30 / DMG 10 / SPD 1.3
- **文件：** `assets/sprites/enemies/common/stone_imp.png`

#### ㉘ 鱼妖 Fish Demon
- **章节：** 2, 6
- **描述：** 鲤鱼精小兵，站立行走的鱼人
- **行为：** 吐水泡远程攻击（水泡追踪）
- **基础属性：** HP 14 / DMG 7(水泡) / SPD 0.9 / 射程 170
- **文件：** `assets/sprites/enemies/common/fish_demon.png`

#### ㉙ 花妖 Flower Sprite
- **章节：** 3
- **描述：** 妖艳的花朵小精灵，瓣翅飞行
- **行为：** 飘浮移动，散播花粉（范围减速+眩晕0.5秒）
- **基础属性：** HP 8 / DMG 2(花粉/秒) / SPD 1.1
- **文件：** `assets/sprites/enemies/common/flower_sprite.png`

#### ㉚ 深渊妖 Abyss Creature
- **章节：** 8
- **描述：** 漆黑触手怪物，红色多眼
- **行为：** 从地面伸出触手攻击（延迟AOE），本体不可选中直到触手被打断
- **基础属性：** HP 45 / DMG 12(触手) / SPD 0.5
- **文件：** `assets/sprites/enemies/common/abyss_creature.png`

---

## 四、各章敌人配置表

### 第一章：长安出发·五行山（第1-9难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 1 | 山贼 | - | 无（教学关） |
| 2 | 山贼、野狼 | - | 无 |
| 3 | 野狼、狼妖 | - | 夜间（视野缩小） |
| 4 | 树妖、蛛网妖 | - | 室内地形 |
| 5 | 僵尸、游魂 | - | 迷雾 |
| 6 | 野猪精(=猪妖小弟皮肤) | 熊妖(弱化版) | 无 |
| 7 | 石妖 | - | 落石障碍 |
| 8 | 小猴妖 | - | 山地地形 |
| 9 | 石妖、小猴妖 | **Boss：石中巨魔** | 五行山崩塌 |

### 第二章：鹰愁涧·高老庄（第10-18难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 10 | 蛇妖、蜈蚣精 | - | 毒雾（持续微伤） |
| 11 | 水鬼、鱼妖 | - | 水域减速 |
| 12 | 鱼妖、水鬼 | **Boss：白龙太子** | 河流地形 |
| 13 | 野狼、狼妖 | - | 无（速度教学） |
| 14 | 熊妖(探子) | - | 无 |
| 15 | 熊妖、狼妖 | - | 黑雾（视野缩小） |
| 16 | 熊妖 | **Boss：黑风大王** | 黑风山 |
| 17 | 猪妖小弟 | - | 田园地形 |
| 18 | 猪妖小弟 | **Boss：猪八戒** | 高老庄 |

### 第三章：流沙河·黄风岭（第19-27难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 19 | 蝎子小妖、蛇妖 | - | 沙漠热浪（持续掉血） |
| 20 | 沙魂、水鬼 | - | 流沙减速 |
| 21 | 沙魂 | **Boss：沙悟净** | 流沙河 |
| 22 | 混合（前三章所有种类） | - | 无（全阵容教学） |
| 23 | 树妖、花妖 | - | 果园地形 |
| 24 | 花妖、树妖 | **Boss：镇元大仙** | 万寿山 |
| 25 | 虎妖、风精 | - | 强风（移动偏移） |
| 26 | 狼妖、蛇妖 | 妖王先锋 | 洞穴 |
| 27 | 风精、蛇妖 | **Boss：黄风大王** | 全屏强风 |

### 第四章：白骨国·宝象国（第28-36难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 28 | 骨将、游魂 | - | 诡异迷雾 |
| 29 | 骨将、僵尸 | - | 幻象干扰 |
| 30 | 骨将、亡灵(=僵尸皮肤) | - | 幻象干扰加重 |
| 31 | 骨将 | **Boss：白骨精** | 三相幻境 |
| 32 | 混合妖群 | - | **悟空离队！** |
| 33 | 强化混合妖群 | 妖王先锋 | 悟空离队 |
| 34 | 虎妖、妖化士兵 | - | 宝象国城市 |
| 35 | 虎妖、妖化士兵 | **Boss：黄袍怪** | 宝象国宫殿 |
| 36 | 虎妖 | **Boss：黄袍怪(二战)** | **悟空回归！** |

### 第五章：平顶山·火云洞（第37-45难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 37 | 狼妖、蛇妖 | 妖王先锋 | 山路 |
| 38 | 小猴妖(假扮)、狼妖 | - | 搞笑关 |
| 39 | 火精、烟妖 | - | 洞穴+火焰 |
| 40 | 火精、烟妖 | **Boss：金角+银角大王** | 莲花洞 |
| 41 | 散妖混合 | - | 过渡关 |
| 42 | 火精 | - | 温度递增 |
| 43 | 火精、火鸦 | 烟妖 | 全地面火焰 |
| 44 | 火精、火鸦 | **Boss：红孩儿** | 三昧真火 |
| 45 | 火精(弱化) | - | 灭火过场 |

### 第六章：通天河·女儿国（第46-54难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 46 | 虎妖、鹿妖(=虎妖皮肤) | - | 道观 |
| 47 | 虎妖、鹿妖 | **Boss：车迟三仙** | 比试场 |
| 48 | 冰精、鱼妖 | - | 冰面滑行 |
| 49 | 冰精、鱼妖 | - | 冰面裂开 |
| 50 | 鱼妖、水鬼 | **Boss：灵感大王** | 水下 |
| 51 | 蝎子小妖 | - | 毒域 |
| 52 | 蝎子小妖 | **Boss：蝎子精** | 毒雾+沙漠 |
| 53 | **无敌人** | - | 女儿国（纯剧情） |
| 54 | **无常规敌人** | **Boss：情丝心魔** | 幻境 |

### 第七章：火焰山·狮驼岭（第55-63难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 55 | 火精、牛精 | - | 持续高温伤害 |
| 56 | 牛精、弓箭妖兵 | 妖王先锋 | 翠云山 |
| 57 | 火精 | **Boss：铁扇公主** | 芭蕉扇风暴 |
| 58 | 牛精、火精 | - | 积雷山 |
| 59 | 牛精 | **Boss：牛魔王** | 变身战场 |
| 60 | 火精(弱化) | - | 灭火通过 |
| 61 | 所有妖兵大混战 | 妖王先锋×3 | **万妖之阵** |
| 62 | 弓箭妖兵、虎妖 | **Boss：青狮+白象** | 狮驼岭 |
| 63 | 弓箭妖兵 | **Boss：大鹏金翅** | 空中战场 |

### 第八章：比丘国·无底洞（第64-72难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 64 | 蛛网妖、蜈蚣精 | - | 蛛网地形 |
| 65 | 蛛网妖 | **Boss：盘丝七妖** | 丝网+毒 |
| 66 | 蜈蚣精 | - | 全屏毒雾 |
| 67 | 蜈蚣精 | **Boss：百眼魔君** | 致盲光 |
| 68 | 妖化士兵 | - | 暗黑城市 |
| 69 | 妖化士兵 | **Boss：白鹿精** | 比丘国 |
| 70 | 深渊妖 | - | 地下迷宫 |
| 71 | 深渊妖 | - | 无底下坠 |
| 72 | 深渊妖 | **Boss：地涌夫人** | 追逐战 |

### 第九章：天竺·灵山（第73-81难）

| 难 | 常规敌人 | 精英/特殊 | 环境效果 |
|----|----------|-----------|----------|
| 73 | 妖化士兵 | 妖王先锋 | 灭法国 |
| 74 | 虎妖(强化) | - | 隐雾山 |
| 75 | 虎妖(强化) | **Boss：豹子精** | 高速战场 |
| 76 | 花妖、蛛网妖 | - | 天竺国 |
| 77 | 花妖 | **Boss：玉兔精** | 月光幻境 |
| 78 | 牛精(犀牛皮肤) | - | 假佛光 |
| 79 | 牛精(犀牛皮肤) | **Boss：三犀牛精** | 三属性轮转 |
| 80 | **无敌人** | - | 凌云渡（纯剧情） |
| 81 | **全Boss幻影** | **Boss：心魔总集** | 最终试炼 |

---

## 五、Boss 详细设计

### Boss 通用属性公式

```
Boss HP = 500 × 章节倍率 × Boss系数
Boss DMG = 20 × 章节倍率 × Boss系数
Boss SPD = 0.8 × (1 + chapter × 0.03)

Boss系数：中Boss = 1.0，章末Boss = 1.5，最终Boss = 3.0
```

---

### 5.1 第一章 Boss

#### 石中巨魔 Stone Golem（第9难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5（章末Boss） |
| HP | 750 |
| DMG | 30 |
| 尺寸 | 320×320 |

**阶段设计：**

**阶段1（HP 100%-60%）「封印之躯」**
- 全身石化状态，移速极慢
- 攻击：石拳砸地 → 地面碎裂波（扇形）
- 攻击：抬手召落石 → 3个落点标记后1.5秒砸下
- 弱点：背后裂缝发光处，正面受伤减半

**阶段2（HP 60%-30%）「裂变」**
- 碎裂出2个小石人（HP 80 各），本体不消失
- 本体攻击加速，新增：地震波（全屏震动0.5秒，定身）
- 小石人为冲锋型，击杀后不再生

**阶段3（HP 30%-0%）「魔气爆发」**
- 紫色魔气包裹，移速提升50%
- 新增：魔气射线（直线穿透）
- 悟空半解放状态自动辅助攻击（剧情辅助DPS）
- HP降至10%时悟空完全解放，金箍棒终结

---

### 5.2 第二章 Boss

#### 白龙太子 White Dragon Prince（第12难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0（中Boss） |
| HP | 675 |
| DMG | 27 |
| 尺寸 | 256×256 |

**场景机制：** 河流中央是Boss战场，唐僧在岸上。悟空自动下水战斗。

**阶段1（HP 100%-50%）「水龙翻涌」**
- 龙形态在水中穿梭，随机方向冲出水面攻击
- 水柱喷射：3条水柱向岸上扫射（唐僧需躲避）
- 水面波浪周期性推向岸边

**阶段2（HP 50%-10%）「怒龙出水」**
- 跃出水面悬浮，全身龙鳞闪光
- 冰息喷射：扇形冰雾冻结水面（制造冰面陷阱）
- 尾扫：大范围弧形击退

**剧情结束（HP 10%）：** 观音现身，龙太子化为白马。战斗结束。

#### 黑风大王 Black Bear King（第16难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 675 |
| DMG | 27 |
| 尺寸 | 280×280 |

**阶段1（HP 100%-50%）「蛮力」**
- 熊掌拍击：前方扇形大伤害
- 冲撞：直线冲锋，碰到墙反弹
- 召唤2只熊妖小弟

**阶段2（HP 50%-0%）「黑风」**
- 释放黑雾，视野缩小至150px
- 隐身潜行，只在攻击前瞬间现身
- 新增：旋风掌（360°旋转攻击）
- 偷袈裟逃跑（追击阶段，限时20秒击杀）

#### 猪八戒 Zhu Bajie（第18难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5（章末Boss） |
| HP | 1012 |
| DMG | 40 |
| 尺寸 | 256×256 |

**说明：** 使用猪八戒英雄 sprite，加红色妖气特效。

**阶段1（HP 100%-60%）「猪妖耍赖」**
- 钉耙横扫：前方180°大范围
- 翻滚冲锋：滚成球冲来
- 被打时有20%概率装死（假死2秒后偷袭）

**阶段2（HP 60%-30%）「变化术」**
- 变成村姑（分裂3个假身，只有1个是真的）
- 真身被打后现原形，反击加强
- 钉耙旋风：原地旋转抛出钉耙回旋（弹幕）

**阶段3（HP 30%-0%）「天蓬残影」**
- 短暂变回天蓬元帅形态，全身蓝光
- 攻速翻倍，移速翻倍
- 持续10秒后体力不支投降（剧情结束）

---

### 5.3 第三章 Boss

#### 沙悟净 Sha Wujing（第21难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 850 |
| DMG | 34 |
| 尺寸 | 256×256 |

**说明：** 使用沙悟净英雄 sprite，加沙色妖气特效。

**阶段1（HP 100%-50%）「流沙猎手」**
- 潜入流沙消失 → 在唐僧脚下冒出攻击
- 宝杖投掷：穿透直线
- 流沙漩涡：在场上放置3个吸引力漩涡

**阶段2（HP 50%-10%）「卷帘大将」**
- 骷髅项链发光，9颗骷髅依次射出追踪弹
- 流沙河涨潮：场地逐渐被沙覆盖（减速区扩大）
- 宝杖连环投：3连快速投掷

**剧情结束（HP 10%）：** 木吒出现助阵，沙僧投降拜师。

#### 镇元大仙 Zhen Yuan（第24难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 850 |
| DMG | 34 |
| 尺寸 | 256×256 |

**特殊：** 不可击杀Boss，存活即胜。倒计时3分钟。

**全程技能：**
- 袖里乾坤：每15秒将所有人吸向场地中心（需疯狂反向跑）
- 困仙绳：绑定一个徒弟5秒（不可攻击）
- 落地生根：在唐僧位置种下树根陷阱
- 3分钟后观音调解，战斗结束

#### 黄风大王 Yellow Wind King（第27难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5 |
| HP | 1445 |
| DMG | 51 |
| 尺寸 | 280×280 |

**核心机制：全屏持续风力。**

**阶段1（HP 100%-60%）「黄风阵」**
- 全屏风力从一个方向吹（移动偏移+减速）
- 风中夹杂沙粒弹幕
- 本体在风的源头，需要逆风靠近攻击

**阶段2（HP 60%-30%）「风向乱转」**
- 风向每5秒随机切换
- 出现3个风眼（安全区），但风眼每8秒移动
- 新增：龙卷风（追踪型，碰到大伤害+击飞）

**阶段3（HP 30%-0%）「三昧神风」**
- 吹瞎悟空（悟空暂时无法攻击）
- 风力加倍
- 灵吉菩萨登场（剧情辅助），投出定风丹
- 定风丹激活后风力无效，全力输出10秒

---

### 5.4 第四章 Boss

#### 白骨精 White Bone Spirit（第31难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5 |
| HP | 1537 |
| DMG | 61 |
| 尺寸 | 280×280 |

**三相变化Boss：**

**第一相「少女」（HP 100%-70%）**
- 魅惑弹幕：粉色心形弹幕，八戒被命中会短暂失控（冲向Boss）
- 闪避：被攻击时30%概率闪避+反击

**第二相「老妇」（HP 70%-40%）**
- 召唤亡灵墙：白骨从地面升起组成墙壁阻挡移动
- 老妇拐杖：地面连续裂缝攻击
- 每15秒召唤一波骨将（2只）

**第三相「三相合体」（HP 40%-0%）**
- 变成骷髅女妖本体
- 白骨之舞：360°骨刺旋转
- 幽冥手：从地下伸出骨手抓唐僧（定身）
- 分裂术：分成3个半透明分身，只有1个是真的

**剧情锁定：** 无论如何，唐僧逐走悟空。

#### 黄袍怪 Yellow Robe Demon（第35/36难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0（第35难）/ 0.5（第36难，悟空秒杀） |
| HP | 1025 / 500 |
| DMG | 41 |
| 尺寸 | 280×280 |

**第35难（无悟空）：**
- 奎木狼原形：星光斩（十字形远程）
- 变虎术：把唐僧变成老虎（反转操控方向10秒）
- 妖兵护卫：场上始终有4只护卫
- **极难——只有八戒+沙僧，输出不足需要打满8分钟存活**

**第36难（悟空回归）：**
- 悟空带「怒火归来」buff（攻击力×3，持续30秒）
- 黄袍怪大幅弱化
- 基本是单方面碾压的爽关

---

### 5.5 第五章 Boss

#### 金角大王 + 银角大王 Gold & Silver Horn Kings（第40难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5（双Boss各自1.0，总计1.5） |
| 金角HP | 1200 |
| 银角HP | 1000 |
| DMG | 48 |
| 尺寸 | 各256×256 |

**双Boss协同机制：**

**金角大王**
- 紫金红葫芦：点名一个徒弟，10秒倒计时，到时被吸走（5秒不可用）
- 幌金绳：束缚技能，绑定唐僧3秒
- 近战铁棍横扫

**银角大王**
- 羊脂玉净瓶：地面放置陷阱圆（踩到持续伤害）
- 芭蕉扇：扇形推风（大范围击退）
- 远程火焰球

**协同技：** 两Boss靠近时释放「合璧」，全屏法宝共鸣伤害。需要将他们拉开。

**击杀顺序影响：** 先杀银角 → 金角暴怒（攻击+50%）；先杀金角 → 银角恐慌（乱放技能但间隔短）

#### 红孩儿 Red Boy（第44难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5 |
| HP | 1800 |
| DMG | 57 |
| 尺寸 | 220×220（小孩体型但气场大） |

**阶段1（HP 100%-60%）「顽童」**
- 火尖枪突刺：快速冲刺+枪尖火焰
- 翻跟斗踢火球：3连火球扇形
- 移速极快（小孩体型灵活）

**阶段2（HP 60%-20%）「三昧真火」**
- 全场地面逐渐被火焰覆盖（不可灭，不同于普通火）
- 安全区随机出现并缩小
- 火莲绽放：脚下生火莲，追踪型火焰花

**阶段3（HP 20%-0%）「圣婴大王」**
- 变成火焰巨婴（尺寸翻倍）
- 全屏火雨
- **剧情结束：** 观音出场，净瓶水灭三昧真火，莲花座收红孩儿

---

### 5.6 第六章 Boss

#### 车迟三仙 Three Immortals of Chechi（第47难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0（三阶段串联） |
| 各HP | 700 / 700 / 700 |
| DMG | 38 |
| 尺寸 | 各220×220 |

**三阶段串联Boss（依次出场）：**

**虎力大仙（第一阶段）**
- 虎爪连击：近战三连击
- 虎啸：全屏恐惧（减速2秒）
- 升云梯：跳高后下砸

**鹿力大仙（第二阶段）**
- 鹿角冲撞：直线冲锋
- 猜物术：场上出现3个宝箱，选错爆炸
- 远程鹿角光线

**羊力大仙（第三阶段）**
- 下油锅：地面出现沸腾油池（大范围持续伤害）
- 羊角旋风：旋转突进
- 变羊术：把一个徒弟变成小羊5秒（不可攻击）

#### 灵感大王 Goldfish Spirit King（第50难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5 |
| HP | 2063 |
| DMG | 62 |
| 尺寸 | 300×300 |

**水下Boss战（特殊移动机制：全员减速30%）**

**阶段1（HP 100%-50%）「通天河主」**
- 水柱旋转：自身为中心，4条水柱缓慢旋转（需躲避间隙）
- 鱼群召唤：一波8只鱼妖
- 尾鳍斩：弧形水刃

**阶段2（HP 50%-0%）「灵感显圣」**
- 全场涨潮：可活动区域缩小
- 吞噬漩涡：巨大吸引力圆
- 鱼跃龙门：跳出水面俯冲轰炸（3次连续）
- 观音出场提示后，场地恢复正常

#### 蝎子精 Scorpion Spirit（第52难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 1375 |
| DMG | 55 |
| 尺寸 | 260×260 |

**倒马毒机制：被命中的徒弟中毒（攻速-50%，持续8秒）**

- 尾钩刺击：近距离快速三连刺
- 毒针弹幕：扇形毒针（中毒效果）
- 遁地：潜入地下 → 在唐僧脚下突刺
- 琵琶曲：弹琵琶释放音波圈（扩散型伤害）
- 弱点：昴日星官鸡鸣术（剧情辅助，阶段性削弱）

#### 情丝心魔 Heart Demon of Love（第54难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5（特殊Boss） |
| 佛心值 | 100（降至0即失败） |
| 尺寸 | 无实体 |

**纯走位+念经Boss，无攻击手段。唐僧独自面对。**

- 幻象女王缓慢靠近，距离<100px时佛心值持续下降
- 念经（自动）可缓慢恢复佛心值，但需站定
- 前世记忆碎片闪现（干扰走位判断）
- 3分钟存活即胜
- 越后期幻象数量越多、移速越快

---

### 5.7 第七章 Boss

#### 铁扇公主 Iron Fan Princess（第57难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 1550 |
| DMG | 62 |
| 尺寸 | 220×220 |

**芭蕉扇风暴机制：**
- 一扇灭火：全屏巨风（击退所有人至场地边缘）
- 二扇生风：持续横向风力
- 扇击：近战扇子打（快速连击）
- 火焰壁：利用火焰山余烬制造火墙
- 悟空需要钻铁扇公主肚子（剧情技能，自动触发）

#### 牛魔王 Bull Demon King（第59难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5 |
| HP | 2883 |
| DMG | 72 |
| 尺寸 | 320×320 |

**多形态变身Boss（全游戏最复杂Boss之一）：**

**人形态（HP 100%-70%）**
- 混铁棍横扫：大范围近战
- 翻天掌：地面冲击波
- 与悟空对棍（剧情QTE式互锁3秒）

**巨牛形态（HP 70%-40%）**
- 体型增大至400×400
- 冲锋践踏：全屏直线冲撞
- 甩尾：身后扇形大伤害
- 牛蹄震地：全屏震动+碎石雨

**白牛形态（HP 40%-10%）**
- 终极形态，全身白光
- 全屏冲撞（不停冲，碰墙反弹）
- 牛角放电：追踪闪电
- 10%HP时哪吒+天兵出现，协助围剿

#### 青狮精 + 白象精 Blue Lion & White Elephant（第62难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0（双Boss） |
| 青狮HP | 1860 |
| 白象HP | 1860 |
| DMG | 65 |
| 尺寸 | 各280×280 |

**青狮精**
- 狮吼功：圆形扩散音波（击退+伤害）
- 咬合：近距离大伤害
- 阴风：扇形黑风（减速+伤害）

**白象精**
- 长鼻卷：抓住一个徒弟甩飞
- 踩踏：大面积AOE
- 象牙冲刺：直线突进

**协同：** 青狮骑白象冲锋（合体攻击，大范围直线碾压）

#### 大鹏金翅明王 Golden-Winged Roc（第63难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5（全游戏最难Boss之一） |
| HP | 2883 |
| DMG | 72 |
| 尺寸 | 350×350（飞行阴影更大） |

**飞行Boss（特殊机制：大部分时间在空中不可近战攻击）**

**阶段1（HP 100%-60%）「遮天蔽日」**
- 在场地上空盘旋，投下阴影标记 → 俯冲攻击
- 剃刀风：翅膀扇风制造多条风刃横切
- 抓取：俯冲抓走一个徒弟（10秒后丢回）

**阶段2（HP 60%-30%）「吞天」**
- 一口吞下悟空（悟空进入肚子内战斗阶段——画面切换为肚内场景）
- 外部：翅膀风暴持续，唐僧+八戒+沙僧要存活
- 内部（自动）：悟空在肚子里打，10秒后破腹而出

**阶段3（HP 30%-0%）「金翅怒翼」**
- 降落地面肉搏
- 翅膀扫击：巨大扇形
- 金光喷射：直线激光
- HP 5%时如来现身，一指定住大鹏

---

### 5.8 第八章 Boss

#### 盘丝七妖 Seven Spider Sisters（第65难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0（7只共享） |
| 各HP | 450 |
| DMG | 40 |
| 尺寸 | 各160×160 |

**7只独立小Boss同时出场，各有属性：**

| # | 名称 | 属性 | 特殊技能 |
|---|------|------|----------|
| 1 | 毒蛛 | 毒 | 毒雾区域 |
| 2 | 网蛛 | 控制 | 定身网 |
| 3 | 裂蛛 | 分裂 | 死亡分裂为4只小蛛 |
| 4 | 影蛛 | 隐身 | 周期隐身3秒 |
| 5 | 速蛛 | 速度 | 极速冲锋 |
| 6 | 射蛛 | 远程 | 丝线弹幕 |
| 7 | 母蛛 | 召唤 | 每15秒召唤4只蛛 |

**核心策略：** 击杀一只后其余6只全体强化10%。最佳打法是均匀削血后快速清场。

#### 百眼魔君 Hundred-Eye Demon（第67难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 1725 |
| DMG | 52 |
| 尺寸 | 300×300 |

**千眼致盲机制：**

**阶段1（HP 100%-50%）「蜈蚣现形」**
- 多足冲撞：蛇形移动
- 毒液喷射：扇形
- 身体两侧眼睛周期性闪光（光线伤害）

**阶段2（HP 50%-0%）「千眼金光」**
- 全身眼睛张开，释放金光
- 致盲：每15秒全屏闪白3秒（完全看不见）
- 致盲期间加速冲撞
- 需要在闪光间隙集中输出
- 毗蓝婆出场以绣花针破金光（剧情辅助）

#### 白鹿精 + 狐狸精 White Deer & Fox Spirit（第69难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0（双Boss） |
| 白鹿HP | 1200 |
| 狐狸HP | 800 |
| DMG | 48 |
| 尺寸 | 白鹿260×260 / 狐狸200×200 |

**白鹿精**
- 鹿角冲撞：强力直线冲锋
- 药炉召唤：地面出现沸腾药炉（持续AOE）
- 长生术：每30秒回复5%HP

**狐狸精**
- 魅惑术：让一个徒弟倒戈5秒（攻击唐僧）
- 狐火：追踪型火球
- 遁走：HP<30%逃跑，需追击

#### 地涌夫人 Mouse Spirit Lady（第72难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5 |
| HP | 2588 |
| DMG | 62 |
| 尺寸 | 220×220 |

**追逐战Boss（场景不断向下滚动，需要边跑边打）**

**阶段1（HP 100%-60%）「无底洞逃窜」**
- 在前方奔跑，边跑边向后扔陷阱（地洞、尖刺）
- 召唤小鼠妖阻挡前进
- 偶尔转身攻击：鼠牙飞弹

**阶段2（HP 60%-30%）「鼠辈现形」**
- 停下来变巨鼠形态
- 啮咬冲锋：高速短距离冲刺
- 鼠群召唤：地面涌出大量小鼠（减速+伤害）
- 挖洞逃跑 → 从另一侧冒出偷袭

**阶段3（HP 30%-0%）「绝路」**
- 困兽之斗，攻击频率翻倍
- 无底洞坍塌：场地持续缩小
- 托塔天王出场，塔光镇压（剧情辅助DPS）

---

### 5.9 第九章 Boss

#### 豹子精 Leopard Spirit（第75难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 1900 |
| DMG | 60 |
| 尺寸 | 240×240 |

**高速突袭型Boss（全游戏最快Boss）**

- 闪影突袭：瞬间移动到唐僧身后攻击
- 花皮旋风：高速旋转移动，留下刀痕伤害区
- 隐雾术：释放迷雾，自身在雾中加速
- 连斩：快速三连近战
- 弱点：攻击后有0.5秒硬直

#### 玉兔精 Jade Rabbit Spirit（第77难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.0 |
| HP | 1900 |
| DMG | 60 |
| 尺寸 | 200×200 |

**月光幻境弹幕Boss：**

**阶段1（HP 100%-50%）「月宫仙子」**
- 月光弹幕：美丽的圆形弹幕图案（花瓣形、螺旋形）
- 捣药杵攻击：地面圆形砸击
- 月兔分身：2个白兔分身协同弹幕

**阶段2（HP 50%-0%）「月华天降」**
- 场景变成月宫
- 弹幕升级：全屏月光弹幕，密度极高
- 广寒宫殿碎片掉落（大范围AOE）
- 太阴星君出场，收回玉兔

#### 三犀牛精 Three Rhino Spirits（第79难）

| 属性 | 值 |
|------|-----|
| 系数 | 1.5（三Boss） |
| 各HP | 1200 |
| DMG | 65 |
| 尺寸 | 各280×280 |

**三属性轮转Boss：**

| 犀牛 | 属性 | 特殊 |
|------|------|------|
| 辟寒大王 | 冰 | 冰面+冻结+冰刺 |
| 辟暑大王 | 火 | 火焰+灼烧+火柱 |
| 辟尘大王 | 风 | 龙卷+击退+沙尘 |

**轮转机制：** 每30秒切换当前活跃犀牛（其余两只退后但仍在场）。活跃犀牛攻击频率×2。三只同时HP<20%时合体冲锋。

#### 心魔总集 Final Heart Demon（第81难）

| 属性 | 值 |
|------|-----|
| 系数 | 3.0（最终Boss） |
| HP | 5700 |
| DMG | 114 |
| 尺寸 | 变化 |

**四阶段最终Boss战：**

**阶段1「嗔」（HP 100%-70%）**
- 幻化为之前所有Boss的影子（每个15秒，HP很低但攻击模式不变）
- 出场顺序随机
- 击杀每个影子恢复少量HP

**阶段2「痴」（HP 70%-40%）**
- 场景变成女儿国、家乡等温馨场景
- 至亲幻象出现，靠近削弱徒弟攻击力
- 需要控制唐僧远离幻象
- 场景交替切换（每15秒换一个回忆）

**阶段3「贪」（HP 40%-10%）**
- 金银珠宝、无上法力的幻象漫天飞舞
- 碰到金光→定身3秒
- 碰到法宝→随机负面效果
- 安全路径不断变化

**最终阶段「悟」（HP 10%-0%）**
- 所有徒弟消失
- 唐僧独自面对纯粹黑暗
- **不需要攻击——只需向西走**
- 操控唐僧向画面右侧（西方）持续行走
- 黑暗中有阻力和诱惑，但只要坚定向西就会通过
- 念经声越来越响，金光从唐僧身上绽放
- 黑暗自行退散，雷音寺显现

---

## 六、图片生成提示词

### 6.1 通用小怪提示词（30张）

所有小怪共用前缀：
```
ENEMY STYLE ANCHOR: Chibi/cute-but-menacing top-down 2D game enemy sprite,
matching the art style of the hero characters — soft cel-shaded, warm color
palette with darker tones for enemies, clean outlines, large head small body
proportions. Single character centered on transparent background (PNG),
right-facing action pose.
```

---

#### 冲锋型

**① 山贼 Bandit** → `assets/sprites/enemies/common/bandit.png`
```
ENEMY STYLE ANCHOR: [同上]

A masked bandit/brigand wielding a curved dao sword. Wearing tattered brown
leather armor with a black cloth mask, fierce narrowed eyes. Running forward
in attack pose with sword raised. Dusty and rough appearance. Dark brown
and grey color palette with red sash accent.
```

**② 野狼 Wolf** → `assets/sprites/enemies/common/wolf.png`
```
ENEMY STYLE ANCHOR: [同上]

A snarling grey wolf in attack stance. Lean hungry body, bared fangs dripping,
glowing yellow eyes, raised hackles. Running/leaping forward pose. Grey fur
with darker back, pale underbelly. Faint shadowy aura.
```

**③ 狼妖 Wolf Demon** → `assets/sprites/enemies/common/wolf_demon.png`
```
ENEMY STYLE ANCHOR: [同上]

An anthropomorphic wolf demon standing upright. Wolf head with fierce red eyes,
wearing ragged dark blue robes, wielding a rusty iron mace. Muscular build,
grey-black fur, fanged snarl. Dark blue and grey color palette with red eye
glow accent.
```

**④ 虎妖 Tiger Demon** → `assets/sprites/enemies/common/tiger_demon.png`
```
ENEMY STYLE ANCHOR: [同上]

An anthropomorphic tiger demon warrior. Orange-striped tiger head with fierce
expression, wearing battered bronze armor plates, wielding a broad-blade
halberd. Powerful stance, tail swishing. Orange, black stripes with bronze
armor accents.
```

**⑤ 牛精 Bull Spirit** → `assets/sprites/enemies/common/bull_spirit.png`
```
ENEMY STYLE ANCHOR: [同上]

A furious bull demon with glowing red eyes. Massive horns, ring through nose,
muscular dark-brown body, hooves crackling with earth energy. Charging forward
pose with head lowered. Dark brown and red color palette, earth dust particles
around hooves.
```

**⑥ 猪妖小弟 Pig Imp** → `assets/sprites/enemies/common/pig_imp.png`
```
ENEMY STYLE ANCHOR: [同上]

A small chubby pig demon minion. Pink round face with small tusks, floppy ears,
wearing a simple hemp vest, holding a wooden club. Comically aggressive
expression, short stubby legs mid-run. Pink and brown color palette, comedic
but hostile.
```

**⑦ 小猴妖 Monkey Imp** → `assets/sprites/enemies/common/monkey_imp.png`
```
ENEMY STYLE ANCHOR: [同上]

A small wild monkey demon from Flower Fruit Mountain. Brown fur, wearing a
leaf-woven cap, holding a sharpened stick. Mischievous and aggressive expression,
mid-leap with tail curled. Brown and green color palette, playful but dangerous.
```

**⑧ 妖化士兵 Corrupted Soldier** → `assets/sprites/enemies/common/corrupted_soldier.png`
```
ENEMY STYLE ANCHOR: [同上]

A human soldier corrupted by demon energy. Ancient Chinese armor (鎧甲) with
purple corruption veins glowing through cracks, glowing purple eyes, blank
expression. Wielding a standard spear, marching forward in rigid stance.
Grey armor with purple corruption glow accents.
```

---

#### 远程型

**⑨ 蛇妖 Snake Demon** → `assets/sprites/enemies/common/snake_demon.png`
```
ENEMY STYLE ANCHOR: [同上]

A snake demon with human upper body and serpent lower body. Green scales,
feminine face with slit pupils, long black hair, forked tongue visible.
Coiled tail supporting upright posture, hands conjuring a green poison orb.
Green and dark purple color palette, venomous aura.
```

**⑩ 蝎子小妖 Scorpion Imp** → `assets/sprites/enemies/common/scorpion_imp.png`
```
ENEMY STYLE ANCHOR: [同上]

A small scorpion demon. Dark red chitinous body, humanoid torso on scorpion
lower body, curved tail stinger raised and glowing with venom, two pincer
claws. Beady black eyes, aggressive stance. Dark red and sandy brown color
palette, venomous green stinger tip.
```

**⑪ 弓箭妖兵 Demon Archer** → `assets/sprites/enemies/common/demon_archer.png`
```
ENEMY STYLE ANCHOR: [同上]

A demon soldier archer. Humanoid demon with blue-grey skin, wearing light
leather armor, wielding a bone-crafted bow with a dark energy arrow nocked.
Pointed ears, glowing yellow eyes, aiming pose. Dark grey and bone-white
color palette with yellow energy accents.
```

**⑫ 蜈蚣精 Centipede Spirit** → `assets/sprites/enemies/common/centipede_spirit.png`
```
ENEMY STYLE ANCHOR: [同上]

A giant centipede demon, partially humanoid. Many-legged dark brown body
with red-tipped legs, human-like face on insect head with mandibles, spewing
green toxic mist from mouth. Coiled body posture. Dark brown and red with
green toxic accents.
```

---

#### 爆炸型

**⑬ 火精 Fire Spirit** → `assets/sprites/enemies/common/fire_spirit.png`
```
ENEMY STYLE ANCHOR: [同上]

A living fireball demon. Round body made of churning orange-red flames with
a menacing face (angry eyes, jagged mouth) formed in the fire. Small flame
arms reaching forward, trailing ember particles. Orange, red, and yellow
fire palette, bright and dangerous.
```

**⑭ 游魂 Ghost** → `assets/sprites/enemies/common/ghost.png`
```
ENEMY STYLE ANCHOR: [同上]

A translucent green ghost/spectre. Wispy ethereal body fading at the bottom
(no legs), agonized expression on pale face, hollow dark eyes, reaching
forward with ghostly claws. Surrounded by faint green spirit flames.
Pale green and white translucent palette, eerie glow.
```

**⑮ 火鸦 Fire Crow** → `assets/sprites/enemies/common/fire_crow.png`
```
ENEMY STYLE ANCHOR: [同上]

A crow engulfed in flames, mid-dive. Black feathers with tips on fire,
blazing red eyes, beak open in a screech, wings spread in diving attack
pose. Trailing fire and embers behind. Black, orange, and red fire palette.
```

---

#### 召唤型

**⑯ 妖王先锋 Demon Vanguard** → `assets/sprites/enemies/common/demon_vanguard.png`
```
ENEMY STYLE ANCHOR: [同上]

A demon officer/vanguard holding a tattered battle flag. Wearing mismatched
scavenged armor plates, oni-like face with small horns, standing proud with
flag planted. The flag has a demonic symbol. Dark iron and red flag color
palette, authoritative pose.
```

**⑰ 树妖 Tree Demon** → `assets/sprites/enemies/common/tree_demon.png`
```
ENEMY STYLE ANCHOR: [同上]

A twisted old tree come to life. Gnarled trunk forming a hunched body with
a creepy face (hollow eyes, crooked mouth) in the bark, branch-like arms
with clawed twig fingers, glowing green root tendrils spreading on ground.
Dark brown bark with sickly green leaf and root accents.
```

---

#### 精英型

**⑱ 熊妖 Bear Demon** → `assets/sprites/enemies/common/bear_demon.png`
```
ENEMY STYLE ANCHOR: [同上]

A massive black bear demon standing upright. Thick dark fur, wearing a
bone necklace and crude leather belt, small fierce red eyes, open mouth
roaring with visible fangs. One huge paw raised to strike, muscular build.
Black fur with bone-white necklace and red eye glow.
```

**⑲ 骨将 Bone General** → `assets/sprites/enemies/common/bone_general.png`
```
ENEMY STYLE ANCHOR: [同上]

A skeletal warrior general. Bleached white bones wearing rusted ancient
Chinese general armor (残破铠甲), holding a notched jian sword, blue ghost
fire burning in eye sockets. Commanding pose with sword raised. Bone white,
rusted iron, and blue ghost-fire palette.
```

**⑳ 烟妖 Smoke Demon** → `assets/sprites/enemies/common/smoke_demon.png`
```
ENEMY STYLE ANCHOR: [同上]

A humanoid figure made of dark grey smoke. Constantly shifting form with
wisps trailing off, two bright ember-orange eyes glowing within the smoke,
vague claw-like hands reaching forward. Semi-transparent body. Dark grey
smoke with orange ember eye accents.
```

---

#### 环境型

**㉑ 水鬼 Water Ghost** → `assets/sprites/enemies/common/water_ghost.png`
```
ENEMY STYLE ANCHOR: [同上]

A waterlogged ghost/drowned spirit. Green-tinged bloated face, long wet
black hair covering one eye, tattered wet robes dripping water, reaching
forward with pruned blue-green hands. Water droplets and puddle underneath.
Sickly green-blue and dark wet color palette.
```

**㉒ 沙魂 Sand Spirit** → `assets/sprites/enemies/common/sand_spirit.png`
```
ENEMY STYLE ANCHOR: [同上]

A humanoid figure made of swirling sand. Constantly shifting sandy body with
grains streaming off, dark hollow eyes and mouth like holes in a sandstorm,
arms dissolving into sand tendrils. Sandy tan with dark brown hollow features,
sand particle effects around body.
```

**㉓ 冰精 Ice Spirit** → `assets/sprites/enemies/common/ice_spirit.png`
```
ENEMY STYLE ANCHOR: [同上]

A humanoid crystal ice elemental. Semi-transparent icy blue body with visible
crystalline structure, cold mist emanating, sharp ice-shard crown on head,
frozen expression. Floating slightly off ground with ice forming underneath.
Icy blue and white translucent palette with frost particle effects.
```

**㉔ 蛛网妖 Web Spinner** → `assets/sprites/enemies/common/web_spinner.png`
```
ENEMY STYLE ANCHOR: [同上]

A large purple spider demon. Eight hairy purple-black legs, bulbous abdomen
with a skull-like pattern, multiple small red eyes, fangs dripping silk.
Crouched in web-spinning pose with silk threads trailing from spinnerets.
Dark purple and black with red eye accents, silk thread details.
```

**㉕ 风精 Wind Spirit** → `assets/sprites/enemies/common/wind_spirit.png`
```
ENEMY STYLE ANCHOR: [同上]

A living whirlwind with a face. Spinning green-grey tornado body with a
vague mischievous face formed in the wind (swirling eyes and grinning mouth),
leaves and debris caught in the spin. Floating and spinning. Green-grey
wind palette with scattered leaf debris.
```

---

#### 特殊小怪

**㉖ 僵尸 Zombie** → `assets/sprites/enemies/common/zombie.png`
```
ENEMY STYLE ANCHOR: [同上]

A Chinese jiangshi (僵尸) zombie. Rigid body in tattered Qing-dynasty official
robes, arms outstretched forward, pale greenish-grey skin, ofuda talisman
paper partially stuck on forehead, hopping forward. Pale green-grey with
faded blue robe, yellow talisman accent.
```

**㉗ 石妖 Stone Imp** → `assets/sprites/enemies/common/stone_imp.png`
```
ENEMY STYLE ANCHOR: [同上]

A round boulder-like stone imp. Spherical rocky body with one large yellow
Cyclops eye, small stubby stone legs, crack-line mouth grinning. Rolling
forward in attack pose, small rock fragments trailing behind. Grey stone
with yellow eye glow, mossy green patches.
```

**㉘ 鱼妖 Fish Demon** → `assets/sprites/enemies/common/fish_demon.png`
```
ENEMY STYLE ANCHOR: [同上]

An anthropomorphic fish demon (fishman). Standing upright carp body with
small legs and arm-fins, fish head with bulging eyes and whiskered mouth,
scales shimmering, spitting a water bubble projectile. Blue-green scales
with golden carp accent, water bubble effect.
```

**㉙ 花妖 Flower Sprite** → `assets/sprites/enemies/common/flower_sprite.png`
```
ENEMY STYLE ANCHOR: [同上]

A small flower fairy/sprite turned hostile. Petal wings (pink and red),
tiny humanoid body made of vines and leaves, flower-bud head with glowing
angry red eyes, scattering pollen dust. Floating with petal wings spread.
Pink, red, and green nature palette with golden pollen particles.
```

**㉚ 深渊妖 Abyss Creature** → `assets/sprites/enemies/common/abyss_creature.png`
```
ENEMY STYLE ANCHOR: [同上]

A dark eldritch tentacle creature from the abyss. Mass of black writhing
tentacles emerging from a dark void, multiple glowing red eyes scattered
across the body, no clear form — pure darkness with eyes and tentacles.
Pitch black with glowing red eyes, dark purple void energy accents.
```

---

### 6.2 Boss 提示词（28张）

所有Boss共用前缀：
```
BOSS STYLE ANCHOR: Chibi/cute-but-imposing top-down 2D game boss sprite,
matching the art style of the hero characters — soft cel-shaded, warm color
palette, clean outlines, large head proportions but more detailed and
powerful-looking than regular enemies. Single character centered on
transparent background (PNG), dynamic action pose. Larger and more
intimidating than regular mobs. Rich detail and strong visual presence.
```

---

**① 石中巨魔 Stone Golem** → `assets/sprites/enemies/bosses/stone_golem.png`
```
BOSS STYLE ANCHOR: [同上]

A massive stone golem formed from Five-Elements Mountain rubble. Towering
humanoid rock body with ancient seal inscriptions glowing purple on its surface,
cracked stone revealing pulsing dark magic energy within, two burning purple
eyes, huge stone fists. Chunks of mountain debris orbiting its body. Grey
stone with purple magic glow, ancient Chinese seal script accents.
```

**② 黑风大王 Black Bear King** → `assets/sprites/enemies/bosses/black_bear_king.png`
```
BOSS STYLE ANCHOR: [同上]

The Black Wind Bear King (黑风大王), a massive anthropomorphic black bear demon.
Standing upright in a dark cave, wearing a stolen crimson kasaya robe draped
over one shoulder, thick black fur, intelligent cunning red eyes, wielding a
black iron spear. Black wind/mist swirling around feet. Black fur with crimson
robe accent and dark wind effects.
```

**③ 白骨精 White Bone Spirit** → `assets/sprites/enemies/bosses/white_bone_spirit.png`
```
BOSS STYLE ANCHOR: [同上]

The White Bone Spirit (白骨精) in her true skeletal form. An elegant female
skeleton demon with flowing ghostly white hair, wearing tattered white burial
robes, bone-white skin with visible skeletal structure underneath, holding a
bone staff topped with a skull. Three faint ghostly faces (maiden, old woman,
old man) swirling around her. Bone white, ghostly blue-white, with faint pink
and grey phantom face accents.
```

**④ 黄袍怪 Yellow Robe Demon** → `assets/sprites/enemies/bosses/yellow_robe_demon.png`
```
BOSS STYLE ANCHOR: [同上]

The Yellow Robe Demon (黄袍怪/奎木狼), a handsome but sinister celestial warrior
fallen to demonhood. Wearing a magnificent flowing yellow silk robe with star
patterns (he is the Kui Star Wolf constellation), holding a crescent blade,
sharp wolf-like features hidden under elegant appearance. Starlight aura around
him. Golden yellow robe with silver star patterns, celestial blue energy accents.
```

**⑤ 金角大王 Gold Horn King** → `assets/sprites/enemies/bosses/gold_horn_king.png`
```
BOSS STYLE ANCHOR: [同上]

The Gold Horn King (金角大王), a powerful demon king. Large muscular demon with
golden-brown skin, single golden horn on forehead, fierce bearded face, wearing
ornate demon general armor, holding the Purple-Gold Red Gourd (紫金红葫芦) in one
hand and an iron staff in the other. Dark cave background energy. Golden-brown
skin with gold horn, dark red armor accents, purple gourd.
```

**⑥ 银角大王 Silver Horn King** → `assets/sprites/enemies/bosses/silver_horn_king.png`
```
BOSS STYLE ANCHOR: [同上]

The Silver Horn King (银角大王), brother of Gold Horn. Leaner demon with silvery-grey
skin, single silver horn on forehead, cunning fox-like expression, wearing lighter
demon armor, holding the Mutton-Fat Jade Bottle (羊脂玉净瓶) that glows with
suction energy. Silver-grey skin with silver horn, lighter armor, jade-green
bottle glow.
```

**⑦ 红孩儿 Red Boy** → `assets/sprites/enemies/bosses/red_boy.png`
```
BOSS STYLE ANCHOR: [同上]

Red Boy (红孩儿/圣婴大王), a demon child wreathed in true samadhi fire. Young boy
appearance with red skin, wild flame-shaped red hair, wearing a red silk belly
wrap (肚兜) and gold bangles, wielding a Fire-Tipped Spear (火尖枪). Standing on
a wheel of fire, surrounded by intense red-orange samadhi flames. Red skin with
orange fire, gold bangle accents, intense fire particle effects.
```

**⑧ 虎力大仙 Tiger Immortal** → `assets/sprites/enemies/bosses/tiger_immortal.png`
```
BOSS STYLE ANCHOR: [同上]

Tiger-Power Great Immortal (虎力大仙), a tiger demon disguised as a Taoist priest.
Anthropomorphic tiger in elaborate Taoist robes (道袍) with tiger-stripe patterns
showing through, holding a Taoist whisk (拂尘), arrogant expression, standing in
a mystical pose. Tiger orange with Taoist blue robe and gold trim accents.
```

**⑨ 鹿力大仙 Deer Immortal** → `assets/sprites/enemies/bosses/deer_immortal.png`
```
BOSS STYLE ANCHOR: [同上]

Deer-Power Great Immortal (鹿力大仙), a deer demon disguised as a Taoist priest.
Anthropomorphic deer with antlers poking through a Taoist cap, wearing green-brown
Taoist robes, holding a medicine gourd, sly expression. Antler tips glowing with
mystical energy. Brown deer with green Taoist robe, golden antler glow.
```

**⑩ 羊力大仙 Goat Immortal** → `assets/sprites/enemies/bosses/goat_immortal.png`
```
BOSS STYLE ANCHOR: [同上]

Goat-Power Great Immortal (羊力大仙), a goat demon disguised as a Taoist priest.
Anthropomorphic goat with curled horns, long white beard merging with goat beard,
wearing white Taoist robes, stirring a bubbling cauldron of oil with a ladle.
Smug expression. White goat with white-grey robes, bubbling orange oil cauldron.
```

**⑪ 灵感大王 Goldfish Spirit King** → `assets/sprites/enemies/bosses/goldfish_king.png`
```
BOSS STYLE ANCHOR: [同上]

The Goldfish Spirit King (灵感大王), a massive goldfish demon from Tong Tian River.
Enormous red-gold carp body with humanoid features forming in the face, wearing
coral crown, wielding a trident made of fish bone, surrounded by swirling water
and bubbles. Magnificent red-gold scales, coral crown, blue water energy effects.
```

**⑫ 蝎子精 Scorpion Spirit** → `assets/sprites/enemies/bosses/scorpion_spirit.png`
```
BOSS STYLE ANCHOR: [同上]

The Scorpion Spirit (蝎子精/琵琶精), a beautiful woman with scorpion features.
Upper body is an alluring woman in dark purple robes holding a pipa (琵琶) lute,
lower body transitions to a massive scorpion tail with deadly stinger glowing
with venom. Dual nature — beauty and danger. Dark purple with venomous green
stinger, musical note effects around pipa.
```

**⑬ 铁扇公主 Iron Fan Princess** → `assets/sprites/enemies/bosses/iron_fan_princess.png`
```
BOSS STYLE ANCHOR: [同上]

Princess Iron Fan (铁扇公主), wife of the Bull Demon King. Elegant but fierce woman
in flowing crimson and gold dress, wielding the massive Banana Leaf Fan (芭蕉扇)
that is as large as her body, wind energy swirling around the fan. Regal and angry
expression, hair blown by her own wind. Crimson and gold dress, green-brown fan
with powerful wind energy effects.
```

**⑭ 牛魔王 Bull Demon King** → `assets/sprites/enemies/bosses/bull_demon_king.png`
```
BOSS STYLE ANCHOR: [同上]

The Bull Demon King (牛魔王), most powerful demon king. In humanoid form: massive
muscular warrior with bull horns, wearing heavy dark armor with gold trim,
wielding a huge iron staff (混铁棍). Fierce commanding expression, one eye glowing
red. Dark iron armor with gold trim, red energy aura, imposing and powerful.
```

**⑮ 青狮精 Blue Lion Demon** → `assets/sprites/enemies/bosses/blue_lion_demon.png`
```
BOSS STYLE ANCHOR: [同上]

The Blue Lion Demon (青狮精) of Lion Camel Ridge, mount of Manjusri Bodhisattva
gone rogue. Massive blue-maned lion demon with flowing celestial blue mane,
wearing broken celestial collar/chains, fierce golden eyes, open mouth revealing
fangs and blue energy breath. Celestial blue mane, gold eyes, broken chain accents.
```

**⑯ 白象精 White Elephant Demon** → `assets/sprites/enemies/bosses/white_elephant_demon.png`
```
BOSS STYLE ANCHOR: [同上]

The White Elephant Demon (白象精) of Lion Camel Ridge, mount of Samantabhadra
Bodhisattva gone rogue. Massive white elephant demon in ornate but corrupted
celestial armor, long trunk curling aggressively, tusks glowing with power,
small angry red eyes. White body with corrupted golden armor, dark energy cracks.
```

**⑰ 大鹏金翅明王 Golden-Winged Roc** → `assets/sprites/enemies/bosses/golden_roc.png`
```
BOSS STYLE ANCHOR: [同上]

The Golden-Winged Great Peng (大鹏金翅明王), the most terrifying demon in Journey
to the West, nephew of the Buddha himself. Enormous bird-humanoid with massive
golden wings spread wide, eagle-like fierce face with golden crown, wearing
dark battle armor, talons crackling with golden lightning. Wings create golden
light. Gold and black with celestial golden wing energy, supreme and terrifying.
```

**⑱ 盘丝七妖(代表) Spider Sister** → `assets/sprites/enemies/bosses/spider_sister.png`
```
BOSS STYLE ANCHOR: [同上]

One of the Seven Spider Sisters (盘丝洞蜘蛛精). Beautiful woman upper body with
elaborate hairstyle and silken robes, lower body is a large purple-black spider
body with eight legs. Spinning silk threads from fingers, multiple small eyes
hidden in hair. Alluring but deadly. Purple-black spider body, colorful silk
robes upper body, silk thread and web effects.
```

**⑲ 百眼魔君 Hundred-Eye Demon** → `assets/sprites/enemies/bosses/hundred_eye_demon.png`
```
BOSS STYLE ANCHOR: [同上]

The Hundred-Eye Demon Lord (百眼魔君/多目怪), a massive centipede demon with
hundreds of eyes. Long segmented dark-brown centipede body coiled upright,
torso covered with hundreds of golden eyes that glow intensely, human-like
face with multiple extra eyes on forehead. All eyes open and radiating golden
light beams. Dark brown body, golden glowing eyes covering entire surface.
```

**⑳ 白鹿精 White Deer Spirit** → `assets/sprites/enemies/bosses/white_deer_spirit.png`
```
BOSS STYLE ANCHOR: [同上]

The White Deer Spirit (白鹿精), masquerading as a Taoist master. Anthropomorphic
white deer in elaborate Taoist ceremonial robes, crystal antlers glowing with
life-stealing energy, holding a jade medicine cauldron, sinister smile beneath
kind old face. White deer with ornate Taoist robes, crystal antlers with green
life-drain energy.
```

**㉑ 地涌夫人 Mouse Spirit Lady** → `assets/sprites/enemies/bosses/mouse_spirit.png`
```
BOSS STYLE ANCHOR: [同上]

The Half-Guanyin / Mouse Spirit Lady (地涌夫人/金鼻白毛老鼠精). In her true form:
a large white-furred mouse demon with a golden nose, wearing tattered celestial
robes (formerly of Heavenly King Li), wielding twin short blades, long white
tail, fierce but cunning small eyes. White fur, golden nose accent, tattered
celestial blue robes, twin blade gleam.
```

**㉒ 豹子精 Leopard Spirit** → `assets/sprites/enemies/bosses/leopard_spirit.png`
```
BOSS STYLE ANCHOR: [同上]

The Leopard Spirit (艾叶花皮豹子精), fastest demon in Journey to the West.
Anthropomorphic leopard with distinctive leaf-pattern spotted fur, lean muscular
build, wearing light leather armor, wielding twin crescent blades. Crouched in
a speed-ready attack pose, motion blur lines. Spotted yellow-gold fur with dark
rosettes, speed blur effects, silver blade gleam.
```

**㉓ 玉兔精 Jade Rabbit Spirit** → `assets/sprites/enemies/bosses/jade_rabbit.png`
```
BOSS STYLE ANCHOR: [同上]

The Jade Rabbit Spirit (玉兔精) from the Moon Palace. In demon form: an elegant
white rabbit-girl with long rabbit ears, wearing flowing moon-white and silver
celestial robes, wielding a jade medicine pestle (捣药杵) as weapon, surrounded
by floating moonlight orbs. Crescent moon behind her. Pure white with silver
and moonlight blue, floating moon orbs and crescent moon motif.
```

**㉔ 犀牛精(辟寒) Rhino Spirit - Cold** → `assets/sprites/enemies/bosses/rhino_cold.png`
```
BOSS STYLE ANCHOR: [同上]

King Bihan (辟寒大王), a massive ice-element rhinoceros demon. Armored rhino body
with ice crystals growing from hide, blue-white frost horn, wearing frozen armor
plates, breath visible as cold mist. Charging pose with frost trail. Blue-white
icy hide, crystal ice horn, frost mist effects.
```

**㉕ 犀牛精(辟暑) Rhino Spirit - Heat** → `assets/sprites/enemies/bosses/rhino_heat.png`
```
BOSS STYLE ANCHOR: [同上]

King Bishu (辟暑大王), a massive fire-element rhinoceros demon. Armored rhino body
with magma cracks glowing orange through hide, flame-wreathed horn, wearing
scorched dark armor. Charging pose with fire trail. Dark grey hide with orange
magma cracks, flame horn, fire trail effects.
```

**㉖ 犀牛精(辟尘) Rhino Spirit - Dust** → `assets/sprites/enemies/bosses/rhino_dust.png`
```
BOSS STYLE ANCHOR: [同上]

King Bichen (辟尘大王), a massive wind-element rhinoceros demon. Armored rhino body
with swirling sand and wind patterns on hide, tornado-shaped horn, wearing
wind-worn leather armor. Charging pose with sand storm trail. Sandy tan hide
with wind swirl patterns, tornado horn, sandstorm particle effects.
```

**㉗ 镇元大仙 Zhen Yuan Immortal** → `assets/sprites/enemies/bosses/zhen_yuan.png`
```
BOSS STYLE ANCHOR: [同上]

Zhen Yuan the Great Immortal (镇元大仙), the Earth Immortal. An ancient but
powerful-looking Taoist immortal with kind face hiding immense power. Long white
beard, wearing magnificent purple-gold Taoist Grand Master robes with cloud
patterns, holding a dusting whisk (拂尘) that radiates reality-warping energy.
Ginseng fruit tree faintly visible behind him. Purple-gold robes with white
beard, cosmic energy around whisk.
```

**㉘ 黄风大王 Yellow Wind King** → `assets/sprites/enemies/bosses/yellow_wind_king.png`
```
BOSS STYLE ANCHOR: [同上]

The Yellow Wind King (黄风大王/黄风怪), a marten/sable demon. Anthropomorphic yellow
marten with sharp features, wearing tattered brown robes billowing in self-generated
wind, mouth wide open blowing devastating yellow sandstorm wind (三昧神风), sand and
debris swirling around entire body. Yellow-brown fur with sandy wind storm effects,
brown tattered robes, intense wind particle effects.
```

---

### 6.3 特殊Boss（无需独立图片）

以下Boss使用已有英雄sprite + 特效叠加：
- **白龙太子**（第12难）→ 使用 `bailongma_dragon_sprite.png` + 红色妖气特效
- **猪八戒**（第18难）→ 使用 `bajie_sprite.png` + 红色妖气特效
- **沙悟净**（第21难）→ 使用 `wujing_sprite.png` + 沙色妖气特效
- **情丝心魔**（第54难）→ 无实体，使用程序化粒子特效（心形+女王轮廓）
- **心魔总集**（第81难）→ 无固定形态，使用之前Boss幻影 + 黑暗粒子特效

---

## 七、资产清单汇总

| 类型 | 数量 | 目录 |
|------|------|------|
| 通用小怪 | 30张 | `assets/sprites/enemies/common/` |
| Boss | 28张 | `assets/sprites/enemies/bosses/` |
| **总计** | **58张** | |

### 生成批次建议

| 批次 | 内容 | 数量 | 预估时间 |
|------|------|------|----------|
| 1 | 第1-3章小怪 | 15张 | ~20分钟 |
| 2 | 第4-9章小怪 | 15张 | ~20分钟 |
| 3 | 第1-4章Boss | 10张 | ~15分钟 |
| 4 | 第5-7章Boss | 10张 | ~15分钟 |
| 5 | 第8-9章Boss | 8张 | ~12分钟 |

---

## 八、未来扩展

### 8.1 精英皮肤系统
后续可为每种小怪增加2-3种颜色变体（如：野狼→黑狼/白狼/幽灵狼），通过色调偏移程序化生成，无需额外图片资源。

### 8.2 Boss Sprite Sheet 升级
对高优先级Boss（牛魔王、大鹏、白骨精、红孩儿等）可后续生成4方向×5帧的完整sprite sheet，提升Boss战表现力。

### 8.3 章节特殊敌人
每章可加入1-2个该章限定的特殊变种（如火焰山的「岩浆牛精」），通过现有sprite + 特效叠加实现。
