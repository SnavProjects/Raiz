import { World } from '../world/World';
import { rngFor } from '../generation/noise/rng';
import { eventBus } from '../core/EventBus';
export type EntityKind = 'passive' | 'hostile';
export interface Entity { id: string; kind: EntityKind; species: string; x: number; y: number; vx: number; health: number; maxHealth: number; active: boolean; }
let counter = 0;
export class EntityManager {
  entities: Entity[] = [];
  constructor(private world: World, private seed: string) {}
  /** Spawna entidades próximas ao jogador (ativação por proximidade). */
  update(playerX: number, playerY: number, dtSec: number): void {
    // spawn
    const px = Math.floor(playerX / 16); const py = Math.floor(playerY / 16);
    if (this.entities.length < 24 && Math.random() < 0.02) {
      const r = rngFor(this.seed, 'ent', px + Math.floor(Math.random() * 20), py);
      const biome = this.world.biomeAt(px);
      const hostile = r.chance(0.3);
      const species = hostile ? 'espectro-raiz' : biome === 'deserto' ? 'lagarto-areia' : 'coelho-floresta';
      const sx = (px + r.int(-10, 10)) * 16; const sy = this.world.surfaceY(Math.floor(sx / 16)) * 16 - 16;
      const e: Entity = { id: 'e' + (++counter), kind: hostile ? 'hostile' : 'passive', species, x: sx, y: sy, vx: 0, health: hostile ? 30 : 10, maxHealth: hostile ? 30 : 10, active: true };
      this.entities.push(e); eventBus.emit({ type: 'entity-spawned', entityId: e.id });
    }
    for (const e of this.entities) {
      const dist = Math.hypot(e.x - playerX, e.y - playerY);
      e.active = dist < 600;
      if (!e.active) continue;
      // IA simples: passivo foge/pastaia; hostil persegue à noite
      const dx = playerX - e.x;
      if (e.kind === 'hostile' && Math.abs(dx) < 200) e.vx = Math.sign(dx) * 60;
      else if (e.kind === 'passive' && Math.abs(dx) < 80) e.vx = -Math.sign(dx) * 40;
      else e.vx = Math.sin(e.x * 0.01 + dtSec) * 20;
      e.x += e.vx * dtSec;
      // gravidade simples
      const below = this.world.isSolidAt(Math.floor(e.x / 16), Math.floor((e.y + 20) / 16));
      if (!below) e.y += 200 * dtSec;
    }
    this.entities = this.entities.filter(e => Math.hypot(e.x - playerX, e.y - playerY) < 1200);
  }
  damage(id: string, amount: number): boolean {
    const e = this.entities.find(x => x.id === id); if (!e) return false;
    e.health -= amount;
    if (e.health <= 0) { this.entities = this.entities.filter(x => x.id !== id); eventBus.emit({ type: 'entity-removed', entityId: id }); return true; }
    return false;
  }
  serialize(): Entity[] { return this.entities.map(e => ({ ...e })); }
  deserialize(list: Entity[]): void { this.entities = list.map(e => ({ ...e })); counter = Math.max(counter, ...list.map(e => Number(e.id.slice(1)) || 0)); }
}
