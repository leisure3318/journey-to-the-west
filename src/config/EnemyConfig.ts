export type EnemyBehavior = "chase" | "ranged" | "explosive" | "summoner" | "trapper";

export interface EnemyTypeConfig {
  id: string;
  texture: string;
  hp: number;
  damage: number;
  speed: number;
  scale: number;
  xpValue: number;
  minPhase: number;
  behavior: EnemyBehavior;
}

export const ALL_ENEMY_TYPES: EnemyTypeConfig[] = [
  { id: "bandit",           texture: "enemy_bandit",           hp: 12, damage: 4,  speed: 60,  scale: 0.46, xpValue: 5,  minPhase: 0, behavior: "chase" },
  { id: "monkey_imp",       texture: "enemy_monkey_imp",       hp: 8,  damage: 3,  speed: 90,  scale: 0.39, xpValue: 3,  minPhase: 0, behavior: "chase" },
  { id: "demon_archer",     texture: "enemy_demon_archer",     hp: 15, damage: 5,  speed: 40,  scale: 0.52, xpValue: 8,  minPhase: 1, behavior: "ranged" },
  { id: "fire_spirit",      texture: "enemy_fire_spirit",      hp: 6,  damage: 15, speed: 100, scale: 0.39, xpValue: 6,  minPhase: 2, behavior: "explosive" },
  { id: "scorpion_imp",     texture: "enemy_scorpion_imp",     hp: 14, damage: 8,  speed: 75,  scale: 0.46, xpValue: 7,  minPhase: 2, behavior: "chase" },
  { id: "bear_demon",       texture: "enemy_bear_demon",       hp: 40, damage: 10, speed: 35,  scale: 0.65, xpValue: 15, minPhase: 3, behavior: "chase" },
  { id: "web_spinner",      texture: "enemy_web_spinner",      hp: 18, damage: 6,  speed: 55,  scale: 0.46, xpValue: 10, minPhase: 2, behavior: "trapper" },
  { id: "tree_demon",       texture: "enemy_tree_demon",       hp: 25, damage: 5,  speed: 30,  scale: 0.55, xpValue: 12, minPhase: 3, behavior: "summoner" },
  { id: "wolf",             texture: "enemy_wolf",             hp: 10, damage: 5,  speed: 95,  scale: 0.42, xpValue: 4,  minPhase: 0, behavior: "chase" },
  { id: "tiger_demon",      texture: "enemy_tiger_demon",      hp: 30, damage: 8,  speed: 70,  scale: 0.55, xpValue: 10, minPhase: 1, behavior: "chase" },
  { id: "flower_sprite",    texture: "enemy_flower_sprite",    hp: 10, damage: 4,  speed: 50,  scale: 0.39, xpValue: 5,  minPhase: 0, behavior: "ranged" },
  { id: "centipede_spirit", texture: "enemy_centipede_spirit", hp: 20, damage: 7,  speed: 80,  scale: 0.46, xpValue: 8,  minPhase: 2, behavior: "chase" },
  { id: "fish_demon",       texture: "enemy_fish_demon",       hp: 14, damage: 5,  speed: 65,  scale: 0.46, xpValue: 6,  minPhase: 0, behavior: "chase" },
  { id: "water_ghost",      texture: "enemy_water_ghost",      hp: 8,  damage: 6,  speed: 85,  scale: 0.39, xpValue: 5,  minPhase: 1, behavior: "chase" },
  { id: "snake_demon",      texture: "enemy_snake_demon",      hp: 16, damage: 6,  speed: 75,  scale: 0.46, xpValue: 7,  minPhase: 1, behavior: "ranged" },
  { id: "ghost",            texture: "enemy_ghost",            hp: 6,  damage: 10, speed: 90,  scale: 0.39, xpValue: 5,  minPhase: 2, behavior: "explosive" },
  { id: "sand_spirit",      texture: "enemy_sand_spirit",      hp: 18, damage: 6,  speed: 55,  scale: 0.46, xpValue: 8,  minPhase: 1, behavior: "trapper" },
  { id: "fire_crow",        texture: "enemy_fire_crow",        hp: 10, damage: 8,  speed: 100, scale: 0.39, xpValue: 6,  minPhase: 1, behavior: "ranged" },
  { id: "stone_imp",        texture: "enemy_stone_imp",        hp: 35, damage: 8,  speed: 30,  scale: 0.52, xpValue: 12, minPhase: 2, behavior: "chase" },
  { id: "smoke_demon",      texture: "enemy_smoke_demon",      hp: 12, damage: 5,  speed: 70,  scale: 0.46, xpValue: 6,  minPhase: 1, behavior: "chase" },
  { id: "wind_spirit",      texture: "enemy_wind_spirit",      hp: 10, damage: 4,  speed: 110, scale: 0.39, xpValue: 5,  minPhase: 0, behavior: "chase" },
  { id: "bull_spirit",      texture: "enemy_bull_spirit",      hp: 45, damage: 12, speed: 40,  scale: 0.65, xpValue: 15, minPhase: 3, behavior: "chase" },
  { id: "demon_vanguard",   texture: "enemy_demon_vanguard",   hp: 25, damage: 8,  speed: 65,  scale: 0.52, xpValue: 10, minPhase: 2, behavior: "chase" },
  { id: "bone_general",     texture: "enemy_bone_general",     hp: 30, damage: 9,  speed: 55,  scale: 0.55, xpValue: 12, minPhase: 2, behavior: "summoner" },
  { id: "corrupted_soldier",texture: "enemy_corrupted_soldier", hp: 20, damage: 7, speed: 60,  scale: 0.52, xpValue: 8,  minPhase: 1, behavior: "chase" },
  { id: "zombie",           texture: "enemy_zombie",           hp: 22, damage: 6,  speed: 35,  scale: 0.52, xpValue: 7,  minPhase: 0, behavior: "chase" },
  { id: "wolf_demon",       texture: "enemy_wolf_demon",       hp: 18, damage: 7,  speed: 85,  scale: 0.46, xpValue: 8,  minPhase: 1, behavior: "chase" },
  { id: "ice_spirit",       texture: "enemy_ice_spirit",       hp: 12, damage: 6,  speed: 70,  scale: 0.39, xpValue: 6,  minPhase: 1, behavior: "ranged" },
  { id: "abyss_creature",   texture: "enemy_abyss_creature",   hp: 50, damage: 14, speed: 45,  scale: 0.65, xpValue: 18, minPhase: 3, behavior: "chase" },
];

export const ENEMY_TYPES: EnemyTypeConfig[] = ALL_ENEMY_TYPES.slice(0, 8);

export function getStageEnemyTypes(enemyIds: string[]): EnemyTypeConfig[] {
  return enemyIds.map(id => ALL_ENEMY_TYPES.find(e => e.id === id)!).filter(Boolean);
}

export const ELITE_CHANCE = 0.05;
export const ELITE_MULTIPLIER = { hp: 3, damage: 1.5, scale: 1.4, xp: 5 };

export const SPAWNER = {
  phases: [
    { startMs: 0, intervalMs: 2000, maxAlive: 20 },
    { startMs: 60_000, intervalMs: 1500, maxAlive: 35 },
    { startMs: 180_000, intervalMs: 1000, maxAlive: 55 },
    { startMs: 300_000, intervalMs: 700, maxAlive: 80 },
  ],
  spawnMargin: 80,
};
