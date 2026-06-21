import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { EnemySpawner } from "../systems/EnemySpawner";
import { ExperienceSystem } from "../systems/ExperienceSystem";
import { CombatSystem } from "../systems/CombatSystem";
import { DecorationSystem } from "../systems/DecorationSystem";
import { DiscipleManager } from "../systems/DiscipleManager";
import { BossSystem } from "../systems/BossSystem";
import { RecruitmentSystem } from "../systems/RecruitmentSystem";
import { LandmarkSystem } from "../systems/LandmarkSystem";
import { FogOfWar } from "../systems/FogOfWar";
import { LevelUpPanel } from "../ui/LevelUpPanel";
import { HUD, CooldownInfo } from "../ui/HUD";
import { MiniMap } from "../ui/MiniMap";
import { PauseMenu } from "../ui/PauseMenu";
import { GameOverPanel } from "../ui/GameOverPanel";
import { SkillBar } from "../ui/SkillBar";
import { EvolutionSystem } from "../systems/EvolutionSystem";
import { TangsengSkills } from "../systems/TangsengSkills";
import { DragonTrail } from "../systems/DragonTrail";
import { ChestSystem } from "../systems/ChestSystem";
import { ItemBar } from "../ui/ItemBar";
import { SoundManager } from "../systems/SoundManager";
import { WORLD, SOLO_UPGRADES, UpgradeState, UpgradeOption, defaultUpgradeState } from "../config/GameConfig";
import { generatePOIs } from "../config/MapConfig";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private discipleMgr!: DiscipleManager;
  private enemies!: Phaser.Physics.Arcade.Group;
  private spawner!: EnemySpawner;
  private xpSystem!: ExperienceSystem;
  private combat!: CombatSystem;
  private bossSystem!: BossSystem;
  private recruitment!: RecruitmentSystem;
  private fog!: FogOfWar;
  private miniMap!: MiniMap;
  private levelUpPanel!: LevelUpPanel;
  private hud!: HUD;
  private skillBar!: SkillBar;
  private pauseMenu!: PauseMenu;
  private gameOverPanel!: GameOverPanel;
  private evolution!: EvolutionSystem;
  private tangsengSkills!: TangsengSkills;
  private dragonTrail!: DragonTrail;
  private chestSystem!: ChestSystem;
  private itemBar!: ItemBar;
  private soundMgr = new SoundManager();

  private kills = 0;
  private pendingLevelUps = 0;
  private gameOver = false;
  private upgrades!: UpgradeState;

  constructor() { super("GameScene"); }

  create() {
    this.upgrades = defaultUpgradeState();
    this.kills = 0; this.pendingLevelUps = 0; this.gameOver = false;
    const cx = WORLD.width / 2, cy = WORLD.height / 2;
    this.physics.world.setBounds(-200, -200, WORLD.width + 400, WORLD.height + 400);
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.add.tileSprite(cx, cy, WORLD.width, WORLD.height, "grass_tile").setDepth(-1);

    this.player = new Player(this, cx, cy);
    (this.player.body as Phaser.Physics.Arcade.Body).setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, WORLD.width, WORLD.height));
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    const pois = generatePOIs();
    this.discipleMgr = new DiscipleManager(this, cx, cy);
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: false });
    this.spawner = new EnemySpawner(this, this.enemies);
    this.combat = new CombatSystem(this, this.enemies);
    new DecorationSystem(this);
    this.fog = new FogOfWar(this);
    new LandmarkSystem(this, pois);

    this.recruitment = new RecruitmentSystem(this, pois, (poi) => { this.discipleMgr.recruit(poi, this.player.x, this.player.y); this.soundMgr.recruit(); });
    this.bossSystem = new BossSystem(this, pois);
    this.bossSystem.setRecruitment(this.recruitment);
    this.xpSystem = new ExperienceSystem(this, () => this.onLevelUp());
    this.miniMap = new MiniMap(this, pois);

    this.setupEvents();
    this.levelUpPanel = new LevelUpPanel(this, (opt) => this.applyUpgrade(opt));
    this.evolution = new EvolutionSystem(this,
      this.levelUpPanel.getLevels(), this.levelUpPanel.getMaxLevels(),
      (r) => { this.skillBar.addOrUpgrade(r.id, "", `[进化] ${r.name}`); });
    this.hud = new HUD(this);
    this.skillBar = new SkillBar(this);
    this.tangsengSkills = new TangsengSkills(this);
    this.dragonTrail = new DragonTrail(this);
    this.itemBar = new ItemBar(this, (item) => {
      item.apply({ upgrades: this.upgrades, player: this.player, enemies: this.enemies, scene: this });
      this.player.maxHp = this.upgrades.playerMaxHp;
      this.player.moveSpeed = this.upgrades.playerSpeed;
      this.player.shieldMax = this.upgrades.shieldMax;
      this.soundMgr.itemUse();
    });
    this.chestSystem = new ChestSystem(this, pois, (item) => {
      this.soundMgr.chestOpen();
      if (!this.itemBar.addItem(item)) {
        item.apply({ upgrades: this.upgrades, player: this.player, enemies: this.enemies, scene: this });
      }
    });
    this.pauseMenu = new PauseMenu(this, () => !this.gameOver && !this.levelUpPanel.isActive(), () => this.soundMgr.pause(), () => this.soundMgr.resume());
    this.gameOverPanel = new GameOverPanel(this);

    const muteKey = this.input.keyboard!.addKey("M");
    const muteTxt = this.add.text(20, 575, "", { fontSize: "10px", color: "#888888" })
      .setScrollFactor(0).setDepth(900);
    muteKey.on("down", () => {
      const muted = this.soundMgr.toggleMute();
      muteTxt.setText(muted ? "🔇 静音 (M)" : "");
      if (!muted) muteTxt.setText("🔊").setAlpha(1);
      if (!muted) this.time.delayedCall(1000, () => muteTxt.setText(""));
    });

    this.time.addEvent({ delay: 5_000, loop: true, callback: () => {
      if (this.gameOver) return;
      if (this.upgrades.regenPerTick > 0) { this.player.heal(this.upgrades.regenPerTick); this.soundMgr.heal(); }
      if (this.player.hp < this.player.maxHp * 0.5) { this.player.heal(5); this.player.showChantEffect(); this.soundMgr.heal(); }
      if (this.player.hp < this.player.maxHp * 0.25) { this.soundMgr.lowHpWarning(); } }});
    this.soundMgr.startBgm();
  }

  private setupEvents() {
    this.events.on("enemy-killed", (x: number, y: number, v: number) => {
      this.kills++;
      this.xpSystem.spawnOrb(x, y, v);
      if (this.upgrades.killHeal > 0) this.player.heal(this.upgrades.killHeal);
      this.soundMgr.enemyDeath();
    });
    this.events.on("boss-spawned", () => {
      this.player.mountHorse();
      this.discipleMgr.hideHorse();
      this.soundMgr.bossAppear();
      this.soundMgr.mountHorse();
    });
    this.events.on("boss-killed", () => {
      const stats = { elapsedMs: this.spawner.getElapsed(), kills: this.kills, level: this.xpSystem.getLevel(), bossName: this.bossSystem.getBoss()?.bossName ?? "" };
      this.bossSystem.onBossKilled(stats);
      this.player.dismountHorse();
      this.discipleMgr.showHorse();
      if (this.bossSystem.isAllDefeated()) { this.gameOver = true; this.soundMgr.victory(); this.soundMgr.stopBgm(); }
      else { this.soundMgr.bossDefeat(); }
    });
    this.events.on("xp-collected", () => { this.soundMgr.xpPickup(); });
    this.events.on("ultimate-activated", () => { this.soundMgr.ultimate(); });
    this.events.on("headband-activated", () => { this.soundMgr.headband(); });
    this.events.on("mercy-released", () => { this.soundMgr.mercy(); });
    this.events.on("evolution-triggered", () => { this.soundMgr.evolution(); });
    this.events.on("wave-changed", () => { this.soundMgr.waveChange(); });
    this.events.on("enemy-damaged", () => { this.soundMgr.enemyHit(); });

    const eProjGroup = this.physics.add.group();
    this.physics.add.overlap(this.player, eProjGroup, (_p, _proj) => {
      try {
        const proj = _proj as Phaser.Physics.Arcade.Sprite;
        if (!proj.active || this.player.invincible) return;
        const dmg = proj.getData("damage") as number;
        if (dmg == null) return;
        this.player.takeDamage(dmg, this.upgrades.damageMultiplier);
        this.soundMgr.playerHit();
        proj.setActive(false).setVisible(false);
        const b = proj.body as Phaser.Physics.Arcade.Body;
        if (b) b.enable = false;
      } catch (e) { console.error("Player-eProj overlap error:", e); }
    });
    this.events.on("enemy-shoot", (x: number, y: number, tx: number, ty: number, dmg: number) => {
      try {
        const p = eProjGroup.get(x, y, "enemy_proj_tex") as Phaser.Physics.Arcade.Sprite | null;
        if (!p) return;
        p.setActive(true).setVisible(true).setPosition(x, y).setScale(1).setAlpha(1).setData("damage", dmg);
        const b = p.body as Phaser.Physics.Arcade.Body; b.enable = true;
        const a = Phaser.Math.Angle.Between(x, y, tx, ty); b.setVelocity(Math.cos(a) * 200, Math.sin(a) * 200);
        this.time.delayedCall(3000, () => { if (p.active) { p.setActive(false).setVisible(false); b.enable = false; } });
      } catch (e) { console.error("Enemy-shoot error:", e); }
    });
    this.events.on("enemy-explode", (x: number, y: number, dmg: number, r: number) => {
      try {
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) <= r && !this.player.invincible)
          { this.player.takeDamage(dmg, this.upgrades.damageMultiplier); this.soundMgr.explosion(); this.cameras.main.shake(200, 0.01); }
      } catch (e) { console.error("Enemy-explode error:", e); }
    });
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => {
      try {
        const en = e as Enemy; if (!en.active || this.player.invincible) return;
        this.player.takeDamage(en.damage, this.upgrades.damageMultiplier); this.soundMgr.playerHit(); this.cameras.main.shake(100, 0.005);
      } catch (e) { console.error("Player-enemy overlap error:", e); }
    });
  }

  update(time: number, delta: number) {
    if (this.gameOver || this.levelUpPanel.isActive() || this.pauseMenu.isPaused()) return;
    try { this.tick(time, delta); } catch (e) {
      console.error("GameScene error:", e);
      this.add.text(400, 300, `ERROR: ${e instanceof Error ? e.message : e}`, {
        fontSize: "14px", color: "#ff0000", backgroundColor: "#000000", padding: { x: 10, y: 10 },
      }).setScrollFactor(0).setDepth(9999).setOrigin(0.5);
      this.gameOver = true;
    }
  }

  private tick(time: number, delta: number) {
    const moving = this.player.handleMovement();
    if (this.player.isDead()) {
      if (this.upgrades.deathSaves > 0) { this.upgrades.deathSaves--; this.player.triggerDeathSave(); this.soundMgr.deathSave(); }
      else { this.gameOver = true; this.soundMgr.gameOver(); this.soundMgr.stopBgm(); this.gameOverPanel.show({ elapsedMs: this.spawner.getElapsed(), kills: this.kills, level: this.xpSystem.getLevel() }); return; }
    }

    this.discipleMgr.syncUpgrades(this.upgrades);
    this.bossSystem.setBossExtraDmg(this.upgrades.bossExtraDmg);
    this.tangsengSkills.sync(this.upgrades.headbandLevel, this.upgrades.mercyLevel);
    this.tangsengSkills.update(delta, this.discipleMgr.has("wukong"), this.enemies, this.player);
    if (this.discipleMgr.has("bailongma")) {
      this.dragonTrail.sync(this.upgrades.trailLevel);
      this.dragonTrail.update(delta, this.player.x, this.player.y, moving, this.enemies);
    }
    this.discipleMgr.setHeadbandBuff(this.tangsengSkills.getHeadbandBuff());
    this.discipleMgr.update(time, delta, this.player.x, this.player.y, this.player.facing, moving,
      this.player.hp / this.player.maxHp, this.enemies, this.combat, this.bossSystem);

    for (const child of this.enemies.getChildren()) { const e = child as Enemy; if (e.active) e.chase(this.player.x, this.player.y, delta); }

    this.spawner.update(delta);
    this.recruitment.update(this.player.x, this.player.y);
    this.bossSystem.update(time, delta, this.player.x, this.player.y, this.player, this.combat, this.upgrades.damageMultiplier);
    this.xpSystem.setAttractRadius(this.upgrades.xpAttractRadius);
    this.xpSystem.update(this.player.x, this.player.y);
    if (this.upgrades.auraRadius > 0) this.tickAura(delta);
    this.player.updateShieldVisual();
    this.chestSystem.update(this.player.x, this.player.y, (k) => this.discipleMgr.has(k));
    this.itemBar.update();
    this.fog.update(this.player.x, this.player.y);
    this.miniMap.update(this.player.x, this.player.y, this.fog, this.chestSystem.getUnopenedPositions());
    this.ySortAll();
    this.combat.drawEnemyHpBars();
    this.hud.update(this.player.hp, this.player.maxHp, this.xpSystem.getXp(), this.xpSystem.getXpToNext(),
      this.xpSystem.getLevel(), this.spawner.getElapsed(), this.kills);
    this.hud.updateCooldowns(this.collectCooldowns());
  }

  private collectCooldowns(): CooldownInfo[] {
    const cds: CooldownInfo[] = [];
    const ultNames: Record<string, string> = { wukong: "齐天大圣", bajie: "天蓬元帅", wujing: "卷帘大将", bailongma: "龙太子化龙" };
    const ultColors: Record<string, number> = { wukong: 0xff9900, bajie: 0x88cc44, wujing: 0x4488ff, bailongma: 0x88ccff };
    for (const u of this.discipleMgr.getUltimateCooldowns()) {
      cds.push({ name: ultNames[u.key] ?? u.key, ratio: u.ratio, color: ultColors[u.key] ?? 0xffffff });
    }
    const hbr = this.tangsengSkills.getHeadbandRatio();
    if (hbr >= 0) cds.push({ name: "紧箍咒", ratio: hbr, color: 0xffdd44, active: this.tangsengSkills.isHeadbandActive() });
    const mr = this.tangsengSkills.getMercyChargeRatio();
    if (mr >= 0) cds.push({ name: "大慈悲", ratio: mr, color: 0xffffff });
    return cds;
  }

  private ySortAll() {
    const objs: Phaser.GameObjects.GameObject[] = [this.player, ...this.discipleMgr.getAll()];
    const boss = this.bossSystem.getBoss();
    if (boss?.active) objs.push(boss);
    for (const child of this.enemies.getChildren()) { if (child.active) objs.push(child); }
    objs.sort((a, b) => (a as any).y - (b as any).y);
    objs.forEach((s, i) => (s as any).setDepth(100 + i));
  }

  private auraRing?: Phaser.GameObjects.Arc;
  private tickAura(delta: number) {
    const { auraRadius: r, auraDps, auraSlow } = this.upgrades;
    if (!this.auraRing) {
      this.auraRing = this.add.circle(this.player.x, this.player.y, r, 0xffdd44, 0.06)
        .setStrokeStyle(1.5, 0xffdd44, 0.25).setDepth(90);
    }
    this.auraRing.setPosition(this.player.x, this.player.y).setRadius(r);
    const dmg = auraDps * (delta / 1000);
    for (const child of this.enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active || Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) > r) continue;
      e.hp -= dmg;
      if (e.hp <= 0) { e.takeDamage(0); continue; }
      (e.body as Phaser.Physics.Arcade.Body).velocity.scale(1 - auraSlow);
    }
  }

  private onLevelUp() { this.pendingLevelUps++; this.soundMgr.levelUp(); if (!this.levelUpPanel.isActive()) this.showNextLevelUp(); }
  private showNextLevelUp() { if (this.pendingLevelUps <= 0) return; this.pendingLevelUps--; this.player.hp = this.player.maxHp; this.levelUpPanel.show(this.discipleMgr.has("wukong") ? undefined : SOLO_UPGRADES); }
  private applyUpgrade(opt: UpgradeOption) {
    opt.apply(this.upgrades);
    const u = this.upgrades, p = this.player;
    p.maxHp = u.playerMaxHp; p.hp = p.maxHp; p.moveSpeed = u.playerSpeed;
    p.shieldMax = u.shieldMax; p.shieldHp = u.shieldMax;
    this.skillBar.addOrUpgrade(opt.id, opt.icon, opt.name);
    this.soundMgr.skillUp();
    this.evolution.check(this.upgrades);
    if (this.pendingLevelUps > 0) this.showNextLevelUp(); }
}
