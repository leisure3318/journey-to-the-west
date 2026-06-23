import Phaser from "phaser";
import { getBiome, BiomeType } from "../config/MapConfig";

interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: number; alpha: number; }

const MAX_PARTICLES = 40;

export class BiomeEffects {
  private scene: Phaser.Scene;
  private gfx: Phaser.GameObjects.Graphics;
  private overlay: Phaser.GameObjects.Rectangle;
  private particles: Particle[] = [];
  private timer = 0;
  private lastBiome: BiomeType = "grassland";

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.overlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0)
      .setScrollFactor(0).setDepth(850).setBlendMode(Phaser.BlendModes.ADD);
    this.gfx = scene.add.graphics().setScrollFactor(0).setDepth(851);
  }

  update(playerX: number, playerY: number, delta: number) {
    this.timer += delta;
    const biome = getBiome(playerX, playerY);
    this.lastBiome = biome;

    this.updateOverlay(biome);
    this.spawnParticles(biome, delta);
    this.updateParticles(delta);
    this.drawParticles();
  }

  private updateOverlay(biome: BiomeType) {
    switch (biome) {
      case "desert":
        this.overlay.setFillStyle(0xffcc44, 0.04 + Math.sin(this.timer / 2000) * 0.02);
        break;
      case "volcanic":
        this.overlay.setFillStyle(0xff4400, 0.05 + Math.sin(this.timer / 1500) * 0.03);
        break;
      case "swamp":
        this.overlay.setFillStyle(0x224444, 0.06 + Math.sin(this.timer / 3000) * 0.02);
        break;
      case "forest":
        this.overlay.setFillStyle(0x004400, 0.03 + Math.sin(this.timer / 4000) * 0.015);
        break;
      default:
        this.overlay.setFillStyle(0x000000, 0);
    }
  }

  private spawnParticles(biome: BiomeType, delta: number) {
    if (this.particles.length >= MAX_PARTICLES) return;
    const rate = biome === "grassland" ? 0 : 0.003;
    if (Math.random() > rate * delta) return;

    const x = Phaser.Math.Between(20, 780);
    const y = biome === "volcanic" ? Phaser.Math.Between(500, 600) : Phaser.Math.Between(0, 600);

    switch (biome) {
      case "volcanic":
        this.particles.push({ x, y, vx: (Math.random() - 0.5) * 20, vy: -30 - Math.random() * 40,
          life: 0, maxLife: 1500 + Math.random() * 1000, size: 1.5 + Math.random() * 2, color: 0xff6600, alpha: 0.7 });
        break;
      case "desert":
        this.particles.push({ x: -10, y: Phaser.Math.Between(100, 500), vx: 40 + Math.random() * 30, vy: -5 + Math.random() * 10,
          life: 0, maxLife: 2000 + Math.random() * 1500, size: 1 + Math.random(), color: 0xccaa66, alpha: 0.3 });
        break;
      case "swamp":
        this.particles.push({ x, y: Phaser.Math.Between(400, 580), vx: (Math.random() - 0.5) * 5, vy: -8 - Math.random() * 12,
          life: 0, maxLife: 3000 + Math.random() * 2000, size: 3 + Math.random() * 4, color: 0x88aaaa, alpha: 0.15 });
        break;
      case "forest":
        this.particles.push({ x, y: -5, vx: (Math.random() - 0.5) * 10, vy: 15 + Math.random() * 10,
          life: 0, maxLife: 3000 + Math.random() * 2000, size: 2 + Math.random() * 2, color: 0x44aa22, alpha: 0.25 });
        break;
    }
  }

  private updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;
      if (p.life >= p.maxLife) { this.particles.splice(i, 1); continue; }
      p.x += p.vx * (delta / 1000);
      p.y += p.vy * (delta / 1000);
    }
  }

  destroy() {
    this.gfx.destroy();
    this.overlay.destroy();
    this.particles.length = 0;
  }

  private drawParticles() {
    this.gfx.clear();
    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      const fade = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
      this.gfx.fillStyle(p.color, p.alpha * fade);
      this.gfx.fillCircle(p.x, p.y, p.size);
    }
  }
}
