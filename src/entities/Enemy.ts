import Phaser from "phaser";
import { EnemyBehavior } from "../config/GameConfig";

export interface EnemyConfig {
  hp: number;
  damage: number;
  speed: number;
  xpValue: number;
  behavior?: EnemyBehavior;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  hp = 0;
  maxHp = 0;
  damage = 0;
  speed = 0;
  xpValue = 0;
  behavior: EnemyBehavior = "chase";
  private knockedBack = false;
  private shootTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }

  spawn(x: number, y: number, config: EnemyConfig) {
    this.scene.tweens.killTweensOf(this);
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;

    this.hp = config.hp;
    this.maxHp = config.hp;
    this.damage = config.damage;
    this.speed = config.speed;
    this.xpValue = config.xpValue;
    this.behavior = config.behavior ?? "chase";
    this.knockedBack = false;
    this.shootTimer = 0;
    this.setAlpha(1);
    this.clearTint();
  }

  chase(targetX: number, targetY: number, delta: number) {
    if (this.knockedBack) return;
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    const body = this.body as Phaser.Physics.Arcade.Body;

    switch (this.behavior) {
      case "chase":
        body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
        break;

      case "ranged":
        if (dist > 200) {
          body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
        } else if (dist < 140) {
          body.setVelocity(-Math.cos(angle) * this.speed * 0.5, -Math.sin(angle) * this.speed * 0.5);
        } else {
          body.setVelocity(0);
        }
        this.shootTimer += delta;
        if (this.shootTimer >= 2500) {
          this.shootTimer = 0;
          this.scene.events.emit("enemy-shoot", this.x, this.y, targetX, targetY, this.damage);
        }
        break;

      case "explosive":
        body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
        if (dist < 40) this.explode();
        break;
    }

    this.flipX = body.velocity.x < 0;
  }

  private explode() {
    this.scene.events.emit("enemy-explode", this.x, this.y, this.damage, 80);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    body.enable = false;
    this.setActive(false);
    this.scene.events.emit("enemy-killed", this.x, this.y, this.xpValue);

    const gfx = this.scene.add.graphics().setDepth(500);
    gfx.fillStyle(0xff4400, 0.4);
    gfx.fillCircle(this.x, this.y, 80);
    gfx.lineStyle(2, 0xff6600, 0.8);
    gfx.strokeCircle(this.x, this.y, 80);
    this.scene.tweens.add({
      targets: gfx, alpha: 0, duration: 400,
      onComplete: () => gfx.destroy(),
    });

    this.scene.tweens.add({
      targets: this, scaleX: 0, scaleY: 0, alpha: 0, duration: 200,
      onComplete: () => this.setVisible(false),
    });
  }

  knockback(fromX: number, fromY: number, force: number) {
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
    this.knockedBack = true;
    this.scene.time.delayedCall(200, () => {
      this.knockedBack = false;
    });
  }

  takeDamage(amount: number, isCrit = false): boolean {
    this.hp -= amount;
    this.scene.events.emit("enemy-damaged", this.x, this.y, amount, isCrit);
    this.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.scene.time.delayedCall(80, () => {
      if (this.active) this.clearTint();
    });

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private die() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    body.enable = false;
    this.setActive(false);

    this.scene.events.emit("enemy-killed", this.x, this.y, this.xpValue);

    this.scene.tweens.add({
      targets: this,
      scaleX: 0, scaleY: 0, alpha: 0,
      duration: 200,
      onComplete: () => this.setVisible(false),
    });
  }
}
