import Phaser from "phaser";
import { SKILL_HERO } from "../config/GameConfig";

interface SkillEntry {
  nameText: Phaser.GameObjects.Text;
  lvText: Phaser.GameObjects.Text;
}

const HERO_ORDER = ["悟空", "八戒", "沙僧", "唐僧", "白龙马", "通用"];
const HERO_COLORS: Record<string, string> = {
  "悟空": "#ff9900", "八戒": "#88cc44", "沙僧": "#4488ff",
  "唐僧": "#ffdd44", "白龙马": "#cccccc", "通用": "#cc88ff",
};

export class SkillBar {
  private scene: Phaser.Scene;
  private entries = new Map<string, SkillEntry>();
  private levels = new Map<string, number>();
  private heroGroups = new Map<string, string[]>();
  private allElements: Phaser.GameObjects.GameObject[] = [];
  private bg?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addOrUpgrade(id: string, _icon: string, name: string) {
    const lv = (this.levels.get(id) ?? 0) + 1;
    this.levels.set(id, lv);

    const existing = this.entries.get(id);
    if (existing) {
      existing.lvText.setText(`${lv}`);
      this.scene.tweens.add({ targets: existing.nameText, scaleX: 1.15, scaleY: 1.15, duration: 80, yoyo: true });
      return;
    }

    const hero = SKILL_HERO[id];
    const heroName = hero?.name ?? "通用";
    if (!this.heroGroups.has(heroName)) this.heroGroups.set(heroName, []);
    this.heroGroups.get(heroName)!.push(id);

    this.entries.set(id, { nameText: null!, lvText: null! });
    this.rebuild();
  }

  private rebuild() {
    for (const el of this.allElements) el.destroy();
    this.allElements = [];
    if (this.bg) { this.bg.destroy(); this.bg = undefined; }

    const depth = 910;
    const x = 8;
    let y = 50;
    let maxW = 0;

    for (const heroName of HERO_ORDER) {
      const ids = this.heroGroups.get(heroName);
      if (!ids || ids.length === 0) continue;
      const color = HERO_COLORS[heroName] ?? "#aaaaaa";

      const header = this.scene.add.text(x, y, `【${heroName}】`, {
        fontSize: "10px", color, fontStyle: "bold",
        stroke: "#000000", strokeThickness: 2,
      }).setScrollFactor(0).setDepth(depth + 1);
      this.allElements.push(header);
      y += 16;

      for (const id of ids) {
        const hero = SKILL_HERO[id];
        const lv = this.levels.get(id) ?? 1;
        const skillName = this.getSkillName(id);

        const nt = this.scene.add.text(x + 4, y, skillName, {
          fontSize: "10px", color: "#dddddd",
          stroke: "#000000", strokeThickness: 2,
        }).setScrollFactor(0).setDepth(depth + 1);

        const lt = this.scene.add.text(x + 4 + nt.width + 4, y, `${lv}`, {
          fontSize: "10px", color: hero?.colorStr ?? "#aaaaaa", fontStyle: "bold",
          stroke: "#000000", strokeThickness: 2,
        }).setScrollFactor(0).setDepth(depth + 1);

        const entry = this.entries.get(id)!;
        entry.nameText = nt;
        entry.lvText = lt;
        this.allElements.push(nt, lt);

        maxW = Math.max(maxW, nt.width + lt.width + 12);
        y += 15;
      }
      y += 4;
    }

    this.bg = this.scene.add.graphics().setScrollFactor(0).setDepth(depth - 1);
    this.bg.fillStyle(0x000000, 0.5);
    this.bg.fillRoundedRect(4, 44, maxW + 12, y - 44 + 4, 6);
    this.allElements.push(this.bg);
  }

  private skillNames: Record<string, string> = {
    wukong_dmg: "棒强化", wukong_range: "棒千军", wukong_speed: "疾风棒",
    clone: "分身术", crit: "火眼金睛",
    bajie_aoe: "钉耙", kill_heal: "大肚容",
    wujing_proj: "宝杖", shield: "卷帘护",
    aura: "金光经", death_save: "金蝉护",
    player_hp: "金刚体", player_speed: "草上飞",
    xp_range: "金钵盂", dmg_reduce: "袈裟",
    regen: "人参果",
    foguang: "佛光", jianbu: "健步", jinguang: "金光", bore: "般若",
    headband: "紧箍咒", mercy: "大慈悲", trail: "龙息",
    wukong_ult: "大圣蓄力", bajie_ult: "天蓬蓄力", wujing_ult: "卷帘蓄力", bailongma_ult: "化龙蓄力",
    evo_dasheng: "齐天大圣", evo_wanhou: "万猴朝宗", evo_shishen: "食神",
    evo_jinshen: "金身罗汉", evo_shenmu: "通天神目",
  };

  private getSkillName(id: string): string {
    return this.skillNames[id] ?? id;
  }

  getLevel(id: string): number { return this.levels.get(id) ?? 0; }
}
