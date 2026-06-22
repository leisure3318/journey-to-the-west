import Phaser from "phaser";
import { WORLD } from "../config/GameConfig";

const CELL = 80;
const COLS = Math.ceil(WORLD.width / CELL);
const ROWS = Math.ceil(WORLD.height / CELL);
const REVEAL_RADIUS = 320;

export class FogOfWar {
  private revealed: boolean[][];
  private fogGfx: Phaser.GameObjects.Graphics;
  private dirty = true;

  constructor(scene: Phaser.Scene) {
    this.revealed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    this.fogGfx = scene.add.graphics().setDepth(50);
  }

  update(playerX: number, playerY: number) {
    const cellR = Math.ceil(REVEAL_RADIUS / CELL);
    const pcx = Math.floor(playerX / CELL);
    const pcy = Math.floor(playerY / CELL);

    for (let dy = -cellR; dy <= cellR; dy++) {
      for (let dx = -cellR; dx <= cellR; dx++) {
        const cx = pcx + dx;
        const cy = pcy + dy;
        if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) continue;
        if (this.revealed[cy][cx]) continue;

        const wx = cx * CELL + CELL / 2;
        const wy = cy * CELL + CELL / 2;
        if (Math.hypot(wx - playerX, wy - playerY) <= REVEAL_RADIUS) {
          this.revealed[cy][cx] = true;
          this.dirty = true;
        }
      }
    }

    if (this.dirty) {
      this.dirty = false;
      this.redraw();
    }
  }

  isRevealed(x: number, y: number): boolean {
    const cx = Math.floor(x / CELL);
    const cy = Math.floor(y / CELL);
    if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return false;
    return this.revealed[cy][cx];
  }

  getRevealedGrid(): boolean[][] {
    return this.revealed;
  }

  private redraw() {
    this.fogGfx.clear();
    this.fogGfx.fillStyle(0x000000, 0.7);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!this.revealed[y][x]) {
          this.fogGfx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    }
  }

  static getCellSize(): number { return CELL; }
  static getCols(): number { return COLS; }
  static getRows(): number { return ROWS; }
}
