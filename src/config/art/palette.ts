// Paleta oficial do Raiz — cores semânticas centralizadas (ART_GUIDELINES §5)
export const TILE_SIZE = 16;
export const Palette = {
  vegetation: { grassLight: '#7ec850', grassMid: '#5aa832', grassDark: '#3d7a24', leafLight: '#8fd45e', leafMid: '#5aa832', leafDark: '#2d5a1a', flower: '#f5e642', flowerPink: '#f58ac8' },
  soil: { dirt: '#8b5a2b', dirtDark: '#6b4220', dirtLight: '#a87840', sand: '#e8d48a', sandDark: '#c8b060' },
  water: { surface: '#4ab8e8', mid: '#2a88c8', deep: '#1a5a98', foam: '#c8f0f8' },
  wood: { trunk: '#6b4220', trunkDark: '#4a2d14', plank: '#a87840', plankDark: '#8b5a2b' },
  stone: { stone: '#8a8a8a', stoneDark: '#5a5a5a', stoneLight: '#b0b0b0', coal: '#2a2a2a', iron: '#c8a878', gold: '#f5c542', crystal: '#7ee8fa', obsidian: '#2a1a3a' },
  sky: { day: '#7ec8f0', dawn: '#f0b87e', dusk: '#e8785a', night: '#1a2a4a', nightDeep: '#0a1428' },
  light: { sun: '#fff2b0', torch: '#ffb84a', glow: '#ffe88a' },
  shadow: { dark: '#0a140a', cave: '#1a1a1a', caveDeep: '#0a0a0a' },
  ui: { bg: '#101a10', panel: '#1c2b1c', panel2: '#243824', text: '#e8f0e0', accent: '#7ec850', accent2: '#f5c542', danger: '#e05252', info: '#4ab8e8', success: '#7ec850', warning: '#f5a542', disabled: '#5a6a5a', selection: '#f5c542' },
  player: { skin: '#f0c8a0', shirt: '#3a7a3a', pants: '#4a3a6a', hair: '#6b4220', eye: '#1a1a1a' },
  creature: { hostile: '#a83a3a', hostileDark: '#6a2020', passive: '#c8a878', passiveDark: '#8a6a40' },
} as const;
export type PaletteKey = keyof typeof Palette;
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
export function lerpColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a); const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t); const g = Math.round(ca.g + (cb.g - ca.g) * t); const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return '#' + [r, g, bl].map(v => v.toString(16).padStart(2, '0')).join('');
}
