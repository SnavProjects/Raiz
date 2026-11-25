import Phaser from 'phaser';
import { Palette, hexToRgb } from '../config/art/palette';
import { TileId } from '../world/tiles/tiles';
const TILE_COLORS: Record<number, string> = {
  [TileId.Grass]: Palette.vegetation.grassMid, [TileId.Dirt]: Palette.soil.dirt, [TileId.Stone]: Palette.stone.stone,
  [TileId.Sand]: Palette.soil.sand, [TileId.Wood]: Palette.wood.trunk, [TileId.Leaves]: Palette.vegetation.leafMid,
  [TileId.Water]: Palette.water.mid, [TileId.CoalOre]: '#3a3a3a', [TileId.IronOre]: '#c8a878', [TileId.GoldOre]: '#f5c542',
  [TileId.CrystalOre]: '#7ee8fa', [TileId.Obsidian]: '#2a1a3a', [TileId.Plank]: Palette.wood.plank, [TileId.Brick]: '#b05a3a',
  [TileId.Glass]: '#b8e8f0', [TileId.Torch]: '#ffb84a', [TileId.Door]: '#8b5a2b', [TileId.Bed]: '#c85a7a',
  [TileId.Chest]: '#a87840', [TileId.Snow]: '#e8f4f8', [TileId.Clay]: '#c87858', [TileId.Flower]: '#f58ac8',
  [TileId.Sapling]: '#7ec850', [TileId.Bedrock]: '#1a1a1a', [TileId.Gravel]: '#9a9a8a', [TileId.Workbench]: '#a87840',
  [TileId.Furnace]: '#6a6a6a', [TileId.WallWood]: '#8b5a2b', [TileId.WallStone]: '#7a7a7a',
};
/** Cria texturas pixel-art procedurais a partir da paleta oficial (sem assets externos). */
export function createTileTextures(scene: Phaser.Scene): void {
  for (const [idStr, color] of Object.entries(TILE_COLORS)) {
    const id = Number(idStr);
    const key = 'tile-' + id;
    if (scene.textures.exists(key)) continue;
    const tex = scene.textures.createCanvas(key, 16, 16);
    if (!tex) continue;
    const ctx = tex.getContext();
    const { r, g, b } = hexToRgb(color);
    ctx.fillStyle = color; ctx.fillRect(0, 0, 16, 16);
    // textura: pontos determinísticos por id
    let s = id * 7919 + 13;
    const rnd = (): number => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    ctx.fillStyle = `rgba(0,0,0,0.18)`;
    for (let i = 0; i < 10; i++) ctx.fillRect(Math.floor(rnd() * 15), Math.floor(rnd() * 15), 2, 2);
    ctx.fillStyle = `rgba(255,255,255,0.12)`;
    for (let i = 0; i < 6; i++) ctx.fillRect(Math.floor(rnd() * 15), Math.floor(rnd() * 15), 2, 1);
    if (id === TileId.Grass) { ctx.fillStyle = Palette.vegetation.grassLight; for (let x = 0; x < 16; x += 3) ctx.fillRect(x, 0, 1, 3); }
    if (id === TileId.Water) { ctx.fillStyle = Palette.water.foam; ctx.fillRect(0, 0, 16, 2); }
    tex.refresh();
  }
  // jogador 12x28 simplificado
  if (!scene.textures.exists('player')) {
    const tex = scene.textures.createCanvas('player', 12, 28);
    if (tex) {
      const ctx = tex.getContext();
      ctx.fillStyle = Palette.player.skin; ctx.fillRect(2, 0, 8, 8);
      ctx.fillStyle = Palette.player.hair; ctx.fillRect(2, 0, 8, 2);
      ctx.fillStyle = Palette.player.eye; ctx.fillRect(3, 4, 2, 2); ctx.fillRect(7, 4, 2, 2);
      ctx.fillStyle = Palette.player.shirt; ctx.fillRect(1, 8, 10, 10);
      ctx.fillStyle = Palette.player.pants; ctx.fillRect(2, 18, 3, 10); ctx.fillRect(7, 18, 3, 10);
      tex.refresh();
    }
  }
  if (!scene.textures.exists('entity')) {
    const tex = scene.textures.createCanvas('entity', 16, 16);
    if (tex) { const ctx = tex.getContext(); ctx.fillStyle = Palette.creature.passive; ctx.fillRect(2, 6, 12, 8); ctx.fillRect(4, 2, 6, 6); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(5, 5, 2, 2); tex.refresh(); }
  }
}
export function tileTextureKey(id: number): string { return 'tile-' + id; }
