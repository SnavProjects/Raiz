import { GameConfig } from '../../config/GameConfig';
export interface ChunkData { cx: number; cy: number; fg: Uint8Array; bg: Uint8Array; modified: boolean; }
export class Chunk {
  readonly cx: number; readonly cy: number; readonly size: number;
  fg: Uint8Array; bg: Uint8Array; modified = false;
  constructor(cx: number, cy: number, size = GameConfig.chunkSize) {
    this.cx = cx; this.cy = cy; this.size = size;
    this.fg = new Uint8Array(size * size); this.bg = new Uint8Array(size * size);
  }
  idx(lx: number, ly: number): number { return ly * this.size + lx; }
  getFg(lx: number, ly: number): number { return this.fg[this.idx(lx, ly)] ?? 0; }
  setFg(lx: number, ly: number, v: number): void { this.fg[this.idx(lx, ly)] = v; this.modified = true; }
  getBg(lx: number, ly: number): number { return this.bg[this.idx(lx, ly)] ?? 0; }
  setBg(lx: number, ly: number, v: number): void { this.bg[this.idx(lx, ly)] = v; this.modified = true; }
  serialize(): { cx: number; cy: number; fg: number[]; bg: number[] } {
    return { cx: this.cx, cy: this.cy, fg: Array.from(this.fg), bg: Array.from(this.bg) };
  }
  static deserialize(d: { cx: number; cy: number; fg: number[]; bg: number[] }, size = GameConfig.chunkSize): Chunk {
    const c = new Chunk(d.cx, d.cy, size);
    c.fg = Uint8Array.from(d.fg); c.bg = Uint8Array.from(d.bg); c.modified = true;
    return c;
  }
}
