import Phaser from "phaser";
import { Relic } from "../systems/BossLootSystem";

const BAR_X = 774;
const START_Y = 152;
const SLOT_H = 50;

export class RelicBar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private slots: Phaser.GameObjects.Container[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setScrollFactor(0).setDepth(920);
  }

  addRelic(relic: Relic) {
    const idx = this.slots.length;
    const y = START_Y + idx * SLOT_H;

    const slot = this.scene.add.container(BAR_X, y);

    const bg = this.scene.add.rectangle(0, 0, 30, 30, 0x000000, 0.5)
      .setStrokeStyle(1, 0xffaa00, 0.6);
    slot.add(bg);

    const icon = this.scene.add.image(0, 0, relic.icon).setDisplaySize(24, 24);
    slot.add(icon);

    const buffLines = relic.buffs.map(b => b.label).join(" ");
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

    this.container.add(slot);
    this.slots.push(slot);

    this.playAddAnimation(slot);
  }

  private createTooltip(relic: Relic): Phaser.GameObjects.Container {
    const tip = this.scene.add.container(-44, 0);

    const lines = [relic.name, ...relic.buffs.map(b => b.label)];
    const maxW = Math.max(...lines.map(l => l.length)) * 12 + 20;
    const h = 24 + relic.buffs.length * 18;

    const bg = this.scene.add.rectangle(-maxW / 2, 0, maxW, h, 0x1a1a2e, 0.92)
      .setStrokeStyle(1, 0xffaa00, 0.6).setOrigin(0.5);
    tip.add(bg);

    const title = this.scene.add.text(-maxW / 2, -h / 2 + 6, relic.name, {
      fontSize: "12px", color: "#ffaa00", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5, 0);
    tip.add(title);

    relic.buffs.forEach((buff, i) => {
      const txt = this.scene.add.text(-maxW / 2, -h / 2 + 24 + i * 18, buff.label, {
        fontSize: "11px", color: "#66ff66",
        stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5, 0);
      tip.add(txt);
    });

    return tip;
  }

  private playAddAnimation(slot: Phaser.GameObjects.Container) {
    slot.setScale(0).setAlpha(0);
    this.scene.tweens.add({
      targets: slot,
      scaleX: 1, scaleY: 1, alpha: 1,
      duration: 400, ease: "Back.easeOut",
    });
  }
}
