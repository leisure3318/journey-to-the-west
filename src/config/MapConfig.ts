import { WORLD } from "./GameConfig";

export type POIType = "recruit" | "boss";
export type TerrainStyle = "mountain" | "village" | "river" | "ridge" | "cave";

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

export const BOSS_TYPES: Record<string, { name: string; texture: string; maxHp: number; damage: number; speed: number; scale: number }> = {
  yellow_wind: { name: "黄风大王", texture: "boss_yellow_wind", maxHp: 3000, damage: 18, speed: 80, scale: 0.59 },
  white_bone: { name: "白骨精", texture: "boss_white_bone", maxHp: 5000, damage: 22, speed: 85, scale: 0.52 },
  red_boy: { name: "红孩儿", texture: "boss_red_boy", maxHp: 8000, damage: 30, speed: 95, scale: 0.59 },
};

const POI_TEMPLATES: Omit<POIConfig, "x" | "y">[] = [
  { id: "wuzhishan", name: "五指山", type: "recruit", terrain: "mountain", radius: 120,
    recruitKey: "wukong", recruitName: "孙悟空", message: "五百年困于此山！大圣终得自由！" },
  { id: "yingchoujian", name: "鹰愁涧", type: "recruit", terrain: "river", radius: 120,
    recruitKey: "bailongma", recruitName: "白龙马", message: "西海龙王三太子化为白马！小白龙加入取经队伍！" },
  { id: "gaolaozhuang", name: "高老庄", type: "recruit", terrain: "village", radius: 120,
    recruitKey: "bajie", recruitName: "猪八戒", message: "天蓬元帅弃暗投明！八戒加入取经队伍！" },
  { id: "liushahe", name: "流沙河", type: "recruit", terrain: "river", radius: 120,
    recruitKey: "wujing", recruitName: "沙悟净", message: "卷帘大将归正道！沙僧加入取经队伍！" },
  { id: "huangfengling", name: "黄风岭", type: "boss", terrain: "ridge", radius: 250,
    bossKey: "yellow_wind", message: "黄风怪拦住了去路！" },
  { id: "baiguling", name: "白虎岭", type: "boss", terrain: "ridge", radius: 250,
    bossKey: "white_bone", message: "白骨精现出原形！" },
  { id: "huoyundong", name: "火云洞", type: "boss", terrain: "cave", radius: 250,
    bossKey: "red_boy", message: "红孩儿喷出三昧真火！" },
];

export function generatePOIs(): POIConfig[] {
  const margin = 300;
  const minDist = 500;
  const cx = WORLD.width / 2;
  const cy = WORLD.height / 2;
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < POI_TEMPLATES.length; i++) {
    let x: number, y: number;
    let attempts = 0;
    do {
      x = margin + Math.random() * (WORLD.width - margin * 2);
      y = margin + Math.random() * (WORLD.height - margin * 2);
      attempts++;
    } while (
      attempts < 80 &&
      (Math.hypot(x - cx, y - cy) < 400 ||
        positions.some((p) => Math.hypot(x - p.x, y - p.y) < minDist))
    );
    positions.push({ x, y });
  }

  return POI_TEMPLATES.map((tpl, i) => ({ ...tpl, ...positions[i] }));
}
