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
    const scaledMax = Math.floor(phase.maxAlive * this.getTimeScale());

    if (this.spawnTimer >= phase.intervalMs && aliveCount < scaledMax) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }
  }

  private getTimeScale(): number {
    return 1 + this.elapsed / 300_000 * 0.3;
  }

  private getStatScale(): number {
    return 1 + this.elapsed / 60_000 * 0.04;
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
    const statScale = this.getStatScale();
    enemy.spawn(pos.x, pos.y, {
      hp: Math.round((isElite ? cfg.hp * ELITE_MULTIPLIER.hp : cfg.hp) * statScale),
      damage: Math.round((isElite ? cfg.damage * ELITE_MULTIPLIER.damage : cfg.damage) * statScale),
      speed: cfg.speed + this.elapsed / 60_000 * 2,
      xpValue: isElite ? cfg.xpValue * ELITE_MULTIPLIER.xp : cfg.xpValue,
      behavior: cfg.behavior,
    });
    enemy.setTexture(cfg.texture);
    const scale = isElite ? cfg.scale * ELITE_MULTIPLIER.scale : cfg.scale;
    enemy.setScale(scale);
    if (isElite) {
      enemy.setTint(0xff4444);
      const ring = this.scene.add.image(enemy.x, enemy.y, "elite_ring")
        .setDisplaySize(scale * 200, scale * 100).setDepth(99).setAlpha(0.7);
      this.scene.tweens.add({
        targets: ring, alpha: 0.3, duration: 800, yoyo: true, repeat: -1,
      });
      const updateRing = () => {
        if (enemy.active && ring.active) {
          ring.setPosition(enemy.x, enemy.y + 10);
        } else if (ring.active) {
          ring.destroy();
          this.scene.events.off("update", updateRing);
        }
      };
      this.scene.events.on("update", updateRing);
    }
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
