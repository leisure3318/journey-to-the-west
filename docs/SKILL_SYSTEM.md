# 技能系统设计文档

> 西行幸存者 — 角色技能 & 升级树

---

## 一、系统概述

### 升级机制

击杀妖怪获得经验珠，经验满后升级，每次升级从3个随机选项中选1个：
- **徒弟技能** — 强化某个徒弟的攻击能力
- **唐僧心法** — 强化唐僧的被动/主动能力
- **法器** — 获得或升级一个被动道具

每个技能最高 **5级**（基础1级 + 4次升级），满级后不再出现在选项池中。

### 技能进化

当特定技能+特定法器都满级时，触发 **进化**，合成为终极技能。进化后该技能和法器槽位合并为一个终极技能槽。

---

## 二、孙悟空（主力输出）

> 环绕位置：最近距离，冲向最近敌人

### 基础攻击：金箍棒横扫

自动向最近敌人方向挥棒，造成扇形范围伤害。

| 等级 | 效果 |
|------|------|
| 1 | 120°扇形，基础伤害10，攻击间隔1.2s |
| 2 | 伤害+5，攻击间隔-0.1s |
| 3 | 扇形扩大至150° |
| 4 | 伤害+10，攻击间隔-0.1s |
| 5 | 每次横扫产生冲击波，额外直线伤害 |

### 技能A：分身术

孙悟空拔猴毛吹出分身，分身复制本体攻击但伤害降低。

| 等级 | 效果 |
|------|------|
| 1 | 1个分身，50%伤害，持续5s，冷却15s |
| 2 | 分身伤害提升至60% |
| 3 | 2个分身 |
| 4 | 持续时间+3s |
| 5 | 3个分身，70%伤害 |

### 技能B：七十二变

每隔一段时间随机变身为一种形态，获得临时增益。

| 等级 | 效果 |
|------|------|
| 1 | 每20s变身一次，持续5s。变身池：巨猿（伤害+30%）、飞鸟（攻速+50%）|
| 2 | 变身池+蜜蜂（体型缩小，攻速+100%） |
| 3 | 变身间隔-5s |
| 4 | 变身池+巨龙（范围+100%，伤害+50%） |
| 5 | 持续时间+3s，变身时免疫伤害 |

### 技能C：火眼金睛

被动技能，揭示隐身敌人，对精英/Boss额外暴击。

| 等级 | 效果 |
|------|------|
| 1 | 揭示隐身敌人，暴击率+5% |
| 2 | 暴击率+5%（共10%） |
| 3 | 暴击伤害150%→200% |
| 4 | 对精英怪额外+20%伤害 |
| 5 | 对Boss额外+30%伤害，暴击率+5%（共15%） |

### 🔥 进化技能

| 进化名 | 条件 | 效果 |
|--------|------|------|
| **齐天大圣** | 金箍棒Lv5 + 如意金箍（法器）Lv5 | 金箍棒自动变大变小，小棒高速连击+大棒360°横扫交替，伤害×2 |
| **万猴朝宗** | 分身术Lv5 + 蟠桃（法器）Lv5 | 分身数量变为6个，100%伤害，永久存在，形成猴群阵型 |
| **通天神目** | 火眼金睛Lv5 + 照妖镜（法器）Lv5 | 全屏揭示+持续标记，被标记敌人受到所有伤害+25%，Boss暴击率50% |

---

## 三、猪八戒（群体控制）

> 环绕位置：中距离，优先攻击密集群

### 基础攻击：九齿钉耙砸地

向密集敌群方向砸地，造成圆形AoE伤害+短暂减速。

| 等级 | 效果 |
|------|------|
| 1 | 半径60px圆形AoE，伤害8，减速20%持续1s，间隔1.5s |
| 2 | 半径+10px |
| 3 | 伤害+5，减速提升至30% |
| 4 | 半径+15px，攻击间隔-0.2s |
| 5 | 砸地产生裂缝，裂缝持续2s造成持续伤害 |

### 技能A：嘴拱冲锋

猪八戒向前冲锋，击退路径上所有敌人。

| 等级 | 效果 |
|------|------|
| 1 | 直线冲锋200px，击退敌人，伤害15，冷却10s |
| 2 | 冲锋距离+50px |
| 3 | 冲锋路径留下泥地，减速敌人30%持续3s |
| 4 | 冲锋结束时落地砸，额外AoE伤害 |
| 5 | 冲锋距离+100px，冷却-3s |

