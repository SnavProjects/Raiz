import { hashSeed } from './rng';
// Ruído de valor 1D/2D determinístico com interpolação suave (smoothstep)
export class Noise1D {
  private perm: Uint8Array;
  constructor(seed: number) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed >>> 0 || 1;
    const rnd = (): number => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = p[i]!; p[i] = p[j]!; p[j] = t; }
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255]!;
  }
  private val(ix: number): number { return this.perm[(ix & 255) + 256]! / 255; }
  sample(x: number): number {
    const ix = Math.floor(x); const fx = x - ix;
    const a = this.val(ix); const b = this.val(ix + 1);
    const t = fx * fx * (3 - 2 * fx);
    return a + (b - a) * t;
  }
  fbm(x: number, octaves = 4, lacunarity = 2, gain = 0.5): number {
    let amp = 1; let freq = 1; let sum = 0; let norm = 0;
    for (let o = 0; o < octaves; o++) { sum += this.sample(x * freq) * amp; norm += amp; amp *= gain; freq *= lacunarity; }
    return sum / norm;
  }
}
export class Noise2D {
  private n1: Noise1D; private n2: Noise1D;
  constructor(seed: number) { this.n1 = new Noise1D(seed); this.n2 = new Noise1D(seed ^ 0x9e3779b9); }
  sample(x: number, y: number): number { return (this.n1.sample(x + y * 57.3) + this.n2.sample(y - x * 31.7)) / 2; }
  fbm(x: number, y: number, octaves = 4): number { return (this.n1.fbm(x + y * 13.7, octaves) + this.n2.fbm(y - x * 7.3, octaves)) / 2; }
}
export function noiseFromSeed(seed: string): Noise1D { return new Noise1D(hashSeed(seed)); }
