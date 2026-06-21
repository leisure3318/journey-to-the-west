import Phaser from "phaser";
import { SoundManager } from "../systems/SoundManager";

export interface CutscenePage {
  image?: string;
  color?: number;
  text: string;
  speaker?: string;
}

export interface CutsceneConfig {
  id: string;
  pages: CutscenePage[];
  skippable: boolean;
  nextScene: string;
}

const CHAR_DELAY = 40;
const FADE_MS = 300;

export class CutsceneScene extends Phaser.Scene {
  private config!: CutsceneConfig;
  private pageIndex = 0;
  private imageObj!: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
  private textObj!: Phaser.GameObjects.Text;
  private speakerObj!: Phaser.GameObjects.Text;
  private textBox!: Phaser.GameObjects.Rectangle;
  private skipBtn!: Phaser.GameObjects.Text;
  private fullText = "";
  private charIndex = 0;
  private charTimer = 0;
  private typing = false;
  private ready = false;
  private soundMgr = new SoundManager();

  constructor() {
    super("CutsceneScene");
  }

  init(data: CutsceneConfig) {
    this.config = data;
    this.pageIndex = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this.imageObj = this.add.rectangle(400, 250, 780, 440, 0x222222).setDepth(0);

    this.textBox = this.add.rectangle(400, 520, 800, 160, 0x000000, 0.75).setDepth(1);

    this.speakerObj = this.add
      .text(40, 455, "", { fontSize: "16px", color: "#ffdd44", fontStyle: "bold" })
      .setDepth(2);

    this.textObj = this.add
      .text(40, 485, "", {
        fontSize: "16px", color: "#ffffff",
        wordWrap: { width: 720 }, lineSpacing: 6,
      })
      .setDepth(2);

    this.skipBtn = this.add
      .text(750, 12, "跳过 ▶", { fontSize: "13px", color: "#888888" })
      .setOrigin(1, 0)
      .setDepth(3)
      .setInteractive({ useHandCursor: true })
      .setVisible(this.config.skippable);

    this.skipBtn.on("pointerdown", () => this.finish());

    this.input.on("pointerdown", () => this.advance());
    this.input.keyboard!.on("keydown-SPACE", () => this.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.advance());

    this.showPage(0);
  }

  update(_time: number, delta: number) {
    if (!this.typing) return;
    this.charTimer += delta;
    while (this.charTimer >= CHAR_DELAY && this.charIndex < this.fullText.length) {
      this.charTimer -= CHAR_DELAY;
      this.charIndex++;
      this.textObj.setText(this.fullText.substring(0, this.charIndex));
      this.soundMgr.typewriter();
    }
    if (this.charIndex >= this.fullText.length) {
      this.typing = false;
      this.ready = true;
    }
  }

  private advance() {
    if (this.typing) {
      this.charIndex = this.fullText.length;
      this.textObj.setText(this.fullText);
      this.typing = false;
      this.ready = true;
      return;
    }
    if (!this.ready) return;
    if (this.pageIndex < this.config.pages.length - 1) {
      this.showPage(this.pageIndex + 1);
    } else {
      this.finish();
    }
  }

  private showPage(index: number) {
    this.pageIndex = index;
    this.ready = false;
    if (index > 0) this.soundMgr.pageFlip();
    const page = this.config.pages[index];

    this.tweens.add({
      targets: this.imageObj,
      alpha: 0,
      duration: FADE_MS,
      onComplete: () => {
        this.imageObj.destroy();
        if (page.image && this.textures.exists(page.image)) {
          this.imageObj = this.add.image(400, 250, page.image)
            .setDisplaySize(780, 440).setAlpha(0).setDepth(0);
        } else {
          this.imageObj = this.add.rectangle(400, 250, 780, 440, page.color ?? 0x222222)
            .setAlpha(0).setDepth(0);
        }
        this.tweens.add({ targets: this.imageObj, alpha: 1, duration: FADE_MS });
      },
    });

    this.speakerObj.setText(page.speaker ?? "");
    this.fullText = page.text;
    this.charIndex = 0;
    this.charTimer = 0;
    this.textObj.setText("");
    this.typing = true;
  }

  private finish() {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start(this.config.nextScene);
    });
  }
}
