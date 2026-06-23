import Phaser from "phaser";
import { XP } from "../config/GameConfig";

export class ExperienceSystem {
  private scene: Phaser.Scene;
  private orbs: Phaser.Physics.Arcade.Group;
  private totalXp = 0;
  private level = 1;
  private xpToNext: number;
  private attractRadius: number;
  private onLevelUp: () => void;

  constructor(scene: Phaser.Scene, onLevelUp: () => void) {
    this.scene = scene;
    this.onLevelUp = onLevelUp;
    this.xpToNext = this.calcXpNeeded(1);
    this.attractRadius = XP.attractRadius;

    this.orbs = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 300,
      runChildUpdate: false,
    });
  }

  private calcXpNeeded(level: number): number {
    return level * XP.baseToLevel + 10;
  }

  spawnOrb(x: number, y: number, value: number) {
    const orb = this.orbs.get(x, y, "xp_orb") as Phaser.Physics.Arcade.Sprite | null;
    if (!orb) return;

    this.scene.tweens.killTweensOf(orb);
    orb.setActive(true).setVisible(true);
    orb.setPosition(x, y);
    orb.setData("value", value);
    const s = value >= 10 ? 1.3 : 0.9;
    orb.setScale(s).setAlpha(1);
    if (value >= 10) orb.setTint(0xffdd44);
    else orb.clearTint();
    const body = orb.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    this.scene.tweens.add({
      targets: orb, scaleX: s * 1.2, scaleY: s * 1.2,
      duration: 400 + Math.random() * 200, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
    });
  }

  update(playerX: number, playerY: number) {
    for (const child of this.orbs.getChildren()) {
      const orb = child as Phaser.Physics.Arcade.Sprite;
      if (!orb.active) continue;

      const dist = Phaser.Math.Distance.Between(playerX, playerY, orb.x, orb.y);

      if (dist < XP.collectRadius) {
        this.collectOrb(orb);
        continue;
      }

      const body = orb.body as Phaser.Physics.Arcade.Body;
      if (dist < this.attractRadius) {
        const angle = Phaser.Math.Angle.Between(orb.x, orb.y, playerX, playerY);
        const speed = XP.attractSpeed * (1 - dist / this.attractRadius);
        body.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
        );
      } else {
        body.setVelocity(0);
      }
    }
  }

  private collectOrb(orb: Phaser.Physics.Arcade.Sprite) {
    const value = orb.getData("value") as number;
    this.totalXp += value;

    this.scene.tweens.killTweensOf(orb);
    orb.setActive(false).setVisible(false);
    (orb.body as Phaser.Physics.Arcade.Body).enable = false;
    this.scene.events.emit("xp-collected");

    while (this.totalXp >= this.xpToNext) {
      this.totalXp -= this.xpToNext;
      this.level++;
      this.xpToNext = this.calcXpNeeded(this.level);
      this.onLevelUp();
    }
  }

  setAttractRadius(radius: number) {
    this.attractRadius = radius;
  }

  getLevel(): number {
    return this.level;
  }
  getXp(): number {
    return this.totalXp;
  }
  getXpToNext(): number {
    return this.xpToNext;
  }

  restore(level: number, xp: number, xpToNext: number) {
    this.level = level;
    this.totalXp = xp;
    this.xpToNext = xpToNext;
  }
}
