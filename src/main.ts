import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { CutsceneScene } from "./scenes/CutsceneScene";
import { StageSelectScene } from "./scenes/StageSelectScene";
import { GalleryScene } from "./scenes/GalleryScene";
import { GameScene } from "./scenes/GameScene";

const errorDiv = document.createElement("div");
errorDiv.style.cssText = "position:fixed;top:0;left:0;right:0;background:rgba(200,0,0,0.9);color:#fff;font:14px monospace;padding:8px;z-index:99999;display:none;max-height:30vh;overflow:auto;";
document.body.appendChild(errorDiv);

function showError(msg: string) {
  errorDiv.style.display = "block";
  errorDiv.textContent = `[ERROR] ${msg}`;
  console.error("[GAME ERROR]", msg);
}

window.addEventListener("error", (e) => showError(`${e.message} @ ${e.filename}:${e.lineno}`));
window.addEventListener("unhandledrejection", (e) => showError(`Promise: ${e.reason}`));

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2d5a27",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, CutsceneScene, StageSelectScene, GalleryScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: document.body,
  },
  input: {
    touch: true,
  },
};

(window as any).__PHASER_GAME__ = new Phaser.Game(config);
