import Phaser from "phaser";
import { WORLD, UpgradeState } from "../config/GameConfig";
import { POIConfig } from "../config/MapConfig";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";

export interface ChestContext {
  upgrades: UpgradeState;
  player: Player;
  enemies: Phaser.Physics.Arcade.Group;
  scene: Phaser.Scene;
}

export interface ChestItemDef {
  id: string;
  name: string;
  icon: string;
  tier: "common" | "rare" | "legendary";
  tierColor: number;
  desc: string;
  requiresHero?: string;
  apply: (ctx: ChestContext) => void;
}

interface Chest {
  sprite: Phaser.GameObjects.Image;
  x: number;
  y: number;
  opened: boolean;
}

const TRIGGER_RADIUS = 50;
const CHEST_MIN = 8;
const CHEST_MAX = 12;
const POI_AVOID = 200;

export const CHEST_ITEMS: ChestItemDef[] = [
  { id: "jinboyu", name: "金钵盂", icon: "item_jinboyu", tier: "common", tierColor: 0xffffff,
    desc: "经验吸取+40", apply: (c) => { c.upgrades.xpAttractRadius += 40; } },
  { id: "jialan_jiasha", name: "锦斓袈裟", icon: "item_jialan_jiasha", tier: "common", tierColor: 0xffffff,
    desc: "受伤减免12%", apply: (c) => { c.upgrades.damageMultiplier *= 0.88; } },
  { id: "renshen_guo", name: "人参果", icon: "item_renshen_guo", tier: "common", tierColor: 0xffffff,
    desc: "立即回满HP", apply: (c) => { c.player.hp = c.player.maxHp; } },
  { id: "pantao", name: "蟠桃", icon: "item_pantao", tier: "common", tierColor: 0xffffff,
    desc: "最大HP+30", apply: (c) => { c.upgrades.playerMaxHp += 30; c.player.maxHp += 30; c.player.hp += 30; } },
  { id: "tongguan_wendie", name: "通关文牒", icon: "item_tongguan_wendie", tier: "common", tierColor: 0xffffff,
    desc: "经验吸取+50", apply: (c) => { c.upgrades.xpAttractRadius += 50; } },
  { id: "bihuo_zhao", name: "避火罩", icon: "item_bihuo_zhao", tier: "common", tierColor: 0xffffff,
    desc: "10秒免疫伤害", apply: (c) => {
      c.player.invincible = true;
      c.player.setTint(0xffdd44);
      c.scene.time.delayedCall(10000, () => { c.player.invincible = false; c.player.clearTint(); });
    } },
  { id: "jiuhuan_xizhang", name: "九环锡杖", icon: "item_jiuhuan_xizhang", tier: "rare", tierColor: 0x4488ff,
    desc: "光环范围+30, 伤害+2", apply: (c) => { c.upgrades.auraRadius += 30; c.upgrades.auraDps += 2; } },
  { id: "bajiao_shan", name: "芭蕉扇", icon: "item_bajiao_shan", tier: "rare", tierColor: 0x4488ff,
    desc: "全屏击退+20伤害", apply: (c) => {
      for (const child of c.enemies.getChildren()) {
        const e = child as Enemy;
        if (!e.active) continue;
        e.takeDamage(20);
        const body = e.body as Phaser.Physics.Arcade.Body;
        if (body) {
          const a = Phaser.Math.Angle.Between(c.player.x, c.player.y, e.x, e.y);
          body.setVelocity(Math.cos(a) * 500, Math.sin(a) * 500);
        }
      }
      c.scene.cameras.main.shake(300, 0.01);
    } },
  { id: "zhaoyao_jing", name: "照妖镜", icon: "item_zhaoyao_jing", tier: "rare", tierColor: 0x4488ff,
    desc: "暴击率+10%, Boss+15%", apply: (c) => { c.upgrades.critRate += 0.10; c.upgrades.bossExtraDmg += 0.15; } },
  { id: "zijin_hulu", name: "紫金红葫芦", icon: "item_zijin_hulu", tier: "rare", tierColor: 0x4488ff,
    desc: "经验吸取+80", apply: (c) => { c.upgrades.xpAttractRadius += 80; } },
  { id: "yinshen_mao", name: "隐身帽", icon: "item_yinshen_mao", tier: "rare", tierColor: 0x4488ff,
    desc: "5秒隐身", apply: (c) => {
      c.player.invincible = true;
      c.player.setAlpha(0.3);
      c.scene.time.delayedCall(5000, () => { c.player.invincible = false; c.player.setAlpha(1); });
    } },
  { id: "ruyi_jingu", name: "如意金箍", icon: "item_ruyi_jingu", tier: "legendary", tierColor: 0xffaa00,
    requiresHero: "wukong", desc: "悟空攻击+15, 范围+25",
    apply: (c) => { c.upgrades.wukongDamage += 15; c.upgrades.wukongRange += 25; } },
  { id: "tianpeng_lingpai", name: "天蓬令牌", icon: "item_tianpeng_lingpai", tier: "legendary", tierColor: 0xffaa00,
    requiresHero: "bajie", desc: "八戒范围+20, 冷却-300ms",
    apply: (c) => { c.upgrades.bajieAoeRadius += 20; c.upgrades.bajieCooldown = Math.max(500, c.upgrades.bajieCooldown - 300); } },
  { id: "jiukulou_chuan", name: "九骷髅串", icon: "item_jiukulou_chuan", tier: "legendary", tierColor: 0xffaa00,
    requiresHero: "wujing", desc: "沙僧穿透+2, 投射+30%",
    apply: (c) => { c.upgrades.wujingProjCount += 2; c.upgrades.wujingPierceBonus += 0.3; } },
  { id: "dinghai_shenzhu", name: "定海神珠", icon: "item_dinghai_shenzhu", tier: "legendary", tierColor: 0xffaa00,
    desc: "龙息尾迹强化", apply: (c) => { c.upgrades.trailLevel = Math.min(5, c.upgrades.trailLevel + 1); } },
];

