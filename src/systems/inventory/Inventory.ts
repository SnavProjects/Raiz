import { itemDef } from './items';
import { eventBus } from '../../core/EventBus';
export interface Slot { itemId: string | null; count: number; }
export class Inventory {
  readonly size: number; slots: Slot[]; hotbarSize = 9; selected = 0;
  constructor(size = 36) { this.size = size; this.slots = Array.from({ length: size }, () => ({ itemId: null, count: 0 })); }
  add(itemId: string, count = 1): number {
    const def = itemDef(itemId);
    if (!def || !Number.isInteger(count) || count <= 0) return count;
    const max = def.maxStack;
    let remaining = count;
    for (const s of this.slots) if (s.itemId === itemId && s.count < max) { const add = Math.min(max - s.count, remaining); s.count += add; remaining -= add; if (!remaining) break; }
    for (const s of this.slots) if (remaining > 0 && !s.itemId) { const add = Math.min(max, remaining); s.itemId = itemId; s.count = add; remaining -= add; if (!remaining) break; }
    if (remaining < count) eventBus.emit({ type: 'inventory-changed' });
    return remaining;
  }
  remove(itemId: string, count = 1): boolean {
    let total = 0; for (const s of this.slots) if (s.itemId === itemId) total += s.count;
    if (total < count) return false;
    let rem = count;
    for (const s of this.slots) { if (s.itemId === itemId) { const take = Math.min(s.count, rem); s.count -= take; rem -= take; if (!s.count) s.itemId = null; if (!rem) break; } }
    eventBus.emit({ type: 'inventory-changed' }); return true;
  }
  count(itemId: string): number { let t = 0; for (const s of this.slots) if (s.itemId === itemId) t += s.count; return t; }
  move(from: number, to: number): void {
    if (from === to || !this.slots[from] || !this.slots[to]) return;
    const a = this.slots[from]!; const b = this.slots[to]!;
    if (!a.itemId) return;
    if (!b.itemId) { this.slots[to] = { ...a }; this.slots[from] = { itemId: null, count: 0 }; }
    else if (a.itemId === b.itemId) {
      const max = itemDef(a.itemId)?.maxStack ?? 99;
      const transfer = Math.min(max - b.count, a.count);
      b.count += transfer; a.count -= transfer; if (!a.count) a.itemId = null;
    } else { this.slots[to] = { ...a }; this.slots[from] = { ...b }; }
    eventBus.emit({ type: 'inventory-changed' });
  }
  split(from: number, to: number): void {
    const a = this.slots[from]; const b = this.slots[to];
    if (!a?.itemId || !b || b.itemId || from === to) return;
    const half = Math.ceil(a.count / 2);
    b.itemId = a.itemId; b.count = half; a.count -= half; if (a.count === 0) a.itemId = null;
    eventBus.emit({ type: 'inventory-changed' });
  }
  discard(index: number): void { this.slots[index] = { itemId: null, count: 0 }; eventBus.emit({ type: 'inventory-changed' }); }
  sort(): void {
    const items = this.slots.filter(s => s.itemId).sort((a, b) => (a.itemId ?? '').localeCompare(b.itemId ?? ''));
    this.slots = [...items, ...Array.from({ length: this.size - items.length }, () => ({ itemId: null, count: 0 }))];
    eventBus.emit({ type: 'inventory-changed' });
  }
  selectedItem(): string | null { return this.slots[this.selected]?.itemId ?? null; }
  bestToolTier(): number {
    let best = 0;
    for (const s of this.slots) { const t = s.itemId ? itemDef(s.itemId)?.toolTier ?? 0 : 0; if (t > best) best = t; }
    return best;
  }
  serialize(): Slot[] { return this.slots.map(s => ({ ...s })); }
  deserialize(slots: Slot[]): void { this.slots = Array.from({ length: this.size }, (_, i) => ({ ...(slots[i] ?? { itemId: null, count: 0 }) })); eventBus.emit({ type: 'inventory-changed' }); }
}
