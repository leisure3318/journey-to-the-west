import { UpgradeState } from "./UpgradeConfig";

export interface EvolutionRecipe {
  id: string;
  name: string;
  hero: string;
  skillA: string;
  skillB: string;
  desc: string;
  color: string;
  vfxKey: string;
  apply: (s: UpgradeState) => void;
}

export const EVOLUTIONS: EvolutionRecipe[] = [
  {
    id: "evo_dasheng", name: "齐天大圣", hero: "悟空",
    skillA: "wukong_dmg", skillB: "wukong_range",
    desc: "金箍棒自如变化，伤害×2，范围×1.5",
    color: "#ff9900", vfxKey: "vfx_wukong_evo_dasheng",
    apply: (s) => { s.wukongDamage = Math.round(s.wukongDamage * 2); s.wukongRange = Math.round(s.wukongRange * 1.5); },
  },
  {
    id: "evo_wanhou", name: "万猴朝宗", hero: "悟空",
    skillA: "clone", skillB: "player_hp",
    desc: "六猴齐出，满伤害永久分身",
    color: "#ffaa00", vfxKey: "vfx_wukong_clone",
    apply: (s) => { s.cloneCount = 6; s.cloneDmgRatio = 1.0; },
  },
  {
    id: "evo_shishen", name: "食神", hero: "八戒",
    skillA: "kill_heal", skillB: "regen",
    desc: "击杀回5HP，回复效果翻倍",
    color: "#88cc44", vfxKey: "vfx_bajie_marshal",
    apply: (s) => { s.killHeal = Math.max(s.killHeal, 5); s.regenPerTick = Math.round(s.regenPerTick * 2); },
  },
  {
    id: "evo_jinshen", name: "金身罗汉", hero: "沙僧",
    skillA: "shield", skillB: "dmg_reduce",
    desc: "金身护盾每5秒自动回复，减伤叠加",
    color: "#4488ff", vfxKey: "vfx_wujing_shield",
    apply: (s) => { s.shieldMax = Math.round(s.shieldMax * 1.5); s.shieldHp = s.shieldMax; s.damageMultiplier *= 0.8; },
  },
  {
    id: "evo_shenmu", name: "通天神目", hero: "悟空",
    skillA: "crit", skillB: "wukong_speed",
    desc: "火眼通天，暴击率50%，Boss伤害+50%",
    color: "#ff4400", vfxKey: "vfx_wukong_fireeyes",
    apply: (s) => { s.critRate = 0.5; s.bossExtraDmg += 0.5; s.critDmgMultiplier = 2.5; },
  },
];
