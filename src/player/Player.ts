import { World } from '../world/World';
import { GameConfig } from '../config/GameConfig';
import { Survival } from '../systems/survival/Survival';
import { Inventory } from '../systems/inventory/Inventory';
import { eventBus } from '../core/EventBus';
export interface PlayerState { x: number; y: number; vx: number; vy: number; onGround: boolean; facing: 1 | -1; }
const W = 12; const H = 28; // hitbox em pixels
export class Player {
  x = 0; y = 0; vx = 0; vy = 0; onGround = false; facing: 1 | -1 = 1;
  survival = new Survival(); inventory = new Inventory(36);
  private coyote = 0; private jumpBuffer = 0;
  constructor(private world: World) {}
  spawn(): void { const s = this.world.spawnPoint(); this.x = s.x * GameConfig.tileSize; this.y = s.y * GameConfig.tileSize; this.vx = 0; this.vy = 0; }
  get tileX(): number { return Math.floor((this.x + W / 2) / GameConfig.tileSize); }
  get tileY(): number { return Math.floor((this.y + H) / GameConfig.tileSize); }
  private solidAt(px: number, py: number): boolean {
    return this.world.isSolidAt(Math.floor(px / GameConfig.tileSize), Math.floor(py / GameConfig.tileSize));
  }
  private collides(x: number, y: number): boolean {
    return this.solidAt(x, y) || this.solidAt(x + W, y) || this.solidAt(x, y + H) || this.solidAt(x + W, y + H);
  }
  update(dtSec: number, input: { left: boolean; right: boolean; jump: boolean }): void {
    const speed = GameConfig.moveSpeed;
    if (input.left) { this.vx = -speed; this.facing = -1; }
    else if (input.right) { this.vx = speed; this.facing = 1; }
    else this.vx = 0;
    if (input.jump) this.jumpBuffer = 0.12; else this.jumpBuffer = Math.max(0, this.jumpBuffer - dtSec);
    this.coyote = this.onGround ? 0.12 : Math.max(0, this.coyote - dtSec);
    if (this.jumpBuffer > 0 && (this.onGround || this.coyote > 0)) { this.vy = GameConfig.jumpVelocity; this.jumpBuffer = 0; this.onGround = false; }
    this.vy = Math.min(this.vy + GameConfig.gravity * dtSec, 900);
    // Passos de no máximo um pixel evitam atravessar paredes em frames lentos.
    // Laços limitados também evitam travar caso um save coloque o jogador em um bloco.
    const moveAxis = (axis: 'x' | 'y', distance: number): boolean => {
      const steps = Math.max(1, Math.ceil(Math.abs(distance)));
      const step = distance / steps;
      for (let i = 0; i < steps; i++) {
        const nx = this.x + (axis === 'x' ? step : 0);
        const ny = this.y + (axis === 'y' ? step : 0);
        if (this.collides(nx, ny)) return true;
        this[axis] += step;
      }
      return false;
    };
    if (moveAxis('x', this.vx * dtSec)) this.vx = 0;
    const falling = this.vy > 0;
    this.onGround = false;
    if (moveAxis('y', this.vy * dtSec)) {
      this.onGround = falling;
      this.vy = 0;
    }
    const inWater = this.world.getTile(this.tileX, this.tileY) === 7;
    this.survival.update(dtSec, inWater, false);
    eventBus.emit({ type: 'player-moved', x: this.x, y: this.y });
  }
  serialize(): { x: number; y: number; survival: { health: number; hunger: number }; inventory: { itemId: string | null; count: number }[]; selected: number } {
    return { x: this.x, y: this.y, survival: this.survival.serialize(), inventory: this.inventory.serialize(), selected: this.inventory.selected };
  }
  deserialize(d: { x: number; y: number; survival: { health: number; hunger: number }; inventory: { itemId: string | null; count: number }[]; selected: number }): void {
    this.x = d.x; this.y = d.y; this.survival.deserialize(d.survival); this.inventory.deserialize(d.inventory); this.inventory.selected = d.selected;
  }
}