### 技能B：天蓬觉醒

短暂回忆前世天蓬元帅之力，变身为天蓬形态。

| 等级 | 效果 |
|------|------|
| 1 | 持续5s，攻速+50%，伤害+30%，冷却30s |
| 2 | 持续+2s |
| 3 | 觉醒期间攻击附带击飞效果 |
| 4 | 伤害+50%（共+80%） |
| 5 | 持续+3s，觉醒期间免疫控制 |

### 技能C：大肚能容

被动技能，击杀敌人回复生命值，吃经验珠额外回血。

| 等级 | 效果 |
|------|------|
| 1 | 击杀回复1HP |
| 2 | 击杀回复2HP |
| 3 | 拾取经验珠额外回复0.5HP |
| 4 | 击杀精英回复10HP |
| 5 | 当生命值<30%时，回复量翻倍 |

### 🔥 进化技能

| 进化名 | 条件 | 效果 |
|--------|------|------|
| **天河水军** | 钉耙砸地Lv5 + 芭蕉扇（法器）Lv5 | 砸地变为全屏海啸，每5s自动触发，伤害×3+全屏减速50% |
| **天蓬真身** | 天蓬觉醒Lv5 + 天蓬令牌（法器）Lv5 | 永久天蓬形态，体型增大，攻击范围×2，自带击飞，伤害+100% |
| **食神** | 大肚能容Lv5 + 人参果（法器）Lv5 | 击杀回复5HP+全队1HP，经验珠回复2HP，<30%时回复×3并短暂无敌 |

---

## 四、沙悟净（持续/远程）

> 环绕位置：远距离，优先攻击唐僧背后方向

### 基础攻击：降妖宝杖投掷

向后方投掷宝杖，穿透所有敌人造成伤害。

| 等级 | 效果 |
|------|------|
| 1 | 直线穿透，伤害7，攻击间隔1.0s |
| 2 | 伤害+3 |
| 3 | 穿透时每穿一个敌人伤害+10% |
| 4 | 攻击间隔-0.15s |
| 5 | 投掷2支宝杖（V字形双线） |

### 技能A：流沙陷阱

在地面放置流沙区域，敌人进入减速并受持续伤害。

| 等级 | 效果 |
|------|------|
| 1 | 半径50px，减速40%，每秒伤害3，持续5s，最多同时2个，冷却8s |
| 2 | 最多同时3个 |
| 3 | 减速提升至50%，每秒伤害+2 |
| 4 | 半径+20px |
| 5 | 最多5个，陷阱内敌人受到所有伤害+15% |

### 技能B：卷帘守护

在唐僧周围生成经卷屏障，吸收伤害。

| 等级 | 效果 |
|------|------|
| 1 | 屏障吸收20点伤害，破碎后15s冷却 |
| 2 | 吸收+10（共30） |
| 3 | 屏障存在时唐僧移速+10% |
| 4 | 吸收+15（共45），冷却-3s |
| 5 | 屏障破碎时爆炸，对周围敌人造成屏障剩余值×2的伤害 |

### 技能C：通天河领域

被动扩大控制范围，对远处敌人造成额外伤害。

| 等级 | 效果 |
|------|------|
| 1 | 宝杖投掷射程+20% |
| 2 | 对屏幕边缘敌人额外+10%伤害 |
| 3 | 射程+20%（共+40%） |
| 4 | 对屏幕边缘敌人额外+20%伤害（共+30%） |
| 5 | 宝杖有10%概率在命中点产生小型流沙 |

### 🔥 进化技能

| 进化名 | 条件 | 效果 |
|--------|------|------|
| **卷帘大将** | 宝杖投掷Lv5 + 九骷髅串（法器）Lv5 | 投掷变为9支骷髅追踪弹，自动索敌，穿透+10%叠伤，攻速×2 |
| **流沙天河** | 流沙陷阱Lv5 + 紫金红葫芦（法器）Lv5 | 陷阱变为永久存在的流沙河带，覆盖唐僧移动路径，宽度大，吸入敌人 |
| **金身罗汉** | 卷帘守护Lv5 + 锦斓袈裟（法器）Lv5 | 屏障变为永久金身光环，持续吸收伤害，每秒回复5点屏障值，全队减伤15% |

---

## 五、唐僧（核心/被动）

> 唐僧是玩家操控角色，不能直接攻击，通过心法强化自身和徒弟

