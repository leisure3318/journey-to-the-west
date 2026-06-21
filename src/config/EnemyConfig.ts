export type EnemyBehavior = "chase" | "ranged" | "explosive";

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

export const ENEMY_TYPES: EnemyTypeConfig[] = [
  { id: "bandit", texture: "enemy_bandit", hp: 12, damage: 4, speed: 60, scale: 0.46, xpValue: 5, minPhase: 0, behavior: "chase" },
  { id: "monkey_imp", texture: "enemy_monkey_imp", hp: 8, damage: 3, speed: 90, scale: 0.39, xpValue: 3, minPhase: 0, behavior: "chase" },
  { id: "demon_archer", texture: "enemy_demon_archer", hp: 15, damage: 5, speed: 40, scale: 0.52, xpValue: 8, minPhase: 1, behavior: "ranged" },
  { id: "fire_spirit", texture: "enemy_fire_spirit", hp: 6, damage: 15, speed: 100, scale: 0.39, xpValue: 6, minPhase: 2, behavior: "explosive" },
  { id: "scorpion_imp", texture: "enemy_scorpion_imp", hp: 14, damage: 8, speed: 75, scale: 0.46, xpValue: 7, minPhase: 2, behavior: "chase" },
  { id: "bear_demon", texture: "enemy_bear_demon", hp: 40, damage: 10, speed: 35, scale: 0.65, xpValue: 15, minPhase: 3, behavior: "chase" },
];

export const ELITE_CHANCE = 0.05;
export const ELITE_MULTIPLIER = { hp: 3, damage: 1.5, scale: 1.4, xp: 5 };

export const SPAWNER = {
  phases: [
    { startMs: 0, intervalMs: 2000, maxAlive: 15 },
    { startMs: 60_000, intervalMs: 1500, maxAlive: 25 },
    { startMs: 180_000, intervalMs: 1000, maxAlive: 40 },
    { startMs: 300_000, intervalMs: 700, maxAlive: 60 },
  ],
  spawnMargin: 80,
};
