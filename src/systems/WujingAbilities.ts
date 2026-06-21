import Phaser from "phaser";
import { Disciple } from "../entities/Disciple";
import { Enemy } from "../entities/Enemy";
import { Boss } from "../entities/Boss";

export class WujingAbilities {
  private scene: Phaser.Scene;
  private sandTrapTimer = 0;
  private waterWaveTimer = 0;
  private boomerangTimer = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  update(delta: number, wujing: Disciple, px: number, py: number,
    enemies: Phaser.Physics.Arcade.Group, boss: Boss | null) {
    this.sandTrapTimer += delta;
    if (this.sandTrapTimer >= 6000) {
      if (this.trySandTrap(wujing, enemies)) this.sandTrapTimer = 0;
    }

    this.waterWaveTimer += delta;
    if (this.waterWaveTimer >= 10000) {
      let nearCount = 0;
      for (const child of enemies.getChildren()) {
        const e = child as Enemy;
        if (e.active && Phaser.Math.Distance.Between(px, py, e.x, e.y) <= 120) nearCount++;
      }
      if (nearCount >= 4) {
        this.waterWaveTimer = 0;
        this.waterWave(px, py, enemies);
      }
    }

    this.boomerangTimer += delta;
    if (this.boomerangTimer >= 8000 && boss) {
      this.boomerangTimer = 0;
      this.staffBoomerang(wujing, boss);
    }
  }

  private trySandTrap(wujing: Disciple, enemies: Phaser.Physics.Arcade.Group): boolean {
    let bestX = 0, bestY = 0, bestCount = 0;
    for (const child of enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active) continue;
      if (Phaser.Math.Distance.Between(wujing.x, wujing.y, e.x, e.y) > 250) continue;
      let count = 0;
      for (const c2 of enemies.getChildren()) {
        const e2 = c2 as Enemy;
        if (e2.active && Phaser.Math.Distance.Between(e.x, e.y, e2.x, e2.y) <= 80) count++;
      }
      if (count > bestCount) { bestCount = count; bestX = e.x; bestY = e.y; }
    }
    if (bestCount < 2) return false;

    const trap = this.scene.add.image(bestX, bestY, "vfx_wujing_sand_trap")
      .setDepth(50).setDisplaySize(20, 20).setAlpha(0);
    this.scene.tweens.add({
      targets: trap, alpha: 0.7, displayWidth: 140, displayHeight: 140,
      duration: 300, ease: "Sine.easeOut",
    });
    const evt = this.scene.time.addEvent({
      delay: 200, repeat: 14,
      callback: () => {
        for (const child of enemies.getChildren()) {
          const e = child as Enemy;
          if (!e.active) continue;
          if (Phaser.Math.Distance.Between(bestX, bestY, e.x, e.y) <= 70) {
            e.hp -= 2;
            if (e.hp <= 0) { e.takeDamage(0); continue; }
            (e.body as Phaser.Physics.Arcade.Body).velocity.scale(0.5);
          }
        }
      },
    });
    this.scene.time.delayedCall(3000, () => {
      evt.destroy();
      this.scene.tweens.add({ targets: trap, alpha: 0, duration: 500, onComplete: () => trap.destroy() });
    });
    return true;
  }

  private waterWave(px: number, py: number, enemies: Phaser.Physics.Arcade.Group) {
    const gfx = this.scene.add.graphics().setDepth(95);
    let r = 20, a = 0.5;
    const evt = this.scene.time.addEvent({
      delay: 16, repeat: 37,
      callback: () => {
        r += 3.5; a -= 0.013;
        gfx.clear();
        if (a > 0) {
          gfx.lineStyle(3, 0x66aaff, a);
          gfx.strokeCircle(px, py, r);
          gfx.fillStyle(0x4488ff, a * 0.3);
          gfx.fillCircle(px, py, r);
        }
      },
    });
    this.scene.time.delayedCall(620, () => { evt.destroy(); gfx.destroy(); });

    const vfx = this.scene.add.image(px, py, "vfx_wujing_shield")
      .setDepth(96).setDisplaySize(40, 40).setAlpha(0);
    this.scene.tweens.add({
      targets: vfx, alpha: 0.8, displayWidth: 200, displayHeight: 200,
      duration: 300, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: vfx, alpha: 0, displayWidth: 240, displayHeight: 240,
          duration: 400, onComplete: () => vfx.destroy(),
        });
      },
    });

    for (const child of enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active) continue;
      if (Phaser.Math.Distance.Between(px, py, e.x, e.y) <= 150) {
        e.knockback(px, py, 350);
        e.hp -= 5;
        if (e.hp <= 0) e.takeDamage(0);
      }
    }
  }

  private staffBoomerang(wujing: Disciple, boss: Boss) {
    const staff = this.scene.add.image(wujing.x, wujing.y, "vfx_wujing_staff_throw")
      .setDepth(501).setDisplaySize(48, 48).setAlpha(0.9);
    const dmg = wujing.attackDamage * 2;
    this.scene.tweens.add({
      targets: staff, x: boss.x, y: boss.y, angle: 720, duration: 500, ease: "Sine.easeIn",
      onComplete: () => {
        if (boss.active) boss.takeDamage(dmg);
        this.scene.cameras.main.shake(80, 0.005);
        this.scene.tweens.add({
          targets: staff, x: wujing.x, y: wujing.y, angle: 1440, duration: 500, ease: "Sine.easeOut",
          onComplete: () => {
            if (boss.active) {
              const dist = Phaser.Math.Distance.Between(staff.x, staff.y, boss.x, boss.y);
              if (dist < 120) boss.takeDamage(Math.round(dmg * 0.6));
            }
            staff.destroy();
          },
        });
      },
    });
  }
}
