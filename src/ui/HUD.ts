import Phaser from "phaser";

export interface CooldownInfo {
  name: string;
  ratio: number;
  color: number;
  active?: boolean;
}

export class HUD {
  private hpBar: Phaser.GameObjects.Graphics;
  private xpBar: Phaser.GameObjects.Graphics;
  private levelText: Phaser.GameObjects.Text;
  private timerText: Phaser.GameObjects.Text;
  private killText: Phaser.GameObjects.Text;
  private hpText: Phaser.GameObjects.Text;
  private waveText: Phaser.GameObjects.Text;
  private cdGfx: Phaser.GameObjects.Graphics;
  private cdTexts: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const depth = 900;

    this.hpBar = scene.add.graphics().setScrollFactor(0).setDepth(depth);
    this.xpBar = scene.add.graphics().setScrollFactor(0).setDepth(depth);

    this.hpText = scene.add
      .text(95, 13, "", { fontSize: "10px", color: "#ffffff" })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(depth + 1);

    this.levelText = scene.add
      .text(400, 574, "Lv 1", { fontSize: "14px", color: "#ffffff" })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(depth);

    this.timerText = scene.add
      .text(400, 8, "0:00", { fontSize: "16px", color: "#ffffff" })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(depth);

    this.killText = scene.add
      .text(780, 8, "击杀: 0", { fontSize: "14px", color: "#ffaaaa" })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(depth);

    this.waveText = scene.add
      .text(20, 32, "第一波", { fontSize: "12px", color: "#aaaaaa" })
      .setScrollFactor(0)
      .setDepth(depth);

    this.cdGfx = scene.add.graphics().setScrollFactor(0).setDepth(depth);
  }

  update(
    hp: number,
    maxHp: number,
    xp: number,
    xpToNext: number,
    level: number,
    elapsedMs: number,
    kills: number,
  ) {
    this.hpBar.clear();
    this.hpBar.fillStyle(0x333333);
    this.hpBar.fillRect(20, 12, 150, 14);
    const hpRatio = hp / maxHp;
    const hpColor =
      hpRatio > 0.5 ? 0x44ff44 : hpRatio > 0.25 ? 0xffaa00 : 0xff3333;
    this.hpBar.fillStyle(hpColor);
    this.hpBar.fillRect(20, 12, 150 * hpRatio, 14);
    this.hpBar.lineStyle(1, 0xffffff, 0.5);
    this.hpBar.strokeRect(20, 12, 150, 14);
    this.hpText.setText(`${hp}/${maxHp}`);

    this.xpBar.clear();
    this.xpBar.fillStyle(0x333333);
    this.xpBar.fillRect(50, 560, 700, 10);
    this.xpBar.fillStyle(0x44aaff);
    this.xpBar.fillRect(50, 560, 700 * (xp / xpToNext), 10);
    this.xpBar.lineStyle(1, 0xffffff, 0.3);
    this.xpBar.strokeRect(50, 560, 700, 10);

    this.levelText.setText(`Lv ${level}`);

    const secs = Math.floor(elapsedMs / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    this.timerText.setText(`${m}:${s.toString().padStart(2, "0")}`);

    this.killText.setText(`击杀: ${kills}`);

    const waveNames = ["第一波", "第二波", "第三波", "妖潮"];
    const waveThresholds = [0, 60_000, 180_000, 300_000];
    let waveIdx = 0;
    for (let i = waveThresholds.length - 1; i >= 0; i--) {
      if (elapsedMs >= waveThresholds[i]) { waveIdx = i; break; }
    }
    this.waveText.setText(waveNames[waveIdx]);
  }

  updateCooldowns(cds: CooldownInfo[]) {
    this.cdGfx.clear();
    for (const t of this.cdTexts) t.destroy();
    this.cdTexts = [];

    if (cds.length === 0) return;

    const barW = 80, barH = 8, gap = 20;
    const startX = 790 - barW;
    let y = 540;

    for (let i = cds.length - 1; i >= 0; i--) {
      const cd = cds[i];
      this.cdGfx.fillStyle(0x222222, 0.7);
      this.cdGfx.fillRect(startX, y, barW, barH);
      const fillColor = cd.active ? 0xffffff : cd.color;
      this.cdGfx.fillStyle(fillColor, cd.active ? 0.9 : 0.7);
      this.cdGfx.fillRect(startX, y, barW * cd.ratio, barH);
      this.cdGfx.lineStyle(1, 0x666666, 0.5);
      this.cdGfx.strokeRect(startX, y, barW, barH);

      const label = cd.active ? `${cd.name} ✦` : cd.name;
      const txt = this.scene.add.text(startX + barW / 2, y - 2, label, {
        fontSize: "9px", color: cd.active ? "#ffffff" : "#cccccc",
        stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(901);
      this.cdTexts.push(txt);

      y -= gap;
    }
  }

  private scene: Phaser.Scene;
}
