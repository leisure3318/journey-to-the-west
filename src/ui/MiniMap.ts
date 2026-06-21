import Phaser from "phaser";
import { WORLD } from "../config/GameConfig";
import { POIConfig } from "../config/MapConfig";
import { FogOfWar } from "../systems/FogOfWar";

const MAP_W = 160;
const MAP_H = 120;
const MAP_X = 800 - MAP_W - 10;
const MAP_Y = 10;

export class MiniMap {
  private gfx: Phaser.GameObjects.Graphics;
  private pois: POIConfig[];
  private discovered = new Set<string>();
  private scaleX: number;
  private scaleY: number;

  constructor(scene: Phaser.Scene, pois: POIConfig[]) {
    this.gfx = scene.add.graphics().setScrollFactor(0).setDepth(960);
    this.pois = pois;
    this.scaleX = MAP_W / WORLD.width;
    this.scaleY = MAP_H / WORLD.height;
  }

  update(playerX: number, playerY: number, fog: FogOfWar, chestPositions?: { x: number; y: number }[]) {
    this.gfx.clear();

    // 背景边框
    this.gfx.fillStyle(0x000000, 0.6);
    this.gfx.fillRect(MAP_X - 2, MAP_Y - 2, MAP_W + 4, MAP_H + 4);

    // 迷雾渲染（已探索=深绿，未探索=黑色）
    const grid = fog.getRevealedGrid();
    const cellW = MAP_W / FogOfWar.getCols();
    const cellH = MAP_H / FogOfWar.getRows();

    for (let y = 0; y < FogOfWar.getRows(); y++) {
      for (let x = 0; x < FogOfWar.getCols(); x++) {
        if (grid[y][x]) {
          this.gfx.fillStyle(0x2d5a27, 0.8);
        } else {
          this.gfx.fillStyle(0x111111, 0.8);
        }
        this.gfx.fillRect(MAP_X + x * cellW, MAP_Y + y * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // POI 标记（仅已发现的）
    for (const poi of this.pois) {
      if (!fog.isRevealed(poi.x, poi.y) && !this.discovered.has(poi.id)) continue;
      this.discovered.add(poi.id);

      const mx = MAP_X + poi.x * this.scaleX;
      const my = MAP_Y + poi.y * this.scaleY;
      const color = poi.type === "recruit" ? 0x44ff44 : 0xff4444;
      this.gfx.fillStyle(color);
      this.gfx.fillCircle(mx, my, 3);
    }

    // 宝箱标记（已揭雾的）
    if (chestPositions) {
      for (const cp of chestPositions) {
        if (!fog.isRevealed(cp.x, cp.y)) continue;
        const cx = MAP_X + cp.x * this.scaleX;
        const cy = MAP_Y + cp.y * this.scaleY;
        this.gfx.fillStyle(0xffaa00);
        this.gfx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
      }
    }

    // 玩家位置
    const px = MAP_X + playerX * this.scaleX;
    const py = MAP_Y + playerY * this.scaleY;
    this.gfx.fillStyle(0xffdd44);
    this.gfx.fillRect(px - 2, py - 2, 4, 4);
  }
}
