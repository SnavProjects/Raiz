export const TileId = {
  Air: 0, Grass: 1, Dirt: 2, Stone: 3, Sand: 4, Wood: 5, Leaves: 6, Water: 7,
  CoalOre: 8, IronOre: 9, GoldOre: 10, CrystalOre: 11, Obsidian: 12,
  Plank: 13, Brick: 14, Glass: 15, Torch: 16, Door: 17, Bed: 18, Chest: 19,
  Snow: 20, Clay: 21, Flower: 22, Sapling: 23, Bedrock: 24, Gravel: 25, Workbench: 26, Furnace: 27, WallWood: 28, WallStone: 29,
} as const;
export type TileIdValue = typeof TileId[keyof typeof TileId];
export interface TileDef {
  id: number; name: string; solid: boolean; hardness: number; // segundos p/ minerar (0 = não minerável)
  toolTier: number; drops: { itemId: string; count: number }[]; background?: boolean; light?: number;
}
export const TILE_DEFS: Record<number, TileDef> = {
  [TileId.Air]: { id: 0, name: 'Ar', solid: false, hardness: 0, toolTier: 0, drops: [] },
  [TileId.Grass]: { id: 1, name: 'Grama', solid: true, hardness: 0.4, toolTier: 0, drops: [{ itemId: 'dirt', count: 1 }] },
  [TileId.Dirt]: { id: 2, name: 'Terra', solid: true, hardness: 0.4, toolTier: 0, drops: [{ itemId: 'dirt', count: 1 }] },
  [TileId.Stone]: { id: 3, name: 'Pedra', solid: true, hardness: 1.2, toolTier: 1, drops: [{ itemId: 'stone', count: 1 }] },
  [TileId.Sand]: { id: 4, name: 'Areia', solid: true, hardness: 0.3, toolTier: 0, drops: [{ itemId: 'sand', count: 1 }] },
  [TileId.Wood]: { id: 5, name: 'Tronco', solid: true, hardness: 0.8, toolTier: 0, drops: [{ itemId: 'wood', count: 1 }] },
  [TileId.Leaves]: { id: 6, name: 'Folhas', solid: false, hardness: 0.15, toolTier: 0, drops: [{ itemId: 'leaf', count: 1 }] },
  [TileId.Water]: { id: 7, name: 'Água', solid: false, hardness: 0, toolTier: 0, drops: [] },
  [TileId.CoalOre]: { id: 8, name: 'Carvão', solid: true, hardness: 1.4, toolTier: 1, drops: [{ itemId: 'coal', count: 1 }] },
  [TileId.IronOre]: { id: 9, name: 'Ferro', solid: true, hardness: 1.8, toolTier: 2, drops: [{ itemId: 'iron_ore', count: 1 }] },
  [TileId.GoldOre]: { id: 10, name: 'Ouro', solid: true, hardness: 2.2, toolTier: 2, drops: [{ itemId: 'gold_ore', count: 1 }] },
  [TileId.CrystalOre]: { id: 11, name: 'Cristal', solid: true, hardness: 2.6, toolTier: 3, drops: [{ itemId: 'crystal', count: 1 }] },
  [TileId.Obsidian]: { id: 12, name: 'Obsidiana', solid: true, hardness: 3.5, toolTier: 3, drops: [{ itemId: 'obsidian', count: 1 }] },
  [TileId.Plank]: { id: 13, name: 'Tábua', solid: true, hardness: 0.8, toolTier: 0, drops: [{ itemId: 'plank', count: 1 }] },
  [TileId.Brick]: { id: 14, name: 'Tijolo', solid: true, hardness: 1.0, toolTier: 1, drops: [{ itemId: 'brick', count: 1 }] },
  [TileId.Glass]: { id: 15, name: 'Vidro', solid: true, hardness: 0.5, toolTier: 0, drops: [{ itemId: 'glass', count: 1 }] },
  [TileId.Torch]: { id: 16, name: 'Tocha', solid: false, hardness: 0.1, toolTier: 0, drops: [{ itemId: 'torch', count: 1 }], light: 1 },
  [TileId.Door]: { id: 17, name: 'Porta', solid: true, hardness: 0.6, toolTier: 0, drops: [{ itemId: 'door', count: 1 }] },
  [TileId.Bed]: { id: 18, name: 'Cama', solid: true, hardness: 0.6, toolTier: 0, drops: [{ itemId: 'bed', count: 1 }] },
  [TileId.Chest]: { id: 19, name: 'Baú', solid: true, hardness: 0.8, toolTier: 0, drops: [{ itemId: 'chest', count: 1 }] },
  [TileId.Snow]: { id: 20, name: 'Neve', solid: true, hardness: 0.4, toolTier: 0, drops: [{ itemId: 'snow', count: 1 }] },
  [TileId.Clay]: { id: 21, name: 'Argila', solid: true, hardness: 0.5, toolTier: 0, drops: [{ itemId: 'clay', count: 1 }] },
  [TileId.Flower]: { id: 22, name: 'Flor', solid: false, hardness: 0.05, toolTier: 0, drops: [{ itemId: 'flower', count: 1 }] },
  [TileId.Sapling]: { id: 23, name: 'Muda', solid: false, hardness: 0.05, toolTier: 0, drops: [{ itemId: 'sapling', count: 1 }] },
  [TileId.Bedrock]: { id: 24, name: 'Rocha-mãe', solid: true, hardness: Infinity, toolTier: 99, drops: [] },
  [TileId.Gravel]: { id: 25, name: 'Cascalho', solid: true, hardness: 0.5, toolTier: 0, drops: [{ itemId: 'gravel', count: 1 }] },
  [TileId.Workbench]: { id: 26, name: 'Bancada', solid: true, hardness: 0.8, toolTier: 0, drops: [{ itemId: 'workbench', count: 1 }] },
  [TileId.Furnace]: { id: 27, name: 'Fornalha', solid: true, hardness: 1.5, toolTier: 1, drops: [{ itemId: 'furnace', count: 1 }] },
  [TileId.WallWood]: { id: 28, name: 'Parede de madeira', solid: false, hardness: 0.3, toolTier: 0, drops: [{ itemId: 'wall_wood', count: 1 }], background: true },
  [TileId.WallStone]: { id: 29, name: 'Parede de pedra', solid: false, hardness: 0.5, toolTier: 1, drops: [{ itemId: 'wall_stone', count: 1 }], background: true },
};
export function isSolid(id: number): boolean { return TILE_DEFS[id]?.solid ?? false; }
export function tileDef(id: number): TileDef { return TILE_DEFS[id] ?? TILE_DEFS[TileId.Air]!; }
