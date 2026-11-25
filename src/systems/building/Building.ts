import { World } from '../../world/World';
import { isSolid, tileDef, TileId } from '../../world/tiles/tiles';
import { Inventory } from '../inventory/Inventory';
import { itemDef } from '../inventory/items';
export type BuildMode = 'place' | 'remove' | 'wall';
export class Building {
  constructor(private world: World, private inv: Inventory) {}
  canPlace(x: number, y: number, tileId: number): boolean {
    const def = tileDef(tileId);
    const current = this.world.getTile(x, y);
    if (def.background) return current === TileId.Air || current === tileId;
    if (current !== TileId.Air && current !== TileId.Water && current !== TileId.Flower && current !== TileId.Sapling) return false;
    return true;
  }
  place(x: number, y: number, itemId: string): boolean {
    const def = itemDef(itemId); if (!def?.placeableTile) return false;
    if (this.inv.count(itemId) < 1) return false;
    if (!this.canPlace(x, y, def.placeableTile)) return false;
    const isWall = tileDef(def.placeableTile).background === true;
    const ok = isWall ? this.world.setBgTile(x, y, def.placeableTile) : this.world.setTile(x, y, def.placeableTile);
    if (ok) this.inv.remove(itemId, 1);
    return ok;
  }
  remove(x: number, y: number, toolTier: number): { itemId: string; count: number }[] | null {
    const id = this.world.getTile(x, y);
    const def = tileDef(id);
    if (id === TileId.Air || id === TileId.Water || def.hardness === Infinity) return null;
    if (def.toolTier > toolTier) return null;
    this.world.setTile(x, y, TileId.Air);
    return def.drops;
  }
  removeWall(x: number, y: number): { itemId: string; count: number }[] | null {
    const id = this.world.getBgTile(x, y);
    if (!id) return null;
    this.world.setBgTile(x, y, TileId.Air);
    return tileDef(id).drops;
  }
  isOccupied(x: number, y: number): boolean { return isSolid(this.world.getTile(x, y)); }
}
