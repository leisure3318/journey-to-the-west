import Phaser from "phaser";
import { CutsceneConfig } from "./CutsceneScene";
import { SoundManager } from "../systems/SoundManager";
import { saveSystem } from "../systems/SaveSystem";

const PROLOGUE: CutsceneConfig = {
  id: "prologue",
  skippable: true,
  nextScene: "StageSelectScene",
  pages: [
    {
      image: "prologue_01_court",
      color: 0x8b6914,
      text: "贞观十三年，唐王选大德高僧，往西天取大乘真经。",
      speaker: "旁白",
    },
    {
      image: "prologue_02_farewell",
      color: 0x7a5c30,
      text: "御弟哥哥，日久年深，山遥路远，要保重。朕与你结为兄弟，送你金钵一只，白马一匹。",
      speaker: "唐王",
    },
    {
      image: "prologue_03_alone",
      color: 0x3a2a10,
      text: "宁恋本乡一捻土，莫爱他乡万两金。可这一去，不知何年何月才能回来。",
      speaker: "唐僧",
    },
    {
      image: "prologue_04_night",
      color: 0x1a1a2e,
      text: "十万八千里，九九八十一难。一个人，也要走。",
      speaker: "旁白",
    },
  ],
};

const PATH_POINTS = [
  { x: 490, y: 585 }, { x: 520, y: 510 }, { x: 555, y: 430 },
  { x: 585, y: 355 }, { x: 610, y: 285 }, { x: 635, y: 215 },
];
const WALKERS = [
  { key: "wukong", gap: 0.00, scale: 0.5 },
  { key: "tangseng_riding", gap: 0.06, scale: 0.55 },
  { key: "wujing", gap: 0.13, scale: 0.45 },
  { key: "bajie", gap: 0.20, scale: 0.48 },
];

export class MenuScene extends Phaser.Scene {
  private walkers: Phaser.GameObjects.Sprite[] = [];
  private groupT = 0;
  private soundMgr = new SoundManager();

  constructor() { super("MenuScene"); }

  create() {
    this.walkers = [];
    this.groupT = 0;
    this.soundMgr.setVolume(saveSystem.volume);
    this.soundMgr.startMenuBgm();
    this.drawBackground();
    this.setupWalkers();
    this.setupUI();
  }

  update(_time: number, delta: number) {
    this.groupT += 0.025 * (delta / 1000);
    if (this.groupT > 1.25) this.groupT = -0.05;
    for (let i = 0; i < this.walkers.length; i++) {
      const t = Phaser.Math.Clamp(this.groupT - WALKERS[i].gap, 0, 1);
      const pos = this.pathAt(t);
      const perspScale = 1 - t * 0.55;
      this.walkers[i].setPosition(pos.x, pos.y);
      this.walkers[i].setScale(WALKERS[i].scale * perspScale);
      this.walkers[i].setDepth(10 - t * 5);
      this.walkers[i].setVisible(this.groupT - WALKERS[i].gap >= 0);
    }
  }

  private pathAt(t: number): { x: number; y: number } {
    const pts = PATH_POINTS;
    const idx = t * (pts.length - 1);
    const i = Math.min(Math.floor(idx), pts.length - 2);
    const f = idx - i;
    return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f };
  }

  private drawBackground() {
    const bg = this.add.image(400, 300, "menu_bg");
    const scaleX = 800 / bg.width, scaleY = 600 / bg.height;
    bg.setScale(Math.max(scaleX, scaleY)).setDepth(0);
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.2);
    overlay.fillRect(0, 0, 800, 600);
    overlay.setDepth(1);
  }

  private setupWalkers() {
    for (const cfg of WALKERS) {
      const pos = this.pathAt(0);
      const sprite = this.add.sprite(pos.x, pos.y, cfg.key);
      sprite.setScale(cfg.scale).setDepth(10).setVisible(false);
      sprite.play(`${cfg.key}_right_walk`);
      this.walkers.push(sprite);
    }
  }

  private setupUI() {
    this.add.text(402, 92, "西天取经", {
      fontSize: "52px", color: "#000000", fontStyle: "bold",
    }).setOrigin(0.5).setAlpha(0.5).setDepth(20);

    this.add.text(400, 90, "西天取经", {
      fontSize: "52px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#8b4513", strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20);

    this.add.text(400, 148, "Journey to the West · Survivors", {
      fontSize: "16px", color: "#e8c87a",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    const startBtn = this.add.text(400, 535, "▶  开始取经", {
      fontSize: "26px", color: "#ffffff", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
      backgroundColor: "#8b4513",
      padding: { x: 28, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(20);

    startBtn.on("pointerover", () => startBtn.setStyle({ color: "#ffdd44" }));
    startBtn.on("pointerout", () => startBtn.setStyle({ color: "#ffffff" }));
    startBtn.on("pointerdown", () => {
      this.soundMgr.menuClick();
      this.soundMgr.stopBgm();
      if (!saveSystem.prologueSeen) {
        saveSystem.markPrologueSeen();
        this.scene.start("CutsceneScene", PROLOGUE);
      } else {
        this.scene.start("StageSelectScene");
      }
    });

    const galleryBtn = this.add.text(700, 535, "CG画廊", {
      fontSize: "16px", color: "#ccaa66",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(20);
    galleryBtn.on("pointerover", () => galleryBtn.setColor("#ffdd88"));
    galleryBtn.on("pointerout", () => galleryBtn.setColor("#ccaa66"));
    galleryBtn.on("pointerdown", () => { this.soundMgr.menuClick(); this.soundMgr.stopBgm(); this.scene.start("GalleryScene"); });

    this.add.text(400, 578, "WASD移动 | Q/右键 大招 | 1-9 道具 | M静音 | ESC暂停", {
      fontSize: "12px", color: "#999999",
    }).setOrigin(0.5).setDepth(20);

    this.add.text(790, 590, "v0.5", {
      fontSize: "10px", color: "#666666",
    }).setOrigin(1, 1).setDepth(20);

    if (saveSystem.totalRuns > 0) {
      const lines = [
        `总场次 ${saveSystem.totalRuns}  |  总击杀 ${saveSystem.totalKills}`,
        `最佳 ${saveSystem.formatTime(saveSystem.bestTimeMs)}  |  Lv ${saveSystem.bestLevel}  |  ${saveSystem.bestKills}杀`,
        saveSystem.bossesDefeated.length > 0 ? `已征服 ${saveSystem.bossesDefeated.join("、")}` : "",
      ].filter(Boolean).join("\n");
      this.add.text(10, 570, lines, {
        fontSize: "10px", color: "#999966", lineSpacing: 4,
        stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0, 1).setDepth(20);
    }
  }
}
