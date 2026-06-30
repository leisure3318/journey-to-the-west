import Phaser from "phaser";

const HEROES = ["tangseng", "wukong", "bajie", "wujing", "bailongma", "tangseng_riding"];

const ENEMY_TEXTURES = [
  { key: "enemy_bandit", path: "assets/sprites/enemies/common/bandit.png" },
  { key: "enemy_monkey_imp", path: "assets/sprites/enemies/common/monkey_imp.png" },
  { key: "enemy_demon_archer", path: "assets/sprites/enemies/common/demon_archer.png" },
  { key: "enemy_scorpion_imp", path: "assets/sprites/enemies/common/scorpion_imp.png" },
  { key: "enemy_bear_demon", path: "assets/sprites/enemies/common/bear_demon.png" },
  { key: "enemy_web_spinner", path: "assets/sprites/enemies/common/web_spinner.png" },
  { key: "enemy_tree_demon", path: "assets/sprites/enemies/common/tree_demon.png" },
  { key: "enemy_wolf", path: "assets/sprites/enemies/common/wolf.png" },
  { key: "enemy_tiger_demon", path: "assets/sprites/enemies/common/tiger_demon.png" },
  { key: "enemy_flower_sprite", path: "assets/sprites/enemies/common/flower_sprite.png" },
  { key: "enemy_centipede_spirit", path: "assets/sprites/enemies/common/centipede_spirit.png" },
  { key: "enemy_fish_demon", path: "assets/sprites/enemies/common/fish_demon.png" },
  { key: "enemy_water_ghost", path: "assets/sprites/enemies/common/water_ghost.png" },
  { key: "enemy_snake_demon", path: "assets/sprites/enemies/common/snake_demon.png" },
  { key: "enemy_ghost", path: "assets/sprites/enemies/common/ghost.png" },
  { key: "enemy_sand_spirit", path: "assets/sprites/enemies/common/sand_spirit.png" },
  { key: "enemy_fire_crow", path: "assets/sprites/enemies/common/fire_crow.png" },
  { key: "enemy_stone_imp", path: "assets/sprites/enemies/common/stone_imp.png" },
  { key: "enemy_smoke_demon", path: "assets/sprites/enemies/common/smoke_demon.png" },
  { key: "enemy_wind_spirit", path: "assets/sprites/enemies/common/wind_spirit.png" },
  { key: "enemy_bull_spirit", path: "assets/sprites/enemies/common/bull_spirit.png" },
  { key: "enemy_demon_vanguard", path: "assets/sprites/enemies/common/demon_vanguard.png" },
  { key: "enemy_bone_general", path: "assets/sprites/enemies/common/bone_general.png" },
  { key: "enemy_corrupted_soldier", path: "assets/sprites/enemies/common/corrupted_soldier.png" },
  { key: "enemy_zombie", path: "assets/sprites/enemies/common/zombie.png" },
  { key: "enemy_wolf_demon", path: "assets/sprites/enemies/common/wolf_demon.png" },
  { key: "enemy_ice_spirit", path: "assets/sprites/enemies/common/ice_spirit.png" },
  { key: "enemy_abyss_creature", path: "assets/sprites/enemies/common/abyss_creature.png" },
];

