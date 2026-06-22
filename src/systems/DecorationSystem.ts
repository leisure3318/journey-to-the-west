import Phaser from "phaser";
import { WORLD } from "../config/GameConfig";
import { getBiome, BiomeType } from "../config/MapConfig";

const BIOME_DECOS: Record<BiomeType, { textures: string[]; weights: number[] }> = {
  grassland: { textures: ["deco_tree", "deco_rock", "deco_bush"], weights: [0.4, 0.3, 0.3] },
  forest:    { textures: ["deco_pine", "deco_tree", "deco_mushroom", "deco_bush"], weights: [0.35, 0.3, 0.15, 0.2] },
  desert:    { textures: ["deco_cactus", "deco_dead_tree", "deco_rock", "deco_dune"], weights: [0.3, 0.25, 0.2, 0.25] },
  swamp:     { textures: ["deco_reed", "deco_pool", "deco_bush", "deco_rock"], weights: [0.3, 0.25, 0.25, 0.2] },
  volcanic:  { textures: ["deco_lava_rock", "deco_dead_tree", "deco_ember", "deco_rock"], weights: [0.3, 0.25, 0.25, 0.2] },
};

export class DecorationSystem {
  private decorations: Phaser.GameObjects.Sprite[] = [];

  constructor(scene: Phaser.Scene) {
    const cx = WORLD.width / 2;
    const cy = WORLD.height / 2;

    for (let i = 0; i < 350; i++) {
      let x: number, y: number;
      do {
        x = Phaser.Math.Between(80, WORLD.width - 80);
        y = Phaser.Math.Between(80, WORLD.height - 80);
      } while (Phaser.Math.Distance.Between(x, y, cx, cy) < 200);

      const biome = getBiome(x, y);
      const deco = BIOME_DECOS[biome];
      let r = Math.random();
      let texIdx = 0;
      for (let w = 0; w < deco.weights.length; w++) {
        r -= deco.weights[w];
        if (r <= 0) { texIdx = w; break; }
      }

      const sprite = scene.add.sprite(x, y, deco.textures[texIdx]);
      sprite.setAlpha(0.7);
      sprite.setDepth(y * 0.01);

      if (biome === "volcanic") sprite.setTint(0xcc8888);
      else if (biome === "desert") sprite.setTint(0xccbb88);
      else if (biome === "swamp") sprite.setTint(0x88bbaa);

      this.decorations.push(sprite);
    }
  }

  getSprites(): Phaser.GameObjects.Sprite[] {
    return this.decorations;
  }
}
