import Phaser from "phaser";
import { WORLD } from "../config/GameConfig";
import { BIOME_ZONES, BIOME_COLORS } from "../config/MapConfig";

export class TerrainSystem {
  constructor(scene: Phaser.Scene, biomeOverride?: import("../config/MapConfig").BiomeType) {
    const cx = WORLD.width / 2;
    const cy = WORLD.height / 2;

    scene.add.tileSprite(cx, cy, WORLD.width, WORLD.height, "grass_tile").setDepth(-2);

    const gfx = scene.add.graphics().setDepth(-1);
    if (biomeOverride && biomeOverride !== "grassland") {
      const c = BIOME_COLORS[biomeOverride];
      gfx.fillStyle(c.overlay, c.alpha);
      gfx.fillRect(0, 0, WORLD.width, WORLD.height);
      this.drawBiomeDetails(scene, biomeOverride);
    } else {
      for (const zone of BIOME_ZONES) {
        const c = BIOME_COLORS[zone.type];
        gfx.fillStyle(c.overlay, c.alpha * 0.25);
        gfx.fillCircle(zone.cx, zone.cy, zone.radius + 200);
        gfx.fillStyle(c.overlay, c.alpha);
        gfx.fillCircle(zone.cx, zone.cy, zone.radius);
        gfx.fillStyle(c.overlay, c.alpha * 0.3);
        gfx.fillCircle(zone.cx, zone.cy, zone.radius * 0.6);
      }
      this.drawDetails(scene);
    }
  }

  private drawBiomeDetails(scene: Phaser.Scene, biome: import("../config/MapConfig").BiomeType) {
    const gfx = scene.add.graphics().setDepth(-0.5);
    const w = WORLD.width, h = WORLD.height;
    const count = Math.floor((w * h) / 200000);

    if (biome === "forest") {
      for (let i = 0; i < count; i++) {
        gfx.fillStyle(0x0a1a08, 0.15 + Math.random() * 0.15);
        gfx.fillCircle(Math.random() * w, Math.random() * h, 20 + Math.random() * 40);
      }
    } else if (biome === "desert") {
      for (let i = 0; i < count; i++) {
        gfx.fillStyle(0x6a5a30, 0.12 + Math.random() * 0.1);
        gfx.fillEllipse(Math.random() * w, Math.random() * h, 60 + Math.random() * 80, 15 + Math.random() * 20);
      }
    } else if (biome === "swamp") {
      for (let i = 0; i < count; i++) {
        gfx.fillStyle(0x1a3a5a, 0.15 + Math.random() * 0.15);
        gfx.fillEllipse(Math.random() * w, Math.random() * h, 30 + Math.random() * 50, 20 + Math.random() * 30);
      }
    } else if (biome === "volcanic") {
      for (let i = 0; i < count * 0.5; i++) {
        gfx.fillStyle(0xff2200, 0.06 + Math.random() * 0.06);
        gfx.fillEllipse(Math.random() * w, Math.random() * h, 10 + Math.random() * 40, 3 + Math.random() * 8);
      }
      for (let i = 0; i < count; i++) {
        gfx.fillStyle(0x1a0808, 0.15);
        gfx.fillCircle(Math.random() * w, Math.random() * h, 15 + Math.random() * 35);
      }
    }
  }

  private drawDetails(scene: Phaser.Scene) {
    const gfx = scene.add.graphics().setDepth(-0.5);

    const fz = BIOME_ZONES.find(z => z.type === "forest")!;
    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * fz.radius * 0.9;
      gfx.fillStyle(0x0a1a08, 0.15 + Math.random() * 0.15);
      gfx.fillCircle(fz.cx + Math.cos(a) * r, fz.cy + Math.sin(a) * r, 20 + Math.random() * 40);
    }

    const dz = BIOME_ZONES.find(z => z.type === "desert")!;
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * dz.radius * 0.85;
      gfx.fillStyle(0x6a5a30, 0.12 + Math.random() * 0.1);
      gfx.fillEllipse(
        dz.cx + Math.cos(a) * r, dz.cy + Math.sin(a) * r,
        60 + Math.random() * 80, 15 + Math.random() * 20,
      );
    }

    const sz = BIOME_ZONES.find(z => z.type === "swamp")!;
    for (let i = 0; i < 25; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * sz.radius * 0.85;
      gfx.fillStyle(0x1a3a5a, 0.15 + Math.random() * 0.15);
      gfx.fillEllipse(
        sz.cx + Math.cos(a) * r, sz.cy + Math.sin(a) * r,
        30 + Math.random() * 50, 20 + Math.random() * 30,
      );
    }

    const vz = BIOME_ZONES.find(z => z.type === "volcanic")!;
    for (let i = 0; i < 15; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * vz.radius * 0.8;
      gfx.fillStyle(0xff2200, 0.06 + Math.random() * 0.06);
      gfx.fillEllipse(
        vz.cx + Math.cos(a) * r, vz.cy + Math.sin(a) * r,
        10 + Math.random() * 40, 3 + Math.random() * 8,
      );
    }
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * vz.radius * 0.9;
      gfx.fillStyle(0x1a0808, 0.15);
      gfx.fillCircle(vz.cx + Math.cos(a) * r, vz.cy + Math.sin(a) * r, 15 + Math.random() * 35);
    }
  }
}
