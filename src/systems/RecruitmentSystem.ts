import Phaser from "phaser";
import { POIConfig } from "../config/MapConfig";

export class RecruitmentSystem {
  private scene: Phaser.Scene;
  private recruitPOIs: POIConfig[];
  private recruited = new Set<string>();
  private nextIndex = 0;
  private onRecruit: (poi: POIConfig) => void;
  private indicator?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, pois: POIConfig[], onRecruit: (poi: POIConfig) => void) {
    this.scene = scene;
    this.recruitPOIs = pois.filter((p) => p.type === "recruit");
    this.onRecruit = onRecruit;
    this.createIndicator();
  }

  update(playerX: number, playerY: number) {
    if (this.nextIndex >= this.recruitPOIs.length) {
      if (this.indicator) this.indicator.setVisible(false);
      return;
    }

    const poi = this.recruitPOIs[this.nextIndex];
    const dist = Phaser.Math.Distance.Between(playerX, playerY, poi.x, poi.y);

    if (dist <= poi.radius) {
      this.recruited.add(poi.recruitKey!);
      this.onRecruit(poi);
      this.showRecruitEffect(poi);
      this.nextIndex++;
    }

    this.updateIndicator(playerX, playerY);
  }

  isRecruited(key: string): boolean {
    return this.recruited.has(key);
  }

  private createIndicator() {
    this.indicator = this.scene.add.text(400, 50, "", {
      fontSize: "13px", color: "#ffdd44",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(500);
  }

  private updateIndicator(px: number, py: number) {
    if (!this.indicator || this.nextIndex >= this.recruitPOIs.length) return;

    const poi = this.recruitPOIs[this.nextIndex];
    const angle = Phaser.Math.Angle.Between(px, py, poi.x, poi.y);
    const dist = Math.round(Phaser.Math.Distance.Between(px, py, poi.x, poi.y));
    const arrows = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"];
    const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const idx = Math.round((normalized / (Math.PI * 2)) * 8) % 8;
    this.indicator.setText(`${arrows[idx]} ${poi.name}（${poi.recruitName}）${dist}px`);
  }

  private showRecruitEffect(poi: POIConfig) {
    this.scene.cameras.main.flash(500, 255, 215, 0);

    const banner = this.scene.add.text(400, 200, `${poi.recruitName} 加入！`, {
      fontSize: "36px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 6,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(900).setAlpha(0);

    const subtitle = this.scene.add.text(400, 245, poi.message, {
      fontSize: "16px", color: "#ffffff",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(900).setAlpha(0);

    this.scene.tweens.add({
      targets: [banner, subtitle],
      alpha: 1, y: "-=20", duration: 400, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: [banner, subtitle],
          alpha: 0, y: "-=30", delay: 2000, duration: 600,
          onComplete: () => { banner.destroy(); subtitle.destroy(); },
        });
      },
    });
  }
}
