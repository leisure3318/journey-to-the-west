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
  black_bear:    { name: "黑熊精",     texture: "boss_black_bear",    maxHp: 2500,  damage: 15, speed: 75,  scale: 0.55 },
  yellow_wind:   { name: "黄风大王",   texture: "boss_yellow_wind",   maxHp: 3000,  damage: 18, speed: 80,  scale: 0.59 },
  spider:        { name: "蜘蛛精",     texture: "boss_spider",        maxHp: 4500,  damage: 20, speed: 100, scale: 0.50 },
  white_bone:    { name: "白骨精",     texture: "boss_white_bone",    maxHp: 5000,  damage: 22, speed: 85,  scale: 0.52 },
  gold_horn:     { name: "金角大王",   texture: "boss_gold_horn",     maxHp: 6000,  damage: 25, speed: 90,  scale: 0.56 },
  red_boy:       { name: "红孩儿",     texture: "boss_red_boy",       maxHp: 8000,  damage: 30, speed: 95,  scale: 0.59 },
  bull_demon:    { name: "牛魔王",     texture: "boss_bull_demon",    maxHp: 15000, damage: 35, speed: 100, scale: 0.70 },
  leopard_spirit:{ name: "豹子精",     texture: "boss_leopard",       maxHp: 3500,  damage: 20, speed: 110, scale: 0.52 },
  deer_immortal: { name: "鹿力大仙",   texture: "boss_deer",          maxHp: 4000,  damage: 18, speed: 70,  scale: 0.55 },
  tiger_immortal:{ name: "虎力大仙",   texture: "boss_tiger",         maxHp: 4500,  damage: 22, speed: 85,  scale: 0.58 },
  scorpion_spirit:{ name: "蝎子精",    texture: "boss_scorpion",      maxHp: 8000,  damage: 28, speed: 90,  scale: 0.55 },
  goldfish_king: { name: "金鱼精",     texture: "boss_goldfish",      maxHp: 4000,  damage: 20, speed: 75,  scale: 0.52 },
  mouse_spirit:  { name: "老鼠精",     texture: "boss_mouse",         maxHp: 3500,  damage: 18, speed: 100, scale: 0.48 },
  white_deer:    { name: "白鹿精",     texture: "boss_white_deer",    maxHp: 5000,  damage: 22, speed: 80,  scale: 0.55 },
  hundred_eye:   { name: "百眼魔君",   texture: "boss_hundred_eye",   maxHp: 10000, damage: 30, speed: 85,  scale: 0.62 },
  yellow_robe:   { name: "黄袍怪",     texture: "boss_yellow_robe",   maxHp: 5000,  damage: 24, speed: 85,  scale: 0.56 },
  stone_golem:   { name: "石魔",       texture: "boss_stone_golem",   maxHp: 6000,  damage: 20, speed: 50,  scale: 0.65 },
  goat_immortal: { name: "羊力大仙",   texture: "boss_goat",          maxHp: 4500,  damage: 18, speed: 70,  scale: 0.55 },
  iron_fan:      { name: "铁扇公主",   texture: "boss_iron_fan",      maxHp: 12000, damage: 32, speed: 90,  scale: 0.58 },
  silver_horn:   { name: "银角大王",   texture: "boss_silver_horn",   maxHp: 6000,  damage: 25, speed: 90,  scale: 0.56 },
  jade_rabbit:   { name: "玉兔精",     texture: "boss_jade_rabbit",   maxHp: 5500,  damage: 22, speed: 105, scale: 0.50 },
  golden_roc:    { name: "大鹏金翅鸟", texture: "boss_golden_roc",    maxHp: 15000, damage: 35, speed: 110, scale: 0.70 },
  blue_lion:     { name: "青狮精",     texture: "boss_blue_lion",     maxHp: 7000,  damage: 28, speed: 95,  scale: 0.60 },
  white_elephant:{ name: "白象精",     texture: "boss_white_elephant",maxHp: 8000,  damage: 30, speed: 70,  scale: 0.65 },
  zhen_yuan:     { name: "镇元大仙",   texture: "boss_zhen_yuan",     maxHp: 18000, damage: 38, speed: 85,  scale: 0.62 },
  rhino_cold:    { name: "辟寒大王",   texture: "boss_rhino_cold",    maxHp: 7000,  damage: 26, speed: 80,  scale: 0.58 },
  rhino_dust:    { name: "辟尘大王",   texture: "boss_rhino_dust",    maxHp: 7000,  damage: 26, speed: 80,  scale: 0.58 },
  rhino_heat:    { name: "辟暑大王",   texture: "boss_rhino_heat",    maxHp: 12000, damage: 32, speed: 90,  scale: 0.62 },
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