const BOSS_SHEET_KEYS: string[] = [];

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    const cx = 400, cy = 300;
    this.add.text(cx, cy - 30, "西天取经 加载中...", {
      fontSize: "20px", color: "#ffffff",
    }).setOrigin(0.5);

    const barW = 320, barH = 14;
    this.add.rectangle(cx, cy + 10, barW, barH, 0x222222).setOrigin(0.5).setStrokeStyle(1, 0x444444);
    const bar = this.add.rectangle(cx - barW / 2, cy + 10, 0, barH, 0x44bb66).setOrigin(0, 0.5);
    const pctText = this.add.text(cx, cy + 35, "0%", {
      fontSize: "14px", color: "#888888",
    }).setOrigin(0.5);

    this.load.on("progress", (v: number) => {
      bar.width = barW * v;
      pctText.setText(`${Math.round(v * 100)}%`);
    });

    for (const hero of HEROES) {
      this.load.spritesheet(
        hero,
        `assets/sprites/heroes/sliced_v3/${hero}_sheet.png`,
        { frameWidth: 128, frameHeight: 128 },
      );
    }

    for (const { key, path } of ENEMY_TEXTURES) {
      this.load.image(key, path);
    }

    this.load.image("boss_yellow_wind", "assets/sprites/enemies/bosses/yellow_wind_king.png");
    this.load.image("boss_white_bone", "assets/sprites/enemies/bosses/white_bone_spirit.png");
    this.load.image("boss_red_boy", "assets/sprites/enemies/bosses/red_boy.png");
    this.load.image("boss_black_bear", "assets/sprites/enemies/bosses/black_bear_king.png");
    this.load.image("boss_gold_horn", "assets/sprites/enemies/bosses/gold_horn_king.png");
    this.load.image("boss_spider", "assets/sprites/enemies/bosses/spider_sister.png");
    this.load.image("boss_bull_demon", "assets/sprites/enemies/bosses/bull_demon_king.png");
    this.load.image("boss_leopard", "assets/sprites/enemies/bosses/leopard_spirit.png");
    this.load.image("boss_deer", "assets/sprites/enemies/bosses/deer_immortal.png");
    this.load.image("boss_tiger", "assets/sprites/enemies/bosses/tiger_immortal.png");
    this.load.image("boss_scorpion", "assets/sprites/enemies/bosses/scorpion_spirit.png");
    this.load.image("boss_goldfish", "assets/sprites/enemies/bosses/goldfish_king.png");
    this.load.image("boss_mouse", "assets/sprites/enemies/bosses/mouse_spirit.png");
    this.load.image("boss_white_deer", "assets/sprites/enemies/bosses/white_deer_spirit.png");
    this.load.image("boss_hundred_eye", "assets/sprites/enemies/bosses/hundred_eye_demon.png");
    this.load.image("boss_yellow_robe", "assets/sprites/enemies/bosses/yellow_robe_demon.png");
    this.load.image("boss_stone_golem", "assets/sprites/enemies/bosses/stone_golem.png");
    this.load.image("boss_goat", "assets/sprites/enemies/bosses/goat_immortal.png");
    this.load.image("boss_iron_fan", "assets/sprites/enemies/bosses/iron_fan_princess.png");
    this.load.image("boss_silver_horn", "assets/sprites/enemies/bosses/silver_horn_king.png");
    this.load.image("boss_jade_rabbit", "assets/sprites/enemies/bosses/jade_rabbit.png");
    this.load.image("boss_golden_roc", "assets/sprites/enemies/bosses/golden_roc.png");
    this.load.image("boss_blue_lion", "assets/sprites/enemies/bosses/blue_lion_demon.png");
    this.load.image("boss_white_elephant", "assets/sprites/enemies/bosses/white_elephant_demon.png");
    this.load.image("boss_zhen_yuan", "assets/sprites/enemies/bosses/zhen_yuan.png");
    this.load.image("boss_rhino_cold", "assets/sprites/enemies/bosses/rhino_cold.png");
    this.load.image("boss_rhino_dust", "assets/sprites/enemies/bosses/rhino_dust.png");
    this.load.image("boss_rhino_heat", "assets/sprites/enemies/bosses/rhino_heat.png");
    this.load.image("enemy_fire_spirit", "assets/sprites/enemies/common/fire_spirit.png");

    for (const key of BOSS_SHEET_KEYS) {
      this.load.spritesheet(`boss_${key}`, `assets/sprites/enemies/bosses/sheets/${key}_sheet.png`,
        { frameWidth: 256, frameHeight: 256 });
    }

    const skillIcons = [
      "wukong_sweep", "wukong_clone", "wukong_transform", "wukong_fireeyes",
      "bajie_slam", "bajie_charge", "bajie_marshal", "bajie_appetite",
      "wujing_throw", "wujing_sandtrap", "wujing_shield", "wujing_domain",
      "tangseng_chant", "tangseng_headband", "tangseng_mercy", "tangseng_cicada",
      "bailongma_speed", "bailongma_pearl", "bailongma_trail",
    ];
    for (const name of skillIcons) this.load.image(`icon_${name}`, `assets/skills/icons/${name}.png`);

    const itemIcons = [
      "jinboyu", "jialan_jiasha", "jiuhuan_xizhang", "tongguan_wendie",
      "renshen_guo", "pantao", "zhaoyao_jing", "bajiao_shan",
      "ruyi_jingu", "tianpeng_lingpai", "jiukulou_chuan", "zijin_hulu",
      "dinghai_shenzhu", "bihuo_zhao", "yinshen_mao",
    ];
    for (const name of itemIcons) this.load.image(`item_${name}`, `assets/skills/items/${name}.png`);

    const vfxFiles = [
      "wukong_staff_sweep", "wukong_clone", "wukong_fireeyes",
      "bajie_rake_slam", "bajie_charge", "bajie_marshal",
      "wujing_staff_throw", "wujing_shield", "wujing_sand_trap",
      "tangseng_chant_aura", "tangseng_cicada_shield", "tangseng_headband_spell",
      "bailongma_frost_trail",
      "wukong_evo_dasheng", "bajie_evo_tsunami",
      "wujing_evo_general", "tangseng_evo_buddha", "bailongma_evo_dragon",
    ];
    for (const name of vfxFiles) this.load.image(`vfx_${name}`, `assets/skills/vfx/${name}.png`);

    const poiImages = [
      "wuzhishan", "yingchoujian", "gaolaozhuang", "liushahe",
      "heifengshan", "huangfengling", "baiguling", "pansidong", "pingdingshan", "huoyundong",
    ];
    for (const name of poiImages) this.load.image(`poi_${name}`, `assets/pois/${name}.png`);

    this.load.image("menu_bg", "assets/menu_bg.png");
    const cgFiles = [
      "prologue_01_court", "prologue_02_farewell",
      "prologue_03_alone", "prologue_04_night",
    ];
    for (const name of cgFiles) {
      this.load.image(name, `assets/cutscenes/${name}.png`);
    }
  }

  create() {
    for (const hero of HEROES) {
      const dirs = ["up", "right", "down", "left"];
      for (let d = 0; d < 4; d++) {
        this.anims.create({
          key: `${hero}_${dirs[d]}_walk`,
          frames: this.anims.generateFrameNumbers(hero, {
            start: d * 5,
            end: d * 5 + 4,
          }),
          frameRate: 8,
          repeat: -1,
        });
        this.anims.create({
          key: `${hero}_${dirs[d]}_idle`,
          frames: [{ key: hero, frame: d * 5 }],
          frameRate: 1,
        });
      }
    }

    const xpGfx = this.make.graphics({ x: 0, y: 0 });
    xpGfx.fillStyle(0x22aa44, 0.25);
    xpGfx.fillCircle(10, 10, 9);
    xpGfx.fillStyle(0x44dd66, 0.5);
    xpGfx.fillCircle(10, 10, 7);
    xpGfx.fillStyle(0x66ff88, 0.8);
    xpGfx.fillCircle(10, 10, 5);
    xpGfx.fillStyle(0xccffdd);
    xpGfx.fillCircle(9, 8, 3);
    xpGfx.fillStyle(0xffffff);
    xpGfx.fillCircle(8, 7, 1.5);
    xpGfx.generateTexture("xp_orb", 20, 20);
    xpGfx.destroy();

    const grassGfx = this.make.graphics({ x: 0, y: 0 });
    grassGfx.fillStyle(0x2d5a27);
    grassGfx.fillRect(0, 0, 64, 64);
    const patches = [0x346b2e, 0x3a7534, 0x2a5024, 0x28482a];
    for (let i = 0; i < 50; i++) {
      grassGfx.fillStyle(patches[i % patches.length], 0.6);
      grassGfx.fillRect(
        Phaser.Math.Between(0, 62),
        Phaser.Math.Between(0, 62),
        Phaser.Math.Between(1, 3),
        Phaser.Math.Between(1, 3),
      );
    }
    grassGfx.generateTexture("grass_tile", 64, 64);
    grassGfx.destroy();

    const projGfx = this.make.graphics({ x: 0, y: 0 });
    projGfx.fillStyle(0x66ccff);
    projGfx.fillCircle(6, 6, 5);
    projGfx.fillStyle(0xffffff);
    projGfx.fillCircle(5, 4, 2);
    projGfx.generateTexture("projectile_tex", 12, 12);
    projGfx.destroy();

    const treeGfx = this.make.graphics({ x: 0, y: 0 });
    treeGfx.fillStyle(0x5a3a1a);
    treeGfx.fillRect(13, 28, 6, 12);
    treeGfx.fillStyle(0x1a6b1a);
    treeGfx.fillCircle(16, 18, 14);
    treeGfx.fillStyle(0x2a8a2a, 0.7);
    treeGfx.fillCircle(13, 13, 8);
    treeGfx.generateTexture("deco_tree", 32, 40);
    treeGfx.destroy();

    const rockGfx = this.make.graphics({ x: 0, y: 0 });
    rockGfx.fillStyle(0x666666);
    rockGfx.fillCircle(10, 12, 9);
    rockGfx.fillStyle(0x888888, 0.5);
    rockGfx.fillCircle(8, 9, 5);
    rockGfx.generateTexture("deco_rock", 20, 20);
    rockGfx.destroy();

    const bushGfx = this.make.graphics({ x: 0, y: 0 });
    bushGfx.fillStyle(0x2a6b2a);
    bushGfx.fillCircle(12, 12, 10);
    bushGfx.fillStyle(0x3a8a3a, 0.6);
    bushGfx.fillCircle(10, 9, 6);
    bushGfx.generateTexture("deco_bush", 24, 24);
    bushGfx.destroy();

    const eProjGfx = this.make.graphics({ x: 0, y: 0 });
    eProjGfx.fillStyle(0xff4444);
    eProjGfx.fillCircle(5, 5, 4);
    eProjGfx.fillStyle(0xffaa00);
    eProjGfx.fillCircle(4, 3, 2);
    eProjGfx.generateTexture("enemy_proj_tex", 10, 10);
    eProjGfx.destroy();

    const chestClosed = this.make.graphics({ x: 0, y: 0 });
    chestClosed.fillStyle(0x8b5a2b);
    chestClosed.fillRoundedRect(2, 6, 28, 18, 2);
    chestClosed.fillStyle(0xa0692e);
    chestClosed.fillRoundedRect(2, 6, 28, 10, 2);
    chestClosed.fillStyle(0xdaa520);
    chestClosed.fillRect(13, 10, 6, 8);
    chestClosed.fillStyle(0xffd700);
    chestClosed.fillCircle(16, 13, 2);
    chestClosed.generateTexture("chest_closed", 32, 26);
    chestClosed.destroy();

    const chestOpen = this.make.graphics({ x: 0, y: 0 });
    chestOpen.fillStyle(0x8b5a2b);
    chestOpen.fillRoundedRect(2, 12, 28, 14, 2);
    chestOpen.fillStyle(0xa0692e);
    chestOpen.fillRoundedRect(4, 2, 24, 12, 2);
    chestOpen.fillStyle(0xffd700, 0.6);
    chestOpen.fillRect(8, 14, 16, 8);
    chestOpen.generateTexture("chest_open", 32, 26);
    chestOpen.destroy();

    const pineGfx = this.make.graphics({ x: 0, y: 0 });
    pineGfx.fillStyle(0x5a3a1a);
    pineGfx.fillRect(14, 30, 4, 10);
    pineGfx.fillStyle(0x0e3e0e);
    pineGfx.fillTriangle(16, 2, 4, 22, 28, 22);
    pineGfx.fillStyle(0x125a12, 0.7);
    pineGfx.fillTriangle(16, 10, 6, 28, 26, 28);
    pineGfx.generateTexture("deco_pine", 32, 40);
    pineGfx.destroy();

    const cactusGfx = this.make.graphics({ x: 0, y: 0 });
    cactusGfx.fillStyle(0x2a6a2a);
    cactusGfx.fillRect(12, 8, 8, 24);
    cactusGfx.fillRect(4, 14, 8, 6);
    cactusGfx.fillRect(20, 18, 8, 6);
    cactusGfx.fillStyle(0x3a8a3a, 0.7);
    cactusGfx.fillRect(14, 10, 4, 20);
    cactusGfx.generateTexture("deco_cactus", 32, 36);
    cactusGfx.destroy();

    const deadTreeGfx = this.make.graphics({ x: 0, y: 0 });
    deadTreeGfx.fillStyle(0x4a3a2a);
    deadTreeGfx.fillRect(14, 16, 4, 20);
    deadTreeGfx.lineStyle(2, 0x4a3a2a);
    deadTreeGfx.lineBetween(16, 16, 8, 6);
    deadTreeGfx.lineBetween(16, 16, 24, 4);
    deadTreeGfx.lineBetween(16, 20, 6, 14);
    deadTreeGfx.generateTexture("deco_dead_tree", 32, 36);
    deadTreeGfx.destroy();

    const reedGfx = this.make.graphics({ x: 0, y: 0 });
    reedGfx.lineStyle(2, 0x5a8a4a);
    reedGfx.lineBetween(8, 30, 10, 4);
    reedGfx.lineBetween(14, 30, 16, 6);
    reedGfx.lineBetween(20, 30, 18, 8);
    reedGfx.fillStyle(0x7aaa5a, 0.7);
    reedGfx.fillCircle(10, 4, 3);
    reedGfx.fillCircle(16, 6, 2);
    reedGfx.generateTexture("deco_reed", 28, 34);
    reedGfx.destroy();

    const lavaRockGfx = this.make.graphics({ x: 0, y: 0 });
    lavaRockGfx.fillStyle(0x3a3a3a);
    lavaRockGfx.fillCircle(12, 14, 10);
    lavaRockGfx.fillStyle(0x2a2a2a);
    lavaRockGfx.fillCircle(10, 12, 6);
    lavaRockGfx.fillStyle(0xff4400, 0.3);
    lavaRockGfx.fillCircle(8, 10, 3);
    lavaRockGfx.generateTexture("deco_lava_rock", 24, 24);
    lavaRockGfx.destroy();

    const mushroomGfx = this.make.graphics({ x: 0, y: 0 });
    mushroomGfx.fillStyle(0x8a7a5a);
    mushroomGfx.fillRect(8, 12, 4, 8);
    mushroomGfx.fillStyle(0xcc3333);
    mushroomGfx.fillCircle(10, 10, 7);
    mushroomGfx.fillStyle(0xffffff, 0.6);
    mushroomGfx.fillCircle(8, 8, 2);
    mushroomGfx.fillCircle(13, 9, 1.5);
    mushroomGfx.generateTexture("deco_mushroom", 20, 22);
    mushroomGfx.destroy();

    const poolGfx = this.make.graphics({ x: 0, y: 0 });
    poolGfx.fillStyle(0x2a5a7a, 0.6);
    poolGfx.fillEllipse(16, 12, 28, 18);
    poolGfx.fillStyle(0x4a8aaa, 0.3);
    poolGfx.fillEllipse(14, 10, 18, 10);
    poolGfx.lineStyle(1, 0x6aaacc, 0.4);
    poolGfx.lineBetween(8, 11, 14, 11);
    poolGfx.generateTexture("deco_pool", 32, 24);
    poolGfx.destroy();

    const emberGfx = this.make.graphics({ x: 0, y: 0 });
    emberGfx.fillStyle(0xff6600, 0.4);
    emberGfx.fillCircle(6, 6, 5);
    emberGfx.fillStyle(0xff8800, 0.6);
    emberGfx.fillCircle(6, 6, 3);
    emberGfx.fillStyle(0xffaa00);
    emberGfx.fillCircle(6, 5, 1.5);
    emberGfx.generateTexture("deco_ember", 12, 12);
    emberGfx.destroy();

    const duneGfx = this.make.graphics({ x: 0, y: 0 });
    duneGfx.fillStyle(0x9a8a58, 0.5);
    duneGfx.fillEllipse(20, 14, 36, 16);
    duneGfx.fillStyle(0xaa9a68, 0.3);
    duneGfx.fillEllipse(18, 12, 24, 10);
    duneGfx.generateTexture("deco_dune", 40, 20);
    duneGfx.destroy();

    const webTrapGfx = this.make.graphics({ x: 0, y: 0 });
    webTrapGfx.lineStyle(1, 0xcccccc, 0.5);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      webTrapGfx.lineBetween(16, 16, 16 + Math.cos(a) * 14, 16 + Math.sin(a) * 14);
    }
    for (let r = 5; r <= 14; r += 4) {
      webTrapGfx.strokeCircle(16, 16, r);
    }
    webTrapGfx.fillStyle(0xcccccc, 0.08);
    webTrapGfx.fillCircle(16, 16, 14);
    webTrapGfx.generateTexture("web_trap", 32, 32);
    webTrapGfx.destroy();

    const eliteRingGfx = this.make.graphics({ x: 0, y: 0 });
    eliteRingGfx.lineStyle(2, 0xff4444, 0.6);
    eliteRingGfx.strokeCircle(16, 16, 14);
    eliteRingGfx.lineStyle(1, 0xffaa00, 0.3);
    eliteRingGfx.strokeCircle(16, 16, 12);
    eliteRingGfx.fillStyle(0xff4444, 0.08);
    eliteRingGfx.fillCircle(16, 16, 14);
    eliteRingGfx.generateTexture("elite_ring", 32, 32);
    eliteRingGfx.destroy();

    for (const key of BOSS_SHEET_KEYS) {
      const texKey = `boss_${key}`;
      if (!this.textures.exists(texKey + "_sheet")) continue;
      const dirs = ["up", "right", "down", "left"];
      for (let d = 0; d < 4; d++) {
        this.anims.create({
          key: `${texKey}_${dirs[d]}_walk`,
          frames: this.anims.generateFrameNumbers(texKey, { start: d * 5 + 1, end: d * 5 + 4 }),
          frameRate: 6, repeat: -1,
        });
        this.anims.create({
          key: `${texKey}_${dirs[d]}_idle`,
          frames: [{ key: texKey, frame: d * 5 }],
          frameRate: 1,
        });
      }
    }

    this.scene.start("MenuScene");
  }
}
