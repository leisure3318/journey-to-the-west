import Phaser from "phaser";
import { fetchTopScores, ScoreEntry } from "../systems/LeaderboardSystem";
import { STAGES } from "../config/StageConfig";

export class LeaderboardScene extends Phaser.Scene {
  constructor() { super("LeaderboardScene"); }

  async create() {
    this.cameras.main.setBackgroundColor("#0a0a1e");

    this.add.text(400, 36, "天梯榜", {
      fontSize: "34px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5);

    const loading = this.add.text(400, 300, "加载中...", {
      fontSize: "18px", color: "#888888",
    }).setOrigin(0.5);

    const scores = await fetchTopScores(20);
    loading.destroy();

    if (scores.length === 0) {
      this.add.text(400, 300, "暂无记录，成为第一个吧！", {
        fontSize: "16px", color: "#666688",
      }).setOrigin(0.5);
    } else {
      this.drawTable(scores);
    }

    const back = this.add.text(400, 570, "[ 返回主菜单 ]", {
      fontSize: "18px", color: "#aaaaaa",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on("pointerover", () => back.setColor("#ffffff"));
    back.on("pointerout", () => back.setColor("#aaaaaa"));
    back.on("pointerdown", () => this.scene.start("MenuScene"));
  }

  private drawTable(scores: ScoreEntry[]) {
    const cols = [40, 80, 210, 340, 420, 510];
    const headers = ["#", "玩家", "分数", "关卡", "击杀", "时间"];
    const headerY = 80;

    for (let i = 0; i < headers.length; i++) {
      this.add.text(cols[i], headerY, headers[i], {
        fontSize: "13px", color: "#ffaa00", fontStyle: "bold",
        stroke: "#000000", strokeThickness: 2,
      });
    }

    this.add.rectangle(400, headerY + 16, 740, 1, 0xffaa00, 0.4).setOrigin(0.5, 0);

    const startY = 108;
    const rowH = 22;

    for (let i = 0; i < scores.length; i++) {
      const s = scores[i];
      const y = startY + i * rowH;
      const isTop3 = i < 3;
      const rankColors = ["#ffd700", "#c0c0c0", "#cd7f32"];
      const color = isTop3 ? rankColors[i] : "#cccccc";

      if (i % 2 === 0) {
        this.add.rectangle(400, y + 10, 740, rowH, 0xffffff, 0.03).setOrigin(0.5, 0.5);
      }

      const stageName = STAGES[s.stage_index]?.name ?? `第${s.stage_index + 1}关`;
      const mins = Math.floor(s.elapsed_ms / 60000);
      const secs = Math.floor((s.elapsed_ms % 60000) / 1000);
      const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

      const rank = isTop3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`;
      const cells = [rank, s.name.slice(0, 8), `${s.score}`, stageName, `${s.kills}`, timeStr];

      for (let j = 0; j < cells.length; j++) {
        this.add.text(cols[j], y, cells[j], {
          fontSize: "13px", color,
          stroke: "#000000", strokeThickness: 2,
        });
      }
    }
  }
}
