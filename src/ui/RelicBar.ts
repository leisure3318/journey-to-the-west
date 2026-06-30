import Phaser from "phaser";
import { Relic } from "../systems/BossLootSystem";

const BAR_X = 774;
const START_Y = 152;
const SLOT_H = 44;
const MAX_VISIBLE = 6;

export class RelicBar {
  private scene: Phaser.Scene;
  private relics: Relic[] = [];
  private slotVisuals: Phaser.GameObjects.Container[] = [];
  private moreText?: Phaser.GameObjects.Text;
  private panelOpen = false;
  private panelContainer?: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addRelic(relic: Relic) {
    this.relics.push(relic);
    this.rebuild();
  }

  private rebuild() {
    for (const v of this.slotVisuals) v.destroy();
    this.slotVisuals = [];
    this.moreText?.destroy();
    this.moreText = undefined;

    const show = Math.min(this.relics.length, MAX_VISIBLE);
    for (let i = 0; i < show; i++) {
      const slot = this.createSlot(this.relics[i], i);
      this.slotVisuals.push(slot);
    }

    if (this.relics.length > MAX_VISIBLE) {
      const extra = this.relics.length - MAX_VISIBLE;
      const y = START_Y + MAX_VISIBLE * SLOT_H;
      this.moreText = this.scene.add.text(BAR_X, y, `+${extra} 宝物`, {
        fontSize: "10px", color: "#ffaa00", fontStyle: "bold",
        stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(920)
        .setInteractive({ useHandCursor: true });
      this.moreText.on("pointerdown", () => this.togglePanel());
    }
  }

  private createSlot(relic: Relic, index: number): Phaser.GameObjects.Container {
    const y = START_Y + index * SLOT_H;
    const slot = this.scene.add.container(BAR_X, y).setScrollFactor(0).setDepth(920);

    const bg = this.scene.add.rectangle(0, 0, 30, 30, 0x000000, 0.5)
      .setStrokeStyle(1, 0xffaa00, 0.6);
    slot.add(bg);

    const icon = this.scene.add.image(0, 0, relic.icon).setDisplaySize(24, 24);
    slot.add(icon);

    const buffLines = (relic.buffs ?? []).map(b => b.label).join(" ");
    const buffText = this.scene.add.text(-6, 18, buffLines, {
      fontSize: "8px", color: "#aaddaa",
      stroke: "#000000", strokeThickness: 2,
      wordWrap: { width: 90 },
    }).setOrigin(1, 0);
    slot.add(buffText);

    const tooltip = this.createTooltip(relic);
    tooltip.setVisible(false);
    slot.add(tooltip);

    bg.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(-40, -8, 80, SLOT_H),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });
    bg.on("pointerover", () => { tooltip.setVisible(true); bg.setStrokeStyle(2, 0xffdd44); });
    bg.on("pointerout", () => { tooltip.setVisible(false); bg.setStrokeStyle(1, 0xffaa00, 0.6); });

    if (index === 0) {
      slot.setScale(0).setAlpha(0);
      this.scene.tweens.add({ targets: slot, scaleX: 1, scaleY: 1, alpha: 1, duration: 400, ease: "Back.easeOut" });
    }

    return slot;
  }

  private createTooltip(relic: Relic): Phaser.GameObjects.Container {
    const tip = this.scene.add.container(-44, 0);
    const buffs = relic.buffs ?? [];
    const lines = [relic.name, ...buffs.map(b => b.label)];
    const maxW = Math.max(...lines.map(l => l.length)) * 12 + 20;
    const h = 24 + buffs.length * 18;

    const bg = this.scene.add.rectangle(-maxW / 2, 0, maxW, h, 0x1a1a2e, 0.92)
      .setStrokeStyle(1, 0xffaa00, 0.6).setOrigin(0.5);
    tip.add(bg);

    const title = this.scene.add.text(-maxW / 2, -h / 2 + 6, relic.name, {
      fontSize: "12px", color: "#ffaa00", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5, 0);
    tip.add(title);

    (relic.buffs ?? []).forEach((buff, i) => {
      const txt = this.scene.add.text(-maxW / 2, -h / 2 + 24 + i * 18, buff.label, {
        fontSize: "11px", color: "#66ff66",
        stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5, 0);
      tip.add(txt);
    });

    return tip;
  }

  private togglePanel() {
    if (this.panelOpen) { this.closePanel(); return; }
    this.panelOpen = true;

    const panelW = 320, panelH = Math.min(400, 50 + this.relics.length * 36);
    const px = 400, py = 300;

    this.panelContainer = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(970);

    const bg = this.scene.add.rectangle(px, py, panelW, panelH, 0x0a0a1e, 0.95)
      .setStrokeStyle(2, 0xffaa00).setInteractive();
    this.panelContainer.add(bg);

    this.panelContainer.add(this.scene.add.text(px, py - panelH / 2 + 16, `全部宝物 (${this.relics.length})`, {
      fontSize: "16px", color: "#ffaa00", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5));

    const startY = py - panelH / 2 + 44;
    for (let i = 0; i < this.relics.length; i++) {
      const r = this.relics[i];
      const ry = startY + i * 36;

      const icon = this.scene.add.image(px - panelW / 2 + 30, ry, r.icon).setDisplaySize(24, 24);
      const name = this.scene.add.text(px - panelW / 2 + 52, ry - 8, r.name, {
        fontSize: "12px", color: "#ffaa00", fontStyle: "bold",
        stroke: "#000000", strokeThickness: 2,
      });
      const buffs = this.scene.add.text(px - panelW / 2 + 52, ry + 8, (r.buffs ?? []).map(b => b.label).join("  "), {
        fontSize: "9px", color: "#66ff66",
        stroke: "#000000", strokeThickness: 2,
      });
      this.panelContainer.add([icon, name, buffs]);
    }

    const closeBtn = this.scene.add.text(px, py + panelH / 2 - 16, "[ 关闭 ]", {
      fontSize: "14px", color: "#aaaaaa",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on("pointerover", () => closeBtn.setColor("#ffffff"));
    closeBtn.on("pointerout", () => closeBtn.setColor("#aaaaaa"));
    closeBtn.on("pointerdown", () => this.closePanel());
    this.panelContainer.add(closeBtn);
  }

  private closePanel() {
    this.panelOpen = false;
    this.panelContainer?.destroy();
    this.panelContainer = undefined;
  }
}
