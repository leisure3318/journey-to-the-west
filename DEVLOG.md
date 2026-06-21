# 开发日志 (Dev Log)

> 「小白用AI做游戏」系列文章的进度追踪，每天更新。
> 供下一篇文章回顾前一天进度，避免内容重复。

---

## 系列文章信息

| 项目 | 说明 |
|------|------|
| 系列名 | 零基础用AI做游戏 |
| 游戏名 | 西天取经 |
| GitHub | journey-to-the-west |
| 在线地址 | https://leisure3318.github.io/journey-to-the-west/ |
| 封面图 | `assets/series/cover.png`（全系列统一） |

---

## Day 1 — 2026-06-17

**标题：** 零基础用AI做游戏，第一天就搞出100多张图？我都经历了什么

**完成事项：**
- [x] 游戏创意确定：西游记 × 吸血鬼幸存者
- [x] GAME_DESIGN.md — 完整游戏设计文档（600+行，81关、5角色、Boss机制）
- [x] SKILL_SYSTEM.md — 技能系统文档（400+行，20技能+进化+15法器）
- [x] ENEMY_DESIGN.md — 妖怪设计文档（800+行，30小怪+28Boss+数值公式）
- [x] 5个英雄 sprite sheet 生成 + 自动切图脚本（slice_sprites_v3.py）
- [x] 4张角色肖像
- [x] 52张技能图片（VFX特效19+技能图标19+法器图标15）
- [x] 58张敌人图片（30小怪+28Boss）
- [x] HTML5 Canvas walking demo（5角色走动）
- [x] 公众号第一篇发布

**已有资产统计：119张图片资产 + 3份设计文档**

---

## Day 2 — 2026-06-18

**标题：** 零基础用AI做游戏Day2：一天写出完整的吸血鬼幸存者核心玩法

**完成事项：**
- [x] 项目模块化重构（config/entities/systems/ui 四层架构）
- [x] 唐僧移动（WASD + 方向键 + 鼠标点击）
- [x] 悟空环绕自动攻击（120°扇形近战）
- [x] 八戒钉耙攻击（360° AoE + 击退）
- [x] 沙僧宝杖投射（远程自动瞄准）
- [x] 小怪生成系统（4阶段密度递增，5种敌人）
- [x] 3种敌人行为（chase/ranged/explosive）
- [x] 碰撞检测 + 伤害系统 + 无敌帧
- [x] 经验珠掉落 + 磁吸吸附 + 等级系统
- [x] 升级3选1面板（16种升级选项）
- [x] HUD（HP条/XP条/计时器/击杀数/等级/波次）
- [x] 游戏结束画面 + ESC暂停菜单
- [x] 大地图（3200×2400）+ 滚动摄像机
- [x] 程序化草地背景 + 地图装饰物
- [x] 伤害飘字 + 敌人血条 + 受伤震屏
- [x] 公众号第二篇发布

---

## Day 3 — 2026-06-19

**标题：** 小白用Claude、GPT Image 2做一款游戏:《西天取经》[AI Coding 实战第三天]

**完成事项：**
- [x] 19张VFX特效全部接入
- [x] 护盾系统修复（沙僧卷帘守护真正吸伤）
- [x] Boss系统（3个Boss：黄风大王/白骨精/红孩儿）
- [x] Boss数值重做（HP×5, 触发圈140→250）
- [x] 技能栏UI（左侧图标+等级）
- [x] GPT Image 2生成山水画首页 + 师徒行走动画
- [x] 序幕CG（4页贞观十三年剧情）
- [x] 收徒系统（五指山/高老庄/流沙河POI）
- [x] 迷雾探索 + 小地图
- [x] GitHub Actions自动部署到GitHub Pages
- [x] 公众号第三篇发布

---

## Day 4 — 2026-06-20

**标题：** 小白用Claude、GPT Image 2做一款游戏:《西天取经》[AI Coding 实战第四天]

**完成事项：**
- [x] 游戏名改为"西天取经"
- [x] Boss战修复：防重复死亡、清理物理碰撞器、全局错误捕获
- [x] 徒弟自主战斗AI：悟空/八戒/沙僧各有独立状态机（WukongAI/BajieAI/WujingAI）
- [x] 徒弟能直接攻击Boss（tryAttackTarget + moveToward + boss.checkDamage）
- [x] 大招系统：Boss战每20秒触发（齐天大圣/天蓬元帅/卷帘大将）
- [x] 沙僧技能丰富化：流沙陷阱+水幕天华+降妖宝杖回旋
- [x] Boss战唐僧骑马：自动上马+60移速，白龙马隐藏，Boss死后下马恢复
- [x] 暴击系统优化：橙色伤害数字+尺寸区分暴击+全员暴击（基础暴击率10%）
- [x] 唐僧受伤红色飘字（大伤害≥20更红更大）
- [x] 技能栏改为文字按人物分组（【悟空】【八戒】【沙僧】【唐僧】【通用】）
- [x] 升级面板显示角色归属标签（彩色角色名）
- [x] 经验珠视觉升级：多层发光+呼吸脉冲+精英金色
- [x] 图片压缩：270MB→15MB（sips批量缩放，scale值同步调整）
- [x] 全局错误捕获：DOM红色横条显示未捕获异常
- [x] 技能进化系统：5个进化配方（齐天大圣/万猴朝宗/食神/金身罗汉/通天神目）
- [x] 加载进度条（48MB资源）
- [x] **代码重构**：
  - DiscipleManager 562→207行（拆分UltimateSystem/WujingAbilities/CloneSystem）
  - GameConfig 225→24行（拆分HeroConfig/EnemyConfig/UpgradeConfig）
