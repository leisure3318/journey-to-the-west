import Phaser from "phaser";
import { Disciple } from "../entities/Disciple";
import { Boss } from "../entities/Boss";

export class UltimateSystem {
  private scene: Phaser.Scene;
  private timers = new Map<string, number>();
  private cooldowns = new Map<string, number>();
  private defaultCd = 20000;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  register(key: string) {
    this.timers.set(key, 0);
    this.cooldowns.set(key, this.defaultCd);
  }

  setCooldown(key: string, ms: number) {
    this.cooldowns.set(key, ms);
  }

  update(delta: number, _boss: Boss | null, _disciples: Map<string, Disciple>) {
    for (const [key, timer] of this.timers) {
      const cd = this.cooldowns.get(key) ?? this.defaultCd;
      if (timer < cd) {
        this.timers.set(key, timer + delta);
      }
    }
  }

  tryFire(disciples: Map<string, Disciple>, enemies: Phaser.Physics.Arcade.Group, activeBoss?: Boss | null): boolean {
    for (const [key, timer] of this.timers) {
      const cd = this.cooldowns.get(key) ?? this.defaultCd;
      if (timer < cd) continue;
      const d = disciples.get(key);
      if (!d) continue;

      this.timers.set(key, 0);
      this.scene.events.emit("ultimate-activated");

      if (activeBoss?.active) {
        switch (key) {
          case "wukong": this.ultWukong(d, activeBoss); break;
          case "bajie": this.ultBajie(d, activeBoss); break;
          case "wujing": this.ultWujing(d, activeBoss); break;
          case "bailongma": this.ultBailongma(d, activeBoss); break;
        }
        return true;
      }

      const nearest = this.findNearestEnemy(d, enemies);
      const target = nearest ?? d;
      const fakeBoss = { x: target.x, y: target.y, active: true, takeDamage: (dmg: number) => {
        for (const child of enemies.getChildren()) {
          const e = child as any;
          if (e.active && Phaser.Math.Distance.Between(e.x, e.y, target.x, target.y) <= 200) {
            e.takeDamage?.(dmg);
          }
        }
      }} as any as Boss;

      switch (key) {
        case "wukong": this.ultWukong(d, fakeBoss); break;
        case "bajie": this.ultBajie(d, fakeBoss); break;
        case "wujing": this.ultWujing(d, fakeBoss); break;
        case "bailongma": this.ultBailongma(d, fakeBoss); break;
      }
      return true;
    }
    return false;
  }

  hasReady(): boolean {
    for (const [key, timer] of this.timers) {
      const cd = this.cooldowns.get(key) ?? this.defaultCd;
      if (timer >= cd) return true;
    }
    return false;
  }

  private findNearestEnemy(d: Disciple, enemies: Phaser.Physics.Arcade.Group): Phaser.GameObjects.GameObject | null {
    let nearest: Phaser.GameObjects.GameObject | null = null;
    let minDist = Infinity;
    for (const child of enemies.getChildren()) {
      if (!child.active) continue;
      const dist = Phaser.Math.Distance.Between(d.x, d.y, (child as any).x, (child as any).y);
      if (dist < minDist) { minDist = dist; nearest = child; }
    }
    return nearest;
  }

  private ultWukong(wukong: Disciple, boss: Boss) {
    this.showBanner("齐天大圣", "#ff9900", 0xff9900);
    const dmg = wukong.attackDamage * 5;

    const glow = this.scene.add.circle(wukong.x, wukong.y, 20, 0xff9900, 0.6).setDepth(499);
    this.scene.tweens.add({
      targets: glow, radius: 200, alpha: 0, duration: 600, ease: "Sine.easeOut",
      onComplete: () => glow.destroy(),
    });

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const cx = boss.x + Math.cos(angle) * 80;
      const cy = boss.y + Math.sin(angle) * 80;
      this.scene.time.delayedCall(i * 120, () => {
        if (!boss.active) return;
        const clone = this.scene.add.image(cx, cy, "vfx_wukong_clone")
          .setDepth(500).setDisplaySize(80, 80).setAlpha(0);
        this.scene.tweens.add({
          targets: clone, alpha: 0.9, displayWidth: 120, displayHeight: 120, angle: 180,
          duration: 200,
          onComplete: () => {
            boss.takeDamage(dmg);
            this.scene.cameras.main.shake(80, 0.008);
            const sweep = this.scene.add.image(cx, cy, "vfx_wukong_staff_sweep")
              .setDepth(501).setDisplaySize(60, 60).setAlpha(0.9).setRotation(angle);

            const spark = this.scene.add.circle(cx, cy, 5, 0xffdd44, 0.9).setDepth(502);
            this.scene.tweens.add({
              targets: spark, radius: 40, alpha: 0, duration: 300,
              onComplete: () => spark.destroy(),
            });

            this.scene.tweens.add({
              targets: [clone, sweep], alpha: 0, duration: 400,
              onComplete: () => { clone.destroy(); sweep.destroy(); },
            });
          },
        });
      });
    }

