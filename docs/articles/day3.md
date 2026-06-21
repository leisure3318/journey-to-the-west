# 小白用Claude、GPT Image 2做一款游戏:《西天取经》[AI Coding 实战第三天]

> 系列：「零基础用AI做游戏」
> 第一天：[从零开始，AI帮我画了119张游戏素材](https://mp.weixin.qq.com/s/JsK1kH8ZldzvwnIEKJ0img)
> 第二天：[一天写出完整的吸血鬼幸存者核心玩法](https://mp.weixin.qq.com/s/ioHKVoApHQ5Sw0XPwmy_yQ)

---

前两天搞定了119张素材和核心玩法，游戏能跑了但问题不少：Boss一刀就死、升了护盾技能没任何效果、技能特效根本没加载、首页丑得不忍直视。

今天的目标：**修Bug、加特效、做美化、部署上线。**

## 一、技能VFX特效全部接入

Day 1生成了19张技能VFX特效图（火眼金睛、钉耙横扫、沙暴陷阱...），但一直躺在assets目录里没用上。今天把它们全部接入游戏。

BootScene里加载13张VFX贴图：

```ts
const vfxFiles = [
  "wukong_staff_sweep", "wukong_clone", "wukong_fireeyes",
  "bajie_rake_slam", "bajie_charge", "bajie_marshal",
  "wujing_staff_throw", "wujing_shield", "wujing_sand_trap",
  "tangseng_chant_aura", "tangseng_cicada_shield", "tangseng_headband_spell",
  "bailongma_frost_trail",
];
```

效果：悟空暴击时闪火眼金睛特效、八戒冲锋Boss时有冲锋波、沙僧护盾被打碎有破碎光效。

**坑1：VFX没加载直接崩**

加了悟空暴击系统后，触发暴击的瞬间游戏直接白屏。报错：`Texture "vfx_wukong_fireeyes" not found`。

原因很蠢——DiscipleManager里用了这个贴图，但BootScene的VFX加载列表里漏了。之前只有8张VFX，补到13张才对齐。

**教训：每加一个贴图引用，必须同步更新BootScene的加载列表。**

## 二、护盾系统：从废技能到真能挡伤害

升级选了「沙僧护盾」——加了个蓝色护盾值，但挨打扣的还是HP。检查代码发现：`UpgradeState`里确实有`shieldHp`和`shieldMax`字段，`apply()`也在正确累加值，但Player的`takeDamage()`完全没读这两个字段。

**修之前的逻辑：**
```
takeDamage(amount) → 直接扣HP
```

**修之后：**
```
takeDamage(amount) →
  if 有护盾 → 护盾先扣 → 溢出伤害扣HP → 播放护盾受击特效
  else → 直接扣HP
```

加了视觉反馈：护盾存在时唐僧脚下有蓝色半透明圆环，透明度随护盾剩余量变化。护盾被击中时闪一下`vfx_wujing_shield`的破碎特效。

```ts
updateShieldVisual() {
  if (this.shieldHp <= 0) {
    this.shieldGfx?.setVisible(false);
    return;
  }
  if (!this.shieldGfx) {
    this.shieldGfx = this.scene.add.circle(this.x, this.y, 24, 0x4488ff, 0.3);
  }
  this.shieldGfx.setPosition(this.x, this.y).setVisible(true);
  this.shieldGfx.setAlpha(0.15 + 0.2 * (this.shieldHp / this.shieldMax));
}
```

同样的问题还有**Boss额外伤害**——暴击升级累加了`bossExtraDmg`倍率，但BossSystem的`checkDamage()`根本没乘这个系数。一行修复：

```ts
const dmg = Math.round(damage * (1 + this.bossExtraDmg));
```

**这类Bug的规律：AI写代码时很擅长创建数据结构和累加逻辑，但经常漏掉"在实际伤害计算时读取这个值"这一步。你得自己验证整条数据流。**

## 三、Boss大改：从秒杀到硬仗

之前Boss的数值：黄风怪HP 500，伤害10。悟空一套连招下去直接秒了，毫无Boss体验。

重新调数值：

| Boss | 调整前HP | 调整后HP | 伤害 | 速度 |
|------|---------|---------|------|------|
| 黄风大王 | 500 | 3000 | 18 | 80 |
| 白骨精 | 800 | 5000 | 22 | 85 |
| 红孩儿 | 1200 | 8000 | 30 | 95 |

Boss触发圈也从140扩大到250——之前的问题是你都走到Boss脸上了才触发战斗，完全没有"远远看到Boss"的紧张感。

现在黄风怪至少得打30秒，红孩儿不升几级真打不过。终于有点"Boss战"的感觉了。

## 四、技能栏：你到底学了什么

吸血鬼幸存者的核心体验之一：看着自己的Build越来越强。但之前升了什么技能、各几级，完全没有地方看。

新增`SkillBar`组件，固定在屏幕左侧：

- 每获得一个新技能，图标（28×28）加入栏位
- 右下角显示等级数字（金色描边）
- 升级时图标放大闪烁动画
- 半透明黑底随技能数量自动增长

```ts
addOrUpgrade(id: string, icon: string, name: string) {
  const lv = (this.levels.get(id) ?? 0) + 1;
  this.levels.set(id, lv);
  const existing = this.slots.get(id);
  if (existing) {
    existing.lvText.setText(`${lv}`);
    this.flashSlot(existing);  // 升级闪烁
    return;
  }
  // 新技能：创建图标+等级文字
  const idx = this.slots.size;
  const img = this.scene.add.image(22, 60 + idx * 38, icon)
    .setDisplaySize(28, 28).setScrollFactor(0);
  // ...
}
```

整个文件65行，简洁有效。

## 五、首页改造：GPT Image 2生成山水画背景

之前的首页是程序化绘制的——渐变天空+三角形山脉剪影。能用，但寒碜。

用GPT Image 2生成了一张1536×1024的首页背景：

**Prompt：**
> Epic Journey to the West landscape, ancient Chinese stone path winding through misty mountains with waterfalls, golden sunset sky, distant Buddhist temple on hilltop, full moon rising, ethereal atmosphere with clouds, cinematic game art style

效果惊艳——石板古道蜿蜒入远方，瀑布飞流，远处山巅有佛塔，金色夕阳配满月。一张图直接把首页档次拉上来了。

![menu_bg](../../assets/menu_bg.png)

然后让师徒四人沿着背景里的石板路行走：

```ts
const PATH_POINTS = [
  { x: 490, y: 585 }, { x: 520, y: 510 }, { x: 555, y: 430 },
  { x: 585, y: 355 }, { x: 610, y: 285 }, { x: 635, y: 215 },
];
```

加上**透视缩放**——角色越往远处走越小（`perspScale = 1 - t * 0.55`），走到头循环回来，有种"西天路漫漫"的意境。

**坑2：角色方向乱了**

四个角色走在路上，有的朝前有的朝后，非常诡异。

根因：sprite sheet的行映射是反的。代码定义`["down", "right", "up", "left"]`，但实际上Row 0是正面、Row 2是背面。所以`_up_walk`显示的是正面，`_down_walk`显示的是背面。

最终方案：统一用`_right_walk`动画——路是向右上方延伸的，侧面行走最自然，也避开了上下方向的映射混乱。

## 六、部署到GitHub Pages

游戏做到这个程度，该让别人也能玩了。

### GitHub Actions自动部署

写了个workflow，push到main自动构建部署：

```yaml
- run: rm -f package-lock.json && npm install
- run: npx parcel build index.html --dist-dir dist --public-url /journey-to-the-west/
- uses: actions/upload-pages-artifact@v3
  with:
    path: dist
- uses: actions/deploy-pages@v4
```

**坑3：CI反复失败，搞了5轮**

| 轮次 | 问题 | 解决 |
|------|------|------|
| 1 | `npm ci`报lock文件不匹配 | 改用`npm install` |
| 2 | Parcel原生绑定macOS/Linux不兼容 | `rm -f package-lock.json`重装 |
| 3 | 4个源文件没提交（FogOfWar/LandmarkSystem/RecruitmentSystem/MiniMap） | `git add`补上 |
| 4 | 2张CG图+骑马唐僧sprite没提交 | `git add`补上 |
| 5 | 终于成功 ✓ | — |

**教训：本地能跑≠CI能过。每次新增文件，提交前跑一遍`git status`确认没有untracked的源文件。**

部署成功后，游戏地址：**https://leisure3318.github.io/journey-to-the-west/**

打开浏览器就能玩，不用装任何东西。

## 七、今天的代码改动总览

| 文件 | 改动内容 |
|------|----------|
| BootScene.ts | VFX加载从8张补到13张 + menu_bg加载 |
| Player.ts | 护盾吸伤 + 蓝色光环视觉 + 受击特效 |
| BossSystem.ts | Boss额外伤害倍率生效 |
| MapConfig.ts | Boss HP×5、触发圈140→250 |
| DiscipleManager.ts | 八戒冲锋VFX + 暴击火眼金睛特效 |
| SkillBar.ts | 新文件，技能栏UI（65行） |
| MenuScene.ts | AI背景图 + 师徒沿路行走 + 透视缩放 |
| GameScene.ts | 集成SkillBar + 护盾/Boss伤害同步 |
| deploy.yml | GitHub Actions自动部署 |

## 踩坑总结

今天踩的坑比前两天多，分两类：

**代码逻辑坑（AI容易犯的）：**
- 数据结构建了但没在计算时使用（护盾、Boss伤害倍率）
- 资源引用了但没在加载列表注册（VFX贴图）

**部署运维坑：**
- macOS的lock文件在Linux CI上不兼容
- 新文件只import了没git add
- 静态资源路径需要`--public-url`对齐部署子路径

**一个感受：AI写代码的速度很快，但它不会主动验证"写的代码有没有真正生效"。你得自己测每条数据流——从配置到累加到最终计算，中间任何一环断了，功能就是废的。**

## 三天总结

| | Day 1 | Day 2 | Day 3 |
|---|---|---|---|
| 主题 | 素材生成 | 核心玩法 | 打磨+部署 |
| 产出 | 3文档+119张图 | 20个源文件+可玩demo | VFX+护盾+Boss+技能栏+上线 |
| 关键工具 | GPT Image 2 | Claude + Phaser 4 | Claude + GPT Image 2 + GitHub Actions |
| 踩坑数 | 4 | 5 | 5 |

三天时间，从一个"西游记打怪"的想法，到一个有迷雾探索、收徒系统、三个Boss、19种技能特效、可在线游玩的完整游戏。

现在可以直接打开玩了：**https://leisure3318.github.io/journey-to-the-west/**

WASD移动，ESC暂停，一个人在西天路上能走多远？

---

> 第一天：[从零开始，AI帮我画了119张游戏素材](https://mp.weixin.qq.com/s/JsK1kH8ZldzvwnIEKJ0img)
> 第二天：[一天写出完整的吸血鬼幸存者核心玩法](https://mp.weixin.qq.com/s/ioHKVoApHQ5Sw0XPwmy_yQ)