### 被动光环：金光念经

持续散发金色光环，范围内敌人减速并受微量持续伤害。

| 等级 | 效果 |
|------|------|
| 1 | 半径80px，减速10%，每秒1点伤害 |
| 2 | 半径+20px |
| 3 | 减速15%，伤害+1 |
| 4 | 半径+30px |
| 5 | 减速20%，伤害+2，光环内徒弟攻速+10% |

### 心法A：紧箍咒

主动技能，短暂大幅强化孙悟空。

| 等级 | 效果 |
|------|------|
| 1 | 悟空攻击力+50%持续3s，冷却20s |
| 2 | 持续+1s |
| 3 | 额外+攻速30% |
| 4 | 持续+1s，冷却-5s |
| 5 | 效果扩展至所有徒弟（各+30%攻击力+20%攻速） |

### 心法B：大慈大悲

慈悲值随时间自然积攒，满后可释放全屏净化。

| 等级 | 效果 |
|------|------|
| 1 | 60s充满，净化造成全屏15点伤害+消除敌人buff |
| 2 | 充能-10s |
| 3 | 净化伤害+10 |
| 4 | 净化同时回复全队20%HP |
| 5 | 充能-10s（共40s），净化后5s内敌人无法靠近唐僧 |

### 心法C：金蝉护体

被动技能，受到致死伤害时自动触发保护。

| 等级 | 效果 |
|------|------|
| 1 | 每关1次，受致死伤害时保留1HP+2s无敌 |
| 2 | 触发时全屏击退敌人 |
| 3 | 每关2次 |
| 4 | 无敌时间+1s |
| 5 | 每关3次，触发后15s内全队攻击力+20% |

### 🔥 进化技能

| 进化名 | 条件 | 效果 |
|--------|------|------|
| **如来金身** | 金光念经Lv5 + 九环锡杖（法器）Lv5 | 光环半径扩大至全屏，减速30%+每秒5伤害+全徒弟攻速+20%，行走处留下金色净土 |
| **般若波罗蜜** | 大慈大悲Lv5 + 金钵盂（法器）Lv5 | 慈悲值持续溢出为被动效果，每3s小型净化脉冲，满值大净化伤害×3+全屏定身2s |
| **金蝉子转世** | 金蝉护体Lv5 + 通关文牒（法器）Lv5 | 死亡保护变为持续金蝉之力：每10s自动回复5%HP，死亡时全队无敌5s+HP全满+爆发伤害 |

---

## 六、白龙马（被动增益）

> 白龙马不参与战斗，提供全局被动加成。骑乘状态，跟随唐僧。

### 被动A：龙行千里

增加唐僧移动速度。

| 等级 | 效果 |
|------|------|
| 1 | 移速+15% |
| 2 | 移速+10%（共+25%） |
| 3 | 冲刺时（连续移动3s）额外+20%移速 |
| 4 | 移速+10%（共+35%） |
| 5 | 冲刺状态碾过的敌人受10点伤害 |

### 被动B：龙珠聚灵

增加经验珠吸取范围。

| 等级 | 效果 |
|------|------|
| 1 | 经验吸取范围+30% |
| 2 | +20%（共+50%） |
| 3 | 经验珠价值+10% |
| 4 | +20%（共+70%） |
| 5 | 范围+30%（共+100%），经验珠价值+20%（共+30%） |

### 被动C：龙息尾迹

唐僧移动时白龙马留下龙息尾迹，伤害踩上去的敌人。

| 等级 | 效果 |
|------|------|
| 1 | 尾迹持续2s，每秒2点伤害 |
| 2 | 伤害+1，持续+1s |
| 3 | 尾迹宽度翻倍 |
| 4 | 伤害+2，附带减速15% |
| 5 | 尾迹持续5s，伤害每秒7，减速25% |

### 🔥 进化技能

| 进化名 | 条件 | 效果 |
|--------|------|------|
| **龙太子化身** | 龙息尾迹Lv5 + 定海神珠（法器）Lv5 | 每60s白龙马化为龙形态10s，环绕唐僧喷射冰水吐息，大范围伤害+冰冻 |

---

## 七、法器系统（被动道具）

最多装备 **6个法器**，每个法器可升级至Lv5。

