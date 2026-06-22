import Phaser from "phaser";
import { WORLD } from "../config/GameConfig";
import { getBiome, BiomeType } from "../config/MapConfig";

const BIOME_OBSTACLES: Record<BiomeType, string[]> = {
  grassland: ["deco_rock", "deco_tree"],
  forest: ["deco_pine", "deco_rock"],
  desert: ["deco_rock", "deco_cactus"],
  swamp: ["deco_rock", "deco_reed"],
  volcanic: ["deco_lava_rock", "deco_rock"],
};

const OBSTACLE_COUNT = 70;

export class ObstacleSystem {
  private group: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene) {
    this.group = scene.physics.add.staticGroup();
    const cx = WORLD.width / 2, cy = WORLD.height / 2;

    for (let i = 0; i < OBSTACLE_COUNT; i++) {
      let x: number, y: number;
      do {
        x = Phaser.Math.Between(100, WORLD.width - 100);
        y = Phaser.Math.Between(100, WORLD.height - 100);
      } while (Phaser.Math.Distance.Between(x, y, cx, cy) < 350);

      const biome = getBiome(x, y);
      const textures = BIOME_OBSTACLES[biome];
      const tex = textures[Math.floor(Math.random() * textures.length)];

      const obs = this.group.create(x, y, tex) as Phaser.Physics.Arcade.Sprite;
      const scale = 1.8 + Math.random() * 0.8;
      obs.setScale(scale).setAlpha(0.85).setDepth(y * 0.01);

      if (biome === "volcanic") obs.setTint(0xcc8888);
      else if (biome === "desert") obs.setTint(0xccbb88);
      else if (biome === "swamp") obs.setTint(0x88bbaa);

      obs.refreshBody();
      const body = obs.body as Phaser.Physics.Arcade.StaticBody;
      const bw = obs.displayWidth * 0.5;
      const bh = obs.displayHeight * 0.5;
      body.setSize(bw, bh);
      body.setOffset((obs.width - bw / scale) / 2, (obs.height - bh / scale) / 2);
    }
  }

  getGroup(): Phaser.Physics.Arcade.StaticGroup {
    return this.group;
  }
}
