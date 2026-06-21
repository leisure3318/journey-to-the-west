import Phaser from "phaser";

export class PauseMenu {
  private scene: Phaser.Scene;
  private paused = false;
  private elements: Phaser.GameObjects.GameObject[] = [];

  private onPause?: () => void;
  private onResume?: () => void;

  constructor(scene: Phaser.Scene, canToggle: () => boolean, onPause?: () => void, onResume?: () => void) {
    this.scene = scene;
    this.onPause = onPause;
    this.onResume = onResume;
    scene.input.keyboard!.on("keydown-ESC", () => {
      if (!canToggle()) return;
      if (this.paused) this.resume();
      else this.pause();
    });
  }

  isPaused(): boolean {
    return this.paused;
  }

  private pause() {
    this.paused = true;
    this.onPause?.();
    this.scene.physics.pause();

    const overlay = this.scene.add
      .rectangle(400, 300, 800, 600, 0x000000, 0.6)
      .setScrollFactor(0)
      .setDepth(1100);
    const title = this.scene.add
      .text(400, 260, "暂停", {
        fontSize: "36px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1101);
    const hint = this.scene.add
      .text(400, 340, "[ 按 ESC 继续 ]", {
        fontSize: "20px",
        color: "#ffdd44",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1101);

    this.elements = [overlay, title, hint];
  }

  private resume() {
    this.paused = false;
    this.onResume?.();
    for (const el of this.elements) el.destroy();
    this.elements = [];
    this.scene.physics.resume();
  }
}