| 法器 | 基础效果 | 满级效果 | 可进化 |
|------|----------|----------|--------|
| **金钵盂** | 经验吸取范围+20% | 范围+100%，经验+15% | → 般若波罗蜜 |
| **锦斓袈裟** | 受伤减免5% | 减免25%+反弹10%伤害 | → 金身罗汉 |
| **九环锡杖** | 念经光环范围+15% | 范围+75%+光环伤害×2 | → 如来金身 |
| **通关文牒** | 关卡结束奖励+10% | 奖励+50%+额外法器选项 | → 金蝉子转世 |
| **人参果** | 每30s回复5HP | 每15s回复15HP | → 食神 |
| **蟠桃** | 最大HP+10 | 最大HP+50+受伤回复 | → 万猴朝宗 |
| **照妖镜** | 揭示隐身敌人 | 揭示+标记+伤害加成20% | → 通天神目 |
| **芭蕉扇** | 每15s击退周围敌人 | 每8s击退+造成伤害+减速 | → 天河水军 |
| **如意金箍** | 悟空攻击力+10% | 攻击力+50%+攻击范围+30% | → 齐天大圣 |
| **天蓬令牌** | 八戒攻速+10% | 攻速+50%+AoE范围+30% | → 天蓬真身 |
| **九骷髅串** | 沙僧穿透+1 | 穿透+5+每穿透伤害+15% | → 卷帘大将 |
| **紫金红葫芦** | 每20s吸附远处敌人到身边 | 每10s吸附+吸入伤害 | → 流沙天河 |
| **定海神珠** | 白龙马尾迹伤害+20% | 伤害+100%+冰冻效果 | → 龙太子化身 |
| **避火罩** | 免疫火焰地形伤害 | 免疫所有地形伤害+踩火回血 | — |
| **隐身帽** | 受伤后短暂隐身（敌人失去目标） | 隐身时间+长+隐身后首击双倍 | — |

---

## 八、技能组合策略

### 推荐Build：「钢铁唐僧」（防御型）

- 唐僧：金蝉护体Lv5 + 金光念经Lv5
- 沙僧：卷帘守护Lv5
- 法器：锦斓袈裟、人参果、蟠桃
- 进化目标：金身罗汉 + 食神
- 打法：堆血堆防，靠光环磨死敌人

### 推荐Build：「暴力猴群」（输出型）

- 悟空：金箍棒Lv5 + 分身术Lv5
- 唐僧：紧箍咒Lv5
- 法器：如意金箍、蟠桃、照妖镜
- 进化目标：齐天大圣 + 万猴朝宗
- 打法：猴群覆盖全屏，Boss阶段紧箍咒爆发

### 推荐Build：「流沙控场」（控制型）

- 沙僧：流沙陷阱Lv5 + 宝杖投掷Lv5
- 八戒：钉耙砸地Lv5
- 法器：紫金红葫芦、九骷髅串、芭蕉扇
- 进化目标：流沙天河 + 卷帘大将
- 打法：全场减速+穿透，敌人走不动

### 推荐Build：「飞驰白龙」（速刷型）

- 白龙马：龙行千里Lv5 + 龙珠聚灵Lv5 + 龙息尾迹Lv5
- 法器：定海神珠、金钵盂、通关文牒
- 进化目标：龙太子化身
- 打法：极速移动+尾迹伤害+高经验收益，适合刷关

---

## 九、技能获取时间线

| 游戏进度 | 解锁内容 |
|----------|----------|
| 第1关（长安送别） | 唐僧：金光念经Lv1 |
| 第9关（收悟空） | 孙悟空全技能池解锁 |
| 第12关（收白龙马） | 白龙马全被动池解锁 |
| 第18关（收八戒） | 猪八戒全技能池解锁 |
| 第21关（收沙僧） | 沙悟净全技能池解锁 |
| 第27关后 | 法器池全部解锁 |
| 第36关后 | 进化系统解锁 |

### 收徒前的过渡

- 第1-8关（唐僧独行）：只能升级唐僧心法+基础法器，极度考验走位
- 第10-17关（唐僧+悟空）：悟空技能+唐僧心法+法器
- 第19-20关（三人组）：加入八戒技能池
- 第22关起：全阵容，所有技能池开放

---

## 十、数值平衡原则

1. **唐僧独行期（1-8关）** 难度曲线最陡，但关卡时间短（2-3分钟），靠金光念经+走位存活
2. **悟空加入后** 输出质变，但敌人数量同步增加
3. **全员集结后** 进入正常的 Vampire Survivors 节奏
4. **进化系统** 是中后期的权力幻想（power fantasy），允许玩家感受到碾压
5. **Boss战** 需要特定策略，不能纯碾压，每个Boss至少有一个需要走位躲避的机制

