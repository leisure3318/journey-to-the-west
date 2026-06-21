import Phaser from "phaser";
import { Boss } from "../entities/Boss";
import { Player } from "../entities/Player";
import { AttackResult } from "../entities/Disciple";
import { CombatSystem } from "./CombatSystem";
import { BossHpBar } from "../ui/BossHpBar";
import { VictoryPanel, VictoryStats } from "../ui/VictoryPanel";
import { POIConfig, BOSS_TYPES } from "../config/MapConfig";
import { RecruitmentSystem } from "./RecruitmentSystem";

export class BossSystem {
  private scene: Phaser.Scene;
  private boss: Boss | null = null;
  private hpBar: BossHpBar;
  private victory: VictoryPanel;
  private bossPOIs: POIConfig[];
  private triggered = new Set<string>();
  private recruitment?: RecruitmentSystem;
  private bossOverlap?: Phaser.Physics.Arcade.Collider;

  constructor(scene: Phaser.Scene, pois: POIConfig[]) {
    this.scene = scene;
    this.hpBar = new BossHpBar(scene);
    this.victory = new VictoryPanel(scene);
    this.bossPOIs = pois.filter((p) => p.type === "boss");
  }

  setRecruitment(r: RecruitmentSystem) { this.recruitment = r; }

  update(
    time: number, delta: number,
    playerX: number, playerY: number,
    player: Player, combat: CombatSystem, damageMultiplier: number,
  ) {
    if (this.boss) {
      if (this.boss.active) {
        try {
          this.boss.tick(time, delta, playerX, playerY);
        } catch (e) {
          console.error("Boss tick error:", e);
          this.boss.setActive(false).setVisible(false);
          const body = this.boss.body as Phaser.Physics.Arcade.Body;
          if (body) body.enable = false;
          this.boss = null;
          this.hpBar.hide();
          return;
        }
        this.hpBar.update(this.boss);
      }
      return;
    }

    if (this.recruitment && !this.recruitment.isRecruited("wukong")) return;

    for (const poi of this.bossPOIs) {
      if (this.triggered.has(poi.id)) continue;
      const dist = Phaser.Math.Distance.Between(playerX, playerY, poi.x, poi.y);
      if (dist <= poi.radius) {
        this.triggered.add(poi.id);
        this.spawnAtPOI(poi, player, combat, damageMultiplier);
        break;
      }
    }
  }

  private spawnAtPOI(poi: POIConfig, player: Player, combat: CombatSystem, dmgMul: number) {
    const cfg = BOSS_TYPES[poi.bossKey!];
    if (!cfg) return;

    this.boss = new Boss(this.scene, poi.x, poi.y, cfg);
    this.scene.add.existing(this.boss);
    this.scene.physics.add.existing(this.boss);
    this.boss.initBody();
    this.hpBar.show(this.boss);
    combat.setBoss(this.boss);

    this.bossOverlap = this.scene.physics.add.overlap(player, this.boss, () => {
      try {
        if (!this.boss?.active || player.invincible) return;
        player.takeDamage(this.boss.damage, dmgMul);
        this.scene.cameras.main.shake(150, 0.008);
      } catch (e) { console.error("Player-boss overlap error:", e); }
    });

    this.scene.cameras.main.shake(300, 0.01);
    this.scene.events.emit("boss-spawned");

    const alert = this.scene.add.text(400, 160, poi.message, {
      fontSize: "20px", color: "#ff4444", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(900);
    this.scene.tweens.add({
      targets: alert, alpha: 0, y: "-=30", delay: 2000, duration: 600,
      onComplete: () => alert.destroy(),
    });
  }

  onBossKilled(stats: VictoryStats) {
    if (!this.boss) return;
    this.hpBar.hide();
    const name = this.boss.bossName;
    if (this.bossOverlap) { this.bossOverlap.destroy(); this.bossOverlap = undefined; }
    this.boss = null;

    if (this.triggered.size >= this.bossPOIs.length) {
      this.victory.show(stats);
    } else {
      this.showBossDefeated(name);
    }
  }

  private showBossDefeated(name: string) {
    this.scene.physics.pause();
    const banner = this.scene.add.text(400, 250, `击败 ${name}！`, {
      fontSize: "28px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 5,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(900);
    const hint = this.scene.add.text(400, 295, "继续探索，寻找下一个妖怪...", {
      fontSize: "16px", color: "#cccccc", stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(900);

    this.scene.time.delayedCall(2500, () => {
      banner.destroy(); hint.destroy();
      this.scene.physics.resume();
    });
  }

  setBossExtraDmg(mult: number) { this.bossExtraDmg = mult; }
  private bossExtraDmg = 0;

  checkDamage(result: AttackResult, damage: number, isCrit = false) {
    if (!this.boss?.active) return;
    const dmg = Math.round(damage * (1 + this.bossExtraDmg));
    if (result.type === "arc") {
      const dist = Phaser.Math.Distance.Between(result.x, result.y, this.boss.x, this.boss.y);
      if (dist > result.range) return;
      const angle = Phaser.Math.Angle.Between(result.x, result.y, this.boss.x, this.boss.y);
      let diff = angle - result.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) <= Phaser.Math.DegToRad(result.arcDeg / 2)) this.boss.takeDamage(dmg, isCrit);
    } else if (result.type === "area") {
      const dist = Phaser.Math.Distance.Between(result.x, result.y, this.boss.x, this.boss.y);
      if (dist <= result.range) this.boss.takeDamage(dmg, isCrit);
    }
  }

  isAllDefeated(): boolean { return this.triggered.size >= this.bossPOIs.length && !this.boss; }
  getBoss(): Boss | null { return this.boss; }
}
