import Phaser from "phaser";
import { AttackResult } from "../entities/Disciple";
import { Enemy } from "../entities/Enemy";
import { Boss } from "../entities/Boss";
import { WUKONG, BAJIE, WUJING } from "../config/GameConfig";

export class CombatSystem {
  private scene: Phaser.Scene;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;
  private enemyHpGfx: Phaser.GameObjects.Graphics;
  private bossCollider?: Phaser.Physics.Arcade.Collider;

  constructor(scene: Phaser.Scene, enemies: Phaser.Physics.Arcade.Group) {
    this.scene = scene;
    this.enemies = enemies;

    this.projectiles = scene.physics.add.group();
    scene.physics.add.overlap(this.projectiles, this.enemies, (_p, _e) => {
      try {
        const proj = _p as Phaser.Physics.Arcade.Sprite;
        const enemy = _e as Enemy;
        if (!proj.active || !enemy.active) return;
        const hits = (proj.getData("hits") as number) || 0;
        const maxHits = (proj.getData("maxHits") as number) || 1;
        const baseDmg = proj.getData("damage") as number;
        if (baseDmg == null) return;
        const dmg = Math.round(baseDmg * Math.pow(0.8, hits));
        const isCrit = proj.getData("isCrit") ?? false;
        enemy.takeDamage(dmg, isCrit);
        proj.setData("hits", hits + 1);
        if (hits + 1 >= maxHits) this.deactivateProjectile(proj);
      } catch (e) { console.error("Projectile-enemy overlap error:", e); }
    });

    this.enemyHpGfx = scene.add.graphics().setDepth(800);

    this.scene.events.on("enemy-damaged", (x: number, y: number, amount: number, isCrit?: boolean) => {
      this.showDamageNumber(x, y, amount, isCrit ?? false);
    });
  }

  setBoss(boss: Boss) {
    if (this.bossCollider) { this.bossCollider.destroy(); this.bossCollider = undefined; }
    this.bossCollider = this.scene.physics.add.overlap(this.projectiles, boss, (_p, _b) => {
      try {
        const proj = _p as Phaser.Physics.Arcade.Sprite;
        const b = _b as Boss;
        if (!proj.active || !b.active) return;
        const dmg = proj.getData("damage") as number;
        if (dmg == null) return;
        const isCrit = proj.getData("isCrit") ?? false;
        b.takeDamage(dmg, isCrit);
        this.deactivateProjectile(proj);
      } catch (e) { console.error("Projectile-boss overlap error:", e); }
    });
  }

  private deactivateProjectile(proj: Phaser.Physics.Arcade.Sprite) {
    proj.setActive(false).setVisible(false);
    const body = proj.body as Phaser.Physics.Arcade.Body;
    if (body) body.enable = false;
    this.scene.tweens.killTweensOf(proj);
  }

  handleAttackResult(result: AttackResult) {
    switch (result.type) {
      case "arc":
        this.drawArcAttack(result.x, result.y, result.angle, result.range, result.arcDeg);
        break;
      case "area":
        this.drawAreaAttack(result.x, result.y, result.range);
        break;
      case "projectile":
        this.spawnProjectile(result.fromX, result.fromY, result.targetX, result.targetY, result.damage, result.isCrit);
        break;
    }
  }

  drawEnemyHpBars() {
    this.enemyHpGfx.clear();
    for (const child of this.enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active || e.hp >= e.maxHp) continue;
      const ratio = e.hp / e.maxHp;
      const barW = 30;
      const barH = 3;
      const x = e.x - barW / 2;
      const y = e.y - e.displayHeight / 2 - 8;
      this.enemyHpGfx.fillStyle(0x333333);
      this.enemyHpGfx.fillRect(x, y, barW, barH);
      const color = ratio > 0.5 ? 0x44ff44 : ratio > 0.25 ? 0xffaa00 : 0xff3333;
      this.enemyHpGfx.fillStyle(color);
      this.enemyHpGfx.fillRect(x, y, barW * ratio, barH);
    }
  }

  private drawArcAttack(x: number, y: number, angle: number, range: number, _arcDeg: number) {
    const vfx = this.scene.add.image(x, y, "vfx_wukong_staff_sweep")
      .setDepth(500).setAlpha(0.85).setRotation(angle);
    const size = range * 2;
    vfx.setDisplaySize(size, size);
    this.scene.tweens.add({
      targets: vfx, alpha: 0, scale: vfx.scaleX * 1.2,
      duration: WUKONG.attack.visualMs + 100,
      onComplete: () => vfx.destroy(),
    });
  }

  private drawAreaAttack(x: number, y: number, range: number) {
    const vfx = this.scene.add.image(x, y, "vfx_bajie_rake_slam")
      .setDepth(500).setAlpha(0).setAngle(Phaser.Math.Between(0, 360));
    const size = range * 2.2;
    vfx.setDisplaySize(size * 0.3, size * 0.3);
    this.scene.tweens.add({
      targets: vfx, alpha: 0.9,
      displayWidth: size, displayHeight: size,
      duration: 120, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: vfx, alpha: 0, duration: BAJIE.attack.visualMs,
          onComplete: () => vfx.destroy(),
        });
      },
    });
  }

  private spawnProjectile(fromX: number, fromY: number, targetX: number, targetY: number, damage: number, isCrit = false) {
    const proj = this.projectiles.get(fromX, fromY, "vfx_wujing_staff_throw") as Phaser.Physics.Arcade.Sprite | null;
    if (!proj) return;
    this.scene.tweens.killTweensOf(proj);
    proj.setActive(true).setVisible(true);
    proj.setPosition(fromX, fromY);
    proj.setDisplaySize(32, 32);
    proj.setAlpha(1);
    proj.setData("damage", damage);
    proj.setData("hits", 0);
    proj.setData("maxHits", 3);
    proj.setData("isCrit", isCrit);
    const body = proj.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    body.setCircle(16);
    const angle = Phaser.Math.Angle.Between(fromX, fromY, targetX, targetY);
    proj.setRotation(angle);
    body.setVelocity(
      Math.cos(angle) * WUJING.attack.projectileSpeed,
      Math.sin(angle) * WUJING.attack.projectileSpeed,
    );
    this.scene.tweens.add({ targets: proj, angle: proj.angle + 360, duration: 600, repeat: -1 });
    this.scene.time.delayedCall(2000, () => {
      if (proj.active) this.deactivateProjectile(proj);
    });
  }

  private showDamageNumber(x: number, y: number, amount: number, isCrit: boolean) {
    if (amount <= 0) return;
    const fontSize = isCrit ? "26px" : "15px";
    const color = isCrit ? "#ffcc00" : "#ff8844";
    const label = isCrit ? `${amount}!` : `${amount}`;
    const text = this.scene.add
      .text(x + Phaser.Math.Between(-8, 8), y - 10, label, {
        fontSize, color, fontStyle: "bold",
        stroke: "#000000", strokeThickness: isCrit ? 4 : 2,
      })
      .setOrigin(0.5)
      .setDepth(600);
    if (isCrit) text.setScale(0.5);
    this.scene.tweens.add({
      targets: text,
      y: y - (isCrit ? 55 : 40),
      alpha: 0,
      scaleX: isCrit ? 1.3 : 1,
      scaleY: isCrit ? 1.3 : 1,
      duration: isCrit ? 800 : 600,
      onComplete: () => text.destroy(),
    });
  }
}
