import { UpgradeState } from "../config/GameConfig";

export interface RelicBuff {
  label: string;
  apply: (u: UpgradeState) => void;
}

export interface Relic {
  id: string;
  name: string;
  icon: string;
  buffs: RelicBuff[];
  bossName: string;
}

interface BuffTemplate {
  label: (v: number) => string;
  min: number;
  max: number;
  apply: (u: UpgradeState, v: number) => void;
}

const BUFF_POOL: BuffTemplate[] = [
  { label: v => `移速+${v}%`, min: 8, max: 20,
    apply: (u, v) => { u.playerSpeed = Math.round(u.playerSpeed * (1 + v / 100)); } },
  { label: v => `最大HP+${v}`, min: 15, max: 50,
    apply: (u, v) => { u.playerMaxHp += v; } },
  { label: v => `暴击率+${v}%`, min: 5, max: 15,
    apply: (u, v) => { u.critRate += v / 100; } },
  { label: v => `暴击伤害+${v}%`, min: 15, max: 40,
    apply: (u, v) => { u.critDmgMultiplier += v / 100; } },
  { label: v => `减伤${v}%`, min: 5, max: 15,
    apply: (u, v) => { u.damageMultiplier *= (1 - v / 100); } },
  { label: v => `经验吸取+${v}`, min: 20, max: 60,
    apply: (u, v) => { u.xpAttractRadius += v; } },
  { label: v => `Boss伤害+${v}%`, min: 10, max: 25,
    apply: (u, v) => { u.bossExtraDmg += v / 100; } },
  { label: v => `护盾+${v}`, min: 10, max: 30,
    apply: (u, v) => { u.shieldMax += v; } },
  { label: v => `击杀回血+${v}`, min: 1, max: 3,
    apply: (u, v) => { u.killHeal += v; } },
  { label: v => `光环范围+${v}`, min: 15, max: 40,
    apply: (u, v) => { u.auraRadius += v; } },
];

const BOSS_RELICS: Record<string, { name: string; icon: string }> = {
  "黑熊精":   { name: "黑风令",     icon: "item_zijin_hulu" },
  "黄风大王": { name: "定风珠",     icon: "item_jinboyu" },
  "白骨精":   { name: "白骨如意",   icon: "item_jiuhuan_xizhang" },
  "蜘蛛精":   { name: "蛛丝灵链",   icon: "item_jiukulou_chuan" },
  "金角大王": { name: "紫金红葫芦", icon: "item_zijin_hulu" },
  "红孩儿":   { name: "三昧火珠",   icon: "item_bihuo_zhao" },
};

export class BossLootSystem {
  private relics: Relic[] = [];

  generateRelic(bossName: string): Relic {
    const template = BOSS_RELICS[bossName] ?? { name: "妖怪遗宝", icon: "item_zhaoyao_jing" };

    const buffCount = Math.random() < 0.3 ? 3 : 2;
    const indices = this.pickRandom(BUFF_POOL.length, buffCount);
    const buffs: RelicBuff[] = indices.map(i => {
      const t = BUFF_POOL[i];
      const v = Math.round(t.min + Math.random() * (t.max - t.min));
      return { label: t.label(v), apply: (u: UpgradeState) => t.apply(u, v) };
    });

    const relic: Relic = {
      id: `relic_${Date.now()}`,
      name: template.name,
      icon: template.icon,
      buffs,
      bossName,
    };
    this.relics.push(relic);
    return relic;
  }

  applyRelic(relic: Relic, upgrades: UpgradeState) {
    for (const buff of relic.buffs) buff.apply(upgrades);
  }

  getRelics(): Relic[] {
    return this.relics;
  }

  private pickRandom(poolSize: number, count: number): number[] {
    const result: number[] = [];
    while (result.length < count) {
      const idx = Math.floor(Math.random() * poolSize);
      if (!result.includes(idx)) result.push(idx);
    }
    return result;
  }
}
