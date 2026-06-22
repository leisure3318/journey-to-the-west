import Phaser from "phaser";

const BASE_R = 50;
const THUMB_R = 20;
const DEAD_ZONE = 8;

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private base: Phaser.GameObjects.Arc;
  private thumb: Phaser.GameObjects.Arc;
  private active = false;
  private pointerId = -1;
  dx = 0;
  dy = 0;

  readonly enabled: boolean;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.enabled = scene.sys.game.device.input.touch;

    const bx = 100, by = 500;
    this.base = scene.add.circle(bx, by, BASE_R, 0xffffff, 0.12)
      .setStrokeStyle(2, 0xffffff, 0.25)
      .setScrollFactor(0).setDepth(1000).setVisible(this.enabled);
    this.thumb = scene.add.circle(bx, by, THUMB_R, 0xffffff, 0.3)
      .setScrollFactor(0).setDepth(1001).setVisible(this.enabled);

    if (!this.enabled) return;

    scene.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.active) return;
      if (p.x < 250 && p.y > 350) {
        this.active = true;
        this.pointerId = p.id;
        this.base.setPosition(p.x, p.y);
        this.thumb.setPosition(p.x, p.y);
      }
    });

    scene.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (!this.active || p.id !== this.pointerId) return;
      const ox = p.x - this.base.x;
      const oy = p.y - this.base.y;
      const dist = Math.sqrt(ox * ox + oy * oy);

      if (dist < DEAD_ZONE) {
        this.dx = 0;
        this.dy = 0;
        this.thumb.setPosition(this.base.x, this.base.y);
        return;
      }

      const clamped = Math.min(dist, BASE_R);
      const nx = ox / dist;
      const ny = oy / dist;
      this.dx = nx;
      this.dy = ny;
      this.thumb.setPosition(this.base.x + nx * clamped, this.base.y + ny * clamped);
    });

    const release = (p: Phaser.Input.Pointer) => {
      if (p.id !== this.pointerId) return;
      this.active = false;
      this.pointerId = -1;
      this.dx = 0;
      this.dy = 0;
      this.thumb.setPosition(this.base.x, this.base.y);
    };
    scene.input.on("pointerup", release);
    scene.input.on("pointerupoutside", release);
  }

  isActive(): boolean {
    return this.active;
  }
}
