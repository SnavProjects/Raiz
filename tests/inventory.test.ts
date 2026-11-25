import { describe, it, expect } from 'vitest';
import { Inventory } from '../src/systems/inventory/Inventory';
import { Crafting } from '../src/systems/crafting/Crafting';
describe('Inventory', () => {
  it('adiciona e empilha', () => { const inv = new Inventory(9); inv.add('dirt', 150); expect(inv.count('dirt')).toBe(150); });
  it('remove com validação', () => { const inv = new Inventory(9); inv.add('wood', 5); expect(inv.remove('wood', 10)).toBe(false); expect(inv.remove('wood', 3)).toBe(true); expect(inv.count('wood')).toBe(2); });
  it('move entre slots', () => { const inv = new Inventory(9); inv.add('stone', 10); inv.move(0, 5); expect(inv.slots[5]?.count).toBe(10); });
  it('split divide pilha', () => { const inv = new Inventory(9); inv.add('dirt', 10); inv.split(0, 1); expect(inv.slots[0]?.count).toBe(5); expect(inv.slots[1]?.count).toBe(5); });
  it('sort organiza', () => { const inv = new Inventory(9); inv.add('wood', 1); inv.add('dirt', 1); inv.sort(); expect(inv.slots[0]?.itemId).toBe('dirt'); });
  it('discard limpa slot', () => { const inv = new Inventory(9); inv.add('dirt', 5); inv.discard(0); expect(inv.count('dirt')).toBe(0); });
  it('serializa', () => { const inv = new Inventory(9); inv.add('dirt', 3); const s = inv.serialize(); const inv2 = new Inventory(9); inv2.deserialize(s); expect(inv2.count('dirt')).toBe(3); });
});
describe('Crafting', () => {
  it('craft plank a partir de wood', () => {
    const inv = new Inventory(9); inv.add('wood', 1);
    const c = new Crafting(inv);
    expect(c.craft('plank')).toBe(true); expect(inv.count('plank')).toBe(4); expect(inv.count('wood')).toBe(0);
  });
  it('falha sem ingredientes', () => { const inv = new Inventory(9); const c = new Crafting(inv); expect(c.craft('plank')).toBe(false); });
  it('missing informa faltantes', () => { const inv = new Inventory(9); const c = new Crafting(inv); const r = c.list().find(x => x.id === 'plank')!; expect(c.missing(r).length).toBeGreaterThan(0); });
  it('categorias existem', () => { const inv = new Inventory(9); const c = new Crafting(inv); expect(c.categories().length).toBeGreaterThan(3); });
});

describe('regressões de slots', () => {
  it('carregar inventário vazio mantém os 36 slots utilizáveis', () => {
    const inv = new Inventory(); inv.deserialize([]);
    expect(inv.slots).toHaveLength(36); expect(inv.add('wood', 5)).toBe(0);
  });
  it('empilhamento não cria item fantasma de contagem zero', () => {
    const inv = new Inventory(); inv.add('wood', 1); inv.add('wood', 1);
    expect(inv.slots[1]).toEqual({ itemId: null, count: 0 });
  });
  it('split ignora destino inexistente e mantém quantidade total', () => {
    const inv = new Inventory(); inv.add('wood', 2); inv.split(0, 100);
    expect(inv.count('wood')).toBe(2); inv.split(0, 0); expect(inv.count('wood')).toBe(2);
  });
});

describe('crafting transacional', () => {
  it('falha sem consumir ingredientes se resultado não couber', () => {
    const inv = new Inventory(1); inv.add('wood', 99);
    expect(new Crafting(inv).craft('plank')).toBe(false);
    expect(inv.count('wood')).toBe(99);
  });
  it('usa espaço liberado pelos próprios ingredientes', () => {
    const inv = new Inventory(1); inv.add('wood', 1);
    expect(new Crafting(inv).craft('plank')).toBe(true); expect(inv.count('plank')).toBe(4);
  });
  it('exige estação para fundição', () => {
    const inv = new Inventory(); inv.add('sand', 2);
    expect(new Crafting(inv).craft('glass')).toBe(false); expect(inv.count('sand')).toBe(2);
    expect(new Crafting(inv, new Set(['furnace'])).craft('glass')).toBe(true);
  });
});
