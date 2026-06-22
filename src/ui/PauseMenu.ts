import Phaser from "phaser";
import { SoundManager } from "../systems/SoundManager";
import { saveSystem } from "../systems/SaveSystem";

export class PauseMenu {
  private scene: Phaser.Scene;
  private paused = false;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private soundMgr: SoundManager;

  private onPause?: () => void;
  private onResume?: () => void;

  constructor(scene: Phaser.Scene, canToggle: () => boolean, soundMgr: SoundManager, onPause?: () => void, onResume?: () => void) {
    this.scene = scene;
    this.soundMgr = soundMgr;
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
      .setScrollFactor(0).setDepth(1100);
    const title = this.scene.add
      .text(400, 180, "暂停", {
        fontSize: "36px", color: "#ffffff", fontStyle: "bold",
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1101);
    const hint = this.scene.add
      .text(400, 420, "[ 按 ESC 继续 ]", {
        fontSize: "20px", color: "#ffdd44",
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1101);

    this.elements = [overlay, title, hint];
    this.buildVolumeSlider();
    this.buildMuteButton();
  }

  private buildVolumeSlider() {
    const sx = 300, sy = 270, w = 200, h = 10;

    const label = this.scene.add.text(sx - 10, sy, "音量", {
      fontSize: "16px", color: "#cccccc",
    }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(1101);

    const track = this.scene.add.rectangle(sx + w / 2, sy, w, h, 0x333333)
      .setStrokeStyle(1, 0x555555).setScrollFactor(0).setDepth(1101);

    const fillW = w * this.soundMgr.volume;
    const fill = this.scene.add.rectangle(sx + fillW / 2, sy, fillW, h, 0xffaa00)
      .setScrollFactor(0).setDepth(1102);

    const knob = this.scene.add.circle(sx + fillW, sy, 8, 0xffffff)
      .setStrokeStyle(2, 0xffaa00).setScrollFactor(0).setDepth(1103);

    const pctText = this.scene.add.text(sx + w + 16, sy, `${Math.round(this.soundMgr.volume * 100)}%`, {
      fontSize: "14px", color: "#ffaa00",
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(1101);

    const hitArea = this.scene.add.rectangle(sx + w / 2, sy, w + 20, 30, 0x000000, 0)
      .setScrollFactor(0).setDepth(1104).setInteractive({ useHandCursor: true });

    const setVol = (pointerX: number) => {
      const ratio = Phaser.Math.Clamp((pointerX - sx) / w, 0, 1);
      this.soundMgr.setVolume(ratio);
      saveSystem.setVolume(ratio);
      fill.setPosition(sx + (w * ratio) / 2, sy).setSize(w * ratio, h);
      knob.setPosition(sx + w * ratio, sy);
      pctText.setText(`${Math.round(ratio * 100)}%`);
    };

    hitArea.on("pointerdown", (p: Phaser.Input.Pointer) => setVol(p.x));
    hitArea.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.isDown) setVol(p.x);
    });

    this.elements.push(label, track, fill, knob, pctText, hitArea);
  }

  private buildMuteButton() {
    const bx = 400, by = 330;
    const muted = this.soundMgr.muted;
    const btn = this.scene.add.text(bx, by, muted ? "🔇 已静音" : "🔊 音效开启", {
      fontSize: "16px", color: muted ? "#ff6644" : "#66ff66",
      backgroundColor: "#222222", padding: { x: 14, y: 8 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1101).setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => {
      const nowMuted = this.soundMgr.toggleMute();
      btn.setText(nowMuted ? "🔇 已静音" : "🔊 音效开启");
      btn.setColor(nowMuted ? "#ff6644" : "#66ff66");
    });
    btn.on("pointerover", () => btn.setAlpha(0.8));
    btn.on("pointerout", () => btn.setAlpha(1));

    this.elements.push(btn);
  }

  private resume() {
    this.paused = false;
    this.onResume?.();
    for (const el of this.elements) el.destroy();
    this.elements = [];
    this.scene.physics.resume();
  }
}
