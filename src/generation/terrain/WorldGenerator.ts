import { Noise1D, Noise2D } from '../noise/noise';
import { rngFor, hashSeed } from '../noise/rng';
import { TileId } from '../../world/tiles/tiles';
import { biomeAt, BIOMES, type BiomeId } from '../../world/biomes/biomes';
import { GameConfig } from '../../config/GameConfig';

export interface GenOptions { seed: string; worldHeight?: number; }
export interface GeneratedColumn { surfaceY: number; biome: BiomeId; }

/** Geração determinística por coluna — independente de renderização (ARCHITECTURE §7). */
export class WorldGenerator {
  private heightNoise: Noise1D; private tempNoise: Noise1D; private humNoise: Noise1D; private caveNoise: Noise2D;
  readonly seed: string; readonly worldHeight: number;
  constructor(opts: GenOptions) {
    this.seed = opts.seed; this.worldHeight = opts.worldHeight ?? GameConfig.worldHeight;
    const s = hashSeed(opts.seed);
    this.heightNoise = new Noise1D(s); this.tempNoise = new Noise1D(s ^ 0x1234); this.humNoise = new Noise1D(s ^ 0x5678); this.caveNoise = new Noise2D(s ^ 0x9abc);
  }
  surfaceHeight(x: number): number {
    const base = this.heightNoise.fbm(x * 0.008, 5);
    const hills = this.heightNoise.fbm(x * 0.03 + 100, 3);
    const h = 0.35 + base * 0.35 + hills * 0.15;
    return Math.floor(this.worldHeight * (1 - h));
  }
  biomeAt(x: number): BiomeId {
    const temp = this.tempNoise.fbm(x * 0.002, 3);
    const hum = this.humNoise.fbm(x * 0.002 + 50, 3);
    const h = 1 - this.surfaceHeight(x) / this.worldHeight;
    return biomeAt(temp, hum, h);
  }
  isCave(x: number, y: number): boolean {
    const depth = y / this.worldHeight;
    if (depth < 0.25) return false;
    const n = this.caveNoise.fbm(x * 0.05, y * 0.05, 3);
    const threshold = 0.62 - depth * 0.15;
    return n > threshold;
  }
  oreAt(x: number, y: number, depth: number): number {
    const r = rngFor(this.seed, 'ore', Math.floor(x / 3), Math.floor(y / 3));
    const v = r.next();
    if (depth > 0.75 && v > 0.985) return TileId.CrystalOre;
    if (depth > 0.6 && v > 0.975) return TileId.Obsidian;
    if (depth > 0.45 && v > 0.965) return TileId.GoldOre;
    if (depth > 0.3 && v > 0.955) return TileId.IronOre;
    if (depth > 0.15 && v > 0.94) return TileId.CoalOre;
    return TileId.Stone;
  }
  /** Fatia um chunk real da geração por coluna (cy em coordenadas de chunk). */
  generateChunk(cx: number, size: number, cy = 0): { fg: Uint8Array; bg: Uint8Array; biomes: BiomeId[] } {
    const fg = new Uint8Array(size * size); const bg = new Uint8Array(size * size); const biomes: BiomeId[] = [];
    for (let lx = 0; lx < size; lx++) {
      const col = this.generateColumn(cx * size + lx); biomes.push(col.biome);
      for (let ly = 0; ly < size; ly++) {
        fg[ly * size + lx] = col.tiles[cy * size + ly] ?? 0;
        bg[ly * size + lx] = col.bg[cy * size + ly] ?? 0;
      }
    }
    return { fg, bg, biomes };
  }
  /** Gera coluna completa de altura worldHeight (usado pelo World com chunks verticais empilhados). */
  generateColumn(x: number): { tiles: Uint8Array; bg: Uint8Array; biome: BiomeId; surfaceY: number } {
    const H = this.worldHeight;
    const tiles = new Uint8Array(H); const bg = new Uint8Array(H);
    const surf = this.surfaceHeight(x);
    const biome = this.biomeAt(x); const def = BIOMES[biome];
    const r = rngFor(this.seed, 'col', x);
    // nível da água: média local
    let avg = 0; for (let i = -8; i <= 8; i++) avg += this.surfaceHeight(x + i); avg /= 17;
    const waterLevel = Math.floor(avg) + 3;
    const isLake = surf > waterLevel + 2;
    for (let y = 0; y < H; y++) {
      const depth = y / H;
      if (y < surf) {
        if (isLake && y >= waterLevel) tiles[y] = TileId.Water;
        else tiles[y] = TileId.Air;
        continue;
      }
      bg[y] = TileId.WallStone;
      if (y >= H - 2) { tiles[y] = TileId.Bedrock; continue; }
      if (this.isCave(x, y) && y > surf + 4) { tiles[y] = TileId.Air; continue; }
      if (y === surf) tiles[y] = def.surfaceTile;
      else if (y < surf + 4) tiles[y] = def.subTile;
      else tiles[y] = this.oreAt(x, y, depth);
      if (y > surf + 2 && y < H - 2 && r.chance(0.02)) bg[y] = TileId.WallStone;
    }
    // vegetação na superfície
    if (!isLake && surf < H - 1) {
      if (r.chance(def.treeDensity * 8)) {
        const th = r.int(3, 5);
        for (let i = 1; i <= th && surf - i >= 0; i++) tiles[surf - i] = TileId.Wood;
        // copa simples
        for (let dy = th; dy <= th + 1; dy++) { const py = surf - dy; if (py >= 0) tiles[py] = TileId.Leaves; }
      } else if (r.chance(def.flowerDensity * 6)) tiles[surf - 1] = TileId.Flower;
    }
    return { tiles, bg, biome, surfaceY: surf };
  }
  spawnPoint(): { x: number; y: number } {
    // Procura solo seco e dois tiles livres para a hitbox de 12x28.
    for (let x = 0; x < 256; x++) {
      const c = this.generateColumn(x); const y = c.surfaceY;
      if (c.tiles[y - 1] === TileId.Air && c.tiles[y - 2] === TileId.Air) return { x, y: y - 2 };
    }
    return { x: 0, y: this.surfaceHeight(0) - 8 };
  }
}
