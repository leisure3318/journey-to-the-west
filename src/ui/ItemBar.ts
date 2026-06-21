import Phaser from "phaser";
import { ChestItemDef } from "../systems/ChestSystem";

interface ItemSlot {
  def: ChestItemDef | null;
  count: number;
  bg?: Phaser.GameObjects.Rectangle;
  icon?: Phaser.GameObjects.Image;
  numTxt?: Phaser.GameObjects.Text;
  nameTxt?: Phaser.GameObjects.Text;
  countTxt?: Phaser.GameObjects.Text;
}

const MAX_SLOTS = 9;
const SLOT_SIZE = 38;
const SLOT_GAP = 3;
const BAR_Y = 530;
const DEPTH = 920;

export class ItemBar {
  private scene: Phaser.Scene;
  private slots: ItemSlot[] = [];
  private onUse: (item: ChestItemDef) => void;
  private keys: Phaser.Input.Keyboard.Key[] = [];
  private barBg?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, onUse: (item: ChestItemDef) => void) {
    this.scene = scene;
    this.onUse = onUse;
    for (let i = 0; i < MAX_SLOTS; i++) {
      this.keys.push(scene.input.keyboard!.addKey(49 + i));
      this.slots.push({ def: null, count: 0 });
    }
    this.rebuild();
  }

  addItem(item: ChestItemDef): boolean {
    const existing = this.slots.find(s => s.def?.id === item.id);
    if (existing) {
      existing.count++;
      this.rebuild();
      if (existing.bg) {
        this.scene.tweens.add({ targets: [existing.bg, existing.icon], scaleX: 1.2, scaleY: 1.2, duration: 100, yoyo: true });
      }
      return true;
    }
    const empty = this.slots.find(s => s.def === null);
    if (!empty) return false;
    empty.def = item;
    empty.count = 1;
    this.rebuild();
    if (empty.bg) {
      this.scene.tweens.add({ targets: [empty.bg, empty.icon], scaleX: 1.2, scaleY: 1.2, duration: 100, yoyo: true });
    }
    return true;
  }

  update() {
    for (let i = 0; i < this.keys.length; i++) {
      if (Phaser.Input.Keyboard.JustDown(this.keys[i])) {
        this.useItem(i);
        return;
      }
    }
  }

  private useItem(index: number) {
    const slot = this.slots[index];
    if (!slot?.def) return;
    this.onUse(slot.def);

    const x = slot.bg?.x ?? 400;
    const flash = this.scene.add.rectangle(x, BAR_Y, SLOT_SIZE + 4, SLOT_SIZE + 4, slot.def.tierColor, 0.6)
      .setScrollFactor(0).setDepth(DEPTH + 3);
    this.scene.tweens.add({ targets: flash, alpha: 0, scaleX: 1.5, scaleY: 1.5, duration: 300, onComplete: () => flash.destroy() });

    const useTxt = this.scene.add.text(400, BAR_Y - 30, `使用: ${slot.def.name}`, {
      fontSize: "12px", color: "#44ff44", fontStyle: "bold", stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTH + 3);
    this.scene.tweens.add({ targets: useTxt, y: BAR_Y - 60, alpha: 0, duration: 1000, onComplete: () => useTxt.destroy() });

    slot.count--;
    if (slot.count <= 0) {
      slot.def = null;
      slot.count = 0;
    }
    this.rebuild();
  }

  private destroySlotVisuals(slot: ItemSlot) {
    slot.bg?.destroy(); slot.bg = undefined;
    slot.icon?.destroy(); slot.icon = undefined;
    slot.numTxt?.destroy(); slot.numTxt = undefined;
    slot.nameTxt?.destroy(); slot.nameTxt = undefined;
    slot.countTxt?.destroy(); slot.countTxt = undefined;
  }

  private rebuild() {
    for (const slot of this.slots) this.destroySlotVisuals(slot);
    if (this.barBg) { this.barBg.destroy(); this.barBg = undefined; }

    const totalW = MAX_SLOTS * SLOT_SIZE + (MAX_SLOTS - 1) * SLOT_GAP;
    const startX = (800 - totalW) / 2;

    this.barBg = this.scene.add.graphics().setScrollFactor(0).setDepth(DEPTH - 1);
    this.barBg.fillStyle(0x000000, 0.5);
    this.barBg.fillRoundedRect(startX - 5, BAR_Y - SLOT_SIZE / 2 - 5, totalW + 10, SLOT_SIZE + 22, 5);

    for (let i = 0; i < MAX_SLOTS; i++) {
      const slot = this.slots[i];
      const x = startX + SLOT_SIZE / 2 + i * (SLOT_SIZE + SLOT_GAP);
      const hasItem = slot.def !== null;

      slot.bg = this.scene.add.rectangle(x, BAR_Y, SLOT_SIZE, SLOT_SIZE,
        hasItem ? 0x111111 : 0x0a0a0a, hasItem ? 0.8 : 0.4)
        .setStrokeStyle(2, hasItem ? slot.def!.tierColor : 0x333333)
        .setScrollFactor(0).setDepth(DEPTH).setInteractive();

      const idx = i;
      slot.bg.on("pointerdown", () => this.useItem(idx));

      slot.numTxt = this.scene.add.text(x, BAR_Y - SLOT_SIZE / 2 - 2, `${i + 1}`, {
        fontSize: "11px", color: hasItem ? "#ffdd44" : "#555555", fontStyle: "bold",
        stroke: "#000000", strokeThickness: 2,
      }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(DEPTH + 2);

      if (hasItem) {
        slot.icon = this.scene.add.image(x, BAR_Y, slot.def!.icon)
          .setDisplaySize(30, 30).setScrollFactor(0).setDepth(DEPTH + 1);

        const nameColor = slot.def!.tier === "legendary" ? "#ffaa00" : slot.def!.tier === "rare" ? "#6699ff" : "#cccccc";
        slot.nameTxt = this.scene.add.text(x, BAR_Y + SLOT_SIZE / 2 + 2, slot.def!.name, {
          fontSize: "8px", color: nameColor, stroke: "#000000", strokeThickness: 2,
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(DEPTH + 2);

        if (slot.count > 1) {
          slot.countTxt = this.scene.add.text(x + SLOT_SIZE / 2 - 2, BAR_Y + SLOT_SIZE / 2 - 2, `×${slot.count}`, {
            fontSize: "10px", color: "#ffffff", fontStyle: "bold", stroke: "#000000", strokeThickness: 2,
          }).setOrigin(1, 1).setScrollFactor(0).setDepth(DEPTH + 2);
        }
      }
    }
  }

  isFull(): boolean { return !this.slots.some(s => s.def === null); }
}
