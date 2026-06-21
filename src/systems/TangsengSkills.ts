import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";

export interface HeadbandBuff {
  dmgMul: number;
  spdMul: number;
  allDisciples: boolean;
}

export class TangsengSkills {
  private scene: Phaser.Scene;

  private headbandLevel = 0;
  private headbandCooldownMs = 20_000;
  private headbandDurationMs = 3_000;
  private headbandTimer = 0;
  private headbandBuffActive = false;
  private headbandBuffTimer = 0;
  private headbandSpdBonus = false;

  private mercyLevel = 0;
  private mercyChargeMs = 60_000;
  private mercyCharge = 0;
  private mercyDamage = 15;
  private mercyHealRatio = 0;
  private mercyRepelMs = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  sync(headbandLevel: number, mercyLevel: number) {
    if (headbandLevel !== this.headbandLevel) {
      this.headbandLevel = headbandLevel;
      this.headbandDurationMs = 3_000 + (headbandLevel >= 2 ? 1_000 : 0) + (headbandLevel >= 4 ? 1_000 : 0);
      this.headbandCooldownMs = headbandLevel >= 4 ? 15_000 : 20_000;
      this.headbandSpdBonus = headbandLevel >= 3;
    }
    if (mercyLevel !== this.mercyLevel) {
      this.mercyLevel = mercyLevel;
      this.mercyChargeMs = 60_000 - (mercyLevel >= 2 ? 10_000 : 0) - (mercyLevel >= 5 ? 10_000 : 0);
      this.mercyDamage = 15 + (mercyLevel >= 3 ? 10 : 0);
      this.mercyHealRatio = mercyLevel >= 4 ? 0.2 : 0;
      this.mercyRepelMs = mercyLevel >= 5 ? 5_000 : 0;
    }
  }

  update(delta: number, hasWukong: boolean, enemies: Phaser.Physics.Arcade.Group, player: Player) {
    if (this.headbandLevel > 0 && hasWukong) this.updateHeadband(delta);
    if (this.mercyLevel > 0) this.updateMercy(delta, enemies, player);
  }

  getHeadbandBuff(): HeadbandBuff {
    if (!this.headbandBuffActive) return { dmgMul: 1, spdMul: 1, allDisciples: false };
    return {
      dmgMul: 1.5,
      spdMul: this.headbandSpdBonus ? 0.7 : 1,
      allDisciples: this.headbandLevel >= 5,
    };
  }

  getHeadbandRatio(): number {
    if (this.headbandLevel <= 0) return -1;
    if (this.headbandBuffActive) return 1;
    return Math.min(1, this.headbandTimer / this.headbandCooldownMs);
  }

  isHeadbandActive(): boolean { return this.headbandBuffActive; }

  getMercyChargeRatio(): number {
    if (this.mercyLevel <= 0) return -1;
    return Math.min(1, this.mercyCharge / this.mercyChargeMs);
  }

  private updateHeadband(delta: number) {
    if (this.headbandBuffActive) {
      this.headbandBuffTimer -= delta;
      if (this.headbandBuffTimer <= 0) {
        this.headbandBuffActive = false;
        this.headbandTimer = 0;
      }
      return;
    }

    this.headbandTimer += delta;
    if (this.headbandTimer >= this.headbandCooldownMs) {
      this.headbandBuffActive = true;
      this.headbandBuffTimer = this.headbandDurationMs;
      this.headbandTimer = 0;
      this.scene.events.emit("headband-activated");
      this.showHeadbandVfx();
    }
  }

  private updateMercy(delta: number, enemies: Phaser.Physics.Arcade.Group, player: Player) {
    this.mercyCharge += delta;
    if (this.mercyCharge >= this.mercyChargeMs) {
      this.mercyCharge = 0;
      this.scene.events.emit("mercy-released");
      this.releaseMercy(enemies, player);
    }
  }

  private releaseMercy(enemies: Phaser.Physics.Arcade.Group, player: Player) {
    for (const child of enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active) continue;
      e.takeDamage(this.mercyDamage);
    }

    if (this.mercyHealRatio > 0) {
      player.heal(Math.round(player.maxHp * this.mercyHealRatio));
    }

    if (this.mercyRepelMs > 0) {
      player.invincible = true;
      this.scene.time.delayedCall(this.mercyRepelMs, () => { player.invincible = false; });
    }

    this.showMercyVfx(player.x, player.y);
  }

  private showHeadbandVfx() {
    const cam = this.scene.cameras.main;
    const cx = cam.scrollX + 400, cy = cam.scrollY + 300;
    const vfx = this.scene.add.image(cx, cy, "vfx_tangseng_headband_spell")
      .setDepth(500).setDisplaySize(40, 40).setAlpha(0);
    this.scene.tweens.add({
      targets: vfx, alpha: 0.9, displayWidth: 150, displayHeight: 150, angle: 360,
      duration: 400, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: vfx, alpha: 0, displayWidth: 200, displayHeight: 200,
          duration: 600, onComplete: () => vfx.destroy(),
        });
      },
    });

    const label = this.scene.add.text(cx, cy - 80, "紧箍咒！", {
      fontSize: "18px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5).setDepth(501).setScrollFactor(0).setPosition(400, 220);
    this.scene.tweens.add({
      targets: label, alpha: 0, y: 190, duration: 1200,
      onComplete: () => label.destroy(),
    });

    this.scene.cameras.main.flash(200, 255, 221, 68, false);
  }

  private showMercyVfx(px: number, py: number) {
    const wave = this.scene.add.circle(px, py, 10, 0xffdd44, 0.4).setDepth(500);
    this.scene.tweens.add({
      targets: wave, radius: 500, alpha: 0, duration: 800, ease: "Sine.easeOut",
      onComplete: () => wave.destroy(),
    });

    const vfx = this.scene.add.image(px, py, "vfx_tangseng_chant_aura")
      .setDepth(501).setDisplaySize(40, 40).setAlpha(0);
    this.scene.tweens.add({
      targets: vfx, alpha: 0.9, displayWidth: 250, displayHeight: 250, angle: 90,
      duration: 500, ease: "Sine.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: vfx, alpha: 0, displayWidth: 400, displayHeight: 400,
          duration: 500, onComplete: () => vfx.destroy(),
        });
      },
    });

    const label = this.scene.add.text(400, 240, "大慈大悲！", {
      fontSize: "22px", color: "#ffffff", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 5,
    }).setOrigin(0.5).setDepth(502).setScrollFactor(0);
    this.scene.tweens.add({
      targets: label, alpha: 0, y: 210, duration: 1500,
      onComplete: () => label.destroy(),
    });

    this.scene.cameras.main.flash(300, 255, 255, 255, false);
  }
}
