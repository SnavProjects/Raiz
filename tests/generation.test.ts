import { describe, it, expect } from 'vitest';
import { WorldGenerator } from '../src/generation/terrain/WorldGenerator';
import { Rng, hashSeed } from '../src/generation/noise/rng';
import { Noise1D } from '../src/generation/noise/noise';
describe('PRNG determinístico', () => {
  it('mesma seed produz mesma sequência', () => {
    const a = new Rng(hashSeed('raiz')); const b = new Rng(hashSeed('raiz'));
    for (let i = 0; i < 10; i++) expect(a.next()).toBe(b.next());
  });
  it('seeds diferentes divergem', () => { expect(hashSeed('a')).not.toBe(hashSeed('b')); });
  it('ruído é determinístico e limitado', () => {
    const n1 = new Noise1D(42); const n2 = new Noise1D(42);
    for (let i = 0; i < 20; i++) { const v = n1.fbm(i * 0.5); expect(v).toBe(n2.fbm(i * 0.5)); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1); }
  });
});
describe('WorldGenerator', () => {
  it('mesma seed gera mesmo mundo', () => {
    const g1 = new WorldGenerator({ seed: 'mundo-1' }); const g2 = new WorldGenerator({ seed: 'mundo-1' });
    for (let x = 0; x < 50; x++) expect(g1.surfaceHeight(x)).toBe(g2.surfaceHeight(x));
    const c1 = g1.generateColumn(10); const c2 = g2.generateColumn(10);
    expect(Array.from(c1.tiles)).toEqual(Array.from(c2.tiles));
  });
  it('seeds diferentes geram mundos diferentes', () => {
    const g1 = new WorldGenerator({ seed: 'a' }); const g2 = new WorldGenerator({ seed: 'b' });
    let diff = 0; for (let x = 0; x < 100; x++) if (g1.surfaceHeight(x) !== g2.surfaceHeight(x)) diff++;
    expect(diff).toBeGreaterThan(50);
  });
  it('coluna tem solo, pedra e bedrock', () => {
    const g = new WorldGenerator({ seed: 'teste' });
    const col = g.generateColumn(5);
    expect(col.tiles.length).toBe(200);
    expect(col.tiles[col.tiles.length - 1]).toBe(24); // bedrock
    expect(col.surfaceY).toBeGreaterThan(0);
  });
  it('cavernas existem em profundidade', () => {
    const g = new WorldGenerator({ seed: 'caverna' });
    let caves = 0; for (let x = 0; x < 200; x++) for (let y = 100; y < 190; y++) if (g.isCave(x, y)) caves++;
    expect(caves).toBeGreaterThan(0);
  });
  it('minérios são mais profundos', () => {
    const g = new WorldGenerator({ seed: 'minerio' });
    // cristal só aparece fundo
    let shallowCrystal = 0; for (let x = 0; x < 100; x++) for (let y = 0; y < 50; y++) if (g.oreAt(x, y, y / 200) === 11) shallowCrystal++;
    expect(shallowCrystal).toBe(0);
  });
  it('spawn point está acima do solo', () => {
    const g = new WorldGenerator({ seed: 'spawn' });
    const s = g.spawnPoint(); expect(s.y).toBeLessThan(g.surfaceHeight(s.x));
  });
});
