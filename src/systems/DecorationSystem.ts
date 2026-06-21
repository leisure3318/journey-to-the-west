import Phaser from "phaser";
import { WORLD } from "../config/GameConfig";

export class DecorationSystem {
  private decorations: Phaser.GameObjects.Sprite[] = [];

  constructor(scene: Phaser.Scene) {
    const cx = WORLD.width / 2;
    const cy = WORLD.height / 2;
    const textures = ["deco_tree", "deco_rock", "deco_bush"];
    const weights = [0.4, 0.3, 0.3];

    for (let i = 0; i < 100; i++) {
      let x: number, y: number;
      do {
        x = Phaser.Math.Between(80, WORLD.width - 80);
        y = Phaser.Math.Between(80, WORLD.height - 80);
      } while (Phaser.Math.Distance.Between(x, y, cx, cy) < 200);

      let r = Math.random();
      let texIdx = 0;
      for (let w = 0; w < weights.length; w++) {
        r -= weights[w];
        if (r <= 0) { texIdx = w; break; }
      }

      const sprite = scene.add.sprite(x, y, textures[texIdx]);
      sprite.setAlpha(0.7);
      sprite.setDepth(y * 0.01);
      this.decorations.push(sprite);
    }
  }

  getSprites(): Phaser.GameObjects.Sprite[] {
    return this.decorations;
  }
}
