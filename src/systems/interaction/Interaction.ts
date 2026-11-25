import { World } from '../../world/World';
import { TileId, tileDef } from '../../world/tiles/tiles';
export interface InteractResult { kind: 'none' | 'mine' | 'collect' | 'use'; tileId: number; drops: { itemId: string; count: number }[]; }
export class Interaction {
  constructor(private world: World) {}
  /** Interage com tile alvo: retorna drops se minerável/coleta. */
  interact(x: number, y: number, toolTier: number): InteractResult {
    const id = this.world.getTile(x, y);
    if (id === TileId.Air || id === TileId.Water) return { kind: 'none', tileId: id, drops: [] };
    const def = tileDef(id);
    if (def.hardness === Infinity) return { kind: 'none', tileId: id, drops: [] };
    if (def.toolTier > toolTier) return { kind: 'none', tileId: id, drops: [] };
    this.world.setTile(x, y, TileId.Air);
    return { kind: 'mine', tileId: id, drops: def.drops };
  }
  /** Usa item comestível ou interage com estação (bancada/fornalha/cama/baú). */
  useStation(x: number, y: number): string | null {
    const id = this.world.getTile(x, y);
    if (id === TileId.Workbench) return 'workbench';
    if (id === TileId.Furnace) return 'furnace';
    if (id === TileId.Bed) return 'bed';
    if (id === TileId.Chest) return 'chest';
    return null;
  }
}
