import Phaser from "phaser";
import { DISCIPLE, BAILONGMA } from "../config/GameConfig";
import { Enemy } from "./Enemy";

export type AttackType = "arc" | "area" | "projectile";

export interface ArcAttackResult {
  type: "arc";
  x: number;
  y: number;
  angle: number;
  range: number;
  arcDeg: number;
}

export interface AreaAttackResult {
  type: "area";
  x: number;
  y: number;
  range: number;
}

export interface ProjectileAttackResult {
  type: "projectile";
  fromX: number;
  fromY: number;
  targetX: number;
  targetY: number;
  damage: number;
  isCrit: boolean;
}

export type AttackResult =
  | ArcAttackResult
  | AreaAttackResult
  | ProjectileAttackResult;

export class Disciple extends Phaser.Physics.Arcade.Sprite {
  heroName: string;
  orbitOffset: number;
  orbitRadius: number;
  isHorse: boolean;

  canAttack = false;
  attackType: AttackType = "arc";
  attackDamage = 0;
  attackRange = 0;
  attackArcDeg = 0;
  attackCooldownMs = 0;
  knockbackForce = 0;
  isCrit = false;
  private lastAttackTime = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    orbitOffset: number,
    orbitRadius: number,
    isHorse = false,
  ) {
    super(scene, x, y, name);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.heroName = name;
    this.orbitOffset = orbitOffset;
    this.orbitRadius = orbitRadius;
    this.isHorse = isHorse;
    this.setScale(DISCIPLE.scale);
  }

  configureAttack(config: {
    type: AttackType;
    damage: number;
    range: number;
    cooldownMs: number;
    arcDeg?: number;
    knockbackForce?: number;
  }) {
    this.canAttack = true;
    this.attackType = config.type;
    this.attackDamage = config.damage;
    this.attackRange = config.range;
    this.attackCooldownMs = config.cooldownMs;
    if (config.arcDeg !== undefined) this.attackArcDeg = config.arcDeg;
    if (config.knockbackForce !== undefined) this.knockbackForce = config.knockbackForce;
  }

  updateFollow(
    targetX: number, targetY: number,
    facing: string, moving: boolean,
    lerpSpeed = 0.08,
  ) {
    this.x += (targetX - this.x) * lerpSpeed;
    this.y += (targetY - this.y) * lerpSpeed;

    const animKey = `${this.heroName}_${facing}_${moving ? "walk" : "idle"}`;
    if (this.anims.currentAnim?.key !== animKey) {
      this.play(animKey);
    }
  }

  tryAttack(
    time: number,
    enemies: Phaser.Physics.Arcade.Group,
  ): AttackResult | null {
    if (!this.canAttack) return null;
    if (time - this.lastAttackTime < this.attackCooldownMs) return null;

    let nearest: Enemy | null = null;
    let nearestDist = Infinity;

    for (const child of enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active) continue;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
      if (dist < this.attackRange && dist < nearestDist) {
        nearest = e;
        nearestDist = dist;
      }
    }

    if (!nearest) return null;
    this.lastAttackTime = time;

    switch (this.attackType) {
      case "arc": {
        const attackAngle = Phaser.Math.Angle.Between(
          this.x, this.y, nearest.x, nearest.y,
        );
        const halfArc = Phaser.Math.DegToRad(this.attackArcDeg / 2);

        for (const child of enemies.getChildren()) {
          const e = child as Enemy;
          if (!e.active) continue;
          const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
          if (dist > this.attackRange) continue;

          const angleToE = Phaser.Math.Angle.Between(this.x, this.y, e.x, e.y);
          let diff = angleToE - attackAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;

          if (Math.abs(diff) <= halfArc) {
            e.takeDamage(this.attackDamage, this.isCrit);
          }
        }

        return {
          type: "arc",
          x: this.x, y: this.y,
          angle: attackAngle, range: this.attackRange, arcDeg: this.attackArcDeg,
        };
      }

      case "area": {
        for (const child of enemies.getChildren()) {
          const e = child as Enemy;
          if (!e.active) continue;
          const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
          if (dist <= this.attackRange) {
            e.takeDamage(this.attackDamage, this.isCrit);
            e.knockback(this.x, this.y, this.knockbackForce);
          }
        }
        return { type: "area", x: this.x, y: this.y, range: this.attackRange };
      }

      case "projectile": {
        return {
          type: "projectile",
          fromX: this.x, fromY: this.y,
          targetX: nearest.x, targetY: nearest.y,
          damage: this.attackDamage,
          isCrit: this.isCrit,
        };
      }
    }
  }

  tryAttackTarget(time: number, targetX: number, targetY: number): AttackResult | null {
    if (!this.canAttack) return null;
    if (time - this.lastAttackTime < this.attackCooldownMs) return null;
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
    if (dist > this.attackRange * 2.5) return null;
    this.lastAttackTime = time;

    switch (this.attackType) {
      case "arc": {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        return { type: "arc", x: this.x, y: this.y, angle, range: this.attackRange, arcDeg: this.attackArcDeg };
      }
      case "area":
        return { type: "area", x: this.x, y: this.y, range: this.attackRange };
      case "projectile":
        return { type: "projectile", fromX: this.x, fromY: this.y, targetX, targetY, damage: this.attackDamage, isCrit: this.isCrit };
    }
  }
}
