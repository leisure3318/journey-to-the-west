import { WUKONG, BAJIE } from "./HeroConfig";
import { PLAYER, XP } from "./GameConfig";

export interface UpgradeState {
  wukongDamage: number;
  wukongRange: number;
  wukongCooldown: number;
  playerMaxHp: number;
  playerSpeed: number;
  xpAttractRadius: number;
  damageMultiplier: number;
  regenPerTick: number;
  cloneCount: number;
  cloneDmgRatio: number;
  critRate: number;
  critDmgMultiplier: number;
  bossExtraDmg: number;
  killHeal: number;
  bajieAoeRadius: number;
  bajieCooldown: number;
  wujingProjCount: number;
  wujingPierceBonus: number;
  shieldHp: number;
  shieldMax: number;
  auraRadius: number;
  auraDps: number;
  auraSlow: number;
  deathSaves: number;
  headbandLevel: number;
  mercyLevel: number;
  trailLevel: number;
  wukongUltCd: number;
  bajieUltCd: number;
  wujingUltCd: number;
  bailongmaUltCd: number;
}

export interface UpgradeOption {
  id: string;
  name: string;
  desc: string;
  icon: string;
  maxLevel: number;
  apply: (s: UpgradeState) => void;
}

export const UPGRADES: UpgradeOption[] = [
  { id: "wukong_dmg", name: "金箍棒强化", desc: "悟空攻击力+5", icon: "icon_wukong_sweep", maxLevel: 5, apply: (s) => { s.wukongDamage += 5; } },
  { id: "wukong_range", name: "棒扫千军", desc: "攻击范围+20", icon: "icon_wukong_sweep", maxLevel: 5, apply: (s) => { s.wukongRange += 20; } },
  { id: "wukong_speed", name: "疾风棒", desc: "攻击冷却-150ms", icon: "icon_wukong_sweep", maxLevel: 5, apply: (s) => { s.wukongCooldown = Math.max(300, s.wukongCooldown - 150); } },
  { id: "clone", name: "分身术", desc: "悟空分身+1，50%伤害", icon: "icon_wukong_clone", maxLevel: 3, apply: (s) => { s.cloneCount += 1; s.cloneDmgRatio = Math.min(1, s.cloneDmgRatio + 0.1); } },
  { id: "crit", name: "火眼金睛", desc: "暴击率+5%，Boss额外伤害+10%", icon: "icon_wukong_fireeyes", maxLevel: 5, apply: (s) => { s.critRate += 0.05; s.bossExtraDmg += 0.1; } },
  { id: "bajie_aoe", name: "九齿钉耙", desc: "八戒范围+15，冷却-200ms", icon: "icon_bajie_slam", maxLevel: 5, apply: (s) => { s.bajieAoeRadius += 15; s.bajieCooldown = Math.max(800, s.bajieCooldown - 200); } },
  { id: "kill_heal", name: "大肚能容", desc: "击杀回复2HP", icon: "icon_bajie_appetite", maxLevel: 5, apply: (s) => { s.killHeal += 2; } },
  { id: "wujing_proj", name: "降妖宝杖", desc: "沙僧投射+1，穿透伤害+10%", icon: "icon_wujing_throw", maxLevel: 3, apply: (s) => { s.wujingProjCount += 1; s.wujingPierceBonus += 0.1; } },
  { id: "shield", name: "卷帘守护", desc: "经卷屏障吸收20伤害", icon: "icon_wujing_shield", maxLevel: 5, apply: (s) => { s.shieldMax += 20; s.shieldHp += 20; } },
  { id: "aura", name: "金光念经", desc: "光环半径+20，减速+5%", icon: "icon_tangseng_chant", maxLevel: 5, apply: (s) => { s.auraRadius += 20; s.auraSlow += 0.05; s.auraDps += 1; } },
  { id: "death_save", name: "金蝉护体", desc: "致死保护+1次", icon: "icon_tangseng_cicada", maxLevel: 3, apply: (s) => { s.deathSaves += 1; } },
  { id: "player_hp", name: "金刚不坏", desc: "最大生命+20", icon: "item_pantao", maxLevel: 5, apply: (s) => { s.playerMaxHp += 20; } },
  { id: "player_speed", name: "草上飞", desc: "移动速度+15", icon: "icon_bailongma_speed", maxLevel: 5, apply: (s) => { s.playerSpeed += 15; } },
  { id: "xp_range", name: "金钵盂", desc: "经验吸取范围+30", icon: "item_jinboyu", maxLevel: 5, apply: (s) => { s.xpAttractRadius += 30; } },
  { id: "dmg_reduce", name: "锦斓袈裟", desc: "受伤减免10%", icon: "item_jialan_jiasha", maxLevel: 5, apply: (s) => { s.damageMultiplier *= 0.9; } },
  { id: "regen", name: "人参果", desc: "每5秒回复5HP", icon: "item_renshen_guo", maxLevel: 3, apply: (s) => { s.regenPerTick += 5; } },
  { id: "headband", name: "紧箍咒", desc: "念咒强化悟空攻击", icon: "icon_tangseng_headband", maxLevel: 5, apply: (s) => { s.headbandLevel += 1; } },
  { id: "mercy", name: "大慈大悲", desc: "慈悲值满后全屏净化", icon: "icon_tangseng_mercy", maxLevel: 5, apply: (s) => { s.mercyLevel += 1; } },
  { id: "trail", name: "龙息尾迹", desc: "移动时留下龙息伤害区域", icon: "icon_bailongma_trail", maxLevel: 5, apply: (s) => { s.trailLevel += 1; } },
  { id: "wukong_ult", name: "大圣蓄力", desc: "齐天大圣冷却-3秒", icon: "vfx_wukong_clone", maxLevel: 3, apply: (s) => { s.wukongUltCd = Math.max(8000, s.wukongUltCd - 3000); } },
  { id: "bajie_ult", name: "天蓬蓄力", desc: "天蓬元帅冷却-3秒", icon: "vfx_bajie_marshal", maxLevel: 3, apply: (s) => { s.bajieUltCd = Math.max(8000, s.bajieUltCd - 3000); } },
  { id: "wujing_ult", name: "卷帘蓄力", desc: "卷帘大将冷却-3秒", icon: "vfx_wujing_shield", maxLevel: 3, apply: (s) => { s.wujingUltCd = Math.max(8000, s.wujingUltCd - 3000); } },
  { id: "bailongma_ult", name: "化龙蓄力", desc: "龙太子化龙冷却-3秒", icon: "icon_bailongma_trail", maxLevel: 3, apply: (s) => { s.bailongmaUltCd = Math.max(8000, s.bailongmaUltCd - 3000); } },
];

