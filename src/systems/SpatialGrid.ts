import { Enemy } from "../entities/Enemy";

const CELL = 200;

export class SpatialGrid {
  private cells = new Map<number, Enemy[]>();
  private cols: number;

  constructor(worldW: number, private worldH: number) {
    this.cols = Math.ceil(worldW / CELL);
  }

  private key(cx: number, cy: number): number {
    return cy * this.cols + cx;
  }

  rebuild(enemies: Phaser.GameObjects.GameObject[]) {
    this.cells.clear();
    for (const child of enemies) {
      const e = child as Enemy;
      if (!e.active) continue;
      const cx = Math.floor(e.x / CELL);
      const cy = Math.floor(e.y / CELL);
      const k = this.key(cx, cy);
      const arr = this.cells.get(k);
      if (arr) arr.push(e);
      else this.cells.set(k, [e]);
    }
  }

  queryRadius(x: number, y: number, radius: number): Enemy[] {
    const minCx = Math.floor((x - radius) / CELL);
    const maxCx = Math.floor((x + radius) / CELL);
    const minCy = Math.floor((y - radius) / CELL);
    const maxCy = Math.floor((y + radius) / CELL);
    const r2 = radius * radius;
    const result: Enemy[] = [];

    for (let cy = minCy; cy <= maxCy; cy++) {
      for (let cx = minCx; cx <= maxCx; cx++) {
        const arr = this.cells.get(this.key(cx, cy));
        if (!arr) continue;
        for (const e of arr) {
          const dx = e.x - x, dy = e.y - y;
          if (dx * dx + dy * dy <= r2) result.push(e);
        }
      }
    }
    return result;
  }
}
