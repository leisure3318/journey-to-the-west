import Phaser from "phaser";
import { POIConfig } from "../config/MapConfig";

export class LandmarkSystem {
  private scene: Phaser.Scene;
  private labels = new Map<string, Phaser.GameObjects.Text>();
  private graphics = new Map<string, Phaser.GameObjects.Graphics>();

  constructor(scene: Phaser.Scene, pois: POIConfig[]) {
    this.scene = scene;
    for (const poi of pois) this.drawPOI(poi);
  }

  hidePOI(id: string) {
    this.labels.get(id)?.setVisible(false);
    this.graphics.get(id)?.setVisible(false);
  }

  private drawPOI(poi: POIConfig) {
    const gfx = this.scene.add.graphics().setDepth(1);
    this.graphics.set(poi.id, gfx);

    const drawFn = this.terrainDrawers[poi.terrain];
    if (drawFn) drawFn(gfx, poi.x, poi.y);

    const color = poi.type === "recruit" ? 0x44ff44 : 0xff4444;
    gfx.lineStyle(2, color, 0.4);
    gfx.strokeCircle(poi.x, poi.y, poi.radius);

    const labelColor = poi.type === "recruit" ? "#44ff44" : "#ff6644";
    const label = this.scene.add.text(poi.x, poi.y - poi.radius - 15, poi.name, {
      fontSize: "14px", color: labelColor, fontStyle: "bold",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(2);
    this.labels.set(poi.id, label);
  }

  private terrainDrawers: Record<string, (gfx: Phaser.GameObjects.Graphics, x: number, y: number) => void> = {
    mountain: (gfx, x, y) => {
      gfx.fillStyle(0x6a5a4a);
      gfx.fillTriangle(x - 80, y + 40, x - 20, y - 60, x + 30, y + 40);
      gfx.fillTriangle(x - 30, y + 40, x + 20, y - 80, x + 80, y + 40);
      gfx.fillStyle(0xeeeeff, 0.7);
      gfx.fillTriangle(x - 20, y - 60, x - 10, y - 45, x + 5, y - 55);
      gfx.fillTriangle(x + 20, y - 80, x + 30, y - 65, x + 45, y - 72);
      gfx.fillStyle(0xffaa00, 0.15);
      gfx.fillCircle(x, y - 30, 40);
    },
    village: (gfx, x, y) => {
      for (const [ox, oy] of [[-50, -10], [30, -20], [-10, 30], [50, 20]] as [number, number][]) {
        gfx.fillStyle(0x8b7355);
        gfx.fillRect(x + ox - 15, y + oy, 30, 22);
        gfx.fillStyle(0xaa3333);
        gfx.fillTriangle(x + ox - 20, y + oy, x + ox, y + oy - 16, x + ox + 20, y + oy);
      }
      gfx.lineStyle(1, 0x8b7355, 0.5);
      gfx.strokeRect(x - 75, y - 45, 150, 90);
    },
    river: (gfx, x, y) => {
      gfx.fillStyle(0x3a6a9a, 0.6);
      gfx.fillRect(x - 100, y - 20, 200, 40);
      gfx.fillStyle(0xc8b070, 0.5);
      gfx.fillRect(x - 110, y - 30, 220, 12);
      gfx.fillRect(x - 110, y + 18, 220, 12);
      gfx.lineStyle(1, 0x88bbdd, 0.4);
      for (let i = 0; i < 6; i++) {
        gfx.lineBetween(x - 80 + i * 30, y - 5, x - 65 + i * 30, y - 5);
      }
    },
    ridge: (gfx, x, y) => {
      gfx.fillStyle(0x5a4a3a);
      gfx.fillTriangle(x - 70, y + 30, x, y - 50, x + 70, y + 30);
      gfx.fillStyle(0x4a3a2a, 0.8);
      gfx.fillTriangle(x - 40, y + 30, x + 10, y - 30, x + 60, y + 30);
      gfx.fillStyle(0xff3300, 0.1);
      gfx.fillCircle(x, y, 50);
    },
    cave: (gfx, x, y) => {
      gfx.fillStyle(0x4a4a4a);
      gfx.fillTriangle(x - 60, y + 30, x, y - 40, x + 60, y + 30);
      gfx.fillStyle(0x1a1a1a);
      gfx.fillEllipse(x, y + 10, 40, 30);
      gfx.fillStyle(0xff4400, 0.2);
      gfx.fillCircle(x, y + 5, 15);
    },
  };
}
