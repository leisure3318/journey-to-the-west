import Phaser from "phaser";
import { Disciple, AttackResult } from "../entities/Disciple";
import { Enemy } from "../entities/Enemy";
import { WUJING, WUJING_AI } from "../config/GameConfig";

type State = "follow" | "approach" | "combat" | "return";

export class WujingAI {
  private state: State = "follow";
  private target: { x: number; y: number } | null = null;

  update(
    wujing: Disciple,
    playerX: number, playerY: number,
    playerFacing: string, playerMoving: boolean,
    enemies: Phaser.Physics.Arcade.Group,
    time: number, _delta: number,
    bossTarget: { x: number; y: number; active: boolean } | null,
  ): AttackResult | null {
    const distToPlayer = Phaser.Math.Distance.Between(wujing.x, wujing.y, playerX, playerY);
    const body = wujing.body as Phaser.Physics.Arcade.Body;

    this.transition(wujing, distToPlayer, enemies, bossTarget);

    switch (this.state) {
      case "follow":
        this.doFollow(wujing, playerX, playerY, body);
        break;
      case "approach":
        this.doApproach(wujing, body);
        break;
      case "combat":
        body.setVelocity(0);
        break;
      case "return":
        this.doReturn(wujing, playerX, playerY, body);
        break;
    }

    this.updateAnim(wujing, body, playerFacing, playerMoving);

    if (this.state === "combat" || this.state === "follow") {
      let r = wujing.tryAttack(time, enemies);
      if (!r && bossTarget?.active) {
        r = wujing.tryAttackTarget(time, bossTarget.x, bossTarget.y);
      }
      return r;
    }
    return null;
  }

  private transition(
    wujing: Disciple,
    distToPlayer: number,
    enemies: Phaser.Physics.Arcade.Group,
    bossTarget: { x: number; y: number; active: boolean } | null,
  ) {
    switch (this.state) {
      case "follow": {
        if (bossTarget?.active) {
          this.target = bossTarget;
          this.state = "approach";
          return;
        }
        const nearest = this.findNearest(wujing, enemies, WUJING_AI.detectRadius);
        if (nearest) {
          this.target = nearest;
          this.state = "approach";
        }
        break;
      }

      case "approach":
        if (!this.target) { this.state = "return"; return; }
        if (distToPlayer > WUJING_AI.leashRadius) { this.target = null; this.state = "return"; return; }
        if (Phaser.Math.Distance.Between(wujing.x, wujing.y, this.target.x, this.target.y) <= WUJING_AI.preferredRange) {
          this.state = "combat";
        }
        break;

      case "combat":
        if (distToPlayer > WUJING_AI.leashRadius) { this.target = null; this.state = "return"; return; }
        if (bossTarget?.active) {
          if (Phaser.Math.Distance.Between(wujing.x, wujing.y, bossTarget.x, bossTarget.y) > wujing.attackRange * 2) {
            this.target = bossTarget;
            this.state = "approach";
          }
          return;
        }
        if (!this.findNearest(wujing, enemies, wujing.attackRange * 1.5)) {
          const next = this.findNearest(wujing, enemies, WUJING_AI.detectRadius);
          if (next) { this.target = next; this.state = "approach"; }
          else this.state = "return";
        }
        break;

      case "return":
        if (distToPlayer < WUJING_AI.idleRadius) this.state = "follow";
        break;
    }
  }

  private doFollow(
    wujing: Disciple,
    playerX: number, playerY: number,
    body: Phaser.Physics.Arcade.Body,
  ) {
    const tx = playerX + WUJING.followOffset.x;
    const ty = playerY + WUJING.followOffset.y;
    wujing.x += (tx - wujing.x) * WUJING.followLerp;
    wujing.y += (ty - wujing.y) * WUJING.followLerp;
    body.setVelocity(0);
  }

  private doApproach(wujing: Disciple, body: Phaser.Physics.Arcade.Body) {
    if (!this.target) return;
    const dist = Phaser.Math.Distance.Between(wujing.x, wujing.y, this.target.x, this.target.y);
    if (dist <= WUJING_AI.preferredRange) {
      body.setVelocity(0);
      return;
    }
    const angle = Phaser.Math.Angle.Between(wujing.x, wujing.y, this.target.x, this.target.y);
    body.setVelocity(
      Math.cos(angle) * WUJING_AI.engageSpeed,
      Math.sin(angle) * WUJING_AI.engageSpeed,
    );
  }

  private doReturn(
    wujing: Disciple,
    playerX: number, playerY: number,
    body: Phaser.Physics.Arcade.Body,
  ) {
    const angle = Phaser.Math.Angle.Between(wujing.x, wujing.y, playerX, playerY);
    body.setVelocity(
      Math.cos(angle) * WUJING_AI.returnSpeed,
      Math.sin(angle) * WUJING_AI.returnSpeed,
    );
  }

  private updateAnim(
    wujing: Disciple,
    body: Phaser.Physics.Arcade.Body,
    playerFacing: string, playerMoving: boolean,
  ) {
    let facing: string;
    let moving: boolean;

    if (this.state === "follow") {
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

    const key = `wujing_${facing}_${moving ? "walk" : "idle"}`;
    if (wujing.anims.currentAnim?.key !== key) wujing.play(key);
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