---

## 十一、技能视觉特效提示词

### 资源目录

```
assets/
├── skills/
│   ├── icons/          # 技能图标（升级选择UI用）  1:1 | 256×256
│   ├── vfx/            # 技能特效sprite            1:1 | 512×512
│   └── items/          # 法器图标                   1:1 | 256×256
```

---

### 孙悟空技能特效

**金箍棒横扫** → `assets/skills/vfx/wukong_staff_sweep.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, golden staff sweep arc effect. A wide 150-degree
crescent-shaped golden energy slash trailing behind a swinging iron staff, with
sparkling golden particles and motion blur streaks. Transparent background (PNG),
cel-shaded style matching chibi game art, warm gold and orange palette, clean
outlines, suitable for overlay on game screen.
```

**分身术** → `assets/skills/vfx/wukong_clone.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, monkey hair clone summoning effect. Swirling golden
fur particles forming into a translucent golden monkey silhouette, magical sparkles
and cloud wisps around it. Transparent background (PNG), cel-shaded style, gold
and white palette, clean outlines.
```

**七十二变** → `assets/skills/vfx/wukong_transform.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, shapeshifting transformation burst effect. A radial
explosion of golden cloud smoke with swirling symbols and animal silhouettes
(bird, bee, dragon, ape) fading in and out. Transparent background (PNG),
cel-shaded style, vibrant gold with rainbow shimmer accents, clean outlines.
```

**火眼金睛** → `assets/skills/vfx/wukong_fireeyes.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, burning golden eye scan effect. Two piercing golden
fire-eye beams shooting forward in a V-shape, with flame particles and a circular
detection pulse ring expanding outward. Transparent background (PNG), cel-shaded
style, intense gold and red fire palette, clean outlines.
```

**齐天大圣（进化）** → `assets/skills/vfx/wukong_evo_dasheng.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, Great Sage Equal to Heaven ultimate effect. A massive
golden iron staff expanding and shrinking rapidly, leaving afterimages in a full
360-degree spin, surrounded by golden cloud explosion and celestial Chinese
characters glowing in the air. Transparent background (PNG), cel-shaded style,
epic gold and crimson palette, clean outlines.
```

---

### 猪八戒技能特效

**钉耙砸地** → `assets/skills/vfx/bajie_rake_slam.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, iron rake ground slam shockwave. A circular
crack pattern on the ground radiating outward from a central impact point,
with brown earth chunks flying up and dust cloud ring. Transparent background
(PNG), cel-shaded style, earth brown and grey palette, clean outlines.
```

**嘴拱冲锋** → `assets/skills/vfx/bajie_charge.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, pig headbutt charge trail effect. A horizontal
streak of dust and wind pressure with a snout-shaped shockwave at the front,
muddy ground trail behind. Transparent background (PNG), cel-shaded style,
brown and tan earth tones, clean outlines.
```

**天蓬觉醒** → `assets/skills/vfx/bajie_marshal.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, celestial marshal awakening aura. A vertical
pillar of blue-white celestial light with ancient Chinese armor silhouette
forming within, surrounded by swirling star particles and heavenly cloud
wisps. Transparent background (PNG), cel-shaded style, celestial blue and
silver palette, clean outlines.
```

**天河水军（进化）** → `assets/skills/vfx/bajie_evo_tsunami.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, Heavenly River tsunami wave effect. A massive
circular water wave expanding outward from center, with churning foam, water
droplets, and a giant spectral iron rake riding the wave crest. Transparent
background (PNG), cel-shaded style, deep blue and white water palette, clean
outlines.
```

---

### 沙悟净技能特效

**宝杖投掷** → `assets/skills/vfx/wujing_staff_throw.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, crescent-moon spade projectile trail. A spinning
crescent blade flying forward with a silver-blue energy trail, sand particles
swirling behind it. Transparent background (PNG), cel-shaded style, cool
silver-blue and sand palette, clean outlines.
```

**流沙陷阱** → `assets/skills/vfx/wujing_sand_trap.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, quicksand trap zone on ground. A circular area
of swirling sand with a dark vortex center pulling inward, sand grains
spiraling, subtle skull shapes visible in the sand. Transparent background
(PNG), cel-shaded style, desert tan and dark brown palette, clean outlines.
```