    this.scene.time.delayedCall(800, () => {
      const finalRing = this.scene.add.circle(boss.x, boss.y, 20, 0xff6600, 0.5).setDepth(503);
      this.scene.tweens.add({
        targets: finalRing, radius: 150, alpha: 0, strokeAlpha: 0, duration: 500,
        onComplete: () => finalRing.destroy(),
      });
      this.scene.cameras.main.shake(200, 0.015);
    });
  }

  private ultBajie(bajie: Disciple, boss: Boss) {
    this.showBanner("天蓬元帅", "#88cc44", 0x88cc44);
    const dmg = bajie.attackDamage * 8;

    const chargeGlow = this.scene.add.circle(bajie.x, bajie.y, 10, 0x88cc44, 0.5).setDepth(499);
    this.scene.tweens.add({
      targets: chargeGlow, radius: 80, alpha: 0.8, duration: 300,
      onComplete: () => {
        this.scene.tweens.add({
          targets: chargeGlow, radius: 5, alpha: 0, duration: 200,
          onComplete: () => chargeGlow.destroy(),
        });
      },
    });

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const dust = this.scene.add.circle(
        bajie.x + Math.cos(a) * 30, bajie.y + Math.sin(a) * 30,
        3 + Math.random() * 4, 0xaabb66, 0.6,
      ).setDepth(498);
      this.scene.tweens.add({
        targets: dust, y: dust.y - 40 - Math.random() * 30, alpha: 0, scale: 0.3,
        duration: 500 + Math.random() * 300, onComplete: () => dust.destroy(),
      });
    }

    const marshal = this.scene.add.image(bajie.x, bajie.y, "vfx_bajie_marshal")
      .setDepth(500).setDisplaySize(40, 40).setAlpha(0);
    this.scene.tweens.add({
      targets: marshal, alpha: 1, displayWidth: 200, displayHeight: 200,
      duration: 400, ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: marshal, x: boss.x, y: boss.y, duration: 250, ease: "Sine.easeIn",
          onComplete: () => {
            if (boss.active) boss.takeDamage(dmg);

            const slam = this.scene.add.image(boss.x, boss.y, "vfx_bajie_rake_slam")
              .setDepth(502).setDisplaySize(60, 60).setAlpha(0);
            this.scene.tweens.add({
              targets: slam, alpha: 0.9, displayWidth: 280, displayHeight: 280, duration: 150,
              onComplete: () => {
                this.scene.tweens.add({
                  targets: [marshal, slam], alpha: 0, duration: 500,
                  onComplete: () => { marshal.destroy(); slam.destroy(); },
                });
              },
            });

            for (let i = 0; i < 3; i++) {
              const ring = this.scene.add.circle(boss.x, boss.y, 20, 0x88cc44, 0.4).setDepth(501);
              this.scene.tweens.add({
                targets: ring, radius: 100 + i * 40, alpha: 0, duration: 400, delay: i * 100,
                onComplete: () => ring.destroy(),
              });
            }

            for (let i = 0; i < 8; i++) {
              const a = (i / 8) * Math.PI * 2;
              const debris = this.scene.add.circle(
                boss.x, boss.y, 3, 0xddcc88, 0.8,
              ).setDepth(503);
              this.scene.tweens.add({
                targets: debris,
                x: boss.x + Math.cos(a) * (80 + Math.random() * 40),
                y: boss.y + Math.sin(a) * (80 + Math.random() * 40),
                alpha: 0, scale: 0, duration: 500 + Math.random() * 200,
                onComplete: () => debris.destroy(),
              });
            }

            this.scene.cameras.main.shake(400, 0.02);
          },
        });
      },
    });
  }

  private ultWujing(wujing: Disciple, boss: Boss) {
    this.showBanner("卷帘大将", "#4488ff", 0x4488ff);
    const dmg = wujing.attackDamage * 3;

    const vortex1 = this.scene.add.circle(boss.x, boss.y, 30, 0x4488ff, 0.3).setDepth(498);
    this.scene.tweens.add({
      targets: vortex1, radius: 120, alpha: 0.5, angle: 180, duration: 500,
    });

    const trap = this.scene.add.image(boss.x, boss.y, "vfx_wujing_sand_trap")
      .setDepth(499).setDisplaySize(40, 40).setAlpha(0);
    this.scene.tweens.add({
      targets: trap, alpha: 0.8, displayWidth: 240, displayHeight: 240, angle: 30,
      duration: 500, ease: "Sine.easeOut",
    });

    let ticks = 0;
    const tickEvent = this.scene.time.addEvent({
      delay: 300, repeat: 9,
      callback: () => {
        if (!boss.active) return;
        boss.takeDamage(dmg);
        ticks++;
        const body = boss.body as Phaser.Physics.Arcade.Body;
        if (body) body.velocity.scale(0.3);

        const ring = this.scene.add.image(boss.x, boss.y, "vfx_wujing_shield")
          .setDepth(500).setDisplaySize(40, 40).setAlpha(0.7).setAngle(ticks * 36);
        this.scene.tweens.add({
          targets: ring, alpha: 0, displayWidth: 180, displayHeight: 180,
          duration: 400, onComplete: () => ring.destroy(),
        });

        for (let i = 0; i < 3; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = 40 + Math.random() * 60;
          const bubble = this.scene.add.circle(
            boss.x + Math.cos(a) * r, boss.y + Math.sin(a) * r,
            2 + Math.random() * 3, 0x66aaff, 0.6,
          ).setDepth(501);
          this.scene.tweens.add({
            targets: bubble, y: bubble.y - 20 - Math.random() * 20, alpha: 0, scale: 0.3,
            duration: 400 + Math.random() * 200, onComplete: () => bubble.destroy(),
          });
        }

        if (ticks % 3 === 0) this.scene.cameras.main.shake(100, 0.006);
      },
    });
    this.scene.time.delayedCall(3200, () => {
      tickEvent.destroy();
      this.scene.tweens.add({
        targets: [trap, vortex1], alpha: 0, duration: 600,
        onComplete: () => { trap.destroy(); vortex1.destroy(); },
      });
    });
  }

  private ultBailongma(horse: Disciple, boss: Boss) {
    this.showBanner("龙太子化龙", "#88ccff", 0x88ccff);
    const dmg = 60;

    horse.setTint(0x88ccff);
    const chargeRing = this.scene.add.circle(horse.x, horse.y, 10, 0x88ccff, 0.6).setDepth(499);
    this.scene.tweens.add({
      targets: chargeRing, radius: 60, alpha: 0.9, duration: 300,
      onComplete: () => {
        this.scene.tweens.add({
          targets: chargeRing, radius: 5, alpha: 0, duration: 200,
          onComplete: () => chargeRing.destroy(),
        });
      },
    });

    this.scene.time.delayedCall(500, () => {
      const startX = horse.x, startY = horse.y;
      const a = Phaser.Math.Angle.Between(startX, startY, boss.x, boss.y);

      for (let i = 0; i < 8; i++) {
        const t = i / 8;
        const fx = startX + (boss.x - startX) * t;
        const fy = startY + (boss.y - startY) * t;
        this.scene.time.delayedCall(i * 30, () => {
          const flame = this.scene.add.circle(
            fx + (Math.random() - 0.5) * 20, fy + (Math.random() - 0.5) * 20,
            4 + Math.random() * 4, 0xff6600, 0.7,
          ).setDepth(502);
          this.scene.tweens.add({
            targets: flame, alpha: 0, scale: 0.3, y: flame.y - 15,
            duration: 400, onComplete: () => flame.destroy(),
          });
        });
      }

      const dragon = this.scene.add.circle(startX, startY, 15, 0x88ccff, 0.9).setDepth(503);
      const dragonGlow = this.scene.add.circle(startX, startY, 25, 0xaaddff, 0.3).setDepth(502);
      this.scene.tweens.add({
        targets: [dragon, dragonGlow], x: boss.x, y: boss.y,
        duration: 300, ease: "Sine.easeIn",
        onComplete: () => {
          if (boss.active) boss.takeDamage(dmg);
          dragon.destroy();
          dragonGlow.destroy();

          const breath = this.scene.add.circle(boss.x, boss.y, 20, 0xff4400, 0.6).setDepth(504);
          this.scene.tweens.add({
            targets: breath, radius: 160, alpha: 0, duration: 500,
            onComplete: () => breath.destroy(),
          });
          const breath2 = this.scene.add.circle(boss.x, boss.y, 15, 0xffaa00, 0.5).setDepth(504);
          this.scene.tweens.add({
            targets: breath2, radius: 120, alpha: 0, duration: 400, delay: 100,
            onComplete: () => breath2.destroy(),
          });

          for (let i = 0; i < 16; i++) {
            const pa = (i / 16) * Math.PI * 2;
            const spark = this.scene.add.circle(boss.x, boss.y, 2 + Math.random() * 3,
              Math.random() > 0.5 ? 0xff6600 : 0xffaa44, 0.8,
            ).setDepth(505);
            const dist = 60 + Math.random() * 60;
            this.scene.tweens.add({
              targets: spark,
              x: boss.x + Math.cos(pa) * dist, y: boss.y + Math.sin(pa) * dist,
              alpha: 0, scale: 0, duration: 500 + Math.random() * 300,
              onComplete: () => spark.destroy(),
            });
          }

          this.scene.cameras.main.shake(400, 0.02);

          const burnArea = this.scene.add.circle(boss.x, boss.y, 80, 0xff4400, 0.15).setDepth(498);
          let burnTicks = 0;
          const burnEvent = this.scene.time.addEvent({
            delay: 500, repeat: 5,
            callback: () => {
              if (!boss.active) return;
              boss.takeDamage(Math.round(dmg * 0.3));
              burnTicks++;
              const lick = this.scene.add.circle(
                boss.x + (Math.random() - 0.5) * 40, boss.y + (Math.random() - 0.5) * 40,
                3, 0xff6600, 0.6,
              ).setDepth(499);
              this.scene.tweens.add({
                targets: lick, y: lick.y - 20, alpha: 0, scale: 0.3,
                duration: 400, onComplete: () => lick.destroy(),
              });
            },
          });
          this.scene.time.delayedCall(3500, () => {
            burnEvent.destroy();
            this.scene.tweens.add({
              targets: burnArea, alpha: 0, duration: 500,
              onComplete: () => burnArea.destroy(),
            });
          });
        },
      });

      horse.clearTint();
    });
  }

  getCooldowns(): { key: string; ratio: number }[] {
    const result: { key: string; ratio: number }[] = [];
    for (const [key, timer] of this.timers) {
      const cd = this.cooldowns.get(key) ?? this.defaultCd;
      result.push({ key, ratio: Math.min(1, timer / cd) });
    }
    return result;
  }

  private showBanner(name: string, color: string, colorHex: number) {
    const r = (colorHex >> 16) & 0xff, g = (colorHex >> 8) & 0xff, b = colorHex & 0xff;
    this.scene.cameras.main.flash(300, r, g, b);

    const bannerBg = this.scene.add.rectangle(400, 195, 0, 46, 0x000000, 0.7)
      .setScrollFactor(0).setDepth(949).setAlpha(0);

    const banner = this.scene.add.text(400, 195, `— ${name} —`, {
      fontSize: "32px", color, fontStyle: "bold",
      stroke: "#000000", strokeThickness: 6,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(950).setAlpha(0);

    const sub = this.scene.add.text(400, 225, "大招发动", {
      fontSize: "13px", color: "#ffffff", stroke: "#000000", strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(950).setAlpha(0);

    this.scene.tweens.add({
      targets: bannerBg, width: 500, alpha: 1, duration: 250, ease: "Sine.easeOut",
    });
    this.scene.tweens.add({
      targets: [banner, sub], alpha: 1, duration: 200, delay: 100,
    });
    this.scene.tweens.add({
      targets: banner, scaleX: 1.05, scaleY: 1.05, duration: 300, yoyo: true, ease: "Sine.easeInOut",
    });

    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const p = this.scene.add.circle(400, 195, 3, colorHex, 0.7)
        .setScrollFactor(0).setDepth(948);
      this.scene.tweens.add({
        targets: p, x: 400 + Math.cos(a) * 140, y: 195 + Math.sin(a) * 60,
        alpha: 0, scale: 0, duration: 500 + Math.random() * 200,
        onComplete: () => p.destroy(),
      });
    }

    this.scene.time.delayedCall(1500, () => {
      this.scene.tweens.add({
        targets: [banner, bannerBg, sub], alpha: 0, y: "-=20", duration: 400,
        onComplete: () => { banner.destroy(); bannerBg.destroy(); sub.destroy(); },
      });
    });
  }
}