export function generateStagePOIs(stage: import("./StageConfig").StageDef): POIConfig[] {
  const w = stage.mapWidth, h = stage.mapHeight;
  const margin = 300, minDist = 400;
  const cx = w / 2, cy = h / 2;
  const positions: { x: number; y: number }[] = [];

  const recruitTemplates: Omit<POIConfig, "x" | "y">[] = [];
  const RECRUIT_INFO: Record<string, { id: string; name: string; terrain: TerrainStyle; recruitName: string; message: string }> = {
    wukong:    { id: "wuzhishan",    name: "五指山",  terrain: "mountain", recruitName: "孙悟空", message: "五百年困于此山！大圣终得自由！" },
    bailongma: { id: "yingchoujian", name: "鹰愁涧",  terrain: "river",   recruitName: "白龙马", message: "西海龙王三太子化为白马！" },
    bajie:     { id: "gaolaozhuang", name: "高老庄",  terrain: "village",  recruitName: "猪八戒", message: "天蓬元帅弃暗投明！八戒加入！" },
    wujing:    { id: "liushahe",     name: "流沙河",  terrain: "river",   recruitName: "沙悟净", message: "卷帘大将归正道！沙僧加入！" },
  };
  for (const key of stage.recruitKeys) {
    const info = RECRUIT_INFO[key];
    if (info) recruitTemplates.push({ id: info.id, name: info.name, type: "recruit", terrain: info.terrain, radius: 120, recruitKey: key, recruitName: info.recruitName, message: info.message });
  }

  const BOSS_POI_NAMES: Record<string, { id: string; name: string; terrain: TerrainStyle; message: string }> = {
    black_bear:     { id: "heifengshan",  name: "黑风山",   terrain: "cave",     message: "黑熊精盗走袈裟！" },
    yellow_wind:    { id: "huangfengling",name: "黄风岭",   terrain: "ridge",    message: "黄风怪拦住了去路！" },
    white_bone:     { id: "baiguling",    name: "白虎岭",   terrain: "ridge",    message: "白骨精现出原形！" },
    spider:         { id: "pansidong",    name: "盘丝洞",   terrain: "cave",     message: "蜘蛛精张开天罗地网！" },
    gold_horn:      { id: "pingdingshan", name: "平顶山",   terrain: "mountain", message: "金角大王祭出紫金红葫芦！" },
    red_boy:        { id: "huoyundong",   name: "火云洞",   terrain: "cave",     message: "红孩儿喷出三昧真火！" },
    leopard_spirit: { id: "leopardlair",  name: "豹头山",   terrain: "cave",     message: "豹子精现出原形！" },
    deer_immortal:  { id: "chechi",       name: "车迟国",   terrain: "mountain", message: "鹿力大仙前来挑战！" },
    tiger_immortal: { id: "tigercave",    name: "虎穴",     terrain: "cave",     message: "虎力大仙降临！" },
    scorpion_spirit:{ id: "duzishan",     name: "毒敌山",   terrain: "ridge",    message: "蝎子精毒针出击！" },
    goldfish_king:  { id: "tongtianhe",   name: "通天河",   terrain: "river",    message: "金鱼精兴风作浪！" },
    mouse_spirit:   { id: "wushuling",    name: "无鼠岭",   terrain: "cave",     message: "老鼠精设下陷阱！" },
    white_deer:     { id: "bibotan",      name: "碧波潭",   terrain: "river",    message: "白鹿精现身！" },
    hundred_eye:    { id: "huanghualin",  name: "黄花观",   terrain: "cave",     message: "百眼魔君张开千目！" },
    yellow_robe:    { id: "bowanguo",     name: "宝象国",   terrain: "village",  message: "黄袍怪现出原形！" },
    stone_golem:    { id: "stonepeak",    name: "石头峰",   terrain: "mountain", message: "石魔拦住去路！" },
    goat_immortal:  { id: "goathill",     name: "羊力坡",   terrain: "ridge",    message: "羊力大仙出手！" },
    iron_fan:       { id: "cuiyunshan",   name: "翠云山",   terrain: "mountain", message: "铁扇公主祭出芭蕉扇！" },
    silver_horn:    { id: "lianhuadong",  name: "莲花洞",   terrain: "cave",     message: "银角大王出洞！" },
    jade_rabbit:    { id: "tianzhu",      name: "天竺国",   terrain: "village",  message: "玉兔精月宫下凡！" },
    golden_roc:     { id: "shituoling",   name: "狮驼岭",   terrain: "mountain", message: "大鹏金翅鸟展翅遮天！" },
    blue_lion:      { id: "lionlair",     name: "狮驼洞",   terrain: "cave",     message: "青狮精咆哮而出！" },
    white_elephant: { id: "elephanthill", name: "象头山",   terrain: "mountain", message: "白象精鼻卷狂风！" },
    zhen_yuan:      { id: "wuzhuangguan", name: "五庄观",   terrain: "mountain", message: "镇元大仙袖里乾坤！" },
    rhino_cold:     { id: "coldpeak",     name: "辟寒峰",   terrain: "mountain", message: "辟寒大王寒气逼人！" },
    rhino_dust:     { id: "dustpeak",     name: "辟尘峰",   terrain: "ridge",    message: "辟尘大王尘暴来袭！" },
    rhino_heat:     { id: "heatpeak",     name: "辟暑峰",   terrain: "mountain", message: "辟暑大王烈焰焚天！" },
  };

  const bossTemplates: Omit<POIConfig, "x" | "y">[] = [];
  for (const key of stage.miniBossKeys) {
    const info = BOSS_POI_NAMES[key];
    if (info) bossTemplates.push({ id: info.id, name: info.name, type: "boss", terrain: info.terrain, radius: 250, bossKey: key, message: info.message });
  }

  const allTemplates = [...recruitTemplates, ...bossTemplates];
  const totalCount = allTemplates.length;

  const angleSlots: number[] = [];
  for (let i = 0; i < totalCount; i++) {
    angleSlots.push((i / totalCount) * Math.PI * 2 + (Math.random() - 0.5) * (Math.PI * 2 / totalCount) * 0.6);
  }
  for (let i = angleSlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [angleSlots[i], angleSlots[j]] = [angleSlots[j], angleSlots[i]];
  }

  for (let i = 0; i < totalCount; i++) {
    const isRecruit = i < recruitTemplates.length;
    const angle = angleSlots[i];
    let x: number, y: number, attempts = 0;
    do {
      const minR = isRecruit ? Math.min(w, h) * 0.12 : Math.min(w, h) * 0.25;
      const maxR = isRecruit ? Math.min(w, h) * 0.3 : Math.min(w, h) * 0.42;
      const dist = minR + Math.random() * (maxR - minR);
      const jitter = (Math.random() - 0.5) * 0.3;
      x = cx + Math.cos(angle + jitter) * dist;
      y = cy + Math.sin(angle + jitter) * dist;
      x = Math.max(margin, Math.min(w - margin, x));
      y = Math.max(margin, Math.min(h - margin, y));
      attempts++;
    } while (attempts < 80 && (Math.hypot(x - cx, y - cy) < 200 || positions.some(p => Math.hypot(x - p.x, y - p.y) < minDist)));
    positions.push({ x, y });
  }

  return allTemplates.map((tpl, i) => ({ ...tpl, ...positions[i] }));
}

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