**卷帘守护** → `assets/skills/vfx/wujing_shield.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, scripture scroll barrier shield. A circular
protective dome made of floating Buddhist scripture scrolls orbiting around
a central point, with golden Sanskrit characters glowing on the scrolls,
faint blue energy connecting them. Transparent background (PNG), cel-shaded
style, parchment gold and blue energy palette, clean outlines.
```

**卷帘大将（进化）** → `assets/skills/vfx/wujing_evo_general.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, Curtain-Raising General ultimate effect. Nine
glowing skulls orbiting in a wide circle, each skull shooting a blue-silver
homing beam toward different targets, sand storm swirling around the
formation. Transparent background (PNG), cel-shaded style, eerie blue-silver
and bone-white palette, clean outlines.
```

---

### 唐僧技能特效

**金光念经** → `assets/skills/vfx/tangseng_chant_aura.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, golden Buddhist chanting aura. A soft circular
golden glow with floating Sanskrit characters (Om Mani Padme Hum) slowly
orbiting, gentle light rays emanating outward, peaceful but powerful holy
energy. Transparent background (PNG), cel-shaded style, warm gold and soft
white palette, clean outlines.
```

**紧箍咒** → `assets/skills/vfx/tangseng_headband_spell.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, golden headband tightening spell effect. A
glowing golden ring/halo constricting with visible pressure waves, red pain
sparks radiating from it, ancient Buddhist seal characters swirling around
the ring. Transparent background (PNG), cel-shaded style, gold and angry
red palette, clean outlines.
```

**大慈大悲** → `assets/skills/vfx/tangseng_mercy_purify.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, great compassion purification wave. A massive
expanding ring of pure white-gold holy light with lotus flower petals
scattering outward, Buddhist swastika symbol at center radiating peace,
all darkness dissolving at the wave front. Transparent background (PNG),
cel-shaded style, pure white and gold with lotus pink accents, clean outlines.
```

**金蝉护体** → `assets/skills/vfx/tangseng_cicada_shield.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, golden cicada death-prevention trigger. A
translucent golden cicada shell forming around a central point, cracking
with brilliant light beams shooting through the cracks, a brief moment of
invincibility visualized as a golden rebirth cocoon. Transparent background
(PNG), cel-shaded style, radiant gold and divine white palette, clean outlines.
```

**如来金身（进化）** → `assets/skills/vfx/tangseng_evo_buddha.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, Buddha's Golden Body ultimate aura. A full-screen
golden mandala pattern with concentric rings of Sanskrit text, lotus platforms
floating at cardinal points, serene golden light filling everything, a giant
translucent Buddha palm print visible in the background. Transparent background
(PNG), cel-shaded style, divine gold and lotus pink palette, clean outlines.
```

---

### 白龙马技能特效

**龙息尾迹** → `assets/skills/vfx/bailongma_frost_trail.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, ice dragon breath ground trail. A path of
frost and ice crystals on the ground with faint blue mist rising, small
snowflake particles, the trail has a flowing water-like shimmer. Transparent
background (PNG), cel-shaded style, icy blue and white palette, clean outlines.
```

**龙太子化身（进化）** → `assets/skills/vfx/bailongma_evo_dragon.png`

`1:1 | 512×512`
```
Top-down 2D game VFX sprite, White Dragon Prince transformation burst. An
explosion of ice-water energy with a coiling Eastern dragon silhouette
emerging from white mist, crystalline ice shards and water droplets flying
outward, a glowing dragon pearl at the center. Transparent background (PNG),
cel-shaded style, ethereal white-blue and silver palette, clean outlines.
```

---

### 法器图标提示词

所有法器图标统一风格：`1:1 | 256×256`

```
[通用前缀] 2D game item icon, [item name] from Journey to the West.
Centered on transparent background, detailed but clean cel-shaded style,
golden border frame with subtle Buddhist motif, warm lighting, suitable
for game UI inventory slot. 256x256 pixels.
```

