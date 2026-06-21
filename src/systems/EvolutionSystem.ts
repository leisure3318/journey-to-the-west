import Phaser from "phaser";
import { EVOLUTIONS, EvolutionRecipe } from "../config/EvolutionConfig";
import { UpgradeState } from "../config/UpgradeConfig";

export class EvolutionSystem {
  private scene: Phaser.Scene;
  private evolved = new Set<string>();
  private upgradeLevels: Map<string, number>;
  private maxLevels: Map<string, number>;
  private onEvolve: (recipe: EvolutionRecipe) => void;

  constructor(scene: Phaser.Scene, upgradeLevels: Map<string, number>,
    maxLevels: Map<string, number>, onEvolve: (r: EvolutionRecipe) => void) {
    this.scene = scene;
    this.upgradeLevels = upgradeLevels;
    this.maxLevels = maxLevels;
    this.onEvolve = onEvolve;
  }

  check(upgrades: UpgradeState): EvolutionRecipe | null {
    for (const recipe of EVOLUTIONS) {
      if (this.evolved.has(recipe.id)) continue;
      const lvA = this.upgradeLevels.get(recipe.skillA) ?? 0;
      const lvB = this.upgradeLevels.get(recipe.skillB) ?? 0;
      const maxA = this.maxLevels.get(recipe.skillA) ?? 5;
      const maxB = this.maxLevels.get(recipe.skillB) ?? 5;
      if (lvA >= maxA && lvB >= maxB) {
        this.evolved.add(recipe.id);
        recipe.apply(upgrades);
        this.scene.events.emit("evolution-triggered");
        this.showEvolution(recipe);
        this.onEvolve(recipe);
        return recipe;
      }
    }
    return null;
  }

  private showEvolution(recipe: EvolutionRecipe) {
    this.scene.physics.pause();

    const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7)
      .setScrollFactor(0).setDepth(1100);

    const vfx = this.scene.add.image(400, 240, recipe.vfxKey)
      .setScrollFactor(0).setDepth(1101).setDisplaySize(40, 40).setAlpha(0);
    this.scene.tweens.add({
      targets: vfx, alpha: 1, displayWidth: 180, displayHeight: 180, angle: 360,
      duration: 800, ease: "Back.easeOut",
    });

    const title = this.scene.add.text(400, 150, "技能进化!", {
      fontSize: "20px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1102).setAlpha(0);

    const name = this.scene.add.text(400, 350, recipe.name, {
      fontSize: "36px", color: recipe.color, fontStyle: "bold",
      stroke: "#000000", strokeThickness: 6,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1102).setAlpha(0);

    const hero = this.scene.add.text(400, 390, recipe.hero, {
      fontSize: "14px", color: "#aaaaaa",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1102).setAlpha(0);

    const desc = this.scene.add.text(400, 420, recipe.desc, {
      fontSize: "16px", color: "#ffffff",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1102).setAlpha(0);

    this.scene.tweens.add({
      targets: [title, name, hero, desc], alpha: 1, duration: 400, delay: 300,
    });

    this.scene.time.delayedCall(2500, () => {
      this.scene.tweens.add({
        targets: [overlay, vfx, title, name, hero, desc], alpha: 0, duration: 500,
        onComplete: () => {
          overlay.destroy(); vfx.destroy(); title.destroy();
          name.destroy(); hero.destroy(); desc.destroy();
          this.scene.physics.resume();
        },
      });
    });
  }

  isEvolved(id: string): boolean { return this.evolved.has(id); }
  getEvolved(): Set<string> { return this.evolved; }
}
