import Phaser from "phaser";
import { Disciple } from "../entities/Disciple";
import { WukongAI } from "./WukongAI";
import { BajieAI } from "./BajieAI";
import { WujingAI } from "./WujingAI";
import { UltimateSystem } from "./UltimateSystem";
import { WujingAbilities } from "./WujingAbilities";
import { CloneSystem } from "./CloneSystem";
import { CombatSystem } from "./CombatSystem";
import { BossSystem } from "./BossSystem";
import { Boss } from "../entities/Boss";
import { WUKONG, BAJIE, WUJING, BAILONGMA } from "../config/HeroConfig";
import { UpgradeState } from "../config/UpgradeConfig";
import { POIConfig } from "../config/MapConfig";
import { HeadbandBuff } from "./TangsengSkills";

export class DiscipleManager {
  private scene: Phaser.Scene;
  private disciples: Disciple[] = [];
  private map = new Map<string, Disciple>();
  private wukongAI = new WukongAI();
  private bajieAI = new BajieAI();
  private wujingAI = new WujingAI();
  private ultimates: UltimateSystem;
  private wujingAbilities: WujingAbilities;
  private cloneSystem: CloneSystem;
  private critRate = 0;
  private critMultiplier = 1.5;
  private lastTrailTime = 0;
  private lastBajieTrailTime = 0;
  private lastWujingTrailTime = 0;
  private headbandBuff: HeadbandBuff = { dmgMul: 1, spdMul: 1, allDisciples: false };

  constructor(scene: Phaser.Scene, cx: number, cy: number) {
    this.scene = scene;
    this.ultimates = new UltimateSystem(scene);
    this.wujingAbilities = new WujingAbilities(scene);
    this.cloneSystem = new CloneSystem(scene);
    const horse = new Disciple(scene, cx, cy + 40, "bailongma", 0, 0, true);
    horse.setTint(0xc89060);
    this.disciples.push(horse);
    this.map.set("horse", horse);
  }

  recruit(poi: POIConfig, px: number, py: number) {
    const key = poi.recruitKey!;

    if (key === "bailongma") {
      const oldHorse = this.map.get("horse");
      if (oldHorse) {
        this.map.delete("horse");
        this.showDragonTransform(oldHorse);
        oldHorse.clearTint();
        this.map.set("bailongma", oldHorse);
        this.ultimates.register("bailongma");
      }
      return;
    }

    const d = new Disciple(this.scene, px, py, key, 0, 0);
    this.disciples.push(d);
    this.map.set(key, d);
    if (key === "wukong") d.configureAttack({ type: "arc", damage: WUKONG.attack.damage, range: WUKONG.attack.range, cooldownMs: WUKONG.attack.cooldownMs, arcDeg: WUKONG.attack.arcDeg });
    else if (key === "bajie") d.configureAttack({ type: "area", damage: BAJIE.attack.damage, range: BAJIE.attack.range, cooldownMs: BAJIE.attack.cooldownMs, knockbackForce: BAJIE.attack.knockbackForce });
    else if (key === "wujing") d.configureAttack({ type: "projectile", damage: WUJING.attack.damage, range: WUJING.attack.range, cooldownMs: WUJING.attack.cooldownMs });
    this.ultimates.register(key);
  }

