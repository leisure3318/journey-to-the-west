import { WORLD } from "./GameConfig";

export type POIType = "recruit" | "boss";
export type TerrainStyle = "mountain" | "village" | "river" | "ridge" | "cave";
export type BiomeType = "grassland" | "forest" | "desert" | "swamp" | "volcanic";

export interface POIConfig {
  id: string;
  name: string;
  type: POIType;
  terrain: TerrainStyle;
  radius: number;
  x: number;
  y: number;
  recruitKey?: string;
  recruitName?: string;
  message: string;
  bossKey?: string;
}

export interface BiomeZone {
  type: BiomeType;
  cx: number;
  cy: number;
  radius: number;
}

export const BIOME_ZONES: BiomeZone[] = [
  { type: "forest",   cx: 1300, cy: 1100, radius: 1100 },
  { type: "swamp",    cx: 5100, cy: 1100, radius: 1100 },
  { type: "desert",   cx: 1300, cy: 3700, radius: 1100 },
  { type: "volcanic", cx: 5100, cy: 3700, radius: 1100 },
];

export const BIOME_COLORS: Record<BiomeType, { overlay: number; alpha: number; minimap: number }> = {
  grassland: { overlay: 0x000000, alpha: 0,    minimap: 0x2d5a27 },
  forest:    { overlay: 0x041a04, alpha: 0.55, minimap: 0x1a3a18 },
  swamp:     { overlay: 0x082830, alpha: 0.45, minimap: 0x1a4a3a },
  desert:    { overlay: 0x3a3010, alpha: 0.50, minimap: 0x7a6a40 },
  volcanic:  { overlay: 0x2a0808, alpha: 0.50, minimap: 0x4a2020 },
};

export function getBiome(x: number, y: number): BiomeType {
  for (const zone of BIOME_ZONES) {
    if (Math.hypot(x - zone.cx, y - zone.cy) <= zone.radius) return zone.type;
  }
  return "grassland";
}

export const BOSS_TYPES: Record<string, { name: string; texture: string; maxHp: number; damage: number; speed: number; scale: number }> = {
  black_bear:  { name: "黑熊精",   texture: "boss_black_bear",  maxHp: 2500, damage: 15, speed: 75, scale: 0.55 },
  yellow_wind: { name: "黄风大王", texture: "boss_yellow_wind", maxHp: 3000, damage: 18, speed: 80, scale: 0.59 },
  spider:      { name: "蜘蛛精",   texture: "boss_spider",      maxHp: 4500, damage: 20, speed: 100, scale: 0.50 },
  white_bone:  { name: "白骨精",   texture: "boss_white_bone",  maxHp: 5000, damage: 22, speed: 85, scale: 0.52 },
  gold_horn:   { name: "金角大王", texture: "boss_gold_horn",   maxHp: 6000, damage: 25, speed: 90, scale: 0.56 },
  red_boy:     { name: "红孩儿",   texture: "boss_red_boy",     maxHp: 8000, damage: 30, speed: 95, scale: 0.59 },
};

const POI_TEMPLATES: (Omit<POIConfig, "x" | "y"> & { prefX: number; prefY: number; spread: number })[] = [
  { id: "wuzhishan", name: "五指山", type: "recruit", terrain: "mountain", radius: 120,
    recruitKey: "wukong", recruitName: "孙悟空", message: "五百年困于此山！大圣终得自由！",
    prefX: 2200, prefY: 1800, spread: 300 },
  { id: "yingchoujian", name: "鹰愁涧", type: "recruit", terrain: "river", radius: 120,
    recruitKey: "bailongma", recruitName: "白龙马", message: "西海龙王三太子化为白马！小白龙加入取经队伍！",
    prefX: 4200, prefY: 1800, spread: 300 },
  { id: "gaolaozhuang", name: "高老庄", type: "recruit", terrain: "village", radius: 120,
    recruitKey: "bajie", recruitName: "猪八戒", message: "天蓬元帅弃暗投明！八戒加入取经队伍！",
    prefX: 2800, prefY: 2800, spread: 300 },
  { id: "liushahe", name: "流沙河", type: "recruit", terrain: "river", radius: 120,
    recruitKey: "wujing", recruitName: "沙悟净", message: "卷帘大将归正道！沙僧加入取经队伍！",
    prefX: 2200, prefY: 3200, spread: 300 },

  { id: "heifengshan", name: "黑风山", type: "boss", terrain: "cave", radius: 250,
    bossKey: "black_bear", message: "黑熊精盗走袈裟！",
    prefX: 800, prefY: 700, spread: 250 },
  { id: "huangfengling", name: "黄风岭", type: "boss", terrain: "ridge", radius: 250,
    bossKey: "yellow_wind", message: "黄风怪拦住了去路！",
    prefX: 1600, prefY: 1400, spread: 300 },
  { id: "baiguling", name: "白虎岭", type: "boss", terrain: "ridge", radius: 250,
    bossKey: "white_bone", message: "白骨精现出原形！",
    prefX: 3600, prefY: 2200, spread: 300 },
  { id: "pansidong", name: "盘丝洞", type: "boss", terrain: "cave", radius: 250,
    bossKey: "spider", message: "蜘蛛精张开天罗地网！",
    prefX: 5400, prefY: 900, spread: 250 },
  { id: "pingdingshan", name: "平顶山", type: "boss", terrain: "mountain", radius: 250,
    bossKey: "gold_horn", message: "金角大王祭出紫金红葫芦！",
    prefX: 1200, prefY: 4000, spread: 300 },
  { id: "huoyundong", name: "火云洞", type: "boss", terrain: "cave", radius: 250,
    bossKey: "red_boy", message: "红孩儿喷出三昧真火！",
    prefX: 5200, prefY: 3800, spread: 250 },
];

export function generatePOIs(): POIConfig[] {
  const margin = 300;
  const minDist = 500;
  const cx = WORLD.width / 2;
  const cy = WORLD.height / 2;
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < POI_TEMPLATES.length; i++) {
    const tpl = POI_TEMPLATES[i];
    let x: number, y: number;
    let attempts = 0;
    do {
      x = tpl.prefX + (Math.random() - 0.5) * tpl.spread * 2;
      y = tpl.prefY + (Math.random() - 0.5) * tpl.spread * 2;
      x = Math.max(margin, Math.min(WORLD.width - margin, x));
      y = Math.max(margin, Math.min(WORLD.height - margin, y));
      attempts++;
    } while (
      attempts < 80 &&
      (Math.hypot(x - cx, y - cy) < 400 ||
        positions.some((p) => Math.hypot(x - p.x, y - p.y) < minDist))
    );
    positions.push({ x, y });
  }

  return POI_TEMPLATES.map((tpl, i) => {
    const { prefX: _a, prefY: _b, spread: _c, ...rest } = tpl;
    return { ...rest, ...positions[i] };
  });
}
