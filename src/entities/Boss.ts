import Phaser from "phaser";

export interface BossConfig {
  name: string;
  texture: string;
  maxHp: number;
  damage: number;
  speed: number;
  scale: number;
}

type BossPhase = "chase" | "charge" | "spin" | "rest";

export class Boss extends Phaser.GameObjects.Image {
  bossName: string;
  hp: number;
  maxHp: number;
  damage: number;
  speed: number;

  private phase: BossPhase = "chase";
  private phaseTimer = 0;
  private chargeTarget = { x: 0, y: 0 };
  private spinAngle = 0;
  private dying = false;

  constructor(scene: Phaser.Scene, x: number, y: number, config: BossConfig) {
    super(scene, x, y, config.texture);
    this.bossName = config.name;
    this.maxHp = config.maxHp;
    this.hp = config.maxHp;
    this.damage = config.damage;
    this.speed = config.speed;
    this.setScale(config.scale);
    this.dying = false;
  }

  initBody() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;
    const bw = this.width * 0.5;
    const bh = this.height * 0.5;
    body.setSize(bw, bh);
    body.setOffset((this.width - bw) / 2, (this.height - bh) / 2);
  }

  private getBody(): Phaser.Physics.Arcade.Body | null {
    return this.body as Phaser.Physics.Arcade.Body ?? null;
  }

  tick(_time: number, delta: number, playerX: number, playerY: number) {
    const body = this.getBody();
    if (!body || !body.enable) return;

    this.phaseTimer += delta;

    switch (this.phase) {
      case "chase":
        this.doChase(body, playerX, playerY);
        if (this.phaseTimer > 4000) this.enterPhase("charge", playerX, playerY);
        break;
      case "charge":
        this.doCharge(body);
        if (this.phaseTimer > 1200) this.enterPhase("spin", playerX, playerY);
        break;
      case "spin":
        this.doSpin(body, playerX, playerY, delta);
        if (this.phaseTimer > 3000) this.enterPhase("rest", playerX, playerY);
        break;
      case "rest":
        body.setVelocity(0);
        if (this.phaseTimer > 1500) this.enterPhase("chase", playerX, playerY);
        break;
    }

    this.flipX = body.velocity.x < 0;
  }

  private enterPhase(next: BossPhase, playerX: number, playerY: number) {
    this.phase = next;
    this.phaseTimer = 0;
    if (next === "charge") {
      this.chargeTarget = { x: playerX, y: playerY };
      this.setTint(0xff6600);
      this.scene.time.delayedCall(400, () => { if (this.active) this.clearTint(); });
    }
    if (next === "spin") {
      this.spinAngle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
    }
  }

  private doChase(body: Phaser.Physics.Arcade.Body, px: number, py: number) {
    const a = Phaser.Math.Angle.Between(this.x, this.y, px, py);
    body.setVelocity(Math.cos(a) * this.speed, Math.sin(a) * this.speed);
  }

  private doCharge(body: Phaser.Physics.Arcade.Body) {
    const a = Phaser.Math.Angle.Between(this.x, this.y, this.chargeTarget.x, this.chargeTarget.y);
    body.setVelocity(Math.cos(a) * this.speed * 3, Math.sin(a) * this.speed * 3);
  }

  private doSpin(body: Phaser.Physics.Arcade.Body, px: number, py: number, delta: number) {
    this.spinAngle += delta * 0.003;
    const tx = px + Math.cos(this.spinAngle) * 150;
    const ty = py + Math.sin(this.spinAngle) * 150;
    const a = Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
    body.setVelocity(Math.cos(a) * this.speed * 1.5, Math.sin(a) * this.speed * 1.5);
  }

  takeDamage(amount: number, isCrit = false): boolean {
    if (this.dying || !this.active) return false;
    this.hp -= amount;
    this.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.scene.time.delayedCall(80, () => { if (this.active) this.clearTint(); });
    this.scene.events.emit("enemy-damaged", this.x, this.y, amount, isCrit);

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private die() {
    if (this.dying) return;
    this.dying = true;
    const body = this.getBody();
    if (body) { body.setVelocity(0); body.enable = false; }
    this.setActive(false);
    this.scene.events.emit("boss-killed");
    this.scene.tweens.add({
      targets: this, scaleX: 0, scaleY: 0, alpha: 0, angle: 360,
      duration: 800, onComplete: () => this.setVisible(false),
    });
  }
}
