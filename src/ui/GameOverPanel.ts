import Phaser from "phaser";
import { saveSystem } from "../systems/SaveSystem";
import { CarryOverState } from "../config/StageConfig";
import { calcScore, showSubmitDialog } from "../systems/LeaderboardSystem";

export interface GameOverStats {
  elapsedMs: number;
  kills: number;
  level: number;
  bossesKilled: string[];
  stageIndex?: number;
  entryCarryOver?: CarryOverState;
}

export class GameOverPanel {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(stats: GameOverStats) {
    this.scene.physics.pause();
    saveSystem.recordRun(stats.elapsedMs, stats.kills, stats.level, stats.bossesKilled);

    const secs = Math.floor(stats.elapsedMs / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;

    this.scene.add.rectangle(400, 300, 420, 320, 0x000000, 0.85)
      .setScrollFactor(0).setDepth(1000);

    this.scene.add.text(400, 200, "取经失败", {
      fontSize: "32px", color: "#ff4444", fontStyle: "bold",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    this.scene.add.text(400, 250,
      `存活 ${m}:${s.toString().padStart(2, "0")}  |  击杀 ${stats.kills}  |  Lv ${stats.level}`, {
      fontSize: "16px", color: "#ffffff",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    const records = [
      `最佳存活 ${saveSystem.formatTime(saveSystem.bestTimeMs)}`,
      `最高击杀 ${saveSystem.bestKills}`,
      `最高等级 Lv ${saveSystem.bestLevel}`,
      `总场次 ${saveSystem.totalRuns}  |  总击杀 ${saveSystem.totalKills}`,
    ].join("\n");
    this.scene.add.text(400, 310, records, {
      fontSize: "12px", color: "#888888", align: "center", lineSpacing: 6,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    const score = calcScore(stats.kills, stats.stageIndex ?? 0, 0);
    if (score > 0) {
      const uploadBtn = this.scene.add.text(400, 358, `上传天梯榜  (得分 ${score})`, {
        fontSize: "13px", color: "#88ccff",
        stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });
      uploadBtn.on("pointerover", () => uploadBtn.setColor("#bbddff"));
      uploadBtn.on("pointerout", () => uploadBtn.setColor("#88ccff"));
      uploadBtn.on("pointerdown", () => {
        showSubmitDialog(score, stats.kills, stats.stageIndex ?? 0, 0, stats.elapsedMs);
      });
    }

    const restart = this.scene.add.text(280, 398, "[ 再来一次 ]", {
      fontSize: "20px", color: "#ffdd44",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });
    restart.on("pointerdown", () => {
      if (stats.stageIndex != null) {
        this.scene.scene.start("GameScene", { stageIndex: stats.stageIndex, carryOver: stats.entryCarryOver });
      } else {
        this.scene.scene.restart();
      }
    });

    const selectBtn = this.scene.add.text(400, 398, "[ 选关 ]", {
      fontSize: "20px", color: "#aaaaaa",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });
    selectBtn.on("pointerdown", () => this.scene.scene.start("StageSelectScene"));

    const menu = this.scene.add.text(520, 398, "[ 主菜单 ]", {
      fontSize: "20px", color: "#aaaaaa",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });
    menu.on("pointerdown", () => this.scene.scene.start("MenuScene"));
  }
}
