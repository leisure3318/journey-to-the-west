import { BiomeType } from "./MapConfig";
import { UpgradeState } from "./UpgradeConfig";
import { Relic } from "../systems/BossLootSystem";

export interface CarryOverState {
  stageIndex: number;
  upgrades: UpgradeState;
  recruitedKeys: string[];
  level: number;
  xp: number;
  xpToNext: number;
  totalElapsedMs: number;
  totalKills: number;
  relics: Relic[];
}

export interface StageDef {
  index: number;
  name: string;
  title: string;
  biome: BiomeType;
  mapWidth: number;
  mapHeight: number;
  difficulty: number;
  description: string;
  miniBossKeys: string[];
  finalBossKey: string;
  enemyIds: string[];
  recruitKeys: string[];
}

export const STAGES: StageDef[] = [
  {
    index: 0, name: "出长安", title: "第一大关 · 出长安",
    biome: "grassland", mapWidth: 6400, mapHeight: 4800, difficulty: 1.0,
    description: "师徒西行，初遇群妖",
    miniBossKeys: ["black_bear", "yellow_wind", "white_bone", "spider", "gold_horn", "red_boy"],
    finalBossKey: "bull_demon",
    enemyIds: ["bandit", "monkey_imp", "demon_archer", "fire_spirit", "scorpion_imp", "bear_demon", "web_spinner", "tree_demon"],
    recruitKeys: ["wukong", "bailongma", "bajie", "wujing"],
  },
  {
    index: 1, name: "西域山林", title: "第二大关 · 西域山林",
    biome: "forest", mapWidth: 5000, mapHeight: 3800, difficulty: 1.4,
    description: "深入西域密林，妖气渐浓",
    miniBossKeys: ["leopard_spirit", "deer_immortal", "tiger_immortal"],
    finalBossKey: "scorpion_spirit",
    enemyIds: ["wolf", "tiger_demon", "flower_sprite", "centipede_spirit", "tree_demon", "monkey_imp"],
    recruitKeys: [],
  },
  {
    index: 2, name: "通天水域", title: "第三大关 · 通天水域",
    biome: "swamp", mapWidth: 5000, mapHeight: 3800, difficulty: 1.8,
    description: "水妖横行，暗流涌动",
    miniBossKeys: ["goldfish_king", "mouse_spirit", "white_deer"],
    finalBossKey: "hundred_eye",
    enemyIds: ["fish_demon", "water_ghost", "snake_demon", "web_spinner", "ghost", "centipede_spirit"],
    recruitKeys: [],
  },
  {
    index: 3, name: "黄沙古道", title: "第四大关 · 黄沙古道",
    biome: "desert", mapWidth: 5500, mapHeight: 4100, difficulty: 2.2,
    description: "风沙蔽日，毒虫遍地",
    miniBossKeys: ["yellow_robe", "stone_golem", "goat_immortal"],
    finalBossKey: "iron_fan",
    enemyIds: ["sand_spirit", "fire_crow", "stone_imp", "scorpion_imp", "smoke_demon", "wind_spirit"],
    recruitKeys: [],
  },
  {
    index: 4, name: "火焰山", title: "第五大关 · 火焰山",
    biome: "volcanic", mapWidth: 5500, mapHeight: 4100, difficulty: 2.6,
    description: "烈焰焚天，寸步难行",
    miniBossKeys: ["silver_horn", "jade_rabbit"],
    finalBossKey: "golden_roc",
    enemyIds: ["fire_spirit", "bull_spirit", "fire_crow", "smoke_demon", "demon_vanguard", "stone_imp"],
    recruitKeys: [],
  },
  {
    index: 5, name: "狮驼岭", title: "第六大关 · 狮驼岭",
    biome: "forest", mapWidth: 6000, mapHeight: 4500, difficulty: 3.0,
    description: "三魔王盘踞，群妖百万",
    miniBossKeys: ["blue_lion", "white_elephant"],
    finalBossKey: "zhen_yuan",
    enemyIds: ["bone_general", "corrupted_soldier", "zombie", "demon_vanguard", "wolf_demon", "tiger_demon"],
    recruitKeys: [],
  },
  {
    index: 6, name: "冰封雪原", title: "第七大关 · 冰封雪原",
    biome: "swamp", mapWidth: 5500, mapHeight: 4100, difficulty: 3.5,
    description: "寒气刺骨，犀牛三兄弟",
    miniBossKeys: ["rhino_cold", "rhino_dust"],
    finalBossKey: "rhino_heat",
    enemyIds: ["ice_spirit", "wind_spirit", "wolf", "abyss_creature", "ghost", "corrupted_soldier"],
    recruitKeys: [],
  },
  {
    index: 7, name: "幽冥地府", title: "第八大关 · 幽冥地府",
    biome: "volcanic", mapWidth: 6000, mapHeight: 4500, difficulty: 4.0,
    description: "阴兵过境，亡灵复苏",
    miniBossKeys: ["leopard_spirit", "mouse_spirit", "stone_golem"],
    finalBossKey: "bull_demon",
    enemyIds: ["zombie", "ghost", "bone_general", "abyss_creature", "smoke_demon", "water_ghost"],
    recruitKeys: [],
  },
  {
    index: 8, name: "雷音古刹", title: "第九大关 · 雷音古刹",
    biome: "grassland", mapWidth: 6400, mapHeight: 4800, difficulty: 5.0,
    description: "最后一难，真假雷音",
    miniBossKeys: ["golden_roc", "iron_fan", "hundred_eye", "scorpion_spirit"],
    finalBossKey: "jade_rabbit",
    enemyIds: ["demon_vanguard", "corrupted_soldier", "bull_spirit", "fire_crow", "abyss_creature", "bone_general", "tiger_demon", "wolf_demon"],
    recruitKeys: [],
  },
];
