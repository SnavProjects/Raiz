import { RECIPES, type Recipe } from './recipes';
import { Inventory, type Slot } from '../inventory/Inventory';
import { itemDef } from '../inventory/items';
import { eventBus } from '../../core/EventBus';
export class Crafting {
  constructor(private inv: Inventory, private stations: ReadonlySet<string> = new Set()) {}
  /** Planejamento sem efeitos colaterais: ingredientes e espaço são validados juntos. */
  private plan(r: Recipe): Slot[] | null {
    if (r.station && !this.stations.has(r.station)) return null;
    if (!r.ingredients.every(i => this.inv.count(i.itemId) >= i.count)) return null;
    const slots = this.inv.serialize();
    for (const ingredient of r.ingredients) {
      let remaining = ingredient.count;
      for (const slot of slots) if (slot.itemId === ingredient.itemId) {
        const used = Math.min(remaining, slot.count); slot.count -= used; remaining -= used;
        if (slot.count === 0) slot.itemId = null;
        if (remaining === 0) break;
      }
    }
    const def = itemDef(r.result.itemId); if (!def) return null;
    let remaining = r.result.count;
    for (const slot of slots) if (slot.itemId === def.id) {
      const added = Math.min(remaining, def.maxStack - slot.count); slot.count += added; remaining -= added;
    }
    for (const slot of slots) if (remaining > 0 && !slot.itemId) {
      const added = Math.min(remaining, def.maxStack); slot.itemId = def.id; slot.count = added; remaining -= added;
    }
    return remaining === 0 ? slots : null;
  }
  canCraft(r: Recipe): boolean { return this.plan(r) !== null; }
  missing(r: Recipe): { itemId: string; need: number; have: number }[] {
    return r.ingredients.filter(i => this.inv.count(i.itemId) < i.count).map(i => ({ itemId: i.itemId, need: i.count, have: this.inv.count(i.itemId) }));
  }
  craft(recipeId: string): boolean {
    const recipe = RECIPES.find(r => r.id === recipeId); if (!recipe) return false;
    const slots = this.plan(recipe); if (!slots) return false;
    this.inv.deserialize(slots);
    eventBus.emit({ type: 'crafted', recipeId });
    return true;
  }
  list(category?: string): Recipe[] { return category ? RECIPES.filter(r => r.category === category) : RECIPES; }
  categories(): string[] { return [...new Set(RECIPES.map(r => r.category))]; }
}
