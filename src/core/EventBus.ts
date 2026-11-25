export type GameEvent =
  | { type: 'item-collected'; itemId: string; count: number }
  | { type: 'block-mined'; tileId: number; x: number; y: number }
  | { type: 'block-placed'; tileId: number; x: number; y: number }
  | { type: 'inventory-changed' }
  | { type: 'world-loaded'; worldId: string }
  | { type: 'world-saved'; worldId: string }
  | { type: 'player-moved'; x: number; y: number }
  | { type: 'player-damaged'; amount: number }
  | { type: 'player-died' }
  | { type: 'player-respawned' }
  | { type: 'time-changed'; phase: string; t: number }
  | { type: 'crafted'; recipeId: string }
  | { type: 'entity-spawned'; entityId: string }
  | { type: 'entity-removed'; entityId: string }
  | { type: 'settings-changed' }
  | { type: 'toast'; message: string };
type Handler = (e: GameEvent) => void;
export class EventBus {
  private handlers = new Map<string, Set<Handler>>();
  on(type: GameEvent['type'], h: Handler): () => void {
    let s = this.handlers.get(type); if (!s) { s = new Set(); this.handlers.set(type, s); }
    s.add(h); return () => { s!.delete(h); };
  }
  emit(e: GameEvent): void { this.handlers.get(e.type)?.forEach(h => h(e)); }
  clear(): void { this.handlers.clear(); }
}
export const eventBus = new EventBus();
