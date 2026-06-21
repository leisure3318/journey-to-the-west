import Phaser from "phaser";

export interface VictoryStats {
  elapsedMs: number;
  kills: number;
  level: number;
  bossName: string;
}

export class VictoryPanel {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(stats: VictoryStats) {
    this.scene.physics.pause();

    const secs = Math.floor(stats.elapsedMs / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;

    this.scene.add
      .rectangle(400, 300, 440, 280, 0x000000, 0.85)
      .setScrollFactor(0)
      .setDepth(1000);

    this.scene.add
      .text(400, 210, "取经成功！", {
        fontSize: "32px",
        color: "#ffdd44",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    this.scene.add
      .text(400, 260, `击败 ${stats.bossName}`, {
        fontSize: "18px",
        color: "#ff8844",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    this.scene.add
      .text(
        400,
        300,
        `存活 ${m}:${s.toString().padStart(2, "0")}  |  击杀 ${stats.kills}  |  Lv ${stats.level}`,
        { fontSize: "16px", color: "#ffffff" },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    const restart = this.scene.add
      .text(340, 360, "[ 再来一次 ]", {
        fontSize: "20px",
        color: "#ffdd44",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001)
      .setInteractive({ useHandCursor: true });
    restart.on("pointerdown", () => this.scene.scene.restart());

    const menu = this.scene.add
      .text(460, 360, "[ 主菜单 ]", {
        fontSize: "20px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001)
      .setInteractive({ useHandCursor: true });
    menu.on("pointerdown", () => this.scene.scene.start("MenuScene"));
  }
}
