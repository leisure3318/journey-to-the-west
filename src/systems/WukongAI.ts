import Phaser from "phaser";
import { Disciple, AttackResult } from "../entities/Disciple";
import { Enemy } from "../entities/Enemy";
import { WUKONG_AI } from "../config/GameConfig";

type State = "follow" | "engage" | "combat" | "return" | "guard";

export class WukongAI {
  private state: State = "follow";
  private target: Enemy | null = null;
  private idleOffsetX = 0;
  private idleOffsetY = 0;
  private nextIdleShift = 0;

  update(
    wukong: Disciple,
    playerX: number, playerY: number,
    playerFacing: string, playerMoving: boolean,
    enemies: Phaser.Physics.Arcade.Group,
    time: number, _delta: number,
    playerHpRatio: number,
  ): AttackResult | null {
    const distToPlayer = Phaser.Math.Distance.Between(wukong.x, wukong.y, playerX, playerY);
    const body = wukong.body as Phaser.Physics.Arcade.Body;

    this.transition(wukong, distToPlayer, enemies, playerHpRatio);

    switch (this.state) {
      case "follow":
      case "guard":
        this.doFollow(wukong, playerX, playerY, body, time);
        break;
      case "engage":
        this.doEngage(wukong, body);
        break;
      case "combat":
        body.setVelocity(0);
        break;
      case "return":
        this.doReturn(wukong, playerX, playerY, body);
        break;
    }

    this.updateAnim(wukong, body, playerFacing, playerMoving);

    if (this.state !== "engage" && this.state !== "return") {
      return wukong.tryAttack(time, enemies);
    }
    return null;
  }

  private transition(
    wukong: Disciple,
    distToPlayer: number,
    enemies: Phaser.Physics.Arcade.Group,
    playerHpRatio: number,
  ) {
    switch (this.state) {
      case "follow":
        if (playerHpRatio < WUKONG_AI.guardHpThreshold) {
          this.state = "guard";
          return;
        }
        this.target = this.findNearest(wukong, enemies, WUKONG_AI.detectRadius);
        if (this.target) this.state = "engage";
        break;

      case "engage":
        if (!this.target || !this.target.active) {
          this.target = null;
          this.state = "return";
          return;
        }
        if (distToPlayer > WUKONG_AI.leashRadius) {
          this.target = null;
          this.state = "return";
          return;
        }
        if (Phaser.Math.Distance.Between(wukong.x, wukong.y, this.target.x, this.target.y) <= wukong.attackRange) {
          this.state = "combat";
        }
        break;

      case "combat":
        if (distToPlayer > WUKONG_AI.leashRadius) {
          this.target = null;
          this.state = "return";
          return;
        }
        if (!this.findNearest(wukong, enemies, wukong.attackRange)) {
          this.target = this.findNearest(wukong, enemies, WUKONG_AI.detectRadius);
          this.state = this.target ? "engage" : "return";
        }
        break;

      case "return":
        if (distToPlayer < WUKONG_AI.idleRadius) {
          this.state = "follow";
        }
        break;

      case "guard":
        if (playerHpRatio > WUKONG_AI.guardRecoverThreshold) {
          this.state = "follow";
        }
        break;
    }
  }

  private doFollow(
    wukong: Disciple,
    playerX: number, playerY: number,
    body: Phaser.Physics.Arcade.Body,
    time: number,
  ) {
    if (time > this.nextIdleShift) {
      this.idleOffsetX = Phaser.Math.Between(-40, 40);
      this.idleOffsetY = Phaser.Math.Between(-30, 30);
      this.nextIdleShift = time + Phaser.Math.Between(1500, 3000);
    }
    const tx = playerX + this.idleOffsetX;
    const ty = playerY + this.idleOffsetY;
    wukong.x += (tx - wukong.x) * 0.08;
    wukong.y += (ty - wukong.y) * 0.08;
    body.setVelocity(0);
  }

  private doEngage(wukong: Disciple, body: Phaser.Physics.Arcade.Body) {
    if (!this.target?.active) return;
    const angle = Phaser.Math.Angle.Between(wukong.x, wukong.y, this.target.x, this.target.y);
    body.setVelocity(
      Math.cos(angle) * WUKONG_AI.engageSpeed,
      Math.sin(angle) * WUKONG_AI.engageSpeed,
    );
  }

  private doReturn(
    wukong: Disciple,
    playerX: number, playerY: number,
    body: Phaser.Physics.Arcade.Body,
  ) {
    const angle = Phaser.Math.Angle.Between(wukong.x, wukong.y, playerX, playerY);
    body.setVelocity(
      Math.cos(angle) * WUKONG_AI.returnSpeed,
      Math.sin(angle) * WUKONG_AI.returnSpeed,
    );
  }

  private updateAnim(
    wukong: Disciple,
    body: Phaser.Physics.Arcade.Body,
    playerFacing: string, playerMoving: boolean,
  ) {
    let facing: string;
    let moving: boolean;

    if (this.state === "follow" || this.state === "guard") {
      facing = playerFacing;
      moving = playerMoving;
    } else {
      const vx = body.velocity.x;
      const vy = body.velocity.y;
      moving = Math.abs(vx) > 5 || Math.abs(vy) > 5;
      if (moving) {
        facing = Math.abs(vx) > Math.abs(vy)
          ? (vx > 0 ? "right" : "left")
          : (vy > 0 ? "down" : "up");
      } else {
        facing = playerFacing;
      }
    }

    const key = `wukong_${facing}_${moving ? "walk" : "idle"}`;
    if (wukong.anims.currentAnim?.key !== key) wukong.play(key);
  }

  getState(): State {
    return this.state;
  }

  private findNearest(
    from: Disciple,
    enemies: Phaser.Physics.Arcade.Group,
    maxDist: number,
  ): Enemy | null {
    let nearest: Enemy | null = null;
    let best = Infinity;
    for (const child of enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active) continue;
      const d = Phaser.Math.Distance.Between(from.x, from.y, e.x, e.y);
      if (d < maxDist && d < best) { nearest = e; best = d; }
    }
    return nearest;
  }
}
