import Phaser from "phaser";
import { STAGES, CarryOverState } from "../config/StageConfig";
import { saveSystem } from "../systems/SaveSystem";

export interface StageResultStats {
  stageIndex: number;
  elapsedMs: number;
  kills: number;
  level: number;
  hpRatio: number;
  bossesKilled: string[];
  carryOver: CarryOverState;
  entryCarryOver?: CarryOverState;
}

export class StageResultPanel {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(stats: StageResultStats) {
    this.scene.physics.pause();
    const stage = STAGES[stats.stageIndex];

    const stars = stats.hpRatio > 0.5 ? 3 : stats.hpRatio > 0.2 ? 2 : 1;
    saveSystem.clearStage(stats.stageIndex, stars);
    saveSystem.recordRun(stats.elapsedMs, stats.kills, stats.level, stats.bossesKilled);

    const secs = Math.floor(stats.elapsedMs / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const hasNext = stats.stageIndex + 1 < STAGES.length;

    this.scene.add.rectangle(400, 300, 460, 360, 0x000000, 0.9)
      .setStrokeStyle(2, 0xffaa00).setScrollFactor(0).setDepth(1000);

    this.scene.add.text(400, 170, `${stage.title}`, {
      fontSize: "22px", color: "#ffaa00", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    this.scene.add.text(400, 200, "通关！", {
      fontSize: "28px", color: "#ffdd44", fontStyle: "bold",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    const starStr = Array.from({ length: 3 }, (_, i) => i < stars ? "★" : "☆").join("  ");
    const starText = this.scene.add.text(400, 245, starStr, {
      fontSize: "32px", color: "#ffdd44",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    this.scene.tweens.add({
      targets: starText, scale: 1.2, duration: 300, yoyo: true, ease: "Back.easeOut",
    });

    this.scene.add.text(400, 290,
      `存活 ${m}:${s.toString().padStart(2, "0")}  |  击杀 ${stats.kills}  |  Lv ${stats.level}`, {
      fontSize: "15px", color: "#ffffff",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    this.scene.add.text(400, 315,
      `HP: ${Math.round(stats.hpRatio * 100)}%  |  ${stars === 3 ? "完美通关" : stars === 2 ? "优秀通关" : "险胜通关"}`, {
      fontSize: "13px", color: stars === 3 ? "#66ff66" : stars === 2 ? "#88ccff" : "#ffaa44",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    if (hasNext) {
      const nextStage = STAGES[stats.stageIndex + 1];
      this.scene.add.text(400, 350, `下一关: ${nextStage.title}`, {
        fontSize: "12px", color: "#888888",
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    }

    const btnY = 410;
    if (hasNext) {
      const nextBtn = this.scene.add.text(290, btnY, "[ 下一关 ]", {
        fontSize: "20px", color: "#ffdd44", fontStyle: "bold",
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });
      nextBtn.on("pointerover", () => nextBtn.setColor("#ffffff"));
      nextBtn.on("pointerout", () => nextBtn.setColor("#ffdd44"));
      nextBtn.on("pointerdown", () => {
        const carry: CarryOverState = { ...stats.carryOver, stageIndex: stats.stageIndex + 1 };
        this.scene.scene.start("GameScene", { stageIndex: stats.stageIndex + 1, carryOver: carry });
      });
    }

    const retryBtn = this.scene.add.text(hasNext ? 400 : 340, btnY, "[ 重玩 ]", {
      fontSize: "18px", color: "#aaaaaa",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });
    retryBtn.on("pointerover", () => retryBtn.setColor("#ffffff"));
    retryBtn.on("pointerout", () => retryBtn.setColor("#aaaaaa"));
    retryBtn.on("pointerdown", () => {
      this.scene.scene.start("GameScene", { stageIndex: stats.stageIndex, carryOver: stats.entryCarryOver });
    });

    const menuBtn = this.scene.add.text(hasNext ? 510 : 460, btnY, "[ 选关 ]", {
      fontSize: "18px", color: "#aaaaaa",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });
    menuBtn.on("pointerover", () => menuBtn.setColor("#ffffff"));
    menuBtn.on("pointerout", () => menuBtn.setColor("#aaaaaa"));
    menuBtn.on("pointerdown", () => {
      this.scene.scene.start("StageSelectScene");
    });
  }
}
