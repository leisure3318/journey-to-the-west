import Phaser from "phaser";
import { UPGRADES, SOLO_UPGRADES, UpgradeOption, SKILL_HERO } from "../config/GameConfig";

const DEPTH = 1000;

export class LevelUpPanel {
  private scene: Phaser.Scene;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private upgradeLevels = new Map<string, number>();
  private onSelect: (upgrade: UpgradeOption) => void;
  private active = false;

  constructor(scene: Phaser.Scene, onSelect: (upgrade: UpgradeOption) => void) {
    this.scene = scene;
    this.onSelect = onSelect;

    for (const u of UPGRADES) {
      this.upgradeLevels.set(u.id, 0);
    }
  }

  show(pool?: UpgradeOption[]) {
    if (this.active) return;
    this.active = true;
    this.scene.physics.pause();
    this.clear();

    const overlay = this.scene.add
      .rectangle(400, 300, 800, 600, 0x000000, 0.6)
      .setScrollFactor(0)
      .setDepth(DEPTH);
    this.elements.push(overlay);

    const title = this.scene.add
      .text(400, 100, "升级！选择一项强化", {
        fontSize: "24px",
        color: "#ffdd44",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH + 1);
    this.elements.push(title);

    const source = pool ?? UPGRADES;
    const available = source.filter(
      (u) => (this.upgradeLevels.get(u.id) ?? 0) < u.maxLevel,
    );
    const options = Phaser.Utils.Array.Shuffle([...available]).slice(0, 3);

    if (options.length === 0) {
      this.hide();
      return;
    }

    const cardW = 200;
    const gap = 20;
    const totalW = options.length * cardW + (options.length - 1) * gap;
    const startX = 400 - totalW / 2 + cardW / 2;

    options.forEach((opt, i) => {
      const cx = startX + i * (cardW + gap);
      const cy = 280;
      const curLv = this.upgradeLevels.get(opt.id) ?? 0;

      const cardH = 220;
      const card = this.scene.add
        .rectangle(cx, cy, cardW, cardH, 0x1a1a3e, 0.9)
        .setStrokeStyle(2, 0x6666aa)
        .setScrollFactor(0)
        .setDepth(DEPTH + 1)
        .setInteractive({ useHandCursor: true });

      card.on("pointerover", () => card.setStrokeStyle(3, 0xffdd44));
      card.on("pointerout", () => card.setStrokeStyle(2, 0x6666aa));

      card.on("pointerdown", () => {
        this.upgradeLevels.set(opt.id, curLv + 1);
        this.hide();
        this.onSelect(opt);
      });

      const hero = SKILL_HERO[opt.id];
      const heroName = hero?.name ?? "";
      const heroColorStr = hero?.colorStr ?? "#aaaaaa";

      const heroTag = this.scene.add
        .text(cx, cy - 95, heroName, {
          fontSize: "13px",
          color: heroColorStr,
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH + 2);

      const iconSize = 48;
      const icon = this.scene.add.image(cx, cy - 65, opt.icon)
        .setDisplaySize(iconSize, iconSize)
        .setScrollFactor(0)
        .setDepth(DEPTH + 2);

      const nameText = this.scene.add
        .text(cx, cy - 30, opt.name, {
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH + 2);

      const descText = this.scene.add
        .text(cx, cy + 10, opt.desc, {
          fontSize: "14px",
          color: "#cccccc",
          wordWrap: { width: cardW - 20 },
          align: "center",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH + 2);

      const lvText = this.scene.add
        .text(cx, cy + 70, `Lv ${curLv} → ${curLv + 1}`, {
          fontSize: "14px",
          color: "#88ff88",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH + 2);

      this.elements.push(card, heroTag, icon, nameText, descText, lvText);
    });
  }

  private clear() {
    for (const el of this.elements) {
      el.destroy();
    }
    this.elements = [];
  }

  private hide() {
    this.active = false;
    this.clear();
    this.scene.physics.resume();
  }

  isActive(): boolean {
    return this.active;
  }

  getLevels(): Map<string, number> { return this.upgradeLevels; }

  getMaxLevels(): Map<string, number> {
    const m = new Map<string, number>();
    for (const u of [...UPGRADES, ...SOLO_UPGRADES]) m.set(u.id, u.maxLevel);
    return m;
  }
}
