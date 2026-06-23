import Phaser from "phaser";
import { STAGES } from "../config/StageConfig";
import { SoundManager } from "../systems/SoundManager";
import { saveSystem } from "../systems/SaveSystem";

const COLS = 3;
const CARD_W = 200;
const CARD_H = 120;
const GAP_X = 30;
const GAP_Y = 25;

export class StageSelectScene extends Phaser.Scene {
  private soundMgr = new SoundManager();

  constructor() { super("StageSelectScene"); }

  create() {
    this.soundMgr.setVolume(saveSystem.volume);
    this.cameras.main.setBackgroundColor("#1a1a2e");

    this.add.text(400, 40, "西天取经 · 选关", {
      fontSize: "32px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5);

    const startX = 400 - ((COLS - 1) * (CARD_W + GAP_X)) / 2;
    const startY = 100;

    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = startX + col * (CARD_W + GAP_X);
      const cy = startY + row * (CARD_H + GAP_Y);
      const unlocked = saveSystem.isStageUnlocked(i);
      const stars = saveSystem.getStageStars(i);

      this.drawCard(cx, cy, stage, i, unlocked, stars);
    }

    const backBtn = this.add.text(400, 560, "[ 返回主菜单 ]", {
      fontSize: "18px", color: "#aaaaaa",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on("pointerover", () => backBtn.setColor("#ffffff"));
    backBtn.on("pointerout", () => backBtn.setColor("#aaaaaa"));
    backBtn.on("pointerdown", () => {
      this.soundMgr.menuClick();
      this.scene.start("MenuScene");
    });
  }

  private drawCard(cx: number, cy: number, stage: typeof STAGES[0], index: number, unlocked: boolean, stars: number) {
    const bgColor = unlocked ? 0x2a2a4e : 0x1a1a28;
    const borderColor = unlocked ? (stars > 0 ? 0xffaa00 : 0x4466aa) : 0x333344;

    const bg = this.add.rectangle(cx, cy, CARD_W, CARD_H, bgColor, 0.9)
      .setStrokeStyle(2, borderColor);

    const numText = this.add.text(cx, cy - 38, `第${this.toChinese(index + 1)}大关`, {
      fontSize: "11px", color: unlocked ? "#aaaacc" : "#555566",
    }).setOrigin(0.5);

    const nameText = this.add.text(cx, cy - 18, stage.name, {
      fontSize: "20px", color: unlocked ? "#ffffff" : "#555566", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5);

    if (unlocked) {
      const starStr = Array.from({ length: 3 }, (_, i) => i < stars ? "★" : "☆").join(" ");
      this.add.text(cx, cy + 5, starStr, {
        fontSize: "16px", color: stars > 0 ? "#ffdd44" : "#666688",
      }).setOrigin(0.5);

      this.add.text(cx, cy + 28, stage.description, {
        fontSize: "10px", color: "#888899",
      }).setOrigin(0.5);

      const diff = `×${stage.difficulty.toFixed(1)}`;
      this.add.text(cx + CARD_W / 2 - 8, cy - CARD_H / 2 + 8, diff, {
        fontSize: "10px", color: "#ff8844",
      }).setOrigin(1, 0);

      bg.setInteractive({ useHandCursor: true });
      bg.on("pointerover", () => bg.setStrokeStyle(2, 0xffdd44));
      bg.on("pointerout", () => bg.setStrokeStyle(2, borderColor));
      bg.on("pointerdown", () => {
        this.soundMgr.menuClick();
        this.scene.start("GameScene", { stageIndex: index });
      });
    } else {
      this.add.text(cx, cy + 8, "🔒", {
        fontSize: "24px",
      }).setOrigin(0.5);
    }
  }

  private toChinese(n: number): string {
    const map = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    return map[n] ?? n.toString();
  }
}
