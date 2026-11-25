import { GameConfig } from '../config/GameConfig';
import type { WorldMeta } from '../world/World';
import { itemDef } from '../systems/inventory/items';
import { TILE_DEFS } from '../world/tiles/tiles';
export interface PlayerSave { x: number; y: number; survival: { health: number; hunger: number }; inventory: { itemId: string | null; count: number }[]; selected: number; }
export interface WorldSave {
  meta: WorldMeta; player: PlayerSave; time: { timeMs: number; day: number };
  chunks: { cx: number; cy: number; fg: number[]; bg: number[] }[]; entities: unknown[];
  version: number; savedAt: number;
}
export interface SettingsSave { settings: Record<string, unknown>; bindings: Record<string, string>; }
const DB_NAME = 'raiz-db'; const DB_VERSION = 1;
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('worlds')) db.createObjectStore('worlds', { keyPath: 'meta.id' });
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(db => new Promise<T>((resolve, reject) => {
    const t = db.transaction(store, mode); const req = fn(t.objectStore(store));
    // Só confirme depois do commit: sucesso do request não garante durabilidade.
    t.oncomplete = () => { db.close(); resolve(req.result); };
    t.onabort = t.onerror = () => { db.close(); reject(t.error ?? req.error ?? new Error('Falha no armazenamento')); };
  }));
}
function record(v: unknown): v is Record<string, unknown> { return !!v && typeof v === 'object' && !Array.isArray(v); }
function finite(v: unknown, min: number, max: number): v is number { return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max; }
function integer(v: unknown, min: number, max: number): v is number { return finite(v, min, max) && Number.isInteger(v); }
export function validateSave(data: unknown): data is WorldSave {
  if (!record(data) || !record(data.meta) || !record(data.player) || !record(data.time)) return false;
  const m = data.meta; const p = data.player; const time = data.time;
  if (![m.id, m.seed, m.name].every(v => typeof v === 'string' && v.length > 0 && v.length <= 512)) return false;
  if (!finite(m.createdAt, 0, Number.MAX_SAFE_INTEGER) || !finite(m.updatedAt, 0, Number.MAX_SAFE_INTEGER)) return false;
  if (!integer(m.generatorVersion, 1, GameConfig.generatorVersion) || !integer(m.version, 0, GameConfig.saveFormatVersion)) return false;
  if (!['facil', 'normal', 'dificil'].includes(String(m.difficulty))) return false;
  if (!integer(data.version ?? 0, 0, GameConfig.saveFormatVersion)) return false;
  if (data.version === 1 && !finite(data.savedAt, 0, Number.MAX_SAFE_INTEGER)) return false;
  if (!finite(p.x, -1e9, 1e9) || !finite(p.y, -1e6, 1e6) || !record(p.survival)) return false;
  if (!finite(p.survival.health, 0, 100) || !finite(p.survival.hunger, 0, 100) || !integer(p.selected, 0, 35)) return false;
  if (!Array.isArray(p.inventory) || p.inventory.length > 36 || !p.inventory.every(s => {
    if (!record(s)) return false;
    if (s.itemId === null) return s.count === 0;
    const def = typeof s.itemId === 'string' ? itemDef(s.itemId) : undefined;
    return !!def && integer(s.count, 1, def.maxStack);
  })) return false;
  if (!finite(time.timeMs, 0, GameConfig.dayLengthMs) || !integer(time.day, 1, Number.MAX_SAFE_INTEGER)) return false;
  if (!Array.isArray(data.chunks) || data.chunks.length > 10000) return false;
  const keys = new Set<string>();
  for (const c of data.chunks) {
    if (!record(c) || !integer(c.cx, -1e8, 1e8) || !integer(c.cy, -1e8, 1e8)) return false;
    const key = `${c.cx},${c.cy}`; if (keys.has(key)) return false; keys.add(key);
    if (![c.fg, c.bg].every(layer => Array.isArray(layer) && layer.length === GameConfig.chunkSize ** 2 && layer.every(id => integer(id, 0, 255) && !!TILE_DEFS[id]))) return false;
  }
  if (!Array.isArray(data.entities) || data.entities.length > 1000 || !data.entities.every(e => record(e)
    && typeof e.id === 'string' && typeof e.species === 'string' && ['passive', 'hostile'].includes(String(e.kind))
    && finite(e.x, -1e9, 1e9) && finite(e.y, -1e6, 1e6) && finite(e.vx, -1000, 1000)
    && finite(e.health, 0, 1000) && finite(e.maxHealth, 1, 1000) && typeof e.active === 'boolean')) return false;
  return true;
}
export function migrateSave(data: WorldSave): WorldSave {
  // Migrações de formato: v0 -> v1 (adiciona version/savedAt)
  if (data.version === undefined) { data.version = 0; }
  if (data.version < 1) { data.version = 1; data.savedAt = Date.now(); }
  return data;
}
export class WorldStore {
  async listWorlds(): Promise<WorldMeta[]> {
    const all = await tx<WorldSave[]>('worlds', 'readonly', s => s.getAll());
    return all.map(s => s.meta).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  async saveWorld(save: WorldSave): Promise<void> {
    save.version = GameConfig.saveFormatVersion; save.savedAt = Date.now();
    save.meta.updatedAt = Date.now();
    if (!validateSave(save)) throw new Error('Não foi possível salvar: dados inválidos');
    await tx('worlds', 'readwrite', s => s.put(save));
  }
  async loadWorld(id: string): Promise<WorldSave | null> {
    const save = await tx<WorldSave | undefined>('worlds', 'readonly', s => s.get(id));
    if (!save) return null;
    if (!validateSave(save)) throw new Error('Save corrompido: validação falhou');
    return migrateSave(save);
  }
  async deleteWorld(id: string): Promise<void> { await tx('worlds', 'readwrite', s => s.delete(id)); }
  async exportWorld(id: string): Promise<string> {
    const save = await this.loadWorld(id); if (!save) throw new Error('Mundo não encontrado');
    return JSON.stringify(save);
  }
  async importWorld(json: string): Promise<WorldMeta> {
    if (json.length > 32 * 1024 * 1024) throw new Error('Arquivo excede o limite de 32 MB');
    let parsed: unknown;
    try { parsed = JSON.parse(json); } catch { throw new Error('Arquivo inválido: JSON malformado'); }
    if (!validateSave(parsed)) throw new Error('Arquivo inválido: schema não reconhecido');
    const save = migrateSave(parsed);
    save.meta.id = 'w-' + Date.now().toString(36) + Math.floor(Math.random() * 1e4);
    await this.saveWorld(save);
    return save.meta;
  }
  async saveSettings(s: SettingsSave): Promise<void> { await tx('settings', 'readwrite', st => st.put({ key: 'app', ...s })); }
  async loadSettings(): Promise<SettingsSave | null> {
    const r = await tx<{ settings: Record<string, unknown>; bindings: Record<string, string> } | undefined>('settings', 'readonly', s => s.get('app'));
    return r ?? null;
  }
}
export const worldStore = new WorldStore();