- [x] CLAUDE.md + DEVLOG.md 更新至最新状态
- [x] 公众号第四篇发布

**代码架构（重构后）：**
- 37个TypeScript源文件
- config层5个（GameConfig/HeroConfig/EnemyConfig/UpgradeConfig/EvolutionConfig + MapConfig）
- entities层4个（Player/Disciple/Boss/Enemy）
- systems层15个（DiscipleManager + 3个AI + 3个子系统 + EvolutionSystem + 7个独立系统）
- ui层8个
- scenes层4个

**未开始的事项：**
- [ ] 唐僧主动技能（紧箍咒、慈悲心）
- [ ] 白龙马能力（龙息、化龙）
- [ ] 更多敌人行为（召唤型、环境型、精英标识）
- [ ] 章节关卡制（81难分章节，难度递增）
- [ ] 音效/BGM

---

## Day 5 — 2026-06-21

**完成事项：**
- [x] 白龙马龙息尾迹（DragonTrail系统，移动时留火焰伤害区域，5级升级）
- [x] 宝箱系统（ChestSystem，每局8-12个，避开POI生成，15种物品3tier掉落）
- [x] 底部物品栏（ItemBar，最多9格，数字键/点击使用，同类物品堆叠×N显示）
- [x] 小地图显示未开启宝箱（橙色方块，仅揭雾区域）
- [x] 程序化音效系统（SoundManager，25种音效，Web Audio API生成，无外部音频文件）
  - BGM：五声音阶随机旋律（游戏）/ 空灵慢速（菜单）
  - 战斗：敌人受击/死亡、玩家受伤、爆炸、护盾
  - 技能：升级、选技能、进化、紧箍咒、大慈悲、大招
  - 事件：收徒、骑马、宝箱、物品使用、波次变化
  - 状态：回血、低血量警告、死亡保护、游戏结束、通关
  - UI：菜单点击、暂停/恢复、打字机、翻页
  - M键静音切换
- [x] 大招特效全面升级
  - 通用Banner：屏幕闪光+黑底展开+10粒子爆发+"大招发动"副标题
  - 齐天大圣：金色扩散光环+每击火花+终结冲击环+屏幕震荡
  - 天蓬元帅：绿色聚气→收缩+尘土扬起+3层冲击环+8碎石碎片
  - 卷帘大将：蓝色旋涡底圈+水泡上浮+周期震动
- [x] 大招充能机制改版：平时积累能量，Boss出现时自动释放已满的大招
- [x] CLAUDE.md全面重写：架构概览、核心设计模式、UI布局图、新系统指南
- [x] TODO.md更新至Day5
- [x] 白龙马剧情修正：开局棕色凡马→鹰愁涧收徒→白龙马化身（VFX：红光→蓝白闪光+龙鳞粒子）
- [x] 白龙马化龙大招（龙太子化龙：冲锋→龙息爆炸+6次灼烧）
- [x] 每人独立大招冷却升级（4个新升级选项，-3秒/级，最多3级，最低8秒）
- [x] SkillBar中文化修复（大圣蓄力/天蓬蓄力/卷帘蓄力/化龙蓄力）
- [x] ItemBar固定9格修复（使用后不窜位，空格始终可见）
- [x] 清理代码中硬编码的第三方API URL（改为环境变量读取）

**代码变更统计：**
- 新增文件5个：SoundManager.ts(348行), ChestSystem.ts(199行), DragonTrail.ts(102行), ItemBar.ts(146行), docs/CHEST_SYSTEM.md
- 修改文件17个：GameScene.ts, BootScene.ts, MiniMap.ts, SkillBar.ts, UpgradeConfig.ts, UltimateSystem.ts, DiscipleManager.ts, TangsengSkills.ts, EvolutionSystem.ts, EnemySpawner.ts, ExperienceSystem.ts, PauseMenu.ts, MenuScene.ts, CutsceneScene.ts, MapConfig.ts, generate_image.py×3
- 总代码量：44个TypeScript文件，~18000行

**未开始的事项：**
- [ ] 更多敌人行为（召唤型、环境型、精英标识）
- [ ] 章节关卡制
- [ ] 设置面板（音量调节）

---

<!-- 
模板（复制到下方新增）：

## Day N — YYYY-MM-DD

**标题：** 

**完成事项：**
- [ ] 

**未开始的事项：**
- [ ] 

-->
