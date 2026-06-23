import Phaser from "phaser";
import { SoundManager } from "../systems/SoundManager";
import { saveSystem } from "../systems/SaveSystem";

interface GalleryItem {
  key: string;
  title: string;
  description: string;
  category: "prologue" | "recruit" | "boss";
  unlockCondition: () => boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { key: "prologue_01_court", title: "唐王选僧", description: "贞观十三年，唐王选大德高僧，往西天取大乘真经。", category: "prologue", unlockCondition: () => saveSystem.prologueSeen },
  { key: "prologue_02_farewell", title: "御弟送别", description: "御弟哥哥，日久年深，山遥路远，要保重。", category: "prologue", unlockCondition: () => saveSystem.prologueSeen },
  { key: "prologue_03_alone", title: "孤身上路", description: "宁恋本乡一捻土，莫爱他乡万两金。", category: "prologue", unlockCondition: () => saveSystem.prologueSeen },
  { key: "prologue_04_night", title: "西行夜路", description: "十万八千里，九九八十一难。一个人，也要走。", category: "prologue", unlockCondition: () => saveSystem.prologueSeen },
  { key: "poi_wuzhishan", title: "五指山", description: "五百年困于此山！大圣终得自由！", category: "recruit", unlockCondition: () => saveSystem.highestStage >= 1 || saveSystem.bossesDefeated.length > 0 },
  { key: "poi_yingchoujian", title: "鹰愁涧", description: "西海龙王三太子化为白马！", category: "recruit", unlockCondition: () => saveSystem.highestStage >= 1 || saveSystem.bossesDefeated.length > 1 },
  { key: "poi_gaolaozhuang", title: "高老庄", description: "天蓬元帅弃暗投明！八戒加入取经队伍！", category: "recruit", unlockCondition: () => saveSystem.highestStage >= 1 || saveSystem.bossesDefeated.length > 2 },
  { key: "poi_liushahe", title: "流沙河", description: "卷帘大将归正道！沙僧加入取经队伍！", category: "recruit", unlockCondition: () => saveSystem.highestStage >= 1 || saveSystem.bossesDefeated.length > 3 },
  { key: "poi_heifengshan", title: "黑风山", description: "黑熊精盗走袈裟！", category: "boss", unlockCondition: () => saveSystem.bossesDefeated.includes("黑熊精") },
  { key: "poi_huangfengling", title: "黄风岭", description: "黄风怪拦住了去路！", category: "boss", unlockCondition: () => saveSystem.bossesDefeated.includes("黄风大王") },
  { key: "poi_baiguling", title: "白虎岭", description: "白骨精现出原形！", category: "boss", unlockCondition: () => saveSystem.bossesDefeated.includes("白骨精") },
  { key: "poi_pansidong", title: "盘丝洞", description: "蜘蛛精张开天罗地网！", category: "boss", unlockCondition: () => saveSystem.bossesDefeated.includes("蜘蛛精") },
  { key: "poi_pingdingshan", title: "平顶山", description: "金角大王祭出紫金红葫芦！", category: "boss", unlockCondition: () => saveSystem.bossesDefeated.includes("金角大王") },
  { key: "poi_huoyundong", title: "火云洞", description: "红孩儿喷出三昧真火！", category: "boss", unlockCondition: () => saveSystem.bossesDefeated.includes("红孩儿") },
];

const COLS = 4;
const THUMB_W = 160;
const THUMB_H = 100;
const GAP = 15;
const CATEGORY_NAMES: Record<string, string> = { prologue: "序幕", recruit: "收徒", boss: "降妖" };
const CATEGORY_COLORS: Record<string, string> = { prologue: "#ffdd44", recruit: "#44ff88", boss: "#ff6644" };

export class GalleryScene extends Phaser.Scene {
  private soundMgr = new SoundManager();
  private viewer?: Phaser.GameObjects.Container;

  constructor() { super("GalleryScene"); }