  private showDragonTransform(horse: Disciple) {
    horse.setTint(0xff3333);
    this.scene.cameras.main.shake(300, 0.01);

    this.scene.time.delayedCall(400, () => {
      horse.setTint(0xffffff);
      this.scene.cameras.main.flash(400, 200, 230, 255);

      const dragon = this.scene.add.circle(horse.x, horse.y, 10, 0x88ccff, 0.7).setDepth(500);
      this.scene.tweens.add({
        targets: dragon, radius: 120, alpha: 0, duration: 600, ease: "Sine.easeOut",
        onComplete: () => dragon.destroy(),
      });

      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const scale = this.scene.add.circle(
          horse.x + Math.cos(a) * 20, horse.y + Math.sin(a) * 20,
          3, 0xaaddff, 0.8,
        ).setDepth(501);
        this.scene.tweens.add({
          targets: scale,
          x: horse.x + Math.cos(a) * 80, y: horse.y + Math.sin(a) * 80 - 20,
          alpha: 0, scale: 0, duration: 600 + Math.random() * 300,
          onComplete: () => scale.destroy(),
        });
      }

      this.scene.time.delayedCall(300, () => horse.clearTint());
    });
  }

  update(time: number, delta: number, px: number, py: number, facing: string, moving: boolean,
    hpRatio: number, enemies: Phaser.Physics.Arcade.Group, combat: CombatSystem, boss: BossSystem) {
    const activeBoss = boss.getBoss();

    this.updateWukong(time, delta, px, py, facing, moving, hpRatio, enemies, combat, boss, activeBoss);
    this.updateBajie(time, delta, px, py, facing, moving, enemies, combat, boss, activeBoss);
    this.updateWujing(time, delta, px, py, facing, moving, enemies, combat, activeBoss);

    const horse = this.map.get("bailongma") ?? this.map.get("horse");
    if (horse) horse.updateFollow(px, py + BAILONGMA.followOffsetY, facing, moving, BAILONGMA.followLerp);

    this.ultimates.update(delta, activeBoss?.active ? activeBoss : null, this.map);
  }

  private updateWukong(time: number, delta: number, px: number, py: number, facing: string, moving: boolean,
    hpRatio: number, enemies: Phaser.Physics.Arcade.Group, combat: CombatSystem, boss: BossSystem, activeBoss: Boss | null) {
    const wukong = this.map.get("wukong");
    if (!wukong) return;

    const baseDmg = wukong.attackDamage;
    const baseCd = wukong.attackCooldownMs;
    if (this.headbandBuff.dmgMul !== 1) wukong.attackDamage = Math.round(baseDmg * this.headbandBuff.dmgMul);
    if (this.headbandBuff.spdMul !== 1) wukong.attackCooldownMs = Math.round(baseCd * this.headbandBuff.spdMul);
    wukong.isCrit = this.rollCrit();
    if (wukong.isCrit) wukong.attackDamage = Math.round(wukong.attackDamage * this.critMultiplier);

    let r = this.wukongAI.update(wukong, px, py, facing, moving, enemies, time, delta, hpRatio);
    if (r) {
      combat.handleAttackResult(r);
      boss.checkDamage(r, wukong.attackDamage, wukong.isCrit);
      if (wukong.isCrit) this.emitCrit(wukong.x, wukong.y);
    }

    if (!r && activeBoss?.active) {
      this.moveToward(wukong, activeBoss.x, activeBoss.y, 250);
      this.playAnimByVelocity(wukong, "wukong", facing, moving);
      r = wukong.tryAttackTarget(time, activeBoss.x, activeBoss.y);
      if (r) {
        combat.handleAttackResult(r);
        boss.checkDamage(r, wukong.attackDamage, wukong.isCrit);
        if (wukong.isCrit) this.emitCrit(activeBoss.x, activeBoss.y);
      }
    }

    wukong.attackDamage = baseDmg;
    wukong.attackCooldownMs = baseCd;
    wukong.isCrit = false;
    this.showTrail(wukong, this.wukongAI.getState(), time, "lastTrailTime", 80, 4, 0xffaa00, 250);
    this.cloneSystem.update(wukong, time, enemies, 0.5);
  }

  private updateBajie(time: number, delta: number, px: number, py: number, facing: string, moving: boolean,
    enemies: Phaser.Physics.Arcade.Group, combat: CombatSystem, boss: BossSystem, activeBoss: Boss | null) {
    const bajie = this.map.get("bajie");
    if (!bajie) return;

    const baseDmg = bajie.attackDamage;
    const baseCd = bajie.attackCooldownMs;
    if (this.headbandBuff.allDisciples) {
      if (this.headbandBuff.dmgMul !== 1) bajie.attackDamage = Math.round(baseDmg * 1.3);
      if (this.headbandBuff.spdMul !== 1) bajie.attackCooldownMs = Math.round(baseCd * 0.8);
    }
    bajie.isCrit = this.rollCrit();
    if (bajie.isCrit) bajie.attackDamage = Math.round(bajie.attackDamage * this.critMultiplier);

    let r = this.bajieAI.update(bajie, px, py, facing, moving, enemies, time, delta);
    if (r) {
      combat.handleAttackResult(r);
      boss.checkDamage(r, bajie.attackDamage, bajie.isCrit);
      this.showChargeVfx(bajie.x, bajie.y);
    }

    if (!r && activeBoss?.active) {
      this.moveToward(bajie, activeBoss.x, activeBoss.y, 200);
      this.playAnimByVelocity(bajie, "bajie", facing, moving);
      r = bajie.tryAttackTarget(time, activeBoss.x, activeBoss.y);
      if (r) {
        combat.handleAttackResult(r);
        boss.checkDamage(r, bajie.attackDamage, bajie.isCrit);
        this.showChargeVfx(bajie.x, bajie.y);
      }
    }

    bajie.attackDamage = baseDmg;
    bajie.attackCooldownMs = baseCd;
    bajie.isCrit = false;
    this.showTrail(bajie, this.bajieAI.getState(), time, "lastBajieTrailTime", 120, 5, 0x88cc44, 300);
  }

  private updateWujing(time: number, delta: number, px: number, py: number, facing: string, moving: boolean,
    enemies: Phaser.Physics.Arcade.Group, combat: CombatSystem, activeBoss: Boss | null) {
    const wujing = this.map.get("wujing");
    if (!wujing) return;

    const baseDmg = wujing.attackDamage;
    const baseCd = wujing.attackCooldownMs;
    if (this.headbandBuff.allDisciples) {
      if (this.headbandBuff.dmgMul !== 1) wujing.attackDamage = Math.round(baseDmg * 1.3);
      if (this.headbandBuff.spdMul !== 1) wujing.attackCooldownMs = Math.round(baseCd * 0.8);
    }
    wujing.isCrit = this.rollCrit();
    if (wujing.isCrit) wujing.attackDamage = Math.round(wujing.attackDamage * this.critMultiplier);

    const bossRef = activeBoss?.active ? activeBoss : null;
    const r = this.wujingAI.update(wujing, px, py, facing, moving, enemies, time, delta, bossRef);
    if (r) combat.handleAttackResult(r);

    wujing.attackDamage = baseDmg;
    wujing.attackCooldownMs = baseCd;
    wujing.isCrit = false;
    this.showTrail(wujing, this.wujingAI.getState(), time, "lastWujingTrailTime", 100, 4, 0x4488ff, 300);
    this.wujingAbilities.update(delta, wujing, px, py, enemies, bossRef);
  }

  syncUpgrades(upgrades: UpgradeState) {
    const wk = this.map.get("wukong");
    if (wk) { wk.attackDamage = upgrades.wukongDamage; wk.attackRange = upgrades.wukongRange; wk.attackCooldownMs = upgrades.wukongCooldown; }
    const bj = this.map.get("bajie");
    if (bj) { bj.attackRange = upgrades.bajieAoeRadius; bj.attackCooldownMs = upgrades.bajieCooldown; }
    this.critRate = upgrades.critRate;
    this.critMultiplier = upgrades.critDmgMultiplier;
    if (wk) this.cloneSystem.sync(upgrades, wk);
    this.ultimates.setCooldown("wukong", upgrades.wukongUltCd);
    this.ultimates.setCooldown("bajie", upgrades.bajieUltCd);
    this.ultimates.setCooldown("wujing", upgrades.wujingUltCd);
    this.ultimates.setCooldown("bailongma", upgrades.bailongmaUltCd);
  }

  private rollCrit(): boolean {
    return this.critRate > 0 && Math.random() < this.critRate;
  }

  // --- Helpers ---

  private moveToward(d: Disciple, tx: number, ty: number, speed: number) {
    const body = d.body as Phaser.Physics.Arcade.Body;
    if (!body) return;
    const dist = Phaser.Math.Distance.Between(d.x, d.y, tx, ty);
    if (dist < d.attackRange * 0.8) { body.setVelocity(0); return; }
    const angle = Phaser.Math.Angle.Between(d.x, d.y, tx, ty);
    body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  private playAnimByVelocity(d: Disciple, heroKey: string, fallback: string, fallbackMoving: boolean) {
    const body = d.body as Phaser.Physics.Arcade.Body;
    if (!body) return;
    const vx = body.velocity.x, vy = body.velocity.y;
    const mv = Math.abs(vx) > 5 || Math.abs(vy) > 5;
    const f = mv ? (Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? "right" : "left") : (vy > 0 ? "down" : "up")) : fallback;
    const key = `${heroKey}_${f}_${mv || fallbackMoving ? "walk" : "idle"}`;
    if (d.anims.currentAnim?.key !== key) d.play(key);
  }

  private showTrail(d: Disciple, state: string, time: number, timerKey: string,
    interval: number, radius: number, color: number, duration: number) {
    const engageStates = ["engage", "return", "approach"];
    if (!engageStates.includes(state)) return;
    const last = (this as any)[timerKey] as number;
    if (time - last < interval) return;
    (this as any)[timerKey] = time;
    const t = this.scene.add.circle(d.x, d.y, radius, color, 0.5).setDepth(0);
    this.scene.tweens.add({ targets: t, alpha: 0, scale: 0, duration, onComplete: () => t.destroy() });
  }

  private emitCrit(x: number, y: number) {
    const vfx = this.scene.add.image(x, y - 20, "vfx_wukong_fireeyes")
      .setDepth(500).setDisplaySize(60, 60).setAlpha(0);
    this.scene.tweens.add({
      targets: vfx, alpha: 0.9, displayWidth: 90, displayHeight: 90, duration: 150, ease: "Sine.easeOut",
      onComplete: () => {
        this.scene.tweens.add({ targets: vfx, alpha: 0, y: y - 40, duration: 300, onComplete: () => vfx.destroy() });
      },
    });
  }

  private showChargeVfx(x: number, y: number) {
    const vfx = this.scene.add.image(x, y, "vfx_bajie_charge")
      .setDepth(95).setDisplaySize(30, 30).setAlpha(0).setAngle(Phaser.Math.Between(0, 360));
    this.scene.tweens.add({
      targets: vfx, alpha: 0.8, displayWidth: 100, displayHeight: 100, duration: 200, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({ targets: vfx, alpha: 0, displayWidth: 120, displayHeight: 120, duration: 300, onComplete: () => vfx.destroy() });
      },
    });
  }

  setHeadbandBuff(buff: HeadbandBuff) { this.headbandBuff = buff; }
  getUltimateCooldowns(): { key: string; ratio: number }[] { return this.ultimates.getCooldowns(); }
  hideHorse() { (this.map.get("bailongma") ?? this.map.get("horse"))?.setVisible(false); }
  showHorse() { (this.map.get("bailongma") ?? this.map.get("horse"))?.setVisible(true); }
  has(key: string): boolean { return this.map.has(key); }
  getAll(): Disciple[] { return this.disciples; }
  getClones(): Phaser.GameObjects.Sprite[] { return this.cloneSystem.getAll(); }
}
