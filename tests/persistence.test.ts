import { describe, it, expect } from 'vitest';
import { WorldStore, validateSave, migrateSave } from '../src/persistence/WorldStore';
describe('WorldStore IndexedDB', () => {
  it('cria, lista, carrega e exclui mundo', async () => {
    const store = new WorldStore();
    const meta = { id: 't1', name: 'Teste', seed: 'abc', createdAt: 1, updatedAt: 1, version: 1, generatorVersion: 1, difficulty: 'normal' };
    await store.saveWorld({ meta, player: { x: 0, y: 0, survival: { health: 100, hunger: 100 }, inventory: [], selected: 0 }, time: { timeMs: 0, day: 1 }, chunks: [], entities: [], version: 1, savedAt: 1 });
    const list = await store.listWorlds(); expect(list.some(w => w.id === 't1')).toBe(true);
    const loaded = await store.loadWorld('t1'); expect(loaded?.meta.name).toBe('Teste');
    await store.deleteWorld('t1');
    expect(await store.loadWorld('t1')).toBeNull();
  });
  it('export/import preserva dados', async () => {
    const store = new WorldStore();
    const meta = { id: 't2', name: 'Exp', seed: 'xyz', createdAt: 1, updatedAt: 1, version: 1, generatorVersion: 1, difficulty: 'normal' };
    await store.saveWorld({ meta, player: { x: 10, y: 20, survival: { health: 80, hunger: 90 }, inventory: [{ itemId: 'dirt', count: 5 }], selected: 0 }, time: { timeMs: 100, day: 2 }, chunks: [], entities: [], version: 1, savedAt: 1 });
    const json = await store.exportWorld('t2');
    const imported = await store.importWorld(json);
    expect(imported.seed).toBe('xyz'); expect(imported.id).not.toBe('t2');
    const loaded = await store.loadWorld(imported.id); expect(loaded?.player.inventory[0]?.count).toBe(5);
    await store.deleteWorld('t2'); await store.deleteWorld(imported.id);
  });
  it('import rejeita JSON inválido', async () => { const store = new WorldStore(); await expect(store.importWorld('nao-json')).rejects.toThrow(); });
  it('import rejeita schema inválido', async () => { const store = new WorldStore(); await expect(store.importWorld('{"foo":1}')).rejects.toThrow(); });
  it('settings persistem', async () => {
    const store = new WorldStore();
    await store.saveSettings({ settings: { volumeMaster: 0.5 }, bindings: { left: 'KeyA' } });
    const s = await store.loadSettings(); expect(s?.settings.volumeMaster).toBe(0.5);
  });
});
describe('validação e migração', () => {
  it('validateSave rejeita saves incompletos', () => {
    expect(validateSave({ meta: { id: 'a', seed: 's', name: 'n' }, chunks: [], player: {} })).toBe(false);
    expect(validateSave({})).toBe(false); expect(validateSave(null)).toBe(false);
  });
  it('migrateSave atualiza versão', () => {
    const s = migrateSave({ meta: { id: 'a', seed: 's', name: 'n', createdAt: 0, updatedAt: 0, version: 0, generatorVersion: 1, difficulty: 'normal' }, player: { x: 0, y: 0, survival: { health: 1, hunger: 1 }, inventory: [], selected: 0 }, time: { timeMs: 0, day: 1 }, chunks: [], entities: [], version: 0, savedAt: 0 });
    expect(s.version).toBe(1);
  });
});

describe('fronteira de confiança de arquivos importados', () => {
  const valid = () => ({
    meta: { id: 'v', name: 'Válido', seed: 'seed', createdAt: 0, updatedAt: 0, version: 1, generatorVersion: 1, difficulty: 'normal' },
    player: { x: 0, y: 500, survival: { health: 100, hunger: 100 }, inventory: [{ itemId: 'wood', count: 1 }], selected: 0 },
    time: { timeMs: 0, day: 1 }, chunks: [], entities: [], version: 1, savedAt: 0,
  });
  it('aceita um save completo', () => expect(validateSave(valid())).toBe(true));
  it('rejeita coordenadas e contagens inválidas', () => {
    const a = valid(); a.player.x = Infinity; expect(validateSave(a)).toBe(false);
    const b = valid(); b.player.inventory[0]!.count = -5; expect(validateSave(b)).toBe(false);
    const c = valid(); c.player.inventory[0]!.itemId = 'desconhecido'; expect(validateSave(c)).toBe(false);
  });
  it('rejeita versão futura e camada de chunk truncada', () => {
    const a = valid(); a.version = 999; expect(validateSave(a)).toBe(false);
    expect(validateSave({ ...valid(), chunks: [{ cx: 0, cy: 0, fg: [1], bg: [] }] })).toBe(false);
  });
  it('importação inválida não escreve no IndexedDB', async () => {
    const store = new WorldStore(); const before = await store.listWorlds();
    const a = valid(); a.player.survival.health = -10;
    await expect(store.importWorld(JSON.stringify(a))).rejects.toThrow();
    expect(await store.listWorlds()).toHaveLength(before.length);
  });
});
