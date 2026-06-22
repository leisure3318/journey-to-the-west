import Phaser from "phaser";
import { PLAYER } from "../config/GameConfig";
import { VirtualJoystick } from "../ui/VirtualJoystick";

export class Player extends Phaser.Physics.Arcade.Sprite {
  hp: number;
  maxHp: number;
  moveSpeed: number;
  invincible = false;
  facing = "down";
  shieldHp = 0;
  shieldMax = 0;
  joystick?: VirtualJoystick;
  private shieldGfx?: Phaser.GameObjects.Arc;
  private riding = false;
  private readonly ridingSpeedBonus = 60;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "tangseng");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = PLAYER.maxHp;
    this.hp = this.maxHp;
    this.moveSpeed = PLAYER.speed;
    this.setScale(PLAYER.scale);
    this.setCollideWorldBounds(true);
    this.play("tangseng_down_idle");

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: scene.input.keyboard!.addKey("W"),
      A: scene.input.keyboard!.addKey("A"),
      S: scene.input.keyboard!.addKey("S"),
      D: scene.input.keyboard!.addKey("D"),
    };
  }

  handleMovement(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    let dx = 0;
    let dy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) dx = -1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) dx = 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) dy = -1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) dy = 1;

    if (dx === 0 && dy === 0 && this.joystick?.isActive()) {
      dx = this.joystick.dx;
      dy = this.joystick.dy;
    }

    if (dx === 0 && dy === 0) {
      const pointer = this.scene.input.activePointer;
      if (pointer.isDown) {
        const cam = this.scene.cameras.main;
        const wx = pointer.x + cam.scrollX;
        const wy = pointer.y + cam.scrollY;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, wx, wy);
        if (dist > 10) {
          dx = (wx - this.x) / dist;
          dy = (wy - this.y) / dist;
        }
      }
    }

    const moving = dx !== 0 || dy !== 0;
    if (moving) {
      const len = Math.sqrt(dx * dx + dy * dy);
      const spd = this.moveSpeed + (this.riding ? this.ridingSpeedBonus : 0);
      body.setVelocity(
        (dx / len) * spd,
        (dy / len) * spd,
      );
      if (Math.abs(dx) > Math.abs(dy)) {
        this.facing = dx > 0 ? "right" : "left";
      } else {
        this.facing = dy > 0 ? "down" : "up";
      }
    }

    const prefix = this.riding ? "tangseng_riding" : "tangseng";
    const animKey = `${prefix}_${this.facing}_${moving ? "walk" : "idle"}`;
    if (this.anims.currentAnim?.key !== animKey) {
      this.play(animKey);
    }
    return moving;
  }

  mountHorse() {
    if (this.riding) return;
    this.riding = true;
    this.setTexture("tangseng_riding");
    this.play(`tangseng_riding_${this.facing}_idle`);
  }

  dismountHorse() {
    if (!this.riding) return;
    this.riding = false;
    this.setTexture("tangseng");
    this.play(`tangseng_${this.facing}_idle`);
  }

  isRiding(): boolean { return this.riding; }

  takeDamage(amount: number, damageMultiplier: number) {
    if (this.invincible) return;
    let actual = Math.round(amount * damageMultiplier);
    if (this.shieldHp > 0) {
      const absorbed = Math.min(this.shieldHp, actual);
      this.shieldHp -= absorbed;
      actual -= absorbed;
      this.showShieldHit();
      if (actual <= 0) return;
    }
    this.hp = Math.max(0, this.hp - actual);
    this.showPlayerDamage(actual);
    this.invincible = true;
    this.setTint(0xff4444).setTintMode(Phaser.TintModes.FILL);
    this.scene.time.delayedCall(PLAYER.invincibleMs, () => {
      this.invincible = false;
      this.clearTint();
    });
  }

  isDead(): boolean {
    return this.hp <= 0;
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  triggerDeathSave() {
    this.hp = Math.round(this.maxHp * 0.3);
    this.invincible = true;
    this.scene.cameras.main.flash(500, 255, 215, 0);
    const shield = this.scene.add.image(this.x, this.y, "vfx_tangseng_cicada_shield")
      .setDepth(95).setDisplaySize(20, 20).setAlpha(0);
    this.scene.tweens.add({
      targets: shield, alpha: 0.9, displayWidth: 120, displayHeight: 120,
      duration: 300, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: shield, alpha: 0, displayWidth: 150, displayHeight: 150,
          duration: 1500, onComplete: () => shield.destroy(),
        });
      },
    });
    this.scene.time.delayedCall(2000, () => { this.invincible = false; this.clearTint(); });
  }

  showChantEffect() {
    const px = this.x, py = this.y;
    const aura = this.scene.add.image(px, py, "vfx_tangseng_chant_aura")
      .setDepth(90).setDisplaySize(20, 20).setAlpha(0);
    this.scene.tweens.add({
      targets: aura, alpha: 0.7, displayWidth: 100, displayHeight: 100, angle: 30,
      duration: 400, ease: "Sine.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: aura, alpha: 0, displayWidth: 120, displayHeight: 120, angle: 60,
          duration: 600, onComplete: () => aura.destroy(),
        });
      },
    });

    const sutras = ["唵", "嘛", "呢", "叭", "咪", "吽"];
    const texts: Phaser.GameObjects.Text[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const t = this.scene.add.text(px + Math.cos(a) * 38, py + Math.sin(a) * 38, sutras[i], {
        fontSize: "10px", color: "#ffdd44", stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5).setDepth(91).setAlpha(0);
      texts.push(t);
    }
    this.scene.tweens.add({
      targets: texts, alpha: 0.8, duration: 300,
      onComplete: () => {
        this.scene.tweens.add({ targets: texts, alpha: 0, angle: 60, duration: 700, onComplete: () => texts.forEach((t) => t.destroy()) });
      },
    });

    const healTxt = this.scene.add.text(px, py - 30, "+5", {
      fontSize: "12px", color: "#44ff44", fontStyle: "bold", stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setDepth(600);
    this.scene.tweens.add({ targets: healTxt, alpha: 0, y: py - 50, duration: 800, onComplete: () => healTxt.destroy() });
  }

  private showPlayerDamage(amount: number) {
    const isBig = amount >= 20;
    const txt = this.scene.add.text(this.x, this.y - 20, `-${amount}`, {
      fontSize: isBig ? "18px" : "14px",
      color: isBig ? "#ff2200" : "#ff6666",
      fontStyle: "bold",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setDepth(600);
    this.scene.tweens.add({
      targets: txt, y: this.y - 50, alpha: 0,
      duration: 700, onComplete: () => txt.destroy(),
    });
  }

  private showShieldHit() {
    const s = this.scene.add.image(this.x, this.y, "vfx_wujing_shield")
      .setDepth(95).setDisplaySize(60, 60).setAlpha(0.8);
    this.scene.tweens.add({
      targets: s, alpha: 0, displayWidth: 80, displayHeight: 80,
      duration: 300, onComplete: () => s.destroy(),
    });
  }

  updateShieldVisual() {
    if (this.shieldHp > 0 && !this.shieldGfx) {
      this.shieldGfx = this.scene.add.circle(this.x, this.y, 24, 0x66ccff, 0.15)
        .setStrokeStyle(1, 0x66ccff, 0.4).setDepth(95);
    }
    if (this.shieldGfx) {
      if (this.shieldHp <= 0) { this.shieldGfx.destroy(); this.shieldGfx = undefined; return; }
      this.shieldGfx.setPosition(this.x, this.y);
      this.shieldGfx.setAlpha(0.1 + 0.2 * (this.shieldHp / Math.max(1, this.shieldMax)));
    }
  }
}
