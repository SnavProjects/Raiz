import { describe, it, expect } from 'vitest';
import { World } from '../src/world/World';
import { Building } from '../src/systems/building/Building';
import { Interaction } from '../src/systems/interaction/Interaction';
import { Inventory } from '../src/systems/inventory/Inventory';
import { Survival } from '../src/systems/survival/Survival';
import { attack, isDead, weaponDamage } from '../src/systems/combat/Combat';
import { Player } from '../src/player/Player';
function mkWorld() { const w = new World({ id: 'w1', name: 'T', seed: 's1', createdAt: 0, updatedAt: 0, version: 1, generatorVersion: 1, difficulty: 'normal' }); w.ensureAround(0, 50, 2); return w; }
describe('Building', () => {
  it('coloca bloco e consome inventário', () => {
    const w = mkWorld(); const inv = new Inventory(9); inv.add('plank', 5);
    const b = new Building(w, inv);
    expect(b.place(0, 50, 'plank')).toBe(true); expect(w.getTile(0, 50)).toBe(13); expect(inv.count('plank')).toBe(4);
  });
  it('não coloca sobre bloco sólido', () => {
    const w = mkWorld(); const inv = new Inventory(9); inv.add('plank', 5);
    const b = new Building(w, inv); w.setTile(0, 50, 3);
    expect(b.place(0, 50, 'plank')).toBe(false);
  });
  it('remove bloco e retorna drops', () => {
    const w = mkWorld(); const inv = new Inventory(9); const b = new Building(w, inv);
    w.setTile(0, 50, 2);
    const drops = b.remove(0, 50, 0); expect(drops).toEqual([{ itemId: 'dirt', count: 1 }]); expect(w.getTile(0, 50)).toBe(0);
  });
  it('não remove bedrock', () => { const w = mkWorld(); const inv = new Inventory(9); const b = new Building(w, inv); w.setTile(0, 50, 24); expect(b.remove(0, 50, 99)).toBeNull(); });
  it('respeita tier de ferramenta', () => { const w = mkWorld(); const inv = new Inventory(9); const b = new Building(w, inv); w.setTile(0, 50, 3); expect(b.remove(0, 50, 0)).toBeNull(); });
  it('parede vai para background', () => {
    const w = mkWorld(); const inv = new Inventory(9); inv.add('wall_wood', 4);
    const b = new Building(w, inv); expect(b.place(0, 50, 'wall_wood')).toBe(true); expect(w.getBgTile(0, 50)).toBe(28);
  });
});
describe('Interaction', () => {
  it('minera e gera drops', () => {
    const w = mkWorld(); const inter = new Interaction(w); w.setTile(0, 50, 2);
    const r = inter.interact(0, 50, 0); expect(r.kind).toBe('mine'); expect(r.drops[0]?.itemId).toBe('dirt');
  });
  it('detecta estações', () => { const w = mkWorld(); const inter = new Interaction(w); w.setTile(0, 50, 26); expect(inter.useStation(0, 50)).toBe('workbench'); });
});
describe('Survival', () => {
  it('fome diminui e causa dano', () => { const s = new Survival('normal'); s.hunger = 1; s.update(10, false, false); expect(s.hunger).toBe(0); expect(s.health).toBeLessThan(100); });
  it('comer restaura fome', () => { const s = new Survival(); s.hunger = 10; s.eat(50); expect(s.hunger).toBe(60); });
  it('morte e respawn', () => { const s = new Survival(); s.damage(200); expect(s.dead).toBe(true); s.respawn(); expect(s.dead).toBe(false); expect(s.health).toBe(100); });
  it('dificuldade fácil reduz fome', () => { const a = new Survival('facil'); const b = new Survival('dificil'); a.update(10, false, false); b.update(10, false, false); expect(a.hunger).toBeGreaterThan(b.hunger); });
});
describe('Combat', () => {
  it('ataque reduz vida', () => { const a = { id: 'a', health: 10, maxHealth: 10, damage: 3 }; const b = { id: 'b', health: 10, maxHealth: 10, damage: 1 }; attack(a, b, 2); expect(b.health).toBe(5); });
  it('isDead', () => { expect(isDead({ id: 'x', health: 0, maxHealth: 10, damage: 1 })).toBe(true); });
  it('weaponDamage', () => { expect(weaponDamage('sword_iron')).toBe(12); expect(weaponDamage(null)).toBe(1); });
});
describe('Player física', () => {
  it('cai por gravidade e pousa no solo', () => {
    const w = mkWorld(); const p = new Player(w); p.spawn();
    const y0 = p.y;
    for (let i = 0; i < 120; i++) p.update(1 / 60, { left: false, right: false, jump: false });
    expect(p.onGround).toBe(true); expect(p.y).toBeGreaterThanOrEqual(y0);
  });
  it('move horizontalmente', () => {
    const w = mkWorld(); const p = new Player(w); p.spawn(); p.y = 0; p.vy = 0;
    const x0 = p.x; p.update(0.1, { left: false, right: true, jump: false });
    expect(p.x).toBeGreaterThan(x0);
  });
  it('pula', () => {
    const w = mkWorld(); const p = new Player(w); p.spawn();
    for (let i = 0; i < 120; i++) p.update(1 / 60, { left: false, right: false, jump: false });
    const yGround = p.y; p.update(1 / 60, { left: false, right: false, jump: true });
    expect(p.vy).toBeLessThan(0);
    void yGround;
  });
  it('serializa estado', () => {
    const w = mkWorld(); const p = new Player(w); p.spawn(); p.inventory.add('dirt', 5);
    const s = p.serialize(); const p2 = new Player(w); p2.deserialize(s);
    expect(p2.inventory.count('dirt')).toBe(5);
  });
});

describe('regressões de colisão', () => {
  function arena() {
    const w = mkWorld();
    for (let x = -4; x <= 4; x++) for (let y = 40; y <= 48; y++) w.setTile(x, y, y === 48 || x === 3 ? 3 : 0);
    return { w, p: new Player(w) };
  }
  it('parede bloqueia movimento horizontal sem atravessar tiles', () => {
    const { p } = arena(); p.x = 16; p.y = 44 * 16;
    for (let i = 0; i < 60; i++) p.update(1 / 60, { left: false, right: true, jump: false });
    expect(p.x + 12).toBeLessThan(3 * 16); expect(p.onGround).toBe(true);
  });
  it('bater a cabeça não teletransporta para cima do teto', () => {
    const { w, p } = arena(); p.x = 16; p.y = 45 * 16;
    w.setTile(1, 44, 3); p.vy = -400;
    p.update(0.05, { left: false, right: false, jump: false });
    expect(p.y).toBe(45 * 16); expect(p.vy).toBe(0);
  });
});
