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

  private finalBossKey?: string;
  private finalBossSpawned = false;
  private finalBossDefeated = false;
  private difficulty = 1;
  private playerRef?: Player;
  private combatRef?: CombatSystem;
  private dmgMulRef = 1;

  constructor(scene: Phaser.Scene, pois: POIConfig[]) {
    this.scene = scene;
    this.hpBar = new BossHpBar(scene);
    this.victory = new VictoryPanel(scene);
    this.bossPOIs = pois.filter((p) => p.type === "boss");
  }

  setRecruitment(r: RecruitmentSystem) { this.recruitment = r; }

  setFinalBoss(key: string) { this.finalBossKey = key; }
  setDifficulty(d: number) { this.difficulty = d; }

  update(
    time: number, delta: number,
    playerX: number, playerY: number,
    player: Player, combat: CombatSystem, damageMultiplier: number,
  ) {
    this.playerRef = player;
    this.combatRef = combat;
    this.dmgMulRef = damageMultiplier;

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
    const baseCfg = BOSS_TYPES[poi.bossKey!];
    if (!baseCfg) return;

    const cfg = {
      ...baseCfg,
      maxHp: Math.round(baseCfg.maxHp * this.difficulty),
      damage: Math.round(baseCfg.damage * this.difficulty),
      speed: Math.round(baseCfg.speed * Math.min(this.difficulty, 1.5)),
    };

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

  spawnFinalBoss() {
    if (!this.finalBossKey || !this.playerRef || !this.combatRef) return;
    const baseCfg = BOSS_TYPES[this.finalBossKey];
    if (!baseCfg) return;

    this.finalBossSpawned = true;
    const cfg = {
      ...baseCfg,
      maxHp: Math.round(baseCfg.maxHp * this.difficulty),
      damage: Math.round(baseCfg.damage * this.difficulty),
      speed: Math.round(baseCfg.speed * Math.min(this.difficulty, 1.5)),
    };

    const angle = Math.random() * Math.PI * 2;
    const bx = this.playerRef.x + Math.cos(angle) * 350;
    const by = this.playerRef.y + Math.sin(angle) * 350;

    this.scene.physics.pause();
    this.scene.cameras.main.shake(500, 0.02);
    this.scene.cameras.main.flash(600, 255, 50, 0);

    const warnBg = this.scene.add.rectangle(400, 250, 500, 80, 0x000000, 0.85)
      .setScrollFactor(0).setDepth(950).setAlpha(0);
    const warnText = this.scene.add.text(400, 235, `${baseCfg.name} 降临！`, {
      fontSize: "32px", color: "#ff2222", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 5,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(951).setAlpha(0);
    const warnSub = this.scene.add.text(400, 270, "终极之战", {
      fontSize: "16px", color: "#ffaa44",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(951).setAlpha(0);

    this.scene.tweens.add({
      targets: [warnBg, warnText, warnSub], alpha: 1, duration: 400, ease: "Sine.easeOut",
    });

    this.scene.time.delayedCall(2500, () => {
      this.scene.tweens.add({
        targets: [warnBg, warnText, warnSub], alpha: 0, duration: 400,
        onComplete: () => { warnBg.destroy(); warnText.destroy(); warnSub.destroy(); },
      });
      this.scene.physics.resume();

      this.boss = new Boss(this.scene, bx, by, cfg);
      this.scene.add.existing(this.boss);
      this.scene.physics.add.existing(this.boss);
      this.boss.initBody();
      this.hpBar.show(this.boss);
      this.combatRef!.setBoss(this.boss);

      this.bossOverlap = this.scene.physics.add.overlap(this.playerRef!, this.boss, () => {
        try {
          if (!this.boss?.active || this.playerRef!.invincible) return;
          this.playerRef!.takeDamage(this.boss.damage, this.dmgMulRef);
          this.scene.cameras.main.shake(150, 0.008);
        } catch (e) { console.error("Player-boss overlap error:", e); }
      });

      this.scene.events.emit("boss-spawned");
    });
  }

  onBossKilled(stats: VictoryStats) {
    if (!this.boss) return;
    this.hpBar.hide();
    const name = this.boss.bossName;
    if (this.bossOverlap) { this.bossOverlap.destroy(); this.bossOverlap = undefined; }
    this.boss = null;

    if (this.finalBossSpawned && !this.finalBossDefeated) {
      this.finalBossDefeated = true;
      return;
    }

    if (this.areMiniBossesCleared() && this.finalBossKey && !this.finalBossSpawned) {
      this.showBossDefeated(name);
      this.scene.time.delayedCall(3000, () => this.spawnFinalBoss());
      return;
    }

    if (this.areMiniBossesCleared()) {
      return;
    }

    this.showBossDefeated(name);
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

  areMiniBossesCleared(): boolean {
    return this.triggered.size >= this.bossPOIs.length && !this.boss;
  }

  isFinalBossDefeated(): boolean {
    return this.finalBossDefeated;
  }

  isAllDefeated(): boolean {
    if (this.finalBossKey) {
      return this.finalBossDefeated;
    }
    return this.triggered.size >= this.bossPOIs.length && !this.boss;
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

  getBoss(): Boss | null { return this.boss; }
}
