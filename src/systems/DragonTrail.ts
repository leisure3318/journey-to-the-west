import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";

interface TrailSegment {
  sprite: Phaser.GameObjects.Image;
  ttl: number;
  dmgTimer: number;
}

export class DragonTrail {
  private scene: Phaser.Scene;
  private segments: TrailSegment[] = [];
  private dropTimer = 0;
  private lastX = 0;
  private lastY = 0;

  private level = 0;
  private dps = 2;
  private duration = 2000;
  private wide = false;
  private slow = 0;
  private dropInterval = 120;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  sync(level: number) {
    if (level === this.level) return;
    this.level = level;
    this.dps = 2 + (level >= 2 ? 1 : 0) + (level >= 4 ? 2 : 0);
    this.duration = 2000 + (level >= 2 ? 1000 : 0) + (level >= 5 ? 2000 : 0);
    this.wide = level >= 3;
    this.slow = level >= 4 ? (level >= 5 ? 0.25 : 0.15) : 0;
  }

  update(delta: number, px: number, py: number, moving: boolean, enemies: Phaser.Physics.Arcade.Group) {
    if (this.level <= 0) return;

    if (moving) {
      this.dropTimer += delta;
      const dist = Phaser.Math.Distance.Between(this.lastX, this.lastY, px, py);
      if (this.dropTimer >= this.dropInterval && dist > 20) {
        this.dropTimer = 0;
        this.lastX = px;
        this.lastY = py;
        this.spawnSegment(px, py);
      }
    }

    this.tickSegments(delta, enemies);
  }

  private spawnSegment(x: number, y: number) {
    const size = this.wide ? 50 : 30;
    const sprite = this.scene.add.image(x, y, "vfx_bailongma_frost_trail")
      .setDepth(5).setDisplaySize(size, size).setAlpha(0.5)
      .setAngle(Phaser.Math.Between(0, 360));
    this.scene.tweens.add({ targets: sprite, alpha: 0.35, duration: 200 });
    this.segments.push({ sprite, ttl: this.duration, dmgTimer: 0 });
  }

  private tickSegments(delta: number, enemies: Phaser.Physics.Arcade.Group) {
    const hitRadius = this.wide ? 25 : 15;
    const dmgPerTick = this.dps;

    for (let i = this.segments.length - 1; i >= 0; i--) {
      const seg = this.segments[i];
      seg.ttl -= delta;
      seg.dmgTimer += delta;

      if (seg.ttl <= 0) {
        seg.sprite.destroy();
        this.segments.splice(i, 1);
        continue;
      }

      if (seg.ttl < 500) seg.sprite.setAlpha(seg.sprite.alpha * 0.95);

      if (seg.dmgTimer >= 500) {
        seg.dmgTimer = 0;
        const sx = seg.sprite.x, sy = seg.sprite.y;
        for (const child of enemies.getChildren()) {
          const e = child as Enemy;
          if (!e.active) continue;
          if (Phaser.Math.Distance.Between(sx, sy, e.x, e.y) <= hitRadius) {
            e.takeDamage(dmgPerTick);
            if (this.slow > 0) {
              const body = e.body as Phaser.Physics.Arcade.Body;
              if (body) body.velocity.scale(1 - this.slow);
            }
          }
        }
      }
    }
  }

  destroy() {
    for (const seg of this.segments) seg.sprite.destroy();
    this.segments = [];
  }
}
