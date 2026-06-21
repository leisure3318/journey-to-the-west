import Phaser from "phaser";
import { Disciple } from "../entities/Disciple";
import { Enemy } from "../entities/Enemy";
import { UpgradeState } from "../config/UpgradeConfig";

export class CloneSystem {
  private scene: Phaser.Scene;
  private clones: Phaser.GameObjects.Sprite[] = [];
  private activeCount = 0;
  private attackTimer = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  sync(upgrades: UpgradeState, wukong: Disciple) {
    if (upgrades.cloneCount <= this.activeCount) return;
    while (this.activeCount < upgrades.cloneCount) {
      const vfx = this.scene.add.image(wukong.x, wukong.y, "vfx_wukong_clone")
        .setDepth(95).setDisplaySize(20, 20).setAlpha(0);
      this.scene.tweens.add({
        targets: vfx, alpha: 0.9, displayWidth: 100, displayHeight: 100, angle: 180,
        duration: 400, ease: "Back.easeOut",
        onComplete: () => {
          this.scene.tweens.add({
            targets: vfx, alpha: 0, displayWidth: 130, displayHeight: 130,
            duration: 300, onComplete: () => vfx.destroy(),
          });
        },
      });
      const clone = this.scene.add.sprite(wukong.x, wukong.y, "wukong").setScale(0.4).setAlpha(0.5).setDepth(90);
      clone.play("wukong_down_idle");
      this.clones.push(clone);
      this.activeCount++;
    }
  }

  update(wukong: Disciple, time: number, enemies: Phaser.Physics.Arcade.Group, dmgRatio: number) {
    if (this.clones.length === 0) return;

    for (let i = 0; i < this.clones.length; i++) {
      const clone = this.clones[i];
      const angle = (i / this.clones.length) * Math.PI * 2 + time * 0.001;
      const tx = wukong.x + Math.cos(angle) * 50;
      const ty = wukong.y + Math.sin(angle) * 50;
      clone.x += (tx - clone.x) * 0.1;
      clone.y += (ty - clone.y) * 0.1;
      clone.flipX = clone.x < wukong.x;
      if (wukong.anims?.currentAnim) clone.play(wukong.anims.currentAnim.key, true);
    }

    this.attackTimer += 16;
    if (this.attackTimer < wukong.attackCooldownMs) return;
    this.attackTimer = 0;
    const cloneDmg = Math.round(wukong.attackDamage * dmgRatio);

    for (const clone of this.clones) {
      for (const child of enemies.getChildren()) {
        if (!child.active) continue;
        const en = child as Enemy;
        if (Phaser.Math.Distance.Between(clone.x, clone.y, en.x, en.y) <= wukong.attackRange) {
          en.takeDamage(cloneDmg);
          break;
        }
      }
    }
  }

  getAll(): Phaser.GameObjects.Sprite[] { return this.clones; }
}
