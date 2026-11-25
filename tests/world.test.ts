import { describe, it, expect } from 'vitest';
import { World } from '../src/world/World';
import { DayNightCycle } from '../src/world/DayNightCycle';
function mkWorld(seed = 'w1') { return new World({ id: 'w1', name: 'T', seed, createdAt: 0, updatedAt: 0, version: 1, generatorVersion: 1, difficulty: 'normal' }); }
describe('World chunks', () => {
  it('carrega chunks ao redor do jogador', () => {
    const w = mkWorld(); const chunks = w.ensureAround(0, 50, 2);
    expect(chunks.length).toBe(25); expect(w.chunkCount).toBe(25);
  });
  it('get/set tile consistente', () => {
    const w = mkWorld(); w.ensureAround(0, 50, 1);
    w.setTile(0, 50, 3); expect(w.getTile(0, 50)).toBe(3);
    w.setBgTile(0, 50, 28); expect(w.getBgTile(0, 50)).toBe(28);
  });
  it('setTile fora de chunk retorna false', () => { const w = mkWorld(); expect(w.setTile(9999, 9999, 3)).toBe(false); });
  it('descarrega chunks distantes não modificados', () => {
    const w = mkWorld(); w.ensureAround(0, 50, 1); const before = w.chunkCount;
    w.ensureAround(5000, 50, 1);
    expect(w.chunkCount).toBeLessThan(before + 20);
  });
  it('modificações são rastreadas para persistência', () => {
    const w = mkWorld(); w.ensureAround(0, 50, 1); w.setTile(0, 50, 13);
    expect(w.modifiedChunks().length).toBeGreaterThan(0);
  });
  it('loadModified restaura tiles', () => {
    const w = mkWorld(); w.ensureAround(0, 50, 1); w.setTile(1, 50, 14);
    const data = w.modifiedChunks().map(c => c.serialize());
    const w2 = mkWorld(); w2.loadModified(data);
    expect(w2.getTile(1, 50)).toBe(14);
  });
});
describe('DayNightCycle', () => {
  it('avança fases', () => {
    const c = new DayNightCycle();
    expect(c.phase).toBe('amanhecer');
    c.timeMs = 240000 * 0.3; expect(c.phase).toBe('dia');
    c.timeMs = 240000 * 0.6; expect(c.phase).toBe('entardecer');
    c.timeMs = 240000 * 0.9; expect(c.phase).toBe('noite');
  });
  it('vira o dia', () => { const c = new DayNightCycle(); c.update(240000 + 1000); expect(c.day).toBe(2); });
  it('escuridão maior à noite', () => { const c = new DayNightCycle(); c.timeMs = 240000 * 0.3; const day = c.darkness; c.timeMs = 240000 * 0.8; expect(c.darkness).toBeGreaterThan(day); });
  it('serializa', () => { const c = new DayNightCycle(); c.timeMs = 5000; c.day = 3; const d = c.serialize(); const c2 = new DayNightCycle(); c2.deserialize(d); expect(c2.day).toBe(3); });
});

describe('preservação fora do cache', () => {
  it('não perde construções ao explorar longe e retornar', () => {
    const w = mkWorld(); w.ensureAround(0, 50, 1); w.setTile(0, 50, 13);
    for (let x = 1000; x <= 5000; x += 1000) w.ensureAround(x, 50, 1);
    expect(w.modifiedChunks().some(c => c.cx === 0)).toBe(true);
    const saved = w.modifiedChunks().map(c => c.serialize());
    const restored = mkWorld(); restored.loadModified(saved); restored.ensureAround(0, 50, 1);
    expect(restored.getTile(0, 50)).toBe(13);
    w.ensureAround(0, 50, 1); expect(w.getTile(0, 50)).toBe(13);
  });
});
