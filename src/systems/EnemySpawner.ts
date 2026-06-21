import Phaser from "phaser";
import { SPAWNER, ENEMY_TYPES, ELITE_CHANCE, ELITE_MULTIPLIER } from "../config/GameConfig";
import { Enemy } from "../entities/Enemy";

export class EnemySpawner {
  private scene: Phaser.Scene;
  private enemies: Phaser.Physics.Arcade.Group;
  private elapsed = 0;
  private spawnTimer = 0;
  private lastPhaseIdx = 0;

  constructor(scene: Phaser.Scene, enemies: Phaser.Physics.Arcade.Group) {
    this.scene = scene;
    this.enemies = enemies;
  }

  update(delta: number) {
    this.elapsed += delta;
    this.spawnTimer += delta;

    const phaseNow = this.getCurrentPhaseIndex();
    if (phaseNow !== this.lastPhaseIdx) {
      this.lastPhaseIdx = phaseNow;
      this.scene.events.emit("wave-changed");
    }
    const phase = this.getCurrentPhase();
    const aliveCount = this.enemies.getChildren().filter((e) => e.active).length;

    if (this.spawnTimer >= phase.intervalMs && aliveCount < phase.maxAlive) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }
  }

  private getCurrentPhaseIndex(): number {
    let idx = 0;
    for (let i = 0; i < SPAWNER.phases.length; i++) {
      if (this.elapsed >= SPAWNER.phases[i].startMs) idx = i;
    }
    return idx;
  }

  private getCurrentPhase() {
    return SPAWNER.phases[this.getCurrentPhaseIndex()];
  }

  private spawnEnemy() {
    const phaseIdx = this.getCurrentPhaseIndex();
    const available = ENEMY_TYPES.filter((t) => t.minPhase <= phaseIdx);
    const cfg = available[Phaser.Math.Between(0, available.length - 1)];
    const pos = this.getSpawnPosition();

    let enemy = this.enemies.getFirstDead(false) as Enemy | null;
    if (!enemy) {
      enemy = new Enemy(this.scene, pos.x, pos.y, cfg.texture);
      this.enemies.add(enemy, true);
    }

    const isElite = Math.random() < ELITE_CHANCE && phaseIdx >= 1;
    enemy.spawn(pos.x, pos.y, {
      hp: isElite ? Math.round(cfg.hp * ELITE_MULTIPLIER.hp) : cfg.hp,
      damage: isElite ? Math.round(cfg.damage * ELITE_MULTIPLIER.damage) : cfg.damage,
      speed: cfg.speed,
      xpValue: isElite ? cfg.xpValue * ELITE_MULTIPLIER.xp : cfg.xpValue,
      behavior: cfg.behavior,
    });
    enemy.setTexture(cfg.texture);
    const scale = isElite ? cfg.scale * ELITE_MULTIPLIER.scale : cfg.scale;
    enemy.setScale(scale);
    if (isElite) enemy.setTint(0xff4444);
  }

  private getSpawnPosition(): { x: number; y: number } {
    const cam = this.scene.cameras.main;
    const left = cam.scrollX;
    const top = cam.scrollY;
    const right = left + cam.width;
    const bottom = top + cam.height;
    const m = SPAWNER.spawnMargin;
    const side = Phaser.Math.Between(0, 3);

    switch (side) {
      case 0:
        return { x: Phaser.Math.Between(left - m, right + m), y: top - m };
      case 1:
        return { x: right + m, y: Phaser.Math.Between(top - m, bottom + m) };
      case 2:
        return { x: Phaser.Math.Between(left - m, right + m), y: bottom + m };
      default:
        return { x: left - m, y: Phaser.Math.Between(top - m, bottom + m) };
    }
  }

  getElapsed(): number {
    return this.elapsed;
  }
}
