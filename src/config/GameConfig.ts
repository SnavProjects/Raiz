export const GameConfig = {
  tileSize: 16,
  chunkSize: 16,
  renderDistance: 4, // chunks ao redor do jogador
  worldHeight: 200,
  gravity: 1800,
  moveSpeed: 220,
  jumpVelocity: -620,
  dayLengthMs: 240000, // 4 min por dia completo
  autosaveIntervalMs: 30000,
  maxChunksCached: 81,
  saveFormatVersion: 1,
  generatorVersion: 1,
} as const;
export type Difficulty = 'facil' | 'normal' | 'dificil';
export interface Settings {
  volumeMaster: number; volumeMusic: number; volumeSfx: number;
  uiScale: number; highContrast: boolean; reducedMotion: boolean;
  touchSize: number; touchOpacity: number; showTouchControls: boolean;
  language: string; difficulty: Difficulty; invertY: boolean;
}
export const defaultSettings: Settings = {
  volumeMaster: 0.8, volumeMusic: 0.6, volumeSfx: 0.8,
  uiScale: 1, highContrast: false, reducedMotion: false,
  touchSize: 64, touchOpacity: 0.7, showTouchControls: true,
  language: 'pt-BR', difficulty: 'normal', invertY: false,
};
export interface KeyBindings { left: string; right: string; jump: string; interact: string; mine: string; build: string; inventory: string; crafting: string; pause: string; hotbar1: string; hotbar2: string; hotbar3: string; hotbar4: string; hotbar5: string; hotbar6: string; hotbar7: string; hotbar8: string; hotbar9: string; }
export const defaultBindings: KeyBindings = {
  left: 'ArrowLeft', right: 'ArrowRight', jump: 'Space', interact: 'KeyE', mine: 'MouseLeft', build: 'MouseRight',
  inventory: 'KeyI', crafting: 'KeyC', pause: 'Escape',
  hotbar1: 'Digit1', hotbar2: 'Digit2', hotbar3: 'Digit3', hotbar4: 'Digit4', hotbar5: 'Digit5', hotbar6: 'Digit6', hotbar7: 'Digit7', hotbar8: 'Digit8', hotbar9: 'Digit9',
};