export class ChestSystem {
  private scene: Phaser.Scene;
  private chests: Chest[] = [];
  private onPickup: (item: ChestItemDef) => void;

  constructor(scene: Phaser.Scene, pois: POIConfig[], onPickup: (item: ChestItemDef) => void) {
    this.scene = scene;
    this.onPickup = onPickup;
    this.spawnChests(pois);
  }

  private spawnChests(pois: POIConfig[]) {
    const count = Phaser.Math.Between(CHEST_MIN, CHEST_MAX);
    const margin = 200;
    const placed: { x: number; y: number }[] = [];

    for (let i = 0; i < count; i++) {
      let x: number, y: number, attempts = 0;
      do {
        x = margin + Math.random() * (WORLD.width - margin * 2);
        y = margin + Math.random() * (WORLD.height - margin * 2);
        attempts++;
      } while (
        attempts < 100 &&
        (pois.some(p => Phaser.Math.Distance.Between(x, y, p.x, p.y) < POI_AVOID) ||
         placed.some(p => Phaser.Math.Distance.Between(x, y, p.x, p.y) < 150))
      );
      placed.push({ x, y });
      const sprite = this.scene.add.image(x, y, "chest_closed").setDepth(10).setDisplaySize(36, 30);
      this.chests.push({ sprite, x, y, opened: false });
    }
  }

  update(px: number, py: number, hasHero: (k: string) => boolean) {
    for (const chest of this.chests) {
      if (chest.opened) continue;
      if (Phaser.Math.Distance.Between(px, py, chest.x, chest.y) <= TRIGGER_RADIUS) {
        this.openChest(chest, hasHero);
      }
    }
  }

  private openChest(chest: Chest, hasHero: (k: string) => boolean) {
    chest.opened = true;
    const item = this.rollItem(hasHero);

    this.onPickup(item);

    chest.sprite.setTexture("chest_open");

    const beam = this.scene.add.rectangle(chest.x, chest.y - 40, 6, 80, item.tierColor, 0.4)
      .setDepth(11).setOrigin(0.5, 1);
    this.scene.tweens.add({ targets: beam, alpha: 0, scaleX: 2, duration: 800, onComplete: () => beam.destroy() });

    const icon = this.scene.add.image(chest.x, chest.y - 10, item.icon)
      .setDepth(12).setDisplaySize(8, 8).setAlpha(0);
    this.scene.tweens.add({
      targets: icon, y: chest.y - 50, displayWidth: 36, displayHeight: 36, alpha: 1,
      duration: 400, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({ targets: icon, alpha: 0, y: chest.y - 70, duration: 1500, delay: 1000, onComplete: () => icon.destroy() });
      }
    });

    const nameColor = item.tier === "legendary" ? "#ffaa00" : item.tier === "rare" ? "#4488ff" : "#ffffff";
    const nameTxt = this.scene.add.text(chest.x, chest.y - 60, item.name, {
      fontSize: "12px", color: nameColor, fontStyle: "bold", stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(13).setAlpha(0);
    const descTxt = this.scene.add.text(chest.x, chest.y - 46, item.desc, {
      fontSize: "9px", color: "#cccccc", stroke: "#000000", strokeThickness: 2,
    }).setOrigin(0.5).setDepth(13).setAlpha(0);

    this.scene.tweens.add({
      targets: [nameTxt, descTxt], alpha: 1, duration: 300, delay: 300,
      onComplete: () => {
        this.scene.tweens.add({
          targets: [nameTxt, descTxt], alpha: 0, y: "-=20", duration: 1200, delay: 1500,
          onComplete: () => { nameTxt.destroy(); descTxt.destroy(); }
        });
      }
    });

    this.scene.time.delayedCall(3000, () => {
      this.scene.tweens.add({ targets: chest.sprite, alpha: 0, duration: 500, onComplete: () => chest.sprite.destroy() });
    });
  }

  private rollItem(hasHero: (k: string) => boolean): ChestItemDef {
    for (let attempt = 0; attempt < 20; attempt++) {
      const roll = Math.random() * 100;
      let tier: "common" | "rare" | "legendary";
      if (roll < 55) tier = "common";
      else if (roll < 85) tier = "rare";
      else tier = "legendary";

      const pool = CHEST_ITEMS.filter(i => i.tier === tier);
      const item = pool[Phaser.Math.Between(0, pool.length - 1)];
      if (item.requiresHero && !hasHero(item.requiresHero)) continue;
      return item;
    }
    return CHEST_ITEMS[0];
  }

  getUnopenedPositions(): { x: number; y: number }[] {
    return this.chests.filter(c => !c.opened).map(c => ({ x: c.x, y: c.y }));
  }
}
