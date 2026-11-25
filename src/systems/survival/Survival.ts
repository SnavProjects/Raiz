import { eventBus } from '../../core/EventBus';
import type { Difficulty } from '../../config/GameConfig';
export class Survival {
  health = 100; maxHealth = 100; hunger = 100; maxHunger = 100; dead = false;
  private hungerRate = 100 / 300; // por segundo
  constructor(private difficulty: Difficulty = 'normal') {}
  setDifficulty(d: Difficulty): void { this.difficulty = d; }
  update(dtSec: number, inWater: boolean, isNight: boolean): void {
    if (this.dead) return;
    const mult = this.difficulty === 'facil' ? 0.5 : this.difficulty === 'dificil' ? 1.8 : 1;
    this.hunger = Math.max(0, this.hunger - this.hungerRate * mult * dtSec);
    if (this.hunger <= 0) this.damage(2 * mult * dtSec);
    else if (this.hunger > 60 && this.health < this.maxHealth) this.health = Math.min(this.maxHealth, this.health + 1.5 * dtSec);
    if (inWater) this.damage(3 * dtSec);
    if (isNight && this.difficulty === 'dificil') this.damage(0.5 * dtSec);
  }
  damage(amount: number): void {
    if (this.dead) return;
    this.health -= amount;
    eventBus.emit({ type: 'player-damaged', amount });
    if (this.health <= 0) { this.health = 0; this.dead = true; eventBus.emit({ type: 'player-died' }); }
  }
  heal(amount: number): void { if (!this.dead) this.health = Math.min(this.maxHealth, this.health + amount); }
  eat(foodValue: number): void { this.hunger = Math.min(this.maxHunger, this.hunger + foodValue); this.heal(foodValue * 0.2); }
  respawn(): void { this.health = this.maxHealth; this.hunger = this.maxHunger; this.dead = false; eventBus.emit({ type: 'player-respawned' }); }
  serialize(): { health: number; hunger: number } { return { health: this.health, hunger: this.hunger }; }
  deserialize(d: { health: number; hunger: number }): void { this.health = d.health; this.hunger = d.hunger; this.dead = this.health <= 0; }
}
