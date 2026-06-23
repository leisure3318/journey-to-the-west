export const WORLD = {
  width: 6400,
  height: 4800,
};

export const PLAYER = {
  speed: 150,
  maxHp: 100,
  scale: 0.5,
  invincibleMs: 500,
};

export const XP = {
  attractRadius: 100,
  attractSpeed: 300,
  collectRadius: 20,
  baseToLevel: 15,
};

export { WUKONG, WUKONG_AI, BAJIE, BAJIE_AI, WUJING, WUJING_AI, BAILONGMA, DISCIPLE } from "./HeroConfig";
export { ENEMY_TYPES, ALL_ENEMY_TYPES, getStageEnemyTypes, ELITE_CHANCE, ELITE_MULTIPLIER, SPAWNER } from "./EnemyConfig";
export type { EnemyBehavior, EnemyTypeConfig } from "./EnemyConfig";
export { UPGRADES, SOLO_UPGRADES, SKILL_HERO, defaultUpgradeState } from "./UpgradeConfig";
export type { UpgradeState, UpgradeOption } from "./UpgradeConfig";
