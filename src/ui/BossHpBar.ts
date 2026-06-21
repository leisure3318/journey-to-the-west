import Phaser from "phaser";
import { Boss } from "../entities/Boss";

export class BossHpBar {
  private scene: Phaser.Scene;
  private gfx: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private visible = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.add.graphics().setScrollFactor(0).setDepth(950).setVisible(false);
    this.nameText = scene.add
      .text(400, 42, "", {
        fontSize: "14px",
        color: "#ffcc00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(951)
      .setVisible(false);
  }

  show(boss: Boss) {
    this.visible = true;
    this.nameText.setText(boss.bossName).setVisible(true);
    this.gfx.setVisible(true);
  }

  hide() {
    this.visible = false;
    this.gfx.setVisible(false);
    this.nameText.setVisible(false);
  }

  update(boss: Boss) {
    if (!this.visible) return;

    const ratio = Math.max(0, boss.hp / boss.maxHp);
    const barW = 400;
    const barH = 12;
    const x = 200;
    const y = 56;

    this.gfx.clear();
    this.gfx.fillStyle(0x222222);
    this.gfx.fillRect(x, y, barW, barH);
    const color = ratio > 0.5 ? 0xcc2222 : ratio > 0.25 ? 0xff4400 : 0xff0000;
    this.gfx.fillStyle(color);
    this.gfx.fillRect(x, y, barW * ratio, barH);
    this.gfx.lineStyle(1, 0xffffff, 0.4);
    this.gfx.strokeRect(x, y, barW, barH);
  }
}
