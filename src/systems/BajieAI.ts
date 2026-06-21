import Phaser from "phaser";
import { Disciple, AttackResult } from "../entities/Disciple";
import { Enemy } from "../entities/Enemy";
import { BAJIE, BAJIE_AI } from "../config/GameConfig";

type State = "follow" | "engage" | "combat" | "return" | "rest";

export class BajieAI {
  private state: State = "follow";
  private target: Enemy | null = null;
  private restTimer = 0;

  update(
    bajie: Disciple,
    playerX: number, playerY: number,
    playerFacing: string, playerMoving: boolean,
    enemies: Phaser.Physics.Arcade.Group,
    time: number, delta: number,
  ): AttackResult | null {
    const distToPlayer = Phaser.Math.Distance.Between(bajie.x, bajie.y, playerX, playerY);
    const body = bajie.body as Phaser.Physics.Arcade.Body;

    this.transition(bajie, distToPlayer, enemies, delta);

    switch (this.state) {
      case "follow":
        this.doFollow(bajie, playerX, playerY, body);
        break;
      case "engage":
        this.doEngage(bajie, body);
        break;
      case "combat":
        body.setVelocity(0);
        break;
      case "return":
        this.doReturn(bajie, playerX, playerY, body);
        break;
      case "rest":
        body.setVelocity(0);
        break;
    }

    this.updateAnim(bajie, body, playerFacing, playerMoving);

    if (this.state !== "engage" && this.state !== "return") {
      return bajie.tryAttack(time, enemies);
    }
    return null;
  }

  private transition(
    bajie: Disciple,
    distToPlayer: number,
    enemies: Phaser.Physics.Arcade.Group,
    delta: number,
  ) {
    switch (this.state) {
      case "follow":
        this.target = this.findNearest(bajie, enemies, BAJIE_AI.detectRadius);
        if (this.target) this.state = "engage";
        break;

      case "engage":
        if (!this.target || !this.target.active) {
          this.target = null;
          this.state = "return";
          return;
        }
        if (distToPlayer > BAJIE_AI.leashRadius) {
          this.target = null;
          this.state = "return";
          return;
        }
        if (Phaser.Math.Distance.Between(bajie.x, bajie.y, this.target.x, this.target.y) <= bajie.attackRange) {
          this.state = "combat";
        }
        break;

      case "combat":
        if (distToPlayer > BAJIE_AI.leashRadius) {
          this.target = null;
          this.state = "return";
          return;
        }
        if (!this.findNearest(bajie, enemies, bajie.attackRange)) {
          this.restTimer = 0;
          this.state = "rest";
        }
        break;

      case "rest":
        this.restTimer += delta;
        if (this.restTimer > BAJIE_AI.restMs) {
          this.target = this.findNearest(bajie, enemies, BAJIE_AI.detectRadius);
          this.state = this.target ? "engage" : "return";
        }
        break;

      case "return":
        if (distToPlayer < BAJIE_AI.idleRadius) {
          this.state = "follow";
        }
        break;
    }
  }

  private doFollow(
    bajie: Disciple,
    playerX: number, playerY: number,
    body: Phaser.Physics.Arcade.Body,
  ) {
    const tx = playerX + BAJIE.followOffset.x;
    const ty = playerY + BAJIE.followOffset.y;
    bajie.x += (tx - bajie.x) * BAJIE.followLerp;
    bajie.y += (ty - bajie.y) * BAJIE.followLerp;
    body.setVelocity(0);
  }

  private doEngage(bajie: Disciple, body: Phaser.Physics.Arcade.Body) {
    if (!this.target?.active) return;
    const angle = Phaser.Math.Angle.Between(bajie.x, bajie.y, this.target.x, this.target.y);
    body.setVelocity(
      Math.cos(angle) * BAJIE_AI.engageSpeed,
      Math.sin(angle) * BAJIE_AI.engageSpeed,
    );
  }

  private doReturn(
    bajie: Disciple,
    playerX: number, playerY: number,
    body: Phaser.Physics.Arcade.Body,
  ) {
    const angle = Phaser.Math.Angle.Between(bajie.x, bajie.y, playerX, playerY);
    body.setVelocity(
      Math.cos(angle) * BAJIE_AI.returnSpeed,
      Math.sin(angle) * BAJIE_AI.returnSpeed,
    );
  }

  private updateAnim(
    bajie: Disciple,
    body: Phaser.Physics.Arcade.Body,
    playerFacing: string, playerMoving: boolean,
  ) {
    let facing: string;
    let moving: boolean;

    if (this.state === "follow" || this.state === "rest") {
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

    const key = `bajie_${facing}_${moving ? "walk" : "idle"}`;
    if (bajie.anims.currentAnim?.key !== key) bajie.play(key);
  }

  getState(): State { return this.state; }

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
