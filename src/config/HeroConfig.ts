export const WUKONG = {
  orbitRadius: 80,
  attack: {
    damage: 10,
    range: 110,
    arcDeg: 120,
    cooldownMs: 1200,
    visualMs: 200,
  },
};

export const WUKONG_AI = {
  detectRadius: 300,
  leashRadius: 280,
  engageSpeed: 250,
  returnSpeed: 300,
  idleRadius: 60,
  guardHpThreshold: 0.3,
  guardRecoverThreshold: 0.5,
};

export const BAJIE = {
  orbitRadius: 95,
  followOffset: { x: -40, y: 30 },
  followLerp: 0.06,
  attack: {
    damage: 8,
    range: 90,
    cooldownMs: 2000,
    knockbackForce: 300,
    visualMs: 300,
  },
};

export const BAJIE_AI = {
  detectRadius: 250,
  leashRadius: 320,
  engageSpeed: 200,
  returnSpeed: 260,
  idleRadius: 70,
  restMs: 800,
};

export const WUJING = {
  orbitRadius: 110,
  followOffset: { x: 40, y: 30 },
  followLerp: 0.08,
  attack: {
    damage: 15,
    range: 250,
    cooldownMs: 1800,
    projectileSpeed: 350,
  },
};

export const WUJING_AI = {
  detectRadius: 220,
  leashRadius: 350,
  engageSpeed: 170,
  returnSpeed: 250,
  idleRadius: 80,
  preferredRange: 150,
};

export const BAILONGMA = { followOffsetY: 50, followLerp: 0.05 };

export const DISCIPLE = {
  scale: 0.45,
  orbitSpeed: 0.002,
};