  create() {
    this.soundMgr.setVolume(saveSystem.volume);
    this.cameras.main.setBackgroundColor("#0a0a1a");

    this.add.text(400, 30, "西天取经 · CG画廊", {
      fontSize: "28px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4,
    }).setOrigin(0.5);

    let currentCategory = "";
    let rowIdx = 0;
    let colIdx = 0;
    let baseY = 70;

    for (const item of GALLERY_ITEMS) {
      if (item.category !== currentCategory) {
        currentCategory = item.category;
        if (colIdx > 0) { rowIdx++; colIdx = 0; }
        const catY = baseY + rowIdx * (THUMB_H + GAP + 20);
        this.add.text(50, catY, `▎${CATEGORY_NAMES[item.category]}`, {
          fontSize: "14px", color: CATEGORY_COLORS[item.category], fontStyle: "bold",
        });
        baseY += 22;
      }

      const x = 50 + colIdx * (THUMB_W + GAP) + THUMB_W / 2;
      const y = baseY + rowIdx * (THUMB_H + GAP) + THUMB_H / 2;
      const unlocked = item.unlockCondition();

      this.drawThumb(x, y, item, unlocked);

      colIdx++;
      if (colIdx >= COLS) { colIdx = 0; rowIdx++; }
    }

    const backBtn = this.add.text(400, 570, "[ 返回主菜单 ]", {
      fontSize: "18px", color: "#aaaaaa",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on("pointerover", () => backBtn.setColor("#ffffff"));
    backBtn.on("pointerout", () => backBtn.setColor("#aaaaaa"));
    backBtn.on("pointerdown", () => { this.soundMgr.menuClick(); this.scene.start("MenuScene"); });
  }

  private drawThumb(x: number, y: number, item: GalleryItem, unlocked: boolean) {
    if (unlocked && this.textures.exists(item.key)) {
      const img = this.add.image(x, y, item.key).setDisplaySize(THUMB_W, THUMB_H);
      const overlay = this.add.rectangle(x, y, THUMB_W, THUMB_H, 0x000000, 0.2);

      const title = this.add.text(x, y + THUMB_H / 2 - 4, item.title, {
        fontSize: "11px", color: "#ffffff", fontStyle: "bold",
        stroke: "#000000", strokeThickness: 3,
      }).setOrigin(0.5, 1);

      const group = [img, overlay, title];
      img.setInteractive({ useHandCursor: true });
      img.on("pointerover", () => overlay.setAlpha(0));
      img.on("pointerout", () => overlay.setAlpha(1));
      img.on("pointerdown", () => {
        this.soundMgr.menuClick();
        this.showViewer(item);
      });
    } else {
      this.add.rectangle(x, y, THUMB_W, THUMB_H, 0x1a1a2e, 0.8)
        .setStrokeStyle(1, 0x333344);
      this.add.text(x, y - 6, "🔒", { fontSize: "20px" }).setOrigin(0.5);
      this.add.text(x, y + 18, item.title, {
        fontSize: "10px", color: "#444455",
      }).setOrigin(0.5);
    }
  }

  private showViewer(item: GalleryItem) {
    if (this.viewer) { this.viewer.destroy(); this.viewer = undefined; }

    const bg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.92).setDepth(100);
    const img = this.add.image(400, 260, item.key)
      .setDisplaySize(700, 400).setDepth(101);
    const title = this.add.text(400, 480, item.title, {
      fontSize: "22px", color: "#ffdd44", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(101);
    const desc = this.add.text(400, 510, item.description, {
      fontSize: "14px", color: "#cccccc",
      stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setDepth(101);
    const closeBtn = this.add.text(400, 555, "[ 关闭 ]", {
      fontSize: "18px", color: "#aaaaaa",
    }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true });
    closeBtn.on("pointerover", () => closeBtn.setColor("#ffffff"));
    closeBtn.on("pointerout", () => closeBtn.setColor("#aaaaaa"));
    closeBtn.on("pointerdown", () => {
      this.soundMgr.menuClick();
      if (this.viewer) { this.viewer.destroy(); this.viewer = undefined; }
    });

    this.viewer = this.add.container(0, 0, [bg, img, title, desc, closeBtn]).setDepth(100);
    bg.setInteractive();
  }
}
