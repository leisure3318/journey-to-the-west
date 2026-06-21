import Phaser from "phaser";

const HEROES = ["tangseng", "wukong", "bajie", "wujing", "bailongma", "tangseng_riding"];

const ENEMY_TEXTURES = [
  { key: "enemy_bandit", path: "assets/sprites/enemies/common/bandit.png" },
  { key: "enemy_monkey_imp", path: "assets/sprites/enemies/common/monkey_imp.png" },
  { key: "enemy_demon_archer", path: "assets/sprites/enemies/common/demon_archer.png" },
  { key: "enemy_scorpion_imp", path: "assets/sprites/enemies/common/scorpion_imp.png" },
  { key: "enemy_bear_demon", path: "assets/sprites/enemies/common/bear_demon.png" },
];

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
    this.load.image("enemy_fire_spirit", "assets/sprites/enemies/common/fire_spirit.png");

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
      const dirs = ["down", "right", "up", "left"];
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

    this.scene.start("MenuScene");
  }
}