| 法器 | 描述补充（替换 [item name] 后的部分） | 文件名 |
|------|------|------|
| 金钵盂 | A golden Buddhist alms bowl glowing with warm light, Sanskrit characters orbiting | `items/jinboyu.png` |
| 锦斓袈裟 | A magnificent folded crimson-gold kasaya robe radiating protective energy | `items/jialan_jiasha.png` |
| 九环锡杖 | A pewter monk staff with 9 jingling rings at top, holy light emanating | `items/jiuhuan_xizhang.png` |
| 通关文牒 | An ancient imperial travel scroll/passport with red seal stamps, golden glow | `items/tongguan_wendie.png` |
| 人参果 | A luminous baby-shaped fruit on a small branch, glowing with life energy, pink | `items/renshen_guo.png` |
| 蟠桃 | A large celestial peach with pink-golden glow, heavenly cloud wisps around it | `items/pantao.png` |
| 照妖镜 | An ornate bronze mirror with swirling demon-revealing energy in reflection | `items/zhaoyao_jing.png` |
| 芭蕉扇 | A large palm-leaf fan with wind energy swirls, green with golden trim | `items/bajiao_shan.png` |
| 如意金箍 | A golden circlet/headband crackling with power, size-changing visual | `items/ruyi_jingu.png` |
| 天蓬令牌 | A celestial jade military token with Marshal Tianpeng inscription, blue glow | `items/tianpeng_lingpai.png` |
| 九骷髅串 | A necklace of 9 small bleached skulls strung together, eerie blue glow | `items/jiukulou_chuan.png` |
| 紫金红葫芦 | A purple-gold gourd with red stopper, swirling suction vortex at opening | `items/zijin_hulu.png` |
| 定海神珠 | A luminous ice-blue pearl floating with frost mist and water energy | `items/dinghai_shenzhu.png` |
| 避火罩 | A translucent dome shield with fire-repelling runes, cool blue barrier | `items/bihuo_zhao.png` |
| 隐身帽 | A simple cloth cap that is half-transparent/fading, with stealth shimmer | `items/yinshen_mao.png` |

---

### 技能图标提示词

所有技能图标统一风格：`1:1 | 256×256`

```
[通用前缀] 2D game skill icon, [skill description]. Circular icon with
dark border ring, dynamic composition, cel-shaded style matching Journey
to the West fantasy theme. Transparent background, 256x256 pixels.
```

| 技能 | 角色 | 描述补充 | 文件名 |
|------|------|----------|--------|
| 金箍棒横扫 | 悟空 | Golden staff mid-sweep with arc slash energy trail | `icons/wukong_sweep.png` |
| 分身术 | 悟空 | Three golden monkey silhouettes overlapping, fur particles | `icons/wukong_clone.png` |
| 七十二变 | 悟空 | Swirling cloud with animal shapes morphing, golden mist | `icons/wukong_transform.png` |
| 火眼金睛 | 悟空 | Close-up of fierce golden burning eye with fire pupil | `icons/wukong_fireeyes.png` |
| 钉耙砸地 | 八戒 | Iron rake slamming ground with shockwave rings | `icons/bajie_slam.png` |
| 嘴拱冲锋 | 八戒 | Pig snout with charge wind streaks, dust cloud | `icons/bajie_charge.png` |
| 天蓬觉醒 | 八戒 | Celestial marshal armor silhouette in blue light | `icons/bajie_marshal.png` |
| 大肚能容 | 八戒 | Round belly with healing green glow and food icons | `icons/bajie_appetite.png` |
| 宝杖投掷 | 沙僧 | Crescent-moon spade spinning with silver trail | `icons/wujing_throw.png` |
| 流沙陷阱 | 沙僧 | Quicksand vortex spiral from above, dark center | `icons/wujing_sandtrap.png` |
| 卷帘守护 | 沙僧 | Floating scripture scrolls forming a shield circle | `icons/wujing_shield.png` |
| 通天河领域 | 沙僧 | Expanding water ripple ring with sand particles | `icons/wujing_domain.png` |
| 金光念经 | 唐僧 | Soft golden halo with floating Sanskrit text | `icons/tangseng_chant.png` |
| 紧箍咒 | 唐僧 | Tightening golden headband ring with pain sparks | `icons/tangseng_headband.png` |
| 大慈大悲 | 唐僧 | Lotus bloom with expanding purification light ring | `icons/tangseng_mercy.png` |
| 金蝉护体 | 唐僧 | Golden cicada shell with divine protection glow | `icons/tangseng_cicada.png` |
| 龙行千里 | 白龙马 | White horse hooves with speed streak lines | `icons/bailongma_speed.png` |
| 龙珠聚灵 | 白龙马 | Glowing pearl with XP orbs being attracted inward | `icons/bailongma_pearl.png` |
| 龙息尾迹 | 白龙马 | Ice-frost trail with snowflake particles | `icons/bailongma_trail.png` |
