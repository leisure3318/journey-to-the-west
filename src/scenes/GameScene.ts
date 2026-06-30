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
import { VictoryPanel } from "../ui/VictoryPanel";
import { SkillBar } from "../ui/SkillBar";
import { EvolutionSystem } from "../systems/EvolutionSystem";
import { TangsengSkills } from "../systems/TangsengSkills";
import { DragonTrail } from "../systems/DragonTrail";
import { ChestSystem } from "../systems/ChestSystem";
import { ItemBar } from "../ui/ItemBar";
import { SoundManager } from "../systems/SoundManager";
import { TerrainSystem } from "../systems/TerrainSystem";
import { BossLootSystem } from "../systems/BossLootSystem";
import { ObstacleSystem } from "../systems/ObstacleSystem";
import { BiomeEffects } from "../systems/BiomeEffects";
import { SpatialGrid } from "../systems/SpatialGrid";
import { RelicBar } from "../ui/RelicBar";
import { VirtualJoystick } from "../ui/VirtualJoystick";
import { StageResultPanel } from "../ui/StageResultPanel";
import { WORLD, SOLO_UPGRADES, UpgradeState, UpgradeOption, defaultUpgradeState } from "../config/GameConfig";
import { getStageEnemyTypes } from "../config/EnemyConfig";
import { saveSystem } from "../systems/SaveSystem";
import { generatePOIs, generateStagePOIs } from "../config/MapConfig";
import { STAGES, StageDef, CarryOverState } from "../config/StageConfig";
import { Relic } from "../systems/BossLootSystem";

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
  private bossLoot = new BossLootSystem();
  private relicBar!: RelicBar;
  private biomeEffects!: BiomeEffects;
  private spatialGrid!: SpatialGrid;

  private kills = 0;
  private pendingLevelUps = 0;
  private gameOver = false;
  private upgrades!: UpgradeState;
  private bossesKilled: string[] = [];
  private relics: Relic[] = [];

  private stage?: StageDef;
  private carryOver?: CarryOverState;
  private totalElapsedMs = 0;
  private totalKills = 0;

  constructor() { super("GameScene"); }

  init(data: { stageIndex?: number; carryOver?: CarryOverState }) {
    if (data.stageIndex != null && data.stageIndex < STAGES.length) {
      this.stage = STAGES[data.stageIndex];
      this.carryOver = data.carryOver;
    } else {
      this.stage = STAGES[0];
      this.carryOver = undefined;
    }
  }

  create() {
    const stage = this.stage!;
    WORLD.width = stage.mapWidth;
    WORLD.height = stage.mapHeight;

    if (this.carryOver) {
      this.upgrades = { ...this.carryOver.upgrades };
      this.totalElapsedMs = this.carryOver.totalElapsedMs;
      this.totalKills = this.carryOver.totalKills;
      this.relics = [...this.carryOver.relics];
    } else {
      this.upgrades = defaultUpgradeState();
      this.totalElapsedMs = 0;
      this.totalKills = 0;
      this.relics = [];
    }
    this.kills = 0; this.pendingLevelUps = 0; this.gameOver = false; this.bossesKilled = [];

    const cx = WORLD.width / 2, cy = WORLD.height / 2;
    this.physics.world.setBounds(-200, -200, WORLD.width + 400, WORLD.height + 400);
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    new TerrainSystem(this, stage.biome);

    this.player = new Player(this, cx, cy);
    if (this.carryOver) {
      this.player.maxHp = this.upgrades.playerMaxHp;
      this.player.hp = this.player.maxHp;
      this.player.moveSpeed = this.upgrades.playerSpeed;
      this.player.shieldMax = this.upgrades.shieldMax;
      this.player.shieldHp = this.upgrades.shieldMax;
    }
    (this.player.body as Phaser.Physics.Arcade.Body).setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, WORLD.width, WORLD.height));
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    const pois = generateStagePOIs(stage);
    this.discipleMgr = new DiscipleManager(this, cx, cy);

    if (this.carryOver && this.carryOver.recruitedKeys.length > 0) {
      this.discipleMgr.preRecruit(this.carryOver.recruitedKeys, cx, cy);
    }

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: false });

    const stageEnemies = getStageEnemyTypes(stage.enemyIds);
    this.spawner = new EnemySpawner(this, this.enemies, stageEnemies, stage.difficulty);

    this.combat = new CombatSystem(this, this.enemies);
    new DecorationSystem(this);
    const obstacles = new ObstacleSystem(this);
    this.physics.add.collider(this.player, obstacles.getGroup());
    this.physics.add.collider(this.enemies, obstacles.getGroup());
    this.fog = new FogOfWar(this);
    new LandmarkSystem(this, pois);

    this.recruitment = new RecruitmentSystem(this, pois, (poi) => { this.discipleMgr.recruit(poi, this.player.x, this.player.y); this.soundMgr.recruit(); });
    this.bossSystem = new BossSystem(this, pois);
    this.bossSystem.setRecruitment(this.recruitment);
    this.bossSystem.setFinalBoss(stage.finalBossKey);
    this.bossSystem.setDifficulty(stage.difficulty);

    if (this.carryOver && this.carryOver.recruitedKeys.includes("wukong")) {
      for (const key of this.carryOver.recruitedKeys) {
        this.recruitment.markRecruited(key);
      }
    }

    this.xpSystem = new ExperienceSystem(this, () => this.onLevelUp());
    if (this.carryOver) {
      this.xpSystem.restore(this.carryOver.level, this.carryOver.xp, this.carryOver.xpToNext);
    }

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
      this.showItemEffect(item.name, item.desc, item.tierColor);
    });
    this.chestSystem = new ChestSystem(this, pois, (item) => {
      this.soundMgr.chestOpen();
      if (!this.itemBar.addItem(item)) {
        item.apply({ upgrades: this.upgrades, player: this.player, enemies: this.enemies, scene: this });
      }
    });
    this.relicBar = new RelicBar(this);
    if (this.relics.length > 0) {
      for (const r of this.relics) this.relicBar.addRelic(r);
    }
    const joystick = new VirtualJoystick(this);
    this.player.joystick = joystick;
    this.biomeEffects = new BiomeEffects(this);
    this.spatialGrid = new SpatialGrid(WORLD.width, WORLD.height);
    this.pauseMenu = new PauseMenu(this, () => !this.gameOver && !this.levelUpPanel.isActive(), this.soundMgr, () => this.soundMgr.pause(), () => this.soundMgr.resume());
    this.gameOverPanel = new GameOverPanel(this);

    this.game.canvas.oncontextmenu = (e) => e.preventDefault();
    this.showStageTitle(stage);

    const ultKey = this.input.keyboard!.addKey("Q");
    ultKey.on("down", () => {
      if (this.gameOver || this.levelUpPanel.isActive() || this.pauseMenu.isPaused()) return;
      this.discipleMgr.tryFireUltimate(this.enemies, this.bossSystem.getBoss());
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() && !this.gameOver && !this.levelUpPanel.isActive() && !this.pauseMenu.isPaused()) {
        this.discipleMgr.tryFireUltimate(this.enemies, this.bossSystem.getBoss());
      }
    });

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
    this.soundMgr.setVolume(saveSystem.volume);
    this.soundMgr.startBgm();
  }

  private showStageTitle(stage: StageDef) {
    const bg = this.add.rectangle(400, 80, 400, 50, 0x000000, 0.7)
      .setScrollFactor(0).setDepth(950).setAlpha(0);
    const title = this.add.text(400, 72, stage.title, {
      fontSize: "22px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(951).setAlpha(0);
    const desc = this.add.text(400, 95, stage.description, {
      fontSize: "12px", color: "#ccccaa",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(951).setAlpha(0);

    this.tweens.add({ targets: [bg, title, desc], alpha: 1, duration: 500, ease: "Sine.easeOut" });
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: [bg, title, desc], alpha: 0, duration: 600,
        onComplete: () => { bg.destroy(); title.destroy(); desc.destroy(); },
      });
    });
  }

  private setupEvents() {
    this.events.on("enemy-killed", (x: number, y: number, v: number) => {
      this.kills++;
      this.totalKills++;
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
      try {
        const bossName = this.bossSystem.getBoss()?.bossName ?? "";
        const stats = { elapsedMs: this.spawner.getElapsed(), kills: this.kills, level: this.xpSystem.getLevel(), bossName, bossesKilled: this.bossesKilled };
        this.bossSystem.onBossKilled(stats);
        this.player.dismountHorse();
        this.discipleMgr.showHorse();
        if (bossName) {
          this.bossesKilled.push(bossName);
          const relic = this.bossLoot.generateRelic(bossName);
          this.bossLoot.applyRelic(relic, this.upgrades);
          this.player.maxHp = this.upgrades.playerMaxHp;
          this.player.moveSpeed = this.upgrades.playerSpeed;
          this.player.shieldMax = this.upgrades.shieldMax;
          this.relicBar.addRelic(relic);
          this.relics.push(relic);
          this.showRelicDrop(relic);
        }
        if (this.bossSystem.isFinalBossDefeated()) {
          this.gameOver = true;
          this.soundMgr.victory();
          this.soundMgr.stopBgm();
          this.time.delayedCall(2000, () => this.showStageResult());
        } else if (!this.bossSystem.isFinalBossDefeated()) {
          this.soundMgr.bossDefeat();
        }
      } catch (e) { console.error("boss-killed handler error:", e); }
    });
    this.events.on("xp-collected", () => { this.soundMgr.xpPickup(); });
    this.events.on("ultimate-activated", () => { this.soundMgr.ultimate(); });
    this.events.on("headband-activated", () => { this.soundMgr.headband(); });
    this.events.on("mercy-released", () => { this.soundMgr.mercy(); });
    this.events.on("evolution-triggered", () => { this.soundMgr.evolution(); });
    this.events.on("wave-changed", () => { this.soundMgr.waveChange(); });
    this.events.on("enemy-damaged", () => { this.soundMgr.enemyHit(); });
    this.events.on("enemy-trap", (x: number, y: number, dmg: number) => { this.placeTrap(x, y, dmg); });
    this.events.on("enemy-summon", (x: number, y: number) => { this.summonMinion(x, y); });

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

    this.events.once("shutdown", () => this.cleanup());
  }

  private cleanup() {
    this.gameOver = true;
    const customEvents = [
      "enemy-killed", "boss-spawned", "boss-killed", "xp-collected",
      "ultimate-activated", "headband-activated", "mercy-released",
      "evolution-triggered", "wave-changed", "enemy-damaged",
      "enemy-trap", "enemy-summon", "enemy-shoot", "enemy-explode",
    ];
    for (const e of customEvents) this.events.removeAllListeners(e);
    try { this.combat.destroy(); } catch (e) { console.error("combat destroy:", e); }
    try { this.fog.destroy(); } catch (e) { console.error("fog destroy:", e); }
    try { this.biomeEffects.destroy(); } catch (e) { console.error("biome destroy:", e); }
    if (this.auraRing) { try { this.auraRing.destroy(); } catch (_) {} this.auraRing = undefined; }
    this.soundMgr.stopBgm();
    try { if (this.enemies?.children) this.enemies.clear(true, true); } catch (e) { console.error("enemies clear:", e); }
  }

  private showStageResult() {
    const recruited: string[] = [];
    for (const key of ["wukong", "bailongma", "bajie", "wujing"]) {
      if (this.discipleMgr.has(key)) recruited.push(key);
    }
    const carry: CarryOverState = {
      stageIndex: this.stage!.index,
      upgrades: { ...this.upgrades },
      recruitedKeys: recruited,
      level: this.xpSystem.getLevel(),
      xp: this.xpSystem.getXp(),
      xpToNext: this.xpSystem.getXpToNext(),
      totalElapsedMs: this.totalElapsedMs + this.spawner.getElapsed(),
      totalKills: this.totalKills,
      relics: [...this.relics],
    };
    new StageResultPanel(this).show({
      stageIndex: this.stage!.index,
      elapsedMs: this.totalElapsedMs + this.spawner.getElapsed(),
      kills: this.totalKills,
      level: this.xpSystem.getLevel(),
      hpRatio: this.player.hp / this.player.maxHp,
      bossesKilled: this.bossesKilled,
      carryOver: carry,
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
      else {
        this.gameOver = true; this.soundMgr.gameOver(); this.soundMgr.stopBgm();
        this.hud.update(0, this.player.maxHp, this.xpSystem.getXp(), this.xpSystem.getXpToNext(),
          this.xpSystem.getLevel(), this.spawner.getElapsed(), this.kills);
        this.gameOverPanel.show({ elapsedMs: this.totalElapsedMs + this.spawner.getElapsed(), kills: this.totalKills, level: this.xpSystem.getLevel(), bossesKilled: this.bossesKilled, stageIndex: this.stage?.index }); return;
      }
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
    this.spatialGrid.rebuild(this.enemies.getChildren());
    if (this.upgrades.auraRadius > 0 && !this.gameOver) this.tickAura(delta);
    this.player.updateShieldVisual();
    this.chestSystem.update(this.player.x, this.player.y, (k) => this.discipleMgr.has(k));
    this.itemBar.update();
    this.fog.update(this.player.x, this.player.y);
    this.miniMap.update(this.player.x, this.player.y, this.fog, this.chestSystem.getUnopenedPositions());
    this.biomeEffects.update(this.player.x, this.player.y, delta);
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
    for (const u of (this.discipleMgr.getUltimateCooldowns() ?? [])) {
      cds.push({ name: ultNames[u.key] ?? u.key, ratio: u.ratio, color: ultColors[u.key] ?? 0xffffff });
    }
    const hbr = this.tangsengSkills.getHeadbandRatio();
    if (hbr >= 0) cds.push({ name: "紧箍咒", ratio: hbr, color: 0xffdd44, active: this.tangsengSkills.isHeadbandActive() });
    const mr = this.tangsengSkills.getMercyChargeRatio();
    if (mr >= 0) cds.push({ name: "大慈悲", ratio: mr, color: 0xffffff });
    return cds;
  }

  private ySortAll() {
    const allDisciples = this.discipleMgr.getAll() ?? [];
    const objs: Phaser.GameObjects.GameObject[] = [this.player, ...allDisciples];
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
    for (const e of this.spatialGrid.queryRadius(this.player.x, this.player.y, r)) {
      e.hp -= dmg;
      if (e.hp <= 0) { e.takeDamage(0); continue; }
      (e.body as Phaser.Physics.Arcade.Body).velocity.scale(1 - auraSlow);
    }
  }

  private placeTrap(x: number, y: number, dmg: number) {
    const trap = this.add.image(x, y, "web_trap").setDepth(5).setDisplaySize(60, 60).setAlpha(0.7);
    const trapRadius = 30;
    const trapTimer = this.time.addEvent({ delay: 500, loop: true, callback: () => {
      if (!trap.active) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
      if (dist <= trapRadius && !this.player.invincible) {
        this.player.takeDamage(Math.ceil(dmg * 0.5), this.upgrades.damageMultiplier);
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.velocity.scale(0.4);
      }
    }});
    this.time.delayedCall(8000, () => {
      trapTimer.destroy();
      this.tweens.add({ targets: trap, alpha: 0, duration: 400, onComplete: () => trap.destroy() });
    });
  }

  private summonMinion(x: number, y: number) {
    const count = Phaser.Math.Between(1, 2);
    for (let i = 0; i < count; i++) {
      const ox = x + (Math.random() - 0.5) * 60;
      const oy = y + (Math.random() - 0.5) * 60;
      let minion = this.enemies.getFirstDead(false) as Enemy | null;
      if (!minion) {
        minion = new Enemy(this, ox, oy, "enemy_monkey_imp");
        this.enemies.add(minion, true);
      }
      minion.spawn(ox, oy, { hp: 6, damage: 3, speed: 85, xpValue: 2, behavior: "chase" });
      minion.setTexture("enemy_monkey_imp");
      minion.setScale(0.32);
      minion.setTint(0x88ff88);
      minion.setAlpha(0);
      this.tweens.add({ targets: minion, alpha: 1, duration: 300 });
    }
  }

  private showRelicDrop(relic: Relic) {
    const cx = 400, cy = 200;
    const bg = this.add.rectangle(cx, cy, 260, 90 + relic.buffs.length * 18, 0x1a1a2e, 0.9)
      .setStrokeStyle(2, 0xffaa00).setScrollFactor(0).setDepth(950).setAlpha(0);
    const icon = this.add.image(cx - 90, cy - 10, relic.icon).setDisplaySize(40, 40)
      .setScrollFactor(0).setDepth(951).setAlpha(0);
    const title = this.add.text(cx + 10, cy - 30, `获得 ${relic.name}`, {
      fontSize: "16px", color: "#ffaa00", fontStyle: "bold", stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(951).setAlpha(0);
    const buffTexts = relic.buffs.map((b, i) =>
      this.add.text(cx + 10, cy - 6 + i * 18, b.label, {
        fontSize: "12px", color: "#66ff66", stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(951).setAlpha(0)
    );
    const all = [bg, icon, title, ...(buffTexts ?? [])];
    this.tweens.add({ targets: all, alpha: 1, duration: 400, ease: "Sine.easeOut" });
    this.time.delayedCall(3500, () => {
      this.tweens.add({ targets: all, alpha: 0, y: "-=20", duration: 600,
        onComplete: () => all.forEach(o => o.destroy()),
      });
    });
  }

  private showItemEffect(name: string, desc: string, color: number) {
    const ring = this.add.circle(this.player.x, this.player.y, 10, color, 0.5).setDepth(500);
    this.tweens.add({ targets: ring, radius: 80, alpha: 0, duration: 500, ease: "Sine.easeOut", onComplete: () => ring.destroy() });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const p = this.add.circle(this.player.x, this.player.y, 3, color, 0.8).setDepth(501);
      this.tweens.add({ targets: p, x: this.player.x + Math.cos(a) * 60, y: this.player.y + Math.sin(a) * 60, alpha: 0, scale: 0, duration: 400 + Math.random() * 200, onComplete: () => p.destroy() });
    }
    const txt = this.add.text(this.player.x, this.player.y - 40, `${name}`, {
      fontSize: "14px", color: `#${color.toString(16).padStart(6, "0")}`, fontStyle: "bold",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(502);
    const descTxt = this.add.text(this.player.x, this.player.y - 22, desc, {
      fontSize: "10px", color: "#cccccc", stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setDepth(502);
    this.tweens.add({ targets: [txt, descTxt], y: "-=30", alpha: 0, delay: 800, duration: 600, onComplete: () => { txt.destroy(); descTxt.destroy(); } });
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
