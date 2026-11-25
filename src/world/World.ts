import { WorldGenerator } from '../generation/terrain/WorldGenerator';
import { Chunk } from './chunks/Chunk';
import { isSolid, TileId } from './tiles/tiles';
import { GameConfig } from '../config/GameConfig';
import { eventBus } from '../core/EventBus';

export interface WorldMeta { id: string; name: string; seed: string; createdAt: number; updatedAt: number; version: number; generatorVersion: number; difficulty: string; }

/** Mundo infinito por chunks com carregamento progressivo (ARCHITECTURE §6). */
export class World {
  readonly meta: WorldMeta;
  private gen: WorldGenerator;
  private chunks = new Map<string, Chunk>();
  // Edições descarregadas não podem ser descartadas junto com o cache de terreno.
  private edits = new Map<string, Chunk>();
  readonly size = GameConfig.chunkSize;
  constructor(meta: WorldMeta) { this.meta = meta; this.gen = new WorldGenerator({ seed: meta.seed }); }
  key(cx: number, cy: number): string { return cx + ',' + cy; }
  chunkAt(cx: number, cy: number): Chunk | undefined { return this.chunks.get(this.key(cx, cy)); }
  private fillChunk(c: Chunk): void {
    for (let lx = 0; lx < this.size; lx++) {
      const x = c.cx * this.size + lx;
      const col = this.gen.generateColumn(x);
      for (let ly = 0; ly < this.size; ly++) {
        const y = c.cy * this.size + ly;
        if (y >= 0 && y < col.tiles.length) { c.fg[c.idx(lx, ly)] = col.tiles[y]!; c.bg[c.idx(lx, ly)] = col.bg[y]!; }
      }
    }
  }
  /** Garante chunks ao redor de (px,py) em tiles; retorna lista carregada. */
  ensureAround(px: number, py: number, radius: number = GameConfig.renderDistance): Chunk[] {
    const pcx = Math.floor(px / this.size); const pcy = Math.floor(py / this.size);
    const out: Chunk[] = [];
    for (let dx = -radius; dx <= radius; dx++) for (let dy = -radius; dy <= radius; dy++) {
      const cx = pcx + dx; const cy = pcy + dy;
      let c = this.chunks.get(this.key(cx, cy));
      if (!c) { c = this.edits.get(this.key(cx, cy)); if (!c) { c = new Chunk(cx, cy, this.size); this.fillChunk(c); } this.chunks.set(this.key(cx, cy), c); }
      out.push(c);
    }
    // descarrega distantes (mantém modificados em cache limitado)
    for (const [k, c] of this.chunks) {
      if (Math.abs(c.cx - pcx) > radius + 2 || Math.abs(c.cy - pcy) > radius + 2) {
        if (c.modified) this.edits.set(k, c);
        this.chunks.delete(k);
      }
    }
    return out;
  }
  getTile(x: number, y: number): number {
    const c = this.chunkAt(Math.floor(x / this.size), Math.floor(y / this.size));
    if (!c) return TileId.Air;
    return c.getFg(x - c.cx * this.size, y - c.cy * this.size);
  }
  getBgTile(x: number, y: number): number {
    const c = this.chunkAt(Math.floor(x / this.size), Math.floor(y / this.size));
    if (!c) return TileId.Air;
    return c.getBg(x - c.cx * this.size, y - c.cy * this.size);
  }
  setTile(x: number, y: number, id: number): boolean {
    const c = this.chunkAt(Math.floor(x / this.size), Math.floor(y / this.size));
    if (!c) return false;
    c.setFg(x - c.cx * this.size, y - c.cy * this.size, id);
    eventBus.emit({ type: 'block-placed', tileId: id, x, y });
    return true;
  }
  setBgTile(x: number, y: number, id: number): boolean {
    const c = this.chunkAt(Math.floor(x / this.size), Math.floor(y / this.size));
    if (!c) return false;
    c.setBg(x - c.cx * this.size, y - c.cy * this.size, id);
    return true;
  }
  isSolidAt(x: number, y: number): boolean { return isSolid(this.getTile(x, y)); }
  surfaceY(x: number): number { return this.gen.surfaceHeight(x); }
  spawnPoint(): { x: number; y: number } { return this.gen.spawnPoint(); }
  biomeAt(x: number): string { return this.gen.biomeAt(x); }
  modifiedChunks(): Chunk[] {
    const all = new Map(this.edits);
    for (const [key, c] of this.chunks) if (c.modified) all.set(key, c);
    return [...all.values()];
  }
  loadModified(list: { cx: number; cy: number; fg: number[]; bg: number[] }[]): void {
    for (const d of list) this.edits.set(this.key(d.cx, d.cy), Chunk.deserialize(d, this.size));
    for (const d of list) this.chunks.set(this.key(d.cx, d.cy), this.edits.get(this.key(d.cx, d.cy))!);
  }
  get chunkCount(): number { return this.chunks.size; }
}