export const SOLO_UPGRADES: UpgradeOption[] = [
  { id: "foguang", name: "佛光普照", desc: "念经回血+3", icon: "icon_tangseng_chant", maxLevel: 5, apply: (s) => { s.regenPerTick += 3; } },
  { id: "jianbu", name: "健步如飞", desc: "移速+20", icon: "icon_bailongma_speed", maxLevel: 5, apply: (s) => { s.playerSpeed += 20; } },
  { id: "jinguang", name: "金光护体", desc: "受伤减免15%", icon: "item_jialan_jiasha", maxLevel: 5, apply: (s) => { s.damageMultiplier *= 0.85; } },
  { id: "bore", name: "般若心经", desc: "最大生命+30", icon: "icon_tangseng_mercy", maxLevel: 5, apply: (s) => { s.playerMaxHp += 30; } },
];

export const SKILL_HERO: Record<string, { name: string; color: number; colorStr: string }> = {
  wukong_dmg: { name: "悟空", color: 0xff9900, colorStr: "#ff9900" },
  wukong_range: { name: "悟空", color: 0xff9900, colorStr: "#ff9900" },
  wukong_speed: { name: "悟空", color: 0xff9900, colorStr: "#ff9900" },
  clone: { name: "悟空", color: 0xff9900, colorStr: "#ff9900" },
  crit: { name: "悟空", color: 0xff9900, colorStr: "#ff9900" },
  bajie_aoe: { name: "八戒", color: 0x88cc44, colorStr: "#88cc44" },
  kill_heal: { name: "八戒", color: 0x88cc44, colorStr: "#88cc44" },
  wujing_proj: { name: "沙僧", color: 0x4488ff, colorStr: "#4488ff" },
  shield: { name: "沙僧", color: 0x4488ff, colorStr: "#4488ff" },
  aura: { name: "唐僧", color: 0xffdd44, colorStr: "#ffdd44" },
  death_save: { name: "唐僧", color: 0xffdd44, colorStr: "#ffdd44" },
  player_hp: { name: "通用", color: 0xcc88ff, colorStr: "#cc88ff" },
  player_speed: { name: "通用", color: 0xcc88ff, colorStr: "#cc88ff" },
  xp_range: { name: "通用", color: 0xcc88ff, colorStr: "#cc88ff" },
  dmg_reduce: { name: "通用", color: 0xcc88ff, colorStr: "#cc88ff" },
  regen: { name: "通用", color: 0xcc88ff, colorStr: "#cc88ff" },
  foguang: { name: "唐僧", color: 0xffdd44, colorStr: "#ffdd44" },
  jianbu: { name: "白龙马", color: 0xcccccc, colorStr: "#cccccc" },
  jinguang: { name: "唐僧", color: 0xffdd44, colorStr: "#ffdd44" },
  bore: { name: "唐僧", color: 0xffdd44, colorStr: "#ffdd44" },
  headband: { name: "唐僧", color: 0xffdd44, colorStr: "#ffdd44" },
  mercy: { name: "唐僧", color: 0xffdd44, colorStr: "#ffdd44" },
  trail: { name: "白龙马", color: 0xcccccc, colorStr: "#cccccc" },
  wukong_ult: { name: "悟空", color: 0xff9900, colorStr: "#ff9900" },
  bajie_ult: { name: "八戒", color: 0x88cc44, colorStr: "#88cc44" },
  wujing_ult: { name: "沙僧", color: 0x4488ff, colorStr: "#4488ff" },
  bailongma_ult: { name: "白龙马", color: 0xcccccc, colorStr: "#cccccc" },
};

export function defaultUpgradeState(): UpgradeState {
  return {
    wukongDamage: WUKONG.attack.damage, wukongRange: WUKONG.attack.range,
    wukongCooldown: WUKONG.attack.cooldownMs,
    playerMaxHp: PLAYER.maxHp, playerSpeed: PLAYER.speed,
    xpAttractRadius: XP.attractRadius, damageMultiplier: 1.0, regenPerTick: 0,
    cloneCount: 0, cloneDmgRatio: 0.5, critRate: 0.1, critDmgMultiplier: 1.5,
    bossExtraDmg: 0, killHeal: 0,
    bajieAoeRadius: BAJIE.attack.range, bajieCooldown: BAJIE.attack.cooldownMs,
    wujingProjCount: 1, wujingPierceBonus: 0,
    shieldHp: 0, shieldMax: 0,
    auraRadius: 0, auraDps: 0, auraSlow: 0, deathSaves: 0,
    headbandLevel: 0, mercyLevel: 0, trailLevel: 0,
    wukongUltCd: 20000, bajieUltCd: 20000, wujingUltCd: 20000, bailongmaUltCd: 20000,
  };
}
