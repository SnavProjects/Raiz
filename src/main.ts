import Phaser from 'phaser';
import { BootScene } from './engine/scenes/BootScene';
import { MenuScene } from './engine/scenes/MenuScene';
import { GameScene } from './engine/scenes/GameScene';
import { World } from './world/World';
import { Player } from './player/Player';
import { DayNightCycle } from './world/DayNightCycle';
import { EntityManager } from './entities/Entities';
import { KeyboardControls, TouchControls } from './controls/Controls';
import { UI } from './ui/UI';
import { worldStore } from './persistence/WorldStore';
import { game } from './core/Game';
import { Crafting } from './systems/crafting/Crafting';
import { itemDef } from './systems/inventory/items';
import { audio } from './audio/AudioSystem';
import { eventBus } from './core/EventBus';
import { GameConfig } from './config/GameConfig';

const root = document.getElementById('ui-root')!;
const keyboard = new KeyboardControls(); keyboard.attach();
let world: World | null = null; let player: Player | null = null;
let cycle = new DayNightCycle(); let entities: EntityManager | null = null;
let phaserGame: Phaser.Game | null = null;
let touch: TouchControls | null = null;
let currentWorldId: string | null = null;

async function saveWorld(): Promise<void> {
  if (!world || !player || !currentWorldId) return;
  const save = await worldStore.loadWorld(currentWorldId).catch(() => null);
  const meta = save?.meta ?? world.meta;
  await worldStore.saveWorld({
    meta, player: player.serialize(), time: cycle.serialize(),
    chunks: world.modifiedChunks().map(c => c.serialize()), entities: entities?.serialize() ?? [],
    version: GameConfig.saveFormatVersion, savedAt: Date.now(),
  });
  ui.toast('Mundo salvo!');
}
async function loadWorld(id: string): Promise<void> {
  ui.showLoading('Carregando...');
  const save = await worldStore.loadWorld(id);
  if (!save) { ui.toast('Mundo não encontrado'); ui.showMainMenu(); return; }
  currentWorldId = id;
  world = new World(save.meta);
  world.loadModified(save.chunks);
  player = new Player(world);
  player.deserialize(save.player);
  cycle = new DayNightCycle(); cycle.deserialize(save.time);
  entities = new EntityManager(world, save.meta.seed);
  entities.deserialize((save.entities as never[]) ?? []);
  game.applySettings({ difficulty: (save.meta.difficulty as 'normal') ?? 'normal' });
  player.survival.setDifficulty((save.meta.difficulty as 'normal') ?? 'normal');
  ui.showHUD();
  startPhaser();
}
async function createWorld(name: string, seed: string, difficulty: 'facil' | 'normal' | 'dificil'): Promise<void> {
  const id = 'w-' + Date.now().toString(36);
  const meta = { id, name, seed, createdAt: Date.now(), updatedAt: Date.now(), version: GameConfig.saveFormatVersion, generatorVersion: GameConfig.generatorVersion, difficulty };
  const initialPlayer = new Player(new World(meta)); initialPlayer.spawn();
  await worldStore.saveWorld({ meta, player: initialPlayer.serialize(), time: { timeMs: 0, day: 1 }, chunks: [], entities: [], version: 1, savedAt: Date.now() });
  await loadWorld(id);
}
function startPhaser(): void {
  if (!world || !player || !entities) return;
  if (phaserGame) { phaserGame.destroy(true); phaserGame = null; }
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch && game.settings.showTouchControls) { touch = new TouchControls(root); touch.build(); }
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, parent: 'game-container', width: window.innerWidth, height: window.innerHeight,
    backgroundColor: '#101a10', pixelArt: true, roundPixels: true,
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
    scene: [BootScene, MenuScene, GameScene],
    callbacks: { preBoot: pg => pg.registry.set('deps', { world, player, cycle, entities, keyboard, touch, onSave: () => void saveWorld().catch(reportError), onQuit: quitToMenu, onDeath: () => ui.showDeath() }) },
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  };
  phaserGame = new Phaser.Game(config);

}
function reportError(error: unknown): void {
  console.error(error); ui.toast("Não foi possível concluir a operação. Exporte um backup e tente novamente.");
}
function quitToMenu(): void {
  void saveWorld().then(() => {
    if (phaserGame) { phaserGame.destroy(true); phaserGame = null; }
    touch = null; audio.stopMusic();
    world = null; player = null; entities = null; currentWorldId = null;
    ui.showMainMenu();
  }).catch(reportError);
}
function getCrafting(): Crafting | null {
  if (!player || !world) return null;
  const stations = new Set<string>();
  for (let x = player.tileX - 4; x <= player.tileX + 4; x++) for (let y = player.tileY - 4; y <= player.tileY + 4; y++) {
    if (world.getTile(x, y) === 27) stations.add('furnace');
    if (world.getTile(x, y) === 26) stations.add('workbench');
  }
  return new Crafting(player.inventory, stations);
}
const ui = new UI(root, {
  onPlay: id => void loadWorld(id).catch(reportError),
  onCreateWorld: (name, seed, difficulty) => createWorld(name, seed, difficulty).catch(reportError),
  onSave: () => void saveWorld().catch(reportError),
  onQuit: quitToMenu,
  onRespawn: () => { player?.survival.respawn(); player?.spawn(); },
  getInventory: () => player?.inventory ?? null,
  getCrafting,
  getHealth: () => player ? player.survival.serialize() : { health: 100, hunger: 100 },
  getTimeLabel: () => `Dia ${cycle.day} • ${cycle.phase}`,
  onEat: itemId => { const def = itemDef(itemId); if (def?.food && player && player.inventory.remove(itemId, 1)) { player.survival.eat(def.food); audio.playSfx('eat'); ui.refreshHotbar(); } },
  onSelectSlot: i => { if (player) { player.inventory.selected = i; ui.refreshHotbar(); } },
  onCraft: recipeId => { if (!player) return false; const ok = getCrafting()?.craft(recipeId) ?? false; if (ok) { audio.playSfx('craft'); ui.refreshHotbar(); } return ok; },
  onSort: () => player?.inventory.sort(),
  onDiscard: i => player?.inventory.discard(i),
  onMoveSlot: (f, t) => player?.inventory.move(f, t),
  keyboard,
});
setInterval(() => { if (player) ui.refreshHotbar(); }, 200);
eventBus.on('settings-changed', () => { void worldStore.saveSettings({ settings: { ...game.settings }, bindings: keyboard.serialize() as unknown as Record<string, string> }).catch(reportError); });
eventBus.on('toast', e => { if (e.type === 'toast') ui.toast(e.message); });
window.addEventListener('keydown', e => {
  if ((e.target as HTMLElement).closest('input, select, textarea') || e.repeat) return;
  if (e.code === keyboard.bindings.pause && player) {
    if (root.querySelector('#settings')) return;
    const modal = root.querySelector('.modal-bg');
    if (modal && modal.id !== 'death-modal') modal.remove();
    else if (!modal) ui.showPause();
    return;
  }
  if (root.querySelector('.modal-bg, #settings')) return;
  if (e.code === keyboard.bindings.inventory && player) ui.showInventory();
  if (e.code === keyboard.bindings.crafting && player) ui.showCrafting();
  if (e.code.startsWith('Digit')) { const n = Number(e.code.slice(5)); if (n >= 1 && n <= 9 && player) { player.inventory.selected = n - 1; ui.refreshHotbar(); } }
});
window.addEventListener('resize', () => { if (phaserGame) phaserGame.scale.resize(window.innerWidth, window.innerHeight); });
(async () => {
  const saved = await worldStore.loadSettings().catch(() => null);
  if (saved) { game.applySettings(saved.settings as never); keyboard.deserialize(saved.bindings as never); }
  audio.setVolumes(game.settings.volumeMaster, game.settings.volumeMusic, game.settings.volumeSfx);
  ui.showMainMenu();
})();
